import { XcodeProject } from "@expo/config-plugins";
import { WidgetFiles } from "../lib/getWidgetFiles";
export declare function addPbxGroup(xcodeProject: XcodeProject, { targetName, widgetFiles, }: {
    targetName: string;
    widgetFiles: WidgetFiles;
}): void;
