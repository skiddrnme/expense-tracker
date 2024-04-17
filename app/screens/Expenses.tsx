import React, { useState, useRef, useEffect } from "react";
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  TouchableHighlight,
} from "react-native";
import { ExpenseRow } from "../components/ExpenseRow";

import { Recurrence } from "../types/recurrence";

import BottomSheet, {
  BottomSheetFlatList,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import * as Sentry from "sentry-expo";
import { theme } from "../theme";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchExpenses,
  selectExpenses,
} from "../../store/slices/expensesSlice";
import { ExpenseList } from "../components/ExpenseList";
import { getPlainRecurrence } from "../utils/recurrenses";
import {
  useFilteredAndGroupedExpenses,
  getAverageAmountInPeriod,
} from "../utils/expenses"; // обновлен импорт
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../firebaseConfig";
import { IExpenses } from "../types/expenses";
const Expenses = () => {
  const [expenses, setExpenses] = useState<IExpenses[]>([]);
  // const expenses = useSelector(selectExpenses)
  const [recurrence, setRecurrence] = React.useState(Recurrence.Weekly);
  const recurrenceSheetRef = useRef<BottomSheet>();
  const groupedExpenses = useFilteredAndGroupedExpenses(expenses, recurrence);
  const total = groupedExpenses.reduce((sum, group) => (sum += group.total), 0);

  const changeRecurrence = (newRecurrence: Recurrence) => {
    setRecurrence(newRecurrence);
    recurrenceSheetRef.current?.close();
  };
  console.log(expenses);
  useEffect(() => {
    const expenseRef = collection(db, "expenses");

    const subscriber = onSnapshot(expenseRef, {
      next: (snapshot) => {
        const newExpense: IExpenses[] = [];
        snapshot.docs.forEach((doc) => {
          const data = doc.data();
          const expense: IExpenses = {
            id: data.id,
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
  }, []);

  return (
    <>
      <View
        style={{
          display: "flex",
          flexDirection: "column",
          overflow: "scroll",
          paddingHorizontal: 16,
          width: "100%",
          paddingTop: 16,
        }}>
        <View
          style={{
            display: "flex",
            width: "100%",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 16,
          }}>
          <Text style={{ color: theme.colors.textPrimary, fontSize: 17 }}>
            Расходы за
          </Text>
          <TouchableOpacity
            style={{ marginLeft: 16 }}
            onPress={() => recurrenceSheetRef.current?.expand()}>
            <Text style={{ color: theme.colors.primary, fontSize: 17 }}>
              {getPlainRecurrence(recurrence)}
            </Text>
          </TouchableOpacity>
        </View>
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "flex-start",
            justifyContent: "center",
            width: "100%",
            marginBottom: 16,
          }}>
          <Text
            style={{
              color: theme.colors.textSecondary,
              fontSize: 17,
              marginTop: 2,
            }}>
            ₽
          </Text>
          <Text
            style={{
              color: theme.colors.textPrimary,
              fontSize: 40,
              fontWeight: "600",
              marginLeft: 2,
            }}>
            {total}
          </Text>
        </View>
        <ExpenseList groups={groupedExpenses} />
      </View>
      <BottomSheet
        ref={recurrenceSheetRef}
        index={-1}
        handleStyle={{
          backgroundColor: theme.colors.card,
          borderTopLeftRadius: 12,
          borderTopRightRadius: 12,
        }}
        handleIndicatorStyle={{ backgroundColor: "#FFFFFF55" }}
        enablePanDownToClose
        snapPoints={["25%", "50%"]}>
        <BottomSheetFlatList
          style={{ backgroundColor: theme.colors.card }}
          data={[
            Recurrence.Daily,
            Recurrence.Weekly,
            Recurrence.Monthly,
            Recurrence.Yearly,
          ]}
          renderItem={({ item }) => (
            <TouchableHighlight
              style={{ paddingHorizontal: 18, paddingVertical: 12 }}
              onPress={() => changeRecurrence(item)}>
              <Text
                style={{
                  fontSize: 18,
                  textTransform: "capitalize",
                  color: recurrence === item ? theme.colors.primary : "white",
                }}>
                This {getPlainRecurrence(item)}
              </Text>
            </TouchableHighlight>
          )}
        />
      </BottomSheet>
    </>
  );
};

export { Expenses };

const styles = StyleSheet.create({
  container: {
    margin: 15,
    color: "#fff",
  },
  text: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "700",
  },
});