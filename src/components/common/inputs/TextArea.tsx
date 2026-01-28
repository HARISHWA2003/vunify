import React from "react";
import { InputTextarea, InputTextareaProps } from "primereact/inputtextarea";

interface TextAreaProps extends Omit<InputTextareaProps, "className"> {
  label?: string;
  error?: string;
  helperText?: string;
  containerClassName?: string;
  className?: string; 
  mandatory?: boolean;
}

const TextArea = React.forwardRef<HTMLTextAreaElement, TextAreaProps>(
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
        <InputTextarea
          ref={ref}
          id={inputId}
          className={[
            "w-full border rounded-md p-2",
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

TextArea.displayName = "TextArea";

export default TextArea;
