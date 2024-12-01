import React, { useState, useEffect } from "react";
import {
  Text,
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faCircle } from "@fortawesome/free-regular-svg-icons";
import {
  faAdd,
  faCircle as faCircleFill,
  faX,
} from "@fortawesome/free-solid-svg-icons";
import { RecipeProvider } from "../config/RecipeContext";
import { useLocalSearchParams } from "expo-router";

type GroceryItem = {
  id: string;
  name: string;
  isEdit: boolean;
  isCrossOut: boolean;
};

export default function Component() {
  const [groceryList, setGroceryList] = useState<GroceryItem[]>([]);

  useEffect(() => {
    loadGroceryList();
  }, []);

  useEffect(() => {
    saveGroceryList();
  }, [groceryList]);

  const loadGroceryList = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem("@grocery_list");
      if (jsonValue != null) {
        setGroceryList(JSON.parse(jsonValue));
      }
    } catch (e) {
      console.error("Failed to load grocery list:", e);
    }
  };

  const saveGroceryList = async () => {
    try {
      const jsonValue = JSON.stringify(groceryList);
      await AsyncStorage.setItem("@grocery_list", jsonValue);
    } catch (e) {
      console.error("Failed to save grocery list:", e);
    }
  };

  const handleAddItem = () => {
    setGroceryList([
      ...groceryList,
      { id: Date.now().toString(), name: "", isEdit: true, isCrossOut: false },
    ]);
  };

  const handleSaveItem = (id: string) => {
    setGroceryList((prevList) =>
      prevList.map((item) =>
        item.id === id ? { ...item, isEdit: false } : item
      )
    );
  };

  const handleUpdateItem = (id: string, text: string) => {
    setGroceryList((prevList) =>
      prevList.map((item) => (item.id === id ? { ...item, name: text } : item))
    );
  };

  const toggleCompletion = (id: string) => {
    setGroceryList(
      groceryList.map((item) =>
        item.id === id ? { ...item, isCrossOut: !item.isCrossOut } : item
      )
    );
  };

  const removeGroceryItem = (id: string) => {
    setGroceryList(groceryList.filter((item) => item.id !== id));
  };

  const handleBlur = (id: string) => {
    setGroceryList((prevList) =>
      prevList.filter((item) => item.id !== id || item.name.trim() !== "")
    );
  };

  const renderItem = ({ item }: { item: GroceryItem }) => (
    <View style={styles.itemContainer}>
      <TouchableOpacity onPress={() => toggleCompletion(item.id)}>
        {item.isCrossOut ? (
          <FontAwesomeIcon
            icon={faCircleFill}
            size={26}
            style={{ color: "#3B4937" }}
          />
        ) : (
          <View>
            <FontAwesomeIcon
              icon={faCircle}
              size={26}
              style={{ color: "#3B4937" }}
            />
            <View style={styles.opaqueCenter}></View>
          </View>
        )}
      </TouchableOpacity>
      {item.isEdit ? (
        <TextInput
          style={styles.input}
          placeholder="Enter item name"
          value={item.name}
          onChangeText={(text) => handleUpdateItem(item.id, text)}
          onSubmitEditing={() => handleSaveItem(item.id)}
          onBlur={() => handleBlur(item.id)}
          autoFocus
        />
      ) : (
        <Text
          style={[styles.itemText, item.isCrossOut && styles.completedText]}
        >
          {item.name}
        </Text>
      )}
      <TouchableOpacity onPress={() => removeGroceryItem(item.id)}>
        <FontAwesomeIcon icon={faX} size={16} style={{ color: "#222222" }} />
      </TouchableOpacity>
    </View>
  );

  return (
    <RecipeProvider>
      <SafeAreaProvider
        style={{
          paddingTop: 20,
          backgroundColor: "rgba(243, 237, 228, 1)",
        }}
      >
        <Text style={styles.title}>Shopping List</Text>
        <KeyboardAvoidingView style={{ flex: 1 }}>
          <FlatList
            data={groceryList}
            contentContainerStyle={styles.ingredientContainer}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
            ListFooterComponent={
              <TouchableOpacity style={styles.button} onPress={handleAddItem}>
                <Text style={styles.buttonText}>+ Add</Text>
              </TouchableOpacity>
            }
          />
        </KeyboardAvoidingView>
      </SafeAreaProvider>
    </RecipeProvider>
  );
}

const styles = StyleSheet.create({
  title: {
    fontFamily: "InterBold",
    fontSize: 24,
    color: "#222222",
    padding: 20,
  },
  ingredientContainer: {
    backgroundColor: "#b8c8a7",
    flex: 1,
    flexDirection: "column",
    padding: 12,
  },
  input: {
    flex: 1,
    paddingLeft: 8,
    backgroundColor: "#b8c8a7",
    flexDirection: "row",
    fontFamily: "InterRegular",
    fontSize: 18,
  },
  itemContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 4,
  },
  itemText: {
    paddingLeft: 8,
    paddingBottom: 2,
    flex: 1,
    fontSize: 18,
    fontFamily: "InterRegular",
  },
  button: {
    width: 85,
    height: 35,
    borderRadius: 100,
    borderColor: "#3B4937",
    borderWidth: 1.75,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
    margin: 4,
  },
  buttonText: {
    textAlign: "center",
    color: "#222222",
    fontFamily: "InterMedium",
    fontSize: 18,
  },
  completedText: {
    textDecorationLine: "line-through",
    color: "gray",
  },
  opaqueCenter: {
    position: "absolute",
    top: 1.75,
    left: 1.5,
    height: 23,
    width: 23,
    backgroundColor: "rgba(59,77,50,.30)",
    borderRadius: 50,
  },
});
