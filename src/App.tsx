import { Routes, Route } from "react-router-dom";
import AppLayout from "./components/layout/AppLayout";


import { PrimeReactProvider, } from 'primereact/api';

import PortalPage from "./pages/PortalPage";
import TasksRoute from "./pages/tasks/TasksRoute";
import NewTaskMobile from "./pages/tasks/NewTask.mobile";
import TaskDetailsMobile from "./pages/tasks/TaskDetails.mobile";
import MeetingsRoute from "./pages/meetings/meetingsroute";
import NewMeetingMobile from "./pages/meetings/NewMeeting.mobile";
import MeetingDetailsMobile from "./pages/meetings/MeetingDetails.mobile";

// import Settings from "./pages/Settings";

// Optional placeholders so sidebar links don't 404
function Placeholder({ title }: { title: string }) {
  return (
    <div className="p-4 rounded-2xl bg-white ring-1 ring-black/5">
      <div className="text-xl font-bold">{title}</div>
      <div className="text-slate-600 mt-2">Coming soon.</div>
    </div>
  );
}

export default function App() {
  return (
    <PrimeReactProvider value={{ ripple: true }}>
    <Routes>
      {/* App Shell */}
      <Route element={<AppLayout />}>
        <Route path="/" element={<PortalPage />} />
<Route path="/tasks" element={<TasksRoute />} />
        <Route path="/tasks/new" element={<NewTaskMobile />} />
        <Route path="/tasks/:id" element={<TaskDetailsMobile />} />
<Route path="/meetings" element={<MeetingsRoute />} />
<Route path="/meetings/new" element={<NewMeetingMobile />} />
<Route path="/meetings/:id" element={<MeetingDetailsMobile />} />

        {/* <Route path="/settings" element={<Settings />} /> */}

        {/* placeholders */}
        <Route path="/projects" element={<Placeholder title="Projects" />} />
        <Route path="/workforce" element={<Placeholder title="Workforce" />} />
        <Route path="/finance" element={<Placeholder title="Finance" />} />
        <Route path="/planning" element={<Placeholder title="Planning" />} />
        <Route path="/scm" element={<Placeholder title="SCM" />} />
        <Route path="/grc" element={<Placeholder title="GRC & Audit" />} />
        <Route path="/admin" element={<Placeholder title="Admin" />} />
      </Route>
    </Routes>
    </PrimeReactProvider>
  );
}
