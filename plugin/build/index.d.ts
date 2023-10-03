import { ConfigPlugin } from "@expo/config-plugins";
declare const withLiveActivities: ConfigPlugin<{
    frequentUpdates?: boolean;
    widgetsFolder?: string;
    deploymentTarget?: string;
    moduleFileName?: string;
    attributesFileName?: string;
}>;
export default withLiveActivities;
