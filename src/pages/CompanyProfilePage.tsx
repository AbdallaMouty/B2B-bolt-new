import { useEffect, useState } from 'react';
import { Building2, MapPin, Globe, Phone, Mail, Calendar, Users, Package } from 'lucide-react';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { VerificationBadge } from '@/components/VerificationBadge';
import { ProductCard } from '@/components/ProductCard';
import { EmptyState } from '@/components/EmptyState';
import { useRouter } from '@/lib/router';
import { useApp } from '@/lib/app-context';
import { supabase } from '@/lib/supabase';
import type { Company, Category, ProductWithCompany } from '@/lib/types';

export function CompanyProfilePage() {
  const { route, navigate } = useRouter();
  const { t } = useApp();
  if (route.name !== 'company') return null;

  const [company, setCompany] = useState<Company | null>(null);
  const [products, setProducts] = useState<ProductWithCompany[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterCategory, setFilterCategory] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  useEffect(() => {
    (async () => {
      setLoading(true);
      const slug = route.name === 'company' ? route.slug : '';

      const { data: comp } = await supabase
        .from('companies')
        .select('*')
        .eq('slug', slug)
        .maybeSingle();

      if (!comp) {
        setLoading(false);
        return;
      }

      setCompany(comp as Company);

      const { data: prods } = await supabase
        .from('products')
        .select('*, company:companies(id, name, slug, city, verification_status, logo_url), category:categories(id, name, slug)')
        .eq('company_id', comp.id)
        .order('is_featured', { ascending: false })
        .order('view_count', { ascending: false });

      setProducts((prods || []) as ProductWithCompany[]);

      const catMap = new Map<string, Category>();
      (prods || []).forEach((p: any) => {
        if (p.category) catMap.set(p.category.id, p.category);
      });
      setCategories(Array.from(catMap.values()));

      setLoading(false);
    })();
  }, [route.name === 'company' ? route.slug : '']);

  if (loading) return <LoadingSpinner label={t('company.loading')} />;

  if (!company) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">{t('company.notFound')}</h1>
        <p className="text-gray-500 dark:text-gray-400 mb-6">{t('company.notFoundDesc')}</p>
        <button onClick={() => navigate({ name: 'companies' })} className="btn-primary">
          {t('company.browseCompanies')}
        </button>
      </div>
    );
  }

  const filteredProducts = products.filter((p) => {
    if (filterCategory && p.category?.slug !== filterCategory) return false;
    if (search && !p.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-6">
        <button onClick={() => navigate({ name: 'home' })} className="hover:text-primary-600 dark:hover:text-primary-400">{t('nav.products') === 'المنتجات' ? 'الرئيسية' : 'Home'}</button>
        <span>/</span>
        <button onClick={() => navigate({ name: 'companies' })} className="hover:text-primary-600 dark:hover:text-primary-400">{t('nav.companies')}</button>
        <span>/</span>
        <span className="text-gray-900 dark:text-gray-100 font-medium">{company.name}</span>
      </nav>

      {/* Company Header */}
      <div className="card p-6 lg:p-8 mb-8">
        <div className="flex flex-col sm:flex-row items-start gap-6">
          <div className="w-24 h-24 rounded-xl bg-gray-100 dark:bg-gray-800 overflow-hidden shrink-0">
            {company.logo_url ? (
              <img src={company.logo_url} alt={company.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-primary-50 dark:bg-primary-950">
                <Building2 className="w-10 h-10 text-primary-600 dark:text-primary-400" />
              </div>
            )}
          </div>

          <div className="flex-1">
            <div className="flex items-start gap-2 flex-wrap mb-2">
              <h1 className="text-2xl font-bold font-display text-gray-900 dark:text-gray-100">{company.name}</h1>
              <VerificationBadge status={company.verification_status} size="md" />
            </div>

            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mb-3">
              <span className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                {company.city}, {company.country}
              </span>
              {company.business_category && (
                <span className="badge-category">{company.business_category}</span>
              )}
            </div>

            <p className="text-gray-600 dark:text-gray-300 leading-relaxed max-w-3xl">{company.description}</p>

            <div className="flex flex-wrap gap-4 mt-4 pt-4 border-t border-gray-100 dark:border-gray-800">
              {company.year_established && (
                <span className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400">
                  <Calendar className="w-4 h-4" />
                  {t('company.established')} {company.year_established}
                </span>
              )}
              {company.company_size && (
                <span className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400">
                  <Users className="w-4 h-4" />
                  {company.company_size} {t('company.employees')}
                </span>
              )}
              {company.website && (
                <a href={`https://${company.website}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700">
                  <Globe className="w-4 h-4" />
                  {company.website}
                </a>
              )}
              {company.phone && (
                <span className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400">
                  <Phone className="w-4 h-4" />
                  {company.phone}
                </span>
              )}
              {company.email && (
                <span className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400">
                  <Mail className="w-4 h-4" />
                  {company.email}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Products Section */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
          <div>
            <h2 className="section-title">{t('company.products')}</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{filteredProducts.length} {t('common.products')}</p>
          </div>

          <div className="flex items-center gap-3">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t('company.searchProducts')}
              className="input max-w-xs"
            />
          </div>
        </div>

        {/* Category Tabs */}
        {categories.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-5">
            <button
              onClick={() => setFilterCategory(null)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                !filterCategory ? 'bg-primary-600 text-white' : 'bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
              }`}
            >
              {t('company.allProducts')}
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setFilterCategory(cat.slug)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  filterCategory === cat.slug ? 'bg-primary-600 text-white' : 'bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        )}

        {filteredProducts.length === 0 ? (
          <EmptyState
            icon={Package}
            title={t('products.noResults')}
            description={search || filterCategory ? t('products.noResultsDesc') : undefined}
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filteredProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
