import { View, Text } from "react-native";
import React, { useState } from "react";
import { theme } from "../theme";
import { IExpenses } from "../types/expenses";



type Props = {
  item: IExpenses;
};

export const ExpenseRow = ({ item }: Props) => {
  return (
    <View
      style={{ display: "flex", flexDirection: "column", marginBottom: 12 }}>
      <View
        style={{
          width: "100%",
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 4,
        }}>
        <Text
          style={{
            fontSize: 17,
            fontWeight: "600",
            color: theme.colors.textPrimary,
          }}>
          {item.note}
        </Text>
        <Text
          style={{
            fontSize: 17,
            fontWeight: "600",
            color: theme.colors.textPrimary,
          }}>
          {item.amount}
        </Text>
      </View>
      <View
        style={{
          width: "100%",
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}>
        <View
          style={{
            backgroundColor: theme.colors.card,
            paddingHorizontal: 6,
            paddingVertical: 2,
            borderRadius: 8,
          }}>
          <Text style={{ color: theme.colors.primary, fontSize: 13 }}>
            {item.category}
          </Text>
        </View>
        <Text style={{ fontSize: 17, color: theme.colors.textSecondary }}>
        {`${item.date.getHours()}`.padStart(2, '0')}:
        {`${item.date.getMinutes()}`.padStart(2, '0')}
        </Text>
      </View>
    </View>
  );
};
