export const ITEMS_PER_PAGE = 5;

export function getTotalPages(
  totalItems: number,
  pageSize: number = ITEMS_PER_PAGE,
): number {
  return Math.max(1, Math.ceil(totalItems / pageSize));
}

export function paginate<T>(
  items: readonly T[],
  page: number,
  pageSize: number = ITEMS_PER_PAGE,
): T[] {
  const start = (page - 1) * pageSize;
  return items.slice(start, start + pageSize);
}
