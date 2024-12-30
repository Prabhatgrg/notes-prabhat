import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
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

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });
  // const { authorize, clearSession, user, error, isLoading } = useAuth0();

  // const onLogin = async () => {
  //   try {
  //     await authorize();
  //   } catch (e) {
  //     console.log(e);
  //   }
  // };

  // const onLogout = async () => {
  //   try {
  //     await clearSession();
  //   } catch (e) {
  //     console.log("LOG OUT CANCELLED");
  //   }
  // };

  // if (isLoading) {
  //   return (
  //     <View style={styles.container}>
  //       <Text>Loading...</Text>
  //     </View>
  //   );
  // }

  // const loggedIn = user !== undefined && user !== null;

  // const domainName = process.env.EXPO_AUTH0_DOMAIN;
  // const clientID = process.env.EXPO_AUTH0_CLIENT;

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    // <Auth0Provider domain={domainName} clientId={clientID}>
    <NotesProvider>
      <PaperProvider>
        {/* <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}> */}
        <ThemeProvider
          value={colorScheme === "dark" ? DarkTheme : DefaultTheme}
        >
          <Stack
            screenOptions={{
              headerShown: false,
            }}
          >
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="+not-found" />
          </Stack>
          <StatusBar style="auto" />
          {/* {loggedIn && (
            <>
              <Stack
                screenOptions={{
                  headerShown: false,
                }}
              >
                <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                <Stack.Screen name="+not-found" />
              </Stack>
              <StatusBar style="auto" />
            </>
          )} */}
        </ThemeProvider>
      </PaperProvider>
    </NotesProvider>
    // </Auth0Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
