"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.withConfig = void 0;
const withConfig = (config, { bundleIdentifier, targetName, appGroup }) => {
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
exports.withConfig = withConfig;
