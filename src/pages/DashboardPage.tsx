import { useEffect, useState } from 'react';
import {
  LayoutDashboard, Package, PlusCircle, Building2, MessageSquare,
  FileText, BarChart3, Settings, Eye, Mail, TrendingUp,
  Trash2, AlertCircle, CheckCircle2, Clock
} from 'lucide-react';
import { useAuth } from '@/lib/auth';
import { useRouter, type Route } from '@/lib/router';
import { useApp } from '@/lib/app-context';
import { supabase } from '@/lib/supabase';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { EmptyState } from '@/components/EmptyState';
import { VerificationBadge } from '@/components/VerificationBadge';
import { timeAgo, slugify } from '@/lib/utils';
import type { Product, InquiryWithDetails } from '@/lib/types';

type DashboardView = 'overview' | 'products' | 'add-product' | 'profile' | 'messages' | 'inquiries' | 'analytics' | 'settings';

export function DashboardPage() {
  const { route, navigate } = useRouter();
  const { t } = useApp();
  const { user, company, loading: authLoading, signOut, refreshCompany } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [inquiries, setInquiries] = useState<InquiryWithDetails[]>([]);
  const [loading, setLoading] = useState(true);

  const viewMap: Record<string, DashboardView> = {
    'dashboard': 'overview',
    'dashboard-products': 'products',
    'dashboard-add-product': 'add-product',
    'dashboard-profile': 'profile',
    'dashboard-messages': 'messages',
    'dashboard-inquiries': 'inquiries',
    'dashboard-analytics': 'analytics',
    'dashboard-settings': 'settings',
  };

  const currentView = route.name in viewMap ? viewMap[route.name] : 'overview';

  useEffect(() => {
    if (!authLoading && !user) {
      navigate({ name: 'login' });
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (!company) return;
    (async () => {
      setLoading(true);
      const [{ data: prods }, { data: inqs }] = await Promise.all([
        supabase.from('products').select('*').eq('company_id', company.id).order('created_at', { ascending: false }),
        supabase
          .from('inquiries')
          .select('*, product:products(id, name, slug, image_url), company:companies(id, name, slug)')
          .eq('company_id', company.id)
          .order('created_at', { ascending: false }),
      ]);
      setProducts(prods || []);
      setInquiries((inqs || []) as InquiryWithDetails[]);
      setLoading(false);
    })();
  }, [company]);

  if (authLoading || loading) return <LoadingSpinner label={t('dash.dashboard')} />;

  if (!user) return null;

  if (!company) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <div className="w-16 h-16 rounded-full bg-primary-50 dark:bg-primary-950 flex items-center justify-center mx-auto mb-4">
          <Building2 className="w-8 h-8 text-primary-600 dark:text-primary-400" />
        </div>
        <h1 className="text-2xl font-bold font-display text-gray-900 dark:text-gray-100 mb-2">{t('dash.createProfileFirst')}</h1>
        <p className="text-gray-500 dark:text-gray-400 mb-6">{t('dash.createProfileFirstDesc')}</p>
        <button onClick={() => navigate({ name: 'supplier-register' })} className="btn-primary">
          {t('dash.createProfileFirst')}
        </button>
      </div>
    );
  }

  const navItems: { view: DashboardView; label: string; icon: typeof LayoutDashboard; route: Route }[] = [
    { view: 'overview', label: t('dash.dashboard'), icon: LayoutDashboard, route: { name: 'dashboard' } },
    { view: 'products', label: t('dash.products'), icon: Package, route: { name: 'dashboard-products' } },
    { view: 'add-product', label: t('dash.addProduct'), icon: PlusCircle, route: { name: 'dashboard-add-product' } },
    { view: 'profile', label: t('dash.companyProfile'), icon: Building2, route: { name: 'dashboard-profile' } },
    { view: 'inquiries', label: t('dash.quoteRequestsTitle'), icon: FileText, route: { name: 'dashboard-inquiries' } },
    { view: 'messages', label: t('dash.messages'), icon: MessageSquare, route: { name: 'dashboard-messages' } },
    { view: 'analytics', label: t('dash.analytics'), icon: BarChart3, route: { name: 'dashboard-analytics' } },
    { view: 'settings', label: t('dash.settings'), icon: Settings, route: { name: 'dashboard-settings' } },
  ];

  const totalViews = products.reduce((sum, p) => sum + (p.view_count || 0), 0);
  const pendingInquiries = inquiries.filter((i) => i.status === 'pending').length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex gap-6">
        {/* Sidebar */}
        <aside className="hidden lg:block w-56 shrink-0">
          <div className="card p-4 sticky top-20">
            <div className="px-2 py-3 mb-2 border-b border-gray-100 dark:border-gray-800">
              <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate">{company.name}</p>
              <div className="mt-1">
                <VerificationBadge status={company.verification_status} />
              </div>
            </div>
            <nav className="space-y-1">
              {navItems.map((item) => (
                <button
                  key={item.view}
                  onClick={() => navigate(item.route)}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    currentView === item.view
                      ? 'bg-primary-50 dark:bg-primary-950 text-primary-700 dark:text-primary-300'
                      : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
                  }`}
                >
                  <item.icon className="w-4 h-4" />
                  {item.label}
                  {item.view === 'inquiries' && pendingInquiries > 0 && (
                    <span className="ml-auto px-1.5 py-0.5 rounded-full bg-accent-500 text-white text-xs font-bold">
                      {pendingInquiries}
                    </span>
                  )}
                </button>
              ))}
            </nav>
            <button
              onClick={async () => { await signOut(); navigate({ name: 'home' }); }}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 mt-2 pt-3 border-t border-gray-100 dark:border-gray-800"
            >
              <Building2 className="w-4 h-4" />
              {t('nav.signOut')}
            </button>
          </div>
        </aside>

        {/* Mobile Nav */}
        <div className="lg:hidden mb-4 w-full">
          <select
            value={currentView}
            onChange={(e) => {
              const item = navItems.find((n) => n.view === e.target.value as DashboardView);
              if (item) navigate(item.route);
            }}
            className="input"
          >
            {navItems.map((item) => (
              <option key={item.view} value={item.view}>{item.label}</option>
            ))}
          </select>
        </div>

        {/* Main Content */}
        <div className="flex-1 min-w-0">
          {currentView === 'overview' && <OverviewView products={products} inquiries={inquiries} totalViews={totalViews} company={company} />}
          {currentView === 'products' && <ProductsView products={products} onDeleted={() => {}} />}
          {currentView === 'add-product' && <AddProductView companyId={company.id} onDone={() => navigate({ name: 'dashboard-products' })} />}
          {currentView === 'profile' && <ProfileView company={company} onUpdated={refreshCompany} />}
          {currentView === 'inquiries' && <InquiriesView inquiries={inquiries} />}
          {currentView === 'messages' && <MessagesView />}
          {currentView === 'analytics' && <AnalyticsView products={products} totalViews={totalViews} inquiries={inquiries} />}
          {currentView === 'settings' && <SettingsView onSignOut={async () => { await signOut(); navigate({ name: 'home' }); }} />}
        </div>
      </div>
    </div>
  );
}

function OverviewView({ products, inquiries, totalViews, company }: { products: Product[]; inquiries: InquiryWithDetails[]; totalViews: number; company: any }) {
  const { navigate } = useRouter();
  const { t } = useApp();
  const stats = [
    { label: t('dash.productViews'), value: totalViews, icon: Eye, color: 'text-primary-600 dark:text-primary-400', bg: 'bg-primary-50 dark:bg-primary-950' },
    { label: t('dash.quoteRequests'), value: inquiries.length, icon: FileText, color: 'text-accent-600 dark:text-accent-400', bg: 'bg-accent-50 dark:bg-accent-950' },
    { label: t('dash.productsPublished'), value: products.length, icon: Package, color: 'text-success-600 dark:text-success-400', bg: 'bg-success-50 dark:bg-success-950' },
    { label: t('dash.pendingInquiries'), value: inquiries.filter((i) => i.status === 'pending').length, icon: Clock, color: 'text-warning-600 dark:text-warning-400', bg: 'bg-warning-50 dark:bg-warning-950' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold font-display text-gray-900 dark:text-gray-100">{t('dash.dashboard')}</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{t('dash.welcome')}</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div key={stat.label} className="card p-5">
            <div className={`w-10 h-10 rounded-lg ${stat.bg} flex items-center justify-center mb-3`}>
              <stat.icon className={`w-5 h-5 ${stat.color}`} />
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{stat.value}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="card p-6">
        <h2 className="font-semibold text-gray-900 dark:text-gray-100 mb-4">{t('dash.recentActivity')}</h2>
        {inquiries.length === 0 ? (
          <p className="text-sm text-gray-500 dark:text-gray-400">{t('dash.noActivity')}</p>
        ) : (
          <div className="space-y-3">
            {inquiries.slice(0, 5).map((inq) => (
              <div key={inq.id} className="flex items-center gap-3 py-2 border-b border-gray-50 dark:border-gray-800 last:border-0">
                <div className="w-8 h-8 rounded-full bg-accent-50 dark:bg-accent-950 flex items-center justify-center shrink-0">
                  <Mail className="w-4 h-4 text-accent-600 dark:text-accent-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-900 dark:text-gray-100">
                    {t('dash.quoteRequests')} <span className="font-medium">{inq.product?.name}</span>
                  </p>
                  <p className="text-xs text-gray-400 dark:text-gray-500">{inq.buyer_name} - {timeAgo(inq.created_at)}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="card p-6">
        <h2 className="font-semibold text-gray-900 dark:text-gray-100 mb-4">{t('dash.quickActions')}</h2>
        <div className="flex flex-wrap gap-3">
          <button onClick={() => navigate({ name: 'dashboard-add-product' })} className="btn-primary">
            <PlusCircle className="w-4 h-4" />
            {t('dash.addProduct')}
          </button>
          <button onClick={() => navigate({ name: 'dashboard-profile' })} className="btn-secondary">
            <Building2 className="w-4 h-4" />
            {t('dash.editProfile')}
          </button>
          <button onClick={() => navigate({ name: 'company', slug: company.slug })} className="btn-secondary">
            <Eye className="w-4 h-4" />
            {t('dash.viewPublic')}
          </button>
        </div>
      </div>
    </div>
  );
}

function ProductsView({ products, onDeleted }: { products: Product[]; onDeleted: () => void }) {
  const { navigate } = useRouter();
  const { t } = useApp();
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    await supabase.from('products').delete().eq('id', id);
    setDeleteId(null);
    onDeleted();
    window.location.reload();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold font-display text-gray-900 dark:text-gray-100">{t('dash.products')}</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{products.length} {t('dash.productsCount')}</p>
        </div>
        <button onClick={() => navigate({ name: 'dashboard-add-product' })} className="btn-primary">
          <PlusCircle className="w-4 h-4" />
          {t('dash.addProduct')}
        </button>
      </div>

      {products.length === 0 ? (
        <EmptyState
          icon={Package}
          title={t('dash.noProducts')}
          description={t('dash.noProductsDesc')}
          action={{ label: t('dash.addProduct'), onClick: () => navigate({ name: 'dashboard-add-product' }) }}
        />
      ) : (
        <div className="space-y-3">
          {products.map((p) => (
            <div key={p.id} className="card p-4 flex items-center gap-4">
              <div className="w-16 h-16 rounded-lg bg-gray-100 dark:bg-gray-800 overflow-hidden shrink-0">
                {p.image_url ? (
                  <img src={p.image_url} alt={p.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Package className="w-6 h-6 text-gray-300 dark:text-gray-600" />
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <button onClick={() => navigate({ name: 'product', slug: p.slug })} className="text-left">
                  <p className="font-semibold text-gray-900 dark:text-gray-100 hover:text-primary-700 dark:hover:text-primary-400 transition-colors">{p.name}</p>
                </button>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 flex items-center gap-3">
                  <span className="flex items-center gap-1"><Eye className="w-3 h-3" /> {p.view_count}</span>
                  <span>{p.availability}</span>
                </p>
              </div>
              {deleteId === p.id ? (
                <div className="flex items-center gap-2">
                  <button onClick={() => handleDelete(p.id)} className="text-sm text-error-600 dark:text-error-400 font-medium hover:text-error-700">Confirm</button>
                  <button onClick={() => setDeleteId(null)} className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700">{t('register.cancel')}</button>
                </div>
              ) : (
                <button onClick={() => setDeleteId(p.id)} className="p-2 rounded-lg text-gray-400 dark:text-gray-500 hover:bg-error-50 dark:hover:bg-error-950 hover:text-error-600 transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function AddProductView({ companyId, onDone }: { companyId: string; onDone: () => void }) {
  const { t } = useApp();
  const [form, setForm] = useState({
    name: '', description: '', image_url: '', category_id: '',
    min_order_quantity: '', availability: 'In Stock', tags: '',
  });
  const [categories, setCategories] = useState<any[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    supabase.from('categories').select('*').order('name').then(({ data }) => setCategories(data || []));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    let slug = slugify(form.name);
    const { data: existing } = await supabase.from('products').select('slug').eq('company_id', companyId).eq('slug', slug).maybeSingle();
    if (existing) slug = `${slug}-${Date.now().toString().slice(-4)}`;

    const tags = form.tags ? form.tags.split(',').map((t) => t.trim()).filter(Boolean) : [];

    const { error: insertError } = await supabase.from('products').insert({
      company_id: companyId,
      category_id: form.category_id || null,
      name: form.name,
      slug,
      description: form.description || null,
      image_url: form.image_url || null,
      min_order_quantity: form.min_order_quantity || null,
      availability: form.availability,
      tags,
      is_featured: false,
    });

    if (insertError) {
      setError(insertError.message);
      setSubmitting(false);
      return;
    }

    onDone();
  };

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold font-display text-gray-900 dark:text-gray-100">{t('dash.addProductTitle')}</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{t('dash.addProductSub')}</p>
      </div>

      <form onSubmit={handleSubmit} className="card p-6 space-y-5">
        <div>
          <label className="label">{t('dash.productName')} *</label>
          <input type="text" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. Automatic Packaging Machine" className="input" />
        </div>

        <div>
          <label className="label">{t('products.category')}</label>
          <select value={form.category_id} onChange={(e) => setForm({ ...form, category_id: e.target.value })} className="input">
            <option value="">{t('register.selectCategory')}</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="label">{t('product.description')}</label>
          <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={4} placeholder="Detailed product description..." className="input resize-none" />
        </div>

        <div>
          <label className="label">{t('register.logoUrl')}</label>
          <input type="url" value={form.image_url} onChange={(e) => setForm({ ...form, image_url: e.target.value })} placeholder="https://..." className="input" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="label">{t('product.minOrder')}</label>
            <input type="text" value={form.min_order_quantity} onChange={(e) => setForm({ ...form, min_order_quantity: e.target.value })} placeholder="e.g. 1 unit" className="input" />
          </div>
          <div>
            <label className="label">Availability</label>
            <select value={form.availability} onChange={(e) => setForm({ ...form, availability: e.target.value })} className="input">
              <option>In Stock</option>
              <option>Made to Order</option>
              <option>Out of Stock</option>
            </select>
          </div>
        </div>

        <div>
          <label className="label">{t('product.tags')} (comma-separated)</label>
          <input type="text" value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} placeholder="e.g. packaging, automatic, food" className="input" />
        </div>

        {error && (
          <div className="flex items-center gap-2 text-sm text-error-600 dark:text-error-400 bg-error-50 dark:bg-error-950 border border-error-200 dark:border-error-900 rounded-lg p-3">
            <AlertCircle className="w-4 h-4 shrink-0" />
            {error}
          </div>
        )}

        <div className="flex gap-3">
          <button type="submit" disabled={submitting} className="btn-primary">
            {submitting ? t('dash.publishing') : t('dash.publishProduct')}
          </button>
        </div>
      </form>
    </div>
  );
}

function ProfileView({ company, onUpdated }: { company: any; onUpdated: () => void }) {
  const { t } = useApp();
  const [form, setForm] = useState({
    name: company.name || '',
    description: company.description || '',
    logo_url: company.logo_url || '',
    city: company.city || '',
    address: company.address || '',
    phone: company.phone || '',
    email: company.email || '',
    website: company.website || '',
    business_category: company.business_category || '',
  });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    await supabase.from('companies').update({
      name: form.name,
      description: form.description || null,
      logo_url: form.logo_url || null,
      city: form.city || null,
      address: form.address || null,
      phone: form.phone || null,
      email: form.email || null,
      website: form.website || null,
      business_category: form.business_category || null,
    }).eq('id', company.id);
    await onUpdated();
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold font-display text-gray-900 dark:text-gray-100">{t('dash.companyProfile')}</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{t('dash.updateCompanyInfo')}</p>
      </div>

      <form onSubmit={handleSave} className="card p-6 space-y-5">
        <div>
          <label className="label">{t('register.companyName')}</label>
          <input type="text" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="input" />
        </div>
        <div>
          <label className="label">{t('register.description')}</label>
          <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} className="input resize-none" />
        </div>
        <div>
          <label className="label">{t('register.logoUrl')}</label>
          <input type="url" value={form.logo_url} onChange={(e) => setForm({ ...form, logo_url: e.target.value })} className="input" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="label">{t('register.city')}</label>
            <input type="text" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} className="input" />
          </div>
          <div>
            <label className="label">{t('register.businessCategory')}</label>
            <input type="text" value={form.business_category} onChange={(e) => setForm({ ...form, business_category: e.target.value })} className="input" />
          </div>
        </div>
        <div>
          <label className="label">{t('register.address')}</label>
          <input type="text" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} className="input" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="label">{t('register.phone')}</label>
            <input type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="input" />
          </div>
          <div>
            <label className="label">{t('register.website')}</label>
            <input type="text" value={form.website} onChange={(e) => setForm({ ...form, website: e.target.value })} className="input" />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button type="submit" disabled={saving} className="btn-primary">
            {saving ? t('dash.saving') : t('dash.saveChanges')}
          </button>
          {saved && (
            <span className="flex items-center gap-1 text-sm text-success-600 dark:text-success-400">
              <CheckCircle2 className="w-4 h-4" />
              {t('dash.saved')}
            </span>
          )}
        </div>
      </form>
    </div>
  );
}

function InquiriesView({ inquiries }: { inquiries: InquiryWithDetails[] }) {
  const { t } = useApp();
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const filtered = statusFilter === 'all' ? inquiries : inquiries.filter((i) => i.status === statusFilter);

  const updateStatus = async (id: string, status: string) => {
    await supabase.from('inquiries').update({ status }).eq('id', id);
    window.location.reload();
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold font-display text-gray-900 dark:text-gray-100">{t('dash.quoteRequestsTitle')}</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{inquiries.length} {t('dash.totalRequests')}</p>
      </div>

      <div className="flex gap-2">
        {['all', 'pending', 'responded', 'closed'].map((s) => (
          <button
            key={s}
            onClick={() => setStatusFilter(s)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium capitalize transition-colors ${
              statusFilter === s ? 'bg-primary-600 text-white' : 'bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <EmptyState icon={FileText} title={t('dash.noQuoteRequests')} description={t('dash.noQuoteRequestsDesc')} />
      ) : (
        <div className="space-y-3">
          {filtered.map((inq) => (
            <div key={inq.id} className="card p-5">
              <div className="flex items-start justify-between gap-3 mb-3">
                <div>
                  <p className="font-semibold text-gray-900 dark:text-gray-100">{inq.buyer_name}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                    {inq.buyer_company ? `${inq.buyer_company} - ` : ''}{timeAgo(inq.created_at)}
                  </p>
                </div>
                <span className={`badge ${
                  inq.status === 'pending' ? 'bg-warning-50 dark:bg-warning-950 text-warning-700 dark:text-warning-400 border border-warning-200 dark:border-warning-900' :
                  inq.status === 'responded' ? 'bg-success-50 dark:bg-success-950 text-success-700 dark:text-success-400 border border-success-200 dark:border-success-900' :
                  'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300'
                }`}>
                  {inq.status}
                </span>
              </div>

              <div className="text-sm text-gray-600 dark:text-gray-300 space-y-1 mb-3">
                <p><span className="text-gray-400 dark:text-gray-500">{t('quote.product')}:</span> {inq.product?.name}</p>
                {inq.quantity && <p><span className="text-gray-400 dark:text-gray-500">{t('quote.quantity')}:</span> {inq.quantity}</p>}
                <p><span className="text-gray-400 dark:text-gray-500">{t('quote.phone')}:</span> {inq.buyer_phone}</p>
                <p><span className="text-gray-400 dark:text-gray-500">{t('quote.email')}:</span> {inq.buyer_email}</p>
                {inq.message && <p className="pt-2 border-t border-gray-50 dark:border-gray-800">{inq.message}</p>}
              </div>

              {inq.status === 'pending' && (
                <div className="flex gap-2">
                  <button onClick={() => updateStatus(inq.id, 'responded')} className="btn-primary text-xs px-3 py-1.5">
                    {t('dash.markResponded')}
                  </button>
                  <button onClick={() => updateStatus(inq.id, 'closed')} className="btn-secondary text-xs px-3 py-1.5">
                    {t('dash.close')}
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function MessagesView() {
  const { t } = useApp();
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold font-display text-gray-900 dark:text-gray-100">{t('dash.messages')}</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{t('dash.directMessages')}</p>
      </div>
      <EmptyState icon={MessageSquare} title={t('dash.noMessages')} description={t('dash.noMessagesDesc')} />
    </div>
  );
}

function AnalyticsView({ products, totalViews, inquiries }: { products: Product[]; totalViews: number; inquiries: InquiryWithDetails[] }) {
  const { t } = useApp();
  const topProducts = [...products].sort((a, b) => b.view_count - a.view_count).slice(0, 5);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold font-display text-gray-900 dark:text-gray-100">{t('dash.analytics')}</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{t('dash.analyticsSub')}</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card p-5">
          <div className="w-10 h-10 rounded-lg bg-primary-50 dark:bg-primary-950 flex items-center justify-center mb-3">
            <Eye className="w-5 h-5 text-primary-600 dark:text-primary-400" />
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{totalViews}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">{t('dash.totalViews')}</p>
        </div>
        <div className="card p-5">
          <div className="w-10 h-10 rounded-lg bg-accent-50 dark:bg-accent-950 flex items-center justify-center mb-3">
            <FileText className="w-5 h-5 text-accent-600 dark:text-accent-400" />
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{inquiries.length}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">{t('dash.quoteRequests')}</p>
        </div>
        <div className="card p-5">
          <div className="w-10 h-10 rounded-lg bg-success-50 dark:bg-success-950 flex items-center justify-center mb-3">
            <Package className="w-5 h-5 text-success-600 dark:text-success-400" />
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{products.length}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">{t('dash.productsPublished')}</p>
        </div>
        <div className="card p-5">
          <div className="w-10 h-10 rounded-lg bg-warning-50 dark:bg-warning-950 flex items-center justify-center mb-3">
            <TrendingUp className="w-5 h-5 text-warning-600 dark:text-warning-400" />
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{products.length > 0 ? Math.round(totalViews / products.length) : 0}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">{t('dash.avgViews')}</p>
        </div>
      </div>

      <div className="card p-6">
        <h2 className="font-semibold text-gray-900 dark:text-gray-100 mb-4">{t('dash.topProducts')}</h2>
        {topProducts.length === 0 ? (
          <p className="text-sm text-gray-500 dark:text-gray-400">{t('dash.noProductsToAnalyze')}</p>
        ) : (
          <div className="space-y-3">
            {topProducts.map((p, i) => (
              <div key={p.id} className="flex items-center gap-3">
                <span className="w-6 h-6 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-xs font-bold text-gray-500 dark:text-gray-400 shrink-0">
                  {i + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">{p.name}</p>
                  <div className="mt-1 h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary-500 rounded-full"
                      style={{ width: `${topProducts[0].view_count > 0 ? (p.view_count / topProducts[0].view_count) * 100 : 0}%` }}
                    />
                  </div>
                </div>
                <span className="text-sm text-gray-500 dark:text-gray-400 shrink-0">{p.view_count}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function SettingsView({ onSignOut }: { onSignOut: () => void }) {
  const { t } = useApp();
  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold font-display text-gray-900 dark:text-gray-100">{t('dash.settings')}</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{t('dash.accountSettings')}</p>
      </div>

      <div className="card p-6">
        <h2 className="font-semibold text-gray-900 dark:text-gray-100 mb-4">{t('dash.account')}</h2>
        <button onClick={onSignOut} className="btn-secondary text-error-600 dark:text-error-400 border-error-200 dark:border-error-900 hover:bg-error-50 dark:hover:bg-error-950">
          {t('nav.signOut')}
        </button>
      </div>

      <div className="card p-6">
        <h2 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">{t('dash.dangerZone')}</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">{t('dash.deleteCompanyDesc')}</p>
        <button className="btn bg-error-600 text-white hover:bg-error-700" disabled>
          {t('dash.deleteCompany')}
        </button>
      </div>
    </div>
  );
}
