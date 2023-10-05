import { ConfigPlugin, withEntitlementsPlist } from '@expo/config-plugins';

export const withAppGroup: ConfigPlugin<{
  appGroup: {
    entitlementName: string;
    groupName: string;
  };
}> = (config, { appGroup: { entitlementName, groupName } }) => {
  return withEntitlementsPlist(config, (newConfig) => {
    if (!Array.isArray(newConfig.modResults[entitlementName])) {
      newConfig.modResults[entitlementName] = [];
    }
    const modResultsArray = newConfig.modResults[entitlementName] as string[];
    if (modResultsArray.indexOf(groupName) !== -1) {
      return newConfig;
    }
    modResultsArray.push(groupName);

    return newConfig;
  });
};
