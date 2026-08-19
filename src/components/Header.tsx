import { useState } from 'react';
import { Search, Menu, X, Building2, ChevronDown, Moon, Sun, Languages } from 'lucide-react';
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
      className={`text-sm font-medium transition-colors ${
        active ? 'text-primary-600 dark:text-primary-400' : 'text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white'
      }`}
    >
      {label}
    </button>
  );

  return (
    <header className={`sticky top-0 z-50 ${isHome ? 'bg-white/95 dark:bg-gray-950/95 backdrop-blur-md' : 'bg-white dark:bg-gray-950 border-b border-gray-200 dark:border-gray-800'} shadow-sm transition-colors`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo */}
          <button
            onClick={() => navigate({ name: 'home' })}
            className="flex items-center gap-2 shrink-0"
          >
            <div className="w-9 h-9 rounded-lg bg-primary-600 flex items-center justify-center">
              <Building2 className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold font-display text-gray-900 dark:text-white hidden sm:block">
              {lang === 'ar' ? 'صناديق' : 'Sanadiq'}
            </span>
          </button>

          {/* Search bar - desktop */}
          {!isHome && (
            <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-xl">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 rtl:left-auto rtl:right-3" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={t('nav.searchPlaceholder')}
                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent focus:bg-white transition-all dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100 dark:focus:bg-gray-700 rtl:pr-10 rtl:pl-4"
                />
              </div>
            </form>
          )}

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-5">
            {navLink(t('nav.products'), () => navigate({ name: 'products' }), route.name === 'products')}
            {navLink(t('nav.companies'), () => navigate({ name: 'companies' }), route.name === 'companies')}
            {navLink(t('nav.joinSupplier'), () => navigate({ name: 'supplier-register' }), route.name === 'supplier-register')}

            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 transition-colors"
              aria-label="Toggle theme"
            >
              {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
            </button>

            {/* Language toggle */}
            <button
              onClick={toggleLang}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 transition-colors text-sm font-medium"
            >
              <Languages className="w-4 h-4" />
              {lang === 'en' ? 'AR' : 'EN'}
            </button>

            {user ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center">
                    <span className="text-sm font-semibold text-primary-700 dark:text-primary-300">
                      {user.email?.[0].toUpperCase()}
                    </span>
                  </div>
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                </button>
                {userMenuOpen && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setUserMenuOpen(false)} />
                    <div className="absolute right-0 rtl:right-auto rtl:left-0 mt-2 w-56 bg-white dark:bg-gray-900 rounded-lg shadow-lg border border-gray-200 dark:border-gray-800 py-1 z-20">
                      {company ? (
                        <button
                          onClick={() => {
                            navigate({ name: 'dashboard' });
                            setUserMenuOpen(false);
                          }}
                          className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800"
                        >
                          {t('nav.dashboard')}
                        </button>
                      ) : (
                        <button
                          onClick={() => {
                            navigate({ name: 'supplier-register' });
                            setUserMenuOpen(false);
                          }}
                          className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800"
                        >
                          {t('nav.createProfile')}
                        </button>
                      )}
                      <div className="border-t border-gray-100 dark:border-gray-800 mt-1 pt-1">
                        <button
                          onClick={async () => {
                            await signOut();
                            setUserMenuOpen(false);
                            navigate({ name: 'home' });
                          }}
                          className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800"
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
                <button
                  onClick={() => navigate({ name: 'login' })}
                  className="text-sm font-medium text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
                >
                  {t('nav.signIn')}
                </button>
                <button
                  onClick={() => navigate({ name: 'signup' })}
                  className="btn-primary"
                >
                  {t('nav.signUp')}
                </button>
              </div>
            )}
          </nav>

          {/* Mobile toggle */}
          <div className="flex items-center gap-1 md:hidden">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
            >
              {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
            </button>
            <button
              onClick={toggleLang}
              className="flex items-center gap-1 px-2 py-1.5 rounded-lg text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 text-sm font-medium"
            >
              <Languages className="w-4 h-4" />
              {lang === 'en' ? 'AR' : 'EN'}
            </button>
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="md:hidden pb-4 space-y-3">
            <form onSubmit={handleSearch}>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 rtl:left-auto rtl:right-3" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={t('nav.searchPlaceholder')}
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100 rtl:pr-10 rtl:pl-4"
                />
              </div>
            </form>
            <div className="flex flex-col gap-3 pt-2">
              {navLink(t('nav.products'), () => { navigate({ name: 'products' }); setMobileOpen(false); }, route.name === 'products')}
              {navLink(t('nav.companies'), () => { navigate({ name: 'companies' }); setMobileOpen(false); }, route.name === 'companies')}
              {navLink(t('nav.joinSupplier'), () => { navigate({ name: 'supplier-register' }); setMobileOpen(false); }, route.name === 'supplier-register')}
              {user ? (
                <>
                  <button
                    onClick={() => { navigate({ name: 'dashboard' }); setMobileOpen(false); }}
                    className="text-sm font-medium text-gray-600 dark:text-gray-300 text-left"
                  >
                    {t('nav.dashboard')}
                  </button>
                  <button
                    onClick={async () => { await signOut(); setMobileOpen(false); navigate({ name: 'home' }); }}
                    className="text-sm font-medium text-gray-600 dark:text-gray-300 text-left"
                  >
                    {t('nav.signOut')}
                  </button>
                </>
              ) : (
                <div className="flex gap-3 pt-2">
                  <button onClick={() => { navigate({ name: 'login' }); setMobileOpen(false); }} className="btn-secondary flex-1">
                    {t('nav.signIn')}
                  </button>
                  <button onClick={() => { navigate({ name: 'signup' }); setMobileOpen(false); }} className="btn-primary flex-1">
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
