import { Outlet } from "react-router-dom";
import { useState, useEffect } from "react";
import Topbar from "./topbar";
import Sidebar from "./sidebar";

import MobileTopBar from "./MobileTopBar";

export default function AppLayout() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 767px)");

    const handleResize = () => {
      setIsMobile(mediaQuery.matches);
    };

    // Initial check
    handleResize();

    // Listen for screen size changes
    mediaQuery.addEventListener("change", handleResize);

    return () => {
      mediaQuery.removeEventListener("change", handleResize);
    };
  }, []);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Topbar logic */}
      {isMobile ? <MobileTopBar /> : <Topbar />}

      {/* Body */}
      <div className="flex">
        {/* Sidebar only on non-mobile */}
        {!isMobile && (
          <Sidebar
            collapsed={sidebarCollapsed}
            onToggle={() => setSidebarCollapsed((v) => !v)}
          />
        )}

        {/* Canvas */}
        <main className="min-h-[calc(100vh-56px)] flex-1 min-w-0 overflow-hidden bg-slate-50">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
