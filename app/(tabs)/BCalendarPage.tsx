import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  SafeAreaView,
  Modal,
  Dimensions,
} from "react-native";
import { useRouter } from "expo-router";
import { Border, Color, FontFamily, FontSize } from "../GlobalStyles";
import { useRecipeContext } from "../config/RecipeContext";
import { ThemedButton } from "@/components/Button";
import SwipeableBoxes from "@/components/SwipeableComp";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";

const DAYS_OF_WEEK = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"] as const;
const DATES = ["27", "28", "29", "30", "31", "1", "26"] as const;

type DayOfWeek = (typeof DAYS_OF_WEEK)[number];
type Date = (typeof DATES)[number];

interface Recipe {
  id: number;
  title: string;
  image: string;
  readyInMinutes: number;
  servings: number;
}

const DinnerCard: React.FC = () => (
  <View style={styles.dinnerCard}>
    <View style={{ flexDirection: "row", width: "80%" }}>
      <Text style={styles.tonightsDinner}>
        Tonight's Dinner! {"\n"}
        <View style={styles.recipeButton}>
          <ThemedButton title="Recipe" />
        </View>
      </Text>
      <Text style={styles.dinnerTitle}>
        Creamy Pesto Chicken Pasta {"\n"}
        <Text style={styles.cookTime}>Cook time: 25 min</Text>
      </Text>
    </View>
    <View style={{ flexDirection: "row", width: "80%" }}></View>
  </View>
);

const DeleteRecipe: React.FC<{
  onClose: () => void;
  onConfirm: () => void;
}> = ({ onClose, onConfirm }) => {
  return (
    <View style={styles.deleteRecipe2}>
      <Text style={styles.areYouSure}>
        Are you sure you want to delete this recipe?
      </Text>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, styles.noButton]}
          onPress={onClose}
        >
          <Text style={[styles.buttonText, styles.noButtonText]}>No</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, styles.yesButton]}
          onPress={onConfirm}
        >
          <Text style={[styles.buttonText, styles.yesButtonText]}>Yes</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const CalendarPage: React.FC = () => {
  const router = useRouter();
  const { dayRecipes, removeRecipeFromDay } = useRecipeContext();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedDay, setSelectedDay] = useState<DayOfWeek | null>(null);

  const confirmDelete = () => {
    if (selectedDay) {
      removeRecipeFromDay(selectedDay);
    }
    setShowDeleteModal(false);
    setSelectedDay(null);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.contentContainer}>
        <View style={styles.header}>
          <Text style={styles.pageTitle}>Calendar</Text>
          <ThemedButton
            title="Group"
            onPress={() => router.push("/GroupPage")}
          />
        </View>
        <DinnerCard />
        <View style={styles.calendarContainer}>
          <SwipeableBoxes />
        </View>
      </View>

      <Modal visible={showDeleteModal} transparent={true} animationType="fade">
        <View style={styles.modalOverlay}>
          <DeleteRecipe
            onClose={() => setShowDeleteModal(false)}
            onConfirm={confirmDelete}
          />
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const { width, height } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f3ede4",
  },
  contentContainer: {
    flex: 1,
    alignItems: "center",
  },
  pageTitle: {
    fontFamily: "InterBold",
    fontSize: 24,
    color: "#222222",
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  buttonText: {
    fontFamily: FontFamily.interSemiBold,
    fontWeight: "600",
    fontSize: FontSize.size_sm,
  },
  groupButtonText: {
    color: Color.colorWhite,
  },
  dinnerCard: {
    width: "90%",
    backgroundColor: "#e2dacc",
    borderRadius: Border.br_base,
    padding: 10,
    paddingBottom: 3,
  },
  dinnerContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  tonightsDinner: {
    fontFamily: FontFamily.interBold,
    fontWeight: "700",
    fontSize: FontSize.size_base,
    color: Color.colorGray,
    marginBottom: 5,
  },
  dinnerImage: {
    width: width * 0.2,
    height: width * 0.2,
    borderRadius: Border.br_3xs,
  },
  dinnerInfo: {
    marginLeft: 10,
    flex: 1,
  },
  dinnerTitle: {
    fontFamily: FontFamily.interRegular,
    fontSize: FontSize.size_sm,
    color: Color.colorGray,
    marginLeft: 15,
    marginTop: 2,
  },
  cookTime: {
    fontStyle: "italic",
    fontWeight: "300",
    fontFamily: FontFamily.interLight,
    fontSize: FontSize.size_xs,
    color: Color.colorGray,
    marginTop: 2,
  },
  recipeButton: {
    padding: 5,
    paddingLeft: 15,
  },
  calendarContainer: {
    backgroundColor: "#3b4937",
    flex: 1,
    width: "100%",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  deleteRecipe2: {
    borderRadius: 24,
    backgroundColor: "#e2dacc",
    width: 300,
    padding: 20,
    alignItems: "center",
  },
  areYouSure: {
    fontSize: 16,
    fontWeight: "500",
    fontFamily: FontFamily.interMedium,
    color: "#000",
    textAlign: "center",
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  button: {
    width: 100,
    height: 40,
    borderRadius: Border.br_81xl,
    justifyContent: "center",
    alignItems: "center",
  },
  noButton: {
    backgroundColor: Color.colorWhite,
    borderWidth: 1,
    borderColor: Color.colorDarkslategray_100,
  },
  yesButton: {
    backgroundColor: Color.colorDarkslategray_100,
  },
  noButtonText: {
    color: Color.colorDarkslategray_100,
  },
  yesButtonText: {
    color: Color.colorWhite,
  },
});

export default CalendarPage;
