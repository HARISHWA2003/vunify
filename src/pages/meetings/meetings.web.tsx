import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Column } from "primereact/column";
import { Toast } from "primereact/toast";
import TableCard from "../../components/common/TableCard";
import { meetingService } from "../../services/meetingService";
import { Meeting } from "../../data/mockData";

import MeetingDetails from "./MeetingDetails.web";

export default function MeetingsPage() {
  const navigate = useNavigate();
  const toast = useRef<Toast>(null);
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Details Modal State
  const [selectedMeeting, setSelectedMeeting] = useState<Meeting | null>(null);
  const [detailsVisible, setDetailsVisible] = useState(false);

  // paginator state (controlled)
  const [rows, setRows] = useState(5);
  const [first, setFirst] = useState(0);

  // sort state (controlled)
  const [sortField, setSortField] = useState("subject");
  const [sortOrder, setSortOrder] = useState<0 | 1 | -1 | null>(1);

  const loadMeetings = async () => {
    setLoading(true);
    try {
      const data = await meetingService.getMeetings();
      setMeetings(data);
    } catch (error) {
      console.error("Failed to load meetings", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMeetings();
    
    // Listen for global updates (e.g. from New Meeting if implemented later)
    const handleMeetingUpdate = () => loadMeetings();
    window.addEventListener('meeting-updated', handleMeetingUpdate);
    return () => window.removeEventListener('meeting-updated', handleMeetingUpdate);
  }, []);

  const openDetails = (meeting: Meeting) => {
      setSelectedMeeting(meeting);
      setDetailsVisible(true);
  };

  const handleAddMeeting = () => {
    console.log("Adding new meeting");
    setSelectedMeeting(null);
    setDetailsVisible(true);
  };

  const actionIcons = [
      { icon: "pi pi-file-excel", label: "Excel", onClick: () => console.log("Excel") },
      { icon: "pi pi-file-pdf", label: "PDF", onClick: () => console.log("PDF") },
      { icon: "pi pi-plus", label: "New", onClick: handleAddMeeting },
      { icon: "pi pi-filter", label: "Filter", onClick: () => console.log("Filter") },
      { icon: "pi pi-download", label: "Download", onClick: () => console.log("Download") },
      { icon: "pi pi-upload", label: "Upload", onClick: () => console.log("Upload") },
      { icon: "pi pi-chart-line", label: "Chart", onClick: () => console.log("Chart") },
      { icon: "pi pi-search", label: "Search", onClick: () => console.log("Search") },
      { icon: "pi pi-refresh", label: "Refresh", onClick: () => loadMeetings() },
      { icon: "pi pi-cog", label: "Settings", onClick: () => console.log("Settings") },
      { icon: "pi pi-question-circle", label: "Help", onClick: () => console.log("Help") },
  ];

  const subjectBody = (row: Meeting) => (
    <button
      type="button"
      className="text-blue-600 hover:underline text-left truncate max-w-[520px]"
      title={row.subject}
      onClick={() => openDetails(row)}
    >
      {row.subject}
    </button>
  );

  const trashBody = (row: Meeting) => (
    <button
      type="button"
      className="h-8 w-8 rounded hover:bg-slate-100 flex items-center justify-center"
      title="Delete"
      onClick={() => console.log("delete meeting:", row)}
    >
      <i className="pi pi-trash text-red-600 border p-2 bg-red-200 rounded-md" />
    </button>
  );

  const dateBody = (field: "startDate" | "endDate") => (row: Meeting) => (
    <span className="tabular-nums">
      {row[field] ? new Date(row[field] as string).toLocaleDateString() : "-"}
    </span>
  );

  return (
    <div className="p-4 max-w-full overflow-x-hidden">
      <Toast ref={toast} />
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
          setSortOrder(e.sortOrder ?? null);
        }}
        actionIcons={actionIcons}
        loading={loading}
        scrollable
        scrollHeight="flex"
      >
        <Column field="subject" header="Subject" body={subjectBody} sortable style={{ minWidth: "250px" }} frozen />
        <Column field="engagement" header="Engagement" sortable style={{ minWidth: "150px" }} />
        <Column field="type" header="Type" sortable style={{ minWidth: "100px" }} />
        <Column field="engagementType" header="Eng. Type" sortable style={{ minWidth: "120px" }} />
        <Column field="assignedTo" header="Assignee" sortable style={{ minWidth: "120px" }} />
        <Column field="customerDepartment" header="Cust/Dept" sortable style={{ minWidth: "130px" }} />
        <Column field="relationship" header="Relationship" sortable style={{ minWidth: "120px" }} />
        <Column field="status" header="Status" sortable style={{ minWidth: "120px" }} />
        
        <Column 
            field="startDate" 
            header="Start Date" 
            body={dateBody("startDate")} 
            sortable 
            style={{ minWidth: "130px" }} 
        />
        <Column 
            field="endDate" 
            header="End Date" 
            body={dateBody("endDate")} 
            sortable 
            style={{ minWidth: "130px" }} 
        />

        <Column header="" body={trashBody} style={{ width: "60px" }} frozen alignFrozen="right" />
      </TableCard>

        <MeetingDetails 
            visible={detailsVisible} 
            onHide={() => setDetailsVisible(false)} 
            meeting={selectedMeeting}
            onSuccess={() => {
               window.dispatchEvent(new Event('meeting-updated'));
               loadMeetings();
            }}
        />
    </div>
  );
}
