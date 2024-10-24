class DateManager {
  // Voir momentJs
  dateFormatter = (date: Date): string => {
    if (date) {
      const parsedDate = new Date(date);
      return parsedDate
        .toLocaleDateString("fr-FR", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        })
        .replace(".", "");
    } else {
      return "Aucune date";
    }
  };
}

export default new DateManager();
