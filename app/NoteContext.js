import React, { createContext, useState, useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import NetInfo from "@react-native-community/netinfo";
import { useFocusEffect } from "expo-router";

export const NoteContext = createContext();

const NotesProvider = ({ children }) => {
  // const [note, setNote] = useState("");
  const [queueTask, setQueueTask] = useState([]);
  const [isConnected, setIsConnected] = useState(true);

  const syncNotes = async () => {
    try {
      console.log("Sync Started");
      const value = await AsyncStorage.getItem("QueuedNotes");
      console.log("Queued Note: " + value);
      if (value) {
        console.log("Queued Note: " + value);
        const noteQueue = JSON.parse(value);
        if (noteQueue.length > 0) {
          const currentNotes = await AsyncStorage.getItem("Note");
          const newNotes = currentNotes
            ? [...JSON.parse(currentNotes), ...noteQueue]
            : noteQueue;

          await AsyncStorage.setItem("Note", JSON.stringify(newNotes));
          await AsyncStorage.removeItem("QueuedNotes");

          console.log("Notes removed from queue and synced");
          setQueueTask([]);
        }
      }
    } catch (error) {
      console.error("Error syncing notes: " + error);
    }
  };

  const addNewNotes = async (note) => {
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
        console.log("Queued Notes Are: " + queueTask);
        setNote("");
        console.log("Notes added to the queue.");
      } catch (error) {
        console.error("Error trying to queue task: " + error);
      }
    }
  };
  useFocusEffect(
    useCallback(() => {
      // Subscribe to network state updates
      const unsubscribe = NetInfo.addEventListener((state) => {
        setIsConnected(state.isConnected ?? !isConnected);
        // if (state.isConnected) {
        //   syncNotes();
        // }
      });

      // Unsubscribe when the component is unmounted
      return () => {
        unsubscribe();
      };
    }, [])
  );
  return (
    <NoteContext.Provider
      value={{ queueTask, setQueueTask, addNewNotes, syncNotes, isConnected }}
    >
      {children}
    </NoteContext.Provider>
  );
};

export default NotesProvider;
