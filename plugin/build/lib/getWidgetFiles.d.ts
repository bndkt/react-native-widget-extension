export type WidgetFiles = {
    swiftFiles: string[];
    entitlementFiles: string[];
    plistFiles: string[];
    assetDirectories: string[];
    intentFiles: string[];
    otherFiles: string[];
};
export declare function getWidgetFiles(widgetsPath: string, targetPath: string, moduleFileName: string, attributesFileName: string): WidgetFiles;
export declare function copyFileSync(source: string, target: string): void;
