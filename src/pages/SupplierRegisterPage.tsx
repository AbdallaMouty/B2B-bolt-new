import { useState } from 'react';
import { Building2, AlertCircle } from 'lucide-react';
import { useAuth } from '@/lib/auth';
import { useRouter } from '@/lib/router';
import { useApp } from '@/lib/app-context';
import { supabase } from '@/lib/supabase';
import { slugify } from '@/lib/utils';

export function SupplierRegisterPage() {
  const { user, refreshCompany } = useAuth();
  const { navigate } = useRouter();
  const { t } = useApp();
  const [form, setForm] = useState({
    name: '',
    description: '',
    logo_url: '',
    country: 'Iraq',
    city: '',
    address: '',
    phone: '',
    email: user?.email || '',
    website: '',
    business_category: '',
    year_established: '',
    company_size: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!user) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <div className="w-16 h-16 rounded-full bg-primary-50 dark:bg-primary-950 flex items-center justify-center mx-auto mb-4">
          <Building2 className="w-8 h-8 text-primary-600 dark:text-primary-400" />
        </div>
        <h1 className="text-2xl font-bold font-display text-gray-900 dark:text-gray-100 mb-2">{t('register.signUpFirst')}</h1>
        <p className="text-gray-500 dark:text-gray-400 mb-6">{t('register.signUpFirstDesc')}</p>
        <div className="flex gap-3 justify-center">
          <button onClick={() => navigate({ name: 'signup' })} className="btn-primary">{t('nav.signUp')}</button>
          <button onClick={() => navigate({ name: 'login' })} className="btn-secondary">{t('nav.signIn')}</button>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    let slug = slugify(form.name);
    const { data: existing } = await supabase.from('companies').select('slug').eq('slug', slug).maybeSingle();
    if (existing) {
      slug = `${slug}-${Date.now().toString().slice(-4)}`;
    }

    const { error: insertError } = await supabase.from('companies').insert({
      owner_id: user.id,
      name: form.name,
      slug,
      description: form.description || null,
      logo_url: form.logo_url || null,
      country: form.country,
      city: form.city || null,
      address: form.address || null,
      phone: form.phone || null,
      email: form.email || null,
      website: form.website || null,
      business_category: form.business_category || null,
      year_established: form.year_established ? parseInt(form.year_established) : null,
      company_size: form.company_size || null,
      verification_status: 'pending',
      is_featured: false,
    });

    if (insertError) {
      setError(insertError.message);
      setSubmitting(false);
      return;
    }

    await refreshCompany();
    navigate({ name: 'dashboard' });
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold font-display text-gray-900 dark:text-gray-100">{t('register.title')}</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{t('register.subtitle')}</p>
      </div>

      <form onSubmit={handleSubmit} className="card p-6 space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div className="sm:col-span-2">
            <label className="label">{t('register.companyName')} *</label>
            <input type="text" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. Al-Rafidain Industrial Equipment" className="input" />
          </div>

          <div className="sm:col-span-2">
            <label className="label">{t('register.description')}</label>
            <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} placeholder="Brief description of your company..." className="input resize-none" />
          </div>

          <div className="sm:col-span-2">
            <label className="label">{t('register.logoUrl')}</label>
            <input type="url" value={form.logo_url} onChange={(e) => setForm({ ...form, logo_url: e.target.value })} placeholder="https://..." className="input" />
          </div>

          <div>
            <label className="label">{t('register.country')}</label>
            <select value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })} className="input">
              <option>Iraq</option>
              <option>Kurdistan Region</option>
              <option>Saudi Arabia</option>
              <option>Syria</option>
              <option>Egypt</option>
            </select>
          </div>

          <div>
            <label className="label">{t('register.city')} *</label>
            <input type="text" required value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} placeholder="e.g. Erbil" className="input" />
          </div>

          <div className="sm:col-span-2">
            <label className="label">{t('register.address')}</label>
            <input type="text" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} placeholder="Street address" className="input" />
          </div>

          <div>
            <label className="label">{t('register.phone')}</label>
            <input type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="+964 750 000 0000" className="input" />
          </div>

          <div>
            <label className="label">{t('register.website')}</label>
            <input type="text" value={form.website} onChange={(e) => setForm({ ...form, website: e.target.value })} placeholder="www.company.com" className="input" />
          </div>

          <div>
            <label className="label">{t('register.businessCategory')}</label>
            <select value={form.business_category} onChange={(e) => setForm({ ...form, business_category: e.target.value })} className="input">
              <option value="">{t('register.selectCategory')}</option>
              <option>Industrial Machinery & Equipment</option>
              <option>Packaging Machinery</option>
              <option>Food Processing Equipment</option>
              <option>Construction Materials</option>
              <option>Electrical Equipment</option>
              <option>Furniture</option>
              <option>Plastic & Rubber Equipment</option>
              <option>Metal & Steel Products</option>
              <option>Agricultural Equipment</option>
              <option>Raw Materials</option>
            </select>
          </div>

          <div>
            <label className="label">{t('register.yearEstablished')}</label>
            <input type="number" value={form.year_established} onChange={(e) => setForm({ ...form, year_established: e.target.value })} placeholder="e.g. 2008" min="1900" max="2026" className="input" />
          </div>

          <div>
            <label className="label">{t('register.companySize')}</label>
            <select value={form.company_size} onChange={(e) => setForm({ ...form, company_size: e.target.value })} className="input">
              <option value="">{t('register.selectSize')}</option>
              <option>1-10</option>
              <option>10-50</option>
              <option>50-200</option>
              <option>200-500</option>
              <option>500+</option>
            </select>
          </div>
        </div>

        {error && (
          <div className="flex items-center gap-2 text-sm text-error-600 dark:text-error-400 bg-error-50 dark:bg-error-950 border border-error-200 dark:border-error-900 rounded-lg p-3">
            <AlertCircle className="w-4 h-4 shrink-0" />
            {error}
          </div>
        )}

        <div className="flex items-center gap-3 pt-2">
          <button type="submit" disabled={submitting} className="btn-primary">
            {submitting ? t('register.creating') : t('register.create')}
          </button>
          <button type="button" onClick={() => navigate({ name: 'home' })} className="btn-ghost">
            {t('register.cancel')}
          </button>
        </div>
      </form>
    </div>
  );
}
