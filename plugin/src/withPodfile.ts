import { mergeContents } from "@expo/config-plugins/build/utils/generateCode";
import { ConfigPlugin, withDangerousMod } from "expo/config-plugins";
import * as fs from "fs";
import * as path from "path";

export const withPodfile: ConfigPlugin<{ targetName: string }> = (
  config,
  { targetName }
) => {
  return withDangerousMod(config, [
    "ios",
    (config) => {
      const podFilePath = path.join(
        config.modRequest.platformProjectRoot,
        "Podfile"
      );
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

      podFileContent = mergeContents({
        tag: "react-native-widget-extension-1",
        src: podFileContent,
        newSrc: `installer.pods_project.targets.each do |target|
          target.build_configurations.each do |config|
            config.build_settings['APPLICATION_EXTENSION_API_ONLY'] = 'No'
          end
        end`,
        anchor:
          /installer.target_installation_results.pod_target_installation_results/,
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
        .concat(
          `target '${targetName}' do
            use_frameworks! :linkage => podfile_properties['ios.useFrameworks'].to_sym if podfile_properties['ios.useFrameworks']
            use_frameworks! :linkage => ENV['USE_FRAMEWORKS'].to_sym if ENV['USE_FRAMEWORKS']
          end`
        )
        .concat(`\n# >>> Inserted by react-native-widget-extension`);

      fs.writeFileSync(podFilePath, podFileContent);

      return config;
    },
  ]);
};
