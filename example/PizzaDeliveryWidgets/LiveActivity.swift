import ActivityKit
import WidgetKit
import SwiftUI

/* struct PizzaDeliveryAttributes: ActivityAttributes {
    public typealias PizzaDeliveryStatus = ContentState
    
    public struct ContentState: Codable, Hashable {
        var driverName: String
        var deliveryTimer: ClosedRange<Date>
    }
    
    var numberOfPizzas: Int
    var totalAmount: String
    var orderNumber: String
} */

struct PizzaDeliveryLiveActivity: Widget {
    var body: some WidgetConfiguration {
        ActivityConfiguration(for: PizzaDeliveryAttributes.self) { context in
            LockScreenLiveActivityView(context: context)
        } dynamicIsland: { context in
            DynamicIsland {
                DynamicIslandExpandedRegion(.leading) {
                    Label("\(context.attributes.numberOfPizzas) Pizzas", systemImage: "bag")
                    // .foregroundColor(.indigo)
                        .font(.caption)
                }
                
                DynamicIslandExpandedRegion(.trailing) {
                    Label {
                        Text(timerInterval: context.state.deliveryTimer, countsDown: true)
                            .monospacedDigit()
                            .frame(maxWidth: .infinity, alignment: .center)
                    } icon: {
                        Image(systemName: "timer")
                        // .foregroundColor(.red)
                    }
                    .font(.caption)
                }
                
                DynamicIslandExpandedRegion(.center) {
                    Text("\(context.state.driverName) is on their way!")
                        .lineLimit(1)
                        .font(.caption)
                }
                
                DynamicIslandExpandedRegion(.bottom) {
                    Button {
                        // Deep link into your app.
                    } label: {
                        Label("Call driver", systemImage: "phone")
                    }
                    .foregroundColor(.green)
                }
            } compactLeading: {
                Label {
                    Text("\(context.attributes.numberOfPizzas) Pizzas")
                } icon: {
                    Image(systemName: "bag")
                    // .foregroundColor(.indigo)
                }
                // .font(.caption2)
            } compactTrailing: {
                Text(timerInterval: context.state.deliveryTimer, countsDown: true)
                    .monospacedDigit()
                // .multilineTextAlignment(.center)
                // .frame(width: 40)
                    .font(.caption)
            } minimal: {
                VStack(alignment: .center) {
                    Image(systemName: "timer")
                    Text(timerInterval: context.state.deliveryTimer, countsDown: true)
                    // .multilineTextAlignment(.center)
                        .monospacedDigit()
                        .font(.caption)
                }
            }
            .keylineTint(.cyan)
        }
    }
}

struct LockScreenLiveActivityView: View {
    let context: ActivityViewContext<PizzaDeliveryAttributes>
    
    var body: some View {
        VStack {
            Spacer()
            Text("\(context.state.driverName) is on their way with your pizza!")
            Spacer()
            HStack {
                Spacer()
                Label {
                    Text("\(context.attributes.numberOfPizzas) Pizzas")
                } icon: {
                    Image(systemName: "bag")
                        .foregroundColor(.indigo)
                }
                .font(.title2)
                Spacer()
                Label {
                    Text(timerInterval: context.state.deliveryTimer, countsDown: true)
                        .multilineTextAlignment(.center)
                        .frame(width: 75)
                        .monospacedDigit()
                } icon: {
                    Image(systemName: "timer")
                        .foregroundColor(.indigo)
                }
                .font(.title2)
                Spacer()
            }
            Spacer()
        }
        .activitySystemActionForegroundColor(.cyan)
        .activityBackgroundTint(.cyan)
    }
}
