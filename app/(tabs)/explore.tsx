import { StyleSheet, Dimensions, Text } from "react-native";
import { TextInput, Button } from "react-native-paper";
import React, { useState, useEffect, useCallback } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import NetInfo from "@react-native-community/netinfo";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "expo-router";

NetInfo.fetch().then((state) => {
  console.log("Connection type", state.type);
  console.log("Is connected?", state.isConnected);
});

// export interface Note {
//   name: string;
// }

export default function AddNotes() {
  const [note, setNote] = useState<string>("");
  const [isConnected, setIsConnected] = useState<boolean>(true);
  const [queueTask, setQueueTask] = useState([]);

  // useEffect(() => {
  //   // Subscribe to network state updates
  //   const unsubscribe = NetInfo.addEventListener((state) => {
  //     setIsConnected(state.isConnected ?? !isConnected);
  //     if (state.isConnected) {
  //       syncNotes();
  //     }
  //   });

  //   // Unsubscribe when the component is unmounted
  //   return () => {
  //     unsubscribe();
  //   };
  // }, []);

  useFocusEffect(
    useCallback(() => {
      // Subscribe to network state updates
      const unsubscribe = NetInfo.addEventListener((state) => {
        setIsConnected(state.isConnected ?? !isConnected);
        if (state.isConnected) {
          syncNotes(); }
      });

      // Unsubscribe when the component is unmounted
      return () => {
        unsubscribe();
      };
    }, [])
  );

  const syncNotes = async () => {
    try {
      const value = await AsyncStorage.getItem("QueuedNotes");
      if (value) {
        const noteQueue = JSON.parse(value);
        if (noteQueue.length > 0) {
          const currentNotes = await AsyncStorage.getItem("Note");
          const newNotes = currentNotes
            ? [...JSON.parse(currentNotes), ...noteQueue]
            : noteQueue;
          await AsyncStorage.setItem("Note", JSON.stringify(newNotes));

          // Clear Queued Notes
          await AsyncStorage.removeItem("QueuedNotes");
          console.log("Noted Removed from Queue");
          setQueueTask([]);
        }
      }
    } catch (error) {
      console.error("Error syncing notes: " + error);
    }
  };

  const addNewNotes = async () => {
    if (isConnected) {
      const regex = /^\s/;
      if (regex.test(note) || note.trim() === "") {
        console.log("Please enter a note");
      } else {
        try {
          const value = await AsyncStorage.getItem("Note");
          const n = value ? JSON.parse(value) : [];
          n.push(note);
          await AsyncStorage.setItem("Note", JSON.stringify(n));
          setNote("");
          console.log("Notes Added");
        } catch (error) {
          console.log("Error adding note: ", error);
        }
      }
    } else {
      try {
        const value = await AsyncStorage.getItem("QueuedNotes");
        const n = value ? JSON.parse(value) : [];
        n.push(note);
        await AsyncStorage.setItem("QueuedNotes", JSON.stringify(n));
        setQueueTask(n);
        setNote("");
        console.log("Notes added to the queue.");
      } catch (error) {
        console.error("Error trying to queue task: " + error);
      }
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.headerText}>New Notes</Text>

      <TextInput
        label="Add your notes here"
        value={note}
        mode="outlined"
        style={styles.textInput}
        multiline={true}
        onChangeText={setNote}
      />
      {isConnected ? (
        <>
          <Text>App is online</Text>
        </>
      ) : (
        <>
          <Text>App is offline</Text>
        </>
      )}
      <Button mode="contained" onPress={addNewNotes}>
        Save
      </Button>
    </SafeAreaView>
  );
}

const windowWidth = Dimensions.get("window").width - 50;
// const heightWidth = Dimensions.get("window").width;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
  },
  headerText: {
    fontSize: 20,
    fontWeight: "bold",
    paddingLeft: 15,
  },
  textInput: {
    width: windowWidth,
    // height: 100,
    // paddingTop: 10,
    borderRadius: 10,
  },
});
