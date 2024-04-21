import React, { FC, createContext, useEffect, useMemo, useState, ReactNode } from "react";
import { View, Text, Alert } from "react-native";
import { User, onAuthStateChanged } from "firebase/auth";
import { auth, db, login, logout, register } from "../firebaseConfig";
import { addDoc, collection } from "firebase/firestore";
interface IContext {
  user: User ;
  isLoading: boolean;
  register: (email: string, password: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<IContext>({} as IContext);

export const AuthProvider:FC<{ children: ReactNode }> = ({children}) => {
  const [user, setUser] = useState<User >(null);
  const [isLoadingInitial, setIsLoadingInitial] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const registerHandler = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const { user } = await register(email, password);
      const doc = await addDoc(collection(db, "users"), {
        _id: user.uid,
        displayName: "No name",
      });
    } catch (error) {
      Alert.alert("Ошибка регистрации: ", error);
    } finally {
      setIsLoading(false);
    }
  };

  const loginHandler = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      await login(email, password);
    } catch (error) {
      Alert.alert("Ошибка авторизации: ", error);
    } finally {
      setIsLoading(false);
    }
  };

  const logoutHandler = async () => {
    setIsLoading(true);
    try {
      await logout();
    } catch (error) {
      Alert.alert("Ошибка выхода: ", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user || null);
      setIsLoadingInitial(false);
    });

    return () => unsubscribe();
  }, []);

  const value = useMemo(
    () => ({
      user,
      isLoading,
      login: loginHandler,
      register: registerHandler,
      logout: logoutHandler,
    }),
    [user, isLoading]
  );
  return (
    <AuthContext.Provider value={value}>
      {!isLoadingInitial && children}
    </AuthContext.Provider>
  );
};
