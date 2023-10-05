"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.withConfig = void 0;
const withConfig = (config, { bundleIdentifier, targetName, appGroup }) => {
    let configIndex = null;
    config.extra?.eas?.build?.experimental?.ios?.appExtensions?.forEach((ext, index) => {
        if (ext.targetName === targetName) {
            configIndex = index;
        }
    });
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
        const appClipConfig = config.extra.eas.build.experimental.ios.appExtensions[configIndex];
        appClipConfig.entitlements = {
            [appGroup.entitlementName]: [appGroup.groupName],
        };
    }
    return config;
};
exports.withConfig = withConfig;
