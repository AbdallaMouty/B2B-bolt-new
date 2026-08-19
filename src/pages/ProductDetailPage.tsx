import { useEffect, useState } from 'react';
import { MapPin, Package, Minus, Tag, Building2, ArrowRight, MessageSquare, FileText } from 'lucide-react';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { VerificationBadge } from '@/components/VerificationBadge';
import { ProductCard } from '@/components/ProductCard';
import { QuoteModal } from '@/components/QuoteModal';
import { useRouter } from '@/lib/router';
import { useApp } from '@/lib/app-context';
import { supabase } from '@/lib/supabase';
import type { ProductWithCompany, ProductSpecification, ProductWithCompany as PW } from '@/lib/types';

export function ProductDetailPage() {
  const { route, navigate } = useRouter();
  const { t } = useApp();
  if (route.name !== 'product') return null;

  const [product, setProduct] = useState<ProductWithCompany | null>(null);
  const [specs, setSpecs] = useState<ProductSpecification[]>([]);
  const [moreProducts, setMoreProducts] = useState<PW[]>([]);
  const [similarProducts, setSimilarProducts] = useState<PW[]>([]);
  const [similarCompanies, setSimilarCompanies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [quoteOpen, setQuoteOpen] = useState(false);

  useEffect(() => {
    (async () => {
      setLoading(true);

      const { data: prod } = await supabase
        .from('products')
        .select('*, company:companies(*), category:categories(*)')
        .eq('slug', route.name === 'product' ? route.slug : '')
        .maybeSingle();

      if (!prod) {
        setLoading(false);
        return;
      }

      const productData = prod as unknown as ProductWithCompany;
      setProduct(productData);

      await supabase
        .from('products')
        .update({ view_count: (productData.view_count || 0) + 1 })
        .eq('id', productData.id);

      const { data: specData } = await supabase
        .from('product_specifications')
        .select('*')
        .eq('product_id', productData.id)
        .order('display_order', { ascending: true });
      setSpecs(specData || []);

      const { data: more } = await supabase
        .from('products')
        .select('*, company:companies(id, name, slug, city, verification_status, logo_url), category:categories(id, name, slug)')
        .eq('company_id', productData.company_id)
        .neq('id', productData.id)
        .limit(4);
      setMoreProducts((more || []) as PW[]);

      if (productData.category_id) {
        const { data: similar } = await supabase
          .from('products')
          .select('*, company:companies(id, name, slug, city, verification_status, logo_url), category:categories(id, name, slug)')
          .eq('category_id', productData.category_id)
          .neq('id', productData.id)
          .limit(4);
        setSimilarProducts((similar || []) as PW[]);

        const { data: companies } = await supabase
          .from('companies')
          .select('*')
          .neq('id', productData.company_id)
          .limit(4);
        setSimilarCompanies(companies || []);
      }

      setLoading(false);
    })();
  }, [route.name === 'product' ? route.slug : '']);

  if (loading) return <LoadingSpinner label={t('product.loading')} />;

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">{t('product.notFound')}</h1>
        <p className="text-gray-500 dark:text-gray-400 mb-6">{t('product.notFoundDesc')}</p>
        <button onClick={() => navigate({ name: 'products' })} className="btn-primary">
          {t('product.browseProducts')}
        </button>
      </div>
    );
  }

  const company = product.company as any;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-6 flex-wrap">
        <button onClick={() => navigate({ name: 'home' })} className="hover:text-primary-600 dark:hover:text-primary-400">{t('nav.products') === 'المنتجات' ? 'الرئيسية' : 'Home'}</button>
        <span>/</span>
        <button onClick={() => navigate({ name: 'products' })} className="hover:text-primary-600 dark:hover:text-primary-400">{t('nav.products')}</button>
        {product.category && (
          <>
            <span>/</span>
            <button onClick={() => navigate({ name: 'products', category: product.category!.slug })} className="hover:text-primary-600 dark:hover:text-primary-400">
              {product.category.name}
            </button>
          </>
        )}
        <span>/</span>
        <span className="text-gray-900 dark:text-gray-100 font-medium truncate">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Image + Details */}
        <div className="lg:col-span-2 space-y-8">
          {/* Image */}
          <div className="card overflow-hidden">
            <div className="aspect-[16/10] bg-gray-100 dark:bg-gray-800">
              {product.image_url ? (
                <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-300 dark:text-gray-600">
                  <Package className="w-16 h-16" />
                </div>
              )}
            </div>
          </div>

          {/* Description */}
          <div className="card p-6">
            <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-3">{t('product.description')}</h2>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{product.description}</p>
          </div>

          {/* Specifications */}
          {specs.length > 0 && (
            <div className="card p-6">
              <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4">{t('product.specs')}</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3">
                {specs.map((spec) => (
                  <div key={spec.id} className="flex justify-between py-2 border-b border-gray-100 dark:border-gray-800 last:border-0">
                    <span className="text-sm text-gray-500 dark:text-gray-400">{spec.spec_name}</span>
                    <span className="text-sm font-medium text-gray-900 dark:text-gray-100">{spec.spec_value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tags */}
          {product.tags.length > 0 && (
            <div className="card p-6">
              <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-3">{t('product.tags')}</h2>
              <div className="flex flex-wrap gap-2">
                {product.tags.map((tag) => (
                  <span key={tag} className="badge bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300">
                    <Tag className="w-3 h-3" />
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right: Product Info + Supplier Card */}
        <div className="space-y-6">
          {/* Product Info */}
          <div className="card p-6">
            <div className="flex items-center gap-2 mb-2">
              {product.category && <span className="badge-category">{product.category.name}</span>}
              <span className={`badge ${product.availability === 'In Stock' ? 'bg-success-50 dark:bg-success-950 text-success-700 dark:text-success-400 border border-success-200 dark:border-success-900' : 'bg-warning-50 dark:bg-warning-950 text-warning-700 dark:text-warning-400 border border-warning-200 dark:border-warning-900'}`}>
                {product.availability === 'In Stock' ? t('product.inStock') : product.availability === 'Made to Order' ? t('product.madeToOrder') : t('product.outOfStock')}
              </span>
            </div>

            <h1 className="text-xl font-bold font-display text-gray-900 dark:text-gray-100 mb-3">{product.name}</h1>

            <div className="space-y-2.5 text-sm">
              {product.min_order_quantity && (
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                  <Minus className="w-4 h-4 text-gray-400" />
                  {t('product.minOrder')}: <span className="font-medium text-gray-900 dark:text-gray-100">{product.min_order_quantity}</span>
                </div>
              )}
              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                <Package className="w-4 h-4 text-gray-400" />
                {t('product.views')}: <span className="font-medium text-gray-900 dark:text-gray-100">{product.view_count}</span>
              </div>
            </div>

            <div className="mt-5 space-y-2">
              <button onClick={() => setQuoteOpen(true)} className="btn-primary w-full">
                <FileText className="w-4 h-4" />
                {t('product.requestQuote')}
              </button>
              <button
                onClick={() => navigate({ name: 'company', slug: company.slug })}
                className="btn-secondary w-full"
              >
                <MessageSquare className="w-4 h-4" />
                {t('product.contactSupplier')}
              </button>
            </div>
          </div>

          {/* Supplier Card */}
          <div className="card p-6">
            <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-4">{t('product.supplier')}</h3>

            <button
              onClick={() => navigate({ name: 'company', slug: company.slug })}
              className="flex items-start gap-3 w-full text-left group"
            >
              <div className="w-14 h-14 rounded-lg bg-gray-100 dark:bg-gray-800 overflow-hidden shrink-0">
                {company.logo_url ? (
                  <img src={company.logo_url} alt={company.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-primary-50 dark:bg-primary-950">
                    <Building2 className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-900 dark:text-gray-100 group-hover:text-primary-700 dark:group-hover:text-primary-400 transition-colors">
                  {company.name}
                </p>
                <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                  <MapPin className="w-3.5 h-3.5" />
                  {company.city}, {company.country}
                </div>
                <div className="mt-1.5">
                  <VerificationBadge status={company.verification_status} />
                </div>
              </div>
            </button>

            {company.business_category && (
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-3 pt-3 border-t border-gray-100 dark:border-gray-800">
                {company.business_category}
              </p>
            )}

            <button
              onClick={() => navigate({ name: 'company', slug: company.slug })}
              className="btn-secondary w-full mt-4"
            >
              {t('product.viewCompany')}
              <ArrowRight className="w-4 h-4 rtl:flip" />
            </button>
          </div>
        </div>
      </div>

      {/* More Products from Supplier */}
      {moreProducts.length > 0 && (
        <section className="mt-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="section-title">{t('product.moreFromSupplier')}</h2>
            <button
              onClick={() => navigate({ name: 'company', slug: company.slug })}
              className="flex items-center gap-1 text-sm font-medium text-primary-600 dark:text-primary-400 hover:text-primary-700"
            >
              {t('home.viewAll')} <ArrowRight className="w-4 h-4 rtl:flip" />
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {moreProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}

      {/* Similar Products */}
      {similarProducts.length > 0 && (
        <section className="mt-12">
          <h2 className="section-title mb-6">{t('product.similarProducts')}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {similarProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}

      {/* Other Suppliers */}
      {similarCompanies.length > 0 && (
        <section className="mt-12">
          <h2 className="section-title mb-6">{t('product.otherSuppliers')}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {similarCompanies.map((c) => (
              <button
                key={c.id}
                onClick={() => navigate({ name: 'company', slug: c.slug })}
                className="card p-5 text-left hover:shadow-md hover:border-primary-200 dark:hover:border-primary-800 transition-all group"
              >
                <div className="w-12 h-12 rounded-lg bg-gray-100 dark:bg-gray-800 overflow-hidden mb-3">
                  {c.logo_url ? (
                    <img src={c.logo_url} alt={c.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-primary-50 dark:bg-primary-950">
                      <Building2 className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                    </div>
                  )}
                </div>
                <p className="font-semibold text-sm text-gray-900 dark:text-gray-100 group-hover:text-primary-700 dark:group-hover:text-primary-400 transition-colors">{c.name}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  {c.city}, {c.country}
                </p>
                {c.verification_status === 'verified' && (
                  <div className="mt-2">
                    <VerificationBadge status={c.verification_status} />
                  </div>
                )}
              </button>
            ))}
          </div>
        </section>
      )}

      <QuoteModal product={product} isOpen={quoteOpen} onClose={() => setQuoteOpen(false)} />
    </div>
  );
}
