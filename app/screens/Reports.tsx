import BottomSheet, { BottomSheetFlatList } from '@gorhom/bottom-sheet';
import React, { MutableRefObject, useEffect, useReducer, useRef, useState } from 'react';
import { Text, TouchableHighlight, FlatList, Dimensions } from 'react-native';
import { BottomSheetMethods } from '@gorhom/bottom-sheet/lib/typescript/types';


import { theme } from '../theme';
import { Recurrence } from '../types/recurrence';
import { type ReportPageProps } from '../types/report-page';
import { calculateRange, formatDateRange } from '../utils/date';
import {
  filterExpensesInPeriod,
  getAverageAmountInPeriod,
} from '../utils/expenses';
import { shortenNumber } from '../utils/number';
import { ReportPage } from '../components/ReportPage';
import { IExpenses } from '../types/expenses';
import { collection, onSnapshot } from 'firebase/firestore';
import { auth, db } from '../firebaseConfig';

type Props = {
  reportsSheetRef: MutableRefObject<BottomSheetMethods>;
};

enum PagerReducerActionTypes {
  SET_RECURRENCE = 'SET_RECURRENCE',
}

type PagerReducerAction = {
  type: PagerReducerActionTypes;
  payload: any;
};

type PagerState = {
  recurrence: Recurrence;
  numberOfPages: number;
};

function pagerReducer(state: PagerState, action: PagerReducerAction) {
  switch (action.type) {
    case PagerReducerActionTypes.SET_RECURRENCE:
      var newNumberOfPages = 1;
      switch (action.payload) {
        case Recurrence.Weekly:
          newNumberOfPages = 53;
          break;
        case Recurrence.Monthly:
          newNumberOfPages = 12;
          break;
        case Recurrence.Yearly:
          newNumberOfPages = 1;
          break;
      }

      return {
        ...state,
        recurrence: action.payload,
        numberOfPages: newNumberOfPages,
        page: 0,
      };
    default:
      return state;
  }
}

export const Reports = ({ reportsSheetRef }: Props) => {
  const [expenses, setExpenses] = useState<IExpenses[]>([]);
  
  useEffect(() => {
    const user = auth.currentUser;
    if (user) {
      const uid = user.uid;
      const expenseRef = collection(db, `users/${uid}/expenses`); // Путь к коллекции расходов текущего пользователя

      const subscriber = onSnapshot(expenseRef, {
        next: (snapshot) => {
          const newExpense: IExpenses[] = [];
          snapshot.docs.forEach((doc) => {
            const data = doc.data();
            const expense: IExpenses = {
              id: doc.id, // Используем id документа в качестве идентификатора расхода
              amount: data.amount,
              date: data.date.toDate(),
              category: data.category,
              note: data.note,
            };
            newExpense.push(expense);
          });
          setExpenses(newExpense);
        },
      });

      return () => subscriber();
    }
  }, []);

  const listRef = useRef<FlatList>(null);

  const [state, dispatch] = useReducer(pagerReducer, {
    recurrence: Recurrence.Weekly,
    numberOfPages: 53,
  });

  const selectRecurrence = (selectedRecurrence: Recurrence) => {
    dispatch({
      type: PagerReducerActionTypes.SET_RECURRENCE,
      payload: selectedRecurrence,
    });
    reportsSheetRef.current.close();
    listRef.current.scrollToIndex({ index: 0 });
  };

  const data = Array.from<number>({
    length: state.numberOfPages,
  }).map<ReportPageProps>((_, page) => {
    const filteredExpenses = filterExpensesInPeriod(
      Array.from(expenses),
      state.recurrence,
      page
    );

    const total =
      filteredExpenses.reduce((acc, expense) => acc + expense.amount, 0) ?? 0;
    const average = getAverageAmountInPeriod(total, state.recurrence);

    return {
      page,
      total,
      average,
      expenses: filteredExpenses,
      recurrence: state.recurrence,
    };
  });

  return (
    <>
      <FlatList
        ref={listRef}
        horizontal
        inverted
        decelerationRate='fast'
        snapToAlignment='start'
        snapToInterval={Dimensions.get('window').width}
        data={data}
        style={{ width: '100%', height: '100%' }}
        renderItem={({ item }) => <ReportPage {...item} />}
      />
      <BottomSheet
        ref={reportsSheetRef}
        index={-1}
        handleStyle={{
          backgroundColor: theme.colors.card,
          borderTopLeftRadius: 12,
          borderTopRightRadius: 12,
        }}
        handleIndicatorStyle={{ backgroundColor: '#FFFFFF55' }}
        enablePanDownToClose
        snapPoints={['25%', '50%']}
      >
        <BottomSheetFlatList
          style={{ backgroundColor: theme.colors.card }}
          data={[Recurrence.Weekly, Recurrence.Monthly, Recurrence.Yearly]}
          renderItem={({ item }) => (
            <TouchableHighlight
              style={{ paddingHorizontal: 18, paddingVertical: 12 }}
              onPress={() => selectRecurrence(item)}
            >
              <Text
                style={{
                  fontSize: 18,
                  textTransform: 'capitalize',
                  color:
                    state.recurrence === item ? theme.colors.primary : 'white',
                }}
              >
                {item}
              </Text>
            </TouchableHighlight>
          )}
        />
      </BottomSheet>
    </>
  );

}