// src/components/common/TableCard.jsx
import { DataTable } from "primereact/datatable";

/**
 * Reusable table card (matches your screenshot style):
 * - Top row: action icons (right)
 * - PrimeReact DataTable with paginator
 * - NO rows-per-page dropdown (we do NOT pass rowsPerPageOptions)
 */
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
}) {
  const safeValue = Array.isArray(value) ? value : [];

  return (
    <div className={`rounded-md bg-white border border-gray-200 ${className}`}>
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
      >
        {children}
      </DataTable>
    </div>
  );
}

function ActionIcon({ icon, label, onClick, disabled }) {
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
