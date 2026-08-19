import { Building2, Mail, Phone, MapPin, ArrowRight, Globe } from 'lucide-react';
import { useRouter } from '@/lib/router';
import { useApp } from '@/lib/app-context';

export function Footer() {
  const { navigate } = useRouter();
  const { t, lang } = useApp();

  return (
    <footer className="bg-primary-950 dark:bg-black text-slate-300 mt-auto transition-colors">
      {/* Accent bar */}
      <div className="h-1 accent-bar" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-10 h-10 rounded-lg bg-primary-700 flex items-center justify-center relative overflow-hidden">
                <div className="absolute bottom-0 left-0 right-0 h-1 accent-bar" />
                <Building2 className="w-5 h-5 text-white" />
              </div>
              <div className="flex flex-col leading-none">
                <span className="text-xl font-bold font-display text-white">
                  {lang === 'ar' ? 'صناديق' : 'Sanadiq'}
                </span>
                <span className="text-[10px] text-slate-400 font-medium tracking-wide uppercase">
                  {lang === 'ar' ? 'سوق صناعي' : 'Industrial Marketplace'}
                </span>
              </div>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed max-w-sm mb-4">
              {t('footer.desc')}
            </p>
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <Globe className="w-3.5 h-3.5" />
              {t('footer.serving')}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-bold text-white mb-4 uppercase tracking-wide">{t('footer.discover')}</h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <button onClick={() => navigate({ name: 'products' })} className="text-slate-400 hover:text-accent-400 transition-colors flex items-center gap-1.5 group">
                  <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 rtl:flip transition-all" />
                  {t('footer.browseProducts')}
                </button>
              </li>
              <li>
                <button onClick={() => navigate({ name: 'companies' })} className="text-slate-400 hover:text-accent-400 transition-colors flex items-center gap-1.5 group">
                  <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 rtl:flip transition-all" />
                  {t('footer.browseCompanies')}
                </button>
              </li>
              <li>
                <button onClick={() => navigate({ name: 'products', category: 'packaging-machinery' })} className="text-slate-400 hover:text-accent-400 transition-colors flex items-center gap-1.5 group">
                  <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 rtl:flip transition-all" />
                  {lang === 'ar' ? 'آلات التعبئة' : 'Packaging Machinery'}
                </button>
              </li>
              <li>
                <button onClick={() => navigate({ name: 'products', category: 'industrial-machinery' })} className="text-slate-400 hover:text-accent-400 transition-colors flex items-center gap-1.5 group">
                  <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 rtl:flip transition-all" />
                  {lang === 'ar' ? 'الآلات الصناعية' : 'Industrial Machinery'}
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-bold text-white mb-4 uppercase tracking-wide">{t('footer.forSuppliers')}</h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <button onClick={() => navigate({ name: 'supplier-register' })} className="text-slate-400 hover:text-accent-400 transition-colors flex items-center gap-1.5 group">
                  <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 rtl:flip transition-all" />
                  {t('footer.joinSupplier')}
                </button>
              </li>
              <li>
                <button onClick={() => navigate({ name: 'login' })} className="text-slate-400 hover:text-accent-400 transition-colors flex items-center gap-1.5 group">
                  <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 rtl:flip transition-all" />
                  {t('footer.supplierLogin')}
                </button>
              </li>
              <li>
                <button onClick={() => navigate({ name: 'dashboard' })} className="text-slate-400 hover:text-accent-400 transition-colors flex items-center gap-1.5 group">
                  <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 rtl:flip transition-all" />
                  {t('nav.dashboard')}
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-bold text-white mb-4 uppercase tracking-wide">{t('footer.contact')}</h3>
            <ul className="space-y-3 text-sm text-slate-400">
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 shrink-0 mt-0.5 text-accent-500" />
                {lang === 'ar' ? 'أربيل، إقليم كردستان، العراق' : 'Erbil, Kurdistan Region, Iraq'}
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 shrink-0 text-accent-500" />
                +964 750 000 0000
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 shrink-0 text-accent-500" />
                info@sanadiq.iq
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-800 mt-10 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-slate-500">
            {t('footer.rights')}
          </p>
          <div className="flex items-center gap-4 text-xs text-slate-500">
            <button className="hover:text-slate-300 transition-colors">{lang === 'ar' ? 'سياسة الخصوصية' : 'Privacy Policy'}</button>
            <span>|</span>
            <button className="hover:text-slate-300 transition-colors">{lang === 'ar' ? 'الشروط والأحكام' : 'Terms & Conditions'}</button>
          </div>
        </div>
      </div>
    </footer>
  );
}
