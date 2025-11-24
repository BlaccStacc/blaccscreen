// src/pages/ForgotPassword.jsx
import React, { useState } from "react";
import { apiFetch } from "../api";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("");
    setError("");
    setLoading(true);

    try {
      const res = await apiFetch("/auth/password/forgot", {
        method: "POST",
        body: JSON.stringify({ email }),
      });
      setStatus(
        res.message ||
          "If an account with that email exists, a reset link has been sent.",
      );
    } catch (err) {
      // Still use generic message to avoid leaking info
      setStatus(
        "If an account with that email exists, a reset link has been sent.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Forgot Password</h2>
      <p>
        Enter your email and we&apos;ll send you a link to reset your password.
      </p>

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "0.5rem" }}>
          <label>Email</label>
          <br />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <button type="submit" disabled={loading}>
          {loading ? "Sending..." : "Send reset link"}
        </button>
      </form>

      {status && (
        <p style={{ color: "green", marginTop: "0.5rem" }}>{status}</p>
      )}
      {error && <p style={{ color: "red", marginTop: "0.5rem" }}>{error}</p>}
    </div>
  );
}
