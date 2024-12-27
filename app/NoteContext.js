import React, { createContext, useState, useCallback } from "react";
import { ToastAndroid } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import NetInfo from "@react-native-community/netinfo";
import { useFocusEffect, useRouter } from "expo-router";

export const NoteContext = createContext();

const NotesProvider = ({ children }) => {
  const [notes, setNotes] = useState([]);
  const [queuedNotes, setQueuedNotes] = useState([]);
  const [isConnected, setIsConnected] = useState(true);

  const router = useRouter();

  const apiUrl = process.env.EXPO_PUBLIC_API_URL;
  /*
    SYNC NOTES NOTE WORKING USING FOR LOOP AND RESPONSE.JSON()
  */
  const syncNotes = async () => {
    try {
      const value = await AsyncStorage.getItem("QueuedNotes");
      const parsedNotes = JSON.parse(value);
      // console.log("Queued Note: " + value);
      if (value) {
        console.log("Sync Started");
        console.log("Queued Note: " + value);
        for (const note of parsedNotes) {
          try {
            const response = await fetch(`${apiUrl}/notes`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ content: note }),
            });
            const responseData = await response.json();
            if (!response.ok) {
              throw new Error(
                `Failed to create new notes: ${
                  responseData.message || response.statusText
                }`
              );
            }
          } catch (error) {
            () => {
              ToastAndroid.show(
                "Failed to sync note due to offline backend",
                ToastAndroid.SHORT
              );
            };
            // console.error("Failed to sync notes: ", error);
            // console.log("Failed to sync note due to backend offline: ", error);
            // console.log("Will Attempt to sync note again after backend is online");
          }
        }
        // const responseData = await response.json();
        await AsyncStorage.removeItem("QueuedNotes");
        console.log("Queued Notes Removed Successfully");
      }
    } catch (error) {
      if (error instanceof Error) {
        console.error("Error Message: ", error.message);
        console.error("Error Stack: ", error.stack);
        console.error("Error syncing notes: " + error);
      }
    }
  };

  /* 
  Check regex expression with offline mode
  */
  const addNewNotes = async (note) => {
    const regex = /^\s/;
    try {
      if (isConnected) {
        if (regex.test(note) || note.trim() === "") {
          console.error("Enter a proper note please");
        } else {
          const response = await fetch(`${apiUrl}/notes`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ content: note }),
          });
          const responseData = await response.json();
          if (!response.ok) {
            throw new Error(
              `Failed to create new notes: ${
                responseData.message || response.statusText
              }`
            );
          } else {
            console.log("New note created successfully: ", responseData);
          }
        }
      } else {
        const value = await AsyncStorage.getItem("QueuedNotes");
        const n = value ? JSON.parse(value) : [];
        n.push(note);
        await AsyncStorage.setItem("QueuedNotes", JSON.stringify(n));
        console.log("Notes will be save when online");
      }
    } catch (error) {
      console.error("Error adding note: ", error.message);
      throw error;
    }
  };

  const fetchNotes = async () => {
    try {
      // const value = await AsyncStorage.getItem("Note");
      // if (value != null) {
      //   setNotes(JSON.parse(value));
      // } else {
      //   console.log("THE NOTE VALUE RETURNS NULL");
      // }
      if (isConnected) {
        const response = await fetch(`${apiUrl}/notes`, {
          method: "GET",
        });
        const responseData = await response.json();
        if (!response.ok) {
          throw new Error(
            `Failed to Fetch Notes from backend. Notes now fetched locally: ${
              responseData.message || responseData.statusText
            }`
          );
        } else {
          await AsyncStorage.setItem("Note", JSON.stringify(responseData));
          setNotes(responseData);
        }
      } else {
        const value = await AsyncStorage.getItem("Note");
        if (value != null) {
          setNotes(JSON.parse(value));
        } else {
          console.log("THE NOTE VALUE RETURNS NULL");
        }
      }
    } catch (error) {
      console.log("Failed to fetch data: ", error);
    }
  };

  const clearNote = async () => {
    try {
      await AsyncStorage.removeItem("Note");
      ToastAndroid.show("All Notes Deleted", ToastAndroid.SHORT);
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
      ToastAndroid.show("Queued Notes has been deleted", ToastAndroid.SHORT);
      console.log("Queued Notes has been deleted");
      setQueuedNotes([]);
    } catch (error) {
      console.error("Error trying to delete queued notes: " + error);
    }
  };

  const editNote = async (id, note) => {
    try {
      const response = await fetch(`${apiUrl}/notes/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content: note }),
      });
      const responseData = await response.json();
      if (!response.ok) {
        throw new Error(`
          Failed to Edit Note: ${
            responseData.message || responseData.statusText
          }`);
      } else {
        console.log("Edited Note Successfully: ", responseData);
        router.push("/");
      }
    } catch (error) {
      console.log("Error Editing Note: ", error);
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
        notes,
        addNewNotes,
        fetchNotes,
        syncNotes,
        clearNote,
        editNote,
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
