import React from "react";
import { Routes, Route } from "react-router-dom";
import NavBar from "./components/NavBar";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./pages/Login";
import Login2FA from "./pages/Login2FA";
import Register from "./pages/Register";
import VerifyEmail from "./pages/VerifyEmail";
import Dashboard from "./pages/Dashboard";
import TwoFASetup from "./pages/TwoFASetup"; // 👈 add this
import NotFound from "./pages/NotFound";

export default function App() {
  return (
    <div>
      <NavBar />
      <div style={{ padding: "1rem" }}>
        <Routes>
          <Route path="/" element={<p>Welcome to Blaccend demo app</p>} />
          <Route path="/login" element={<Login />} />
          <Route path="/login-2fa" element={<Login2FA />} />
          <Route path="/register" element={<Register />} />
          <Route path="/verify-email" element={<VerifyEmail />} />

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          {/* 👇 NEW: protected 2FA setup page */}
          <Route
            path="/security/2fa"
            element={
              <ProtectedRoute>
                <TwoFASetup />
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </div>
  );
}
