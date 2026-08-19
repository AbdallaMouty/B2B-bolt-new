import { MapPin, BadgeCheck, ArrowRight } from 'lucide-react';
import type { ProductWithCompany } from '@/lib/types';
import { useRouter } from '@/lib/router';
import { useApp } from '@/lib/app-context';
import { truncate } from '@/lib/utils';

export function ProductCard({ product }: { product: ProductWithCompany }) {
  const { navigate } = useRouter();
  const { t } = useApp();
  const isVerified = product.company.verification_status === 'verified';

  return (
    <button
      onClick={() => navigate({ name: 'product', slug: product.slug })}
      className="card group text-left overflow-hidden hover:shadow-md transition-all duration-200 hover:border-primary-200 dark:hover:border-primary-800 flex flex-col"
    >
      {/* Image */}
      <div className="relative aspect-[4/3] bg-gray-100 dark:bg-gray-800 overflow-hidden">
        {product.image_url ? (
          <img
            src={product.image_url}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-300 dark:text-gray-600">
            <span className="text-4xl font-display">S</span>
          </div>
        )}
        {product.availability !== 'In Stock' && (
          <span className="absolute top-2 right-2 rtl:right-auto rtl:left-2 badge bg-white/90 dark:bg-gray-900/90 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-700">
            {product.availability === 'Made to Order' ? t('product.madeToOrder') : product.availability === 'Out of Stock' ? t('product.outOfStock') : product.availability}
          </span>
        )}
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-1">
        <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400 mb-2">
          <span>{product.category?.name || t('common.uncategorized')}</span>
        </div>

        <h3 className="font-semibold text-gray-900 dark:text-gray-100 text-sm leading-snug mb-2 line-clamp-2 group-hover:text-primary-700 dark:group-hover:text-primary-400 transition-colors">
          {product.name}
        </h3>

        <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 mb-3 flex-1">
          {truncate(product.description || '', 100)}
        </p>

        {/* Supplier */}
        <div className="pt-3 border-t border-gray-100 dark:border-gray-800">
          <div className="flex items-center justify-between gap-2">
            <div className="min-w-0">
              <p className="text-xs font-medium text-gray-700 dark:text-gray-200 truncate flex items-center gap-1">
                {product.company.name}
                {isVerified && <BadgeCheck className="w-3.5 h-3.5 text-success-500 shrink-0" />}
              </p>
              <p className="text-xs text-gray-400 dark:text-gray-500 flex items-center gap-1 mt-0.5">
                <MapPin className="w-3 h-3" />
                {product.company.city || t('common.iraq')}
              </p>
            </div>
            <ArrowRight className="w-4 h-4 text-gray-300 dark:text-gray-600 group-hover:text-primary-600 dark:group-hover:text-primary-400 group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5 transition-all shrink-0" />
          </div>
        </div>
      </div>
    </button>
  );
}
