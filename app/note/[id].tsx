import React from "react";
import { useLocalSearchParams } from "expo-router";
import { useState, useContext } from "react";
import { StyleSheet, Dimensions } from "react-native";
import { ThemedView } from "@/components/ThemedView";
import { NoteContext } from "../NoteContext";
import { Button, TextInput } from "react-native-paper";
import { ThemedText } from "@/components/ThemedText";

const Note = () => {
  const { id, content } = useLocalSearchParams();
  const [note, setNote] = useState<string>(typeof content === 'string' ? content : '');
  const { editNote } = useContext(NoteContext);
  return (
    <>
      <ThemedView style={styles.container}>
        <ThemedText>ID for this note: {id}</ThemedText>
        <ThemedText>{content}</ThemedText>
        <TextInput
          mode="outlined"
          multiline={true}
          style={styles.textInput}
          contentStyle={styles.textInputContent}
          onChangeText={setNote}
          value={note}
        />
        <Button
          mode="contained"
          onPress={() => {
            editNote(id, note);
            console.log("NOTE VALUE: ", note);
            setNote("");
          }}
        >
          Edit
        </Button>
      </ThemedView>
    </>
  );
};

const width = Dimensions.get("window").width - 50;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
  },
  textInput: {
    width: width,
  },
  textInputContent: {
    textAlignVertical: "auto",
  },
});

export default Note;
