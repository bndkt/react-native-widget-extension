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

startActivity(Number(numberOfPizzas), "4343", "$32.23", driverName, 47, 43);
```
