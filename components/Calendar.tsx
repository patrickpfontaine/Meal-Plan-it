import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Modal,
  StyleProp,
  Linking,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { Border, Color, FontFamily, FontSize } from "../app/GlobalStyles";
import { useRecipeContext } from "@/app/config/RecipeContext";
import { ThemedButton } from "@/components/Button";
import dayjs from "dayjs";
import { faCircle, faTrashCan } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faAdd } from "@fortawesome/free-solid-svg-icons";

const DAYS_OF_WEEK = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"] as const;

type DayOfWeek = (typeof DAYS_OF_WEEK)[number];
type Date = string;

interface Recipe {
  id: number;
  title: string;
  image: string;
  readyInMinutes: number;
  servings: number;
  sourceUrl?: any;
}

interface DayRecipe {
  day: string;
  recipe: Recipe;
}

interface CalendarDayProps {
  day: DayOfWeek;
  date: Date;
  top: number;
}

const CalendarDay: React.FC<CalendarDayProps> = ({ day, date, top }) => (
  <View style={[styles.dayContainer, { top }]}>
    <Text style={styles.dayText}>{day}</Text>
    <Text style={styles.dateText}>{date}</Text>
  </View>
);

interface EventCardProps {
  day: DayOfWeek;
  top: number;
  date: Date;
  title?: string;
  time?: string;
  onAdd?: () => void;
  onDelete?: () => void;
  recipe?: DayRecipe;
}

const EventCard: React.FC<EventCardProps> = ({
  day,
  top,
  title,
  time,
  onAdd,
  onDelete,
  recipe,
}) => {
  const dayBackgrounds = {
    Sun: require("../app/images/SunColorBox.png"),
    Mon: require("../app/images/MonColorBox.png"),
    Tue: require("../app/images/TueColorBox.png"),
    Wed: require("../app/images/WedColorBox.png"),
    Thu: require("../app/images/ThuColorBox.png"),
    Fri: require("../app/images/FriColorBox.png"),
    Sat: require("../app/images/SatColorBox.png"),
  };
  const handleRecipePress = (recipe: any) => {
    const recipeUrl = recipe.recipe.sourceUrl;
    if (recipeUrl) {
      Linking.openURL(recipeUrl).catch((err) =>
        Alert.alert("Error", "Failed to open the recipe URL.")
      );
    } else {
      Alert.alert("Error", "Recipe URL not available");
    }
  };

  return (
    <View style={[styles.eventContainer, { top }]}>
      <Image
        style={styles.eventBackground}
        resizeMode="cover"
        source={dayBackgrounds[day]}
      />
      {title && time ? (
        <>
          <TouchableOpacity onPress={() => handleRecipePress(recipe)}>
            <Text style={styles.eventText}>
              <Text style={styles.eventTitle}>
                {title}
                {"\n"}
              </Text>
              <Text style={styles.eventTime}>{time}</Text>
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton} onPress={onDelete}>
            <FontAwesomeIcon icon={faTrashCan} style={styles.icon} />
          </TouchableOpacity>
        </>
      ) : (
        <TouchableOpacity style={styles.actionButton} onPress={onAdd}>
          <FontAwesomeIcon icon={faAdd} style={styles.icon} />
        </TouchableOpacity>
      )}
    </View>
  );
};

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

const calculateDates = (
  startDate: Date
): { day: DayOfWeek; date: string }[] => {
  const start = dayjs(startDate).startOf("week");
  return DAYS_OF_WEEK.map((day, index) => ({
    day,
    date: start.add(index, "day").format("DD"),
  }));
};

