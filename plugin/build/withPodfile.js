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
exports.withPodfile = void 0;
const generateCode_1 = require("@expo/config-plugins/build/utils/generateCode");
const config_plugins_1 = require("@expo/config-plugins");
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const withPodfile = (config, { targetName }) => {
    return (0, config_plugins_1.withDangerousMod)(config, [
        "ios",
        (config) => {
            const podFilePath = path.join(config.modRequest.platformProjectRoot, "Podfile");
            let podFileContent = fs.readFileSync(podFilePath).toString();
            /* podFileContent = mergeContents({
              tag: "withWidgetExtensionPodfile1999999999",
              src: podFileContent,
              newSrc: `  target '${targetName}' do\n    \n  end`,
              anchor: /post_install/,
              offset: 0,
              comment: "#",
            }).contents; */
            /* podFileContent = podFileContent.replace(
              /use_expo_modules!/,
              `use_expo_modules!(searchPaths: ["./node_modules", "../../node_modules", "../../../WidgetExtension"])`
            ); */
            podFileContent = (0, generateCode_1.mergeContents)({
                tag: "react-native-widget-extension-1",
                src: podFileContent,
                newSrc: `installer.pods_project.targets.each do |target|
          target.build_configurations.each do |config|
            config.build_settings['APPLICATION_EXTENSION_API_ONLY'] = 'No'
          end
        end`,
                anchor: /installer.target_installation_results.pod_target_installation_results/,
                offset: 0,
                comment: "#",
            }).contents;
            /* podFileContent = mergeContents({
              tag: "react-native-widget-extension-2",
              src: podFileContent,
              newSrc: `pod 'WidgetExtension', :path => '../WidgetExtension/ios'`,
              anchor: /use_react_native/,
              offset: -1,
              comment: "#",
            }).contents; */
            podFileContent = podFileContent
                .concat(`\n\n# >>> Inserted by react-native-widget-extension\n`)
                .concat(`target '${targetName}' do
            use_frameworks! :linkage => podfile_properties['ios.useFrameworks'].to_sym if podfile_properties['ios.useFrameworks']
            use_frameworks! :linkage => ENV['USE_FRAMEWORKS'].to_sym if ENV['USE_FRAMEWORKS']
          end`)
                .concat(`\n# >>> Inserted by react-native-widget-extension`);
            fs.writeFileSync(podFilePath, podFileContent);
            return config;
        },
    ]);
};
exports.withPodfile = withPodfile;
