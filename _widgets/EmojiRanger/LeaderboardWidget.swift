/*
See the LICENSE.txt file for this sample’s licensing information.

Abstract:
A widget that shows a leaderboard of all available heroes.
*/

import WidgetKit
import SwiftUI

struct LeaderboardProvider: TimelineProvider {
    
    public typealias Entry = LeaderboardEntry
    
    func placeholder(in context: Context) -> LeaderboardEntry {
        return LeaderboardEntry(date: Date(), heros: EmojiRanger.availableHeros)
    }
    
    func getSnapshot(in context: Context, completion: @escaping (LeaderboardEntry) -> Void) {
        let entry = LeaderboardEntry(date: Date(), heros: EmojiRanger.availableHeros)
        completion(entry)
    }
    
    func getTimeline(in context: Context, completion: @escaping (Timeline<LeaderboardEntry>) -> Void) {
        EmojiRanger.loadLeaderboardData { (heros, error) in
            guard let heros = heros else {
                let timeline = Timeline(entries: [LeaderboardEntry(date: Date(), heros: EmojiRanger.availableHeros)], policy: .atEnd)
                
                completion(timeline)
                
                return
            }
            let timeline = Timeline(entries: [LeaderboardEntry(date: Date(), heros: heros)], policy: .atEnd)
            completion(timeline)
        }
    }
}

struct LeaderboardEntry: TimelineEntry {
    public let date: Date
    var heros: [EmojiRanger]?
}

struct LeaderboardPlaceholderView: View {
    var body: some View {
        LeaderboardWidgetEntryView(entry: LeaderboardEntry(date: Date(), heros: nil))
    }
}

struct LeaderboardWidgetEntryView: View {
    var entry: LeaderboardProvider.Entry
    
    var body: some View {
        AllCharactersView(heros: entry.heros)
            .padding()
            .widgetBackground()
    }
}

struct LeaderboardWidget: Widget {
    
    private static var supportedFamilies: [WidgetFamily] {
#if os(iOS)
        if #available(iOS 15, *) {
            return [.systemLarge, .systemExtraLarge]
        } else {
            return [.systemLarge]
        }
#else
        return []
#endif
    }
    
    public var body: some WidgetConfiguration {
        StaticConfiguration(kind: EmojiRanger.LeaderboardWidgetKind, provider: LeaderboardProvider()) { entry in
            LeaderboardWidgetEntryView(entry: entry)
        }
        .configurationDisplayName("Ranger Leaderboard")
        .description("See all the rangers.")
        .supportedFamilies(LeaderboardWidget.supportedFamilies)
    }
}

struct LeaderboardWidget_Previews: PreviewProvider {
    static var previews: some View {
        Group {
#if os(iOS)
            LeaderboardWidgetEntryView(entry: LeaderboardEntry(date: Date(), heros: nil))
                .previewContext(WidgetPreviewContext(family: .systemLarge))
#endif
        }
    }
}
