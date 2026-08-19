import { useState } from 'react';
import { Search, Menu, X, Building2, ChevronDown, Moon, Sun, Languages, Phone } from 'lucide-react';
import { useRouter } from '@/lib/router';
import { useAuth } from '@/lib/auth';
import { useApp } from '@/lib/app-context';

export function Header() {
  const { route, navigate } = useRouter();
  const { user, company, signOut } = useAuth();
  const { t, theme, toggleTheme, lang, toggleLang } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const isHome = route.name === 'home';

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    navigate({ name: 'products', search: searchQuery || undefined });
    setMobileOpen(false);
  };

  const navLink = (label: string, target: () => void, active: boolean) => (
    <button
      onClick={target}
      className={`text-sm font-semibold transition-colors ${
        active ? 'text-primary-700 dark:text-primary-400' : 'text-slate-600 hover:text-primary-700 dark:text-slate-300 dark:hover:text-white'
      }`}
    >
      {label}
    </button>
  );

  return (
    <header className="sticky top-0 z-50 bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 shadow-sm transition-colors">
      {/* Utility bar */}
      <div className="hidden md:block bg-primary-950 dark:bg-black text-slate-300 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-9">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <Phone className="w-3 h-3" />
              +964 750 000 0000
            </span>
            <span className="text-slate-500">|</span>
            <span>{lang === 'ar' ? 'أربيل، العراق' : 'Erbil, Iraq'}</span>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={toggleTheme} className="flex items-center gap-1.5 hover:text-white transition-colors">
              {theme === 'light' ? <Moon className="w-3 h-3" /> : <Sun className="w-3 h-3" />}
              {theme === 'light' ? (lang === 'ar' ? 'داكن' : 'Dark') : (lang === 'ar' ? 'فاتح' : 'Light')}
            </button>
            <span className="text-slate-600">|</span>
            <button onClick={toggleLang} className="flex items-center gap-1.5 hover:text-white transition-colors font-semibold">
              <Languages className="w-3 h-3" />
              {lang === 'en' ? 'العربية' : 'English'}
            </button>
          </div>
        </div>
      </div>

      {/* Main nav */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo */}
          <button onClick={() => navigate({ name: 'home' })} className="flex items-center gap-2.5 shrink-0">
            <div className="w-10 h-10 rounded-lg bg-primary-700 flex items-center justify-center relative overflow-hidden">
              <div className="absolute bottom-0 left-0 right-0 h-1 accent-bar" />
              <Building2 className="w-5 h-5 text-white" />
            </div>
            <div className="flex flex-col leading-none">
              <span className="text-xl font-bold font-display text-slate-900 dark:text-white">
                {lang === 'ar' ? 'صناديق' : 'Sanadiq'}
              </span>
              <span className="text-[10px] text-slate-400 font-medium tracking-wide uppercase">
                {lang === 'ar' ? 'سوق صناعي' : 'Industrial Marketplace'}
              </span>
            </div>
          </button>

          {/* Search bar - desktop */}
          {!isHome && (
            <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-xl">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 rtl:left-auto rtl:right-3" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={t('nav.searchPlaceholder')}
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-300 bg-slate-50 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent focus:bg-white transition-all dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100 dark:focus:bg-slate-700 rtl:pr-10 rtl:pl-4"
                />
              </div>
            </form>
          )}

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-6">
            {navLink(t('nav.products'), () => navigate({ name: 'products' }), route.name === 'products')}
            {navLink(t('nav.companies'), () => navigate({ name: 'companies' }), route.name === 'companies')}
            {navLink(t('nav.joinSupplier'), () => navigate({ name: 'supplier-register' }), route.name === 'supplier-register')}

            {user ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center">
                    <span className="text-sm font-semibold text-primary-700 dark:text-primary-300">
                      {user.email?.[0].toUpperCase()}
                    </span>
                  </div>
                  <ChevronDown className="w-4 h-4 text-slate-400" />
                </button>
                {userMenuOpen && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setUserMenuOpen(false)} />
                    <div className="absolute right-0 rtl:right-auto rtl:left-0 mt-2 w-56 bg-white dark:bg-slate-900 rounded-lg shadow-lg border border-slate-200 dark:border-slate-800 py-1 z-20">
                      {company ? (
                        <button
                          onClick={() => { navigate({ name: 'dashboard' }); setUserMenuOpen(false); }}
                          className="w-full text-left px-4 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800"
                        >
                          {t('nav.dashboard')}
                        </button>
                      ) : (
                        <button
                          onClick={() => { navigate({ name: 'supplier-register' }); setUserMenuOpen(false); }}
                          className="w-full text-left px-4 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800"
                        >
                          {t('nav.createProfile')}
                        </button>
                      )}
                      <div className="border-t border-slate-100 dark:border-slate-800 mt-1 pt-1">
                        <button
                          onClick={async () => { await signOut(); setUserMenuOpen(false); navigate({ name: 'home' }); }}
                          className="w-full text-left px-4 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800"
                        >
                          {t('nav.signOut')}
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <button onClick={() => navigate({ name: 'login' })} className="text-sm font-semibold text-slate-600 hover:text-primary-700 dark:text-slate-300 dark:hover:text-white">
                  {t('nav.signIn')}
                </button>
                <button onClick={() => navigate({ name: 'signup' })} className="btn-accent">
                  {t('nav.signUp')}
                </button>
              </div>
            )}
          </nav>

          {/* Mobile toggle */}
          <div className="flex items-center gap-1 md:hidden">
            <button onClick={toggleTheme} className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800">
              {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
            </button>
            <button onClick={toggleLang} className="flex items-center gap-1 px-2 py-1.5 rounded-lg text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 text-sm font-medium">
              <Languages className="w-4 h-4" />
              {lang === 'en' ? 'AR' : 'EN'}
            </button>
            <button onClick={() => setMobileOpen(!mobileOpen)} className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800">
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="md:hidden pb-4 space-y-3">
            <form onSubmit={handleSearch}>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 rtl:left-auto rtl:right-3" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={t('nav.searchPlaceholder')}
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-300 bg-slate-50 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100 rtl:pr-10 rtl:pl-4"
                />
              </div>
            </form>
            <div className="flex flex-col gap-3 pt-2">
              {navLink(t('nav.products'), () => { navigate({ name: 'products' }); setMobileOpen(false); }, route.name === 'products')}
              {navLink(t('nav.companies'), () => { navigate({ name: 'companies' }); setMobileOpen(false); }, route.name === 'companies')}
              {navLink(t('nav.joinSupplier'), () => { navigate({ name: 'supplier-register' }); setMobileOpen(false); }, route.name === 'supplier-register')}
              {user ? (
                <>
                  <button onClick={() => { navigate({ name: 'dashboard' }); setMobileOpen(false); }} className="text-sm font-semibold text-slate-600 dark:text-slate-300 text-left">
                    {t('nav.dashboard')}
                  </button>
                  <button onClick={async () => { await signOut(); setMobileOpen(false); navigate({ name: 'home' }); }} className="text-sm font-semibold text-slate-600 dark:text-slate-300 text-left">
                    {t('nav.signOut')}
                  </button>
                </>
              ) : (
                <div className="flex gap-3 pt-2">
                  <button onClick={() => { navigate({ name: 'login' }); setMobileOpen(false); }} className="btn-secondary flex-1">
                    {t('nav.signIn')}
                  </button>
                  <button onClick={() => { navigate({ name: 'signup' }); setMobileOpen(false); }} className="btn-accent flex-1">
                    {t('nav.signUp')}
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
