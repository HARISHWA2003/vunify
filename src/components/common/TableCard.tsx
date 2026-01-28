import { DataTable, DataTablePageEvent, DataTableSortEvent } from "primereact/datatable";
import { ReactNode } from "react";

interface ActionIconData {
  label: string;
  icon: string;
  onClick?: () => void;
  disabled?: boolean;
}

interface TableCardProps {
  value: any[];
  totalRecords?: number;
  rows?: number;
  first?: number;
  onPage?: (event: DataTablePageEvent) => void;
  sortField?: string;
  sortOrder?: 0 | 1 | -1 | null;
  onSort?: (event: DataTableSortEvent) => void;
  actionIcons?: ActionIconData[];
  dataKey?: string;
  className?: string;
  tableClassName?: string;
  children?: ReactNode;
  loading?: boolean;
  scrollable?: boolean;
  scrollHeight?: string;
}

export default function TableCard({
  value,
  totalRecords,

  // paginator (controlled)
  rows = 5,
  first = 0,
  onPage,

  // sorting (controlled, optional)
  sortField,
  sortOrder,
  onSort,

  actionIcons = [],
  dataKey = "id",

  className = "",
  tableClassName = "text-sm",
  children,
  loading = false,
  scrollable,
  scrollHeight,
}: TableCardProps) {
  const safeValue = Array.isArray(value) ? value : [];

  return (
    <div className={`rounded-md bg-white border border-gray-200 flex flex-col max-w-full overflow-hidden ${className}`}>
      {/* Header row: actions (right aligned) */}
      <div className="flex items-center justify-end gap-1 px-3 py-2 border-b border-slate-200">
        {actionIcons.map((a) => (
          <ActionIcon
            key={a.label}
            icon={a.icon}
            label={a.label}
            onClick={a.onClick}
            disabled={a.disabled}
          />
        ))}
      </div>

      <DataTable
        value={safeValue}
        dataKey={dataKey}
        rowHover
        paginator
        rows={rows}
        first={first}
        onPage={onPage}
        totalRecords={
          typeof totalRecords === "number" ? totalRecords : safeValue.length
        }
        rowsPerPageOptions={[5, 10, 25, 50]}   // ✅ this enables dropdown
        sortField={sortField}
        sortOrder={sortOrder}
        onSort={onSort}
        className={tableClassName}
        emptyMessage="No records found"
        size="small"
        showGridlines
        loading={loading}
        scrollable={scrollable}
        scrollHeight={scrollHeight}
      >
        {children}
      </DataTable>
    </div>
  );
}

function ActionIcon({ icon, label, onClick, disabled }: ActionIconData) {
  return (
    <button
      type="button"
      className={[
        "h-8 w-8 rounded flex items-center justify-center",
        disabled ? "opacity-40 cursor-not-allowed" : "hover:bg-slate-100",
      ].join(" ")}
      title={label}
      aria-label={label}
      onClick={disabled ? undefined : onClick}
    >
      <i className={`${icon} text-slate-700`} />
    </button>
  );
}
