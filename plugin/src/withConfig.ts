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
                // keep in sync with native changes in NSE
                targetName,
                bundleIdentifier,
                entitlements: {
                  'com.apple.security.application-groups': [
                    `group.${config?.ios?.bundleIdentifier}.widgets`,
                  ],
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
