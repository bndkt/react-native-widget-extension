import WidgetKit
import SwiftUI

@main
struct GenericWidgetsBundle: WidgetBundle {
    var body: some Widget {
        GenericWidgets()
        GenericWidgetsLiveActivity()
    }
}
