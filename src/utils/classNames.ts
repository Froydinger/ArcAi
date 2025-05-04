/**
 * Concatenates class names.
 *
 * @param classes - An array of class names (strings, numbers, booleans, null, undefined).
 * @returns A string of space-separated class names.
 */
export function cn(...classes: (string | number | boolean | null | undefined)[]): string {
  return classes.filter(Boolean).join(' ');
}
