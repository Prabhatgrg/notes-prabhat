import { StyleSheet, Dimensions, Text } from "react-native";
import { TextInput, Button } from "react-native-paper";
import React, { useState, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import NetInfo from "@react-native-community/netinfo";
import AsyncStorage from "@react-native-async-storage/async-storage";

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

  useEffect(() => {
    // Subscribe to network state updates
    const unsubscribe = NetInfo.addEventListener((state) => {
      setIsConnected(state.isConnected ?? !isConnected);
    });

    // Unsubscribe when the component is unmounted
    return () => {
      unsubscribe();
    };
  }, []);

  const addNewNotes = async() => {
    try{
      const value = await AsyncStorage.getItem("Note");
      const n = value ? JSON.parse(value) : [];
      n.push(note);
      await AsyncStorage.setItem("Note", JSON.stringify(n));
      setNote('');
      console.log("Notes Added");
    }catch (error) {
      console.log("Error adding note: ", error);
    };
  }

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
          <Button mode="contained" onPress={addNewNotes}>
            Save
          </Button>
        </>
      ) : (
        <>
          <Text>App is offline</Text>
        </>
      )}
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
