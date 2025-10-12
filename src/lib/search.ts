/**
 * Generic search utility for arrays of objects or strings.
 * Handles accents, case sensitivity, and partial/exact matches.
 *
 * @template T - The type of array elements
 * @param items - The array to search in
 * @param query - The search term
 * @param options - Optional search options
 * @returns Filtered array matching the query
 */
export function search<T>(
  items: T[],
  query: string,
  options?: {
    keys?: (keyof T)[];
    caseSensitive?: boolean;
    exact?: boolean;
    ignoreAccents?: boolean;
  }
): T[] {
  if (!query) return items;

  const {
    keys,
    caseSensitive = false,
    exact = false,
    ignoreAccents = true,
  } = options || {};

  const normalize = (str: string) => {
    let normalized = str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    if (!caseSensitive) normalized = normalized.toLowerCase();
    return normalized;
  };

  const searchTerm = normalize(ignoreAccents ? query.trim() : query.trim());

  return items.filter((item) => {
    const valueToSearch =
      typeof item === "string"
        ? item
        : keys
        ? keys.map((key) => String(item[key] ?? "")).join(" ")
        : JSON.stringify(item);

    const normalized = ignoreAccents ? normalize(valueToSearch) : valueToSearch;
    return exact ? normalized === searchTerm : normalized.includes(searchTerm);
  });
}
