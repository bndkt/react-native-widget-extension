import { ConfigPlugin, IOSConfig, withPlugins } from '@expo/config-plugins';
import { withConfig } from './withConfig';
import { withPodfile } from './withPodfile';

import { withXcode } from './withXcode';
import { withAppGroup } from './withAppGroup';

const withLiveActivities: ConfigPlugin<{
  frequentUpdates?: boolean;
  widgetsFolder?: string;
  deploymentTarget?: string;
  moduleFileName?: string;
  attributesFileName?: string;
}> = (
  config,
  {
    frequentUpdates = false,
    widgetsFolder = 'widgets',
    deploymentTarget = '16.2',
    moduleFileName = 'Module.swift',
    attributesFileName = 'Attributes.swift',
  }
) => {
  const targetName = `${IOSConfig.XcodeUtils.sanitizedName(
    config.name
  )}Widgets`;
  const bundleIdentifier = `${config.ios?.bundleIdentifier}.${targetName}`;
  const appGroup = {
    entitlementName: 'com.apple.security.application-groups',
    groupName: `group.${config?.ios?.bundleIdentifier}.widgets`,
  };

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
        moduleFileName,
        attributesFileName,
      },
    ],
    [withPodfile, { targetName }],
    [withConfig, { targetName, bundleIdentifier, appGroup }],
    [withAppGroup, { appGroup }],
  ]);

  return config;
};

export default withLiveActivities;
