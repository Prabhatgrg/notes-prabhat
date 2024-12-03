import { StyleSheet, Dimensions, Text } from "react-native";
import { TextInput, Button } from "react-native-paper";
import React, { useState, useCallback, useContext } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { NoteContext } from "../NoteContext";
// import { Note } from "@/interface/note";

export default function AddNotes() {
  const [note, setNote] = useState<string>("");
  const { isConnected, addNewNotes  } = useContext(NoteContext);

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
      <Button mode="contained" onPress={() => {
        addNewNotes(note)
        setNote("")
      }}>
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
