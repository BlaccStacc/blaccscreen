import React, { useState } from "react";
import { QRCodeCanvas } from "qrcode.react";
import { apiFetch } from "../api";

export default function TwoFASetup() {
  const [secret, setSecret] = useState("");
  const [otpauthUrl, setOtpauthUrl] = useState("");
  const [code, setCode] = useState("");
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");

  const handleGenerate = async () => {
    setStatus("");
    setError("");
    setSecret("");
    setOtpauthUrl("");
    try {
      const data = await apiFetch("/auth/2fa/setup");
      setSecret(data.secret || "");
      setOtpauthUrl(data.otpauth_url || "");
      setStatus(
        "Scan the QR code with your authenticator app, then enter the 6-digit code.",
      );
    } catch (err) {
      setError(err.message || "Failed to init 2FA");
    }
  };

  const handleConfirm = async (e) => {
    e.preventDefault();
    setStatus("");
    setError("");
    try {
      const data = await apiFetch("/auth/2fa/confirm", {
        method: "POST",
        body: JSON.stringify({ code }),
      });
      setStatus(data.message || "2FA enabled!");
    } catch (err) {
      setError(err.message || "Failed to confirm 2FA");
    }
  };

  return (
    <div>
      <h2>Two-Factor Authentication</h2>
      <p>
        Set up 2FA with an authenticator app (Google Authenticator, Authy,
        etc.).
      </p>

      <button onClick={handleGenerate} style={{ marginBottom: "1rem" }}>
        Generate / Reset 2FA Secret
      </button>

      {otpauthUrl && (
        <div style={{ marginBottom: "1rem" }}>
          <h3>Scan this QR code</h3>
          <QRCodeCanvas value={otpauthUrl} size={192} />
          <p>
            <small>
              Or use this secret manually: <code>{secret}</code>
            </small>
          </p>
        </div>
      )}

      {otpauthUrl && (
        <form onSubmit={handleConfirm}>
          <div>
            <label>6-digit code from your app:</label>
            <br />
            <input
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="123456"
            />
          </div>
          <button type="submit" style={{ marginTop: "0.5rem" }}>
            Confirm 2FA
          </button>
        </form>
      )}

      {status && (
        <p style={{ color: "green", marginTop: "0.5rem" }}>{status}</p>
      )}
      {error && <p style={{ color: "red", marginTop: "0.5rem" }}>{error}</p>}
    </div>
  );
}
