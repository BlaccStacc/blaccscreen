// src/pages/ResetPassword.jsx
import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { apiFetch } from "../api";

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [token, setToken] = useState("");

  useEffect(() => {
    const t = searchParams.get("token");
    if (!t) {
      setError("Missing or invalid reset token");
    } else {
      setToken(t);
    }
  }, [searchParams]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("");
    setError("");

    if (!token) {
      setError("Missing or invalid reset token");
      return;
    }

    if (password.length < 6) {
      setError("Password should be at least 6 characters");
      return;
    }

    if (password !== confirm) {
      setError("Passwords do not match");
      return;
    }

    try {
      const res = await apiFetch("/auth/password/reset", {
        method: "POST",
        body: JSON.stringify({ token, password }),
      });
      setStatus(
        res.message || "Password updated successfully. You can now log in.",
      );
      // Optionally redirect after a short delay
      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (err) {
      setError(err.message || "Failed to reset password");
    }
  };

  return (
    <div>
      <h2>Reset Password</h2>

      {!token && (
        <p style={{ color: "red" }}>
          Missing or invalid reset token. Try requesting a new password reset
          link.
        </p>
      )}

      {token && (
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "0.5rem" }}>
            <label>New password</label>
            <br />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div style={{ marginBottom: "0.5rem" }}>
            <label>Confirm new password</label>
            <br />
            <input
              type="password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              required
            />
          </div>
          <button type="submit">Update password</button>
        </form>
      )}

      {status && (
        <p style={{ color: "green", marginTop: "0.5rem" }}>{status}</p>
      )}
      {error && <p style={{ color: "red", marginTop: "0.5rem" }}>{error}</p>}
    </div>
  );
}
