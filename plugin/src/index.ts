import { ConfigPlugin, IOSConfig, withPlugins } from "expo/config-plugins";
import { withConfig } from "./withConfig";
import { withPodfile } from "./withPodfile";

import { withXcode } from "./withXcode";

const withLiveActivities: ConfigPlugin<{
  frequentUpdates?: boolean;
  widgetsFolder?: string;
  deploymentTarget?: string;
}> = (
  config,
  { frequentUpdates, widgetsFolder = "widgets", deploymentTarget = "16.2" }
) => {
  const targetName = `${IOSConfig.XcodeUtils.sanitizedName(
    config.name
  )}Widgets`;
  const bundleIdentifier = `${config.ios?.bundleIdentifier}.${targetName}`;

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
    [withPodfile, { targetName }],
    [withConfig, { targetName, bundleIdentifier }],
  ]);

  return config;
};

export default withLiveActivities;
