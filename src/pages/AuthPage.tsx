import { useState } from 'react';
import { useAuth } from '@/lib/auth';
import { useRouter } from '@/lib/router';
import { useApp } from '@/lib/app-context';
import { Building2, Mail, Lock, AlertCircle } from 'lucide-react';

export function AuthPage({ mode }: { mode: 'login' | 'signup' }) {
  const { signIn, signUp } = useAuth();
  const { navigate } = useRouter();
  const { t } = useApp();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const isLogin = mode === 'login';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const result = isLogin ? await signIn(email, password) : await signUp(email, password);

    if (result.error) {
      setError(result.error);
      setLoading(false);
      return;
    }

    if (isLogin) {
      navigate({ name: 'dashboard' });
    } else {
      navigate({ name: 'supplier-register' });
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-xl bg-primary-600 flex items-center justify-center mx-auto mb-4">
            <Building2 className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-2xl font-bold font-display text-gray-900 dark:text-gray-100">
            {isLogin ? t('auth.welcomeBack') : t('auth.createAccount')}
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {isLogin ? t('auth.signInSub') : t('auth.signUpSub')}
          </p>
        </div>

        <div className="card p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label">{t('auth.email')}</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 rtl:left-auto rtl:right-3" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@company.com"
                  className="input pl-10 rtl:pr-10 rtl:pl-4"
                />
              </div>
            </div>

            <div>
              <label className="label">{t('auth.password')}</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 rtl:left-auto rtl:right-3" />
                <input
                  type="password"
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={t('auth.passwordPlaceholder')}
                  className="input pl-10 rtl:pr-10 rtl:pl-4"
                />
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 text-sm text-error-600 dark:text-error-400 bg-error-50 dark:bg-error-950 border border-error-200 dark:border-error-900 rounded-lg p-3">
                <AlertCircle className="w-4 h-4 shrink-0" />
                {error}
              </div>
            )}

            <button type="submit" disabled={loading} className="btn-primary w-full">
              {loading ? t('auth.pleaseWait') : isLogin ? t('nav.signIn') : t('nav.signUp')}
            </button>
          </form>

          <div className="mt-5 pt-5 border-t border-gray-100 dark:border-gray-800 text-center text-sm text-gray-500 dark:text-gray-400">
            {isLogin ? (
              <>
                {t('auth.noAccount')}{' '}
                <button onClick={() => navigate({ name: 'signup' })} className="text-primary-600 dark:text-primary-400 font-medium hover:text-primary-700">
                  {t('nav.signUp')}
                </button>
              </>
            ) : (
              <>
                {t('auth.haveAccount')}{' '}
                <button onClick={() => navigate({ name: 'login' })} className="text-primary-600 dark:text-primary-400 font-medium hover:text-primary-700">
                  {t('nav.signIn')}
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
