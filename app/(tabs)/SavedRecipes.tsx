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
import {
  faMagnifyingGlass,
  faBookmark,
} from "@fortawesome/free-solid-svg-icons";
import { useRouter } from "expo-router";
import { useRecipeContext } from "../config/RecipeContext";
import { MealDisplayBox } from "@/components/MealDisplayBox";

interface Recipe {
  id: number;
  title: string;
  image: string;
  readyInMinutes: number;
  servings: number;
}

const SavedRecipes: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const { savedRecipes, removeRecipe } = useRecipeContext();
  const router = useRouter();

  // Filter saved recipes based on search query
  const filteredRecipes = savedRecipes.filter((recipe) =>
    recipe.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSearch = () => {
    Keyboard.dismiss();
  };

  return (
    <SafeAreaProvider style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <Text style={styles.title}>Saved Recipes</Text>
          <ThemedButton
            title="Search"
            bookmark={false}
            onPress={() => router.push("./RecipeSearch")}
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
                : "No saved recipes yet...\nTry saving some recipes from the search page!"}
            </Text>
          </View>
        ) : (
          <MealDisplayBox recipes={filteredRecipes}></MealDisplayBox>
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
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  title: {
    fontFamily: "InterBold",
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
    fontFamily: "InterRegular",
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
    fontFamily: "InterMedium",
    fontSize: 16,
    marginBottom: 5,
  },
  recipeSubtext1: {
    color: "rgba(34, 34, 34, 1)",
    fontFamily: "InterLightItalic",
    fontSize: 12,
    marginBottom: 2,
  },
  recipeSubtext2: {
    color: "rgba(34, 34, 34, 1)",
    fontFamily: "InterLightItalic",
    fontSize: 12,
  },
  bookmarkButton: {
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  noRecipesContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  noRecipesText: {
    fontFamily: "InterRegular",
    fontSize: 16,
    color: "#222222",
    textAlign: "center",
  },
});

export default SavedRecipes;
