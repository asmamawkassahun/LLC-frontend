import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ROUTES } from '@/constants/routes';
import { HomePage, AboutPage, PricingPage, ContactPage, LoginPage, RegisterPage, ForgotPasswordPage, VerifyCodePage, ResetPasswordPage, NotFoundPage, DashboardPage } from '@/pages';
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
import PaymentSuccess from './pages/order/payment/Success';
import AdminLayout from './layouts/AdminLayout';
import AdminProtectedRoute from './components/auth/AdminProtectedRoute';
import AdminLoginPage from './pages/admin/Login';
import AdminDashboardPage from './pages/admin/Dashboard';
import AdminOrdersPage from './pages/admin/Orders';
import AdminUsersPage from './pages/admin/Users';
import AdminCompaniesPage from './pages/admin/Companies';
import AdminPaymentsPage from './pages/admin/Payments';
import AdminPricingPlansPage from './pages/admin/PricingPlans';
import AdminPromoCodesPage from './pages/admin/PromoCodes';
import AdminMarketplacePage from './pages/admin/Marketplace';
import AdminAffiliatesPage from './pages/admin/Affiliates';
import AdminSupportPage from './pages/admin/Support';
import MaintenanceCheck from './components/MaintenanceCheck';
import Inbox from './components/sections/dashboard/Inbox';
import NotificationProvider from './components/NotificationProvider';
import SuspendedAccountPage from './pages/SuspendedAccount';


function App() {
  return (
    <BrowserRouter>
    <Toaster richColors position="top-right" />
      <MaintenanceCheck>
        <NotificationProvider>
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
          <Route path={ROUTES.FORGOT_PASSWORD} element={<ForgotPasswordPage />} />
          <Route path={ROUTES.VERIFY_CODE} element={<VerifyCodePage />} />
          <Route path={ROUTES.RESET_PASSWORD} element={<ResetPasswordPage />} />
        </Route>

        {/* Suspended Account Route - Accessible when authenticated but suspended */}
        <Route
          path={ROUTES.SUSPENDED}
          element={
            <ProtectedRoute>
              <SuspendedAccountPage />
            </ProtectedRoute>
          }
        />

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
          <Route path={ROUTES.INBOX} element={<Inbox />} />
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
        <Route path="/payment/success" element={<PaymentSuccess />} />

        {/* Admin Routes */}
        <Route path={ROUTES.ADMIN_LOGIN} element={<AdminLoginPage />} />
        <Route
          element={
            <AdminProtectedRoute>
              <AdminLayout />
            </AdminProtectedRoute>
          }
        >
          <Route path={ROUTES.ADMIN_DASHBOARD} element={<AdminDashboardPage />} />
          <Route path={ROUTES.ADMIN_ORDERS} element={<AdminOrdersPage />} />
          <Route path={ROUTES.ADMIN_USERS} element={<AdminUsersPage />} />
          <Route path={ROUTES.ADMIN_COMPANIES} element={<AdminCompaniesPage />} />
          <Route path={ROUTES.ADMIN_PAYMENTS} element={<AdminPaymentsPage />} />
          <Route path={ROUTES.ADMIN_PRICING_PLANS} element={<AdminPricingPlansPage />} />
          <Route path={ROUTES.ADMIN_PROMO_CODES} element={<AdminPromoCodesPage />} />
          <Route path={ROUTES.ADMIN_MARKETPLACE} element={<AdminMarketplacePage />} />
          <Route path={ROUTES.ADMIN_AFFILIATES} element={<AdminAffiliatesPage />} />
          <Route path={ROUTES.ADMIN_SUPPORT} element={<AdminSupportPage />} />
        </Route>
      </Routes>
        </NotificationProvider>
      </MaintenanceCheck>
    </BrowserRouter>
  );
}

export default App;