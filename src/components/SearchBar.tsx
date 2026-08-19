import { useState } from 'react';
import { Search } from 'lucide-react';
import { useRouter } from '@/lib/router';
import { useApp } from '@/lib/app-context';

interface SearchBarProps {
  defaultValue?: string;
  placeholder?: string;
  large?: boolean;
}

export function SearchBar({ defaultValue = '', placeholder, large = false }: SearchBarProps) {
  const { navigate } = useRouter();
  const { t } = useApp();
  const [query, setQuery] = useState(defaultValue);
  const ph = placeholder || t('nav.searchPlaceholder');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate({ name: 'products', search: query || undefined });
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className={`relative ${large ? 'max-w-3xl' : 'max-w-xl'}`}>
        <Search className={`absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 rtl:left-auto rtl:right-4 ${large ? 'w-5 h-5' : 'w-4 h-4'}`} />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={ph}
          className={`w-full ${large ? 'pl-14 pr-36 py-4 text-base rtl:pr-14 rtl:pl-36' : 'pl-10 pr-28 py-2.5 text-sm rtl:pr-10 rtl:pl-28'} rounded-xl border-2 border-slate-200 bg-white dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent shadow-lg transition-all`}
        />
        <button
          type="submit"
          className={`absolute right-2 top-1/2 -translate-y-1/2 rtl:right-auto rtl:left-2 ${large ? 'px-6 py-2.5 text-sm' : 'px-4 py-1.5 text-xs'} btn-accent rounded-lg`}
        >
          {t('nav.search')}
        </button>
      </div>
    </form>
  );
}
