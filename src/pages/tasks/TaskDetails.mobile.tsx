import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Toast } from "primereact/toast";
import { taskService } from "../../services/taskService";
import TaskForm from "./components/TaskForm";

export default function TaskDetailsMobile() {
  const { id } = useParams(); // Expecting /tasks/:id
  const navigate = useNavigate();
  const toast = useRef<Toast>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const [task, setTask] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isEditMode, setIsEditMode] = useState(false);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    taskService.getTaskById(id).then((t) => {
      setTask(t);
      setLoading(false);
    });
  }, [id]);

  const handleUpdate = (data: any) => {
    // Assuming task has an id, merge updates
    const updated = { ...task, ...data };
    taskService.updateTask(updated).then(() => {
        if (toast.current) {
            toast.current.show({ severity: 'success', summary: 'Success', detail: 'Task updated successfully', life: 2000 });
        }
        setIsEditMode(false);
        setTask(updated); // Update local state
        // trigger global refresh if needed
        window.dispatchEvent(new Event('task-updated'));
    });
  };

  if (loading) {
    return <div className="p-4 text-center">Loading task...</div>;
  }

  if (!task) {
    return (
      <div className="p-4 text-center">
        <div className="text-red-600 mb-2">Task not found</div>
        <button onClick={() => navigate("/tasks")} className="text-blue-600 underline">
            Back to tasks
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
            onClick={() => navigate("/tasks")}
            className="flex items-center text-slate-600"
        >
            <i className="pi pi-arrow-left mr-2" />
            Back
        </button>
        
        <div className="font-semibold text-slate-800">
            {isEditMode ? "Edit Task" : "Task Details"}
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
        {/* We recreate key to force re-render form when switching modes or loading data if needed, 
            but TaskForm handles updates via props if we implement it right. 
            However, TaskForm uses internal state initialized from initialData. 
            To force update when task changes or mode changes (if needed), Key helps. 
         */}
        <TaskForm 
            key={task.id} 
            ref={formRef}
            initialData={task} 
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
                Update Task
            </button>
        </div>
      )}
    </div>
  );
}
