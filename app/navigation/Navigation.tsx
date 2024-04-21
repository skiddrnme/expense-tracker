import React, { FC } from "react";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { theme } from "../theme";

import { Home } from "../screens/Home";
import { Categories } from "../screens/Categories";
import { useEffect, useRef, useState } from "react";

import { BSON } from "realm";
import { Provider } from "react-redux";

import * as Sentry from "sentry-expo";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { Profile } from "../screens/Profile";
import { AuthScreen } from "../screens/Auth";
import { Scanning } from "../screens/Scanning";
import { useAuth } from "../hooks/useAuth";

const Stack = createStackNavigator();

export const Navigation:FC = () => {
  const { user }  = useAuth();

  return (
    <>
      <NavigationContainer theme={theme}>
        <StatusBar style="light" />
        <Stack.Navigator>
          {user ? (
            <>
              <Stack.Screen
                name="Назад"
                component={Home}
                options={{ headerShown: false }}
              />

              <Stack.Screen name="Категории" component={Categories} />
              <Stack.Screen name="Профиль" component={Profile} />
              <Stack.Screen name="Сканирование" component={Scanning} />
            </>
          ) : (
            <Stack.Screen
              name="Auth"
              component={AuthScreen}
              options={{ headerShown: false }}
            />
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </>
  );
};
