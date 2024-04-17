import { createSlice } from '@reduxjs/toolkit';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../../app/firebaseConfig';

const initialState = {
  expenses: [],
  totalCount: 0,
  category: {}
};

export const expensesSlice = createSlice({
  name: 'expenses',
  initialState,
  reducers: {
    addExpense: (state, action) => {
      state.expenses.push(action.payload);
    },
    setExpense: (state, action) => {
      state.expenses = action.payload;
    }
  },
});

export const { addExpense, setExpense } = expensesSlice.actions;
// Функция для асинхронного получения расходов из базы данных Firestore и сохранения их в Redux
export const fetchExpenses = () => async (dispatch) => {
  try {
    const expenseRef = collection(db, "expenses");

    const unsubscribe = onSnapshot(expenseRef, (snapshot) => {
      const expenseData = [];
      snapshot.forEach((doc) => {
        const { id, amount, category, date, note, recurrence } = doc.data();
        expenseData.push({
          id,
          amount,
          category,
          date,
          note,
          recurrence,
        });
      });
      dispatch(setExpense(expenseData));
    });
    
    // Если вам нужно отписаться от снимка (snapshot) в определенный момент, вы можете вернуть функцию отписки из этого события
    return unsubscribe;
  } catch (error) {
    console.error("Error fetching expenses: ", error);
  }
};

// Селектор для получения списка расходов из состояния
export const selectExpenses = (state) => state.expenses.expenses;

export default expensesSlice.reducer;