import { ConfigPlugin } from '@expo/config-plugins';

export const withConfig: ConfigPlugin<{
  bundleIdentifier: string;
  targetName: string;
  appGroup: {
    entitlementName: string;
    groupName: string;
  };
}> = (config, { bundleIdentifier, targetName, appGroup }) => {
  let configIndex: null | number = null;
  config.extra?.eas?.build?.experimental?.ios?.appExtensions?.forEach(
    (ext: any, index: number) => {
      if (ext.targetName === targetName) {
        configIndex = index;
      }
    }
  );

  if (!configIndex) {
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
                {
                  targetName,
                  bundleIdentifier,
                  entitlements: {
                    [appGroup.entitlementName]: [appGroup.groupName],
                  },
                },
                ...(config.extra?.eas?.build?.experimental?.ios
                  ?.appExtensions ?? []),
              ],
            },
          },
        },
      },
    };
    configIndex = 0;
  }

  if (configIndex != null && config.extra) {
    const appClipConfig =
      config.extra.eas.build.experimental.ios.appExtensions[configIndex];

    appClipConfig.entitlements = {
      ...appClipConfig.entitlements,
      [appGroup.entitlementName]: [appGroup.groupName],
    };

    config.ios = {
      ...config.ios,
      entitlements: {
        ...config.ios?.entitlements,
        [appGroup.entitlementName]: [appGroup.groupName],
      },
    };
  }

  return config;
};
