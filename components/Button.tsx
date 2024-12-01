// CustomButton.js
import { faBookmark } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import React from "react";
// import React from "react";
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  type ButtonProps,
  View,
} from "react-native";

export type MealAppButton = ButtonProps & {
  title?: string;
  bookmark?: boolean;
};

export function ThemedButton({
  onPress,
  title,
  bookmark,
  color = "#1A3B5D",
  ...rest
}: MealAppButton) {
  return (
    <TouchableOpacity style={styles.button} onPress={onPress}>
      <View
        style={{ flexDirection: "row", columnGap: 4, alignItems: "center" }}
      >
        {bookmark && <FontAwesomeIcon icon={faBookmark} style={styles.icon} />}
        <Text style={styles.buttonText}>{title}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 78,
    height: 30,
    backgroundColor: "rgba(26, 59, 93, 1)",
    borderRadius: 100,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    textAlign: "center",
    color: "rgba(255, 255, 255, 1)",
    fontFamily: "InterMedium",
    fontSize: 14,
  },
  icon: {
    flexShrink: 0,
    color: "#FFFFFF",
    width: 10,
  },
});
