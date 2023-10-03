"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_plugins_1 = require("@expo/config-plugins");
const withConfig_1 = require("./withConfig");
const withPodfile_1 = require("./withPodfile");
const withXcode_1 = require("./withXcode");
const withLiveActivities = (config, { frequentUpdates = false, widgetsFolder = "widgets", deploymentTarget = "16.2", moduleFileName = "Module.swift", attributesFileName = "Attributes.swift", }) => {
    const targetName = `${config_plugins_1.IOSConfig.XcodeUtils.sanitizedName(config.name)}Widgets`;
    const bundleIdentifier = `${config.ios?.bundleIdentifier}.${targetName}`;
    config.ios = {
        ...config.ios,
        infoPlist: {
            ...config.ios?.infoPlist,
            NSSupportsLiveActivities: true,
            NSSupportsLiveActivitiesFrequentUpdates: frequentUpdates,
        },
    };
    config = (0, config_plugins_1.withPlugins)(config, [
        [
            withXcode_1.withXcode,
            {
                targetName,
                bundleIdentifier,
                deploymentTarget,
                widgetsFolder,
                moduleFileName,
                attributesFileName,
            },
        ],
        [withPodfile_1.withPodfile, { targetName }],
        [withConfig_1.withConfig, { targetName, bundleIdentifier }],
    ]);
    return config;
};
exports.default = withLiveActivities;
