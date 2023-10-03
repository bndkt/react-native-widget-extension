import { ConfigPlugin } from "@expo/config-plugins";
export declare const withXcode: ConfigPlugin<{
    targetName: string;
    bundleIdentifier: string;
    deploymentTarget: string;
    widgetsFolder: string;
    moduleFileName: string;
    attributesFileName: string;
}>;
