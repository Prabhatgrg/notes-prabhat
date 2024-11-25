import { SafeAreaView } from "react-native-safe-area-context";
import { StyleSheet, Text, ScrollView } from "react-native";
import { List, Divider } from "react-native-paper";
import { useState, useCallback } from "react";
import { useFocusEffect } from "expo-router";
import * as FileSystem from "expo-file-system";

// import { HelloWave } from "@/components/HelloWave";

export default function HomeScreen() {
  const [notes, setNotes] = useState([]);

  useFocusEffect(
    useCallback(() => {
      getNotes();
    }, [])
  );

  const NOTES_DIRECTORY = FileSystem.documentDirectory + 'NotesData/';

  const getNotes = async() => {
    const files = await FileSystem.readDirectoryAsync(NOTES_DIRECTORY);
  }

  return (
    <SafeAreaView>
      <ScrollView style={{ paddingTop: 15 }}>
        <Text style={styles.headerText}>Create Notes</Text>
        <Divider />
        <List.Item title="First Item" style={styles.listStyle} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  listStyle: {
    height: 60,
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: "absolute",
  },
  headerText: {
    fontSize: 20,
    fontWeight: "bold",
    paddingLeft: 15,
    marginBottom: 10,
  },
});
