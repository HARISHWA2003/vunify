
import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Toast } from "primereact/toast";
import { meetingService } from "../../services/meetingService";
import MeetingForm from "./components/MeetingForm";

export default function MeetingDetailsMobile() {
  const { id } = useParams(); // Expecting /meetings/:id
  const navigate = useNavigate();
  const toast = useRef<Toast>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const [meeting, setMeeting] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isEditMode, setIsEditMode] = useState(false);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    meetingService.getMeetingById(id).then((m) => {
      setMeeting(m);
      setLoading(false);
    });
  }, [id]);

  const handleUpdate = (data: any) => {
    // Assuming meeting has an id, merge updates
    const updated = { ...meeting, ...data };
    meetingService.updateMeeting(updated).then(() => {
        if (toast.current) {
            toast.current.show({ severity: 'success', summary: 'Success', detail: 'Meeting updated successfully', life: 2000 });
        }
        setIsEditMode(false);
        setMeeting(updated); // Update local state
        // trigger global refresh if needed
        window.dispatchEvent(new Event('meeting-updated'));
    });
  };

  if (loading) {
    return <div className="p-4 text-center">Loading meeting...</div>;
  }

  if (!meeting) {
    return (
      <div className="p-4 text-center">
        <div className="text-red-600 mb-2">Meeting not found</div>
        <button onClick={() => navigate("/meetings")} className="text-blue-600 underline">
            Back to meetings
        </button>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-slate-50 min-h-screen">
      <Toast ref={toast} />
      
      {/* HEADER */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-200 px-4 h-14 flex items-center justify-between">
        <button 
            type="button"
            onClick={() => navigate("/meetings")}
            className="flex items-center text-slate-600"
        >
            <i className="pi pi-arrow-left mr-2" />
            Back
        </button>
        
        <div className="font-semibold text-slate-800">
            {isEditMode ? "Edit Meeting" : "Meeting Details"}
        </div>
        
        <button
            type="button"
            onClick={() => setIsEditMode(!isEditMode)}
            className="text-blue-600 font-medium"
        >
            {isEditMode ? "Cancel" : "Edit"}
        </button>
      </div>

      {/* CONTENT */}
      <div className="flex-1 overflow-y-auto p-4 pb-24">
        <MeetingForm 
            key={meeting.id} 
            ref={formRef}
            initialData={meeting} 
            onSubmit={handleUpdate} 
            readOnly={!isEditMode}
        />
      </div>

      {/* FOOTER ACTION (Edit Mode Only) */}
      {isEditMode && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4 flex gap-3 z-10">
            <button
                type="button"
                onClick={() => setIsEditMode(false)}
                className="flex-1 py-3 rounded-lg border border-gray-300 text-gray-700 font-medium"
            >
                Cancel
            </button>
            <button
                type="button"
                onClick={() => formRef.current?.requestSubmit()}
                className="flex-1 py-3 rounded-lg bg-blue-600 text-white font-bold shadow-lg"
            >
                Update Meeting
            </button>
        </div>
      )}
    </div>
  );
}
