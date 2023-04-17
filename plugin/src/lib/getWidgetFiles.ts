import * as fs from "fs";
import * as path from "path";

export type WidgetFiles = {
  swiftFiles: string[];
  entitlementFiles: string[];
  plistFiles: string[];
  assetDirectories: string[];
};

export function getWidgetFiles(widgetsPath: string, targetPath: string) {
  const widgetFiles: WidgetFiles = {
    swiftFiles: [],
    entitlementFiles: [],
    plistFiles: [],
    assetDirectories: [],
  };

  if (!fs.existsSync(targetPath)) {
    fs.mkdirSync(targetPath, { recursive: true });
  }

  if (fs.lstatSync(widgetsPath).isDirectory()) {
    const files = fs.readdirSync(widgetsPath);

    files.forEach((file) => {
      const fileExtension = file.split(".").pop();

      if (fileExtension === "swift") {
        if (file !== "Module.swift") {
          widgetFiles.swiftFiles.push(file);
        }
      } else if (fileExtension === "entitlements") {
        widgetFiles.entitlementFiles.push(file);
      } else if (fileExtension === "plist") {
        widgetFiles.plistFiles.push(file);
      } else if (fileExtension === "xcassets") {
        widgetFiles.assetDirectories.push(file);
      }
    });
  }

  // Copy files
  [
    ...widgetFiles.swiftFiles,
    ...widgetFiles.entitlementFiles,
    ...widgetFiles.plistFiles,
  ].forEach((file) => {
    const source = path.join(widgetsPath, file);
    copyFileSync(source, targetPath);
  });

  // Copy Module.swift and Attributes.swift
  const modulePath = path.join(__dirname, "../../../ios");
  copyFileSync(
    path.join(widgetsPath, "Module.swift"),
    path.join(modulePath, "Module.swift")
  );
  console.log(
    path.join(widgetsPath, "Module.swift"),
    path.join(modulePath, "Module.swift")
  );
  copyFileSync(
    path.join(widgetsPath, "Attributes.swift"),
    path.join(modulePath, "Attributes.swift")
  );

  // Copy directories
  widgetFiles.assetDirectories.forEach((directory) => {
    const imagesXcassetsSource = path.join(widgetsPath, directory);
    copyFolderRecursiveSync(imagesXcassetsSource, targetPath);
  });

  return widgetFiles;
}

export function copyFileSync(source: string, target: string) {
  let targetFile = target;

  if (fs.existsSync(target) && fs.lstatSync(target).isDirectory()) {
    targetFile = path.join(target, path.basename(source));
  }

  fs.writeFileSync(targetFile, fs.readFileSync(source));
}

function copyFolderRecursiveSync(source: string, target: string) {
  const targetPath = path.join(target, path.basename(source));
  if (!fs.existsSync(targetPath)) {
    fs.mkdirSync(targetPath, { recursive: true });
  }

  if (fs.lstatSync(source).isDirectory()) {
    const files = fs.readdirSync(source);
    files.forEach((file) => {
      const currentPath = path.join(source, file);
      if (fs.lstatSync(currentPath).isDirectory()) {
        copyFolderRecursiveSync(currentPath, targetPath);
      } else {
        copyFileSync(currentPath, targetPath);
      }
    });
  }
}
