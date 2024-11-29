import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Keyboard,
  FlatList,
  Image,
  ListRenderItem,
} from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { ThemedButton } from "@/components/Button";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useRecipeContext } from "./config/RecipeContext";
import { Border, Color, FontFamily, FontSize } from "./GlobalStyles";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface Ingredient {
  name: string;
  amount: number;
  unit: string;
}

interface Recipe {
  id: number;
  title: string;
  image: string;
  readyInMinutes: number;
  servings: number;
  includeIngredients: string;
}

const AddRecipe: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const { savedRecipes, addRecipeToDay } = useRecipeContext();
  const router = useRouter();
  const { day, date } = useLocalSearchParams<{ day: string; date: string }>();

  const filteredRecipes = savedRecipes.filter((recipe) =>
    recipe.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSearch = () => {
    Keyboard.dismiss();
  };

  const handleAddRecipe = async (recipe: Recipe) => {
    addRecipeToDay(day, date, recipe);
    router.back();
  };

  const addIngredientsToGroceryList = async (ingredients: string) => {
    try {
      // Get the current grocery list
      const jsonValue = await AsyncStorage.getItem("@grocery_list");
      let groceryList = jsonValue != null ? JSON.parse(jsonValue) : [];

      const newIngredients = ingredients.split(",").map((item) => item.trim());
      // Add new ingredients
      // const newIngredients = ingredientArr.map((ing) => ({
      //   id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      //   name: `${ing.amount} ${ing.unit} ${ing.name}`.trim(),
      //   isEdit: false,
      //   isCrossOut: false,
      // }));

      groceryList = [...groceryList, ...newIngredients];

      // Save the updated grocery list
      await AsyncStorage.setItem("@grocery_list", JSON.stringify(groceryList));
    } catch (e) {
      console.error("Failed to update grocery list:", e);
    }
  };

  const renderRecipeItem: ListRenderItem<Recipe> = ({ item }) => (
    <View style={styles.recipeDisplayContainer}>
      <Image
        source={{ uri: item.image }}
        style={styles.image}
        onError={(e) =>
          console.log("Image loading error:", e.nativeEvent.error)
        }
      />
      <View style={styles.recipeInfo}>
        <Text style={styles.recipeTitle}>{item.title}</Text>
        <Text style={styles.recipeSubtext1}>
          Ready in {item.readyInMinutes} minutes
        </Text>
        <Text style={styles.recipeSubtext2}>Servings: {item.servings}</Text>
      </View>
      <TouchableOpacity
        onPress={() => handleAddRecipe(item)}
        style={styles.addButton}
      >
        <Text style={styles.addButtonText}>Add</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaProvider style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <Text style={styles.title}>Add Recipe for {day}</Text>
          <ThemedButton
            title="Search"
            bookmark={false}
            onPress={() => router.push("/RecipeSearch")}
          />
        </View>

        <View style={styles.searchContainer}>
          <TouchableOpacity onPress={handleSearch}>
            <FontAwesomeIcon
              icon={faMagnifyingGlass}
              color="#222222"
              style={styles.searchIcon}
            />
          </TouchableOpacity>
          <TextInput
            style={styles.input}
            onChangeText={setSearchQuery}
            value={searchQuery}
            onSubmitEditing={handleSearch}
            placeholder="Search saved recipes"
            placeholderTextColor="#555555"
          />
        </View>

        {filteredRecipes.length === 0 ? (
          <View style={styles.noRecipesContainer}>
            <Text style={styles.noRecipesText}>
              {searchQuery
                ? "No saved recipes match your search"
                : "No saved recipes yet. Try saving some recipes from the search page!"}
            </Text>
          </View>
        ) : (
          <FlatList<Recipe>
            data={filteredRecipes}
            renderItem={renderRecipeItem}
            keyExtractor={(item) => item.id.toString()}
            style={styles.recipeList}
          />
        )}
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "rgba(243, 237, 228, 1)",
  },
  safeArea: {
    flex: 1,
    padding: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  title: {
    fontFamily: FontFamily.interBold,
    fontSize: 24,
    color: "#222222",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(212, 206, 195, 1)",
    borderRadius: 24,
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  searchIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    padding: 10,
    fontFamily: FontFamily.interRegular,
  },
  recipeList: {
    flex: 1,
  },
  recipeDisplayContainer: {
    backgroundColor: "rgba(184, 200, 167, 1)",
    flexDirection: "row",
    borderRadius: 16,
    marginBottom: 15,
    overflow: "hidden",
  },
  image: {
    width: 130,
    height: 130,
  },
  recipeInfo: {
    flex: 1,
    padding: 10,
  },
  recipeTitle: {
    color: "rgba(34, 34, 34, 1)",
    fontFamily: FontFamily.interMedium,
    fontSize: 16,
    marginBottom: 5,
  },
  recipeSubtext1: {
    color: "rgba(34, 34, 34, 1)",
    fontFamily: FontFamily.interLight,
    fontStyle: "italic",
    fontSize: 12,
    marginBottom: 2,
  },
  recipeSubtext2: {
    color: "rgba(34, 34, 34, 1)",
    fontFamily: FontFamily.interLight,
    fontStyle: "italic",
    fontSize: 12,
  },
  addButton: {
    width: 83,
    height: 30,
    borderRadius: Border.br_81xl,
    backgroundColor: Color.colorDarkslategray_100,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    marginRight: 10,
  },
  addButtonText: {
    fontFamily: FontFamily.interSemiBold,
    fontWeight: "600",
    fontSize: FontSize.size_sm,
    color: Color.colorWhite,
  },
  noRecipesContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  noRecipesText: {
    fontFamily: FontFamily.interRegular,
    fontSize: 16,
    color: "#222222",
    textAlign: "center",
  },
});

export default AddRecipe;
