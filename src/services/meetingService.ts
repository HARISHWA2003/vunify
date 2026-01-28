
import { INITIAL_MEETINGS, Meeting } from "../data/mockData";

// In-memory store (initialized from localStorage or default)
const loadFromStorage = (): Meeting[] => {
    try {
        const stored = localStorage.getItem("meetings_v1");
        if (stored) return JSON.parse(stored);
    } catch (e) {
        console.error("Failed to load meetings", e);
    }
    return [...INITIAL_MEETINGS];
};

let meetings: Meeting[] = loadFromStorage();

const saveToStorage = (newMeetings: Meeting[]) => {
    try {
        localStorage.setItem("meetings_v1", JSON.stringify(newMeetings));
    } catch (e) {
        console.error("Failed to save meetings", e);
    }
};

export const meetingService = {
    getMeetings: (): Promise<Meeting[]> => {
        return new Promise((resolve) => {
            // Simulate network delay
            setTimeout(() => {
                resolve([...meetings]);
            }, 300);
        });
    },

    getKey: (): number => {
        return meetings.length + 1;
    },

    getMeetingById: (id: string): Promise<Meeting | undefined> => {
        return new Promise((resolve) => {
            setTimeout(() => {
                const meeting = meetings.find(m => m.id === id);
                resolve(meeting ? { ...meeting } : undefined);
            }, 300);
        });
    },

    addMeeting: (meeting: Partial<Meeting> & any): Promise<Meeting> => {
        return new Promise((resolve) => {
            setTimeout(() => {
                const nextId = (Math.max(...meetings.map(m => parseInt(m.id) || 0), 0) + 1).toString();

                // Helper to ensure dates are strings
                const processDate = (d: any) => (d instanceof Date ? d.toISOString() : d);

                const newMeeting: Meeting = {
                    id: nextId,
                    subject: meeting.subject || "Untitled Meeting",
                    type: meeting.type || "Online",
                    engagementType: meeting.engagementType || "Internal",
                    engagement: meeting.engagement || "",
                    relationship: meeting.relationship || "Vendor",
                    customerDepartment: meeting.customerDepartment || "",
                    assignedTo: meeting.assignedTo || "Unassigned",
                    status: meeting.status || "Scheduled",
                    startDate: processDate(meeting.startDate),
                    endDate: processDate(meeting.endDate),
                    minutes: meeting.minutes || [],
                    ...meeting,
                };
                meetings = [newMeeting, ...meetings];
                saveToStorage(meetings);
                resolve(newMeeting);
            }, 300);
        });
    },

    updateMeeting: (updatedMeeting: Meeting & any): Promise<Meeting> => {
        return new Promise((resolve) => {
            setTimeout(() => {
                // Helper to ensure dates are strings
                const processDate = (d: any) => (d instanceof Date ? d.toISOString() : d);

                const finalMeeting = {
                    ...updatedMeeting,
                    startDate: processDate(updatedMeeting.startDate),
                    endDate: processDate(updatedMeeting.endDate),
                };

                meetings = meetings.map(m => m.id === finalMeeting.id ? finalMeeting : m);
                saveToStorage(meetings);
                resolve(finalMeeting);
            }, 300);
        });
    }
};
