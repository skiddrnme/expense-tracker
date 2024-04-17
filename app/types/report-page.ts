import { IExpenses } from '../types/expenses'
import { Recurrence } from './recurrence';

export type ReportPageProps = {
  page: number;
  total: number;
  average: number;
  expenses: IExpenses[];
  recurrence: Recurrence;
};