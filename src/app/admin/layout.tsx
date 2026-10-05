"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Sidebar from "../../../components/Sidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [authorized, setAuthorized] = useState<boolean | null>(null);
  // Only matters below 768px — on desktop the sidebar is always shown.
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.replace("/login");
    } else {
      setAuthorized(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (authorized === null || authorized === false) {
    return <div style={{ background: "#0C1626", height: "100vh" }} />;
  }

  return (
    <div className="admin-shell">
      <style>{`
        .admin-shell {
          display: flex;
          height: 100vh;
          height: 100dvh;
          background: #0C1626;
          overflow: hidden;
        }
        .admin-body {
          flex: 1;
          min-width: 0;
          display: flex;
          flex-direction: column;
        }
        .admin-topbar {
          display: none;
          align-items: center;
          gap: 12px;
          padding: 10px 16px;
          background: #152341;
          border-bottom: 1px solid #2A3C5F;
          flex-shrink: 0;
        }
        .menu-toggle {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 40px;
          height: 40px;
          min-height: 40px;
          padding: 0;
          background: transparent;
          border: 1px solid #2A3C5F;
          border-radius: 8px;
          color: #E8EFF8;
          cursor: pointer;
        }
        .menu-toggle:active { background: #18294A; }
        .admin-main {
          flex: 1;
          min-width: 0;
          overflow-y: auto;
          padding: 24px 32px;
          color: #E8EFF8;
        }
        @media (max-width: 1024px) {
          .admin-main { padding: 20px 24px; }
        }
        @media (max-width: 767px) {
          .admin-topbar { display: flex; }
          .admin-main { padding: 16px; }
        }
      `}</style>

      <Sidebar isSidebarOpen={sidebarOpen} setIsSidebarOpen={setSidebarOpen} />

      <div className="admin-body">
        {/* Mobile-only top bar; keeps the toggle out of the page content */}
        <header className="admin-topbar">
          <button
            className="menu-toggle"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-label="Toggle sidebar"
            aria-expanded={sidebarOpen}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>
          <Image
            src="/images/livo-logo.png"
            alt="Livolife"
            width={560}
            height={258}
            style={{ width: 88, height: "auto" }}
            priority
          />
        </header>

        <main className="admin-main">{children}</main>
      </div>
    </div>
  );
}
