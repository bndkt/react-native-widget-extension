import { useState } from "react";
import { Button, StyleSheet } from "react-native";
import {
  isClip,
  displayOverlay,
  setSharedCredential,
  getSharedCredential,
  getContainerURL,
} from "react-native-app-clip";

import SignInWithApple from "../../components/SignInWithApple";
import { Text, View } from "../../components/Themed";

const groupIdentifier = "group.com.bndkt.appClipMigration";

export default function TabOneScreen() {
  const [credential, setCredential] = useState<string | null>(null);

  return (
    <View style={styles.container}>
      <View style={{ alignItems: "center" }}>
        <Text>App Clip: {isClip() ? "✅" : "❌"}</Text>
        {/* <Text>
          Shared credential: {credential ? `✅ (${credential})` : "❌"}
        </Text>
        <Text>
          Container getContainerURL: {getContainerURL(groupIdentifier)}
        </Text>
        <Button
          title="Set shared credential to FOOBAR"
          onPress={() => setSharedCredential(groupIdentifier, "FOOBAR")}
        />
        <Button
          title="Get shared credential"
          onPress={() => {
            const credential = getSharedCredential(groupIdentifier);
            setCredential(credential);
          }}
        /> */}
        <SignInWithApple />
        {isClip() && (
          <View style={{ marginTop: 100 }}>
            <Button title="Show App Banner" onPress={() => displayOverlay()} />
          </View>
        )}
      </View>
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
