// src/App.jsx
import { Navigate, Route, Routes } from "react-router-dom";
import { Toaster } from 'react-hot-toast';
import { DarkModeProvider } from './contexts/DarkModeContext';
import PrivateRoute from "./components/PrivateRoute";

import Login from "./pages/Login";
import Cadastro from "./pages/Cadastro";
import ProfileSetup from "./pages/ProfileSetup";
import InterestsSelection from "./pages/InterestsSelection";
import Feed from "./pages/Feed";
import Explore from "./pages/Explore";
import Notifications from "./pages/Notifications";
import Profile from "./pages/Profile";
import UserProfile from "./pages/UserProfile";
import Messages from "./pages/Messages";
import Settings from "./pages/Settings";
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import PostDetail from "./pages/PostDetail";
import AuthCallback from './pages/AuthCallback';

function App() {
  return (
    <DarkModeProvider>
      <Toaster 
        position="top-center"
        toastOptions={{
          duration: 3000,
          style: {
            background: 'var(--toast-bg)',
            color: 'var(--toast-color)',
          },
          className: 'dark:bg-gray-800 dark:text-white',
        }}
      />

      <Routes>
        {/* Rotas Públicas */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/cadastro" element={<Cadastro />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset" element={<ResetPassword />} />

        {/* Rotas de Onboarding */}
        <Route path="/profile-setup" element={
          <PrivateRoute><ProfileSetup /></PrivateRoute>
        } />

        <Route path="/auth/callback" element={<AuthCallback />} />

        <Route path="/interests" element={
          <PrivateRoute><InterestsSelection /></PrivateRoute>
        } />

        {/* Rotas Principais */}
        <Route path="/feed" element={
          <PrivateRoute><Feed /></PrivateRoute>
        } />
        <Route path="/explore" element={
          <PrivateRoute><Explore /></PrivateRoute>
        } />
        <Route path="/notifications" element={
          <PrivateRoute><Notifications /></PrivateRoute>
        } />
        <Route path="/messages" element={
          <PrivateRoute><Messages /></PrivateRoute>
        } />
        <Route path="/settings" element={
          <PrivateRoute><Settings /></PrivateRoute>
        } />

        {/* Rotas de Perfil */}
        <Route path="/profile" element={
          <PrivateRoute><Profile /></PrivateRoute>
        } />
        <Route path="/profile/:username" element={
          <PrivateRoute><UserProfile /></PrivateRoute>
        } />

        {/* Rotas de Post */}
        <Route path="/post/:postId" element={
          <PrivateRoute><PostDetail /></PrivateRoute>
        } />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/feed" replace />} />
      </Routes>
    </DarkModeProvider>
  );
}

export default App;