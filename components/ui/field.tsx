import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Shared control surface. The focus ring is drawn with box-shadow rather than
 * outline so it can animate and so it doesn't get clipped by the rounded
 * corner on Safari.
 */
const control = [
  "w-full rounded-[var(--radius-lg)] border bg-[var(--surface-raised)]",
  "px-3.5 py-2.5 text-[var(--text-md)] text-[var(--foreground)]",
  "placeholder:text-[var(--text-tertiary)]",
  "transition-[border-color,box-shadow,background-color]",
  "duration-[var(--duration-fast)] ease-[var(--ease-out)]",
  "focus:outline-none focus-visible:outline-none",
  "disabled:cursor-not-allowed disabled:opacity-60",
].join(" ");

const controlState = (invalid?: boolean) =>
  invalid
    ? "border-[var(--danger)]/55 focus:border-[var(--danger)] focus:shadow-[0_0_0_3px_rgba(251,113,133,0.15)]"
    : "border-[var(--border)] hover:border-[var(--border-hover)] focus:border-[var(--border-brand)] focus:shadow-[0_0_0_3px_rgba(99,102,241,0.16)]";

export function Field({
  label,
  htmlFor,
  required,
  hint,
  error,
  children,
  className,
}: {
  label: string;
  htmlFor: string;
  required?: boolean;
  hint?: string;
  error?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <label
        htmlFor={htmlFor}
        className="type-ui flex items-center gap-1 text-[var(--text-secondary)]"
      >
        {label}
        {required && (
          <span className="text-[var(--accent)]" aria-hidden>
            *
          </span>
        )}
      </label>

      {children}

      {hint && !error && <p className="text-[var(--text-xs)] text-[var(--text-tertiary)]">{hint}</p>}

      {error && (
        <p
          id={`${htmlFor}-error`}
          role="alert"
          className="text-[var(--text-xs)] text-[var(--danger)]"
        >
          {error}
        </p>
      )}
    </div>
  );
}

export const Input = ({
  invalid,
  className,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & { invalid?: boolean }) => (
  <input className={cn(control, controlState(invalid), className)} {...props} />
);

export const Textarea = ({
  invalid,
  className,
  ...props
}: React.TextareaHTMLAttributes<HTMLTextAreaElement> & { invalid?: boolean }) => (
  <textarea className={cn(control, controlState(invalid), "resize-y", className)} {...props} />
);

/**
 * Native <select> keeps keyboard behaviour, mobile pickers and form semantics
 * for free. The default arrow is hidden and redrawn so it matches the palette.
 */
export const Select = ({
  invalid,
  className,
  children,
  ...props
}: React.SelectHTMLAttributes<HTMLSelectElement> & { invalid?: boolean }) => (
  <div className="relative">
    <select
      className={cn(control, controlState(invalid), "cursor-pointer appearance-none pr-10", className)}
      {...props}
    >
      {children}
    </select>
    <ChevronDown
      aria-hidden
      className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--text-tertiary)]"
    />
  </div>
);
