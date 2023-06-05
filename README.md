# react-native-widget-extension

Expo config plugin to add widgets and live activities to a React Native app

The widgets still need to be written in Swift (I think there's no way around that). But you can simply add a folder with Swift files to a React Native project (see folder \_widgets in this repository for examples) and then add the plugin via:

```sh
npx expo install react-native-widget-extension
```

And add the following config to app.json (where widgetsFolder is the path to the folder with the Swift files):

```json
"expo": {
    "name": "my-app",
    "plugins": [
        [
            "react-native-widget-extension",
            { "frequentUpdates": true, "widgetsFolder": "PizzaDeliveryWidgets" },
        ],
    ]
}
```

Then in React land, you can use the following:

```typescript
import {
  areActivitiesEnabled,
  startActivity,
  updateActivity,
  endActivity,
} from "react-native-widget-extension";

startActivity(3, "4343", "$32.23", driverName, 47, 43);
```

## Deployment Target

By default, this module adds a minimum deployment target of iOS 16.2, because otherwise Swift compilation fails if you try to use Live Activities. If you want to support earliert versions of iOS, you can manually set the deployment target via plugin config:

```json
"expo": {
    "name": "my-app",
    "plugins": [
        [
            "react-native-widget-extension",
            { "deploymentTarget": "14.0" },
        ],
    ]
}
```

If you do this and you still use Live Activities in Swift, you have to make sure to guard the code that can only run on iOS 16.2 and later like this:

```swift
import SwiftUI
import WidgetKit

@main
struct PizzaDeliveryWidgetBundle: WidgetBundle {
    var body: some Widget {
        PizzaDeliveryWidgets()

        if #available(iOS 16.2, *) {
            PizzaDeliveryLiveActivity()
        }
    }
}
```

and

```swift
@available(iOS 16.2, *)
struct LockScreenLiveActivityView: View {
    ...
}
```
