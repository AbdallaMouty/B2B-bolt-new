import { MapPin, BadgeCheck, ArrowRight, Eye } from 'lucide-react';
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
      className="card-hover group text-left overflow-hidden flex flex-col"
    >
      {/* Image */}
      <div className="relative aspect-[4/3] bg-slate-100 dark:bg-slate-800 overflow-hidden">
        {product.image_url ? (
          <img
            src={product.image_url}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-slate-300 dark:text-slate-600">
            <span className="text-4xl font-display">S</span>
          </div>
        )}
        {/* Top badges */}
        <div className="absolute top-0 left-0 right-0 p-2.5 flex items-start justify-between">
          {product.category && (
            <span className="badge bg-white/95 dark:bg-slate-900/95 text-primary-700 dark:text-primary-300 shadow-sm">
              {product.category.name}
            </span>
          )}
          {product.availability !== 'In Stock' && (
            <span className="badge bg-accent-500 text-white shadow-sm">
              {product.availability === 'Made to Order' ? t('product.madeToOrder') : product.availability === 'Out of Stock' ? t('product.outOfStock') : product.availability}
            </span>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-1">
        <h3 className="font-semibold text-slate-900 dark:text-slate-100 text-sm leading-snug mb-1.5 line-clamp-2 group-hover:text-primary-700 dark:group-hover:text-primary-400 transition-colors">
          {product.name}
        </h3>

        <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mb-3 flex-1">
          {truncate(product.description || '', 100)}
        </p>

        {/* Stats row */}
        <div className="flex items-center gap-3 text-xs text-slate-400 dark:text-slate-500 mb-3">
          {product.min_order_quantity && (
            <span className="flex items-center gap-1">
              <span className="font-semibold text-slate-600 dark:text-slate-300">{product.min_order_quantity}</span>
            </span>
          )}
          <span className="flex items-center gap-1">
            <Eye className="w-3 h-3" />
            {product.view_count}
          </span>
        </div>

        {/* Supplier */}
        <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-center justify-between gap-2">
            <div className="min-w-0">
              <p className="text-xs font-medium text-slate-700 dark:text-slate-200 truncate flex items-center gap-1">
                {product.company.name}
                {isVerified && <BadgeCheck className="w-3.5 h-3.5 text-success-500 shrink-0" />}
              </p>
              <p className="text-xs text-slate-400 dark:text-slate-500 flex items-center gap-1 mt-0.5">
                <MapPin className="w-3 h-3" />
                {product.company.city || t('common.iraq')}
              </p>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-300 dark:text-slate-600 group-hover:text-accent-500 group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5 transition-all shrink-0" />
          </div>
        </div>
      </div>
    </button>
  );
}
