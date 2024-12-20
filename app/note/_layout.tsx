import { Stack } from "expo-router";

export default function RootLayout() {
  return (
      <Stack>
        <Stack.Screen
          name="[id]"
          options={{
            title: "Edit Note",
            headerShown: true,
          }}
        />
      </Stack>
  );
}
