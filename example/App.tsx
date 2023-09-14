import { Button, StyleSheet, View } from "react-native";
import * as ReactNativeWidgetExtension from "react-native-widget-extension";

export default function App() {
  const quarter = 1;
  const scoreLeft = 2;
  const scoreRight = 3;
  const bottomText = "Hello, world!";

  return (
    <View style={styles.container}>
      {ReactNativeWidgetExtension.areActivitiesEnabled() ? (
        <>
          <Button
            onPress={() =>
              ReactNativeWidgetExtension.startActivity(
                quarter,
                scoreLeft,
                scoreRight,
                bottomText
              )
            }
            title="Start Live Activity"
          />
          <Button
            onPress={() =>
              ReactNativeWidgetExtension.updateActivity(
                quarter + 1,
                scoreLeft + 2,
                scoreRight + 3,
                "Updated bottom text!"
              )
            }
            title="Update Live Activity"
          />
          <Button
            onPress={() =>
              ReactNativeWidgetExtension.endActivity(
                quarter + 2,
                scoreLeft + 3,
                scoreRight + 4,
                "The end."
              )
            }
            title="End Live Activity"
          />
        </>
      ) : null}
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
