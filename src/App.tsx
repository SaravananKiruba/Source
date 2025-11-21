import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CustomerAuthProvider, useCustomerAuth } from './context/CustomerAuthContext';
import LoginWithOTP from './pages/LoginWithOTP.tsx';
import Layout from './components/Layout.tsx';
import Dashboard from './pages/Dashboard.tsx';
import OrderList from './pages/OrderList.tsx';
import OrderForm from './pages/OrderForm.tsx';
import PaymentFormUpdated from './pages/PaymentFormUpdated.tsx';
import PlotManagement from './pages/PlotManagement.tsx';
import SendPaymentLink from './pages/SendPaymentLink.tsx';
import BankPaymentNotification from './pages/BankPaymentNotification.tsx';
import InProgressOrdersReport from './pages/InProgressOrdersReport.tsx';
import GenerateBookingLink from './pages/GenerateBookingLink.tsx';
import CustomerLogin from './pages/customer/CustomerLogin.tsx';
import CustomerDashboard from './pages/customer/CustomerDashboard.tsx';
import CustomerBookingForm from './pages/customer/CustomerBookingForm.tsx';
import CustomerPayment from './pages/customer/CustomerPayment.tsx';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  return user ? <>{children}</> : <Navigate to="/login" />;
};

const CustomerProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { customer } = useCustomerAuth();
  return customer ? <>{children}</> : <Navigate to="/customer/login" />;
};

function AppRoutes() {
  const { user } = useAuth();

  return (
    <Routes>
      {/* Staff Routes */}
      <Route path="/login" element={user ? <Navigate to="/" /> : <LoginWithOTP />} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="orders" element={<OrderList />} />
        <Route path="orders/new" element={<OrderForm />} />
        <Route path="orders/:id/payment" element={<PaymentFormUpdated />} />
        <Route path="plots" element={<PlotManagement />} />
        <Route path="send-payment-link" element={<SendPaymentLink />} />
        <Route path="bank-payment" element={<BankPaymentNotification />} />
        <Route path="reports/in-progress" element={<InProgressOrdersReport />} />
        <Route path="generate-link" element={<GenerateBookingLink />} />
      </Route>

      {/* Customer Routes */}
      <Route path="/customer/login" element={<CustomerLogin />} />
      <Route path="/customer/dashboard" element={
        <CustomerProtectedRoute>
          <CustomerDashboard />
        </CustomerProtectedRoute>
      } />
      <Route path="/customer/booking" element={
        <CustomerProtectedRoute>
          <CustomerBookingForm />
        </CustomerProtectedRoute>
      } />
      <Route path="/customer/order/:id" element={
        <CustomerProtectedRoute>
          <CustomerDashboard />
        </CustomerProtectedRoute>
      } />
      <Route path="/customer/payment/:id" element={
        <CustomerProtectedRoute>
          <CustomerPayment />
        </CustomerProtectedRoute>
      } />
    </Routes>
  );
}

function App() {
  return (
    <HashRouter>
      <AuthProvider>
        <CustomerAuthProvider>
          <AppRoutes />
        </CustomerAuthProvider>
      </AuthProvider>
    </HashRouter>
  );
}

export default App;
