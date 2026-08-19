import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

export type Route =
  | { name: 'home' }
  | { name: 'products'; search?: string; category?: string; location?: string; sort?: string }
  | { name: 'product'; slug: string }
  | { name: 'companies'; search?: string; category?: string; location?: string }
  | { name: 'company'; slug: string }
  | { name: 'supplier-register' }
  | { name: 'login' }
  | { name: 'signup' }
  | { name: 'dashboard' }
  | { name: 'dashboard-products' }
  | { name: 'dashboard-add-product' }
  | { name: 'dashboard-profile' }
  | { name: 'dashboard-messages' }
  | { name: 'dashboard-inquiries' }
  | { name: 'dashboard-analytics' }
  | { name: 'dashboard-settings' };

interface RouterContextType {
  route: Route;
  navigate: (route: Route) => void;
}

const RouterContext = createContext<RouterContextType | null>(null);

function parsePath(pathname: string, search: string): Route {
  const params = new URLSearchParams(search);
  const segments = pathname.split('/').filter(Boolean);

  if (segments.length === 0) return { name: 'home' };

  if (segments[0] === 'products') {
    return {
      name: 'products',
      search: params.get('search') || undefined,
      category: params.get('category') || undefined,
      location: params.get('location') || undefined,
      sort: params.get('sort') || undefined,
    };
  }

  if (segments[0] === 'product' && segments[1]) {
    return { name: 'product', slug: segments[1] };
  }

  if (segments[0] === 'companies') {
    return {
      name: 'companies',
      search: params.get('search') || undefined,
      category: params.get('category') || undefined,
      location: params.get('location') || undefined,
    };
  }

  if (segments[0] === 'company' && segments[1]) {
    return { name: 'company', slug: segments[1] };
  }

  if (segments[0] === 'supplier-register') return { name: 'supplier-register' };
  if (segments[0] === 'login') return { name: 'login' };
  if (segments[0] === 'signup') return { name: 'signup' };

  if (segments[0] === 'dashboard') {
    const sub = segments[1];
    switch (sub) {
      case 'products': return { name: 'dashboard-products' };
      case 'add-product': return { name: 'dashboard-add-product' };
      case 'profile': return { name: 'dashboard-profile' };
      case 'messages': return { name: 'dashboard-messages' };
      case 'inquiries': return { name: 'dashboard-inquiries' };
      case 'analytics': return { name: 'dashboard-analytics' };
      case 'settings': return { name: 'dashboard-settings' };
      default: return { name: 'dashboard' };
    }
  }

  return { name: 'home' };
}

function routeToPath(route: Route): string {
  switch (route.name) {
    case 'home': return '/';
    case 'products': {
      const params = new URLSearchParams();
      if (route.search) params.set('search', route.search);
      if (route.category) params.set('category', route.category);
      if (route.location) params.set('location', route.location);
      if (route.sort) params.set('sort', route.sort);
      const qs = params.toString();
      return qs ? `/products?${qs}` : '/products';
    }
    case 'product': return `/product/${route.slug}`;
    case 'companies': {
      const params = new URLSearchParams();
      if (route.search) params.set('search', route.search);
      if (route.category) params.set('category', route.category);
      if (route.location) params.set('location', route.location);
      const qs = params.toString();
      return qs ? `/companies?${qs}` : '/companies';
    }
    case 'company': return `/company/${route.slug}`;
    case 'supplier-register': return '/supplier-register';
    case 'login': return '/login';
    case 'signup': return '/signup';
    case 'dashboard': return '/dashboard';
    case 'dashboard-products': return '/dashboard/products';
    case 'dashboard-add-product': return '/dashboard/add-product';
    case 'dashboard-profile': return '/dashboard/profile';
    case 'dashboard-messages': return '/dashboard/messages';
    case 'dashboard-inquiries': return '/dashboard/inquiries';
    case 'dashboard-analytics': return '/dashboard/analytics';
    case 'dashboard-settings': return '/dashboard/settings';
  }
}

export function RouterProvider({ children }: { children: ReactNode }) {
  const [route, setRoute] = useState<Route>(() =>
    parsePath(window.location.pathname, window.location.search)
  );

  useEffect(() => {
    const onPop = () => {
      setRoute(parsePath(window.location.pathname, window.location.search));
    };
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);

  const navigate = (newRoute: Route) => {
    const path = routeToPath(newRoute);
    window.history.pushState({}, '', path);
    setRoute(newRoute);
    window.scrollTo(0, 0);
  };

  return (
    <RouterContext.Provider value={{ route, navigate }}>
      {children}
    </RouterContext.Provider>
  );
}

export function useRouter() {
  const ctx = useContext(RouterContext);
  if (!ctx) throw new Error('useRouter must be used within RouterProvider');
  return ctx;
}
