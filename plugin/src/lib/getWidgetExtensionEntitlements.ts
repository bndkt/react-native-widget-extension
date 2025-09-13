import { ExportedConfig, InfoPlist } from "@expo/config-plugins";

export function getWidgetExtensionEntitlements(
  iosConfig: ExportedConfig["ios"],
  {
    groupIdentifier,
    keychainAccessGroup,
  }: {
    groupIdentifier?: string;
    keychainAccessGroup?: string;
  }
) {
  const entitlements: InfoPlist = {};

  addApplicationGroupsEntitlement(entitlements, groupIdentifier);
  addKeychainAccessGroupsEntitlement(entitlements, keychainAccessGroup);

  return entitlements;
}

export function addApplicationGroupsEntitlement(entitlements: InfoPlist, groupIdentifier?: string) {
  if (groupIdentifier) {
    const existingApplicationGroups = (entitlements["com.apple.security.application-groups"] as string[]) ?? [];

    entitlements["com.apple.security.application-groups"] = [groupIdentifier, ...existingApplicationGroups];
  }

  return entitlements;
}


export function addKeychainAccessGroupsEntitlement(entitlements: InfoPlist, keychainAccessGroup?: string) {

  if (keychainAccessGroup) {
    const existingKeychainAccessGroups = (entitlements["keychain-access-groups"] as string[]) ?? [];

    entitlements["keychain-access-groups"] = [keychainAccessGroup, ...existingKeychainAccessGroups];
  }

  return entitlements;
}
