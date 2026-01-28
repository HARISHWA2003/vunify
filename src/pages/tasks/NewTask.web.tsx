import React, { useRef } from "react";
import { Dialog } from "primereact/dialog";
import { Toast } from "primereact/toast";
import TaskForm from "./components/TaskForm";
import { taskService } from "../../services/taskService";

interface NewTaskProps {
  visible: boolean;
  onHide: () => void;
  onSuccess?: () => void;
  initialData?: any;
}

export default function NewTask({ visible, onHide, onSuccess, initialData }: NewTaskProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const toast = useRef<Toast>(null);
  
  const handleSubmit = (data: any) => {
    taskService.addTask(data).then(() => {
        if (toast.current) {
            toast.current.show({ severity: 'success', summary: 'Success', detail: 'Task added successfully', life: 3000 });
        }
        if (onSuccess) onSuccess();
        
        // Delay closing slightly to ensure toast sees light of day if it was inside dialog (but it's outside now)
        // Actually, if we close the dialog, the toast survives because it's in the fragment/portal?
        // Wait, if NewTask is unmounted, Toast dies. 
        // But NewTask is kept mounted in Topbar (conditionally visible).
        onHide();
    });
  };

  // Custom header for Dialog
  const header = (
    <div className="flex items-center w-full text-slate-800 font-bold">
      Add Task
    </div>
  );

  // Custom footer for Dialog
  const footer = (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={() => console.log("More clicked")}
        className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded text-sm font-medium"
      >
        More&gt;&gt;
      </button>
      <button
        type="button"
        onClick={onHide}
        className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded text-sm font-medium"
      >
        <i className="pi pi-undo mr-1 text-xs"></i>
        Back
      </button>
      <button
        type="button"
        onClick={() => formRef.current?.requestSubmit()}
        className="px-4 py-2 bg-[#D2691E] hover:bg-[#A0522D] text-white rounded text-sm font-medium"
      >
        <i className="pi pi-check mr-1 text-xs"></i>
        Submit
      </button>
      <button
        type="button"
        onClick={() => {
            formRef.current?.requestSubmit();
        }}
        className="px-4 py-2 bg-[#D2691E] hover:bg-[#A0522D] text-white rounded text-sm font-medium"
      >
        + Submit & Add
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
            <TaskForm ref={formRef} id="new-task-form" initialData={initialData} onSubmit={handleSubmit} />
        </div>
    </Dialog>
    </>
  );
}
