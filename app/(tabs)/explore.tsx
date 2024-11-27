import { StyleSheet, Dimensions, Text } from "react-native";
import { TextInput, Button } from "react-native-paper";
import React, { useState, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import NetInfo from "@react-native-community/netinfo";

// import * as FileSystem from "expo-file-system";
import { cacheDirectory, downloadAsync } from "expo-file-system";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Note } from ".";
import { NOTES_DIRECTORY } from ".";
// import { Collapsible } from '@/components/Collapsible';
// import { ExternalLink } from '@/components/ExternalLink';
// import ParallaxScrollView from '@/components/ParallaxScrollView';
// import { ThemedText } from '@/components/ThemedText';
// import { ThemedView } from '@/components/ThemedView';
// import { IconSymbol } from '@/components/ui/IconSymbol';

NetInfo.fetch().then((state) => {
  console.log("Connection type", state.type);
  console.log("Is connected?", state.isConnected);
});

// const unsubscribe = NetInfo.addEventListener(state => {
//   console.log('Connection type', state.type);
//   console.log('Is connected?', state.isConnected);
// });

// unsubscribe();

export default function AddNotes() {
  const [note, setNote] = useState("");
  const [isConnected, setIsConnected] = useState<boolean>(true);

  useEffect(() => {
    // Subscribe to network state updates
    const unsubscribe = NetInfo.addEventListener((state) => {
      setIsConnected(state.isConnected ?? !isConnected);
    });

    // Unsubscribe when the component is unmounted
    return () => {
      unsubscribe();
    };
  }, []);

  const checkConnection = () => {
    NetInfo.fetch().then((state) => {
      console.log("Connection type", state.type);
      console.log("Is connected?", state.isConnected);
    });
  };

  // const storeNote = async() => {
  //   const value = await AsyncStorage.getItem("NOTES");
  //   const n = value ? JSON.parse(value) : [];
  //   n.push(note)
  //   await AsyncStorage.setItem("NOTES", JSON.stringify(n))
  //   .then(() => {
  //     console.log("NAVIGATION HERE");
  //   })
  // }

  // const addNewNotes = async () => {
  //   const newNote = {
  //     name: `note_${new Date().getTime()}.txt`,
  //     content: note,
  //   };

  //   try {
  //     await FileSystem.writeAsStringAsync(
  //       NOTES_DIRECTORY + newNote.name,
  //       newNote.content
  //     );

  //     setNote("");
  //   } catch (error) {
  //     console.error("Error saving the note:", error);
  //   }

  // await FileSystem.writeAsStringAsync(NOTES_DIRECTORY + newNote.name, newNote.content);
  // setNote("");
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.headerText}>New Notes</Text>

      <TextInput
        label="Add your notes here"
        value={note}
        mode="outlined"
        style={styles.textInput}
        multiline={true}
        onChangeText={setNote}
      />
      {/* <Button mode="contained" onPress={addNewNotes}>
          Save
        </Button> */}
      {isConnected ? (
        <>
          <Text>App is online</Text>
          <Button mode="contained" onPress={checkConnection}>
            Save
          </Button>
        </>
      ) : (
        <>
          <Text>App is offline</Text>
        </>
      )}
    </SafeAreaView>
    // <ParallaxScrollView
    //   headerBackgroundColor={{ light: '#D0D0D0', dark: '#353636' }}
    //   headerImage={
    //     <IconSymbol
    //       size={310}
    //       color="#808080"
    //       name="chevron.left.forwardslash.chevron.right"
    //       style={styles.headerImage}
    //     />
    //   }>
    //   <ThemedView style={styles.titleContainer}>
    //     <ThemedText type="title">Explore</ThemedText>
    //   </ThemedView>
    //   <ThemedText>This app includes example code to help you get started.</ThemedText>
    //   <Collapsible title="File-based routing">
    //     <ThemedText>
    //       This app has two screens:{' '}
    //       <ThemedText type="defaultSemiBold">app/(tabs)/index.tsx</ThemedText> and{' '}
    //       <ThemedText type="defaultSemiBold">app/(tabs)/explore.tsx</ThemedText>
    //     </ThemedText>
    //     <ThemedText>
    //       The layout file in <ThemedText type="defaultSemiBold">app/(tabs)/_layout.tsx</ThemedText>{' '}
    //       sets up the tab navigator.
    //     </ThemedText>
    //     <ExternalLink href="https://docs.expo.dev/router/introduction">
    //       <ThemedText type="link">Learn more</ThemedText>
    //     </ExternalLink>
    //   </Collapsible>
    //   <Collapsible title="Android, iOS, and web support">
    //     <ThemedText>
    //       You can open this project on Android, iOS, and the web. To open the web version, press{' '}
    //       <ThemedText type="defaultSemiBold">w</ThemedText> in the terminal running this project.
    //     </ThemedText>
    //   </Collapsible>
    //   <Collapsible title="Images">
    //     <ThemedText>
    //       For static images, you can use the <ThemedText type="defaultSemiBold">@2x</ThemedText> and{' '}
    //       <ThemedText type="defaultSemiBold">@3x</ThemedText> suffixes to provide files for
    //       different screen densities
    //     </ThemedText>
    //     <Image source={require('@/assets/images/react-logo.png')} style={{ alignSelf: 'center' }} />
    //     <ExternalLink href="https://reactnative.dev/docs/images">
    //       <ThemedText type="link">Learn more</ThemedText>
    //     </ExternalLink>
    //   </Collapsible>
    //   <Collapsible title="Custom fonts">
    //     <ThemedText>
    //       Open <ThemedText type="defaultSemiBold">app/_layout.tsx</ThemedText> to see how to load{' '}
    //       <ThemedText style={{ fontFamily: 'SpaceMono' }}>
    //         custom fonts such as this one.
    //       </ThemedText>
    //     </ThemedText>
    //     <ExternalLink href="https://docs.expo.dev/versions/latest/sdk/font">
    //       <ThemedText type="link">Learn more</ThemedText>
    //     </ExternalLink>
    //   </Collapsible>
    //   <Collapsible title="Light and dark mode components">
    //     <ThemedText>
    //       This template has light and dark mode support. The{' '}
    //       <ThemedText type="defaultSemiBold">useColorScheme()</ThemedText> hook lets you inspect
    //       what the user's current color scheme is, and so you can adjust UI colors accordingly.
    //     </ThemedText>
    //     <ExternalLink href="https://docs.expo.dev/develop/user-interface/color-themes/">
    //       <ThemedText type="link">Learn more</ThemedText>
    //     </ExternalLink>
    //   </Collapsible>
    //   <Collapsible title="Animations">
    //     <ThemedText>
    //       This template includes an example of an animated component. The{' '}
    //       <ThemedText type="defaultSemiBold">components/HelloWave.tsx</ThemedText> component uses
    //       the powerful <ThemedText type="defaultSemiBold">react-native-reanimated</ThemedText>{' '}
    //       library to create a waving hand animation.
    //     </ThemedText>
    //     {Platform.select({
    //       ios: (
    //         <ThemedText>
    //           The <ThemedText type="defaultSemiBold">components/ParallaxScrollView.tsx</ThemedText>{' '}
    //           component provides a parallax effect for the header image.
    //         </ThemedText>
    //       ),
    //     })}
    //   </Collapsible>
    // </ParallaxScrollView>
  );
}

const windowWidth = Dimensions.get("window").width - 50;
// const heightWidth = Dimensions.get("window").width;

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
    // height: 100,
    // paddingTop: 10,
    borderRadius: 10,
  },
});
