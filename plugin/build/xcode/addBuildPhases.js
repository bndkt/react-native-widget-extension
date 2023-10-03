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
exports.addBuildPhases = void 0;
const util = __importStar(require("util"));
function addBuildPhases(xcodeProject, { targetUuid, groupName, productFile, widgetFiles, }) {
    const buildPath = `""`;
    const folderType = "app_extension";
    const { swiftFiles, intentFiles, assetDirectories, entitlementFiles, plistFiles, } = widgetFiles;
    // Sources build phase
    xcodeProject.addBuildPhase([...swiftFiles, ...intentFiles], "PBXSourcesBuildPhase", groupName, targetUuid, folderType, buildPath);
    // Copy files build phase
    xcodeProject.addBuildPhase([], "PBXCopyFilesBuildPhase", groupName, xcodeProject.getFirstTarget().uuid, folderType, buildPath);
    xcodeProject
        .buildPhaseObject("PBXCopyFilesBuildPhase", groupName, productFile.target)
        .files.push({
        value: productFile.uuid,
        comment: util.format("%s in %s", productFile.basename, productFile.group), // longComment(file);
    });
    xcodeProject.addToPbxBuildFileSection(productFile);
    // Frameworks build phase
    xcodeProject.addBuildPhase([], "PBXFrameworksBuildPhase", groupName, targetUuid, folderType, buildPath);
    // Resources build phase
    xcodeProject.addBuildPhase([...assetDirectories], "PBXResourcesBuildPhase", groupName, targetUuid, folderType, buildPath);
}
exports.addBuildPhases = addBuildPhases;
