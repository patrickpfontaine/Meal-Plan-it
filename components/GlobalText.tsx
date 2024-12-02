import { Text, type TextProps, StyleSheet } from "react-native";

import { useThemeColor } from "@/hooks/useThemeColor";
import { useFonts } from "expo-font";
import React from "react";

export type ThemedTextProps = TextProps & {
  lightColor?: string;
  darkColor?: string;
  type?: "regular" | "title" | "semibold" | "italic" | "link";
};

export function GlobalText({
  style,
  lightColor,
  darkColor,
  type = "regular",
  ...rest
}: ThemedTextProps) {
  const color = useThemeColor({ light: lightColor, dark: darkColor }, "text");
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
    InterMedium: require("../assets/fonts/Inter_18pt-Medium.ttf"),
    InterRegular: require("../assets/fonts/Inter_18pt-Regular.ttf"),
    InterBold: require("../assets/fonts/Inter_24pt-Bold.ttf"),
    InterLightItalic: require("../assets/fonts/Inter_18pt-LightItalic.ttf"),
  });

  return (
    <Text
      style={[
        { color },
        type === "regular" ? styles.regular : undefined,
        type === "title" ? styles.title : undefined,
        type === "semibold" ? styles.semibold : undefined,
        type === "italic" ? styles.italic : undefined,
        type === "link" ? styles.link : undefined,
        style,
      ]}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  regular: {
    fontFamily: "InterRegular",
    fontSize: 16,
    color: "rgba(34, 34, 34, 1)",
  },
  semibold: {
    fontSize: 16,
    fontFamily: "InterBold",
    color: "rgba(34, 34, 34, 1)",
  },
  title: {
    fontFamily: "InterMedium",
    fontSize: 16,
    color: "rgba(34, 34, 34, 1)",
  },
  italic: {
    fontFamily: "InterLightItalic",
    fontSize: 12,
    color: "rgba(34, 34, 34, 1)",
  },
  link: {
    lineHeight: 30,
    fontSize: 16,
    color: "#0a7ea4",
  },
});
