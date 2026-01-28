import React from "react";
import { InputText, InputTextProps } from "primereact/inputtext";

interface TextInputProps extends Omit<InputTextProps, "className"> {
  label?: string;
  error?: string;
  helperText?: string;
  containerClassName?: string;
  className?: string; // override to simple string for ease of use 
  mandatory?: boolean;
}

const TextInput = React.forwardRef<HTMLInputElement, TextInputProps>(
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
        <InputText
          ref={ref}
          id={inputId}
          className={[
            "w-full border rounded-md p-2",
            error ? "border-red-500" : "border-gray-300", 
            className,
          ].join(" ")}
          required={mandatory}
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

TextInput.displayName = "TextInput";

export default TextInput;
