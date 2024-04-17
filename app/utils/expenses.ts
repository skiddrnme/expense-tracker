import { format, isThisYear, isToday, isYesterday } from "date-fns";
import { calculateRange } from "./date";
import { Recurrence } from "../types/recurrence";
import { ExpensesGroup } from "../types/expense-group";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchExpenses,
  selectExpenses,
} from "../../store/slices/expensesSlice";
import { IExpenses } from "../types/expenses";
import { useEffect, useState } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../firebaseConfig";

export const filterExpensesInPeriod = (
  expenses: IExpenses[],
  period: Recurrence,
  periodIndex: number
) => {
  const { start, end } = calculateRange(period, periodIndex);

  return expenses.filter((expense) => {
    const { date } = expense;
    return date >= start && date <= end;
  });
};

export const groupExpensesByDay = (expenses: IExpenses[]): ExpensesGroup[] => {
  const groupedExpenses: { [key: string]: IExpenses[] } = {};

  expenses.sort((a, b) => {
    return b.date.getTime() - a.date.getTime();
  });

  expenses.forEach((expense) => {
    const { date } = expense;
    let key = "";
    if (isToday(date)) {
      key = "Сегодня";
    } else if (isYesterday(date)) {
      key = "Вчера";
    } else if (isThisYear(date)) {
      key = format(date, "E, d MMM");
    } else {
      key = format(date, "E, d MMM yyyy");
    }

    if (!groupedExpenses[key]) {
      groupedExpenses[key] = [];
    }

    groupedExpenses[key].push(expense);
  });

  // Добавим отладочный вывод
  // console.log("Группировка расходов:");
  // console.log(groupedExpenses);

  return Object.keys(groupedExpenses).map((key) => ({
    day: key,
    expenses: groupedExpenses[key],
    total: groupedExpenses[key].reduce(
      (acc, expense) => acc + expense.amount,
      0
    ),
  }));
};

export const useFilteredAndGroupedExpenses = (
  expenses: IExpenses[],
  recurrence: Recurrence
) => {
  const filteredExpenses = filterExpensesInPeriod(expenses, recurrence, 0);
  return groupExpensesByDay(filteredExpenses);
};

export const getAverageAmountInPeriod = (total: number, period: Recurrence) => {
  switch (period) {
    case Recurrence.Weekly:
      return total / 7;
    case Recurrence.Monthly:
      return total / 30;
    case Recurrence.Yearly:
      return total / 365;
    default:
      return total;
  }
};
