import React from "react";
import { Dropdown as PrimeDropdown, DropdownProps as PrimeDropdownProps } from "primereact/dropdown";

interface DropdownProps extends Omit<PrimeDropdownProps, "className"> {
  label?: string;
  error?: string;
  helperText?: string;
  containerClassName?: string;
  className?: string;
  mandatory?: boolean;
}

const Dropdown = React.forwardRef<PrimeDropdown, DropdownProps>(
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
        <PrimeDropdown
          ref={ref}
          id={inputId}
          className={[
            "w-full border rounded-md h-[42px] flex items-center", // Height to match text inputs
            error ? "border-red-500" : "border-gray-300",
            className,
          ].join(" ")}
          filter // almost always useful
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

Dropdown.displayName = "Dropdown";

export default Dropdown;
