import { ExpoConfig, ConfigContext } from "expo/config";

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  slug: "notes-prabhat",
  name: "Notes Prabhat",
  extra: {
    auth0Domain: process.env.EXPO_AUTH0_DOMAIN,
    auth0ClientId: process.env.EXPO_AUTH0_CLIENT,
  },
});

// export default {
//   expo: {
//     extra: {
//       auth0Domain: process.env.EXPO_AUTH0_DOMAIN,
//       auth0ClientId: process.env.EXPO_AUTH0_CLIENT,
//     },
//   },
// };
