import { Redirect } from "expo-router";
import { useAuth0 } from "react-native-auth0";

const Logout = async () => {
  const { clearSession } = useAuth0();
  await clearSession();
  return <Redirect href="/login" />;
};

export default Logout;
