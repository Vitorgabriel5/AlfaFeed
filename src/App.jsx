import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

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

function App() {

  return (
    <BrowserRouter>

      <Routes>

        <Route path="/" element={<Login />} />

        <Route path="/cadastro" element={<Cadastro />} />

      <Route path="/forgot-password" element={<ForgotPassword />} />  
       
      <Route path="/reset" element={<ResetPassword />} />
        <Route
          path="/profile-setup"
          element={<ProfileSetup />}
        />

        <Route
          path="/interesses"
          element={<InterestsSelection />}
        />

        <Route path="/feed" element={<Feed />} />

        <Route
          path="/explorar"
          element={<Explore />}
        />

        <Route
          path="/notificacoes"
          element={<Notifications />}
        />

        <Route path="/perfil" element={<Profile />} />

        <Route
          path="/perfil/:username"
          element={<UserProfile />}
        />

        <Route path="/chat" element={<Chat />} />

        <Route
          path="*"
          element={<Navigate to="/feed" replace />}
        />

      </Routes>

    </BrowserRouter>
  );
}

export default App;