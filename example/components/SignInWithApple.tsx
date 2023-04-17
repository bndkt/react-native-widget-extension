import * as AppleAuthentication from "expo-apple-authentication";
import { useEffect, useState } from "react";
import { View } from "react-native";
import {
  setSharedCredential,
  getSharedCredential,
} from "react-native-app-clip";

import { Text } from "./Themed";

export default function SignInWithApple() {
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    !isAvailable &&
      AppleAuthentication.isAvailableAsync().then((isAvailable) =>
        setIsAvailable(isAvailable)
      );
  }, [isAvailable, setIsAvailable]);

  useEffect(() => {
    if (!isAuthenticated) {
      const sharedCredential = getSharedCredential(
        "group.com.bndkt.appClipMigration"
      );
      AppleAuthentication.getCredentialStateAsync(sharedCredential)
        .then((status) => {
          setIsAuthenticated(
            status ===
              AppleAuthentication.AppleAuthenticationCredentialState.AUTHORIZED
          );
        })
        .catch(() => {
          setIsAuthenticated(false);
        });
    }
  }, [isAuthenticated]);

  return (
    <View style={{ marginTop: 100 }}>
      {/* <Text>
        Sign in with Apple available:{" "}
        {isAvailable === null ? "⏳" : isAvailable ? "✅" : "❌"}
      </Text> */}
      {isAuthenticated === null ? (
        <Text>⏳ Loading auth ...</Text>
      ) : isAuthenticated ? (
        <Text>✅ Authenticated</Text>
      ) : (
        <AppleAuthentication.AppleAuthenticationButton
          buttonType={AppleAuthentication.AppleAuthenticationButtonType.SIGN_IN}
          buttonStyle={AppleAuthentication.AppleAuthenticationButtonStyle.BLACK}
          cornerRadius={5}
          style={{ marginTop: 25, width: 200, height: 44 }}
          onPress={async () => {
            try {
              const credential = await AppleAuthentication.signInAsync({
                requestedScopes: [
                  AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
                  AppleAuthentication.AppleAuthenticationScope.EMAIL,
                ],
              });
              setSharedCredential(
                "group.com.bndkt.appClipMigration",
                credential.user
              );
              setIsAuthenticated(true);
              // signed in
            } catch (e) {
              if ((e as { code: string }).code === "ERR_CANCELED") {
                // handle that the user canceled the sign-in flow
              } else {
                // handle other errors
              }
            }
          }}
        />
      )}
    </View>
  );
}
