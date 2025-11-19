export interface PaginationMeta {
  currentPage: number;
  itemsPerPage: number;
  totalItems: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface PaginatedResponse<T> {
  items: T[];
  meta: PaginationMeta;
}

export function createPaginatedResponse<T>(
  items: T[],
  allItems: T[],
  page: number,
  limit: number
): PaginatedResponse<T> {
  const totalItems = allItems.length;
  const totalPages = Math.ceil(totalItems / limit);

  return {
    items,
    meta: {
      currentPage: page,
      itemsPerPage: limit,
      totalItems,
      totalPages,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1,
    },
  };
}

export function paginateArray<T>(
  array: T[],
  page: number,
  limit: number
): PaginatedResponse<T> {
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const items = array.slice(startIndex, endIndex);

  return createPaginatedResponse(items, array, page, limit);
}

