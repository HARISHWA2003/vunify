import React from "react";
import { TreeSelect as PrimeTreeSelect, TreeSelectProps as PrimeTreeSelectProps } from "primereact/treeselect";

interface TreeSelectProps extends Omit<PrimeTreeSelectProps, "className"> {
  label?: string;
  error?: string;
  helperText?: string;
  containerClassName?: string;
  className?: string;
  mandatory?: boolean;
}

const TreeSelect = React.forwardRef<PrimeTreeSelect, TreeSelectProps>(
  ({ label, error, helperText, className = "", containerClassName = "", id, mandatory, ...props }, ref) => {
    const inputId = id || props.name || Math.random().toString(36).substr(2, 9);

    return (
      <div className={`flex flex-col gap-1.5 ${containerClassName}`}>
        {label && (
          <label 
            htmlFor={inputId} 
            className={`text-base font-medium ${mandatory ? "text-red-600" : "text-black"}`}
          >
            {label} {mandatory && "*"}
          </label>
        )}
        <PrimeTreeSelect
          ref={ref}
          id={inputId}
          className={[
            "w-full border rounded-md h-[42px] flex items-center",
            error ? "border-red-500" : "border-gray-300",
            className,
          ].join(" ")}
          {...props}
        />
        {helperText && !error && (
          <small className="text-gray-500">{helperText}</small>
        )}
        {error && <small className="text-red-600">{error}</small>}
      </div>
    );
  }
);

TreeSelect.displayName = "TreeSelect";

export default TreeSelect;
