import { useMemo, useState } from "react";
import { Column } from "primereact/column";
import TableCard from "../../components/common/TableCard";

function makeMockTasks(count = 176) {
  const levels = ["Epic/Module", "Module", "Task", "Subtask"];
  const statuses = ["NS - Highe...", "In Progress", "Completed", "Blocked"];
  const assignees = ["US", "Haris", "Asha", "Ravi", "Meena"];

  return Array.from({ length: count }).map((_, i) => ({
    id: i + 1,
    name: `${i + 1}. ${
      [
        "For each import, show how many are success, how many are fail, ho...",
        "above as immediate audit trail for each import... so imports ui has...",
        "Auto extraction of structured minutes and actions - Harishwa",
        "Auto extraction of requirements, milestones from RFP - Harishwa",
        "Auto extraction of resume details from resumes - Harishwa",
      ][i % 5]
    }`,
    assignedTo: assignees[i % assignees.length],
    level: levels[i % levels.length],
    ctrlPath: i % 2 === 0 ? "Yes" : "No",
    sch: Number((Math.random() * 6000).toFixed(2)),
    eff: Number((Math.random() * 100).toFixed(2)),
    cost: Number((Math.random() * 100).toFixed(2)),
    parent: i % 3 === 0 ? "US" : "",
    status: statuses[i % statuses.length],
  }));
}

export default function TasksPage() {
  const tasks = useMemo(() => makeMockTasks(176), []);

  // paginator state (controlled)
  const [rows, setRows] = useState(5);
  const [first, setFirst] = useState(0);

  // sort state (controlled)
  const [sortField, setSortField] = useState("name");
  const [sortOrder, setSortOrder] = useState(1);

  const actionIcons = useMemo(
    () => [
      { icon: "pi pi-file-excel", label: "Excel", onClick: () => console.log("Excel") },
      { icon: "pi pi-file-pdf", label: "PDF", onClick: () => console.log("PDF") },
      { icon: "pi pi-filter", label: "Filter", onClick: () => console.log("Filter") },
      { icon: "pi pi-download", label: "Download", onClick: () => console.log("Download") },
      { icon: "pi pi-upload", label: "Upload", onClick: () => console.log("Upload") },
      { icon: "pi pi-chart-line", label: "Chart", onClick: () => console.log("Chart") },
      { icon: "pi pi-search", label: "Search", onClick: () => console.log("Search") },
      { icon: "pi pi-refresh", label: "Refresh", onClick: () => console.log("Refresh") },
      { icon: "pi pi-cog", label: "Settings", onClick: () => console.log("Settings") },
      { icon: "pi pi-question-circle", label: "Help", onClick: () => console.log("Help") },
    ],
    []
  );

  const nameBody = (row) => (
    <button
      type="button"
      className="text-blue-600 hover:underline text-left truncate max-w-[520px]"
      title={row.name}
      onClick={() => console.log("row:", row)}
    >
      {row.name}
    </button>
  );

  const numberBody = (field) => (row) => (
    <span className="tabular-nums">{row[field]}</span>
  );

  const trashBody = (row) => (
    <button
      type="button"
      className="h-8 w-8 rounded hover:bg-slate-100 flex items-center justify-center"
      title="Delete"
      onClick={() => console.log("delete:", row)}
    >
      <i className="pi pi-trash text-red-600 border p-2 bg-red-200 rounded-md" />
    </button>
  );

  return (
    <div className="p-4">
      <TableCard
        value={tasks}
        totalRecords={tasks.length}
        rows={rows}
        first={first}
        onRowsChange={(nextRows) => {
          setRows(nextRows);
          setFirst(0);
        }}
        onPage={(e) => {
          setFirst(e.first);
          setRows(e.rows);
        }}
        sortField={sortField}
        sortOrder={sortOrder}
        onSort={(e) => {
          setSortField(e.sortField);
          setSortOrder(e.sortOrder);
        }}
        actionIcons={actionIcons}
      >
        <Column field="name" header="Name" body={nameBody} sortable style={{ minWidth: "420px" }} />
        <Column field="assignedTo" header="Assigned To" sortable style={{ minWidth: "140px" }} />
        <Column field="level" header="Level" sortable style={{ minWidth: "120px" }} />
        <Column field="ctrlPath" header="Crtcl path" sortable style={{ minWidth: "110px" }} />

        <Column
          field="sch"
          header="Sch. 0%"
          body={numberBody("sch")}
          sortable
          style={{ minWidth: "110px" }}
          className="text-right"
        />
        <Column
          field="eff"
          header="Eff. 0%"
          body={numberBody("eff")}
          sortable
          style={{ minWidth: "110px" }}
          className="text-right"
        />
        <Column
          field="cost"
          header="Cost 0%"
          body={numberBody("cost")}
          sortable
          style={{ minWidth: "110px" }}
          className="text-right"
        />
        <Column field="parent" header="Parent" sortable style={{ minWidth: "110px" }} />
        <Column field="status" header="Status" sortable style={{ minWidth: "130px" }} />
        <Column header="" body={trashBody} style={{ width: "60px" }} />
      </TableCard>
    </div>
  );
}
