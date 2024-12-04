import React, { createContext, useState, useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import NetInfo from "@react-native-community/netinfo";
import { useFocusEffect } from "expo-router";
import { SharedTransitionType } from "react-native-reanimated";

export const NoteContext = createContext();

const NotesProvider = ({ children }) => {
  // const [note, setNote] = useState("");
  const [notes, setNotes] = useState([]);
  const [queueTask, setQueueTask] = useState([]);
  const [queuedNotes, setQueuedNotes] = useState([]);
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

  // const addNewNotes = async (note) => {
  //   if (isConnected) {
  //     const regex = /^\s/;
  //     if (regex.test(note) || note.trim() === "") {
  //       console.log("Please enter a note");
  //     } else {
  //       try {
  //         const value = await AsyncStorage.getItem("Note");
  //         const n = value ? JSON.parse(value) : [];
  //         n.push(note);
  //         await AsyncStorage.setItem("Note", JSON.stringify(n));
  //         console.log("Notes Added");
  //       } catch (error) {
  //         console.log("Error adding note: ", error);
  //       }
  //     }
  //   } else {
  //     try {
  //       const value = await AsyncStorage.getItem("QueuedNotes");
  //       const n = value ? JSON.parse(value) : [];
  //       n.push(note);
  //       await AsyncStorage.setItem("QueuedNotes", JSON.stringify(n));
  //       setQueueTask(n);
  //       console.log("Queued Notes Are: " + queueTask);
  //       // setNote("");
  //       console.log("Notes added to the queue.");
  //     } catch (error) {
  //       console.error("Error trying to queue task: " + error);
  //     }
  //   }
  // };

  const addNewNotes = async (note) => {
    try {
      // const response = await fetch(`${process.env.API_URL}/notes`, {
      //   method: "POST",
      //   headers: {
      //     "Content-Type": "application/json",
      //   },
      //   body: JSON.stringify(note),
      // });
      const response = await fetch("http://192.168.1.72:5000/api/notes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content: note }),
      });
      const responseData = await response.json();
      if(!response.ok) {
        // const errorData = await response.json();
        throw new Error(
          `Failed to create new notes: ${
            responseData.message || response.statusText
          }`
        );
      } else {
        // await response.json();
        console.log("New note created successfully: ", responseData);
      }
      // Get the data from the response
      // const responseData = await response.json();
      // console.log("New Note Created:", responseData);
    } catch (error) {
      console.error("Error adding note: ", error.message);
      throw error;
    }
  };

  const fetchNotes = async () => {
    try {
      // const response = await fetch(`${process.env.API_URL}/notes`, {
      //   method: 'GET',
      // });
      const response = await fetch("http://192.168.1.72:5000/api/notes", {
        method: "GET",
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          `Failed to fetching notes: ${
            errorData.message || response.statusText
          }`
        );
      }
    } catch (error) {
      console.error("Error fetching note: ", error.message);
      throw error;
    }
  };

  // const getNotes = async () => {
  //   try {
  //     const value = await AsyncStorage.getItem("Note");
  //     if (value != null) {
  //       try {
  //         setNotes(JSON.parse(value));
  //         console.log("Note Data: " + value);
  //       } catch (jsonError) {
  //         console.error("Error parsing stored notes data: " + jsonError);
  //       }
  //     } else {
  //       console.log(
  //         "There is no notes available. Please add notes to view them"
  //       );
  //     }
  //   } catch (error) {
  //     if (error instanceof Error) {
  //       console.error("Error Message : " + error.message);
  //       console.error("Error Stack: " + error.stack);
  //     }
  //   }
  // };

  const clearNote = async () => {
    try {
      await AsyncStorage.removeItem("Note");
      console.log("All Notes Deleted");
      setNotes([]);
    } catch (error) {
      console.error("Error deleting notes: " + error);
    }
  };

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
      value={{
        queueTask,
        setQueueTask,
        // getNotes,
        notes,
        addNewNotes,
        fetchNotes,
        syncNotes,
        clearNote,
        queuedNotes,
        getQueuedNotes,
        clearQueuedNotes,
        isConnected,
      }}
    >
      {children}
    </NoteContext.Provider>
  );
};

export default NotesProvider;
