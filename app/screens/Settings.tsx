import React from "react";
import { Alert, Text, View } from "react-native";
import { ListItem } from "../components/ListItem";
import { Entypo } from "@expo/vector-icons";
import { theme } from "../theme";

export const Settings = ({ navigation }) => {
  return (
    <View
      style={{
        flexDirection: "column",
        margin: 16,
        borderRadius: 11,
        overflow: "hidden",
      }}>
      <ListItem
        label="Категории"
        detail={
          <Entypo
            name="chevron-thin-right"
            color="#fff"
            style={{ opacity: 0.3 }}
            size={20}
          />
        }
        onClick={() => {
          navigation.navigate("Категории");
        }}
      />
      <ListItem
        isDestructive
        label="Стереть все данные"
        detail={
          <Entypo
            name="chevron-thin-right"
            color="#fff"
            style={{ opacity: 0.3 }}
            size={20}
          />
        }
        onClick={() => {
          Alert.alert("Вы уверены?", "Это действие нельзя отменить");
        }}
      />
       <ListItem
        
        label="Выйти"
        detail={
          <Entypo
            name="chevron-thin-right"
            color="#fff"
            style={{ opacity: 0.3 }}
            size={20}
          />
        }
        onClick={() => {
          navigation.navigate("Auth");
        }}
      />
    </View>
  );
};
