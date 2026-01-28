import React from "react";
import { Calendar, CalendarProps } from "primereact/calendar";

interface InputDateProps extends Omit<CalendarProps, "className"> {
  label?: string;
  error?: string;
  helperText?: string;
  containerClassName?: string;
  className?: string;
  mandatory?: boolean;
}

const InputDate = React.forwardRef<Calendar, InputDateProps>(
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
        <Calendar
          ref={ref}
          id={inputId}
          showIcon
          className={[
            "w-full border rounded-md h-[42px]", 
            error ? "border-red-500" : "border-gray-300",
            className,
          ].join(" ")}
          // inputClassName can be used if explicit control over the input inside calendar is needed, 
          // but typically 'className' on the wrapper handles the border for PrimeReact Calendar (wrapper + input).
          // However, sometimes PrimeReact Calendar puts border on input implementation depending on theme.
          // For consistency with our other inputs, we'll style the wrapper or pass classes to input.
          // In Lara theme, the 'p-calendar' usually has no border, the input inside has.
          // BUT we are using Tailwind classes on the wrapper to enforce border.
          // Let's refine this: standard PrimeReact Calendar has an input and a button.
          // If we put border on the container, the button might look inside or outside.
          // For simplicitly, let's assume we want standard behavior but forced styles.
          inputClassName="w-full border-none outline-none ring-0 shadow-none p-2" // reset inner input
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

InputDate.displayName = "InputDate";

export default InputDate;
