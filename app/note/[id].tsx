import React from "react";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useState, useContext } from "react";
import { StyleSheet, View, Dimensions } from "react-native";
import { ThemedView } from "@/components/ThemedView";
import { NoteContext } from "../NoteContext";
import { Button, TextInput } from "react-native-paper";

const Note = () => {
  const [note, setNote] = useState<string>("");
  const { id, content } = useLocalSearchParams();
  // const {} = useContext(NoteContext);
  return (
    <>
      <ThemedView style={styles.container}>
        {/* <View style={styles.textInput}> */}
        <TextInput
          mode="outlined"
          multiline={true}
          style={styles.textInput}
          contentStyle={styles.textInputContent}
          onChangeText={setNote}
        >
          {content}
        </TextInput>
        <Button mode="contained">Edit</Button>
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
    textAlignVertical: "auto"
  }
});

export default Note;
