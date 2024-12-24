import { SafeAreaView } from "react-native-safe-area-context";
import {
  StyleSheet,
  FlatList,
  View,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { Divider, Button, Text } from "react-native-paper";
import { useContext, useCallback } from "react";
import { useFocusEffect, useRouter } from "expo-router";
import { NoteContext } from "../NoteContext";
// import { Note } from "./explore";

export default function HomeScreen() {
  const { fetchNotes, notes, syncNotes, clearNote, isConnected } =
    useContext(NoteContext);
  // const apiUrl = process.env.EXPO_PUBLIC_API_URL;
  useFocusEffect(
    useCallback(() => {
      // getNotes();
      fetchNotes();
      // console.log("Internet Access: " + isConnected);
      // console.log("API URL: ", `${apiUrl}/notes`);
      if (isConnected) {
        // console.log("Syncing Notes.....");
        syncNotes();
      }
    }, [isConnected])
  );
  const router = useRouter();

  // const handlePress = () => {
  //   router.push({
  //     pathname: "/note/[id]",
  //     params: { id: notes.id, content: notes.content },
  //   });
  // };
  return (
    // <SafeAreaView style={styles.container}>
    <ThemedView style={styles.listStyle}>
      {/* <View style={styles.listStyle}> */}
      {/* <Text style={styles.headerText}>My Notes</Text> */}
      {isConnected ? (
        <ThemedText>App Online</ThemedText>
      ) : (
        <Text> App Offline </Text>
      )}
      {/* {isConnected ? <View>App Online</View> : <Text> App Offline </Text>} */}
      <FlatList
        data={notes}
        // style={styles.container}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          // <View style={styles.noteContainer}>
          //   <Text>{item.content}</Text>
          // </View>
          <>
            <TouchableOpacity
              style={styles.container}
              // onPress={handlePress}
              onPress={() => {
                router.push({
                  pathname: "/note/[id]",
                  params: { id: item.id, content: item.content },
                });
              }}
            >
              <ThemedText>{item.content}</ThemedText>
            </TouchableOpacity>
            <Divider style={{height: 1, marginVertical: 10}} />
          </>
        )}
      />
      <Button mode="contained" onPress={clearNote} style={{ marginBottom: 20 }}>
        Clear Notes
      </Button>
      {/* </View> */}
    </ThemedView>
    // </SafeAreaView>
  );
}

const windowWidth = Dimensions.get("window").width;
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
    // borderRadius: 5,
  },
  headerText: {
    fontSize: 20,
    fontWeight: "bold",
    paddingLeft: 15,
    marginBottom: 10,
  },
});
