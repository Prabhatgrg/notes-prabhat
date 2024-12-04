import { SafeAreaView } from "react-native-safe-area-context";
import { useContext, useCallback } from "react";
import { StyleSheet, Text, FlatList, View } from "react-native";
import { Divider, Button } from "react-native-paper";
import { useFocusEffect } from "expo-router";
import { NoteContext } from "../NoteContext";

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
      <View style={styles.listStyle}>
        <Text style={styles.headerText}>My Queued Notes</Text>
        <Divider />
        <FlatList
          data={queuedNotes}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <View style={styles.noteContainer}>
              <Text>{item}</Text>
            </View>
          )}
        />
        <Button
          mode="contained"
          onPress={clearQueuedNotes}
          style={{ marginBottom: 20 }}
        >
          Clear Queued Notes
        </Button>
      </View>
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
