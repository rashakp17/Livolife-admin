"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      router.replace("/admin/categories");
    } else {
      setChecking(false);
    }
  }, [router]);

  if (checking) return <div style={{ background: "#0C1626", height: "100vh" }} />;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch(`${apiUrl}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Login failed");
      }

      if (data.token) {
        localStorage.setItem("token", data.token);
        // localStorage.setItem("user", JSON.stringify(data.user));
        router.push("/admin/categories");
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unexpected error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      height: "100vh",
      background: "#0C1626",
      fontFamily: "'DM Sans', sans-serif"
    }}>
      <div style={{
        background: "#152341",
        padding: "40px",
        borderRadius: "12px",
        border: "1px solid #2A3C5F",
        width: "100%",
        maxWidth: "400px"
      }}>
        <div style={{ display: "flex", justifyContent: "center", marginBottom: "8px" }}>
          <Image src="/images/livo-logo.png" alt="Livolife" width={560} height={258} style={{ width: "150px", height: "auto" }} priority />
        </div>
        <h1 style={{ color: "#E8EFF8", marginBottom: "24px", fontFamily: "'Syne', sans-serif", fontSize: "18px", letterSpacing: "0.18em", textTransform: "uppercase", textAlign: "center", opacity: 0.7 }}>
          Admin Login
        </h1>

        {error && (
          <div style={{ background: "#ef444420", color: "#ef4444", padding: "12px", borderRadius: "8px", marginBottom: "20px", fontSize: "14px" }}>
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div>
            <label style={{ display: "block", color: "#7E93B4", fontSize: "12px", marginBottom: "6px" }}>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{
                width: "100%",
                padding: "12px",
                background: "#0C1626",
                border: "1px solid #2A3C5F",
                borderRadius: "8px",
                color: "#E8EFF8",
                fontSize: "14px",
                outline: "none"
              }}
            />
          </div>

          <div>
            <label style={{ display: "block", color: "#7E93B4", fontSize: "12px", marginBottom: "6px" }}>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{
                width: "100%",
                padding: "12px",
                background: "#0C1626",
                border: "1px solid #2A3C5F",
                borderRadius: "8px",
                color: "#E8EFF8",
                fontSize: "14px",
                outline: "none"
              }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              padding: "14px",
              background: "#E8EFF8",
              color: "#0C1626",
              border: "none",
              borderRadius: "8px",
              fontSize: "14px",
              fontWeight: 600,
              cursor: loading ? "not-allowed" : "pointer",
              marginTop: "10px",
              opacity: loading ? 0.7 : 1
            }}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}