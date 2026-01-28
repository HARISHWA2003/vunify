import { useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { OverlayPanel } from "primereact/overlaypanel";
import { ListBox } from "primereact/listbox";
import NewTask from "../../pages/tasks/NewTask.web";
import MeetingDetails from "../../pages/meetings/MeetingDetails.web";

export default function Topbar() {
  const location = useLocation();
  const navigate = useNavigate();

  const breadcrumbs = getBreadcrumbs(location.pathname);
  const op = useRef<OverlayPanel>(null);
  const [taskModalVisible, setTaskModalVisible] = useState(false);
  const [meetingModalVisible, setMeetingModalVisible] = useState(false);

  const createOptions = [
    { label: "Tasks", value: "tasks", icon: "pi pi-check-square" },
    { label: "Meetings", value: "meetings", icon: "pi pi-calendar" },
    { label: "Documents", value: "documents", icon: "pi pi-file" }
  ];

  return (
    <>
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
          
          <button
            type="button"
            className="h-10 w-10 rounded-lg hover:bg-slate-100 flex items-center justify-center"
            title="Create"
            aria-label="Create"
            onClick={(e) => op.current?.toggle(e)}
          >
            <i className="pi pi-plus text-lg text-slate-800" />
          </button>

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

    <OverlayPanel ref={op} className="p-0">
      <ListBox 
        options={createOptions} 
        optionLabel="label" 
        className="w-48 border-none"
        onChange={(e) => {
          if (e.value === 'tasks') {
            setTaskModalVisible(true);
            op.current?.hide();
          } else if (e.value === 'meetings') {
            setMeetingModalVisible(true);
            op.current?.hide();
          }
        }} 
      />
    </OverlayPanel>

    <NewTask 
      visible={taskModalVisible} 
      onHide={() => setTaskModalVisible(false)} 
      onSuccess={() => {
          // Emit event for other components to refresh
          window.dispatchEvent(new Event('task-updated'));
          // Modal closing is handled by NewTask calling onHide internally after success, 
          // or we can force close here too if we want double safety, 
          // but NewTask calls onHide itself in my previous edit.
          // Wait, NewTask calls onHide! So we don't need to do it here necessarily, 
          // but doing it here might be safer if NewTask implementation changes.
          // Actually, NewTask props: visible, onHide. NewTask calls onHide(). 
          // NewTask implementation: calls onHide() after toast.
          // So we update state here.
      }} 
    />

    <MeetingDetails 
      visible={meetingModalVisible} 
      onHide={() => setMeetingModalVisible(false)} 
      meeting={null}
      onSuccess={() => {
        window.dispatchEvent(new Event('meeting-updated'));
      }}
    />
    </>
  );
}

function IconButton({ icon, label }: { icon: string; label: string }) {
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

function getBreadcrumbs(pathname: string) {
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

function formatLabel(segment: string) {
  return segment
    .replace(/-/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}