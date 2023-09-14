import ActivityKit
import WidgetKit
import SwiftUI

struct SportsLiveActivityAttributes: ActivityAttributes {
    public struct ContentState: Codable, Hashable {
        var quarter: Int
        var scoreLeft: Int
        var scoreRight: Int
        var bottomText: String
    }
    
    var timer: ClosedRange<Date>
    var imageLeft: String // Knight
    var teamNameLeft: String // Kinghts
    var imageRight: String // Pirates
    var teamNameRight: String // Pirates
    var gameName: String // "Western Conference Round 1"
}
