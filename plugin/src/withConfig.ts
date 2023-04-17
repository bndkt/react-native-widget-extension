import { ConfigPlugin } from "expo/config-plugins";

export const withConfig: ConfigPlugin<{
  bundleIdentifier: string;
  targetName: string;
}> = (config, { bundleIdentifier, targetName }) => {
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
                ...(config.extra?.eas?.build?.experimental?.ios
                  ?.appExtensions ?? []),
                {
                  targetName,
                  bundleIdentifier,
                },
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

    appClipConfig.entitlements = {};
  }

  return config;
};
