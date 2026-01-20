// src/pages/MeetingsPage.jsx
import { useMemo, useState } from "react";
import { Column } from "primereact/column";
import TableCard from "../../components/common/TableCard";

function makeMockMeetings(count = 176) {
  const organizers = ["Haris", "Asha", "Ravi", "Meena", "US"];
  const rooms = ["Conf A", "Conf B", "Teams", "Zoom", "Board Room"];
  const statuses = ["Scheduled", "In Progress", "Completed", "Cancelled"];
  const types = ["Standup", "Client Call", "Review", "Planning", "Retro"];

  const base = new Date();
  return Array.from({ length: count }).map((_, i) => {
    const d = new Date(base);
    d.setDate(base.getDate() + (i % 15));
    d.setHours(9 + (i % 8), (i % 4) * 15, 0, 0);

    const meetingNo = i + 1;
    return {
      id: meetingNo,
      name: `${meetingNo}. ${types[i % types.length]} — ${
        [
          "Weekly project sync",
          "Requirements discussion",
          "Sprint planning",
          "Design review",
          "Status update",
          "Stakeholder alignment",
        ][i % 6]
      }`,
      organizer: organizers[i % organizers.length],
      location: rooms[i % rooms.length],
      start: d.toISOString(),
      durationMin: [15, 30, 45, 60, 90][i % 5],
      attendees: 2 + (i % 8),
      status: statuses[i % statuses.length],
    };
  });
}

function formatDateTime(iso) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "-";
  return d.toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function MeetingsPage() {
  const meetings = useMemo(() => makeMockMeetings(176), []);

  // paginator (controlled)
  const [rows, setRows] = useState(5);
  const [first, setFirst] = useState(0);

  // sorting (controlled)
  const [sortField, setSortField] = useState("name");
  const [sortOrder, setSortOrder] = useState(1);

  const actionIcons = useMemo(
    () => [
      { icon: "pi pi-file-excel", label: "Excel", onClick: () => console.log("Excel") },
      { icon: "pi pi-file-pdf", label: "PDF", onClick: () => console.log("PDF") },
      { icon: "pi pi-filter", label: "Filter", onClick: () => console.log("Filter") },
      { icon: "pi pi-download", label: "Download", onClick: () => console.log("Download") },
      { icon: "pi pi-upload", label: "Upload", onClick: () => console.log("Upload") },
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
      onClick={() => console.log("meeting row:", row)}
    >
      {row.name}
    </button>
  );

  const dateBody = (row) => <span className="tabular-nums">{formatDateTime(row.start)}</span>;

  const trashBody = (row) => (
    <button
      type="button"
      className="h-8 w-8 rounded hover:bg-slate-100 flex items-center justify-center"
      title="Delete"
      onClick={() => console.log("delete meeting:", row)}
    >
      <i className="pi pi-trash text-slate-700" />
    </button>
  );

  return (
    <div className="p-4">
      <TableCard
        value={meetings}
        totalRecords={meetings.length}
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
          setSortOrder(e.sortOrder);
        }}
        actionIcons={actionIcons}
      >
        <Column
          field="name"
          header="Name"
          body={nameBody}
          sortable
          style={{ minWidth: "420px" }}
        />
        <Column field="organizer" header="Organizer" sortable style={{ minWidth: "140px" }} />
        <Column field="location" header="Location" sortable style={{ minWidth: "140px" }} />
        <Column
          field="start"
          header="Start"
          body={dateBody}
          sortable
          style={{ minWidth: "170px" }}
        />
        <Column
          field="durationMin"
          header="Duration"
          sortable
          style={{ minWidth: "110px" }}
          className="text-right"
          body={(row) => <span className="tabular-nums">{row.durationMin}</span>}
        />
        <Column
          field="attendees"
          header="Attendees"
          sortable
          style={{ minWidth: "120px" }}
          className="text-right"
          body={(row) => <span className="tabular-nums">{row.attendees}</span>}
        />
        <Column field="status" header="Status" sortable style={{ minWidth: "140px" }} />
        <Column header="" body={trashBody} style={{ width: "60px" }} />
      </TableCard>
    </div>
  );
}
