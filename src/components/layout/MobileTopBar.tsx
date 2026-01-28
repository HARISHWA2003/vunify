import { useNavigate } from "react-router-dom";

export default function MobileTopBar() {
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-40 h-14 bg-[#3b82f6] border-b flex items-center justify-between px-3">
      {/* LEFT: small logo */}
      <button
        type="button"
        onClick={() => navigate("/")}
        className="flex items-center"
      >
        <img
          src="/logo-small.png"
          alt="VUnify Logo"
          className="h-8 w-auto object-contain"
        />
      </button>

      {/* RIGHT: Alert + Account */}
      <div className="flex items-center gap-2">
        {/* Alert Button */}
        <button
          type="button"
          className="h-10 w-10 flex items-center justify-center rounded-full hover:bg-slate-100 ring-1 ring-slate-200"
          aria-label="Alerts"
        >
          <i className="pi pi-bell text-slate-700 text-lg" />
        </button>

        {/* Account Button */}
        <button
          type="button"
          className="h-10 w-10 flex items-center justify-center rounded-full bg-indigo-600 text-white font-semibold hover:bg-indigo-700"
          aria-label="Account"
        >
          D
        </button>
      </div>
    </header>
  );
}
