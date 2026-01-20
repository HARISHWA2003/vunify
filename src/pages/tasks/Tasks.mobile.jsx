import { useEffect, useMemo, useRef, useState } from "react";

import BlurbView from "../../components/common/BlurbView";
import ListView from "../../components/common/ListView";

/* ===================== SIMPLE TOAST ===================== */
function Toast({ message }) {
  if (!message) return null;
  return (
    <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50">
      <div className="rounded-xl bg-white shadow-lg ring-1 ring-black/10 px-4 py-3 text-sm">
        <div className="font-semibold text-slate-900">Info</div>
        <div className="text-slate-700">{message}</div>
      </div>
    </div>
  );
}

/* ===================== MOCK DATA (replace later with API) ===================== */
function makeMockTasks(count = 60) {
  const priorities = ["High", "Medium", "Low"];
  const projects = ["Alpha", "Beta", "Gamma", "Delta"];
  return Array.from({ length: count }).map((_, i) => {
    const taskId = `T-${1000 + i}`;
    const priority = priorities[i % priorities.length];
    const projectName = projects[i % projects.length];
    return {
      id: taskId,
      taskId,
      taskName: `Task ${i + 1}`,
      projectName,
      taskLagdays: String((i * 2) % 15),
      tsktpdEstDur: String((i % 10) + 1),
      pertskcompln: (i * 7) % 101,
      priority,
      assignee: ["Haris", "Asha", "Ravi", "Meena"][i % 4],
      status: ["Open", "In Progress", "Closed"][i % 3],
    };
  });
}

/* ===================== SKELETONS ===================== */
function CardSkeleton() {
  return (
    <div className="rounded-2xl bg-white p-5 shadow-lg ring-1 ring-black/5" aria-hidden="true">
      <div className="h-5 w-4/5 bg-gray-200 rounded mb-3 animate-pulse" />
      <hr className="mb-3 border-gray-200" />
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <div className="h-4 w-[90%] bg-gray-200 rounded animate-pulse" />
          <div className="h-4 w-[80%] bg-gray-200 rounded animate-pulse" />
          <div className="h-4 w-[70%] bg-gray-200 rounded animate-pulse" />
          <div className="h-4 w-[60%] bg-gray-200 rounded animate-pulse" />
        </div>
        <div className="space-y-2">
          <div className="h-4 w-[90%] bg-gray-200 rounded animate-pulse" />
          <div className="h-4 w-[80%] bg-gray-200 rounded animate-pulse" />
          <div className="h-4 w-[70%] bg-gray-200 rounded animate-pulse" />
          <div className="h-4 w-[60%] bg-gray-200 rounded animate-pulse" />
        </div>
      </div>
      <div className="mt-3">
        <div className="h-4 w-2/5 bg-gray-200 rounded animate-pulse" />
      </div>
    </div>
  );
}

function ListRowSkeleton() {
  return (
    <tr className="border-b border-gray-200" aria-hidden="true">
      <td className="px-4 py-3 w-3/5">
        <div className="h-4 w-[90%] bg-gray-200 rounded animate-pulse" />
      </td>
      <td className="px-4 py-3 w-1/5">
        <div className="h-4 w-[70%] bg-gray-200 rounded animate-pulse" />
      </td>
      <td className="px-4 py-3 w-1/5">
        <div className="h-4 w-[60%] bg-gray-200 rounded animate-pulse" />
      </td>
    </tr>
  );
}

