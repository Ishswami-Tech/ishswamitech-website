export type ClassValue = string | number | bigint | false | null | undefined;

/** Joins truthy class names; falsy values from `cond && "class"` are dropped. */
export function cn(...values: ClassValue[]): string {
  return values.filter((value): value is string => typeof value === "string" && value.length > 0).join(" ");
}
