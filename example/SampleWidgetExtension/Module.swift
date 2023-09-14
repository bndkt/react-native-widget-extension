import ExpoModulesCore
import ActivityKit

internal class MissingCurrentWindowSceneException: Exception {
    override var reason: String {
        "Cannot determine the current window scene in which to present the modal for requesting a review."
    }
}

public class ReactNativeWidgetExtensionModule: Module {
    public func definition() -> ModuleDefinition {
        Name("ReactNativeWidgetExtension")
        
        Function("areActivitiesEnabled") { () -> Bool in
            let logger = Logger()
            logger.info("areActivitiesEnabled()")
            
            if #available(iOS 16.2, *) {
                return ActivityAuthorizationInfo().areActivitiesEnabled
            } else {
                return false
            }
        }
        
        Function("startActivity") { (quarter: Int, scoreLeft: Int, scoreRight: Int, bottomText: String) -> Void in
            let logger = Logger()
            logger.info("startActivity()")
            
            if #available(iOS 16.2, *) {
                let future = Calendar.current.date(byAdding: .minute, value: (Int(15) ), to: Date())!
                let attributes = SportsLiveActivityAttributes(timer: Date.now...future, imageLeft: "Knights", teamNameLeft: "Knights", imageRight: "Pirates", teamNameRight: "Pirates", gameName: "Western Conference Round 1")
                let contentState = SportsLiveActivityAttributes.ContentState(quarter: quarter, scoreLeft: scoreLeft, scoreRight: scoreRight, bottomText: bottomText)
                
                let activityContent = ActivityContent(state: contentState, staleDate: Calendar.current.date(byAdding: .minute, value: 30, to: Date())!)
                
                do {
                    let activity = try Activity.request(attributes: attributes, content: activityContent)
                    logger.info("Requested a Live Activity \(String(describing: activity.id)).")
                } catch (let error) {
                    logger.info("Error requesting Live Activity \(error.localizedDescription).")
                }
            }
        }

        Function("updateActivity") { (quarter: Int, scoreLeft: Int, scoreRight: Int, bottomText: String) -> Void in
            let logger = Logger()
            logger.info("updateActivity()")
            
            if #available(iOS 16.2, *) {
                let future = Calendar.current.date(byAdding: .minute, value: (Int(15) ), to: Date())!
                let contentState = SportsLiveActivityAttributes.ContentState(quarter: quarter, scoreLeft: scoreLeft, scoreRight: scoreRight, bottomText: bottomText)
                let alertConfiguration = AlertConfiguration(title: "Score update", body: "This is the alert text", sound: .default)
                let updatedContent = ActivityContent(state: contentState, staleDate: nil)
                
                Task {
                    for activity in Activity<SportsLiveActivityAttributes>.activities {
                        await activity.update(updatedContent, alertConfiguration: alertConfiguration)
                        logger.info("Updated the Live Activity: \(activity.id)")
                    }
                }
            }
        }
        
        Function("endActivity") { (quarter: Int, scoreLeft: Int, scoreRight: Int, bottomText: String) -> Void in
            let logger = Logger()
            logger.info("endActivity()")
            
            if #available(iOS 16.2, *) {
                let contentState = SportsLiveActivityAttributes.ContentState(quarter: quarter, scoreLeft: scoreLeft, scoreRight: scoreRight, bottomText: bottomText)
                let finalContent = ActivityContent(state: contentState, staleDate: nil)
                
                Task {
                    for activity in Activity<SportsLiveActivityAttributes>.activities {
                        await activity.end(finalContent, dismissalPolicy: .default)
                        logger.info("Ending the Live Activity: \(activity.id)")
                    }
                }
            }
        }
    }
}