import { NavLink } from "react-router-dom";

const navItems = [
  { to: "/tasks", label: "Tasks", icon: "pi pi-check-square" },
  { to: "/meetings", label: "Meetings", icon: "pi pi-calendar" },
  { to: "/sales", label: "Sales", icon: "pi pi-shopping-cart" },
  { to: "/projects", label: "Projects", icon: "pi pi-briefcase" },
  { to: "/works", label: "Works", icon: "pi pi-wrench" },
  { to: "/my-space", label: "My Space", icon: "pi pi-user" },
  { to: "/workforce", label: "Workforce", icon: "pi pi-users" },
  { to: "/hcm", label: "HCM", icon: "pi pi-cog" },
  { to: "/company", label: "Company", icon: "pi pi-building" },
  { to: "/finance", label: "Finance", icon: "pi pi-dollar" },
  { to: "/planning", label: "Planning", icon: "pi pi-calendar" },
  { to: "/scm", label: "SCM", icon: "pi pi-box" },
  { to: "/grc-audit", label: "GRC & Audit", icon: "pi pi-shield" },
  { to: "/admin", label: "Admin", icon: "pi pi-cog" },
];

export default function Sidebar({ collapsed, onToggle }) {
  return (
    <aside
      className={[
        "sticky top-14 h-[calc(100vh-56px)] bg-white border-r",
        "flex flex-col",
        "transition-[width] duration-200",
        collapsed ? "w-[76px]" : "w-[240px]",
      ].join(" ")}
    >
      {/* Nav */}
      <nav className="px-4 pt-4 flex-1 overflow-y-auto">
        <ul className="space-y-5">
          {navItems.map((item) => (
            <li key={item.to}>
              <NavLink
                to={item.to}
                className={({ isActive }) =>
                  [
                    "flex items-center gap-4",
                    "text-slate-900",
                    "hover:opacity-80",
                    "outline-none",
                    isActive ? "font-semibold" : "font-medium",
                  ].join(" ")
                }
              >
                <i className={`${item.icon} text-xl w-6`} />
                {!collapsed ? (
                  <span className="text-[15px]">{item.label}</span>
                ) : null}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* Bottom collapse button */}
      <div className="p-4 flex justify-center">
        <button
          type="button"
          onClick={onToggle}
          className="h-10 w-10 rounded-full border border-slate-300 flex items-center justify-center hover:bg-slate-50"
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          <i
            className={[
              "pi text-sm text-slate-700",
              collapsed ? "pi-angle-right" : "pi-angle-left",
            ].join(" ")}
          />
        </button>
      </div>
    </aside>
  );
}
