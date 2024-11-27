import { SafeAreaView } from "react-native-safe-area-context";
import {
  StyleSheet,
  Text,
  ScrollView,
  Button,
  FlatList,
  View,
  PermissionsAndroid,
  Platform,
} from "react-native";
import { List, Divider } from "react-native-paper";
import { useState, useEffect } from "react";
import { useFocusEffect } from "expo-router";
import * as FileSystem from "expo-file-system";

// import { HelloWave } from "@/components/HelloWave";

export interface Note {
  name: string;
  content: string;
}

export const NOTES_DIRECTORY = "/storage/emulated/0/NotesData/";

// Request permission for Android 11+ (API Level 30)
// const requestManageExternalStoragePermission = async () => {
//   if (Platform.OS === 'android' && Platform.Version >= 30) {
//     const granted = await PermissionsAndroid.request(
//       PermissionsAndroid.PERMISSIONS.MANAGE_EXTERNAL_STORAGE
//     );
    
//     if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
//       console.log('Permission denied for MANAGE_EXTERNAL_STORAGE');
//       return false;
//     }
//   }
//   return true;
// };


export default function HomeScreen() {
  const getNotes = async (): Promise<Note[]> => {
    const files = await FileSystem.readDirectoryAsync(NOTES_DIRECTORY);
    console.log("Note Data: ", files);

    const notes: Note[] = [];

    for (const file of files) {
      const content = await FileSystem.readAsStringAsync(
        NOTES_DIRECTORY + file
      );
      notes.push({ name: file, content });
    }
    return notes;

    // const notes = await Promise.all(
    //   files.map(async(file) => {
    //     const content = await FileSystem.readAsStringAsync(NOTES_DIRECTORY + file);
    //     return content;
    //   })
    // );
  };
  const [notes, setNotes] = useState<Note[]>([]);

  useEffect(() => {
    const fetchNotes = async () => {
      const fetchedNotes = await getNotes();
      setNotes(fetchedNotes);
    };
    fetchNotes();
  }, []);

  const fileDirectoryName = () => {
    console.log(FileSystem.documentDirectory);
  };

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
              <Text>{item.content}</Text>
            </View>
          )}
        />
        {/* <Button onPress={fileDirectoryName} title="Get File Directory Name" /> */}
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
