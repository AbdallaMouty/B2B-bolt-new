import { AuthProvider } from '@/lib/auth';
import { RouterProvider, useRouter } from '@/lib/router';
import { AppProvider } from '@/lib/app-context';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { HomePage } from '@/pages/HomePage';
import { ProductsPage } from '@/pages/ProductsPage';
import { ProductDetailPage } from '@/pages/ProductDetailPage';
import { CompaniesPage } from '@/pages/CompaniesPage';
import { CompanyProfilePage } from '@/pages/CompanyProfilePage';
import { SupplierRegisterPage } from '@/pages/SupplierRegisterPage';
import { AuthPage } from '@/pages/AuthPage';
import { DashboardPage } from '@/pages/DashboardPage';

function AppContent() {
  const { route } = useRouter();

  const renderPage = () => {
    switch (route.name) {
      case 'home': return <HomePage />;
      case 'products': return <ProductsPage />;
      case 'product': return <ProductDetailPage />;
      case 'companies': return <CompaniesPage />;
      case 'company': return <CompanyProfilePage />;
      case 'supplier-register': return <SupplierRegisterPage />;
      case 'login': return <AuthPage mode="login" />;
      case 'signup': return <AuthPage mode="signup" />;
      case 'dashboard':
      case 'dashboard-products':
      case 'dashboard-add-product':
      case 'dashboard-profile':
      case 'dashboard-messages':
      case 'dashboard-inquiries':
      case 'dashboard-analytics':
      case 'dashboard-settings':
        return <DashboardPage />;
      default: return <HomePage />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 transition-colors">
      <Header />
      <main className="flex-1">
        {renderPage()}
      </main>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <AppProvider>
      <AuthProvider>
        <RouterProvider>
          <AppContent />
        </RouterProvider>
      </AuthProvider>
    </AppProvider>
  );
}

export default App;
