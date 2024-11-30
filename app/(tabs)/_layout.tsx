import { Tabs } from "expo-router";
import React from "react";
import { Platform } from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { HapticTab } from "@/components/HapticTab";
import { IconSymbol } from "@/components/ui/IconSymbol";
import TabBarBackground from "@/components/ui/TabBarBackground";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import NotesProvider from "../NoteContext";

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <NotesProvider>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
          headerShown: false,
          tabBarButton: HapticTab,
          tabBarBackground: TabBarBackground,
          tabBarStyle: Platform.select({
            ios: {
              // Use a transparent background on iOS to show the blur effect
              position: "absolute",
            },
            default: {},
          }),
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: "Notes",
            tabBarIcon: ({ color }) => (
              <MaterialIcons name="speaker-notes" size={24} color={color} />
            ),
            // tabBarIcon: ({ color }) => <IconSymbol size={28} name="house.fill" color={color} />,
          }}
        />
        <Tabs.Screen
          name="explore"
          options={{
            title: "Add Notes",
            tabBarIcon: ({ color }) => (
              <MaterialIcons name="add-circle" size={24} color={color} />
            ),
            // tabBarIcon: ({ color }) => <IconSymbol size={28} name="plus.fill" color={color} />,
          }}
        />
        <Tabs.Screen
          name="viewQueue"
          options={{
            title: "View Queues",
            tabBarIcon: ({ color }) => (
              <MaterialIcons name="view-list" size={24} color={color} />
            ),
            // tabBarIcon: ({ color }) => <IconSymbol size={28} name="plus.fill" color={color} />,
          }}
        />
      </Tabs>
    </NotesProvider>
  );
}
