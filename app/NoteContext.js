import React, { createContext, useState, useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import NetInfo from "@react-native-community/netinfo";
import { useFocusEffect } from "expo-router";

export const NoteContext = createContext();

const NotesProvider = ({ children }) => {
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
      value={{ queueTask, setQueueTask, syncNotes, isConnected }}
      i
    >
      {children}
    </NoteContext.Provider>
  );
};

export default NotesProvider;
