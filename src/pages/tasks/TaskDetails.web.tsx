import React, { useRef } from "react";
import { Dialog } from "primereact/dialog";
import { Toast } from "primereact/toast";
import TaskForm from "./components/TaskForm";
import { taskService } from "../../services/taskService";
import { Task } from "../../data/mockData";

interface TaskDetailsProps {
  visible: boolean;
  onHide: () => void;
  onSuccess?: () => void;
  task: Task;
}

export default function TaskDetails({ visible, onHide, onSuccess, task }: TaskDetailsProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const toast = useRef<Toast>(null);
  
  const handleSubmit = (data: any) => {
    // Merge existing task ID with form data
    const updatedTask = { ...task, ...data };
    
    taskService.updateTask(updatedTask).then(() => {
        if (toast.current) {
            toast.current.show({ severity: 'success', summary: 'Success', detail: 'Task updated successfully', life: 3000 });
        }
        if (onSuccess) onSuccess();
        
        // Delay close slightly - or just close immediately
        onHide();
    });
  };

  // Custom header for Dialog
  const header = (
    <div className="flex items-center w-full text-slate-800 font-bold">
      Task Details: {task?.name}
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
        className="px-4 py-2 bg-[#D2691E] hover:bg-[#A0522D] text-white rounded text-sm font-medium"
      >
        <i className="pi pi-check mr-1 text-xs"></i>
        Update
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
            {/* Pass key={task.id} to force re-render when task changes if needed, but Dialog handles visibility. 
                Better to rely on initialData being set correctly. */}
            <TaskForm 
                ref={formRef} 
                key={task.id}
                id="task-details-form" 
                initialData={task} 
                onSubmit={handleSubmit} 
            />
        </div>
    </Dialog>
    </>
  );
}
