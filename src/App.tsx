import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import BookingList from './pages/BookingList';
import BookingForm from './pages/BookingForm';
import BookingDetails from './pages/BookingDetails';
import PaymentForm from './pages/PaymentForm';
import RegistrationList from './pages/RegistrationList';
import RegistrationForm from './pages/RegistrationForm';
import RegistrationDetails from './pages/RegistrationDetails';
import SlotManagement from './pages/SlotManagement';
import AuditLogs from './pages/AuditLogs';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  return user ? <>{children}</> : <Navigate to="/login" />;
};

function AppRoutes() {
  const { user } = useAuth();

  return (
    <Routes>
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
      </Route>
    </Routes>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
