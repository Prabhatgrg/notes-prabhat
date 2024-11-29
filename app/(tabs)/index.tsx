import { SafeAreaView } from "react-native-safe-area-context";
import {
  StyleSheet,
  Text,
  FlatList,
  View,
  Dimensions
} from "react-native";
import { Divider, Button } from "react-native-paper";
import { useState, useEffect, useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "expo-router";
// import { Note } from "./explore";

export default function HomeScreen() {
  const [notes, setNotes] = useState([]);

  const getNotes = async() => {
    try{
      const value = await AsyncStorage.getItem('Note');
      if(value != null){
        try{
          setNotes(JSON.parse(value));
          console.log("Note Data: " + value);
        }catch(jsonError){
          console.error("Error parsing stored notes data: " + jsonError);
        }
      }else{
        console.log("There is no notes available. Please add notes to view them");
      }
    }catch (error){
      if(error instanceof Error){
        console.error("Error Message : " + error.message);
        console.error("Error Stack: " + error.stack);
      }
    }
  }

  const clearNote = async() => {
    try{
      await AsyncStorage.removeItem("Note");
      console.log("All Notes Deleted");
      setNotes([]);
    }catch(error){
      console.error("Error deleting notes: " + error);
    }
  }

  useFocusEffect(
    useCallback(() => {
      getNotes();
    }, [])
  )

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.listStyle}>
        <Text style={styles.headerText}>My Notes</Text>
        <Divider />
        <FlatList 
          data={notes}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <View style={styles.noteContainer}>
              <Text>{item}</Text>
            </View>
          )}
        />
        <Button mode="contained" onPress={clearNote} style={{ marginBottom: 20}}>
          Clear Notes
        </Button>
      </View>
    </SafeAreaView>
  );
}

const windowWidth = Dimensions.get("window").width;
const styles = StyleSheet.create({
  container:{
    flex: 1
  },

  listStyle: {
    flex: 1, 
  },
  noteContainer: {
    backgroundColor: '#f0f0f0',
    padding: 10,
    // borderRadius: 5,
  },
  headerText: {
    fontSize: 20,
    fontWeight: "bold",
    paddingLeft: 15,
    marginBottom: 10,
  },
});
