import { Redirect, Tabs } from "expo-router";
import React from "react";
import { Platform } from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { HapticTab } from "@/components/HapticTab";
import { IconSymbol } from "@/components/ui/IconSymbol";
import TabBarBackground from "@/components/ui/TabBarBackground";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import { Button } from "react-native-paper";
import Logout from "../(auth)/logout";
import { useAuth0 } from "react-native-auth0";

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const { clearSession } = useAuth0();
  return (
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
          headerRight: () => <Button mode="contained" onPress={async() => {
            await clearSession();
            <Redirect href='/login' />
          }}>Log Out</Button>,
          headerShown: true,
          // tabBarIcon: ({ color }) => <IconSymbol size={28} name="house.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="addNote"
        options={{
          title: "Add Notes",
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="add-circle" size={24} color={color} />
          ),
          headerShown: true,
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
          headerShown: true,
          // tabBarIcon: ({ color }) => <IconSymbol size={28} name="plus.fill" color={color} />,
        }}
      />
    </Tabs>
  );
}
