
import React, { useRef } from "react";
import { Dialog } from "primereact/dialog";
import { Toast } from "primereact/toast";
import MeetingForm from "./components/MeetingForm";
import { meetingService } from "../../services/meetingService";
import { Meeting } from "../../data/mockData";

interface MeetingDetailsProps {
  visible: boolean;
  onHide: () => void;
  onSuccess?: () => void;
  meeting?: Meeting | null;
}

export default function MeetingDetails({ visible, onHide, onSuccess, meeting }: MeetingDetailsProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const toast = useRef<Toast>(null);
  
  const isNew = !meeting?.id;

  const handleSubmit = (data: any) => {
    if (isNew) {
        // Create
        meetingService.addMeeting(data).then(() => {
            if (toast.current) {
                toast.current.show({ severity: 'success', summary: 'Success', detail: 'Meeting created successfully', life: 3000 });
            }
            if (onSuccess) onSuccess();
            onHide();
        });
    } else {
        // Update
        // Merge existing meeting ID with form data
        const updatedMeeting = { ...meeting, ...data };
        
        meetingService.updateMeeting(updatedMeeting).then(() => {
            if (toast.current) {
                toast.current.show({ severity: 'success', summary: 'Success', detail: 'Meeting updated successfully', life: 3000 });
            }
            if (onSuccess) onSuccess();
            
            onHide();
        });
    }
  };

  // Custom header for Dialog
  const header = (
    <div className="flex items-center w-full text-slate-800 font-bold">
      {isNew ? "New Meeting" : `Meeting Details: ${meeting?.subject}`}
    </div>
  );

  // Custom footer for Dialog
  const footer = (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={onHide}
        className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded text-sm font-medium"
      >
        <i className="pi pi-undo mr-1 text-xs"></i>
        Close
      </button>
      <button
        type="button"
        onClick={() => formRef.current?.requestSubmit()}
        className={`px-4 py-2 text-white rounded text-sm font-medium ${isNew ? "bg-green-600 hover:bg-green-700" : "bg-[#D2691E] hover:bg-[#A0522D]"}`}
      >
        <i className={`pi ${isNew ? "pi-plus" : "pi-check"} mr-1 text-xs`}></i>
        {isNew ? "Create" : "Update"}
      </button>
    </div>
  );

  return (
    <>
    <Toast ref={toast} />
    <Dialog
      header={header}
      visible={visible}
      style={{ width: "90vw", maxWidth: "1000px" }}
      contentClassName="p-0"
      headerClassName="bg-[#A7F3E0] py-3 px-4 border-b border-gray-200"
      onHide={onHide}
      footer={footer}
      blockScroll
    >
        <div className="p-4">
            <MeetingForm 
                ref={formRef} 
                key={meeting?.id || "new"}
                id="meeting-details-form" 
                initialData={meeting} 
                onSubmit={handleSubmit} 
            />
        </div>
    </Dialog>
    </>
  );
}
