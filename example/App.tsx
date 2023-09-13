import { StyleSheet, Text, View } from "react-native";

import * as ReactNativeWidgetExtension from "react-native-widget-extension";

export default function App() {
  return (
    <View style={styles.container}>
      <Text>{ReactNativeWidgetExtension.areActivitiesEnabled()}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
