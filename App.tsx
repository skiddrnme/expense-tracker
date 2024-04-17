import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { theme } from "./app/theme";
import { TabBarIcon } from "./app/components/TabBarIcon";
import { Home } from "./app/screens/Home";
import { Categories } from "./app/screens/Categories";
import { useRef, useState } from "react";

import { BSON } from "realm";
import { Provider } from "react-redux";
import { store } from "./store/store";
import * as Sentry from "sentry-expo";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { Profile } from "./app/screens/Profile";
import { AuthScreen } from "./app/screens/Auth";
import { Scanning } from "./app/screens/Scanning";
import { AuthProvider } from "./app/providers/AuthProvider";
import { useAuth } from "./app/hooks/useAuth";

const Stack = createStackNavigator();

export default function App() {
  const user = useAuth();

  return (
    <AuthProvider>
      <Provider store={store}>
        <NavigationContainer theme={theme}>
          <StatusBar style="light" />
          <Stack.Navigator>
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

            <Stack.Screen
              name="Auth"
              component={AuthScreen}
              options={{ headerShown: false }}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </Provider>
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    margin: 50,
    color: "#fff",
  },
});
