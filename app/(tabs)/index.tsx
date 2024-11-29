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
          // const parsedNote = JSON.parse(value);
          setNotes(JSON.parse(value));
          console.log("Note Data: " + value);
          // setNotes(value);
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
        // console.log("Error retrieving notes: " + error);
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

  // useEffect(() => {
  //   getNotes();
  // }, [])

  useFocusEffect(
    useCallback(() => {
      getNotes();
    }, [])
  )

  return (
    <SafeAreaView style={styles.container}>
      <View style={{ paddingTop: 15 }}>
        <Text style={styles.headerText}>Create Notes</Text>
        <Divider />
        {/* <List.Item title="First Item" style={styles.listStyle} /> */}
        <FlatList 
          data={notes}
          // horizontal={true}
          keyExtractor={(item, index) => index.toString()}
          // keyExtractor={(item) => item}
          style={styles.listStyle}
          renderItem={({ item }) => (
            <View style={styles.noteContainer}>
              <Text>{item}</Text>
            </View>
          )}
        />
        <Button mode="contained" onPress={clearNote}>
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
    // width: windowWidth,
    height: 100,
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
