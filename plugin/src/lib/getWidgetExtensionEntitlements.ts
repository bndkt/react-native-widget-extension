import { ExportedConfig, InfoPlist } from "expo/config-plugins";

export function getWidgetExtensionEntitlements(
  iosConfig: ExportedConfig["ios"],
  {
    groupIdentifier,
  }: {
    groupIdentifier?: string;
  }
) {
  const entitlements: InfoPlist = {};

  addApplicationGroupsEntitlement(entitlements, groupIdentifier);

  return entitlements;
}

export function addApplicationGroupsEntitlement(entitlements: InfoPlist, groupIdentifier?: string) {
  if (groupIdentifier) {
    const existingApplicationGroups = (entitlements["com.apple.security.application-groups"] as string[]) ?? [];

    entitlements["com.apple.security.application-groups"] = [groupIdentifier, ...existingApplicationGroups];
  }

  return entitlements;
}
