
export interface Task {
  id: string; // TaskID (1, 2, 3...)
  name: string; // Name *
  projectName: string; // Project *
  parent?: string; // Parent
  lagType?: string; // Lag Type *
  lagDays?: string; // Lag (days) *
  topDownDuration?: string; // Top-Down Duration (days) *
  assignedTo: string; // Assigned To *
  assignedBy?: string; // Assigned By
  priority?: string; // Priority
  percentComplete?: number; // % Complete
  estimatedStart?: string | null; // Estimated Start (ISO string for JSON simplicity)
  estimatedEnd?: string | null; // Estimated End
  revisedStart?: string | null; // Revised Start
  revisedEnd?: string | null; // Revised End
  actualStart?: string | null; // Actual Start
  actualEnd?: string | null; // Actual End
}

const today = new Date();
const addDays = (days: number) => {
  const d = new Date(today);
  d.setDate(d.getDate() + days);
  return d.toISOString();
};

export const INITIAL_TASKS: Task[] = [
  // Actual Tasks
  { id: "1", name: "Project Initialization", projectName: "Alpha", assignedTo: "Haris", assignedBy: "Admin", priority: "High", lagType: "FS", lagDays: "0", topDownDuration: "5", percentComplete: 100, parent: "p1", estimatedStart: addDays(-10), estimatedEnd: addDays(-5), actualStart: addDays(-10), actualEnd: addDays(-5) },
  { id: "2", name: "Requirement Gathering", projectName: "Alpha", assignedTo: "Asha", assignedBy: "Haris", priority: "High", lagType: "FS", lagDays: "0", topDownDuration: "3", percentComplete: 60, parent: "p1.1", estimatedStart: addDays(-4), estimatedEnd: addDays(-1), actualStart: addDays(-4) },
  { id: "3", name: "Design Database Schema", projectName: "Beta", assignedTo: "Ravi", assignedBy: "Haris", priority: "Medium", lagType: "SS", lagDays: "2", topDownDuration: "4", percentComplete: 0, parent: "p1.2", estimatedStart: addDays(0), estimatedEnd: addDays(4) },
  { id: "4", name: "API Development", projectName: "Beta", assignedTo: "Meena", assignedBy: "Admin", priority: "High", lagType: "FS", lagDays: "1", topDownDuration: "7", percentComplete: 30, parent: "p2.1", estimatedStart: addDays(5), estimatedEnd: addDays(12) },
  { id: "5", name: "Frontend Setup", projectName: "Gamma", assignedTo: "Haris", assignedBy: "Meena", priority: "Medium", lagType: "FS", lagDays: "0", topDownDuration: "2", percentComplete: 10, parent: "p2.1", estimatedStart: addDays(6), estimatedEnd: addDays(8) },
  { id: "6", name: "Authentication Flow", projectName: "Gamma", assignedTo: "Asha", assignedBy: "Haris", priority: "Critical", lagType: "FS", lagDays: "0", topDownDuration: "3", percentComplete: 50, parent: "p3.3", estimatedStart: addDays(8), estimatedEnd: addDays(11) },
  { id: "7", name: "Unit Testing", projectName: "Delta", assignedTo: "Ravi", assignedBy: "Meena", priority: "Low", lagType: "FS", lagDays: "3", topDownDuration: "5", percentComplete: 0, parent: "p2.1", estimatedStart: addDays(12), estimatedEnd: addDays(17) },
  { id: "8", name: "Integration Testing", projectName: "Delta", assignedTo: "Meena", assignedBy: "Admin", priority: "Medium", lagType: "FS", lagDays: "0", topDownDuration: "4", percentComplete: 0, parent: "p3.1", estimatedStart: addDays(18), estimatedEnd: addDays(22) },
  { id: "9", name: "Deployment Script", projectName: "Alpha", assignedTo: "Haris", assignedBy: "Ravi", priority: "High", lagType: "FS", lagDays: "0", topDownDuration: "2", percentComplete: 80, parent: "p3.1", estimatedStart: addDays(23), estimatedEnd: addDays(25) },
  { id: "10", name: "User Acceptance Testing", projectName: "Alpha", assignedTo: "Asha", assignedBy: "Haris", priority: "Critical", lagType: "FS", lagDays: "0", topDownDuration: "5", percentComplete: 0, parent: "p3.2", estimatedStart: addDays(26), estimatedEnd: addDays(31) },
];

export interface Meeting {
  id: string; // MeetingID (1, 2, 3...)
  subject: string; // Subject - Text Input
  type: string; // Type - Dropdown
  engagementType: string; // Engagement Type - Dropdown
  engagement: string; // Engagement - Dropdown
  relationship: string; // Relationship - Dropdown
  customerDepartment: string; // Customer / Department - Dropdown
  assignedTo: string; // Assigned To - Dropdown
  status: string; // Status - Dropdown
  startDate: string | null; // Start Date - Date Picker
  endDate: string | null; // End Date - Date Picker
  minutes: string[]; // Minutes - Text Input (Addable List)
}

export const INITIAL_MEETINGS: Meeting[] = [
  {
    id: "1",
    subject: "Sprint Review vs Client",
    type: "Online",
    engagementType: "Internal",
    engagement: "Project Alpha",
    relationship: "Vendor",
    customerDepartment: "IT",
    assignedTo: "Haris",
    status: "Scheduled",
    startDate: addDays(0),
    endDate: addDays(0),
    minutes: ["Discussed project milestones", "Reviewed budget"]
  },
  {
    id: "2",
    subject: "Weekly Sync",
    type: "Offline",
    engagementType: "External",
    engagement: "Project Beta",
    relationship: "Partner",
    customerDepartment: "Sales",
    assignedTo: "Asha",
    status: "Completed",
    startDate: addDays(-2),
    endDate: addDays(-2),
    minutes: ["Team updates", "Blockers identified"]
  },
  {
    id: "3",
    subject: "Design Kickoff",
    type: "Online",
    engagementType: "Internal",
    engagement: "Project Gamma",
    relationship: "Client",
    customerDepartment: "Marketing",
    assignedTo: "Ravi",
    status: "Cancelled",
    startDate: addDays(2),
    endDate: addDays(2),
    minutes: []
  }
];
