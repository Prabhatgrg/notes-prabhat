import { SafeAreaView } from "react-native-safe-area-context";
import { StyleSheet, Text, ScrollView } from "react-native";
import { List, Divider } from "react-native-paper";
// import { HelloWave } from "@/components/HelloWave";

export default function HomeScreen() {
  return (
    <SafeAreaView>
      <ScrollView style={{ paddingTop: 15 }}>
        <Text style={styles.headerText}>Create Notes</Text>
        <List.Item title="First Item" />
        <Divider />
        <List.Item title="First Item" />
        <Divider />
        <List.Item title="First Item" />
        <Divider />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
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
  },
});
