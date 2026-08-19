import { Loader2 } from 'lucide-react';
import { useApp } from '@/lib/app-context';

export function LoadingSpinner({ label }: { label?: string }) {
  const { t } = useApp();
  return (
    <div className="flex flex-col items-center justify-center py-20">
      <Loader2 className="w-8 h-8 text-primary-500 animate-spin mb-3" />
      <p className="text-sm text-gray-500 dark:text-gray-400">{label || t('common.loading')}</p>
    </div>
  );
}

export function FullPageSpinner() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <Loader2 className="w-10 h-10 text-primary-500 animate-spin" />
    </div>
  );
}
