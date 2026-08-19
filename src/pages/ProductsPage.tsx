import { useEffect, useState, useMemo } from 'react';
import { SlidersHorizontal, X, Package, ChevronDown } from 'lucide-react';
import { ProductCard } from '@/components/ProductCard';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { EmptyState } from '@/components/EmptyState';
import { CategoryIcon } from '@/components/CategoryIcon';
import { useRouter, type Route } from '@/lib/router';
import { useApp } from '@/lib/app-context';
import { supabase } from '@/lib/supabase';
import type { Category, ProductWithCompany } from '@/lib/types';

export function ProductsPage() {
  const { route, navigate } = useRouter();
  const { t } = useApp();
  if (route.name !== 'products') return null;

  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<ProductWithCompany[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);

  const search = route.search;
  const selectedCategory = route.category;
  const selectedLocation = route.location;
  const sortBy = route.sort || 'relevance';

  const locations = useMemo(() => {
    const cities = new Set<string>();
    products.forEach((p) => {
      if (p.company.city) cities.add(p.company.city);
    });
    return Array.from(cities).sort();
  }, [products]);

  useEffect(() => {
    (async () => {
      const { data: cats } = await supabase.from('categories').select('*').order('name');
      setCategories(cats || []);
    })();
  }, []);

  useEffect(() => {
    (async () => {
      setLoading(true);
      let query = supabase
        .from('products')
        .select('*, company:companies(id, name, slug, city, verification_status, logo_url), category:categories(id, name, slug)');

      if (search) {
        query = query.or(`name.ilike.%${search}%,description.ilike.%${search}%,tags.cs.{${search}}`);
      }
      if (selectedCategory) {
        query = query.eq('category_id', (await supabase.from('categories').select('id').eq('slug', selectedCategory).maybeSingle()).data?.id);
      }

      switch (sortBy) {
        case 'newest':
          query = query.order('created_at', { ascending: false });
          break;
        case 'popular':
          query = query.order('view_count', { ascending: false });
          break;
        case 'name':
          query = query.order('name', { ascending: true });
          break;
        default:
          query = query.order('is_featured', { ascending: false }).order('view_count', { ascending: false });
      }

      const { data } = await query;
      let results = (data || []) as ProductWithCompany[];

      if (selectedLocation) {
        results = results.filter((p) => p.company.city === selectedLocation);
      }

      setProducts(results);
      setLoading(false);
    })();
  }, [search, selectedCategory, selectedLocation, sortBy]);

  const updateRoute = (updates: Partial<Route>) => {
    if (route.name !== 'products') return;
    navigate({
      name: 'products',
      search: 'search' in updates ? updates.search : search,
      category: 'category' in updates ? updates.category : selectedCategory,
      location: 'location' in updates ? updates.location : selectedLocation,
      sort: 'sort' in updates ? updates.sort : sortBy,
    });
  };

  const clearFilters = () => navigate({ name: 'products' });
  const hasActiveFilters = search || selectedCategory || selectedLocation;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold font-display text-gray-900 dark:text-gray-100">
          {search ? `${t('products.results').split(' ')[0]} "${search}"` : t('products.allProducts')}
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          {loading ? t('products.searching') : `${products.length} ${products.length === 1 ? t('products.productFound') : t('products.results')}`}
        </p>
      </div>

      <div className="flex gap-6">
        {/* Sidebar Filters - Desktop */}
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

            {/* Category Filter */}
            <div className="mb-6">
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">{t('products.category')}</p>
              <div className="space-y-1.5">
                <button
                  onClick={() => updateRoute({ category: undefined })}
                  className={`w-full text-left px-3 py-1.5 rounded-lg text-sm transition-colors ${
                    !selectedCategory ? 'bg-primary-50 dark:bg-primary-950 text-primary-700 dark:text-primary-300 font-medium' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
                  }`}
                >
                  {t('products.allCategories')}
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => updateRoute({ category: cat.slug })}
                    className={`w-full text-left px-3 py-1.5 rounded-lg text-sm transition-colors flex items-center gap-2 ${
                      selectedCategory === cat.slug ? 'bg-primary-50 dark:bg-primary-950 text-primary-700 dark:text-primary-300 font-medium' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
                    }`}
                  >
                    <CategoryIcon name={cat.icon || 'Boxes'} className="w-4 h-4" />
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Location Filter */}
            {locations.length > 0 && (
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
            )}
          </div>
        </aside>

        {/* Main Content */}
        <div className="flex-1 min-w-0">
          {/* Sort Bar */}
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="lg:hidden btn-secondary"
            >
              <SlidersHorizontal className="w-4 h-4" />
              {t('products.filters')}
            </button>

            <div className="flex items-center gap-2 ml-auto rtl:ml-0 rtl:mr-auto">
              <span className="text-sm text-gray-500 dark:text-gray-400 hidden sm:block">{t('products.sortBy')}</span>
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => updateRoute({ sort: e.target.value })}
                  className="appearance-none pl-3 pr-8 py-2 rounded-lg border border-gray-300 bg-white dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100 text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500 cursor-pointer"
                >
                  <option value="relevance">{t('products.sort.relevance')}</option>
                  <option value="newest">{t('products.sort.newest')}</option>
                  <option value="popular">{t('products.sort.popular')}</option>
                  <option value="name">{t('products.sort.name')}</option>
                </select>
                <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none rtl:right-auto rtl:left-2" />
              </div>
            </div>
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
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{t('products.category')}</p>
                  <select
                    value={selectedCategory || ''}
                    onChange={(e) => updateRoute({ category: e.target.value || undefined })}
                    className="input"
                  >
                    <option value="">{t('products.allCategories')}</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.slug}>{cat.name}</option>
                    ))}
                  </select>
                </div>
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

          {/* Products Grid */}
          {loading ? (
            <LoadingSpinner label={t('products.loading')} />
          ) : products.length === 0 ? (
            <EmptyState
              icon={Package}
              title={t('products.noResults')}
              description={hasActiveFilters ? t('products.noResultsDesc') : undefined}
              action={hasActiveFilters ? { label: t('products.clearFilters'), onClick: clearFilters } : undefined}
            />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
