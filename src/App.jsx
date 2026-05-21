import { Navigate, Route, Routes } from "react-router-dom";
import { Toaster } from 'react-hot-toast';
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
import Chat from "./pages/Chat";
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import PostDetail from "./pages/PostDetail";

function App() {
  return (
    <>
      <Toaster />

      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/cadastro" element={<Cadastro />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset" element={<ResetPassword />} />

        <Route path="/profile-setup" element={
          <PrivateRoute><ProfileSetup /></PrivateRoute>
        } />

        <Route path="/interesses" element={
          <PrivateRoute><InterestsSelection /></PrivateRoute>
        } />

        <Route path="/feed" element={
          <PrivateRoute><Feed /></PrivateRoute>
        } />

        <Route path="/post/:postId" element={
          <PrivateRoute><PostDetail /></PrivateRoute>
        } />

        <Route path="/explorar" element={
          <PrivateRoute><Explore /></PrivateRoute>
        } />

        <Route path="/notificacoes" element={
          <PrivateRoute><Notifications /></PrivateRoute>
        } />

        <Route path="/perfil" element={
          <PrivateRoute><Profile /></PrivateRoute>
        } />

        <Route path="/perfil/:username" element={
          <PrivateRoute><UserProfile /></PrivateRoute>
        } />

        <Route path="/chat" element={
          <PrivateRoute><Chat /></PrivateRoute>
        } />

        <Route path="*" element={<Navigate to="/feed" replace />} />
      </Routes>
    </>
  );
}

export default App;