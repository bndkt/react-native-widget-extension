import SwiftUI
import WidgetKit

@main
struct PizzaDeliveryWidgetBundle: WidgetBundle {
    var body: some Widget {
        PizzaDeliveryWidgets()
        
        if #available(iOS 16.1, *) {
            PizzaDeliveryLiveActivity()
        }
    }
}
