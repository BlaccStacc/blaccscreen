import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function NavBar() {
  const { user, signOut } = useAuth();

  return (
    <nav
      style={{
        padding: "0.6rem 1rem",
        borderBottom: "1px solid #ccc",
        display: "flex",
        alignItems: "center",
        gap: "1rem",
        backgroundColor: "#f8f8f8",
      }}
    >
      {/* Left: brand / home */}
      <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
        <Link to="/" style={{ fontWeight: "bold", textDecoration: "none" }}>
          Blaccend
        </Link>

        {user && (
          <>
            <Link to="/dashboard" style={{ textDecoration: "none" }}>
              Dashboard
            </Link>
            {/* 👇 NEW garage link */}
            <Link to="/garage" style={{ textDecoration: "none" }}>
              Garage
            </Link>
            <Link to="/security/2fa" style={{ textDecoration: "none" }}>
              Security / 2FA
            </Link>
          </>
        )}
      </div>

      {/* Right: auth controls */}
      <div
        style={{
          marginLeft: "auto",
          display: "flex",
          alignItems: "center",
          gap: "0.75rem",
        }}
      >
        {!user && (
          <>
            <Link to="/login" style={{ textDecoration: "none" }}>
              Login
            </Link>
            <Link to="/register" style={{ textDecoration: "none" }}>
              Register
            </Link>
          </>
        )}

        {user && (
          <>
            <span style={{ fontSize: "0.9rem", color: "#555" }}>
              {user.username || user.email || "Logged in"}
            </span>
            <button
              onClick={signOut}
              style={{
                padding: "0.3rem 0.7rem",
                borderRadius: "4px",
                border: "1px solid #ccc",
                background: "white",
                cursor: "pointer",
              }}
            >
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
}
