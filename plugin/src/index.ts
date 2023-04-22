import { ConfigPlugin, IOSConfig, withPlugins } from "expo/config-plugins";
import { withConfig } from "./withConfig";
import { withPodfile } from "./withPodfile";

import { withXcode } from "./withXcode";
import { withWidgetExtensionEntitlements } from "./withWidgetExtensionEntitlements";

const withWidgetsAndLiveActivities: ConfigPlugin<{
  frequentUpdates?: boolean;
  widgetsFolder?: string;
  groupIdentifier?: string;
}> = (config, { frequentUpdates = false, widgetsFolder = "widgets", groupIdentifier }) => {
  const targetName = `${IOSConfig.XcodeUtils.sanitizedName(config.name)}Widgets`;
  const bundleIdentifier = `${config.ios?.bundleIdentifier}.${targetName}`;
  const deploymentTarget = "16.2";

  config.ios = {
    ...config.ios,
    infoPlist: {
      ...config.ios?.infoPlist,
      NSSupportsLiveActivities: true,
      NSSupportsLiveActivitiesFrequentUpdates: frequentUpdates,
    },
  };

  config = withPlugins(config, [
    [
      withXcode,
      {
        targetName,
        bundleIdentifier,
        deploymentTarget,
        widgetsFolder,
      },
    ],
    [withWidgetExtensionEntitlements, { targetName, groupIdentifier }],
    [withPodfile, { targetName }],
    [withConfig, { targetName, bundleIdentifier, groupIdentifier }],
  ]);

  return config;
};

export default withWidgetsAndLiveActivities;
