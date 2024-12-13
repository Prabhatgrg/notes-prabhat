import { SafeAreaView } from "react-native-safe-area-context";
import { useContext, useCallback } from "react";
import { StyleSheet, Text, FlatList, View } from "react-native";
import { Divider, Button } from "react-native-paper";
import { useFocusEffect } from "expo-router";
import { NoteContext } from "../NoteContext";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";

export default function ViewQueue() {
  const { queuedNotes, getQueuedNotes, clearQueuedNotes } =
    useContext(NoteContext);

  useFocusEffect(
    useCallback(() => {
      getQueuedNotes();
    }, [])
  );

  return (
    <SafeAreaView style={styles.container}>
      <ThemedView style={styles.listStyle}>
        <ThemedText style={styles.headerText}>My Queued Notes</ThemedText>
        <Divider />
        {queuedNotes && (
          <FlatList
            data={queuedNotes}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <View style={styles.noteContainer}>
                <ThemedText>{item}</ThemedText>
              </View>
            )}
          />
        )}
        <Button
          mode="contained"
          onPress={clearQueuedNotes}
          style={{ marginBottom: 20 }}
        >
          Clear Queued Notes
        </Button>
      </ThemedView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
