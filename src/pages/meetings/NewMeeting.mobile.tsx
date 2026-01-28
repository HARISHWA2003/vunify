
import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Toast } from "primereact/toast";
import MeetingForm from "./components/MeetingForm";
import { meetingService } from "../../services/meetingService";

export default function NewMeetingMobile() {
  const navigate = useNavigate();
  const formRef = useRef<HTMLFormElement>(null);
  const toast = useRef<Toast>(null);
  
  const handleSubmit = (data: any) => {
    // Add via service
    meetingService.addMeeting(data).then(() => {
        toast.current?.show({ severity: 'success', summary: 'Success', detail: 'Meeting added successfully', life: 1000 });
        setTimeout(() => {
            navigate("/meetings");
        }, 1000);
    });
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Toast ref={toast} />
      {/* HEADER (Desktop & Mobile) */}
      <div className="bg-white px-4 py-3 border-b border-gray-200 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <button 
            type="button" 
            onClick={() => navigate("/meetings")}
            className="text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100 transition-colors"
          >
            <i className="pi pi-arrow-left text-xl" />
          </button>
          <h1 className="text-lg font-bold text-slate-800">New Meeting</h1>
        </div>
        <button 
          onClick={() => formRef.current?.requestSubmit()}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1.5 rounded-md text-sm font-semibold transition-colors"
        >
          Save
        </button>
      </div>

      {/* FORM */}
      <div className="p-4 flex-1 overflow-y-auto">
         <MeetingForm ref={formRef} id="new-meeting-form-page" onSubmit={handleSubmit} />
      </div>

       {/* Footer Button (Mobile Sticky) */}
       <div className="p-4 border-t border-gray-200 bg-white md:hidden">
        <button
          type="button"
          onClick={() => formRef.current?.requestSubmit()}
          className="w-full py-3 bg-blue-600 text-white rounded-lg font-semibold text-lg shadow-md active:scale-[0.98] transition-transform"
        >
          Save Meeting
        </button>
      </div>
    </div>
  );
}
