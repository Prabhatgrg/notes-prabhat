import React from "react";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useState, useContext } from "react";
import { Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { NoteContext } from "../NoteContext";

const Note = () => {
  const { id, content } = useLocalSearchParams();
  return (
    <>
      <SafeAreaView>
        <Text>{id}</Text>
        <Text>{content}</Text>
      </SafeAreaView>
    </>
  );
};

export default Note;
