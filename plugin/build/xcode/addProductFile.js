"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addProductFile = void 0;
function addProductFile(xcodeProject, { targetName, groupName }) {
    const options = {
        basename: `${targetName}.appex`,
        // fileRef: xcodeProject.generateUuid(),
        // uuid: xcodeProject.generateUuid(),
        group: groupName,
        explicitFileType: "wrapper.app-extension",
        /* fileEncoding: 4, */
        settings: {
            ATTRIBUTES: ["RemoveHeadersOnCopy"],
        },
        includeInIndex: 0,
        path: `${targetName}.appex`,
        sourceTree: "BUILT_PRODUCTS_DIR",
    };
    const productFile = xcodeProject.addProductFile(targetName, options);
    return productFile;
}
exports.addProductFile = addProductFile;
