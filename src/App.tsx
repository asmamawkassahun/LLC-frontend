import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ROUTES } from '@/constants/routes';
import { HomePage, AboutPage, PricingPage, ContactPage, LoginPage, RegisterPage, NotFoundPage, DashboardPage } from '@/pages';
import MainLayout from '@/layouts/MainLayout';
import AuthLayout from '@/layouts/AuthLayout';
import DashboardLayout from '@/layouts/DashboardLayout';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import PublicRoute from '@/components/auth/PublicRoute';
import AddOrderPage from './pages/order/Add';
import CountrySelectionPage from './pages/order/CountrySelection';
import PaymentSummary from './pages/order/payment/PaymentSummary';
import PaymentPage from './pages/order/payment/Payment';
import Marketplace from './components/sections/dashboard/marketplace/Marketplace';
import Referrals from './components/sections/dashboard/Referrals';
import Settings from './components/sections/dashboard/Settings';
import Orders from './components/sections/dashboard/Orders';
import { Toaster } from './components/ui/sonner';

function App() {
  return (
    <BrowserRouter>
    <Toaster richColors position="top-right" />
      <Routes>
        {/* Routes with MainLayout (with Navbar) */}
        <Route element={<MainLayout />}>
          <Route path={ROUTES.HOME} element={<HomePage />} />
          <Route path={ROUTES.ABOUT} element={<AboutPage />} />
          <Route path={ROUTES.PRICING} element={<PricingPage />} />
          <Route path={ROUTES.CONTACT} element={<ContactPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>

        {/* Routes with AuthLayout (without Navbar) - Public routes (redirect if authenticated) */}
        <Route
          element={
            <PublicRoute>
              <AuthLayout />
            </PublicRoute>
          }
        >
          <Route path={ROUTES.LOGIN} element={<LoginPage />} />
          <Route path={ROUTES.REGISTER} element={<RegisterPage />} />
        </Route>

        {/* Protected Routes with DashboardLayout (with Navbar) */}
        <Route
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route path={ROUTES.DASHBOARD} element={<DashboardPage />} />
          <Route path={`${ROUTES.MARKETPLACE}/:serviceCode?`} element={<Marketplace />} />
          <Route path={ROUTES.AFFILIATE_PROGRAM} element={<Referrals />} />
          <Route path={ROUTES.SETTINGS} element={<Settings />} />
          <Route path={ROUTES.ORDERS} element={<Orders />} />
          <Route path={ROUTES.ORDER_COUNTRY_SELECTION} element={<CountrySelectionPage />} />
          <Route path="/orders/:orderId" element={<AddOrderPage />} />
          <Route path="/order/add/:plan" element={<AddOrderPage />} />
          <Route path={ROUTES.ORDER_ADD} element={<AddOrderPage />} />
          <Route path="/order/payment/:id" element={<PaymentSummary />} />
        </Route>
        {/* Protected Routes without sidebar - Payment upgrade page */}
        <Route
          path="/order/upgrade/:id"
          element={
            <ProtectedRoute>
              <PaymentPage type="payment" />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;