"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.copyFileSync = exports.getWidgetFiles = void 0;
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
function getWidgetFiles(widgetsPath, targetPath, moduleFileName, attributesFileName) {
    const widgetFiles = {
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
        }
        else if (isDir) {
            copyAndFlattenFolderSync(sourcePath, targetPath);
        }
        else if (file === moduleFileName) {
            copyFileSync(sourcePath, path.join(modulePath, 'Module.swift'));
        }
        else if (file === attributesFileName) {
            copyFileSync(sourcePath, path.join(modulePath, 'Attributes.swift'));
        }
        else {
            copyFileSync(sourcePath, targetPath);
        }
    });
    const targetFiles = fs.readdirSync(targetPath);
    targetFiles.forEach((file) => {
        const fileExtension = file.split('.').pop();
        if (fileExtension === 'swift') {
            widgetFiles.swiftFiles.push(file);
        }
        else if (fileExtension === 'entitlements') {
            widgetFiles.entitlementFiles.push(file);
        }
        else if (fileExtension === 'plist') {
            widgetFiles.plistFiles.push(file);
        }
        else if (fileExtension === 'xcassets') {
            widgetFiles.assetFiles.push(file);
        }
        else if (fileExtension === 'ttf' || fileExtension === 'otf') {
            widgetFiles.assetFiles.push(file);
        }
        else if (fileExtension === 'intentdefinition') {
            widgetFiles.intentFiles.push(file);
        }
        else {
            widgetFiles.otherFiles.push(file);
        }
    });
    return widgetFiles;
}
exports.getWidgetFiles = getWidgetFiles;
function copyFileSync(source, target) {
    let targetFile = target;
    if (fs.existsSync(target) && fs.lstatSync(target).isDirectory()) {
        targetFile = path.join(target, path.basename(source));
    }
    fs.writeFileSync(targetFile, fs.readFileSync(source));
}
exports.copyFileSync = copyFileSync;
function copyFolderRecursiveSync(source, target) {
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
            }
            else {
                copyFileSync(currentPath, targetPath);
            }
        });
    }
}
function copyAndFlattenFolderSync(source, target) {
    if (fs.lstatSync(source).isDirectory()) {
        const files = fs.readdirSync(source);
        files.forEach((file) => {
            const currentPath = path.join(source, file);
            if (fs.lstatSync(currentPath).isDirectory()) {
                copyAndFlattenFolderSync(currentPath, target);
            }
            else {
                copyFileSync(currentPath, target);
            }
        });
    }
    else {
        copyFileSync(source, target);
    }
}
