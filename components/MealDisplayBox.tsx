import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import {
  FlatList,
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  ScrollView,
  Linking,
  Alert,
} from "react-native";
import { faBookmark as regularBookmark } from "@fortawesome/free-regular-svg-icons";
import { faBookmark as solidBookmark } from "@fortawesome/free-solid-svg-icons";
import { RecipeProvider, useRecipeContext } from "../app/config/RecipeContext";
import { ThemedButton } from "./Button";
import React from "react";

interface MealDisplayBoxProps {
  recipes: any[];
}

export function MealDisplayBox({ recipes }: MealDisplayBoxProps) {
  const { addRecipe, removeRecipe, recipeSearch, savedRecipes } =
    useRecipeContext();

  const handleBookmark = (recipe: any) => {
    if (!recipeSearch(recipe.id)) {
      addRecipe(recipe);
    } else {
      removeRecipe(recipe.id);
    }
  };

  const isBookmark = (recipe: any) => recipeSearch(recipe.id);

  const handleRecipePress = (recipe: any) => {
    const recipeUrl = recipe.sourceUrl;
    if (recipeUrl) {
      Linking.openURL(recipeUrl).catch((err) =>
        Alert.alert("Error", "Failed to open the recipe URL.")
      );
    } else {
      Alert.alert("Error", "Recipe URL not available");
    }
  };

  return (
    <RecipeProvider>
      <SafeAreaView style={{ flex: 1 }}>
        <FlatList
          data={recipes}
          keyExtractor={(item: any) => item.id.toString()} // Key for each item
          renderItem={({ item }) => (
            <View>
              <View style={styles.recipeDisplayContainer}>
                <View style={{ flexDirection: "row" }}>
                  <Text
                    style={styles.recipeTitle}
                    numberOfLines={1}
                    ellipsizeMode="tail"
                  >
                    {item.title}
                  </Text>
                  <TouchableOpacity
                    style={{ alignItems: "flex-end", flex: 2, padding: 4 }}
                    onPress={() => handleBookmark(item)}
                  >
                    <FontAwesomeIcon
                      icon={isBookmark(item) ? solidBookmark : regularBookmark}
                      size={20}
                      style={{
                        color: isBookmark(item) ? "#F16C00" : "#222222",
                      }}
                    />
                  </TouchableOpacity>
                </View>
                <View style={{ flexDirection: "row", columnGap: 10 }}>
                  <Image
                    source={{ uri: item.image }}
                    style={styles.image}
                    onError={(e) =>
                      console.log("Image loading error:", e.nativeEvent.error)
                    }
                  />
                  <View style={{ flexDirection: "column", flex: 1 }}>
                    <Text style={styles.recipeSubtext1}>
                      Cook time: {item.readyInMinutes} min
                    </Text>
                    <Text style={styles.recipeSubtext2}>
                      Servings: {item.servings}
                    </Text>

                    <View style={{ alignItems: "flex-end", marginTop: 10 }}>
                      <ThemedButton
                        title="Recipe"
                        onPress={() => handleRecipePress(item)}
                      ></ThemedButton>
                    </View>
                  </View>
                </View>
              </View>
              <View style={{ padding: 10 }}></View>
            </View>
          )}
        ></FlatList>
      </SafeAreaView>
    </RecipeProvider>
  );
}

const styles = StyleSheet.create({
  recipeDisplayContainer: {
    backgroundColor: "rgba(184, 200, 167, 1)",
    flexDirection: "column",
    justifyContent: "space-around",
    //alignItems: "center",
    borderRadius: 16,
    padding: 10,
  },
  image: {
    width: 130,
    height: 96,
    marginTop: 4,
    borderRadius: 10,
    justifyContent: "flex-end",
    alignItems: "center",
  },
  recipeTitle: {
    flexShrink: 0,
    textAlign: "left",
    color: "rgba(34, 34, 34, 1)",
    fontFamily: "InterMedium",
    fontSize: 16,
    padding: 4,
    maxWidth: "90%",
  },
  recipeSubtext1: {
    textAlign: "left",
    color: "rgba(34, 34, 34, 1)",
    marginTop: 10,
    fontFamily: "InterLightItalic",
    fontSize: 12,
  },
  recipeSubtext2: {
    textAlign: "left",
    color: "rgba(34, 34, 34, 1)",
    fontFamily: "InterLightItalic",
    fontSize: 12,
    marginTop: 4,
  },
});