const CalendarPage: React.FC<{ startDate: Date }> = ({ startDate }) => {
  const router = useRouter();
  const { dayRecipes, removeRecipeFromDay } = useRecipeContext();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedDay, setSelectedDay] = useState<DayOfWeek | null>(null);

  const dates = calculateDates(startDate);

  const handleAdd = (day: DayOfWeek, date: Date) => {
    router.push({
      pathname: "/addRecipe",
      params: { day: day, date: date },
    });
  };

  const handleDelete = (day: DayOfWeek) => {
    setSelectedDay(day);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    if (selectedDay) {
      removeRecipeFromDay(selectedDay);
    }
    setShowDeleteModal(false);
    setSelectedDay(null);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <View style={styles.contentContainer}>
          <View style={styles.calendarContainer}>
            <View style={styles.daysContainer}>
              {dates.map(({ day, date }, index) => (
                <CalendarDay
                  key={day}
                  day={day}
                  date={date}
                  top={index * 75 + 30}
                />
              ))}
            </View>
            {dates.map(({ day, date }, index) => {
              const dayRecipe = dayRecipes.find(
                (dr: DayRecipe) => dr.day === day
              );
              return (
                <EventCard
                  key={day}
                  day={day}
                  date={date}
                  top={index * 75 + 12}
                  recipe={dayRecipe}
                  title={dayRecipe?.recipe.title}
                  time={
                    dayRecipe?.recipe.readyInMinutes
                      ? `Cook time: ${dayRecipe.recipe.readyInMinutes} min`
                      : undefined
                  }
                  onAdd={() => handleAdd(day, date)}
                  onDelete={() => handleDelete(day)}
                />
              );
            })}
          </View>
        </View>
      </ScrollView>

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

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollViewContent: {
    flexGrow: 1,
    alignItems: "center",
  },
  contentContainer: {
    width: 342,
    alignItems: "center",
  },
  pageTitle: {
    fontFamily: "InterBold",
    fontSize: 24,
    color: "#222222",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
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
    width: 342,
    height: 126,
    backgroundColor: "#e2dacc",
    borderRadius: Border.br_base,
    padding: 12,
    marginTop: 20,
  },
  tonightsDinner: {
    fontFamily: FontFamily.interBold,
    fontWeight: "700",
    fontSize: FontSize.size_base,
    color: Color.colorGray,
  },
  dinnerImage: {
    width: 115,
    height: 85,
    borderRadius: Border.br_3xs,
    position: "absolute",
    left: 17,
    top: 31,
  },
  recipeButton: {
    position: "absolute",
    left: 143,
    top: 79,
    width: 83,
    height: 30,
    borderRadius: Border.br_81xl,
    backgroundColor: Color.colorDarkslategray_100,
    justifyContent: "center",
    alignItems: "center",
  },
  dinnerDescription: {
    position: "absolute",
    left: 143,
    top: 37,
    width: 196,
  },
  dinnerTitle: {
    fontFamily: FontFamily.interRegular,
    fontSize: FontSize.size_sm,
    color: Color.colorGray,
  },
  cookTime: {
    fontStyle: "italic",
    fontWeight: "300",
    fontFamily: FontFamily.interLight,
    fontSize: FontSize.size_xs,
    color: Color.colorGray,
  },
  calendarContainer: {
    width: 342,
    height: 559,
    backgroundColor: "#3b4937",
    borderRadius: Border.br_base,
    marginTop: 20,
  },
  daysContainer: {
    position: "absolute",
    top: 0,
    left: 14,
    height: 501,
    width: 28,
  },
  dayContainer: {
    position: "absolute",
    left: 0,
    width: 28,
    alignItems: "center",
  },
  dayText: {
    color: Color.colorGainsboro,
    fontFamily: FontFamily.interMedium,
    fontWeight: "500",
    fontSize: FontSize.size_xs,
  },
  dateText: {
    color: Color.colorGainsboro,
    fontFamily: FontFamily.interMedium,
    fontWeight: "500",
    fontSize: FontSize.size_xl,
  },
  eventContainer: {
    position: "absolute",
    left: 48,
    width: 280,
    height: 66,
    overflow: "hidden",
  },
  eventBackground: {
    position: "absolute",
    width: "100%",
    height: "100%",
    borderRadius: Border.br_3xs,
  },
  eventText: {
    position: "absolute",
    left: 25,
    top: 10,
    width: 196,
    color: Color.colorGray,
  },
  eventTitle: {
    fontSize: FontSize.size_base,
    fontFamily: FontFamily.interMedium,
    fontWeight: "500",
  },
  eventTime: {
    fontStyle: "italic",
    fontWeight: "300",
    fontFamily: FontFamily.interLight,
    fontSize: FontSize.size_xs,
  },
  actionButton: {
    position: "absolute",
    right: 10,
    top: 10,
    width: 18,
    height: 18,
  },
  icon: {
    width: "100%",
    height: "100%",
    color: "rgba(34, 34, 34, 1)",
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
    height: 169,
    overflow: "hidden",
    justifyContent: "center",
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
    width: "80%",
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
