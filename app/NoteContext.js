import React, { createContext, useState, useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import NetInfo from "@react-native-community/netinfo";
import { useFocusEffect } from "expo-router";

export const NoteContext = createContext();

const NotesProvider = ({ children }) => {
  // const [note, setNote] = useState("");
  const [notes, setNotes] = useState([]);
  // const [queueTask, setQueueTask] = useState([]);
  const [queuedNotes, setQueuedNotes] = useState([]);
  const [isConnected, setIsConnected] = useState(true);

  const apiUrl = process.env.EXPO_PUBLIC_API_URL;
  // const syncNotes = async () => {
  //   try {
  //     console.log("Sync Started");
  //     const value = await AsyncStorage.getItem("QueuedNotes");
  //     console.log("Queued Note: " + value);
  //     if (value) {
  //       console.log("Queued Note: " + value);
  //       const noteQueue = JSON.parse(value);
  //       if (noteQueue.length > 0) {
  //         const currentNotes = await AsyncStorage.getItem("Note");
  //         const newNotes = currentNotes
  //           ? [...JSON.parse(currentNotes), ...noteQueue]
  //           : noteQueue;

  //         await AsyncStorage.setItem("Note", JSON.stringify(newNotes));
  //         await AsyncStorage.removeItem("QueuedNotes");

  //         console.log("Notes removed from queue and synced");
  //         setQueueTask([]);
  //       }
  //     }
  //   } catch (error) {
  //     console.error("Error syncing notes: " + error);
  //   }
  // };

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
            console.error("Failed to sync notes: ", error);
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
  // const syncNotes = async () => {
  //   try {
  //     const value = await AsyncStorage.getItem("QueuedNotes");

  //     if (value) {
  //       const parsedNotes = JSON.parse(value);
  //       console.log("Sync Started");
  //       console.log("Queued Notes: ", parsedNotes);

  //       for (const note of parsedNotes) {
  //         try {
  //           const response = await fetch(`${apiUrl}/notes`, {
  //             method: "POST",
  //             headers: {
  //               "Content-Type": "application/json",
  //             },
  //             body: JSON.stringify({ content: note }),
  //           });

  //           const responseData = await response.json(); // Moved this inside the loop

  //           if (!response.ok) {
  //             console.error("Failed Response Data: ", responseData);
  //             throw new Error(
  //               `Failed to create new note: ${
  //                 responseData.message || response.statusText
  //               }`
  //             );
  //           }

  //           console.log("New note created successfully: ", responseData);
  //         } catch (error) {
  //           console.error("Failed to sync note: ", note);
  //           console.error("Error: ", error.message || error);
  //         }
  //       }

  //       // All notes synced successfully, clear AsyncStorage
  //       await AsyncStorage.removeItem("QueuedNotes");
  //       console.log("Queued Notes Removed Successfully");
  //     } else {
  //       console.log("No queued notes to sync.");
  //     }
  //   } catch (error) {
  //     console.error("Error syncing notes: ", error.message || error);
  //   }
  // };

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

  // const addNewNotes = async (note) => {
  //   try {
  //     const response = await fetch(`${apiUrl}/notes`, {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({ content: note }),
  //     });
  //     const responseData = await response.json();
  //     if (!response.ok) {
  //       throw new Error(
  //         `Failed to create new notes: ${
  //           responseData.message || response.statusText
  //         }`
  //       );
  //     } else {
  //       console.log("New note created successfully: ", responseData);
  //     }
  //   } catch (error) {
  //     console.error("Error adding note: ", error.message);
  //     throw error;
  //   }
  // };

  /* 
  Check regex expression without offline mode
  */
  // const addNewNotes = async (note) => {
  //   const regex = /^\s/;
  //   try {
  //     if (regex.test(note) || note.trim() === "") {
  //       console.error("Enter a proper note please");
  //     }else{
  //       const response = await fetch(`${apiUrl}/notes`, {
  //         method: "POST",
  //         headers: {
  //           "Content-Type": "application/json",
  //         },
  //         body: JSON.stringify({ content: note }),
  //       });
  //       const responseData = await response.json();
  //       if (!response.ok) {
  //         throw new Error(
  //           `Failed to create new notes: ${
  //             responseData.message || response.statusText
  //           }`
  //         );
  //       } else {
  //         console.log("New note created successfully: ", responseData);
  //       }
  //     }
  //   } catch (error) {
  //     console.error("Error adding note: ", error.message);
  //     throw error;
  //   }
  // };

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

  // const addNewNotes = async (note) => {
  //   try {
  //     if (isConnected) {
  //       const regex = /^\s/;
  //       if (regex.test(note) || note.trim === "") {
  //         const response = await fetch(`${apiUrl}/notes`, {
  //           method: "POST",
  //           headers: {
  //             "Content-Type": "application/json",
  //           },
  //           body: JSON.stringify({ content: note }),
  //         });
  //         const responseData = await response.json();
  //         if (!response.ok) {
  //           throw new Error(
  //             `Failed to create new notes: ${
  //               responseData.message || response.statusText
  //             }`
  //           );
  //         } else {
  //           console.log("New note created successfully: ", responseData);
  //         }
  //       }else{
  //         try{
  //           const value = await AsyncStorage.getItem("Note");
  //           const n = value ? JSON.parse(value) : [];
  //           n.push(note);
  //           await AsyncStorage.setItem("Note", JSON.stringify(n));
  //           console.log("Notes will be send when online");
  //         }catch(error){
  //           console.log("Error sending notes to backend: ", error);
  //         }
  //       }
  //     }
  //   } catch (error) {
  //     console.error("Error adding note: ", error.message);
  //     throw error;
  //   }
  // };

  /* 
    Fetch Data from backend and store it on AsyncStorage
  */
  // const fetchNotes = async () => {
  //   try {
  //     const value = await AsyncStorage.getItem("Note");
  //     if (value != null) {
  //       setNotes(JSON.parse(value));
  //       console.log("NOTE FROM ASYNC STORAGE OFFLINE: ", value);
  //     } else {
  //       console.log("THE NOTE VALUE RETURNS NULL");
  //     }
  //     if (isConnected) {
  //       const response = await fetch(`${apiUrl}/notes`, {
  //         method: "GET",
  //       });
  //       const responseData = await response.json();
  //       if (!response.ok) {
  //         throw new Error(
  //           `Failed to Fetch Notes from backend: ${
  //             responseData.message || responseData.statusText
  //           }`
  //         );
  //       } else {
  //         await AsyncStorage.setItem("Note", JSON.stringify(responseData));
  //         setNotes(responseData);
  //         console.log("Note Value is :", notes);
  //       }
  //     }
  //   } catch (error) {
  //     console.log("Failed to fetch data: ", error);
  //   }
  // };
const fetchNotes = async () => {
    try {
      if (isConnected) {
        const response = await fetch(`${apiUrl}/notes`, {
          method: "GET",
        });
        const responseData = await response.json();
        if (!response.ok) {
          throw new Error(
            `Failed to Fetch Notes from backend: ${
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

  /*
    Fetching Data from the backend which will be use directly to show on the Flatlist component
  */
  // const fetchNotes = async () => {
  //   try {
  //     const response = await fetch(`${apiUrl}/notes`, {
  //       method: "GET",
  //     });
  //     const responseData = await response.json();
  //     if (!response.ok) {
  //       throw new Error(
  //         `Failed to fetching notes: ${
  //           responseData.message || response.statusText
  //         }`
  //       );
  //     } else {
  //       setNotes(responseData);
  //     }
  //   } catch (error) {
  //     console.error("Error fetching note: ", error.message);
  //     throw error;
  //   }
  // };

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
        // queueTask,
        // setQueueTask,
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
