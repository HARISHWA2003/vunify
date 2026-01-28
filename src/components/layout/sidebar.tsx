import { useState } from "react";
import { NavLink } from "react-router-dom";
import { Dialog } from "primereact/dialog";
import { TextInput, TextArea, Dropdown, InputDate, TreeSelect } from "../common/inputs";

const navItems = [
  { to: "/tasks", label: "Tasks", icon: "pi pi-check-square" },
  { to: "/meetings", label: "Meetings", icon: "pi pi-calendar" },
  { to: "/sales", label: "Sales", icon: "pi pi-shopping-cart" },
  { to: "/projects", label: "Projects", icon: "pi pi-briefcase" },
  { to: "/works", label: "Works", icon: "pi pi-wrench" },
  { to: "/my-space", label: "My Space", icon: "pi pi-user" },
  { to: "/workforce", label: "Workforce", icon: "pi pi-users" },
  { to: "/hcm", label: "HCM", icon: "pi pi-cog" },
  { to: "/company", label: "Company", icon: "pi pi-building" },
  { to: "/finance", label: "Finance", icon: "pi pi-dollar" },
  { to: "/planning", label: "Planning", icon: "pi pi-calendar" },
  { to: "/scm", label: "SCM", icon: "pi pi-box" },
  { to: "/grc-audit", label: "GRC & Audit", icon: "pi pi-shield" },
  { to: "/admin", label: "Admin", icon: "pi pi-cog" },
];

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

export default function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const [showModal, setShowModal] = useState(false);

  // Modal footer for actions
  const renderFooter = () => {
    return (
      <div className="flex justify-end gap-2 pt-2">
        <button
          onClick={() => setShowModal(false)}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Cancel
        </button>
        <button
          onClick={() => setShowModal(false)}
          className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Save
        </button>
      </div>
    );
  };

  const dropdownOptions = [
    { label: "Option 1", value: 1 },
    { label: "Option 2", value: 2 },
    { label: "Option 3", value: 3 },
  ];

  const treeOptions = [
    {
      key: "0",
      label: "Node 1",
      children: [
        { key: "0-0", label: "Child 1.1" },
        { key: "0-1", label: "Child 1.2" },
      ],
    },
    {
      key: "1",
      label: "Node 2",
      children: [{ key: "1-0", label: "Child 2.1" }],
    },
  ];

  return (
    <>
      <aside
        className={[
          "sticky top-14 h-[calc(100vh-56px)] bg-white border-r",
          "flex flex-col",
          "transition-[width] duration-200",
          collapsed ? "w-[76px]" : "w-60",
        ].join(" ")}
      >
        {/* Create Button Area */}
        <div className="p-4 pb-0">
          <button
            onClick={() => setShowModal(true)}
            className={[
              "w-full flex items-center justify-center gap-2 rounded-md bg-indigo-600 text-white transition-all shadow-sm hover:bg-indigo-700",
              collapsed ? "h-10 w-10 p-0 rounded-full" : "h-10 px-4",
            ].join(" ")}
            title="Create New"
          >
            <i className="pi pi-plus" />
            {!collapsed && <span className="font-semibold">Create New</span>}
          </button>
        </div>

        {/* Nav */}
        <nav className="px-4 pt-4 flex-1 overflow-y-auto">
          <ul className="space-y-5">
            {navItems.map((item) => (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  className={({ isActive }) =>
                    [
                      "flex items-center gap-4",
                      "text-slate-900",
                      "hover:opacity-80",
                      "outline-none",
                      isActive ? "font-semibold" : "font-medium",
                    ].join(" ")
                  }
                >
                  <i className={`${item.icon} text-xl w-6`} />
                  {!collapsed ? (
                    <span className="text-[15px]">{item.label}</span>
                  ) : null}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        {/* Bottom collapse button */}
        <div className="p-4 flex justify-center">
          <button
            type="button"
            onClick={onToggle}
            className="h-10 w-10 rounded-full border border-slate-300 flex items-center justify-center hover:bg-slate-50"
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            <i
              className={[
                "pi text-sm text-slate-700",
                collapsed ? "pi-angle-right" : "pi-angle-left",
              ].join(" ")}
            />
          </button>
        </div>
      </aside>

      {/* Modal Dialog */}
      <Dialog
        header="Create New"
        visible={showModal}
        style={{ width: "50vw", maxWidth: "600px" }}
        onHide={() => setShowModal(false)}
        footer={renderFooter()}
        draggable={false}
        blockScroll
      >
        <div className="flex flex-col gap-4 mt-2">
          <TextInput
            label="Title"
            placeholder="Enter title here..."
            autoFocus
          />
          <div className="grid grid-cols-2 gap-4">
            <Dropdown
              label="Priority"
              options={dropdownOptions}
              placeholder="Select priority"
            />
            <InputDate
              label="Due Date"
              placeholder="Select date"
            />
          </div>
          <TreeSelect
            label="Category"
            options={treeOptions}
            placeholder="Select category"
          />
          <TextArea
            label="Description"
            placeholder="Enter description here..."
            rows={5}
          />
        </div>
      </Dialog>
    </>
  );
}
