import React, { useState } from "react";
import { FlatList, View, Text } from "react-native";
import { ExpenseRow } from "./ExpenseRow";
import { IExpenses } from "../types/expenses";
import { ExpensesGroup } from "../types/expense-group";
import { theme } from "../theme";

type Props = {
  groups: ExpensesGroup[];
};

export const ExpenseList = ({ groups }: Props) => {
  // Метод для добавления нового расхода

  return (
    <FlatList
      style={{ height: "100%" }}
      data={groups}
      keyExtractor={(item) => item.day}
      renderItem={({ item: { day, expenses, total } }) => (
        <View
          style={{
            display: "flex",
            flexDirection: "column",
            marginBottom: 24,
          }}>
          <Text
            style={{
              marginBottom: 4,
              color: theme.colors.textSecondary,
              fontSize: 17,
              fontWeight: "600",
            }}>
            {day}
          </Text>
          <View
            style={{
              borderBottomColor: theme.colors.border,
              borderBottomWidth: 2,
              marginBottom: 8,
            }}
          />
          {expenses.map((expense) => (
            <ExpenseRow key={expense.id} item={expense} />
          ))}
          <View
            style={{
              borderBottomColor: theme.colors.border,
              borderBottomWidth: 2,
              marginBottom: 4,
            }}
          />
          <View
            style={{
              width: "100%",
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}>
            <Text
              style={{
                fontSize: 17,
                color: theme.colors.textSecondary,
              }}>
              Итого:
            </Text>
            <Text
              style={{
                fontSize: 17,
                color: theme.colors.textSecondary,
                fontWeight: "600",
              }}>
              РУБ {total}
            </Text>
          </View>
        </View>
      )}
    />
  );
};
