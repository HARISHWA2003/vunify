import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Column } from "primereact/column";
import { Toast } from "primereact/toast";
import TableCard from "../../components/common/TableCard";
import { taskService } from "../../services/taskService";
import { Task } from "../../data/mockData";

import TaskDetails from "./TaskDetails.web";

export default function TasksPage() {
  const navigate = useNavigate();
  const toast = useRef<Toast>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Details Modal State
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [detailsVisible, setDetailsVisible] = useState(false);

  // paginator state (controlled)
  const [rows, setRows] = useState(5);
  const [first, setFirst] = useState(0);

  // sort state (controlled)
  const [sortField, setSortField] = useState("name");
  const [sortOrder, setSortOrder] = useState<0 | 1 | -1 | null>(1);

  const loadTasks = async () => {
    setLoading(true);
    try {
      const data = await taskService.getTasks();
      setTasks(data);
    } catch (error) {
      console.error("Failed to load tasks", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTasks();

    const handleTaskUpdate = () => loadTasks();
    window.addEventListener('task-updated', handleTaskUpdate);
    return () => window.removeEventListener('task-updated', handleTaskUpdate);
  }, []);

  const openDetails = (task: Task) => {
      setSelectedTask(task);
      setDetailsVisible(true);
  };

  const actionIcons = useMemo(
    () => [
      { icon: "pi pi-file-excel", label: "Excel", onClick: () => console.log("Excel") },
      { icon: "pi pi-file-pdf", label: "PDF", onClick: () => console.log("PDF") },
      // { icon: "pi pi-plus", label: "New Task", onClick: () => setModalVisible(true) }, // Moved to Topbar
      { icon: "pi pi-filter", label: "Filter", onClick: () => console.log("Filter") },
      { icon: "pi pi-download", label: "Download", onClick: () => console.log("Download") },
      { icon: "pi pi-upload", label: "Upload", onClick: () => console.log("Upload") },
      { icon: "pi pi-chart-line", label: "Chart", onClick: () => console.log("Chart") },
      { icon: "pi pi-search", label: "Search", onClick: () => console.log("Search") },
      { icon: "pi pi-refresh", label: "Refresh", onClick: () => loadTasks() },
      { icon: "pi pi-cog", label: "Settings", onClick: () => console.log("Settings") },
      { icon: "pi pi-question-circle", label: "Help", onClick: () => console.log("Help") },
    ],
    []
  );

  const nameBody = (row: Task) => (
    <button
      type="button"
      className="text-blue-600 hover:underline text-left truncate max-w-[520px]"
      title={row.name}
      onClick={() => openDetails(row)}
    >
      {row.name}
    </button>
  );

  const numberBody = (field: "percentComplete" | "lagDays" | "topDownDuration") => (row: Task) => (
    <span className="tabular-nums">{row[field]}</span>
  );

  const trashBody = (row: Task) => (
    <button
      type="button"
      className="h-8 w-8 rounded hover:bg-slate-100 flex items-center justify-center"
      title="Delete"
      onClick={() => console.log("delete:", row)}
    >
      <i className="pi pi-trash text-red-600 border p-2 bg-red-200 rounded-md" />
    </button>
  );

  const dateBody = (field: "estimatedStart" | "estimatedEnd" | "actualStart" | "actualEnd" | "revisedStart" | "revisedEnd") => (row: Task) => (
    <span className="tabular-nums">
      {row[field] ? new Date(row[field] as string).toLocaleDateString() : "-"}
    </span>
  );

  return (
    <div className="p-4 max-w-full overflow-x-hidden">
      <Toast ref={toast} />
      <TableCard
        value={tasks}
        totalRecords={tasks.length}
        rows={rows}
        first={first}
        onPage={(e) => {
          setFirst(e.first);
          setRows(e.rows);
        }}
        sortField={sortField}
        sortOrder={sortOrder}
        onSort={(e) => {
          setSortField(e.sortField);
          setSortOrder(e.sortOrder ?? null);
        }}
        actionIcons={actionIcons}
        loading={loading}
        scrollable
        scrollHeight="flex"
      >
        <Column field="name" header="Name" body={nameBody} sortable style={{ minWidth: "250px" }} frozen />
        <Column field="projectName" header="Project" sortable style={{ minWidth: "140px" }} />
        <Column field="assignedTo" header="Assignee" sortable style={{ minWidth: "140px" }} />
        <Column field="assignedBy" header="Assigned By" sortable style={{ minWidth: "150px" }} />
        <Column field="priority" header="Priority" sortable style={{ minWidth: "130px" }} />
        
        <Column 
          field="percentComplete" 
          header="% Comp." 
          body={numberBody("percentComplete")} 
          sortable 
          style={{ minWidth: "110px" }} 
          className="text-right" 
        />
        <Column field="lagType" header="Lag Type" sortable style={{ minWidth: "110px" }} />
        <Column 
          field="lagDays" 
          header="Lag" 
          body={numberBody("lagDays")} 
          sortable 
          style={{ minWidth: "100px" }} 
          className="text-right" 
        />
        <Column 
          field="topDownDuration" 
          header="Est. Dur" 
          body={numberBody("topDownDuration")} 
          sortable 
          style={{ minWidth: "110px" }} 
          className="text-right" 
        />

        <Column 
            field="parent" 
            header="Parent" 
            body={(row: Task) => {
                const parentTask = tasks.find(t => t.id === row.parent);
                return parentTask ? parentTask.name : "-";
            }}
            sortable 
            style={{ minWidth: "180px" }} 
        />
        
        <Column 
            field="estimatedStart" 
            header="Est. Start" 
            body={dateBody("estimatedStart")} 
            sortable 
            style={{ minWidth: "130px" }} 
        />
        <Column 
            field="estimatedEnd" 
            header="Est. End" 
            body={dateBody("estimatedEnd")} 
            sortable 
            style={{ minWidth: "130px" }} 
        />
        <Column 
            field="revisedStart" 
            header="Rev. Start" 
            body={dateBody("revisedStart")} 
            sortable 
            style={{ minWidth: "130px" }} 
        />
        <Column 
            field="revisedEnd" 
            header="Rev. End" 
            body={dateBody("revisedEnd")} 
            sortable 
            style={{ minWidth: "130px" }} 
        />
         <Column 
            field="actualStart" 
            header="Act. Start" 
            body={dateBody("actualStart")} 
            sortable 
            style={{ minWidth: "130px" }} 
        />
         <Column 
            field="actualEnd" 
            header="Act. End" 
            body={dateBody("actualEnd")} 
            sortable 
            style={{ minWidth: "130px" }} 
        />

        <Column header="" body={trashBody} style={{ width: "60px" }} frozen alignFrozen="right" />
      </TableCard>

        {selectedTask && (
            <TaskDetails 
                visible={detailsVisible} 
                onHide={() => setDetailsVisible(false)} 
                task={selectedTask}
                onSuccess={() => {
                   // Refresh is handled by task-updated event if emitted by service/NewTask, 
                   // but updateTask in service might not emit event automatically unless we added it?
                   // No, window event is standard here. TaskDetails.web.tsx does NOT emit event currently.
                   // I should add window dispatch in TaskDetails.web.tsx success handler or here.
                   window.dispatchEvent(new Event('task-updated'));
                }}
            />
        )}
    </div>
  );
}
