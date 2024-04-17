import { IExpenses } from "./expenses";

export type ExpensesGroup = {
  day: string;
  expenses: IExpenses[];
  total: number;
};