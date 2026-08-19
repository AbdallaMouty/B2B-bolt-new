import { useState } from 'react';
import { X, CheckCircle2, Send } from 'lucide-react';
import type { ProductWithCompany } from '@/lib/types';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/lib/auth';
import { useApp } from '@/lib/app-context';

interface QuoteModalProps {
  product: ProductWithCompany;
  isOpen: boolean;
  onClose: () => void;
}

export function QuoteModal({ product, isOpen, onClose }: QuoteModalProps) {
  const { user } = useAuth();
  const { t } = useApp();
  const [form, setForm] = useState({
    quantity: '',
    name: '',
    company: '',
    phone: '',
    email: '',
    message: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    const { error: insertError } = await supabase.from('inquiries').insert({
      product_id: product.id,
      company_id: product.company_id,
      buyer_id: user?.id ?? null,
      buyer_name: form.name,
      buyer_company: form.company || null,
      buyer_phone: form.phone,
      buyer_email: form.email,
      quantity: form.quantity || null,
      message: form.message || null,
      status: 'pending',
    });

    if (insertError) {
      setError(t('quote.failed'));
      setSubmitting(false);
      return;
    }

    setSuccess(true);
    setSubmitting(false);
  };

  const handleClose = () => {
    setSuccess(false);
    setError(null);
    setForm({ quantity: '', name: '', company: '', phone: '', email: '', message: '' });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 dark:bg-black/70 backdrop-blur-sm" onClick={handleClose} />

      <div className="relative bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto transition-colors">
        {success ? (
          <div className="p-8 text-center">
            <div className="w-16 h-16 rounded-full bg-success-50 dark:bg-success-950 flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-8 h-8 text-success-500" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">{t('quote.success')}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
              {t('quote.successMsg')}
            </p>
            <button onClick={handleClose} className="btn-primary w-full">
              {t('quote.done')}
            </button>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between p-5 border-b border-gray-200 dark:border-gray-800">
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">{t('quote.title')}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{product.name}</p>
              </div>
              <button onClick={handleClose} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-5 space-y-4">
              <div>
                <label className="label">{t('quote.product')}</label>
                <input
                  type="text"
                  value={product.name}
                  disabled
                  className="input bg-gray-50 dark:bg-gray-800 cursor-not-allowed"
                />
              </div>

              <div>
                <label className="label">{t('quote.quantity')}</label>
                <input
                  type="text"
                  value={form.quantity}
                  onChange={(e) => setForm({ ...form, quantity: e.target.value })}
                  placeholder={t('quote.quantityPlaceholder')}
                  className="input"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="label">{t('quote.name')} *</label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder={t('quote.fullName')}
                    className="input"
                  />
                </div>
                <div>
                  <label className="label">{t('quote.company')}</label>
                  <input
                    type="text"
                    value={form.company}
                    onChange={(e) => setForm({ ...form, company: e.target.value })}
                    placeholder={t('quote.companyName')}
                    className="input"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="label">{t('quote.phone')} *</label>
                  <input
                    type="tel"
                    required
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    placeholder={t('quote.phonePlaceholder')}
                    className="input"
                  />
                </div>
                <div>
                  <label className="label">{t('quote.email')} *</label>
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder={t('quote.emailPlaceholder')}
                    className="input"
                  />
                </div>
              </div>

              <div>
                <label className="label">{t('quote.message')}</label>
                <textarea
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  rows={3}
                  placeholder={t('quote.messagePlaceholder')}
                  className="input resize-none"
                />
              </div>

              {error && (
                <div className="text-sm text-error-600 dark:text-error-400 bg-error-50 dark:bg-error-950 border border-error-200 dark:border-error-900 rounded-lg p-3">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="btn-primary w-full"
              >
                {submitting ? (
                  t('quote.sending')
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    {t('quote.send')}
                  </>
                )}
              </button>

              <p className="text-xs text-gray-400 dark:text-gray-500 text-center">
                {t('quote.sharedWith')} {product.company.name}
              </p>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
