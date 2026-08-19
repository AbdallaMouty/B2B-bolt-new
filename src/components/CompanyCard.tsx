import { MapPin, BadgeCheck, Package, ArrowRight } from 'lucide-react';
import type { CompanyWithStats } from '@/lib/types';
import { useRouter } from '@/lib/router';
import { useApp } from '@/lib/app-context';
import { truncate } from '@/lib/utils';

export function CompanyCard({ company }: { company: CompanyWithStats }) {
  const { navigate } = useRouter();
  const { t, lang } = useApp();
  const isVerified = company.verification_status === 'verified';

  return (
    <button
      onClick={() => navigate({ name: 'company', slug: company.slug })}
      className="card group text-left p-5 hover:shadow-md transition-all duration-200 hover:border-primary-200 dark:hover:border-primary-800"
    >
      <div className="flex items-start gap-4">
        {/* Logo */}
        <div className="w-16 h-16 rounded-lg bg-gray-100 dark:bg-gray-800 overflow-hidden shrink-0">
          {company.logo_url ? (
            <img
              src={company.logo_url}
              alt={company.name}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-primary-50 dark:bg-primary-950">
              <span className="text-xl font-bold font-display text-primary-600 dark:text-primary-400">
                {company.name[0]}
              </span>
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 mb-1">
            <h3 className="font-semibold text-gray-900 dark:text-gray-100 text-sm group-hover:text-primary-700 dark:group-hover:text-primary-400 transition-colors truncate">
              {company.name}
            </h3>
            {isVerified && <BadgeCheck className="w-4 h-4 text-success-500 shrink-0" />}
          </div>

          <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1 mb-2">
            <MapPin className="w-3 h-3" />
            {company.city || t('common.iraq')}, {company.country}
          </p>

          {company.business_category && (
            <span className="badge-category mb-2">{company.business_category}</span>
          )}

          <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 mb-3">
            {truncate(company.description || '', 120)}
          </p>

          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-400 dark:text-gray-500 flex items-center gap-1">
              <Package className="w-3.5 h-3.5" />
              {company.product_count ?? 0} {t('common.products')}
            </span>
            <ArrowRight className="w-4 h-4 text-gray-300 dark:text-gray-600 group-hover:text-primary-600 dark:group-hover:text-primary-400 group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5 transition-all" />
          </div>
        </div>
      </div>
    </button>
  );
}
