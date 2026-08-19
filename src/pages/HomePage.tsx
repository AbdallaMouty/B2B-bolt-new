import { useEffect, useState } from 'react';
import { ArrowRight, TrendingUp, Building2, Package, Search, ShieldCheck, Factory } from 'lucide-react';
import { SearchBar } from '@/components/SearchBar';
import { ProductCard } from '@/components/ProductCard';
import { CompanyCard } from '@/components/CompanyCard';
import { CategoryIcon } from '@/components/CategoryIcon';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { useRouter } from '@/lib/router';
import { useApp } from '@/lib/app-context';
import { supabase } from '@/lib/supabase';
import type { Category, ProductWithCompany, CompanyWithStats } from '@/lib/types';

export function HomePage() {
  const { navigate } = useRouter();
  const { t, lang } = useApp();
  const [categories, setCategories] = useState<Category[]>([]);
  const [featuredProducts, setFeaturedProducts] = useState<ProductWithCompany[]>([]);
  const [recentProducts, setRecentProducts] = useState<ProductWithCompany[]>([]);
  const [popularCompanies, setPopularCompanies] = useState<CompanyWithStats[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const [{ data: cats }, { data: featured }, { data: recent }, { data: companies }] = await Promise.all([
        supabase.from('categories').select('*').order('name'),
        supabase
          .from('products')
          .select('*, company:companies(id, name, slug, city, verification_status, logo_url), category:categories(id, name, slug)')
          .eq('is_featured', true)
          .order('view_count', { ascending: false })
          .limit(8),
        supabase
          .from('products')
          .select('*, company:companies(id, name, slug, city, verification_status, logo_url), category:categories(id, name, slug)')
          .order('created_at', { ascending: false })
          .limit(4),
        supabase
          .from('companies')
          .select('*')
          .order('is_featured', { ascending: false })
          .limit(6),
      ]);

      setCategories(cats || []);
      setFeaturedProducts((featured || []) as ProductWithCompany[]);
      setRecentProducts((recent || []) as ProductWithCompany[]);

      const companyList = (companies || []) as CompanyWithStats[];
      if (companyList.length > 0) {
        const companyIds = companyList.map((c) => c.id);
        const counts: Record<string, number> = {};
        const { data: countData } = await supabase
          .from('products')
          .select('company_id')
          .in('company_id', companyIds);
        if (countData) {
          countData.forEach((row: { company_id: string }) => {
            counts[row.company_id] = (counts[row.company_id] || 0) + 1;
          });
        }
        setPopularCompanies(companyList.map((c) => ({ ...c, product_count: counts[c.id] || 0 })));
      }

      setLoading(false);
    })();
  }, []);

  if (loading) return <LoadingSpinner label={t('common.loadingMarketplace')} />;

  const popularTerms = lang === 'ar'
    ? ['آلة تغليف', 'عوارض فولاذية', 'معالجة أغذية', 'حقن بلاستيك']
    : ['packaging machine', 'steel beams', 'food processing', 'injection molding'];

  const stats = [
    { icon: Package, label: t('home.stats.products'), value: '17+' },
    { icon: Building2, label: t('home.stats.suppliers'), value: '5+' },
    { icon: Factory, label: t('home.stats.categories'), value: '10' },
    { icon: TrendingUp, label: t('home.stats.inquiries'), value: '50+' },
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-primary-950 dark:from-black dark:via-gray-950 dark:to-primary-950 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: 'url(https://images.pexels.com/photos/2760286/pexels-photo-2760286.jpeg?auto=compress&cs=tinysrgb&h=650&w=940)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }} />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-6">
              <ShieldCheck className="w-4 h-4 text-accent-400" />
              <span className="text-sm font-medium text-gray-100">{t('home.badge')}</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold font-display leading-tight mb-4">
              {t('home.title')}
            </h1>
            <p className="text-lg text-gray-300 mb-8 max-w-2xl leading-relaxed">
              {t('home.subtitle')}
            </p>

            <div className="mb-6">
              <SearchBar large />
            </div>

            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-300">
              <span className="font-medium">{t('home.popular')}</span>
              {popularTerms.map((term) => (
                <button
                  key={term}
                  onClick={() => navigate({ name: 'products', search: term })}
                  className="px-3 py-1 rounded-full bg-white/10 hover:bg-white/20 border border-white/10 transition-colors"
                >
                  {term}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="bg-white dark:bg-gray-950 border-b border-gray-200 dark:border-gray-800 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat) => (
              <div key={stat.label} className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary-50 dark:bg-primary-950 flex items-center justify-center">
                  <stat.icon className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                </div>
                <div>
                  <p className="text-lg font-bold text-gray-900 dark:text-gray-100">{stat.value}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{stat.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="section-title">{t('home.browseCategories')}</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{t('home.browseCategoriesSub')}</p>
          </div>
          <button
            onClick={() => navigate({ name: 'products' })}
            className="hidden sm:flex items-center gap-1 text-sm font-medium text-primary-600 dark:text-primary-400 hover:text-primary-700"
          >
            {t('home.viewAll')} <ArrowRight className="w-4 h-4 rtl:flip" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => navigate({ name: 'products', category: cat.slug })}
              className="card p-5 text-center hover:shadow-md hover:border-primary-200 dark:hover:border-primary-800 transition-all group"
            >
              <div className="w-12 h-12 rounded-xl bg-primary-50 dark:bg-primary-950 flex items-center justify-center mx-auto mb-3 group-hover:bg-primary-100 dark:group-hover:bg-primary-900 transition-colors">
                <CategoryIcon name={cat.icon || 'Boxes'} className="w-6 h-6 text-primary-600 dark:text-primary-400" />
              </div>
              <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 group-hover:text-primary-700 dark:group-hover:text-primary-400 transition-colors">
                {cat.name}
              </p>
            </button>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="bg-white dark:bg-gray-950 border-y border-gray-200 dark:border-gray-800 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="section-title">{t('home.featured')}</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{t('home.featuredSub')}</p>
            </div>
            <button
              onClick={() => navigate({ name: 'products' })}
              className="hidden sm:flex items-center gap-1 text-sm font-medium text-primary-600 dark:text-primary-400 hover:text-primary-700"
            >
              {t('home.viewAll')} <ArrowRight className="w-4 h-4 rtl:flip" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Popular Suppliers */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="section-title">{t('home.popularSuppliers')}</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{t('home.popularSuppliersSub')}</p>
          </div>
          <button
            onClick={() => navigate({ name: 'companies' })}
            className="hidden sm:flex items-center gap-1 text-sm font-medium text-primary-600 dark:text-primary-400 hover:text-primary-700"
          >
            {t('home.viewAll')} <ArrowRight className="w-4 h-4 rtl:flip" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {popularCompanies.map((company) => (
            <CompanyCard key={company.id} company={company} />
          ))}
        </div>
      </section>

      {/* Recently Added */}
      <section className="bg-white dark:bg-gray-950 border-y border-gray-200 dark:border-gray-800 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <h2 className="section-title mb-8">{t('home.recent')}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {recentProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-gradient-to-br from-primary-600 to-primary-800 rounded-2xl p-8 lg:p-12 text-white text-center overflow-hidden relative">
          <div className="absolute inset-0 opacity-10" style={{
            backgroundImage: 'url(https://images.pexels.com/photos/14804699/pexels-photo-14804699.jpeg?auto=compress&cs=tinysrgb&h=650&w=940)',
            backgroundSize: 'cover',
          }} />
          <div className="relative">
            <h2 className="text-3xl font-bold font-display mb-3">{t('home.ctaTitle')}</h2>
            <p className="text-primary-100 max-w-xl mx-auto mb-6">
              {t('home.ctaBody')}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={() => navigate({ name: 'supplier-register' })}
                className="btn bg-white text-primary-700 hover:bg-gray-100 px-6 py-3"
              >
                {t('home.ctaJoin')}
              </button>
              <button
                onClick={() => navigate({ name: 'products' })}
                className="btn bg-primary-500/30 text-white border border-white/30 hover:bg-primary-500/40 px-6 py-3"
              >
                {t('home.ctaBrowse')}
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
