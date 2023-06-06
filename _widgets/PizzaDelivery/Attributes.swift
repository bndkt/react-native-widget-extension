import Foundation
import ActivityKit

struct Attributes: ActivityAttributes {
    public typealias PizzaDeliveryStatus = ContentState
    
    public struct ContentState: Codable, Hashable {
        var driverName: String
        var deliveryTimer: ClosedRange<Date>
    }
    
    var numberOfPizzas: Int
    var totalAmount: String
    var orderNumber: String
}
