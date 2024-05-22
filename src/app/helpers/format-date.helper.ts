export const formatDate = (date: string) => {
  const itemDate = new Date(date);

  const formattedDate = itemDate.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
  });

  return formattedDate;
};
