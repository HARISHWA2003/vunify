
import { INITIAL_TASKS, Task } from "../data/mockData";

// In-memory store (initialized from localStorage or default)
const loadFromStorage = (): Task[] => {
    try {
        const stored = localStorage.getItem("tasks_v3");
        if (stored) return JSON.parse(stored);
    } catch (e) {
        console.error("Failed to load tasks", e);
    }
    return [...INITIAL_TASKS];
};

let tasks: Task[] = loadFromStorage();

const saveToStorage = (newTasks: Task[]) => {
    try {
        localStorage.setItem("tasks_v3", JSON.stringify(newTasks));
    } catch (e) {
        console.error("Failed to save tasks", e);
    }
};

export const taskService = {
    getTasks: (): Promise<Task[]> => {
        return new Promise((resolve) => {
            // Simulate network delay
            setTimeout(() => {
                resolve([...tasks]);
            }, 300);
        });
    },

    getKey: (): number => {
        return tasks.length + 1;
    },

    getTaskById: (id: string): Promise<Task | undefined> => {
        return new Promise((resolve) => {
            setTimeout(() => {
                const task = tasks.find(t => t.id === id);
                resolve(task ? { ...task } : undefined);
            }, 300);
        });
    },

    addTask: (task: Partial<Task> & any): Promise<Task> => {
        return new Promise((resolve) => {
            setTimeout(() => {
                const nextId = (Math.max(...tasks.map(t => parseInt(t.id) || 0), 0) + 1).toString();

                // Helper to ensure dates are strings
                const processDate = (d: any) => (d instanceof Date ? d.toISOString() : d);

                const newTask: Task = {
                    id: nextId,
                    name: task.name || "Untitled Task",
                    assignedTo: task.assignedTo || "Unassigned",
                    // status: "Open", // Removed status as per request
                    lagType: "FS",
                    lagDays: "0",
                    topDownDuration: "1",
                    percentComplete: 0,
                    priority: "Medium",
                    projectName: "New Project",
                    parent: "",
                    assignedBy: "Admin",
                    ...task,
                    estimatedStart: processDate(task.estimatedStart),
                    estimatedEnd: processDate(task.estimatedEnd),
                    revisedStart: processDate(task.revisedStart),
                    revisedEnd: processDate(task.revisedEnd),
                    actualStart: processDate(task.actualStart),
                    actualEnd: processDate(task.actualEnd),
                };
                tasks = [newTask, ...tasks];
                saveToStorage(tasks);
                resolve(newTask);
            }, 300);
        });
    },

    updateTask: (updatedTask: Task & any): Promise<Task> => {
        return new Promise((resolve) => {
            setTimeout(() => {
                // Helper to ensure dates are strings
                const processDate = (d: any) => (d instanceof Date ? d.toISOString() : d);

                const finalTask = {
                    ...updatedTask,
                    estimatedStart: processDate(updatedTask.estimatedStart),
                    estimatedEnd: processDate(updatedTask.estimatedEnd),
                    revisedStart: processDate(updatedTask.revisedStart),
                    revisedEnd: processDate(updatedTask.revisedEnd),
                    actualStart: processDate(updatedTask.actualStart),
                    actualEnd: processDate(updatedTask.actualEnd),
                };

                tasks = tasks.map(t => t.id === finalTask.id ? finalTask : t);
                saveToStorage(tasks);
                resolve(finalTask);
            }, 300);
        });
    }
};
