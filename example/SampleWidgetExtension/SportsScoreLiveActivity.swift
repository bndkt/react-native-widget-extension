//
//  OneSignalWidgetLiveActivity.swift
//  OneSignalWidget
//
//  Created by Henry Boswell on 12/5/22.
//

import ActivityKit
import WidgetKit
import SwiftUI

struct SportsLiveActivity: Widget {
    var body: some WidgetConfiguration {
        ActivityConfiguration(for: SportsLiveActivityAttributes.self) { context in
            VStack(alignment: .center) {
                HStack {
                    HStack {
                        VStack(alignment: .center) {
                            Image(context.attributes.imageLeft)
                                .resizable()
                                .aspectRatio(contentMode: .fill)
                                .frame(width: 35, height: 35)
                            Text(context.attributes.teamNameLeft).font(.system(size: 12, weight: .regular)).foregroundColor(.black)
                        }
                        //100
                        Text(String(context.state.scoreLeft)).font(.system(size: 24, weight: .regular)).padding(.leading, 24).foregroundColor(.black)
                    }.padding(.leading, 10)
                    Spacer()
                    VStack(alignment: .center) {
                        HStack {
                            Circle()
                                .fill(.red)
                                .frame(width: 7, height: 7)
                            Text("Q" + String(context.state.quarter)).font(.system(size: 14, weight: .bold))
                        }
                        Text(timerInterval: context.attributes.timer, countsDown: true)
                                            .multilineTextAlignment(.center)
                                            .frame(width: 40)
                                            .font(.caption2).foregroundColor(.black)
                    }
                    Spacer()
                    HStack {
                        Text(String(context.state.scoreRight)).font(.system(size: 24, weight: .regular)).padding(.trailing, 24).foregroundColor(.black)
                        VStack(alignment: .center) {
                            Image(context.attributes.imageRight)
                                .resizable()
                                .aspectRatio(contentMode: .fill)
                                .frame(width: 35, height: 35)
                            Text(context.attributes.teamNameRight).font(.system(size: 12, weight: .regular)).foregroundColor(.black)
                        }.padding(.trailing, 10)
                    }
                   
                }.padding(5)
                HStack {
                    Image("league")
                        .resizable()
                        .aspectRatio(contentMode: .fill)
                        .frame(width: 35, height: 35).padding(.leading, 10).padding(.top, 10).padding(.bottom, 10)
                    VStack(alignment: .leading) {
                        Text(context.attributes.gameName).font(.system(size: 14, weight: .bold)).foregroundColor(.black)
                        Text(context.state.bottomText).font(.system(size: 12, weight: .regular)).foregroundColor(.black)
                    }
                    Spacer()
                    Capsule().fill(.red)
                        .frame(width: 2, height: 30).padding(.trailing, 10)
                  
                }.padding(5).background(Color.init(red: 0.898, green: 0.91, blue: 0.922), in: Rectangle())
            }.padding(.top,15).activityBackgroundTint(.white).activitySystemActionForegroundColor(.black)
        } dynamicIsland: { context in
            DynamicIsland {
                // Expanded UI goes here.  Compose the expanded UI through
                // various regions, like leading/trailing/center/bottom
                DynamicIslandExpandedRegion(.leading) {
                    Text("Leading")
                }
                DynamicIslandExpandedRegion(.trailing) {
                    Text("Trailing")
                }
                DynamicIslandExpandedRegion(.bottom) {
                    Text("Bottom")
                    // more content
                }
            } compactLeading: {
                Text("L")
            } compactTrailing: {
                Text("T")
            } minimal: {
                Text("Min")
            }
            .widgetURL(URL(string: "http://www.apple.com"))
            .keylineTint(Color.red)
        }
    }
}

struct SportsLiveActivityPreviews: PreviewProvider {
    static let future = Calendar.current.date(byAdding: .minute, value: (Int(15) ), to: Date())!
    static let attributes = SportsLiveActivityAttributes(timer: Date.now...future, imageLeft: "Knights", teamNameLeft: "Knights", imageRight: "Pirates", teamNameRight: "Pirates", gameName: "Western Conference Round 1")
    static let contentState = SportsLiveActivityAttributes.ContentState(quarter: 1, scoreLeft: 0, scoreRight: 0, bottomText: "The game has started!")

    static var previews: some View {
        attributes
            .previewContext(contentState, viewKind: .dynamicIsland(.compact))
            .previewDisplayName("Island Compact")
        attributes
            .previewContext(contentState, viewKind: .dynamicIsland(.expanded))
            .previewDisplayName("Island Expanded")
        attributes
            .previewContext(contentState, viewKind: .dynamicIsland(.minimal))
            .previewDisplayName("Minimal")
    }
}

