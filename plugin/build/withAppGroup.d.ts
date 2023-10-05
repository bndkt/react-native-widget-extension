import { ConfigPlugin } from '@expo/config-plugins';
export declare const withAppGroup: ConfigPlugin<{
    appGroup: {
        entitlementName: string;
        groupName: string;
    };
}>;
