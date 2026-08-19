import { useEffect, useState } from 'react';
import {
  ArrowRight, TrendingUp, Building2, Package, ShieldCheck, Factory,
  Search, BadgeCheck, FileText, Headphones, Sparkles, PackageSearch, Handshake,
} from 'lucide-react';
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

  const trustFeatures = [
    { icon: BadgeCheck, title: t('home.trust.verified'), desc: t('home.trust.verifiedDesc') },
    { icon: FileText, title: t('home.trust.rfq'), desc: t('home.trust.rfqDesc') },
    { icon: Factory, title: t('home.trust.local'), desc: t('home.trust.localDesc') },
    { icon: Headphones, title: t('home.trust.support'), desc: t('home.trust.supportDesc') },
  ];

  const howSteps = [
    { icon: PackageSearch, title: t('home.how.search'), desc: t('home.how.searchDesc') },
    { icon: Handshake, title: t('home.how.contact'), desc: t('home.how.contactDesc') },
    { icon: TrendingUp, title: t('home.how.source'), desc: t('home.how.sourceDesc') },
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="relative hero-gradient text-white overflow-hidden">
        <div className="absolute inset-0 industrial-grid" />
        <div className="absolute inset-0 opacity-15" style={{
          backgroundImage: 'url(https://images.pexels.com/photos/2760286/pexels-photo-2760286.jpeg?auto=compress&cs=tinysrgb&h=650&w=940)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }} />
        <div className="absolute bottom-0 left-0 right-0 h-1 accent-bar" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-6">
              <ShieldCheck className="w-4 h-4 text-accent-400" />
              <span className="text-sm font-medium text-slate-100">{t('home.badge')}</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold font-display leading-tight mb-4">
              {t('home.title')}
            </h1>
            <p className="text-lg text-slate-300 mb-8 max-w-2xl leading-relaxed">
              {t('home.subtitle')}
            </p>

            <div className="mb-6">
              <SearchBar large />
            </div>

            <div className="flex flex-wrap items-center gap-3 text-sm text-slate-300">
              <span className="font-medium">{t('home.popular')}</span>
              {popularTerms.map((term) => (
                <button
                  key={term}
                  onClick={() => navigate({ name: 'products', search: term })}
                  className="px-3 py-1 rounded-full bg-white/10 hover:bg-accent-500/80 border border-white/10 transition-colors"
                >
                  {term}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat) => (
              <div key={stat.label} className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg bg-primary-50 dark:bg-primary-950 flex items-center justify-center border border-primary-100 dark:border-primary-900">
                  <stat.icon className="w-5 h-5 text-primary-700 dark:text-primary-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">{stat.value}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">{stat.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Features */}
      <section className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
          <div className="text-center mb-10">
            <h2 className="section-title">{t('home.trust.title')}</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {trustFeatures.map((feat) => (
              <div key={feat.title} className="card p-6 text-center hover:shadow-md transition-shadow">
                <div className="w-14 h-14 rounded-xl bg-accent-50 dark:bg-accent-950 flex items-center justify-center mx-auto mb-4 border border-accent-100 dark:border-accent-900">
                  <feat.icon className="w-7 h-7 text-accent-600 dark:text-accent-400" />
                </div>
                <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-1.5">{feat.title}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{feat.desc}</p>
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
            <p className="section-sub">{t('home.browseCategoriesSub')}</p>
          </div>
          <button
            onClick={() => navigate({ name: 'products' })}
            className="hidden sm:flex items-center gap-1 text-sm font-semibold text-primary-700 dark:text-primary-400 hover:text-primary-800"
          >
            {t('home.viewAll')} <ArrowRight className="w-4 h-4 rtl:flip" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => navigate({ name: 'products', category: cat.slug })}
              className="card-hover p-5 text-center group"
            >
              <div className="w-14 h-14 rounded-xl bg-primary-50 dark:bg-primary-950 flex items-center justify-center mx-auto mb-3 group-hover:bg-primary-700 group-hover:scale-110 transition-all duration-200">
                <CategoryIcon name={cat.icon || 'Boxes'} className="w-7 h-7 text-primary-700 dark:text-primary-400 group-hover:text-white transition-colors" />
              </div>
              <p className="text-sm font-semibold text-slate-900 dark:text-slate-100 group-hover:text-primary-700 dark:group-hover:text-primary-400 transition-colors">
                {cat.name}
              </p>
            </button>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="bg-white dark:bg-slate-950 border-y border-slate-200 dark:border-slate-800 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="flex items-center justify-between mb-8">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Sparkles className="w-5 h-5 text-accent-500" />
                <h2 className="section-title">{t('home.featured')}</h2>
              </div>
              <p className="section-sub">{t('home.featuredSub')}</p>
            </div>
            <button
              onClick={() => navigate({ name: 'products' })}
              className="hidden sm:flex items-center gap-1 text-sm font-semibold text-primary-700 dark:text-primary-400 hover:text-primary-800"
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

      {/* How It Works */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-10">
          <h2 className="section-title">{t('home.howItWorks')}</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {howSteps.map((step, i) => (
            <div key={step.title} className="card p-7 relative">
              <div className="absolute top-5 right-5 rtl:right-auto rtl:left-5 text-5xl font-bold font-display text-slate-100 dark:text-slate-800 select-none">
                {i + 1}
              </div>
              <div className="relative">
                <div className="w-14 h-14 rounded-xl bg-primary-700 flex items-center justify-center mb-4">
                  <step.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="font-semibold text-lg text-slate-900 dark:text-slate-100 mb-2">{step.title}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Suppliers */}
      <section className="bg-white dark:bg-slate-950 border-y border-slate-200 dark:border-slate-800 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="section-title">{t('home.popularSuppliers')}</h2>
              <p className="section-sub">{t('home.popularSuppliersSub')}</p>
            </div>
            <button
              onClick={() => navigate({ name: 'companies' })}
              className="hidden sm:flex items-center gap-1 text-sm font-semibold text-primary-700 dark:text-primary-400 hover:text-primary-800"
            >
              {t('home.viewAll')} <ArrowRight className="w-4 h-4 rtl:flip" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {popularCompanies.map((company) => (
              <CompanyCard key={company.id} company={company} />
            ))}
          </div>
        </div>
      </section>

      {/* Recently Added */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="section-title mb-8">{t('home.recent')}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {recentProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="hero-gradient rounded-2xl p-8 lg:p-12 text-white text-center overflow-hidden relative">
          <div className="absolute inset-0 industrial-grid" />
          <div className="absolute bottom-0 left-0 right-0 h-1 accent-bar" />
          <div className="relative">
            <h2 className="text-3xl font-bold font-display mb-3">{t('home.ctaTitle')}</h2>
            <p className="text-slate-300 max-w-xl mx-auto mb-6">
              {t('home.ctaBody')}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={() => navigate({ name: 'supplier-register' })}
                className="btn bg-accent-500 text-white hover:bg-accent-600 px-6 py-3 shadow-lg"
              >
                {t('home.ctaJoin')}
              </button>
              <button
                onClick={() => navigate({ name: 'products' })}
                className="btn bg-white/10 text-white border border-white/30 hover:bg-white/20 px-6 py-3"
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
