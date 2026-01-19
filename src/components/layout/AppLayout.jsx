import { Outlet } from "react-router-dom";
import { useState } from "react";
import Topbar from "./Topbar";
import Sidebar from "./Sidebar";

export default function AppLayout() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Topbar always (no sidebar toggle in topbar now) */}
      <Topbar />

      {/* Body: sidebar + canvas */}
      <div className="flex">
        <Sidebar
          collapsed={sidebarCollapsed}
          onToggle={() => setSidebarCollapsed((v) => !v)}
        />

        {/* Canvas */}
        <main className="min-h-[calc(100vh-56px)] w-full bg-slate-50">
  <Outlet />
</main>

      </div>
    </div>
  );
}