/* ===================== PAGE ===================== */
export default function TasksPage() {
  const [toastMsg, setToastMsg] = useState(null);

  function showInfoToast(msg = "This action will be enabled later.") {
    setToastMsg(msg);
    window.setTimeout(() => setToastMsg(null), 2200);
  }

  // view toggle
  const [viewMode, setViewMode] = useState("card");
  const toggleView = () => setViewMode((v) => (v === "card" ? "list" : "card"));

  // search with debounce
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(searchTerm), 150);
    return () => clearTimeout(t);
  }, [searchTerm]);

  // sort
  const [sort, setSort] = useState({ key: "taskName", dir: "asc" });

  // filter panel
  const [filterOpen, setFilterOpen] = useState(false);
  const [filter, setFilter] = useState({
    title: "",
    taskLagdays: "",
    pertskcompln: "",
    tsktpdEstDur: "",
    priority: "",
  });
  const [filterVersion, setFilterVersion] = useState(0);

  const applyFilter = () => {
    setFilterOpen(false);
    setFilterVersion((n) => n + 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const resetFilter = () => {
    setFilter({
      title: "",
      taskLagdays: "",
      pertskcompln: "",
      tsktpdEstDur: "",
      priority: "",
    });
    setFilterOpen(false);
    setFilterVersion((n) => n + 1);
  };

  // loading & paging
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [isPaging, setIsPaging] = useState(false);
  const skeletonItems = useMemo(() => Array.from({ length: 6 }), []);
  const skeletonRows = useMemo(() => Array.from({ length: 8 }), []);

  // data
  const [tasks, setTasks] = useState([]);
  const pageSize = 12;
  const [displayedTasks, setDisplayedTasks] = useState([]);

  // simulate fetch
  useEffect(() => {
    setIsInitialLoading(true);
    const t = setTimeout(() => {
      setTasks(makeMockTasks(80));
      setIsInitialLoading(false);
    }, 700);
    return () => clearTimeout(t);
  }, []);

  const priorityOptions = useMemo(() => {
    const vals = Array.from(new Set(tasks.map((t) => t.priority).filter(Boolean)));
    return vals.map((v) => ({ label: v, value: v }));
  }, [tasks]);

  const filteredTasks = useMemo(() => {
    // eslint-disable-next-line no-unused-vars
    const _ = filterVersion;

    const q = debouncedSearch.trim().toLowerCase();
    const f = filter;

    return tasks.filter((t) => {
      const inSearch =
        !q ||
        [t.taskName, t.projectName, t.assignee]
          .filter(Boolean)
          .some((v) => String(v).toLowerCase().includes(q));

      const matchesTitle =
        !f.title || String(t.taskName ?? "").toLowerCase().includes(f.title.toLowerCase());

      const matchesLag = !f.taskLagdays || String(t.taskLagdays ?? "").includes(f.taskLagdays);

      const matchesPercent = !f.pertskcompln || String(t.pertskcompln ?? "").includes(f.pertskcompln);

      const matchesTopDown = !f.tsktpdEstDur || String(t.tsktpdEstDur ?? "").includes(f.tsktpdEstDur);

      const matchesPriority = !f.priority || t.priority === f.priority;

      return inSearch && matchesTitle && matchesLag && matchesPercent && matchesTopDown && matchesPriority;
    });
  }, [tasks, debouncedSearch, filter, filterVersion]);

  const sortedTasks = useMemo(() => {
    const arr = [...filteredTasks];
    const { key, dir } = sort;

    arr.sort((a, b) => {
      if (key === "taskName") {
        const cmp = String(a.taskName ?? "").localeCompare(String(b.taskName ?? ""));
        return dir === "asc" ? cmp : -cmp;
      }
      if (key === "pertskcompln") {
        const cmp = (a.pertskcompln ?? 0) - (b.pertskcompln ?? 0);
        return dir === "asc" ? cmp : -cmp;
      }
      const cmp = String(a.priority ?? "").localeCompare(String(b.priority ?? ""));
      return dir === "asc" ? cmp : -cmp;
    });

    return arr;
  }, [filteredTasks, sort]);

  useEffect(() => {
    setDisplayedTasks(sortedTasks.slice(0, pageSize));
  }, [sortedTasks]);

  // infinite scroll sentinel
  const sentinelRef = useRef(null);

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;

    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) loadMoreTasks();
      },
      { root: null, rootMargin: "0px 0px 200px 0px", threshold: 0.01 }
    );

    io.observe(el);
    return () => io.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [displayedTasks, sortedTasks, isPaging]);

  function loadMoreTasks() {
    if (isPaging) return;

    const shown = displayedTasks.length;
    const total = sortedTasks.length;
    if (shown >= total) return;

    setIsPaging(true);
    setTimeout(() => {
      const next = sortedTasks.slice(shown, shown + pageSize);
      setDisplayedTasks((prev) => [...prev, ...next]);
      setIsPaging(false);
    }, 400);
  }

  const listColumns = useMemo(
    () => [
      {
        key: "taskName",
        header: "Task",
        widthClass: "w-3/6",
        sortable: true,
        placeholder: "(Untitled Task)",
        accessor: (t) => t.taskName,
      },
      {
        key: "pertskcompln",
        header: "% Comp.",
        widthClass: "w-1/6",
        sortable: true,
        placeholder: "-",
        accessor: (t) => t.pertskcompln,
        formatter: (v) => (v === "-" || v === null || v === undefined ? "-" : String(v)),
      },
      {
        key: "priority",
        header: "Priority",
        widthClass: "w-2/6",
        sortable: true,
        placeholder: "-",
        accessor: (t) => t.priority,
      },
    ],
    []
  );

  function mapTaskToBlurb(t) {
    return {
      title: t.taskName || "(Untitled)",
      subtitle: `Session ${t.projectName || "-"}`,
      fields: [
        { label: "Lag (days)", value: t.taskLagdays },
        { label: "Top-down dur", value: t.tsktpdEstDur },
        { label: "% Complete", value: t.pertskcompln },
        { label: "End Priority", value: t.priority },
      ],
    };
  }

  return (
    <div className="h-fit w-full flex flex-col p-4">
      <Toast message={toastMsg} />

      {/* TOOLBAR */}
      <div className="flex items-center gap-3 mb-2">
        <button
          type="button"
          className="p-2 rounded hover:bg-gray-50"
          onClick={toggleView}
          aria-label={viewMode === "card" ? "Switch to list view" : "Switch to card view"}
        >
          {viewMode === "card" ? (
            <img src="/icons/list.svg" alt="Switch to list view" className="h-8 w-8" />
          ) : (
            <img src="/icons/blurb.svg" alt="Switch to card view" className="h-8 w-8" />
          )}
        </button>

        <div className="relative flex-1">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search tasks..."
            className="w-full p-2 rounded-full border border-gray-300 pl-9 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.5"
              d="m21 21-4.3-4.3M10 18a8 8 0 1 1 0-16 8 8 0 0 1 0 16z"
            />
          </svg>

          {searchTerm ? (
            <button
              type="button"
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full p-1 hover:bg-gray-100"
              onClick={() => setSearchTerm("")}
            >
              ✕
            </button>
          ) : null}
        </div>

        <button type="button" className="p-2 rounded hover:bg-gray-50" onClick={() => setFilterOpen((v) => !v)}>
          <img src="/icons/filter.svg" alt="Toggle filters" className="h-8 w-8" />
        </button>

        <button
          onClick={() => showInfoToast("Add Task will be enabled later.")}
          className="bg-blue-500 hover:bg-blue-600 text-white rounded-full w-10 h-10 flex items-center justify-center text-2xl"
          aria-label="Add task"
        >
          +
        </button>
      </div>

      {/* FILTER PANEL */}
      <div className={`grid transition-all duration-300 ease-in-out mb-3 ${filterOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}>
        <div className="overflow-hidden">
          <div className="border border-gray-300 rounded-lg p-4 bg-white ring-1 ring-black/5">
            <div className="grid grid-cols-2 gap-3 mb-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Lag (days)</label>
                <input
                  type="number"
                  placeholder="Any"
                  value={filter.taskLagdays}
                  onChange={(e) => setFilter((p) => ({ ...p, taskLagdays: e.target.value }))}
                  className="w-full p-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                <select
                  value={filter.priority}
                  onChange={(e) => setFilter((p) => ({ ...p, priority: e.target.value }))}
                  className="w-full p-2 rounded-lg border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Any</option>
                  {priorityOptions.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Top-down Duration</label>
                <input
                  type="number"
                  placeholder="Any"
                  value={filter.tsktpdEstDur}
                  onChange={(e) => setFilter((p) => ({ ...p, tsktpdEstDur: e.target.value }))}
                  className="w-full p-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">% Complete</label>
                <input
                  type="number"
                  placeholder="Any"
                  min={0}
                  max={100}
                  value={filter.pertskcompln}
                  onChange={(e) => setFilter((p) => ({ ...p, pertskcompln: e.target.value }))}
                  className="w-full p-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="flex items-center gap-4">
              <button className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600" onClick={applyFilter}>
                Apply
              </button>
              <button className="text-gray-700" onClick={resetFilter}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* CONTENT */}
      <div className="h-screen">
        {isInitialLoading ? (
          viewMode === "card" ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {skeletonItems.map((_, i) => (
                <CardSkeleton key={i} />
              ))}
            </div>
          ) : (
            <div className="rounded-md bg-white overflow-hidden">
              <div className="min-w-full overflow-x-auto">
                <table className="min-w-full table-fixed text-sm">
                  <thead className="bg-white font-bold text-sm">
                    <tr>
                      <th className="px-4 py-3 w-3/5">Task</th>
                      <th className="px-4 py-3 w-1/5">% Complete</th>
                      <th className="px-4 py-3 w-1/5">Priority</th>
                    </tr>
                  </thead>
                  <tbody>
                    {skeletonRows.map((_, i) => (
                      <ListRowSkeleton key={i} />
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )
        ) : viewMode === "card" ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {displayedTasks.map((t) => (
              <BlurbView
                key={t.taskId}
                data={mapTaskToBlurb(t)}
                onCardClick={() => showInfoToast(`Clicked ${t.taskId}`)}
              />
            ))}
            {isPaging ? <CardSkeleton /> : null}
          </div>
        ) : (
          <ListView
            columns={listColumns}
            rows={displayedTasks}
            sort={sort}
            isPaging={isPaging}
            pagingSkeleton={<ListRowSkeleton />}
            onRowClick={(t) => showInfoToast(`Clicked ${t.taskId}`)}
            onSortChange={setSort}
          />
        )}

        <div ref={sentinelRef} className="h-1" aria-hidden="true" />
      </div>
    </div>
  );
}
