import { SafeAreaView } from "react-native-safe-area-context";
import {
  StyleSheet,
  Text,
  ScrollView,
  Button,
  FlatList,
  View,
} from "react-native";
import { Divider } from "react-native-paper";
import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Note } from "./explore";

export default function HomeScreen() {
  const [notes, setNotes] = useState<Note[]>([]);

  const getNotes = async() => {
    try{
      const value = await AsyncStorage.getItem('Note');
      if(value != null){
        try{
          const parsedNote: Note[] = JSON.parse(value);
          setNotes(parsedNote);
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

  useEffect(() => {
    getNotes();
  }, [])

  return (
    <SafeAreaView>
      <View style={{ paddingTop: 15 }}>
        <Text style={styles.headerText}>Create Notes</Text>
        <Divider />
        {/* <List.Item title="First Item" style={styles.listStyle} /> */}
        <FlatList
          data={notes}
          // keyExtractor={(item) => item.name}
          style={styles.listStyle}
          renderItem={({ item }) => (
            <View>
              <Text>{item.name}</Text>
            </View>
          )}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  listStyle: {
    height: 60,
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: "absolute",
  },
  headerText: {
    fontSize: 20,
    fontWeight: "bold",
    paddingLeft: 15,
    marginBottom: 10,
  },
});
