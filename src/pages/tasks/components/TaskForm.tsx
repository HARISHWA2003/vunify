import React, { useState } from "react";
import TextInput from "../../../components/common/inputs/TextInput";
import Dropdown from "../../../components/common/inputs/Dropdown";
import TreeSelect from "../../../components/common/inputs/TreeSelect";
import InputDate from "../../../components/common/inputs/InputDate";
import { taskService } from "../../../services/taskService";
import { Task } from "../../../data/mockData";

// Mock Data
const projectOptions = [
  { label: "Alpha", value: "Alpha" },
  { label: "Beta", value: "Beta" },
  { label: "Gamma", value: "Gamma" },
  { label: "Delta", value: "Delta" },
];

const lagTypeOptions = [
  { label: "FS (Finish-to-Start)", value: "FS" },
  { label: "SS (Start-to-Start)", value: "SS" },
  { label: "FF (Finish-to-Finish)", value: "FF" },
  { label: "SF (Start-to-Finish)", value: "SF" },
];

const assigneeOptions = [
  { label: "Haris", value: "Haris" },
  { label: "Asha", value: "Asha" },
  { label: "Ravi", value: "Ravi" },
  { label: "Meena", value: "Meena" },
  { label: "Meenakshi Lakshmi", value: "Meenakshi Lakshmi" },
];

const priorityOptions = [
  { label: "High", value: "High" },
  { label: "Medium", value: "Medium" },
  { label: "Low", value: "Low" },
  { label: "Critical", value: "Critical" },
];



// Hardcoded parent nodes as per user request
const parentNodes = [
    {
        key: 'p1',
        label: 'P1',
        data: 'p1',
        icon: 'pi pi-fw pi-folder',
        children: [
            { key: 'p1.1', label: 'P1.1', data: 'p1.1', icon: 'pi pi-fw pi-file' },
            { key: 'p1.2', label: 'P1.2', data: 'p1.2', icon: 'pi pi-fw pi-file' }
        ]
    },
    {
        key: 'p2',
        label: 'P2',
        data: 'p2',
        icon: 'pi pi-fw pi-folder',
        children: [
            { key: 'p2.1', label: 'P2.1', data: 'p2.1', icon: 'pi pi-fw pi-file' }
        ]
    },
    {
        key: 'p3',
        label: 'P3',
        data: 'p3',
        icon: 'pi pi-fw pi-folder',
        children: [
            { key: 'p3.1', label: 'P3.1', data: 'p3.1', icon: 'pi pi-fw pi-file' },
            { key: 'p3.2', label: 'P3.2', data: 'p3.2', icon: 'pi pi-fw pi-file' },
            { key: 'p3.3', label: 'P3.3', data: 'p3.3', icon: 'pi pi-fw pi-file' }
        ]
    }
];

interface TaskFormProps {
  id?: string;
  initialData?: any;
  onSubmit: (data: any) => void;
  readOnly?: boolean;
}

