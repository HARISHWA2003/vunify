import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import BlurbView from "../../components/common/BlurbView";
import ListView, { Column } from "../../components/common/ListView";
import { meetingService } from "../../services/meetingService";
import { Meeting } from "../../data/mockData";
import MeetingDetails from "./MeetingDetails.web";

/* ===================== SIMPLE TOAST ===================== */
function Toast({ message }: { message: string | null }) {
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

/* ===================== SKELETONS ===================== */
function CardSkeleton() {
  return (
    <div
      className="rounded-2xl bg-white p-5 shadow-lg ring-1 ring-black/5"
      aria-hidden="true"
    >
      <div className="h-5 w-4/5 bg-gray-200 rounded mb-3 animate-pulse" />
      <hr className="mb-3 border-gray-200" />
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <div className="h-4 w-[90%] bg-gray-200 rounded animate-pulse" />
          <div className="h-4 w-[80%] bg-gray-200 rounded animate-pulse" />
        </div>
        <div className="space-y-2">
          <div className="h-4 w-[90%] bg-gray-200 rounded animate-pulse" />
          <div className="h-4 w-[80%] bg-gray-200 rounded animate-pulse" />
        </div>
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
export default function MeetingsPageMobile() {
  const navigate = useNavigate();
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // Modal State
  const [selectedMeeting, setSelectedMeeting] = useState<Meeting | null>(null);
  const [detailsVisible, setDetailsVisible] = useState(false);


  function showInfoToast(msg = "This action will be enabled later.") {
    setToastMsg(msg);
    window.setTimeout(() => setToastMsg(null), 2200);
  }

  // view toggle
  const [viewMode, setViewMode] = useState<"card" | "list">("card");
  const toggleView = () => setViewMode((v) => (v === "card" ? "list" : "card"));

  // search with debounce
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(searchTerm), 150);
    return () => clearTimeout(t);
  }, [searchTerm]);

  // sort
  const [sort, setSort] = useState<{ key: string; dir: "asc" | "desc" }>({ key: "subject", dir: "asc" });

  // filter panel
  const [filterOpen, setFilterOpen] = useState(false);
  const [filter, setFilter] = useState({
    subject: "",
    type: "",
    status: "",
    engagement: "",
  });
  const [filterVersion, setFilterVersion] = useState(0);

  const applyFilter = () => {
    setFilterOpen(false);
    setFilterVersion((n) => n + 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const resetFilter = () => {
    setFilter({
      subject: "",
      type: "",
      status: "",
      engagement: "",
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
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const pageSize = 12;
  const [displayedMeetings, setDisplayedMeetings] = useState<Meeting[]>([]);

  // fetch
  useEffect(() => {
    setIsInitialLoading(true);
    meetingService.getMeetings().then((data) => {
        setMeetings(data);
        setIsInitialLoading(false);
    });
  }, []);

  const typeOptions = useMemo(() => {
    const vals = Array.from(new Set(meetings.map((m) => m.type).filter(Boolean)));
    return vals.map((v) => ({ label: v, value: v }));
  }, [meetings]);

  const filteredMeetings = useMemo(() => {
    // eslint-disable-next-line no-unused-vars
    const _ = filterVersion;

    const q = debouncedSearch.trim().toLowerCase();
    const f = filter;

    return meetings.filter((m) => {
      const inSearch =
        !q ||
        [m.subject, m.engagement, m.assignedTo]
          .filter(Boolean)
          .some((v) => String(v).toLowerCase().includes(q));

      const matchesSubject =
        !f.subject ||
        String(m.subject ?? "")
          .toLowerCase()
          .includes(f.subject.toLowerCase());

      const matchesEngagement =
        !f.engagement || String(m.engagement ?? "").toLowerCase().includes(f.engagement.toLowerCase());

      const matchesType = !f.type || m.type === f.type;
      
      const matchesStatus = !f.status || m.status === f.status;

      return (
        inSearch &&
        matchesSubject &&
        matchesEngagement &&
        matchesType &&
        matchesStatus
      );
    });
  }, [meetings, debouncedSearch, filter, filterVersion]);

  const sortedMeetings = useMemo(() => {
    const arr = [...filteredMeetings];
    const { key, dir } = sort;

    arr.sort((a: any, b: any) => {
        const valA = String(a[key] || "").toLowerCase();
        const valB = String(b[key] || "").toLowerCase();
        const cmp = valA.localeCompare(valB);
        return dir === "asc" ? cmp : -cmp;
    });

    return arr;
  }, [filteredMeetings, sort]);

  useEffect(() => {
    setDisplayedMeetings(sortedMeetings.slice(0, pageSize));
  }, [sortedMeetings]);

  // infinite scroll sentinel
  const sentinelRef = useRef(null);

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;

    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) loadMoreMeetings();
      },
      { root: null, rootMargin: "0px 0px 200px 0px", threshold: 0.01 },
    );

    io.observe(el);
    return () => io.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [displayedMeetings, sortedMeetings, isPaging]);

  function loadMoreMeetings() {
    if (isPaging) return;

    const shown = displayedMeetings.length;
    const total = sortedMeetings.length;
    if (shown >= total) return;

    setIsPaging(true);
    setTimeout(() => {
      const next = sortedMeetings.slice(shown, shown + pageSize);
      setDisplayedMeetings((prev) => [...prev, ...next]);
      setIsPaging(false);
    }, 400);
  }

  const columns: Column<Meeting>[] = useMemo(
    () => [
      {
        key: "subject",
        header: "Subject",
        sortable: true,
        accessor: (m: Meeting) => m.subject,
        formatter: (v: string, m: Meeting) => (
          <div>
            <div className="font-semibold text-slate-900">{v}</div>
            <div className="text-xs text-slate-500">ID: {m.id}</div>
          </div>
        ),
      },
      {
        key: "engagement",
        header: "Engagement",
        sortable: true,
        accessor: (m: Meeting) => m.engagement,
        widthClass: "w-24",
      },
      {
        key: "startDate",
        header: "Date",
        sortable: true,
        accessor: (m: Meeting) => m.startDate,
        widthClass: "w-24 text-right",
        formatter: (v: string) => <span className="text-slate-600 text-sm">{v ? new Date(v).toLocaleDateString() : '-'}</span>,
      },
      {
        key: "status",
        header: "Status",
        sortable: true,
        accessor: (m: Meeting) => m.status,
        widthClass: "w-24",
        formatter: (v: string) => (
          <span
            className={`px-2 py-0.5 rounded-full text-xs font-medium ${
              v === "Scheduled" ? "bg-blue-100 text-blue-700" : 
              v === "Completed" ? "bg-green-100 text-green-700" :
              "bg-gray-100 text-gray-700"
            }`}
          >
            {v}
          </span>
        ),
      },
    ],
    []
  );

  function mapMeetingToBlurb(m: Meeting) {
    return {
      title: m.subject || "(Untitled)",
      subtitle: `${m.engagement || "-"}` + (m.relationship ? ` (${m.relationship})` : ""),
      fields: [
        { label: "Type", value: m.type },
        { label: "Start Date", value: m.startDate ? new Date(m.startDate).toLocaleDateString() : "-" },
        { label: "Assignee", value: m.assignedTo },
        { label: "Status", value: m.status },
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
          aria-label={
            viewMode === "card" ? "Switch to list view" : "Switch to card view"
          }
        >
          {viewMode === "card" ? (
            <i className="pi pi-list text-xl text-gray-600" />
          ) : (
            <i className="pi pi-th-large text-xl text-gray-600" />
          )}
        </button>

        <div className="relative flex-1">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search meetings..."
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

        <button
          type="button"
          className="p-2 rounded hover:bg-gray-50"
          onClick={() => setFilterOpen((v) => !v)}
        >
          <i className="pi pi-filter text-xl text-gray-600" />
        </button>

        <button
          onClick={() => { setSelectedMeeting(null); setDetailsVisible(true); }}
          className="bg-blue-500 hover:bg-blue-600 text-white rounded-full w-10 h-10 flex items-center justify-center text-2xl"
          aria-label="Add meeting"
        >
          +
        </button>
      </div>

      {/* FILTER PANEL */}
      <div
        className={`grid transition-all duration-300 ease-in-out mb-3 ${filterOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}
      >
        <div className="overflow-hidden">
          <div className="border border-gray-300 rounded-lg p-4 bg-white ring-1 ring-black/5">
            <div className="grid grid-cols-2 gap-3 mb-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Type
                </label>
                <select
                  value={filter.type}
                  onChange={(e) =>
                    setFilter((p) => ({ ...p, type: e.target.value }))
                  }
                  className="w-full p-2 rounded-lg border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Any</option>
                  {typeOptions.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  value={filter.status}
                  onChange={(e) =>
                    setFilter((p) => ({ ...p, status: e.target.value }))
                  }
                  className="w-full p-2 rounded-lg border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Any</option>
                  <option value="Scheduled">Scheduled</option>
                  <option value="Completed">Completed</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Engagement
                </label>
                <input
                  type="text"
                  placeholder="Any"
                  value={filter.engagement}
                  onChange={(e) =>
                    setFilter((p) => ({ ...p, engagement: e.target.value }))
                  }
                  className="w-full p-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

            </div>

            <div className="flex items-center gap-4">
              <button
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                onClick={applyFilter}
              >
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
                      <th className="px-4 py-3 w-3/5">Meeting</th>
                      <th className="px-4 py-3 w-1/5">Date</th>
                      <th className="px-4 py-3 w-1/5">Status</th>
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
            {displayedMeetings.map((m) => (
              <BlurbView
                key={m.id}
                data={mapMeetingToBlurb(m)}
                onCardClick={() => { setSelectedMeeting(m); setDetailsVisible(true); }}
              />
            ))}
            {isPaging ? <CardSkeleton /> : null}
          </div>
        ) : (
          <ListView<Meeting>
            columns={columns}
            rows={displayedMeetings}
            sort={sort}
            isPaging={isPaging}
            pagingSkeleton={<ListRowSkeleton />}
            onRowClick={(m) => { setSelectedMeeting(m); setDetailsVisible(true); }}
            onSortChange={setSort}
          />
        )}

        <div ref={sentinelRef} className="h-1" aria-hidden="true" />
      </div>

       <MeetingDetails 
            visible={detailsVisible} 
            onHide={() => setDetailsVisible(false)} 
            meeting={selectedMeeting}
            onSuccess={() => {
               // Reload or trigger refresh
               window.dispatchEvent(new Event('meeting-updated'));
               // Re-fetch logic if needed, but the event listener (if any) or just refetching here:
               // In mobile we use setMeetings manually? 
               // Actually we should just reload meetings.
               setIsInitialLoading(true);
               meetingService.getMeetings().then((data) => {
                    setMeetings(data);
                    setIsInitialLoading(false);
               });
            }}
        />
    </div>
  );
}
