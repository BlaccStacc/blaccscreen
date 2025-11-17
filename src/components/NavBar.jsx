import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function NavBar() {
  const { user, signOut } = useAuth();

  return (
    <nav style={{ padding: "0.5rem 1rem", borderBottom: "1px solid #ccc" }}>
      <Link to="/" style={{ marginRight: "1rem" }}>
        Home
      </Link>
      {user && (
        <Link to="/dashboard" style={{ marginRight: "1rem" }}>
          Dashboard
        </Link>
      )}
      {user && (
        <Link to="/security/2fa" style={{ marginRight: "1rem" }}>
          Security / 2FA
        </Link>
      )}
      {!user && (
        <>
          <Link to="/login" style={{ marginRight: "1rem" }}>
            Login
          </Link>
          <Link to="/register">Register</Link>
        </>
      )}
      {user && (
        <button style={{ marginLeft: "1rem" }} onClick={signOut}>
          Logout
        </button>
      )}
    </nav>
  );
}
