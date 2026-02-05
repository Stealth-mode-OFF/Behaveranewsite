import * as React from "react";
import { cn } from "./utils";
import { AlertCircle, CheckCircle2 } from "lucide-react";

interface FormFieldProps {
  /**
   * Field label text
   */
  label?: string;

  /**
   * Error message to display (from react-hook-form errors)
   */
  error?: string;

  /**
   * Helper text to display below the input (e.g., "We'll never share your email")
   */
  helperText?: string;

  /**
   * Whether the field is required (adds asterisk to label)
   */
  required?: boolean;

  /**
   * Whether the field is in a success state (shows checkmark icon)
   */
  success?: boolean;

  /**
   * Additional CSS class for the container
   */
  className?: string;

  /**
   * The input element (Input, Select, Textarea, etc.)
   */
  children: React.ReactNode;

  /**
   * ID for accessibility (connects label to input)
   * If not provided, one will be generated
   */
  htmlFor?: string;
}

/**
 * FormField - Unified form field wrapper component
 * 
 * Provides consistent layout, validation states, and accessibility for all form inputs.
 * 
 * @example
 * ```tsx
 * <FormField
 *   label="Work email"
 *   error={errors.email?.message}
 *   helperText="We'll never share your email"
 *   required
 * >
 *   <Input
 *     type="email"
 *     autoComplete="email"
 *     {...register("email", validationRules.workEmail)}
 *   />
 * </FormField>
 * ```
 */
export function FormField({
  label,
  error,
  helperText,
  required = false,
  success = false,
  className,
  children,
  htmlFor,
}: FormFieldProps) {
  const generatedId = React.useId();
  const fieldId = htmlFor || generatedId;

  return (
    <div className={cn("form-field-container", className)}>
      {/* Label */}
      {label && (
        <label
          htmlFor={fieldId}
          className="form-field-label block text-sm font-semibold text-brand-text-primary mb-2"
        >
          {label}
          {required && (
            <span className="text-brand-error ml-1" aria-label="required">
              *
            </span>
          )}
        </label>
      )}

      {/* Input Wrapper with Validation Icon */}
      <div className="form-field-input-wrapper relative">
        {/* Clone child element to pass id and aria-invalid */}
        {React.isValidElement(children) &&
          React.cloneElement(children as React.ReactElement<any>, {
            id: fieldId,
            "aria-invalid": error ? "true" : "false",
            "aria-describedby": error
              ? `${fieldId}-error`
              : helperText
              ? `${fieldId}-helper`
              : undefined,
          })}

        {/* Validation Icon (Success or Error) */}
        {(success || error) && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
            {success && !error && (
              <CheckCircle2
                className="w-5 h-5 text-brand-success"
                aria-hidden="true"
              />
            )}
            {error && (
              <AlertCircle
                className="w-5 h-5 text-brand-error"
                aria-hidden="true"
              />
            )}
          </div>
        )}
      </div>

      {/* Helper Text (only shown if no error) */}
      {helperText && !error && (
        <p
          id={`${fieldId}-helper`}
          className="form-field-helper text-xs text-brand-text-muted mt-1.5"
        >
          {helperText}
        </p>
      )}

      {/* Error Message */}
      {error && (
        <p
          id={`${fieldId}-error`}
          className="form-field-error text-xs text-brand-error mt-1.5 flex items-center gap-1"
          role="alert"
        >
          <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" aria-hidden="true" />
          <span>{error}</span>
        </p>
      )}
    </div>
  );
}

/**
 * FormFieldGroup - Groups multiple related fields together
 * Use for: fields that should be visually grouped (e.g., first name + last name)
 */
export function FormFieldGroup({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("form-field-group grid gap-4 md:grid-cols-2", className)}>
      {children}
    </div>
  );
}

/**
 * FormSection - Semantic section divider for complex forms
 * Use for: multi-step forms or forms with logical sections
 */
export function FormSection({
  title,
  description,
  children,
  className,
}: {
  title?: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("form-section space-y-4", className)}>
      {(title || description) && (
        <div className="form-section-header border-b border-brand-border pb-4">
          {title && (
            <h3 className="text-lg font-bold text-brand-text-primary">
              {title}
            </h3>
          )}
          {description && (
            <p className="text-sm text-brand-text-secondary mt-1">
              {description}
            </p>
          )}
        </div>
      )}
      <div className="form-section-content space-y-4">{children}</div>
    </div>
  );
}
