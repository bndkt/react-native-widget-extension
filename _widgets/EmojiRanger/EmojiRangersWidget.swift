/*
See the LICENSE.txt file for this sample’s licensing information.

Abstract:
A widget that shows the avatar for a single hero.
*/

import WidgetKit
import SwiftUI

struct SimpleEntry: TimelineEntry {
    public let date: Date
    let relevance: TimelineEntryRelevance?
    let hero: EmojiRanger
}

struct PlaceholderView: View {
    var body: some View {
        EmojiRangerWidgetEntryView(entry: SimpleEntry(date: Date(), relevance: nil, hero: .spouty))
    }
}

extension View {
     func widgetBackground() -> some View {
         if #available(iOSApplicationExtension 17.0, *) {
             return containerBackground(for: .widget) {
                 Color.gameBackgroundColor
             }
         } else {
             return background {
                 Color.gameBackgroundColor
             }
         }
    }
}

struct EmojiRangerWidgetEntryView: View {
    var entry: SimpleEntry
    
    @Environment(\.widgetFamily) var family
    
    @AppStorage("supercharged", store: UserDefaults(suiteName: EmojiRanger.appGroup))
    var supercharged: Bool = EmojiRanger.herosAreSupercharged()
    
    var body: some View {
        switch family {
        case .accessoryCircular:
            ProgressView(timerInterval: entry.hero.injuryDate...entry.hero.fullHealthDate,
                         countsDown: false,
                         label: { Text(entry.hero.name) },
                         currentValueLabel: {
                Avatar(hero: entry.hero, includeBackground: false)
            })
            .progressViewStyle(.circular)
            
        case .accessoryRectangular:
            HStack(alignment: .center, spacing: 0) {
                VStack(alignment: .leading) {
                    Text(entry.hero.name)
                        .font(.headline)
                        .widgetAccentable()
                    Text("Level \(entry.hero.level)")
                    Text(entry.hero.fullHealthDate, style: .timer)
                }.frame(maxWidth: .infinity, alignment: .leading)
                Avatar(hero: entry.hero, includeBackground: false)
            }
            .widgetBackground()
            
        case .accessoryInline:
            ViewThatFits {
                Text("\(entry.hero.name) is healing, ready in \(entry.hero.fullHealthDate, style: .relative)")
                Text("\(entry.hero.name) ready in \(entry.hero.fullHealthDate, style: .relative)")
                Text("\(entry.hero.name) \(entry.hero.fullHealthDate, style: .timer)")
            }
            
        case .systemSmall:
            AvatarView(entry.hero)
                .widgetURL(entry.hero.url)
                .foregroundColor(.white)
                .widgetBackground()
                .widgetURL(entry.hero.url)
            
        case .systemLarge:
            VStack {
                HStack(alignment: .top) {
                    AvatarView(entry.hero)
                        .foregroundColor(.white)
                    Text(entry.hero.bio)
                        .foregroundColor(.white)
                }
                .padding()
#if os(iOS)
                if #available(iOSApplicationExtension 17.0, *) {
                    Button(intent: SuperCharge()) {
                        Text("⚡️")
                            .lineLimit(1)
                    }
                }
#endif
            }
            .widgetBackground()
            .widgetURL(entry.hero.url)
        case .systemMedium:
            HStack(alignment: .top) {
                AvatarView(entry.hero)
                    .foregroundColor(.white)
                Text(entry.hero.bio)
                    .foregroundColor(.white)
            }
            .widgetBackground()
            .widgetURL(entry.hero.url)
        default:
            AvatarView(entry.hero)
        }
        
    }
}

struct EmojiRangerWidget: Widget {
    
    func makeWidgetConfiguration() -> some WidgetConfiguration {
#if os(watchOS)
        return IntentConfiguration(kind: EmojiRanger.EmojiRangerWidgetKind,
                                   intent: EmojiRangerSelectionIntent.self,
                                   provider: SiriKitWatchIntentProvider()) { entry in
            EmojiRangerWidgetEntryView(entry: entry)
        }
                                   .supportedFamilies(supportedFamilies)
#else
        if #available(iOS 17.0, macOS 14.0, *) {
            return AppIntentConfiguration(kind: EmojiRanger.EmojiRangerWidgetKind,
                                          intent: EmojiRangerSelection.self,
                                          provider: AppIntentProvider()) { entry in
                EmojiRangerWidgetEntryView(entry: entry)
            }
                                          .supportedFamilies(supportedFamilies)
        } else {
            return IntentConfiguration(kind: EmojiRanger.EmojiRangerWidgetKind,
                                       intent: EmojiRangerSelectionIntent.self,
                                       provider: SiriKitIntentProvider()) { entry in
                EmojiRangerWidgetEntryView(entry: entry)
            }
                                       .supportedFamilies(supportedFamilies)
        }
#endif
    }
    
    private var supportedFamilies: [WidgetFamily] {
#if os(watchOS)
        [.accessoryCircular,
         .accessoryRectangular, .accessoryInline]
#else
        [.accessoryCircular,
         .accessoryRectangular, .accessoryInline,
         .systemSmall, .systemMedium, .systemLarge]
#endif
    }
    
    public var body: some WidgetConfiguration {
        makeWidgetConfiguration()
            .configurationDisplayName("Ranger Detail")
            .description("See your favorite ranger.")
    }
}

struct Widget_Previews: PreviewProvider {
    static var previews: some View {
        Group {
            EmojiRangerWidgetEntryView(entry: SimpleEntry(date: Date(), relevance: nil, hero: .spouty))
                .previewContext(WidgetPreviewContext(family: .accessoryCircular))
                .previewDisplayName("Circular")
            
            EmojiRangerWidgetEntryView(entry: SimpleEntry(date: Date(), relevance: nil, hero: .spouty))
                .previewContext(WidgetPreviewContext(family: .accessoryRectangular))
                .previewDisplayName("Rectangular")
            EmojiRangerWidgetEntryView(entry: SimpleEntry(date: Date(), relevance: nil, hero: .spouty))
                .previewContext(WidgetPreviewContext(family: .accessoryInline))
                .previewDisplayName("Inline")
            
#if os(iOS)
            
            EmojiRangerWidgetEntryView(entry: SimpleEntry(date: Date(), relevance: nil, hero: .spouty))
                .previewContext(WidgetPreviewContext(family: .systemSmall))
            EmojiRangerWidgetEntryView(entry: SimpleEntry(date: Date(), relevance: nil, hero: .spouty))
                .previewContext(WidgetPreviewContext(family: .systemMedium))
#endif
        }
    }
}
