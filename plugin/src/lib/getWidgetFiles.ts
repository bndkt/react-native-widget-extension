import * as fs from 'fs';
import * as path from 'path';

export type WidgetFiles = {
  moduleFile: string;
  attributesFile: string;
  swiftFiles: string[];
  entitlementFiles: string[];
  plistFiles: string[];
  assetDirectories: string[];
  intentFiles: string[];
  otherFiles: string[];
  otherDirectories: string[];
  fontFiles: string[];
};

export function getWidgetFiles(
  widgetsPath: string,
  targetPath: string,
  moduleFileName: string,
  attributesFileName: string
) {
  const widgetFiles: WidgetFiles = {
    moduleFile: '',
    attributesFile: '',
    swiftFiles: [],
    entitlementFiles: [],
    plistFiles: [],
    assetDirectories: [],
    intentFiles: [],
    otherFiles: [],
    otherDirectories: [],
    fontFiles: [],
  };

  if (!fs.existsSync(targetPath)) {
    fs.mkdirSync(targetPath, { recursive: true });
  }

  if (fs.lstatSync(widgetsPath).isDirectory()) {
    const files = fs.readdirSync(widgetsPath);

    files.forEach((file) => {
      const fileExtension = file.split('.').pop();
      const isDir = file.split('.').length === 1;

      if (file === moduleFileName) {
        widgetFiles.moduleFile = file;
      } else if (file === attributesFileName) {
        widgetFiles.attributesFile = file;
      } else if (fileExtension === 'swift') {
        widgetFiles.swiftFiles.push(file);
      } else if (fileExtension === 'entitlements') {
        widgetFiles.entitlementFiles.push(file);
      } else if (fileExtension === 'plist') {
        widgetFiles.plistFiles.push(file);
      } else if (fileExtension === 'xcassets') {
        widgetFiles.assetDirectories.push(file);
      } else if (fileExtension === 'ttf' || fileExtension === 'otf') {
        widgetFiles.fontFiles.push(file);
      } else if (fileExtension === 'intentdefinition') {
        widgetFiles.intentFiles.push(file);
      } else if (isDir) {
        widgetFiles.otherDirectories.push(file);
      } else {
        widgetFiles.otherFiles.push(file);
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
    ...widgetFiles.fontFiles,
  ].forEach((file) => {
    const source = path.join(widgetsPath, file);
    copyFileSync(source, targetPath);
  });

  // Copy Module.swift and Attributes.swift
  const modulePath = path.join(__dirname, '../../../ios');
  if (widgetFiles.moduleFile) {
    copyFileSync(
      path.join(widgetsPath, moduleFileName),
      path.join(modulePath, 'Module.swift')
    );
  }
  if (widgetFiles.attributesFile) {
    copyFileSync(
      path.join(widgetsPath, attributesFileName),
      path.join(modulePath, 'Attributes.swift')
    );
  }

  // Copy directories
  widgetFiles.assetDirectories.forEach((directory) => {
    const dirSource = path.join(widgetsPath, directory);
    copyFolderRecursiveSync(dirSource, targetPath);
  });
  widgetFiles.otherDirectories.forEach((directory) => {
    const dirSource = path.join(widgetsPath, directory);
    copyAndFlattenFolderSync(dirSource, targetPath);
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

function copyAndFlattenFolderSync(source: string, target: string) {
  if (fs.lstatSync(source).isDirectory()) {
    const files = fs.readdirSync(source);
    files.forEach((file) => {
      const currentPath = path.join(source, file);
      if (fs.lstatSync(currentPath).isDirectory()) {
        copyAndFlattenFolderSync(currentPath, target);
      } else {
        copyFileSync(currentPath, target);
      }
    });
  } else {
    copyFileSync(source, target);
  }
}
