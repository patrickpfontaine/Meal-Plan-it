import React from "react";
import { View, StyleSheet, Dimensions } from "react-native";
import {
  GestureHandlerRootView,
  Gesture,
  GestureDetector,
  ScrollView,
} from "react-native-gesture-handler";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import dayjs from "dayjs";
import Group23 from "@/components/CalDayComp";
import Calendar from "@/components/CalendarComp";
import CalendarPage from "@/components/Calendar";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faCircle } from "@fortawesome/free-regular-svg-icons";

const { width } = Dimensions.get("window");
const BOX_COUNT = 5; // Total number of boxes
const BOX_WIDTH = width * 0.8; // Box width is 80% of the screen width

const SWIPE_THRESHOLD = 100; // Minimum swipe distance for navigation

const SwipeableBoxes = () => {
  const translateX = useSharedValue(-2 * width); // Tracks the current position
  const currentIndex = useSharedValue(2); // Tracks the current index (0-4 for 5 boxes)

  const baseDate = dayjs(); // Current date
  const calendarDates = [
    baseDate.subtract(2, "week"),
    baseDate.subtract(1, "week"),
    baseDate,
    baseDate.add(1, "week"),
    baseDate.add(2, "week"),
  ];

  const gesture = Gesture.Pan()
    .onUpdate((event) => {
      translateX.value = event.translationX - currentIndex.value * width; // Update based on the current index
    })
    .onEnd((event) => {
      const isSwipeLeft =
        event.translationX < -SWIPE_THRESHOLD && event.velocityX < 0;
      const isSwipeRight =
        event.translationX > SWIPE_THRESHOLD && event.velocityX > 0;

      if (isSwipeLeft && currentIndex.value < BOX_COUNT - 1) {
        // Move to the next box
        currentIndex.value += 1;
      } else if (isSwipeRight && currentIndex.value > 0) {
        // Move to the previous box
        currentIndex.value -= 1;
      }

      // Snap to the new index position
      translateX.value = withSpring(-currentIndex.value * width, {
        damping: 15,
        stiffness: 120,
      });
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  return (
    <GestureHandlerRootView style={styles.container}>
      <GestureDetector gesture={gesture}>
        <View>
          <Animated.View style={[styles.boxContainer, animatedStyle]}>
            {calendarDates.map((date, index) => (
              <CalendarPage
                key={index}
                startDate={date.toDate().toString()}
              ></CalendarPage>
            ))}
          </Animated.View>
        </View>
      </GestureDetector>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f3ede4",
    overflow: "hidden",
  },
  boxContainer: {
    flexDirection: "row", // Arrange boxes horizontally
    width: width * BOX_COUNT, // Total width for all boxes
    //flex: 1,
  },
});

export default SwipeableBoxes;
