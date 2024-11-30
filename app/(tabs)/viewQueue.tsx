import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useState, useContext, useCallback } from "react";
import { StyleSheet, Text, FlatList, View, Dimensions } from "react-native";
import { Divider, Button } from "react-native-paper";
import { useFocusEffect } from "expo-router";
import { SharedTransitionType } from "react-native-reanimated";

export default function ViewQueue() {
  const [queuedNotes, setQueuedNotes] = useState([]);

  const getQueuedNotes = async () => {
    try {
      const value = await AsyncStorage.getItem("QueuedNotes");
      if (value != null) {
        try {
          setQueuedNotes(JSON.parse(value));
          console.log("QUEUED NOTE: " + value);
        } catch (error) {
          console.error("Error fetching queued note: " + error);
        }
      } else {
        console.log("No Queued notes available");
      }
    } catch (error) {
      if (error instanceof Error) {
        console.error("Error Message : " + error.message);
        console.error("Error Stack: " + error.stack);
      }
    }
  };

  const clearQueuedNotes = async () => {
    try {
      await AsyncStorage.removeItem("QueuedNotes");
      console.log("Queued Notes has been deleted");
      setQueuedNotes([]);
    } catch (error) {
      console.error("Error trying to delete queued notes: " + error);
    }
  };

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
