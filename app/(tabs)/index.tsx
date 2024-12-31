import { SafeAreaView } from "react-native-safe-area-context";
import {
  StyleSheet,
  FlatList,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { Divider, Button, Text } from "react-native-paper";
import { useContext, useCallback } from "react";
import { useFocusEffect, useRouter } from "expo-router";
import { NoteContext } from "../NoteContext";
import Constants from 'expo-constants';

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

  const domainName = Constants?.expoConfig?.extra?.auth0Domain;
  const clientID = Constants?.expoConfig?.extra?.auth0ClientId;

  console.log("DOMAIN NAME: ", domainName);
  console.log("CLIENT ID: ", clientID);

  return (
    <ThemedView style={styles.listStyle}>
      {isConnected ? (
        <ThemedText>App Online</ThemedText>
      ) : (
        <Text> App Offline </Text>
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
