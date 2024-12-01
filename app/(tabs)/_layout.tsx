import { Tabs } from "expo-router";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faCalendar } from "@fortawesome/free-regular-svg-icons";
import {
  faBasketShopping,
  faBookBookmark,
  faMagnifyingGlass,
} from "@fortawesome/free-solid-svg-icons";
import React from "react";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarStyle: {
          backgroundColor: "#F3EDE4",
          elevation: 0,
          shadowOpacity: 0,
          borderTopWidth: 0,
        },
      }}
    >
      <Tabs.Screen
        name="BCalendarPage"
        options={{
          headerShown: false,
          tabBarLabel: () => null,
          tabBarActiveTintColor: "#306090",
          tabBarInactiveTintColor: "gray",
          tabBarIcon: ({ color, size }) => (
            <FontAwesomeIcon icon={faCalendar} color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="GroceryList"
        options={{
          headerShown: false,
          tabBarLabel: () => null,
          tabBarActiveTintColor: "#306090",
          tabBarInactiveTintColor: "gray",
          tabBarIcon: ({ color, size }) => (
            <FontAwesomeIcon
              icon={faBasketShopping}
              color={color}
              size={size}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="RecipeSearch"
        options={{
          headerShown: false,
          tabBarLabel: () => null,
          tabBarActiveTintColor: "#306090",
          tabBarInactiveTintColor: "gray",
          tabBarIcon: ({ color, size }) => (
            <FontAwesomeIcon
              icon={faMagnifyingGlass}
              color={color}
              size={size}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="SavedRecipes"
        options={{
          headerShown: false,
          tabBarLabel: () => null,
          tabBarActiveTintColor: "#306090",
          tabBarInactiveTintColor: "gray",
          tabBarIcon: ({ color, size }) => (
            <FontAwesomeIcon icon={faBookBookmark} color={color} size={size} />
          ),
        }}
      />
    </Tabs>
  );
}
