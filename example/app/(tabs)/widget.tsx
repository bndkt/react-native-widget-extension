import { useState } from "react";
import { Button, StyleSheet, TextInput } from "react-native";
import {
  areActivitiesEnabled,
  startActivity,
  updateActivity,
  endActivity,
} from "react-native-widget-extension";

import { Text, View } from "../../components/Themed";

export default function TabTwoScreen() {
  const [driverName, setDriverName] = useState<string>("");
  const [numberOfPizzas, setNumberOfPizzas] = useState<string>("");

  return (
    <View style={styles.container}>
      <Text>Live Activities: {areActivitiesEnabled() ? "✅" : "❌"}</Text>
      {areActivitiesEnabled() && (
        <>
          <View style={{ marginTop: 30, marginBottom: 15 }}>
            <Text>Driver:</Text>
            <TextInput
              placeholder="Driver"
              style={{
                backgroundColor: "white",
                borderColor: "lightgray",
                borderWidth: 1,
                padding: 5,
                width: 200,
              }}
              value={driverName}
              onChangeText={setDriverName}
            />
          </View>
          <View style={{ marginBottom: 30 }}>
            <Text>Number of pizzas:</Text>
            <TextInput
              placeholder="Number of pizzas"
              style={{
                backgroundColor: "white",
                borderColor: "lightgray",
                borderWidth: 1,
                padding: 5,
                width: 200,
              }}
              value={numberOfPizzas}
              onChangeText={setNumberOfPizzas}
            />
          </View>
          <Button
            title="Start activity (and update after 10 sec)"
            onPress={() => {
              console.log("startActivity() pressed");
              startActivity(
                Number(numberOfPizzas),
                "4343",
                "$32.23",
                driverName,
                47,
                43
              );
              /* startActivity({
                numberOfPizzas: Number(numberOfPizzas),
                orderNumber: "4343",
                totalAmount: "$32.23",
                driverName,
                minutes: 47,
                seconds: 43,
              }); */
              setTimeout(() => {
                updateActivity({
                  driverName: "John",
                  minutes: 12,
                  seconds: 24,
                });
              }, 10000);
            }}
          />
          <Button
            title="Update activity"
            onPress={() => {
              console.log("updateActivity() pressed");
              updateActivity({
                driverName,
                minutes: 12,
                seconds: 24,
              });
            }}
          />
          <Button
            title="End activity"
            onPress={() => {
              console.log("endActivity() pressed");
              endActivity({ driverName });
            }}
          />
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
});
