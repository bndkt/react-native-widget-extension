import * as fs from 'fs';
import * as path from 'path';

export type WidgetFiles = {
  swiftFiles: string[];
  entitlementFiles: string[];
  plistFiles: string[];
  assetFiles: string[];
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
    assetFiles: [],
    intentFiles: [],
    otherFiles: [],
  };

  if (!fs.lstatSync(widgetsPath).isDirectory()) {
    throw new Error(`Widgets path is not a directory: ${widgetsPath}`);
  }

  if (!fs.existsSync(targetPath)) {
    fs.mkdirSync(targetPath, { recursive: true });
  }

  const sourceFiles = fs.readdirSync(widgetsPath);
  sourceFiles.forEach((file) => {
    const fileExtension = file.split('.').pop();
    const isDir = file.split('.').length === 1;
    const sourcePath = path.join(widgetsPath, file);
    const modulePath = path.join(__dirname, '../../../ios');

    if (fileExtension === 'xcassets') {
      copyFolderRecursiveSync(sourcePath, targetPath);
    } else if (isDir) {
      copyAndFlattenFolderSync(sourcePath, targetPath);
    } else if (file === moduleFileName) {
      copyFileSync(sourcePath, path.join(modulePath, 'Module.swift'));
    } else if (file === attributesFileName) {
      copyFileSync(sourcePath, path.join(modulePath, 'Attributes.swift'));
    } else {
      copyFileSync(sourcePath, targetPath);
    }
  });

  const targetFiles = fs.readdirSync(targetPath);
  targetFiles.forEach((file) => {
    const fileExtension = file.split('.').pop();

    if (fileExtension === 'swift') {
      widgetFiles.swiftFiles.push(file);
    } else if (fileExtension === 'entitlements') {
      widgetFiles.entitlementFiles.push(file);
    } else if (fileExtension === 'plist') {
      widgetFiles.plistFiles.push(file);
    } else if (fileExtension === 'xcassets') {
      widgetFiles.assetFiles.push(file);
    } else if (fileExtension === 'ttf' || fileExtension === 'otf') {
      widgetFiles.assetFiles.push(file);
    } else if (fileExtension === 'intentdefinition') {
      widgetFiles.intentFiles.push(file);
    } else {
      widgetFiles.otherFiles.push(file);
    }
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
