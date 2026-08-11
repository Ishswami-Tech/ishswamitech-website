export type ClassValue =
  | string
  | number
  | bigint
  | boolean
  | null
  | undefined
  | readonly ClassValue[];

/**
 * Joins truthy class names.
 *
 * Falsy values from `cond && "class"` are dropped, and arrays are flattened so
 * a variant can group several related classes without the call site having to
 * concatenate them into one unreadable string.
 */
export function cn(...values: ClassValue[]): string {
  const out: string[] = [];

  const walk = (value: ClassValue) => {
    if (!value) return;
    if (Array.isArray(value)) {
      value.forEach(walk);
      return;
    }
    if (typeof value === "string") out.push(value);
  };

  values.forEach(walk);
  return out.join(" ");
}
