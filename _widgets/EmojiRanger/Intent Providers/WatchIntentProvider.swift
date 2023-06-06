/*
See the LICENSE.txt file for this sample’s licensing information.

Abstract:
The Watch Intent Provider.
*/

import SwiftUI
import WidgetKit

#if os(watchOS)
struct SiriKitWatchIntentProvider: IntentTimelineProvider {
    
    typealias Intent = EmojiRangerSelectionIntent
    
    public typealias Entry = SimpleEntry
    
    func recommendations() -> [IntentRecommendation<EmojiRangerSelectionIntent>] {
        return recommendedIntents()
            .map { intent in
                return IntentRecommendation(intent: intent, description: intent.heroName ?? "Spouty")
            }
    }
    
    func placeholder(in context: Context) -> SimpleEntry {
        SimpleEntry(date: Date(), relevance: nil, hero: .spouty)
    }
    
    func getSnapshot(for configuration: EmojiRangerSelectionIntent, in context: Context, completion: @escaping (SimpleEntry) -> Void) {
        let entry = SimpleEntry(date: Date(), relevance: nil, hero: .spouty)
        completion(entry)
    }
    
    func getTimeline(for configuration: EmojiRangerSelectionIntent, in context: Context, completion: @escaping (Timeline<SimpleEntry>) -> Void) {
        let selectedCharacter = hero(for: configuration)
        let endDate = selectedCharacter.fullHealthDate
        let oneMinute: TimeInterval = 60
        var currentDate = Date()
        var entries: [SimpleEntry] = []
        
        while currentDate < endDate {
            let relevance = TimelineEntryRelevance(score: Float(selectedCharacter.healthLevel))
            let entry = SimpleEntry(date: currentDate, relevance: relevance, hero: selectedCharacter)
            
            currentDate += oneMinute
            entries.append(entry)
        }
        
        let timeline = Timeline(entries: entries, policy: .atEnd)
        
        completion(timeline)
    }
    
    func hero(for configuration: EmojiRangerSelectionIntent) -> EmojiRanger {
        if let name = configuration.heroName {
            // Save the most recently selected hero to the app group.
            EmojiRanger.setLastSelectedHero(heroName: name)
            return EmojiRanger.heroFromName(name: name)
        }
        return .spouty
    }
    
    private func recommendedIntents() -> [EmojiRangerSelectionIntent] {
        return EmojiRanger.availableHeros
            .map { hero in
                let intent = EmojiRangerSelectionIntent()
                intent.heroName = hero.name
                return intent
            }
    }
}

#endif
