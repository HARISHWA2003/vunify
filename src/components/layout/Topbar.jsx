import { useLocation, useNavigate } from "react-router-dom";

export default function Topbar() {
  const location = useLocation();
  const navigate = useNavigate();

  const breadcrumbs = getBreadcrumbs(location.pathname);

  return (
    <header className="sticky top-0 z-40 h-14 bg-white border-b">
      <div className="h-full flex items-center justify-between pr-3 gap-3">
{/* LEFT: logo (flush left, full height) */}
<button
  type="button"
  onClick={() => navigate("/")}
  className="h-14 flex items-center hover:bg-slate-50"
  aria-label="Go to Portal"
  title="Portal"
>
  <img
    src="/logo.png"
    alt="VUnifyOrg.ai"
    className="h-full w-auto object-contain"
  />
</button>



        {/* CENTER: BREADCRUMBS */}
        <div className="flex-1 overflow-hidden">
          <nav className="flex items-center text-sm text-slate-700 truncate">
            {breadcrumbs.map((bc, idx) => (
              <div key={bc.path} className="flex items-center">
                {idx > 0 && <span className="mx-2 text-slate-400">/</span>}

                {idx < breadcrumbs.length - 1 ? (
                  <button
                    onClick={() => navigate(bc.path)}
                    className="hover:text-blue-600 hover:underline truncate"
                  >
                    {bc.label}
                  </button>
                ) : (
                  <span className="font-semibold text-slate-900 truncate">
                    {bc.label}
                  </span>
                )}
              </div>
            ))}
          </nav>
        </div>

        {/* RIGHT: actions */}
        <div className="flex items-center gap-1">
          {/* Home + dropdown */}
          <div className="flex items-center rounded-lg bg-slate-100 ring-1 ring-slate-200 overflow-hidden">
            <button
              type="button"
              className="h-10 w-10 flex items-center justify-center hover:bg-slate-200"
              title="Home"
              aria-label="Home"
              onClick={() => navigate("/")}
            >
              <i className="pi pi-home text-lg text-slate-800" />
            </button>
            <button
              type="button"
              className="h-10 w-8 flex items-center justify-center hover:bg-slate-200"
              title="Home menu"
              aria-label="Home menu"
            >
              <i className="pi pi-chevron-down text-sm text-slate-700" />
            </button>
          </div>

          <IconButton icon="pi pi-clock" label="Recent" />
          <IconButton icon="pi pi-file" label="Documents" />
          <IconButton icon="pi pi-upload" label="Upload" />
          <IconButton icon="pi pi-chart-bar" label="Analytics" />
          <IconButton icon="pi pi-search" label="Search" />
          <IconButton icon="pi pi-plus" label="Create" />

          {/* Profile */}
          <button
            type="button"
            className="ml-2 h-10 w-10 rounded-xl bg-indigo-600 text-white font-semibold flex items-center justify-center hover:bg-indigo-700"
            title="Profile"
            aria-label="Profile"
          >
            D
          </button>
        </div>
      </div>
    </header>
  );
}

function IconButton({ icon, label }) {
  return (
    <button
      type="button"
      className="h-10 w-10 rounded-lg hover:bg-slate-100 flex items-center justify-center"
      title={label}
      aria-label={label}
    >
      <i className={`${icon} text-lg text-slate-800`} />
    </button>
  );
}


/* ===================== HELPERS ===================== */

function getBreadcrumbs(pathname) {
  const segments = pathname.split("/").filter(Boolean);

  const crumbs = [{ label: "Portal", path: "/" }];
  let currentPath = "";

  segments.forEach((seg) => {
    currentPath += `/${seg}`;
    crumbs.push({
      label: formatLabel(seg),
      path: currentPath,
    });
  });

  return crumbs;
}

function formatLabel(segment) {
  return segment
    .replace(/-/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}