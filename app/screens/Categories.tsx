import {
  View,
  Text,
  Alert,
  Button,
  TextInput,
  KeyboardAvoidingView,
  Keyboard,
  Modal,
  ScrollView,
} from "react-native";

import { ListItem } from "../components/ListItem";
import { Entypo } from "@expo/vector-icons";
import { theme } from "../theme";
import {
  TouchableWithoutFeedback,
  TouchableOpacity,
  RectButton,
} from "react-native-gesture-handler";
import { FontAwesome } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { ColorPicker, fromHsv } from "react-native-color-picker";
import { CategoryRow } from "../components/CategoryRow";
import Swipeable from "react-native-gesture-handler/Swipeable";
import EvilIcons from "@expo/vector-icons/EvilIcons";

import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
} from "firebase/firestore";
import { auth, db } from "../firebaseConfig";
type Category = {
  id: string;
  name: string;
  color: string;
};

export const Categories = () => {
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [selectedColor, setSelectedColor] = useState(theme.colors.primary);

  const [name, setName] = useState("");

  const [category, setCategory] = useState<Category[]>([]);

  useEffect(() => {
    const user = auth.currentUser;
    if (user) {
      const uid = user.uid;
    const categoryRef = collection(db, `users/${uid}/categories`);

    const subscriber = onSnapshot(categoryRef, {
      next: (snapshot) => {
        console.log("UPDATED");
        const newCategory: Category[] = [];
        snapshot.docs.forEach((doc) => {
          const data = doc.data();
          const category: Category = {
            id: doc.id,
            name: data.name,
            color: data.color,
          };
          newCategory.push(category);
        });
        setCategory(newCategory);
      },
    });

    return () => subscriber();
  }
  }, []);

  const addHandleCategory = async () => {
    if (name.length == 0) {
      return Alert.alert("Введите название категории!");
    }
    const user = auth.currentUser;
    if (!user) {
      return Alert.alert("Пользователь не авторизован!");
    }
    const uid = user.uid;
    const newCategory = {
      id: Date.now().toString(),
      name: name,
      color: selectedColor,
    };
    try {
      // Добавляем новую категорию в коллекцию категорий пользователя
      await addDoc(collection(db, `users/${uid}/categories`), newCategory);
      // Очищаем поле ввода после добавления категории
      setName("");
    } catch (error) {
      console.error("Ошибка при добавлении категории: ", error);
      Alert.alert("Произошла ошибка при добавлении категории!");
    }
  };

  const deleteCategory = async (categoryId: string) => {
    try {
      await deleteDoc(doc(db, "categories", categoryId));
    } catch (error) {
      console.error("Error removing category: ", error);
    }
  };

  const onSelectColor = (hex: string) => {
    setSelectedColor(hex);
  };

  return (
    <>
      <KeyboardAvoidingView
        behavior="padding"
        keyboardVerticalOffset={85}
        style={{ margin: 16, flex: 1, height: "100%" }}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView>
            <View
              style={{
                flexDirection: "column",

                borderRadius: 11,
                overflow: "hidden",
              }}>
              {category.map((cat) => (
                <Swipeable
                  key={cat.id}
                  renderRightActions={() => {
                    return (
                      <View
                        style={{
                          backgroundColor: theme.colors.error,
                          width: 75,
                        }}>
                        <RectButton
                          onPress={() => deleteCategory(cat.id)}
                          style={{
                            flex: 1,
                            alignItems: "center",
                            justifyContent: "center",
                          }}>
                          <EvilIcons name="trash" size={40} color="white" />
                        </RectButton>
                      </View>
                    );
                  }}>
                  <CategoryRow name={cat.name} key={cat.id} color={cat.color} />
                </Swipeable>
              ))}
            </View>
          </ScrollView>
        </TouchableWithoutFeedback>
        <View style={{ flex: 1 }} />
        <View
          style={{
            alignItems: "center",
            display: "flex",
            justifyContent: "space-between",
            flexDirection: "row",
            paddingHorizontal: 12,
            paddingVertical: 8,
            marginBottom: 10,
          }}>
          <TouchableOpacity
            onPress={() => setShowColorPicker(!showColorPicker)}>
            <View
              style={{
                backgroundColor: selectedColor,
                width: 32,
                height: 32,
                borderRadius: 20,
                borderWidth: 2,
                borderColor: "#fff",
              }}
            />
          </TouchableOpacity>

          <TextInput
            placeholder="Название категории..."
            placeholderTextColor={theme.colors.textSecondary}
            keyboardAppearance="dark"
            value={name}
            onChange={(event) => setName(event.nativeEvent.text)}
            style={{
              color: "#fff",
              borderColor: theme.colors.border,
              borderWidth: 1,
              flex: 1,
              borderRadius: 8,
              paddingLeft: 8,
              padding: 10,
              marginLeft: 10,
            }}
          />
          <TouchableOpacity
            style={{ padding: 12 }}
            onPress={() => addHandleCategory()}>
            <FontAwesome name="send" size={24} color={theme.colors.primary} />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
      <Modal
        transparent
        visible={showColorPicker}
        animationType="fade"
        onRequestClose={() => setShowColorPicker(false)}>
        <View
          style={{
            flex: 1,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            padding: 24,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
          }}>
          <View
            style={{
              padding: 24,
              width: "100%",
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: theme.colors.card,
              overflow: "hidden",
              borderRadius: 12,
            }}>
            <ColorPicker
              hideSliders
              color={selectedColor}
              onColorChange={(color) => onSelectColor(fromHsv(color))}
              style={{ width: "100%", height: 300 }}
            />
            <Button onPress={() => setShowColorPicker(false)} title="Выбрать" />
          </View>
        </View>
      </Modal>
    </>
  );
};