// eslint-disable-next-line react/display-name
const TaskForm = React.forwardRef<HTMLFormElement, TaskFormProps>(({ id, initialData, onSubmit, readOnly }, ref) => {
  // const [tasks, setTasks] = React.useState<Task[]>([]);
  // const [parentOptions, setParentOptions] = React.useState<any[]>([]);

  // React.useEffect(() => {
  //     taskService.getTasks().then(data => {
  //         setTasks(data);
  //         // setParentOptions(buildTree(data));
  //     });
  // }, []);

  const [formData, setFormData] = useState(initialData || {
    name: "", 
    projectName: "",
    parent: null,
    lagType: null,
    lagDays: "",
    topDownDuration: "",
    assignedTo: null,
    assignedBy: null,
    priority: "Medium",
    percentComplete: "",
    estimatedStart: null,
    estimatedEnd: null,
    revisedStart: null,
    revisedEnd: null,
    actualStart: null,
    actualEnd: null,
  });

  const updateField = (field: string, value: any) => {
    if (readOnly) return;
    setFormData((prev: any) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!readOnly) onSubmit(formData);
  };

  return (
    <form id={id} ref={ref} onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-4xl mx-auto w-full">
      
      {/* 1. Task Name */}
      <TextInput
        label="Task Name"
        value={formData.name}
        onChange={(e) => updateField("name", e.target.value)}
        placeholder="Enter task name"
        mandatory
        disabled={readOnly}
      />

      {/* 2. Project Name */}
      <Dropdown
        label="Project Name"
        options={projectOptions}
        value={formData.projectName}
        onChange={(e) => updateField("projectName", e.value)}
        placeholder="Select Project"
        className="w-full"
        disabled={readOnly}
      />

      {/* 3. Parent | Lag Type */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <TreeSelect
            label="Parent"
            options={parentNodes}
            value={formData.parent}
            onChange={(e) => updateField("parent", e.value)}
            placeholder="Select Parent"
            filter
            disabled={readOnly}
        />
        <Dropdown
            label="Lag Type"
            options={lagTypeOptions}
            value={formData.lagType}
            onChange={(e) => updateField("lagType", e.value)}
            placeholder="Select Type"
            className="w-full"
            disabled={readOnly}
        />
      </div>

      {/* 4. Lag | Top-Down Est. Dur */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <TextInput
            label="Lag"
            type="number"
            value={formData.lagDays}
            onChange={(e) => updateField("lagDays", e.target.value)}
            placeholder="0"
            disabled={readOnly}
        />
        <TextInput
            label="Top-Down Est. Dur (days)"
            type="number"
            value={formData.topDownDuration}
            onChange={(e) => updateField("topDownDuration", e.target.value)}
            placeholder="0"
            mandatory
            disabled={readOnly}
        />
      </div>

      {/* 5. Assigned To */}
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

      {/* 6. Assigned By | Priority */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Dropdown
            label="Assigned By"
            options={assigneeOptions}
            value={formData.assignedBy}
            onChange={(e) => updateField("assignedBy", e.value)}
            placeholder="Select User"
            filter
            className="w-full"
            disabled={readOnly}
        />
        <Dropdown
            label="Priority"
            options={priorityOptions}
            value={formData.priority}
            onChange={(e) => updateField("priority", e.value)}
            placeholder="Select Priority"
            className="w-full"
            disabled={readOnly}
        />
      </div>

      {/* 7. Percentage Compl */}
      <TextInput
        label="Percentage Compl"
        type="number"
        value={formData.percentComplete}
        onChange={(e) => updateField("percentComplete", e.target.value)}
        placeholder="0"
        className="text-left"
        disabled={readOnly}
      />

      {/* 8. Estimated Dates */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <InputDate
            label="Estimated Start"
            value={formData.estimatedStart}
            onChange={(e) => updateField("estimatedStart", e.value)}
            dateFormat="dd M yy"
            showIcon
            disabled={readOnly}
        />
        <InputDate
            label="Estimated End"
            value={formData.estimatedEnd}
            onChange={(e) => updateField("estimatedEnd", e.value)}
            dateFormat="dd M yy"
            showIcon
            disabled={readOnly}
        />
      </div>

      {/* 9. Revised Dates */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <InputDate
            label="Revised Start"
            value={formData.revisedStart}
            onChange={(e) => updateField("revisedStart", e.value)}
            dateFormat="dd M yy"
            showIcon
            disabled={readOnly}
        />
        <InputDate
            label="Revised End"
            value={formData.revisedEnd}
            onChange={(e) => updateField("revisedEnd", e.value)}
            dateFormat="dd M yy"
            showIcon
            disabled={readOnly}
        />
      </div>

      {/* 10. Actual Dates */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <InputDate
            label="Actual Start"
            value={formData.actualStart}
            onChange={(e) => updateField("actualStart", e.value)}
            dateFormat="dd M yy"
            showIcon
            disabled={readOnly}
        />
        <InputDate
            label="Actual End"
            value={formData.actualEnd}
            onChange={(e) => updateField("actualEnd", e.value)}
            dateFormat="dd M yy"
            showIcon
            disabled={readOnly}
        />
      </div>

    </form>
  );
});

export default TaskForm;
