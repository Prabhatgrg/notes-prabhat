import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Redirect, Slot, Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { PaperProvider } from "react-native-paper";
import "react-native-reanimated";
import NotesProvider from "./NoteContext";
import { useColorScheme } from "@/hooks/useColorScheme";
import { useAuth0, Auth0Provider } from "react-native-auth0";
import { StyleSheet, Text, View } from "react-native";
import Auth from "react-native-auth0/lib/typescript/src/auth";
import Constants from "expo-constants";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }
  const domainName = Constants?.expoConfig?.extra?.auth0Domain;
  const clientID = Constants?.expoConfig?.extra?.auth0ClientId;
  // const { user } = useAuth0();
  return (
    <Auth0Provider domain={domainName} clientId={clientID}>
      <NotesProvider>
        <PaperProvider>
          <ThemeProvider
            value={colorScheme === "dark" ? DarkTheme : DefaultTheme}
          >
            <Stack screenOptions={{ headerShown: false }}>
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
              <Stack.Screen name="+not-found" />
              {/* <Stack.Screen name="login" options={{ headerShown: false }} /> */}
              <Stack.Screen name="index" options={{ headerShown: true }} />
            </Stack>
            <StatusBar style="auto" />
          </ThemeProvider>
        </PaperProvider>
      </NotesProvider>
    </Auth0Provider>
  );
}

// function RootLayoutNav() {
//   const { user, isLoading } = useAuth0();
//   const colorScheme = useColorScheme();

//   // if (isLoading) {
//   //   return (
//   //     <View style={styles.container}>
//   //       <Text>Loading...</Text>
//   //       <Text>Checking authentication status...</Text>
//   //     </View>
//   //   );
//   // }

//   if (!user) {
//     console.log('No user found, redirecting to login');
//     return <Redirect href="/login" />;
//   }
//   console.log('User Authenticated: ', user.name || user.email);

//   return (
//     <NotesProvider>
//       <PaperProvider>
//         <ThemeProvider
//           value={colorScheme === "dark" ? DarkTheme : DefaultTheme}
//         >
//           <Stack screenOptions={{ headerShown: false }}>
//             <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
//             <Stack.Screen name="+not-found" />
//             <Stack.Screen name="login" options={{ headerShown: false }} />
//           </Stack>
//           <StatusBar style="auto" />
//         </ThemeProvider>
//       </PaperProvider>
//     </NotesProvider>
//   );
// }

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
