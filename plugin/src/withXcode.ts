import { ConfigPlugin, withXcodeProject } from "expo/config-plugins";
import * as path from "path";

import { addXCConfigurationList } from "./xcode/addXCConfigurationList";
import { addProductFile } from "./xcode/addProductFile";
import { addToPbxNativeTargetSection } from "./xcode/addToPbxNativeTargetSection";
import { addToPbxProjectSection } from "./xcode/addToPbxProjectSection";
import { addTargetDependency } from "./xcode/addTargetDependency";
import { addPbxGroup } from "./xcode/addPbxGroup";
import { addBuildPhases } from "./xcode/addBuildPhases";
import { getWidgetFiles } from "./lib/getWidgetFiles";

export const withXcode: ConfigPlugin<{
  targetName: string;
  bundleIdentifier: string;
  deploymentTarget: string;
  widgetsFolder: string;
}> = (
  config,
  { targetName, bundleIdentifier, deploymentTarget, widgetsFolder }
) => {
  return withXcodeProject(config, (config) => {
    const xcodeProject = config.modResults;
    const widgetsPath = path.join(config.modRequest.projectRoot, widgetsFolder);

    const targetUuid = xcodeProject.generateUuid();
    const groupName = "Embed Foundation Extensions";
    const { platformProjectRoot } = config.modRequest;
    const marketingVersion = config.version;

    const targetPath = path.join(platformProjectRoot, targetName);

    const widgetFiles = getWidgetFiles(widgetsPath, targetPath);

    const xCConfigurationList = addXCConfigurationList(xcodeProject, {
      targetName,
      currentProjectVersion: config.ios!.buildNumber || "1",
      bundleIdentifier,
      deploymentTarget,
      marketingVersion,
    });

    const productFile = addProductFile(xcodeProject, {
      targetName,
      groupName,
    });

    const target = addToPbxNativeTargetSection(xcodeProject, {
      targetName,
      targetUuid,
      productFile,
      xCConfigurationList,
    });

    addToPbxProjectSection(xcodeProject, target);

    addTargetDependency(xcodeProject, target);

    addBuildPhases(xcodeProject, {
      targetUuid,
      groupName,
      productFile,
      widgetFiles,
    });

    addPbxGroup(xcodeProject, {
      targetName,
      widgetFiles,
    });

    return config;
  });
};
