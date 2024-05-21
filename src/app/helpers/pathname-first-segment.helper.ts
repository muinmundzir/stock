export const currentPathFirstSegment = (
  currentPath: string,
  formatted: boolean = false,
) => {
  if (currentPath === "/") return "/";

  const parts = currentPath.split("/").filter(Boolean);

  if (formatted) {
    return `${parts[0].slice(0, 1).toUpperCase() + parts[0].slice(1)}`;
  }

  return parts.length > 0 ? `/${parts[0]}` : "";
};
