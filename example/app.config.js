export default {
  name: "bndkt",
  slug: "sandbox",
  version: "1.0.0",
  orientation: "portrait",
  icon: "./assets/images/icon.png",
  scheme: "bndkt",
  userInterfaceStyle: "automatic",
  splash: {
    image: "./assets/images/splash.png",
    resizeMode: "contain",
    backgroundColor: "#ffffff",
  },
  ios: {
    supportsTablet: true,
    bundleIdentifier: "com.bndkt.sandbox",
    config: { usesNonExemptEncryption: false },
  },
  android: {
    adaptiveIcon: {
      foregroundImage: "./assets/images/adaptive-icon.png",
      backgroundColor: "#ffffff",
    },
  },
  web: {
    bundler: "metro",
    favicon: "./assets/images/favicon.png",
  },
  plugins: [
    [
      "react-native-widget-extension",
      { frequentUpdates: true, widgetsFolder: "PizzaDeliveryWidgets" },
    ],
    [
      "expo-build-properties",
      {
        ios: {
          deploymentTarget: "16.2",
        },
      },
    ],
  ],
};
