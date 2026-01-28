
import React, { useState } from "react";
import TextInput from "../../../components/common/inputs/TextInput";
import Dropdown from "../../../components/common/inputs/Dropdown";
import InputDate from "../../../components/common/inputs/InputDate";

// Mock Data Options
const typeOptions = [
  { label: "Online", value: "Online" },
  { label: "Offline", value: "Offline" },
];

const engagementTypeOptions = [
  { label: "Internal", value: "Internal" },
  { label: "External", value: "External" },
];

const engagementOptions = [
  { label: "Project Alpha", value: "Project Alpha" },
  { label: "Project Beta", value: "Project Beta" },
  { label: "Project Gamma", value: "Project Gamma" },
];

const relationshipOptions = [
  { label: "Vendor", value: "Vendor" },
  { label: "Partner", value: "Partner" },
  { label: "Client", value: "Client" },
];

const customerDeptOptions = [
  { label: "IT", value: "IT" },
  { label: "Sales", value: "Sales" },
  { label: "Marketing", value: "Marketing" },
  { label: "HR", value: "HR" },
];

const assigneeOptions = [
  { label: "Haris", value: "Haris" },
  { label: "Asha", value: "Asha" },
  { label: "Ravi", value: "Ravi" },
  { label: "Meena", value: "Meena" },
];

const statusOptions = [
  { label: "Scheduled", value: "Scheduled" },
  { label: "Completed", value: "Completed" },
  { label: "Cancelled", value: "Cancelled" },
];

interface MeetingFormProps {
  id?: string;
  initialData?: any;
  onSubmit: (data: any) => void;
  readOnly?: boolean;
}

// eslint-disable-next-line react/display-name
const MeetingForm = React.forwardRef<HTMLFormElement, MeetingFormProps>(({ id, initialData, onSubmit, readOnly }, ref) => {
  const [formData, setFormData] = useState(initialData || {
    subject: "",
    type: null,
    engagementType: null,
    engagement: null,
    relationship: null,
    customerDepartment: null,
    assignedTo: null,
    status: "Scheduled",
    startDate: null,
    endDate: null,
    minutes: [],
  });

  const [newMinute, setNewMinute] = useState("");

  const updateField = (field: string, value: any) => {
    if (readOnly) return;
    setFormData((prev: any) => ({ ...prev, [field]: value }));
  };

  const addMinute = () => {
      if (!newMinute.trim()) return;
      updateField("minutes", [...(formData.minutes || []), newMinute]);
      setNewMinute("");
  };

  const removeMinute = (index: number) => {
      const newMinutes = [...(formData.minutes || [])];
      newMinutes.splice(index, 1);
      updateField("minutes", newMinutes);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!readOnly) onSubmit(formData);
  };

  return (
    <form id={id} ref={ref} onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-4xl mx-auto w-full">
      
      {/* 1. Subject */}
      <TextInput
        label="Subject"
        value={formData.subject}
        onChange={(e) => updateField("subject", e.target.value)}
        placeholder="Enter meeting subject"
        mandatory
        disabled={readOnly}
      />

      {/* 2. Type | Engagement Type */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Dropdown
            label="Type"
            options={typeOptions}
            value={formData.type}
            onChange={(e) => updateField("type", e.value)}
            placeholder="Select Type"
            className="w-full"
            disabled={readOnly}
        />
        <Dropdown
            label="Engagement Type"
            options={engagementTypeOptions}
            value={formData.engagementType}
            onChange={(e) => updateField("engagementType", e.value)}
            placeholder="Select Engagement Type"
            className="w-full"
            disabled={readOnly}
        />
      </div>

      {/* 3. Engagement | Relationship */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Dropdown
            label="Engagement"
            options={engagementOptions}
            value={formData.engagement}
            onChange={(e) => updateField("engagement", e.value)}
            placeholder="Select Engagement"
            className="w-full"
            disabled={readOnly}
        />
        <Dropdown
            label="Relationship"
            options={relationshipOptions}
            value={formData.relationship}
            onChange={(e) => updateField("relationship", e.value)}
            placeholder="Select Relationship"
            className="w-full"
            disabled={readOnly}
        />
      </div>

      {/* 4. Customer/Department | Assigned To */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Dropdown
            label="Customer / Department"
            options={customerDeptOptions}
            value={formData.customerDepartment}
            onChange={(e) => updateField("customerDepartment", e.value)}
            placeholder="Select Customer/Dept"
            className="w-full"
            disabled={readOnly}
        />
        <Dropdown
            label="Assigned To"
            options={assigneeOptions}
            value={formData.assignedTo}
            onChange={(e) => updateField("assignedTo", e.value)}
            placeholder="Select User"
            filter
            className="w-full"
            disabled={readOnly}
        />
      </div>

      {/* 5. Status */}
      <Dropdown
        label="Status"
        options={statusOptions}
        value={formData.status}
        onChange={(e) => updateField("status", e.value)}
        placeholder="Select Status"
        className="w-full"
        disabled={readOnly}
      />

      {/* 6. Start Date | End Date */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <InputDate
            label="Start Date"
            value={formData.startDate}
            onChange={(e) => updateField("startDate", e.value)}
            dateFormat="dd M yy"
            showIcon
            disabled={readOnly}
        />
        <InputDate
            label="End Date"
            value={formData.endDate}
            onChange={(e) => updateField("endDate", e.value)}
            dateFormat="dd M yy"
            showIcon
            disabled={readOnly}
        />
      </div>

      {/* 7. Minutes (Addable List) */}
      <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-slate-700">Minutes</label>
          {!readOnly && (
            <div className="flex gap-2">
                <input 
                    type="text" 
                    value={newMinute}
                    onChange={(e) => setNewMinute(e.target.value)}
                    placeholder="Add a minute item..."
                    className="flex-1 p-2 border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addMinute())}
                />
                <button 
                    type="button" 
                    onClick={addMinute}
                    className="bg-blue-600 text-white px-3 py-2 rounded hover:bg-blue-700"
                >
                    Add
                </button>
            </div>
          )}
          
          <ul className="list-disc list-inside bg-slate-50 p-2 rounded border border-slate-200 min-h-[50px]">
              {(formData.minutes || []).length === 0 && <span className="text-slate-400 text-sm pl-2">No minutes recorded.</span>}
              {(formData.minutes || []).map((m: string, i: number) => (
                  <li key={i} className="flex justify-between items-center py-1 px-2 hover:bg-slate-200 rounded group">
                      <span>{m}</span>
                      {!readOnly && (
                        <button 
                            type="button" 
                            onClick={() => removeMinute(i)}
                            className="text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                            <i className="pi pi-times"></i>
                        </button>
                      )}
                  </li>
              ))}
          </ul>
      </div>

    </form>
  );
});

export default MeetingForm;
