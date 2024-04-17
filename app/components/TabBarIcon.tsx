import React from "react";

import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";
type TabBarIconProps = {
  focused: boolean;
  color: string;
  size: number;
  type: "expenses" | "add" | "reports" | "settings";
};

export const TabBarIcon = ({ type, color, size, focused }: TabBarIconProps) => {
  switch (type) {
    case "expenses":
      return (
        <MaterialCommunityIcons
          name="tray-arrow-up"
          size={size}
          color={color}
        />
      );
    case "add":
      return <AntDesign name="plus" size={size} color={color} />;
    case "reports":
      return <Ionicons name="bar-chart" size={size} color={color} />;
    case "settings":
      return <MaterialCommunityIcons name="cog" size={size} color={color} />;
    default:
      return null;
  }
};
