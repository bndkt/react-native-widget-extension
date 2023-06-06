import ExpoModulesCore
import ActivityKit

internal class MissingCurrentWindowSceneException: Exception {
    override var reason: String {
        "Cannot determine the current window scene in which to present the modal for requesting a review."
    }
}

public class ReactNativeWidgetExtensionModule: Module {
    // Each module class must implement the definition function. The definition consists of components
    // that describes the module's functionality and behavior.
    // See https://docs.expo.dev/modules/module-api for more details about available components.
    public func definition() -> ModuleDefinition {
        // Sets the name of the module that JavaScript code will use to refer to the module. Takes a string as an argument.
        // Can be inferred from module's class name, but it's recommended to set it explicitly for clarity.
        // The module will be accessible from `requireNativeModule('ReactNativeAppClip')` in JavaScript.
        Name("ReactNativeWidgetExtension")
        
        // Defines event names that the module can send to JavaScript.
        Events("onChange")
        
        Function("areActivitiesEnabled") { () -> Bool in
            let logger = Logger()
            logger.info("areActivitiesEnabled()")
            
            if #available(iOS 16.2, *) {
                return ActivityAuthorizationInfo().areActivitiesEnabled
            } else {
                return false
            }
        }
        
        Function("startActivity") { (numberOfPizzas: Int, totalAmount: String, orderNumber: String, driverName: String, minutes: Int, seconds: Int) -> Void in
            let logger = Logger()
            logger.info("startActivity()")
            
            if #available(iOS 16.2, *) {
                var future = Calendar.current.date(byAdding: .minute, value: (Int(minutes) ?? 0), to: Date())!
                future = Calendar.current.date(byAdding: .second, value: (Int(seconds) ?? 0), to: future)!
                let date = Date.now...future
                let initialContentState = Attributes.ContentState(driverName: driverName, deliveryTimer: date)
                let activityAttributes = Attributes(numberOfPizzas: numberOfPizzas, totalAmount: totalAmount, orderNumber: orderNumber)
                
                let activityContent = ActivityContent(state: initialContentState, staleDate: Calendar.current.date(byAdding: .minute, value: 30, to: Date())!)
                
                do {
                    let deliveryActivity = try Activity.request(attributes: activityAttributes, content: activityContent)
                    logger.info("Requested a pizza delivery Live Activity \(String(describing: deliveryActivity.id)).")
                } catch (let error) {
                    logger.info("Error requesting pizza delivery Live Activity \(error.localizedDescription).")
                }
            }
        }
        
        Function("updateActivity") { (driverName: String, minutes: Int, seconds: Int) -> Void in
            let logger = Logger()
            logger.info("updateActivity()")
            
            if #available(iOS 16.2, *) {
                var future = Calendar.current.date(byAdding: .minute, value: (Int(minutes) ?? 0), to: Date())!
                future = Calendar.current.date(byAdding: .second, value: (Int(seconds) ?? 0), to: future)!
                let date = Date.now...future
                let updatedDeliveryStatus = Attributes.PizzaDeliveryStatus(driverName: driverName, deliveryTimer: date)
                let alertConfiguration = AlertConfiguration(title: "Delivery update", body: "Your pizza order will arrive soon.", sound: .default)
                let updatedContent = ActivityContent(state: updatedDeliveryStatus, staleDate: nil)
                
                Task {
                    for activity in Activity<Attributes>.activities {
                        await activity.update(updatedContent, alertConfiguration: alertConfiguration)
                        logger.info("Updated the Live Activity: \(activity.id)")
                    }
                }
            }
        }
        
        Function("endActivity") { (driverName: String) -> Void in
            let logger = Logger()
            logger.info("endActivity()")
            
            if #available(iOS 16.2, *) {
                let finalDeliveryStatus = Attributes.PizzaDeliveryStatus(driverName: driverName, deliveryTimer: Date.now...Date())
                let finalContent = ActivityContent(state: finalDeliveryStatus, staleDate: nil)
                
                Task {
                    for activity in Activity<Attributes>.activities {
                        await activity.end(finalContent, dismissalPolicy: .default)
                        logger.info("Ending the Live Activity: \(activity.id)")
                    }
                }
            }
        }
    }
}
