export const buildQueryString = <T extends Record<string, any>>(
  filters: T,
): string => {
  const queryParams = new URLSearchParams();

  for (const key in filters) {
    if (filters[key]) {
      queryParams.append(key, filters[key]);
    }
  }

  return queryParams.toString();
};
