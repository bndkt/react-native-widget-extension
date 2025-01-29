import * as fs from "fs";
import * as path from "path";

export type WidgetFiles = {
  swiftFiles: string[];
  entitlementFiles: string[];
  plistFiles: string[];
  assetDirectories: string[];
  intentFiles: string[];
  otherFiles: string[];
};

export function getWidgetFiles(
  widgetsPath: string,
  targetPath: string,
  moduleFileName: string,
  attributesFileName: string
) {
  const widgetFiles: WidgetFiles = {
    swiftFiles: [],
    entitlementFiles: [],
    plistFiles: [],
    assetDirectories: [],
    intentFiles: [],
    otherFiles: [],
  };

  if (!fs.existsSync(targetPath)) {
    fs.mkdirSync(targetPath, { recursive: true });
  }

  if (!fs.existsSync(widgetsPath)) {
    console.error(`Widgets path ${widgetsPath} does not exist`);
    return widgetFiles;
  }

  if (fs.lstatSync(widgetsPath).isDirectory()) {
    const files = fs.readdirSync(widgetsPath);
    files.forEach((file) => {
      const sourcePath = path.join(widgetsPath, file);
      const stats = fs.lstatSync(sourcePath);
      const fileExtension = file.split(".").pop();

      if (stats.isDirectory() && fileExtension === "xcassets") {
        widgetFiles.assetDirectories.push(file);
      } else if (!stats.isDirectory()) {
        if (fileExtension === "swift") {
          if (file !== moduleFileName) {
            widgetFiles.swiftFiles.push(file);
          }
        } else if (fileExtension === "entitlements") {
          widgetFiles.entitlementFiles.push(file);
        } else if (fileExtension === "plist") {
          widgetFiles.plistFiles.push(file);
        } else if (fileExtension === "xcassets") {
          widgetFiles.assetDirectories.push(file);
        } else if (fileExtension === "intentdefinition") {
          widgetFiles.intentFiles.push(file);
        } else {
          widgetFiles.otherFiles.push(file);
        }
      }
    });
  }

  // Copy files
  [
    ...widgetFiles.swiftFiles,
    ...widgetFiles.entitlementFiles,
    ...widgetFiles.plistFiles,
    ...widgetFiles.intentFiles,
    ...widgetFiles.otherFiles,
  ].forEach((file) => {
    const source = path.join(widgetsPath, file);
    try {
      copyFileSync(source, targetPath);
    } catch (error) {
      console.error(`Error copying file ${file}:`, error);
    }
  });

  // Copy Module.swift and Attributes.swift
  const modulePath = path.join(__dirname, "../../../ios");
  const moduleSource = path.join(widgetsPath, moduleFileName);
  const attributesSource = path.join(widgetsPath, attributesFileName);

  if (fs.existsSync(moduleSource)) {
    try {
      copyFileSync(moduleSource, path.join(modulePath, "Module.swift"));
    } catch (error) {
      console.error("Error copying Module.swift:", error);
    }
  }

  if (fs.existsSync(attributesSource)) {
    try {
      copyFileSync(attributesSource, path.join(modulePath, "Attributes.swift"));
    } catch (error) {
      console.error("Error copying Attributes.swift:", error);
    }
  }

  // Copy directories
  widgetFiles.assetDirectories.forEach((directory) => {
    const imagesXcassetsSource = path.join(widgetsPath, directory);
    try {
      copyFolderRecursiveSync(imagesXcassetsSource, targetPath);
    } catch (error) {
      console.error(`Error copying directory ${directory}:`, error);
    }
  });

  return widgetFiles;
}

export function copyFileSync(source: string, target: string) {
  if (!fs.existsSync(source)) {
    throw new Error(`Source file ${source} does not exist`);
  }

  const sourceStats = fs.lstatSync(source);
  if (sourceStats.isDirectory()) {
    throw new Error(`Source ${source} is a directory, expected a file`);
  }

  let targetFile = target;
  if (fs.existsSync(target) && fs.lstatSync(target).isDirectory()) {
    targetFile = path.join(target, path.basename(source));
  }

  try {
    fs.writeFileSync(targetFile, fs.readFileSync(source));
  } catch (error) {
    throw new Error(`Failed to copy ${source} to ${targetFile}: ${error}`);
  }
}

function copyFolderRecursiveSync(source: string, target: string) {
  if (!fs.existsSync(source)) {
    throw new Error(`Source directory ${source} does not exist`);
  }

  const sourceStats = fs.lstatSync(source);
  if (!sourceStats.isDirectory()) {
    throw new Error(`Source ${source} is not a directory`);
  }

  const targetPath = path.join(target, path.basename(source));
  if (!fs.existsSync(targetPath)) {
    fs.mkdirSync(targetPath, { recursive: true });
  }

  const files = fs.readdirSync(source);
  files.forEach((file) => {
    const currentPath = path.join(source, file);
    const stats = fs.lstatSync(currentPath);

    if (stats.isDirectory()) {
      copyFolderRecursiveSync(currentPath, targetPath);
    } else {
      copyFileSync(currentPath, targetPath);
    }
  });
}
