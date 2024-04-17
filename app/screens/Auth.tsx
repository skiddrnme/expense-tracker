import { useAuth } from "../hooks/useAuth";
import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";

interface IData {
  email: string;
  password: string;
}

export function AuthScreen({ navigation }) {
  const [isLogin, setIsLogin] = useState(true);
  const { isLoading, login, register } = useAuth();
  const [data, setData] = useState<IData>({} as IData);

  const toggleForm = () => {
    setIsLogin(!isLogin);
  };
  const handleLogin = async () => {
    const { email, password } = data;
    if (!isLogin) await register(email, password);
    else await login(email, password);
    setData({} as IData);
    navigation.navigate("Назад");
  };

  const handleInputChange = (key: keyof IData, value: string) => {
    setData((prevData) => ({ ...prevData, [key]: value }));
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <Text style={styles.title}>{isLogin ? "Логин" : "Регистрация"}</Text>
        <View>
          <TextInput
            placeholder="Email"
            style={styles.input}
            value={data.email}
            onChangeText={(text) => handleInputChange("email", text)}
          />
          <TextInput
            value={data.password}
            placeholder="Пароль"
            style={styles.input}
            secureTextEntry={true}
            onChangeText={(text) => handleInputChange("password", text)}
          />
        </View>
        <TouchableOpacity onPress={toggleForm} style={styles.button}>
          <Text style={styles.buttonText}>
            {isLogin ? "Нет аккаунта? Регистрация" : "Уже есть аккаунт? Логин"}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleLogin} style={styles.button}>
          <Text style={styles.buttonText}>
            {isLogin ? "Войти" : "Зарегистрироваться"}
          </Text>
        </TouchableOpacity>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    color: "#fff", // Белый цвет текста
    fontSize: 24,
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "gray",
    width: 200,
    marginVertical: 10,
    padding: 5,
    color: "#fff", // Белый цвет текста
  },
  button: {
    backgroundColor: "#fff", // Белый цвет фона
    padding: 10,
    marginVertical: 5,
    borderRadius: 5,
  },
  buttonText: {
    color: "#000", // Черный цвет текста
  },
});
