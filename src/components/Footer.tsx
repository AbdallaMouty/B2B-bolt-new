import { Building2, Mail, Phone, MapPin } from 'lucide-react';
import { useRouter } from '@/lib/router';
import { useApp } from '@/lib/app-context';

export function Footer() {
  const { navigate } = useRouter();
  const { t, lang } = useApp();

  return (
    <footer className="bg-gray-900 dark:bg-black text-gray-300 mt-auto transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 rounded-lg bg-primary-600 flex items-center justify-center">
                <Building2 className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold font-display text-white">
                {lang === 'ar' ? 'صناديق' : 'Sanadiq'}
              </span>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed">
              {t('footer.desc')}
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white mb-4">{t('footer.discover')}</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <button onClick={() => navigate({ name: 'products' })} className="text-gray-400 hover:text-white transition-colors">
                  {t('footer.browseProducts')}
                </button>
              </li>
              <li>
                <button onClick={() => navigate({ name: 'companies' })} className="text-gray-400 hover:text-white transition-colors">
                  {t('footer.browseCompanies')}
                </button>
              </li>
              <li>
                <button onClick={() => navigate({ name: 'products', category: 'packaging-machinery' })} className="text-gray-400 hover:text-white transition-colors">
                  {lang === 'ar' ? 'آلات التعبئة' : 'Packaging Machinery'}
                </button>
              </li>
              <li>
                <button onClick={() => navigate({ name: 'products', category: 'industrial-machinery' })} className="text-gray-400 hover:text-white transition-colors">
                  {lang === 'ar' ? 'الآلات الصناعية' : 'Industrial Machinery'}
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white mb-4">{t('footer.forSuppliers')}</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <button onClick={() => navigate({ name: 'supplier-register' })} className="text-gray-400 hover:text-white transition-colors">
                  {t('footer.joinSupplier')}
                </button>
              </li>
              <li>
                <button onClick={() => navigate({ name: 'login' })} className="text-gray-400 hover:text-white transition-colors">
                  {t('footer.supplierLogin')}
                </button>
              </li>
              <li>
                <button onClick={() => navigate({ name: 'dashboard' })} className="text-gray-400 hover:text-white transition-colors">
                  {t('nav.dashboard')}
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white mb-4">{t('footer.contact')}</h3>
            <ul className="space-y-3 text-sm text-gray-400">
              <li className="flex items-center gap-2">
                <MapPin className="w-4 h-4 shrink-0" />
                {lang === 'ar' ? 'أربيل، إقليم كردستان، العراق' : 'Erbil, Kurdistan Region, Iraq'}
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 shrink-0" />
                +964 750 000 0000
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 shrink-0" />
                info@sanadiq.iq
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-gray-500">
            {t('footer.rights')}
          </p>
          <p className="text-sm text-gray-500">
            {t('footer.serving')}
          </p>
        </div>
      </div>
    </footer>
  );
}
