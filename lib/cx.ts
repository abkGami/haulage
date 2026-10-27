export type ClassValue = string | false | null | undefined;

/** Tiny class joiner — no dependency needed for the four things we do. */
export function cx(...values: ClassValue[]): string {
  return values.filter(Boolean).join(" ");
}
