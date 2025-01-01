import { SafeAreaView } from "react-native-safe-area-context";
import {
  StyleSheet,
  FlatList,
  Dimensions,
  View,
  TouchableOpacity,
} from "react-native";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { Divider, Button, Text } from "react-native-paper";
import { useContext, useCallback } from "react";
import { useFocusEffect, useRouter } from "expo-router";
import { NoteContext } from "../NoteContext";
import Constants from "expo-constants";
import { useAuth0 } from "react-native-auth0";

export default function HomeScreen() {
  const { fetchNotes, notes, syncNotes, clearNote, isConnected } =
    useContext(NoteContext);
  // const apiUrl = process.env.EXPO_PUBLIC_API_URL;
  useFocusEffect(
    useCallback(() => {
      fetchNotes();
      if (isConnected) {
        syncNotes();
      }
    }, [isConnected])
  );
  const router = useRouter();
  const { user } = useAuth0();

  const domainName = Constants?.expoConfig?.extra?.auth0Domain;
  const clientID = Constants?.expoConfig?.extra?.auth0ClientId;

  console.log("DOMAIN NAME: ", domainName);
  console.log("CLIENT ID: ", clientID);
  console.log("USER INFO HERE: ", user);

  return (
    <ThemedView style={styles.listStyle}>
      {isConnected ? (
        <>
          <View className="flex flex-row items-center gap-2 mt-2">
            <View className="bg-green-700 h-2 w-2 rounded-full" />
            <ThemedText>App is online</ThemedText>
          </View>
          {/* <ThemedText className="text-blue-500">App Online</ThemedText> */}
        </>
      ) : (
        <>
          <View className="flex flex-row items-center gap-2">
            <View className="bg-red-700 h-2 w-2 rounded-full" />
            <ThemedText>App is offline</ThemedText>
          </View>
        </>
      )}
      <>
        <Text>{domainName}</Text>
        <Text>{clientID}</Text>
        <FlatList
          data={notes}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <>
              <TouchableOpacity
                style={styles.container}
                onPress={() => {
                  router.push({
                    pathname: "/note/[id]",
                    params: { id: item.id, content: item.content },
                  });
                }}
              >
                <ThemedText>{item.content}</ThemedText>
              </TouchableOpacity>
              <Divider style={{ height: 1, marginVertical: 10 }} />
            </>
          )}
        />
      </>
      <Button mode="contained" onPress={clearNote} style={{ marginBottom: 20 }}>
        Clear Notes
      </Button>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: 40,
  },

  listStyle: {
    flex: 1,
    paddingHorizontal: 5,
  },
  noteContainer: {
    backgroundColor: "#f0f0f0",
    padding: 10,
  },
  headerText: {
    fontSize: 20,
    fontWeight: "bold",
    paddingLeft: 15,
    marginBottom: 10,
  },
});
