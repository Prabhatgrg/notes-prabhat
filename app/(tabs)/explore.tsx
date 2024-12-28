import { StyleSheet, Dimensions } from "react-native";
import { TextInput, Button } from "react-native-paper";
import React, { useState, useContext } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { ThemedText } from "@/components/ThemedText";
import { NoteContext } from "../NoteContext";

export default function AddNotes() {
  const [note, setNote] = useState<string>("");
  const { isConnected, addNewNotes  } = useContext(NoteContext);

  return (
    <SafeAreaView style={styles.container}>
      <ThemedText style={styles.headerText}>New Notes</ThemedText>
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
          <ThemedText>App is online</ThemedText>
        </>
      ) : (
        <>
          <ThemedText>App is offline</ThemedText>
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
    borderRadius: 10,
  },
});
