import { View, Text, StyleSheet, TouchableOpacity, Button } from "react-native";
import { useAuth0 } from "react-native-auth0";
import { useRouter } from "expo-router";
// import { Button } from "react-native-paper";

const Login = () => {
  const { authorize, isLoading, user, error } = useAuth0();
  const router = useRouter();

  const handleLogin = async () => {
    await authorize();
    router.push('/(tabs)');
  };

  const loggedIn = user !== undefined && user !== null;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome</Text>
      {error && <Text style={styles.error}>{error.message}</Text>}
      {/* <TouchableOpacity
        style={styles.button}
        onPress={handleLogin}
        disabled={isLoading}
      >
        <Text style={styles.buttonText}>
          {isLoading ? "Loading..." : "Login with Auth0"}
        </Text>
        <Button onPress={loggedIn ? handleLogin : handleLogin} title='Login with Auth0' />
      </TouchableOpacity> */}
      <Button
        onPress={handleLogin}
        title="Login with Auth0"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#0A84FF",
    padding: 15,
    borderRadius: 8,
    width: "100%",
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  error: {
    color: "red",
    marginBottom: 10,
  },
});

export default Login;
