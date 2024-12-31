import { Stack } from "expo-router";
import { useAuth0 } from "react-native-auth0";
import { Redirect } from "expo-router";

export default function AuthLayout() {
  const { user } = useAuth0();

  if (user) {
    return <Redirect href="/(tabs)" />;
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="login" />
    </Stack>
  );
}