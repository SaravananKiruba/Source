import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CustomerAuthProvider, useCustomerAuth } from './context/CustomerAuthContext';
import Login from './pages/Login.tsx';
import Layout from './components/Layout.tsx';
import Dashboard from './pages/Dashboard.tsx';
import BookingList from './pages/BookingList.tsx';
import BookingForm from './pages/BookingForm.tsx';
import BookingDetails from './pages/BookingDetails.tsx';
import PaymentForm from './pages/PaymentForm.tsx';
import RegistrationList from './pages/RegistrationList.tsx';
import RegistrationForm from './pages/RegistrationForm.tsx';
import RegistrationDetails from './pages/RegistrationDetails.tsx';
import SlotManagement from './pages/SlotManagement.tsx';
import AuditLogs from './pages/AuditLogs.tsx';
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
      <Route path="/login" element={user ? <Navigate to="/" /> : <Login />} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="bookings" element={<BookingList />} />
        <Route path="bookings/new" element={<BookingForm />} />
        <Route path="bookings/:id" element={<BookingDetails />} />
        <Route path="bookings/:id/payment" element={<PaymentForm />} />
        <Route path="registrations" element={<RegistrationList />} />
        <Route path="registrations/new" element={<RegistrationForm />} />
        <Route path="registrations/:id" element={<RegistrationDetails />} />
        <Route path="slots" element={<SlotManagement />} />
        <Route path="audit-logs" element={<AuditLogs />} />
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
      <Route path="/customer/booking/:id" element={
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
