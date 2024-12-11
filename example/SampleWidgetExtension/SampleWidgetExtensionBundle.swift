//
//  SampleWidgetExtensionBundle.swift
//  SampleWidgetExtension
//
//  Created by William Shepherd on 5/22/23.
//

import WidgetKit
import SwiftUI

@main
struct SampleWidgetExtensionBundle: WidgetBundle {
    var body: some Widget {
        SampleWidgetExtension()
        SportsLiveActivity()
    }
}
