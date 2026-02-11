import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './AuthContext';
import Login from './Login';
import Register from './Register';
import Chat from './Chat';
import Layout from './Layout';
import Modules from './Modules';
import Lessons from './Lessons';
import LessonPlayer from './LessonPlayer';
import Feed from './Feed';

function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return null;
  return isAuthenticated ? children : <Navigate to="/login" replace />;
}

function PublicRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return null;
  return isAuthenticated ? <Navigate to="/modules" replace /> : children;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
      <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />

      <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
        <Route index element={<Navigate to="/modules" />} />
        <Route path="dashboard" element={<Navigate to="/modules" />} />
        <Route path="modules" element={<Modules />} />
        <Route path="modules/:id" element={<Lessons />} />
        <Route path="lessons/:id" element={<LessonPlayer />} />
        <Route path="feed" element={<Feed />} />
        <Route path="chat" element={<Chat />} />
      </Route>
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}