export default function BlurbView({ data, clickable = true, onCardClick }) {
  const handleClick = () => {
    if (clickable && typeof onCardClick === "function") onCardClick();
  };

  const handleKeyDown = (e) => {
    if (!clickable) return;
    if (e.key === "Enter") handleClick();
  };

  return (
    <article
      className={[
        "rounded-2xl bg-white p-5 shadow-lg ring-1 ring-black/5 transition mb-4",
        clickable ? "cursor-pointer hover:-translate-y-0.5" : "",
      ].join(" ")}
      tabIndex={0}
      role={clickable ? "button" : "article"}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
    >
      {/* TITLE */}
      <h3 className="mb-0.5 text-lg font-semibold text-gray-900 line-clamp-2">
        {data?.title}
      </h3>

      {/* SUBTITLE (OPTIONAL) */}
      {data?.subtitle ? (
        <div className="text-sm text-gray-500 mb-2">{data.subtitle}</div>
      ) : null}

      <hr className="mb-3 border-gray-200" />

      {/* FIELDS GRID */}
      <div className="grid grid-cols-2 gap-4 text-sm text-gray-700">
        {(data?.fields ?? []).map((field, idx) => (
          <div key={`${field.label}-${idx}`} className="flex items-start gap-1 min-w-0">
            <span className="font-semibold whitespace-nowrap">
              {field.label}:
            </span>

            <span className="truncate text-gray-700">
              {field.value ? field.value : "-"}
            </span>
          </div>
        ))}
      </div>
    </article>
  );
}
