import { ConfigPlugin } from '@expo/config-plugins';

export const withConfig: ConfigPlugin<{
  bundleIdentifier: string;
  targetName: string;
  appGroup: {
    entitlementName: string;
    groupName: string;
  };
}> = (config, { bundleIdentifier, targetName, appGroup }) => {
  config.extra = {
    ...config.extra,
    eas: {
      ...config.extra?.eas,
      build: {
        ...config.extra?.eas?.build,
        experimental: {
          ...config.extra?.eas?.build?.experimental,
          ios: {
            ...config.extra?.eas?.build?.experimental?.ios,
            appExtensions: [
              ...(config.extra?.eas?.build?.experimental?.ios?.appExtensions ??
                []),
              {
                targetName,
                bundleIdentifier,
                entitlements: {
                  [appGroup.entitlementName]: [appGroup.groupName],
                },
              },
            ],
          },
        },
      },
    },
  };
  return config;
};
