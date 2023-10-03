"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addPbxGroup = void 0;
function addPbxGroup(xcodeProject, { targetName, widgetFiles, }) {
    const { swiftFiles, intentFiles, otherFiles, assetDirectories, entitlementFiles, plistFiles, } = widgetFiles;
    // Add PBX group
    const { uuid: pbxGroupUuid } = xcodeProject.addPbxGroup([
        ...swiftFiles,
        ...intentFiles,
        ...otherFiles,
        ...entitlementFiles,
        ...plistFiles,
        ...assetDirectories,
    ], targetName, targetName);
    // Add PBXGroup to top level group
    const groups = xcodeProject.hash.project.objects["PBXGroup"];
    if (pbxGroupUuid) {
        Object.keys(groups).forEach(function (key) {
            if (groups[key].name === undefined && groups[key].path === undefined) {
                xcodeProject.addToPbxGroup(pbxGroupUuid, key);
            }
        });
    }
}
exports.addPbxGroup = addPbxGroup;
