import { BadgeCheck, Clock } from 'lucide-react';
import { useApp } from '@/lib/app-context';

export function VerificationBadge({ status, size = 'sm' }: { status: string; size?: 'sm' | 'md' }) {
  const { t } = useApp();
  const iconSize = size === 'md' ? 'w-4 h-4' : 'w-3.5 h-3.5';
  const textSize = size === 'md' ? 'text-sm' : 'text-xs';

  if (status === 'verified') {
    return (
      <span className={`inline-flex items-center gap-1 ${textSize} font-medium text-success-700 dark:text-success-400`}>
        <BadgeCheck className={`${iconSize} text-success-500`} />
        {t('verify.verified')}
      </span>
    );
  }

  return (
    <span className={`inline-flex items-center gap-1 ${textSize} font-medium text-warning-700 dark:text-warning-400`}>
      <Clock className={`${iconSize} text-warning-500`} />
      {t('verify.pending')}
    </span>
  );
}
