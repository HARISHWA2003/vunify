import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

/* ===================== DUMMY SERVICES ===================== */

import { taskService } from "../services/taskService";

import NewTask from "./tasks/NewTask.web";
import MeetingDetails from "./meetings/MeetingDetails.web";

interface AuthData {
  uId: string;
  roleId: string;
}

interface PortalItem {
  name: string;
  apprcount: number;
}

interface PortalCard {
  label: string;
  icon: string;
  count: number;
  list_route: string;
  new_route: string;
  isCustom?: boolean; // Flag to handle custom logic like Tasks
}

// Map names to PrimeIcons
const ICON_MAP: Record<string, string> = {
  tasks: "pi pi-check-square",
  leaves: "pi pi-calendar-minus",
  expenses: "pi pi-wallet",
  inventory: "pi pi-box",
  reports: "pi pi-chart-bar",
  settings: "pi pi-cog",
  meetings: "pi pi-calendar",
  payslips: "pi pi-file",
  team: "pi pi-users",
  assets: "pi pi-tablet",
  documents: "pi pi-file-o",
  calendar: "pi pi-calendar",
};

async function getAuthFromPreference(): Promise<AuthData | null> {
  if (typeof window === "undefined") return null;

  const raw = localStorage.getItem("auth");
  if (!raw) return null;

  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

async function getPortalByUser(roleId: string, uId: string): Promise<PortalItem[]> {
  await new Promise((r) => setTimeout(r, 300));

  // if (Math.random() < 0.3) return [];

  return [
    { name: "Tasks", apprcount: 12 },
    { name: "Leaves", apprcount: 3 },
    { name: "Expenses", apprcount: 0 },
    { name: "Inventory", apprcount: 6 },
    { name: "Reports", apprcount: 2 },
    { name: "Settings", apprcount: 1 },
    { name: "Meetings", apprcount: 4 },
    { name: "Payslips", apprcount: 0 },
    { name: "Team", apprcount: 8 },
    { name: "Assets", apprcount: 15 },
    { name: "Documents", apprcount: 5 },
    { name: "Calendar", apprcount: 1 },
  ];
}

/* ===================== TOAST (simple demo) ===================== */

function Toast({ message }: { message: string | null }) {
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
  const skeletonArray = useMemo(() => Array.from({ length: 12 }), []);

  const [uId, setUId] = useState<string>();
  const [roleId, setRoleId] = useState<string>();
  const [portalCards, setPortalCards] = useState<PortalCard[]>([]);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // New Task Modal State
  const [newTaskVisible, setNewTaskVisible] = useState(false);
  const [meetingModalVisible, setMeetingModalVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

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
      if (auth) {
          setUId(auth.uId);
          setRoleId(auth.roleId);

          // keep skeleton for 2 seconds (like your Angular setTimeout)
          setTimeout(() => {
            loadPortalWithRetry(auth.uId, auth.roleId);
          }, 2000);
      }
    } catch (err) {
      console.error("[Portal] Auth not available", err);
      finishLoading();
    }
  }

  async function waitForAuth(retries = 10, delayMs = 150): Promise<AuthData | null> {
    for (let i = 0; i < retries; i++) {
      const auth = await getAuthFromPreference();
      if (auth) return auth;
      await new Promise((res) => setTimeout(res, delayMs));
    }
    throw new Error("Auth not found after waiting");
  }

  function buildCardsFromApi(res: PortalItem[]): PortalCard[] {
    return res.map((item) => {
      const name = item.name.trim().toLowerCase();
      // Use map or default
      const iconClass = ICON_MAP[name] || "pi pi-circle";
      
      return {
        label: item.name,
        icon: iconClass,
        count: Number(item.apprcount ?? 0),
        list_route: `/${name}`,
        new_route: `/${name}/new`,
      };
    });
  }

  async function loadPortalWithRetry(uId_: string, roleId_: string, retryCount = 0) {
    try {
      const res = await getPortalByUser(roleId_, uId_);
      
      // Fetch real task count to override
      const tasks = await taskService.getTasks();
      const taskCount = tasks.length;
      
      // Override Tasks count in the response or append it if missing
      const taskItemIndex = res.findIndex(i => i.name === "Tasks");
      if (taskItemIndex !== -1) {
          res[taskItemIndex].apprcount = taskCount;
      } else {
          // ensure tasks exists if you want to show it
          res.unshift({ name: "Tasks", apprcount: taskCount });
      }

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

  function navigateOrToast(route: string) {
    try {
      navigate(route);
    } catch {
      showInfoToast();
    }
  }

  function onAdd(card: PortalCard) {
    if (card.label === "Tasks") {
        if (isMobile) {
            navigate("/tasks/new");
        } else {
            setNewTaskVisible(true);
        }
        return;
    }
    if (card.label === "Meetings") {
        // Open Meeting Modal for both Web and Mobile
        setMeetingModalVisible(true);
        return;
    }
    navigateOrToast(card.new_route);
  }

  function onCountClick(card: PortalCard) {
    navigateOrToast(card.list_route);
  }

  return (
    <div className="px-4 py-3 bg-[#EDE9FE] min-h-dvh">
      <Toast message={toastMsg} />
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
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
                    <div className={`w-12 h-12 mb-4 flex items-center justify-center rounded-xl bg-indigo-100 text-indigo-600`}>
                        <i className={`${c.icon} text-3xl`} />
                    </div>
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
      
      {/* New Task Modal (Web only, detected via logic but component renders conditionally controlled by visible prop) */}
      {!isMobile && (
          <NewTask 
            visible={newTaskVisible} 
            onHide={() => setNewTaskVisible(false)} 
            onSuccess={() => {
                // Refresh counts
                loadPortalWithRetry(uId!, roleId!);
            }} 
          />
      )}
      
      <MeetingDetails 
          visible={meetingModalVisible} 
          onHide={() => setMeetingModalVisible(false)} 
          meeting={null}
          onSuccess={() => {
              // Refresh counts if we had meetings count fetched dynamically, 
              // currently meetings count is mocked in getPortalByUser but we could reload.
              loadPortalWithRetry(uId!, roleId!);
          }}
      />
    </div>
  );
}
