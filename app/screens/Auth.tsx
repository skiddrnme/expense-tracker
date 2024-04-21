import { useAuth } from "../hooks/useAuth";
import React, { FC, useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import Loader from "../components/UI/Loader";
import { auth } from "../firebaseConfig";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { theme } from "../theme";
interface IData {
  email: string;
  password: string;
}

export const AuthScreen: FC = ({}) => {
  const [isReg, setIsReg] = useState(false);
  const { isLoading, login, register } = useAuth();
  // const [data, setData] = useState<IData>({} as IData);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);
  const toggleForm = () => {
    setIsReg(!isReg);
  };
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });

    return () => unsubscribe();
  }, [auth]);
  const handleLogin = async () => {
    try {
      if (user) {
        // If user is already authenticated, log out
        console.log("User logged out successfully!");
        await signOut(auth);
      } else {
        // Sign in or sign up
        if (isReg) {
          // Sign in
          await signInWithEmailAndPassword(auth, email, password);
          console.log("User signed in successfully!");
        } else {
          // Sign up
          await createUserWithEmailAndPassword(auth, email, password);
          console.log("User created successfully!");
        }
      }
    } catch (error) {
      console.error("Authentication error:", error.message);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <Text style={styles.title}>{isReg ? "Логин" : "Регистрация"}</Text>
        {isLoading ? (
          <Loader />
        ) : (
          <>
            <TextInput
              placeholder="Email"
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              placeholderTextColor="#aaa"
              keyboardAppearance="dark"
            />

            <TextInput
              value={password}
              placeholder="Пароль"
              style={styles.input}
              secureTextEntry={true}
              onChangeText={setPassword}
              placeholderTextColor="#aaa"
              keyboardAppearance="dark"
            />

            <TouchableOpacity onPress={toggleForm} style={styles.button}>
              <Text style={styles.buttonText}>
                {isReg
                  ? "Нет аккаунта? Регистрация"
                  : "Уже есть аккаунт? Логин"}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleLogin} style={styles.button}>
              <Text style={styles.buttonText}>
                {isReg ? "Войти" : "Зарегистрироваться"}
              </Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: theme.colors.background, // Темно-серый цвет фона
  },
  title: {
    color: theme.colors.textPrimary, // Цвет текста: голубой
    fontSize: 24,
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: theme.colors.textPrimary, // Цвет границы: голубой
    width: 200,
    marginVertical: 10,
    padding: 15,
    color: "#fff", // Белый цвет текста
    borderRadius: 10, // Скругленные углы
  },
  button: {
    backgroundColor: theme.colors.card, // Цвет фона кнопок: голубой
    padding: 10,
    marginVertical: 5,
    borderRadius: 10, // Скругленные углы
  },
  buttonText: {
    color: "#fff", // Белый цвет текста кнопок
    
  },
});
