import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

/* ===================== DUMMY SERVICES ===================== */

async function getAuthFromPreference() {
  if (typeof window === "undefined") return null;

  const raw = localStorage.getItem("auth");
  if (!raw) return null;

  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

async function getPortalByUser(roleId, uId) {
  await new Promise((r) => setTimeout(r, 300));

  if (Math.random() < 0.3) return [];

  return [
    { name: "Tasks", apprcount: 12 },
    { name: "Leaves", apprcount: 3 },
    { name: "Expenses", apprcount: 0 },
    { name: "Inventory", apprcount: 6 },
    { name: "Reports", apprcount: 2 },
    { name: "Settings", apprcount: 1 },
  ];
}

/* ===================== TOAST (simple demo) ===================== */

function Toast({ message }) {
  if (!message) return null;
  return (
    <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50">
      <div className="rounded-xl bg-white shadow-lg ring-1 ring-black/10 px-4 py-3 text-sm">
        <div className="font-semibold text-slate-900">Info</div>
        <div className="text-slate-700">{message}</div>
      </div>
    </div>
  );
}

/* ===================== PAGE ===================== */

export default function PortalPage() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const skeletonArray = useMemo(() => Array.from({ length: 6 }), []);

  const [uId, setUId] = useState();
  const [roleId, setRoleId] = useState();
  const [portalCards, setPortalCards] = useState([]);
  const [toastMsg, setToastMsg] = useState(null);

  useEffect(() => {
    // Demo helper: set auth once if missing
    if (!localStorage.getItem("auth")) {
      localStorage.setItem(
        "auth",
        JSON.stringify({ uId: "U-1001", roleId: "R-ADMIN" })
      );
    }

    loadAuthAndPortal();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function loadAuthAndPortal() {
    try {
      const auth = await waitForAuth();
      setUId(auth.uId);
      setRoleId(auth.roleId);

      // keep skeleton for 2 seconds (like your Angular setTimeout)
      setTimeout(() => {
        loadPortalWithRetry(auth.uId, auth.roleId);
      }, 2000);
    } catch (err) {
      console.error("[Portal] Auth not available", err);
      finishLoading();
    }
  }

  async function waitForAuth(retries = 10, delayMs = 150) {
    for (let i = 0; i < retries; i++) {
      const auth = await getAuthFromPreference();
      if (auth) return auth;
      await new Promise((res) => setTimeout(res, delayMs));
    }
    throw new Error("Auth not found after waiting");
  }

  function buildCardsFromApi(res) {
    return res.map((item) => {
      const name = item.name.trim().toLowerCase();
      return {
        label: item.name,
        icon: `/icons/portal/${name}.svg`,
        count: Number(item.apprcount ?? 0),
        list_route: `/${name}`,
        new_route: `/${name}/new`,
      };
    });
  }

  async function loadPortalWithRetry(uId_, roleId_, retryCount = 0) {
    try {
      const res = await getPortalByUser(roleId_, uId_);

      if (!res.length && retryCount < 3) {
        setTimeout(
          () => loadPortalWithRetry(uId_, roleId_, retryCount + 1),
          400
        );
        return;
      }

      setPortalCards(buildCardsFromApi(res));
      finishLoading();
    } catch (err) {
      console.error("[Portal][API ERROR]", err);
      finishLoading();
    }
  }

  function finishLoading() {
    setLoading(false);
  }

  function showInfoToast() {
    setToastMsg("use web platform for this module since it is under development");
    window.setTimeout(() => setToastMsg(null), 2500);
  }

  function navigateOrToast(route) {
    try {
      navigate(route);
    } catch {
      showInfoToast();
    }
  }

  function onAdd(card) {
    navigateOrToast(card.new_route);
  }

  function onCountClick(card) {
    navigateOrToast(card.list_route);
  }

  return (
    <div className="px-4 py-3 bg-[#EDE9FE] min-h-dvh">
      <Toast message={toastMsg} />
      <div className="grid grid-cols-2 gap-3">
        {loading ? (
          <>
            {skeletonArray.map((_, idx) => (
              <div
                key={idx}
                className="relative rounded-2xl bg-white shadow-sm ring-1 ring-slate-900/5 px-4 py-5 min-h-[140px] animate-pulse"
              >
                <div className="flex justify-between items-start">
                  <div className="flex flex-col items-start">
                    <div className="w-8 h-8 mb-2 rounded bg-slate-200" />
                    <div className="h-4 w-24 rounded bg-slate-200" />
                  </div>

                  <div className="w-8 h-8 rounded-lg bg-slate-200" />
                </div>

                <div className="mt-6">
                  <div className="h-6 w-16 rounded bg-slate-200" />
                </div>
              </div>
            ))}
          </>
        ) : (
          <>
            {portalCards.map((c) => (
              <div
                key={c.label}
                className="group relative rounded-2xl bg-white shadow-sm ring-1 ring-slate-900/5 hover:shadow-md hover:ring-slate-900/10 transition px-4 py-5 min-h-[140px]"
              >
                <div className="flex justify-between items-start">
                  <div className="flex flex-col items-start">
                    <img
                      src={c.icon}
                      className="w-8 h-8 mb-2"
                      onError={(e) => {
                        const img = e.currentTarget;
                        img.onerror = null;
                        img.src = "/icons/portal/settings.svg";
                      }}
                      alt=""
                    />
                    <div className="text-[15px] md:text-md font-medium text-slate-800 leading-snug">
                      {c.label}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => onAdd(c)}
                    className="w-8 h-8 flex items-center justify-center rounded-lg ring-1 ring-gray-300 bg-white hover:bg-gray-50"
                    aria-label={`Add ${c.label}`}
                  >
                    <span className="text-blue-900 text-lg leading-none">+</span>
                  </button>
                </div>

                <div className="mt-4">
                  <button
                    type="button"
                    onClick={() => onCountClick(c)}
                    className="text-2xl md:text-2xl font-bold text-black leading-tight hover:text-blue-700 transition cursor-pointer text-left"
                    aria-label={`Open ${c.label}`}
                  >
                    {c.count}
                  </button>
                </div>
              </div>
            ))}
          </>
        )}
      </div>

      {/* Optional debug (remove later) */}
      <div className="mt-4 text-xs text-slate-600">
        <div>uId: {uId ?? "-"}</div>
        <div>roleId: {roleId ?? "-"}</div>
      </div>
    </div>
  );
}
