import plist from "@expo/plist";
import { ConfigPlugin, withInfoPlist } from "expo/config-plugins";
import * as fs from "fs";
import * as path from "path";

import { getWidgetExtensionEntitlements } from "./lib/getWidgetExtensionEntitlements";

export const withAppClipEntitlements: ConfigPlugin<{
  targetName: string;
  targetPath: string;
  groupIdentifier: string;
  appleSignin: boolean;
}> = (config, { targetName, groupIdentifier }) => {
  return withInfoPlist(config, (config) => {
    const targetPath = path.join(config.modRequest.platformProjectRoot, targetName);
    const filePath = path.join(targetPath, `${targetName}.entitlements`);

    const appClipEntitlements = getWidgetExtensionEntitlements(config.ios, {
      groupIdentifier,
    });

    fs.mkdirSync(path.dirname(filePath), { recursive: true });
    fs.writeFileSync(filePath, plist.build(appClipEntitlements));

    return config;
  });
};
