/*
See the LICENSE.txt file for this sample’s licensing information.

Abstract:
A view that shows a list of heroes sorted by their health level.
*/
import SwiftUI

struct AllCharactersView: View {
    
    let heros: [EmojiRanger]
    
    init(heros: [EmojiRanger]? = EmojiRanger.availableHeros) {
        self.heros = heros ?? EmojiRanger.availableHeros
    }
    
    var body: some View {
        VStack(spacing: 48) {
            ForEach(heros.sorted { $0.healthLevel > $1.healthLevel }, id: \.self) { hero in
                Link(destination: hero.url) {
                    HStack {
                        Avatar(hero: hero)
                        VStack(alignment: .leading) {
                            Text(hero.name)
                                .font(.headline)
                                .foregroundColor(.white)
                            Text("Level \(hero.level)")
                                .foregroundColor(.white)
                            HealthLevelShape(level: hero.healthLevel)
                                .frame(height: 10)
                        }
                    }
                }
            }
        }
    }
}

struct AllCharactersView_Previews: PreviewProvider {
    static var previews: some View {
        AllCharactersView()
    }
}
