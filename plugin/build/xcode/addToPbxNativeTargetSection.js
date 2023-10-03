"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addToPbxNativeTargetSection = void 0;
function addToPbxNativeTargetSection(xcodeProject, { targetName, targetUuid, productFile, xCConfigurationList, }) {
    const target = {
        uuid: targetUuid,
        pbxNativeTarget: {
            isa: "PBXNativeTarget",
            name: targetName,
            productName: targetName,
            productReference: productFile.fileRef,
            productType: `"com.apple.product-type.app-extension"`,
            buildConfigurationList: xCConfigurationList.uuid,
            buildPhases: [],
            buildRules: [],
            dependencies: [],
        },
    };
    xcodeProject.addToPbxNativeTargetSection(target);
    const frameworksGroup = xcodeProject.findPBXGroupKey({ name: "Frameworks" });
    const file1 = xcodeProject.addFile("WidgetKit.framework", frameworksGroup);
    const file2 = xcodeProject.addFile("SwiftUI.framework", frameworksGroup);
    const frameworksBuildPhaseObj = xcodeProject.pbxFrameworksBuildPhaseObj(target.uuid);
    /* console.log(
      { file1, file2, frameworksBuildPhaseObj },
      frameworksBuildPhaseObj.files
    ); */
    return target;
}
exports.addToPbxNativeTargetSection = addToPbxNativeTargetSection;
