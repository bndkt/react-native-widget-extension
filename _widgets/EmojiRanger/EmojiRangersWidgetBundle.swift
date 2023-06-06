/*
See the LICENSE.txt file for this sample’s licensing information.

Abstract:
The widget bundle.
*/

import WidgetKit
import SwiftUI

@main
struct EmojiRangersWidgetBundle: WidgetBundle {
    var body: some Widget {
        EmojiRangerWidget()
        LeaderboardWidget()
#if canImport(ActivityKit)
        AdventureActivityConfiguration()
#endif
    }
}

