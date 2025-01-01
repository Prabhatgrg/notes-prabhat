import { StyleSheet, Dimensions, Text, View } from "react-native";
import { TextInput, Button } from "react-native-paper";
import React, { useState, useContext } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { ThemedText } from "@/components/ThemedText";
import { NoteContext } from "../NoteContext";
import { ThemedView } from "@/components/ThemedView";

export default function AddNotes() {
  const [note, setNote] = useState<string>("");
  const { isConnected, addNewNotes } = useContext(NoteContext);

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
          <View className="flex flex-row items-center gap-2">
            <View className="bg-green-700 h-2 w-2 rounded-full" />
            <ThemedText>App is online</ThemedText>
          </View>
        </>
      ) : (
        <>
          <View className="flex flex-row items-center gap-2">
            <View className="bg-red-700 h-2 w-2 rounded-full" />
            <ThemedText>App is offline</ThemedText>
          </View>
        </>
      )}
      <Button
        mode="contained"
        onPress={() => {
          addNewNotes(note);
          setNote("");
        }}
      >
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
