import React, { useMemo, useRef, useState, useEffect } from "react";
import {
  Alert,
  InputAccessoryView,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableHighlight,
  View,
} from "react-native";
import { ListItem } from "../components/ListItem";
import {
  TouchableWithoutFeedback,
  TouchableOpacity,
} from "react-native-gesture-handler";
import DateTimePicker from "@react-native-community/datetimepicker";
import { theme } from "../theme";
import { MaterialIcons } from "@expo/vector-icons";
import { ExpenseList } from "../components/ExpenseList";

import BottomSheet, {
  BottomSheetFlatList,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import { Category } from "../types/category";
import { Recurrence } from "../types/recurrence";
import { addDoc, collection, onSnapshot } from "firebase/firestore";
import { auth, db } from "../firebaseConfig";
import { Camera } from "expo-camera";
import DatePicker from "react-native-datepicker";

const Add = ({ navigation, route }) => {
  const [date, setDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]); // Указываем тип данных Category[]
  const [sheetView, setSheetView] = React.useState<"recurrence" | "category">(
    "recurrence"
  );
  const [recurrence, setRecurrence] = React.useState(Recurrence.None);
  const [category, setCategory] = useState<Category>(categories[0]);
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");

  const bottomSheetRef = useRef<BottomSheet>(null);
  const keyboardRef = useRef(null);
  const snapPoints = useMemo(() => ["25%", "50%", "90%"], []);

  const [hasPermission, setHasPermission] = useState(null);
  const [scanning, setScanning] = useState(false);
  const { amountScan, dateScan } = route.params || {};

  function checkDate(date?: string): Date | null {
    if (date) {
      const year = parseInt(date.slice(0, 4), 10);
      const month = parseInt(date.slice(4, 6), 10) - 1; // уменьшаем на 1, так как месяцы в JavaScript начинаются с 0
      const day = parseInt(date.slice(6, 8), 10);
      const hours = parseInt(date.slice(9, 11), 10);
      const minutes = parseInt(date.slice(11), 10);
      const dateFormat = new Date(year, month, day, hours, minutes);
      return dateFormat;
    }
    return null;
  }

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");
    })();
    if (amountScan && dateScan) {
      setAmount(amountScan);
      setDate(checkDate(dateScan));
    }

    console.log(checkDate(dateScan));
  }, [amountScan, dateScan]);

  useEffect(() => {
    // Получаем текущего пользователя
    const user = auth.currentUser;
    if (user) {
      const uid = user.uid;
      const categoryRef = collection(db, `users/${uid}/categories`);

      const unsubscribe = onSnapshot(categoryRef, (snapshot) => {
        const categoryData: Category[] = [];
        snapshot.forEach((doc) => {
          const { id, name, color } = doc.data();
          categoryData.push({
            id,
            name,
            color,
          });
        });
        setCategories(categoryData);
      });

      return () => unsubscribe();
    }
  }, []);

  const addExpenseHandler = async () => {
    if (note.length == 0 || amount.length == 0) {
      return Alert.alert("Вы ничего не ввели!");
    }
    const user = auth.currentUser;
    if (!user) {
      return Alert.alert("Пользователь не авторизован!");
    }
    const uid = user.uid;
    const newExpense = {
      id: Date.now().toString(),
      note,
      amount: parseFloat(amount),
      category: category.name,
      date: date,
    };
    try {
      // Добавляем новый расход в коллекцию расходов пользователя
      await addDoc(collection(db, `users/${uid}/expenses`), newExpense);
      // Очищаем поля ввода после добавления расхода
      setAmount("");
      setNote("");
      // Оставляем категорию такой, какой была перед добавлением расхода
    } catch (error) {
      console.error("Ошибка при добавлении расхода: ", error);
      Alert.alert("Произошла ошибка при добавлении расхода!");
    }
  };

  const selectCategory = (selectedCategory: Category) => {
    setCategory(selectedCategory);
    bottomSheetRef.current?.close();
  };
  const selectRecurrence = (selectedRecurrence: string) => {
    setRecurrence(selectedRecurrence as Recurrence);
    bottomSheetRef.current?.close();
  };

  const toggleShowPicker = () => {
    setShowPicker(!showPicker);
  };
  const onChange = (event, newDate) => {
    setDate(newDate);
    if (Platform.OS == "android") {
      toggleShowPicker();
    }
  };

  const formatDate = (date) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return date.toLocaleDateString("ru-RU", options);
  };
  return (
    <>
      <KeyboardAvoidingView
        behavior="padding"
        keyboardVerticalOffset={112}
        style={{
          margin: 16,
          flex: 1,
          alignItems: "center",
        }}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View
            style={{
              borderRadius: 11,
              overflow: "hidden",
              width: "100%",
            }}>
            <ListItem
              label="Сумма"
              detail={
                <TextInput
                  placeholder="Сумма"
                  textAlign="right"
                  keyboardType="numeric"
                  value={amount}
                  onChangeText={setAmount}
                  style={{
                    height: 40,
                    color: "white",
                    flex: 1,
                    borderRadius: 39,
                    paddingLeft: 8,
                    fontSize: 16,
                  }}
                  ref={keyboardRef}
                  keyboardAppearance="dark"
                />
              }
            />

            <ListItem
              label="Дата"
              detail={
                <TouchableOpacity onPress={toggleShowPicker}>
                  <Text
                    style={{
                      color: theme.colors.primary,
                      fontSize: 16,
                      color: theme.colors.textPrimary,
                    }}>
                    {date ? formatDate(date) : "Выберите дату"}
                  </Text>
                </TouchableOpacity>
              }
            />
            {showPicker && (
              <DateTimePicker
                value={date}
                display="spinner"
                mode={"date"}
                is24Hour={true}
                themeVariant="dark"
                maximumDate={new Date()}
                minimumDate={
                  new Date(
                    new Date().getFullYear() - 1,
                    new Date().getMonth(),
                    new Date().getDate()
                  )
                }
                onChange={onChange}
                locale={"ru_RU"}
                
              />
            )}
            {showPicker && Platform.OS === "ios" && (
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-around",
                }}>
                <TouchableOpacity
                  style={{
                    backgroundColor: theme.colors.primary,
                    paddingHorizontal: 20,
                    paddingVertical: 13,
                    borderRadius: 10,
                    marginTop: 32,
                    marginBottom: 20,
                  }}
                  onPress={toggleShowPicker}>
                  <Text style={{ color: theme.colors.textPrimary }}>
                    Добавить
                  </Text>
                </TouchableOpacity>
              </View>
            )}

            <ListItem
              label="Запись"
              detail={
                <TextInput
                  placeholder="Запись"
                  textAlign="right"
                  value={note}
                  onChangeText={setNote}
                  style={{
                    height: 40,
                    color: "white",
                    flex: 1,
                    borderRadius: 8,
                    paddingLeft: 8,
                    fontSize: 16,
                  }}
                  keyboardAppearance="dark"
                />
              }
            />
            <ListItem
              label="Категория"
              detail={
                <TouchableOpacity
                  style={{
                    flex: 1,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                  onPress={() => {
                    setSheetView("category");
                    bottomSheetRef.current?.snapToIndex(1);
                  }}>
                  <Text
                    style={{
                      color: category ? category.color : theme.colors.primary, // Если цвет категории не определен, используем белый цвет
                      textTransform: "capitalize",
                      fontSize: 16,
                    }}>
                    {category ? category.name : "Нет категории"}
                  </Text>
                </TouchableOpacity>
              }
            />
          </View>
        </TouchableWithoutFeedback>
        <TouchableOpacity
          onPress={addExpenseHandler}
          style={{
            backgroundColor: theme.colors.primary,
            paddingHorizontal: 20,
            paddingVertical: 13,
            borderRadius: 10,
            marginTop: 32,
          }}>
          <Text style={{ color: "white", fontWeight: "600", fontSize: 17 }}>
            Добавить расход
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.navigate("Сканирование")}
          style={{
            backgroundColor: theme.colors.primary,
            paddingHorizontal: 20,
            paddingVertical: 13,
            borderRadius: 10,
            marginTop: 32,
          }}>
          <Text style={{ color: "white", fontWeight: "600", fontSize: 17 }}>
            Сканировать QR код
          </Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>

      <BottomSheet
        ref={bottomSheetRef}
        index={-1}
        handleStyle={{
          backgroundColor: theme.colors.card,
          borderTopLeftRadius: 12,
          borderTopRightRadius: 12,
        }}
        handleIndicatorStyle={{ backgroundColor: "#FFFFFF55" }}
        enablePanDownToClose
        snapPoints={snapPoints}
        onChange={(index) => {
          if (index === 0) {
            setSheetView("");
          }
        }}>
        {sheetView === "recurrence" && (
          <BottomSheetFlatList
            data={Object.keys(Recurrence)}
            keyExtractor={(i) => i}
            renderItem={(item) => (
              <TouchableOpacity
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  paddingHorizontal: 16,
                  paddingVertical: 12,
                }}
                onPress={() => selectRecurrence(item.item)}>
                <Text style={{ color: "white", fontSize: 18 }}>
                  {item.item}
                </Text>
              </TouchableOpacity>
            )}
            style={{ backgroundColor: theme.colors.card }}
          />
        )}
        {sheetView === "category" && (
          <BottomSheetFlatList
            style={{ backgroundColor: theme.colors.card }}
            data={categories}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => selectCategory(item)}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  paddingHorizontal: 16,
                  paddingVertical: 12,
                }}>
                <View
                  style={{
                    backgroundColor: item ? item.color : theme.colors.primary,
                    width: 20,
                    height: 20,
                    borderRadius: 10,
                    marginRight: 12,
                  }}
                />
                <Text style={{ color: "#FFF", fontSize: 18, marginLeft: 12 }}>
                  {item ? item.name : "Нет категории"}
                </Text>
              </TouchableOpacity>
            )}
          />
        )}
        {sheetView === "category" && categories.length === 0 && (
          <View style={{ alignItems: "center", paddingVertical: 20 }}>
            <Text style={{ fontSize: 18, color: "#777" }}>
              У вас нет категорий
            </Text>
          </View>
        )}
      </BottomSheet>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "black",
  },
  cameraContainer: {
    flex: 1,
    position: "relative",
  },
  camera: {
    flex: 1,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
  },
  scanButton: {
    backgroundColor: "rgba(255,255,255,0.3)",
    borderRadius: 50,
    padding: 20,
  },
  scanButtonText: {
    color: "white",
    fontSize: 16,
  },
  exitButton: {
    position: "absolute",
    bottom: 20,
    left: 20,
    backgroundColor: "rgba(255,255,255,0.3)",
    padding: 15,
    borderRadius: 10,
  },
  exitButtonText: {
    color: "white",
    fontSize: 16,
  },
});

export default Add;
