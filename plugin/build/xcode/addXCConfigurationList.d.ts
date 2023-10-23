import { XcodeProject } from '@expo/config-plugins';
export declare function addXCConfigurationList(xcodeProject: XcodeProject, { targetName, currentProjectVersion, bundleIdentifier, deploymentTarget, marketingVersion, }: {
    targetName: string;
    currentProjectVersion: string;
    bundleIdentifier: string;
    deploymentTarget: string;
    marketingVersion?: string;
}): any;
