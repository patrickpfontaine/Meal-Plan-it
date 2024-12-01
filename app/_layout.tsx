import { Stack } from "expo-router";
import { RecipeProvider } from "./config/RecipeContext";
import { useFonts } from "expo-font";
import React from "react";

export default function RootLayout() {
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
    InterMedium: require("../assets/fonts/Inter_18pt-Medium.ttf"),
    InterRegular: require("../assets/fonts/Inter_18pt-Regular.ttf"),
    InterBold: require("../assets/fonts/Inter_24pt-Bold.ttf"),
    InterLightItalic: require("../assets/fonts/Inter_18pt-LightItalic.ttf"),
  });

  if (!loaded) {
    return null;
  }

  return (
    <RecipeProvider>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="addRecipe" options={{ headerShown: false }} />

        <Stack.Screen name="SignIn" options={{ headerShown: false }} />
        <Stack.Screen name="SignUp" options={{ headerShown: false }} />
        <Stack.Screen name="GroupPage" options={{ headerShown: false }} />
        <Stack.Screen name="index" options={{ headerShown: false }} />
      </Stack>
    </RecipeProvider>
  );
}
