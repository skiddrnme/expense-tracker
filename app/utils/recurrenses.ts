import { Recurrence } from "../types/recurrence";

export const getPlainRecurrence = (recurrence: Recurrence) => {
  switch (recurrence) {
    case Recurrence.Daily:
      return "День";
    case Recurrence.Weekly:
      return "Неделя";
    case Recurrence.Monthly:
      return "Месяц";
    case Recurrence.Yearly:
      return "Год";
    default:
      return "";
  }
};
