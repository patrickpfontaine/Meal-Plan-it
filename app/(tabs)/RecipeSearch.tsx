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
  ActivityIndicator,
} from "react-native";
import Constants from "expo-constants";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { ThemedButton } from "@/components/Button";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import {
  faMagnifyingGlass,
  faBookmark,
} from "@fortawesome/free-solid-svg-icons";
import { useRouter } from "expo-router";
import { useRecipeContext } from "../config/RecipeContext";
import { RECIPE_API_KEY } from "../config/RecipeAPIconfig"; // Import the API key
import { MealDisplayBox } from "@/components/MealDisplayBox";

interface Recipe {
  id: number;
  title: string;
  image: string;
  readyInMinutes: number;
  servings: number;
  includeIngredients: string;
}

const RecipeSearch = () => {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { addRecipe, removeRecipe, recipeSearch, addRecipeIngredients } =
    useRecipeContext();
  const router = useRouter();
  const apiKey = RECIPE_API_KEY;

  const handleSearch = async () => {
    setLoading(true);
    setRecipes([]);
    Keyboard.dismiss();

    try {
      const url = `https://api.spoonacular.com/recipes/complexSearch?query=${encodeURIComponent(
        searchQuery
      )}&apiKey=${apiKey}&addRecipeInformation=true`;

      const response = await fetch(url);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch recipes");
      }

      if (data.results && Array.isArray(data.results)) {
        setRecipes(data.results);
        if (data.results.length === 0) {
          //setError("No recipes found. Try a different search term.");
        }
      } else {
        throw new Error("Invalid data format received from API");
      }
    } catch (err: any) {
      console.error("Error fetching recipes:", err);
      //setError(err.message || "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  const toggleSaveRecipe = (recipe: Recipe) => {
    if (recipeSearch(recipe.id)) {
      removeRecipe(recipe.id);
    } else {
      addRecipe(recipe);
      console.log("ingredinets", recipe.includeIngredients);
    }
  };

  const renderRecipeItem = ({ item }: { item: Recipe }) => (
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
        onPress={() => toggleSaveRecipe(item)}
        style={styles.bookmarkButton}
      >
        <FontAwesomeIcon
          icon={faBookmark}
          color={recipeSearch(item.id) ? "#B8C8A7" : "#222222"}
          size={24}
        />
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaProvider style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <Text style={styles.title}>Recipe Search</Text>
          <ThemedButton
            title="Saved"
            bookmark={true}
            onPress={() => router.push("/SavedRecipes")}
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
            placeholder="Search for a recipe"
            placeholderTextColor="#555555"
          />
        </View>
        {loading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#B8C8A7" />
            <Text style={styles.loadingText}>Loading recipes...</Text>
          </View>
        )}
        {!loading && recipes.length > 0 && (
          <MealDisplayBox recipes={recipes}></MealDisplayBox>
        )}
        {!loading && recipes.length === 0 && (
          <View style={styles.promptContainer}>
            <Text style={styles.promptText}>
              {searchQuery
                ? "No recipes found. Try a different search term."
                : "Feeling hungry?\nSearch for a recipe to get started!"}
            </Text>
          </View>
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
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 10,
    fontFamily: "InterRegular",
    fontSize: 16,
    color: "#222222",
  },
  noResultsText: {
    textAlign: "center",
    marginVertical: 20,
    fontFamily: "InterRegular",
    fontSize: 16,
    color: "#222222",
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
    padding: 10,
    justifyContent: "center",
  },
  promptContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  promptText: {
    fontFamily: "InterRegular",
    fontSize: 18,
    color: "#222222",
    textAlign: "center",
  },
});

export default RecipeSearch;
