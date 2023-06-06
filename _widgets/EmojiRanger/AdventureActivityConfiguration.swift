/*
See the LICENSE.txt file for this sample’s licensing information.

Abstract:
The adventure activity configuration.
*/

import WidgetKit
import SwiftUI

struct AdventureActivityConfiguration: Widget {
    var body: some WidgetConfiguration {
        ActivityConfiguration(for: AdventureAttributes.self) { context in
            AdventureLiveActivityView(
                hero: context.attributes.hero,
                isStale: context.isStale,
                contentState: context.state
            )
            .activityBackgroundTint(Color.liveActivityBackground.opacity(0.25))
        } dynamicIsland: { context in
            DynamicIsland {
                expandedContent(
                    hero: context.attributes.hero,
                    contentState: context.state,
                    isStale: context.isStale
                )
            } compactLeading: {
                Avatar(hero: context.attributes.hero, includeBackground: true)
            } compactTrailing: {
                ProgressView(value: context.state.currentHealthLevel, total: 1) {
                    Text("\(Int(context.state.currentHealthLevel * 100))")
                }
                .progressViewStyle(.circular)
                .tint(context.state.currentHealthLevel <= 0.2 ? Color.red : Color.green)
            } minimal: {
                ProgressView(value: context.state.currentHealthLevel, total: 1) {
                    Avatar(hero: context.attributes.hero, includeBackground: false)
                }
                .progressViewStyle(.circular)
                .tint(context.state.currentHealthLevel <= 0.2 ? Color.red : Color.green)
            }
            
        }
    }
    
    @DynamicIslandExpandedContentBuilder
    private func expandedContent(hero: EmojiRanger,
                                 contentState: AdventureAttributes.ContentState,
                                 isStale: Bool) -> DynamicIslandExpandedContent<some View> {
        DynamicIslandExpandedRegion(.leading) {
            LiveActivityAvatarView(hero: hero)
        }
        
        DynamicIslandExpandedRegion(.trailing) {
            StatsView(
                hero: hero,
                isStale: isStale
            )
        }
        
        DynamicIslandExpandedRegion(.bottom) {
            
            HealthBar(currentHealthLevel: contentState.currentHealthLevel)
            
            EventDescriptionView(
                hero: hero,
                contentState: contentState
            )
        }
    }
}
