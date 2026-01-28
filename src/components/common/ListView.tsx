import React, { ReactNode } from "react";

export interface Column<T> {
  key: string;
  header: string;
  sortable?: boolean;
  accessor?: (row: T) => any;
  formatter?: (value: any, row: T) => ReactNode;
  placeholder?: string;
  widthClass?: string;
  thClass?: string;
  tdClass?: string;
}

export interface SortState {
  key: string;
  dir: "asc" | "desc";
}

interface ListViewProps<T> {
  columns: Column<T>[];
  rows: T[];
  sort?: SortState | null;
  isPaging?: boolean;
  pagingSkeleton?: ReactNode;
  onRowClick?: (row: T) => void;
  onSortChange?: (sort: SortState) => void;
}

export default function ListView<T extends { id?: string | number }>({
  columns,
  rows,
  sort = null,
  isPaging = false,
  pagingSkeleton = null,
  onRowClick,
  onSortChange,
}: ListViewProps<T>) {
  const isSortActive = (col: Column<T>) => !!sort && sort.key === col.key;

  const sortIcon = (col: Column<T>) => {
    if (!col.sortable) return "";
    if (!isSortActive(col)) return "▲";
    return sort?.dir === "asc" ? "▲" : "▼";
  };

  const sortIconClass = (col: Column<T>) => {
    if (!col.sortable) return "";
    return isSortActive(col) ? "text-gray-600" : "text-gray-300";
  };

  const getCellValue = (col: Column<T>, row: T) => {
    if (typeof col.accessor === "function") return col.accessor(row);
    // @ts-ignore
    return row?.[col.key];
  };

  const renderCell = (col: Column<T>, row: T) => {
    const raw = getCellValue(col, row);
    const empty = raw === null || raw === undefined || raw === "";
    const value = empty ? (col.placeholder ?? "-") : raw;
    return typeof col.formatter === "function" ? col.formatter(value, row) : String(value);
  };

  const handleHeaderClick = (col: Column<T>) => {
    if (!col.sortable) return;

    const currentKey = sort?.key;
    const currentDir = sort?.dir ?? "asc";

    let nextDir: "asc" | "desc" = "asc";
    if (currentKey === col.key) {
      nextDir = currentDir === "asc" ? "desc" : "asc";
    }

    if (typeof onSortChange === "function") {
      onSortChange({ key: col.key, dir: nextDir });
    }
  };

  return (
    <div className="rounded-md bg-white overflow-hidden">
      <div className="w-full">
        <table className="min-w-full text-sm table-fixed">
          <thead className="bg-white font-bold text-sm">
            <tr>
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={[
                    "px-4 py-3 select-none text-left",
                    col.widthClass || "",
                    col.thClass || "",
                    col.sortable ? "cursor-pointer" : "",
                  ].join(" ")}
                  onClick={() => handleHeaderClick(col)}
                >
                  <span className="inline-flex items-start gap-1 whitespace-nowrap">
                    {col.header}

                    {col.sortable ? (
                      <span className={sortIconClass(col)}>{sortIcon(col)}</span>
                    ) : null}
                  </span>
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {rows.map((row, rowIdx) => (
              <tr
                key={row?.id ?? rowIdx}
                className="border-b border-gray-200 hover:bg-gray-50 cursor-pointer"
                onClick={() => typeof onRowClick === "function" && onRowClick(row)}
              >
                {columns.map((col) => {
                  const cellText = renderCell(col, row);
                  return (
                    <td
                      key={`${col.key}-${row?.id ?? rowIdx}`}
                      className={[
                        "px-4 py-3 whitespace-nowrap max-w-0 overflow-hidden truncate",
                        col.tdClass || "",
                      ].join(" ")}
                      title={typeof cellText === "string" || typeof cellText === "number" ? String(cellText) : undefined}
                    >
                      {cellText}
                    </td>
                  );
                })}
              </tr>
            ))}

            {/* PAGING SKELETON */}
            {isPaging && pagingSkeleton ? (
              <>
                {Array.from({ length: 3 }).map((_, i) => (
                  <React.Fragment key={`paging-skel-${i}`}>
                    {pagingSkeleton}
                  </React.Fragment>
                ))}
              </>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}
