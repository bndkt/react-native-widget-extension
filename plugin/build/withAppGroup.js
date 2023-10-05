"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.withAppGroup = void 0;
const config_plugins_1 = require("@expo/config-plugins");
const withAppGroup = (config, { appGroup: { entitlementName, groupName } }) => {
    return (0, config_plugins_1.withEntitlementsPlist)(config, (newConfig) => {
        if (!Array.isArray(newConfig.modResults[entitlementName])) {
            newConfig.modResults[entitlementName] = [];
        }
        const modResultsArray = newConfig.modResults[entitlementName];
        if (modResultsArray.indexOf(groupName) !== -1) {
            return newConfig;
        }
        modResultsArray.push(groupName);
        return newConfig;
    });
};
exports.withAppGroup = withAppGroup;
