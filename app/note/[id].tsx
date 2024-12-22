import React from "react";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useState, useContext } from "react";
import { StyleSheet, View, Dimensions } from "react-native";
import { ThemedView } from "@/components/ThemedView";
import { NoteContext } from "../NoteContext";
import { Button, TextInput } from "react-native-paper";
import { ThemedText } from "@/components/ThemedText";

const Note = () => {
  // const [note, setNote] = useState<string | string[]>("");
  const { id, content } = useLocalSearchParams();
  const [note, setNote] = useState<string>(typeof content === 'string' ? content : '');
  // const params = useLocalSearchParams();
  // const id = params.id;
  // const content = params.content;
  const { editNote } = useContext(NoteContext);
  return (
    <>
      <ThemedView style={styles.container}>
        {/* <View style={styles.textInput}> */}
        <ThemedText>ID for this note: {id}</ThemedText>
        <ThemedText>{content}</ThemedText>
        {/* <TextInput
          mode="outlined"
          multiline={true}
          style={styles.textInput}
          contentStyle={styles.textInputContent}
          onChangeText={setNote}
        >
          {content}
        </TextInput> */}
        <TextInput
          mode="outlined"
          multiline={true}
          style={styles.textInput}
          contentStyle={styles.textInputContent}
          onChangeText={setNote}
          value={note}
          // placeholder={typeof content === "string" ? content : ""}
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
        {/* </View> */}
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
