import { useEffect, useState, useMemo } from 'react';
import { SlidersHorizontal, Building2, ChevronDown, X } from 'lucide-react';
import { CompanyCard } from '@/components/CompanyCard';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { EmptyState } from '@/components/EmptyState';
import { useRouter } from '@/lib/router';
import { useApp } from '@/lib/app-context';
import { supabase } from '@/lib/supabase';
import type { CompanyWithStats } from '@/lib/types';

export function CompaniesPage() {
  const { route, navigate } = useRouter();
  const { t } = useApp();
  if (route.name !== 'companies') return null;

  const [companies, setCompanies] = useState<CompanyWithStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);

  const search = route.search;
  const selectedLocation = route.location;

  const locations = useMemo(() => {
    const cities = new Set<string>();
    companies.forEach((c) => {
      if (c.city) cities.add(c.city);
    });
    return Array.from(cities).sort();
  }, [companies]);

  useEffect(() => {
    (async () => {
      setLoading(true);
      let query = supabase.from('companies').select('*');

      if (search) {
        query = query.or(`name.ilike.%${search}%,description.ilike.%${search}%,business_category.ilike.%${search}%`);
      }

      query = query.order('is_featured', { ascending: false }).order('name', { ascending: true });

      const { data } = await query;
      let results = (data || []) as CompanyWithStats[];

      if (selectedLocation) {
        results = results.filter((c) => c.city === selectedLocation);
      }

      if (results.length > 0) {
        const companyIds = results.map((c) => c.id);
        const { data: countData } = await supabase
          .from('products')
          .select('company_id')
          .in('company_id', companyIds);
        const counts: Record<string, number> = {};
        if (countData) {
          countData.forEach((row: { company_id: string }) => {
            counts[row.company_id] = (counts[row.company_id] || 0) + 1;
          });
        }
        results = results.map((c) => ({ ...c, product_count: counts[c.id] || 0 }));
      }

      setCompanies(results);
      setLoading(false);
    })();
  }, [search, selectedLocation]);

  const updateRoute = (updates: { search?: string; location?: string }) => {
    navigate({
      name: 'companies',
      search: 'search' in updates ? updates.search : search,
      location: 'location' in updates ? updates.location : selectedLocation,
    });
  };

  const clearFilters = () => navigate({ name: 'companies' });
  const hasActiveFilters = search || selectedLocation;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold font-display text-gray-900 dark:text-gray-100">
          {search ? `"${search}"` : t('companies.allCompanies')}
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          {loading ? t('companies.loading') : `${companies.length} ${companies.length === 1 ? t('companies.companyFound') : t('companies.companiesFound')}`}
        </p>
      </div>

      <div className="flex gap-6">
        {/* Sidebar - Desktop */}
        <aside className="hidden lg:block w-64 shrink-0">
          <div className="card p-5 sticky top-20">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900 dark:text-gray-100">{t('products.filters')}</h3>
              {hasActiveFilters && (
                <button onClick={clearFilters} className="text-xs text-primary-600 dark:text-primary-400 hover:text-primary-700 font-medium">
                  {t('products.clearAll')}
                </button>
              )}
            </div>

            <div className="mb-6">
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">{t('products.location')}</p>
              <div className="space-y-1.5">
                <button
                  onClick={() => updateRoute({ location: undefined })}
                  className={`w-full text-left px-3 py-1.5 rounded-lg text-sm transition-colors ${
                    !selectedLocation ? 'bg-primary-50 dark:bg-primary-950 text-primary-700 dark:text-primary-300 font-medium' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
                  }`}
                >
                  {t('products.allLocations')}
                </button>
                {locations.map((loc) => (
                  <button
                    key={loc}
                    onClick={() => updateRoute({ location: loc })}
                    className={`w-full text-left px-3 py-1.5 rounded-lg text-sm transition-colors ${
                      selectedLocation === loc ? 'bg-primary-50 dark:bg-primary-950 text-primary-700 dark:text-primary-300 font-medium' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
                    }`}
                  >
                    {loc}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">{t('companies.verification')}</p>
              <label className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300 cursor-pointer">
                <input type="checkbox" className="rounded border-gray-300 text-primary-600 focus:ring-primary-500" />
                {t('companies.verifiedOnly')}
              </label>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="lg:hidden btn-secondary"
            >
              <SlidersHorizontal className="w-4 h-4" />
              {t('products.filters')}
            </button>
          </div>

          {/* Mobile Filters */}
          {showFilters && (
            <div className="lg:hidden mb-4 card p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900 dark:text-gray-100">{t('products.filters')}</h3>
                <button onClick={() => setShowFilters(false)} className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{t('products.location')}</p>
                  <select
                    value={selectedLocation || ''}
                    onChange={(e) => updateRoute({ location: e.target.value || undefined })}
                    className="input"
                  >
                    <option value="">{t('products.allLocations')}</option>
                    {locations.map((loc) => (
                      <option key={loc} value={loc}>{loc}</option>
                    ))}
                  </select>
                </div>
                {hasActiveFilters && (
                  <button onClick={clearFilters} className="btn-secondary w-full">
                    {t('products.clearAll')}
                  </button>
                )}
              </div>
            </div>
          )}

          {loading ? (
            <LoadingSpinner label={t('companies.loadingCompanies')} />
          ) : companies.length === 0 ? (
            <EmptyState
              icon={Building2}
              title={t('companies.noResults')}
              description={hasActiveFilters ? t('companies.noResultsDesc') : undefined}
              action={hasActiveFilters ? { label: t('products.clearFilters'), onClick: clearFilters } : undefined}
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {companies.map((c) => (
                <CompanyCard key={c.id} company={c} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
