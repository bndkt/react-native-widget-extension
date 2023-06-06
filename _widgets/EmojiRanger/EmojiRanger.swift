/*
See the LICENSE.txt file for this sample’s licensing information.

Abstract:
Details about a hero, including a name, health level, avatar, and other properties.
*/

import AppIntents
import WidgetKit

struct EmojiRanger: Hashable, Codable, Identifiable {
    
    static var typeDisplayRepresentation: TypeDisplayRepresentation = "EmojiRanger"
    
    static let LeaderboardWidgetKind: String = "LeaderboardWidget"
    static let EmojiRangerWidgetKind: String = "EmojiRangerWidget"
    
    var displayRepresentation: DisplayRepresentation {
        DisplayRepresentation(title: "\(avatar) \(name)")
    }
    
    let name: String
    let avatar: String
    let healthLevel: Double
    let heroType: String
    let healthRecoveryRatePerHour: Double
    let url: URL
    let battleCode: URL
    let level: Int
    let exp: Int
    let bio: String
    
    var id: String {
        name
    }
    
    static let panda = EmojiRanger(
        name: "Power Panda",
        avatar: "🐼",
        healthLevel: 0.14,
        heroType: "Forest Dweller",
        healthRecoveryRatePerHour: 0.25,
        url: URL(string: "game:///panda")!,
        battleCode: URL(string: "game:///panda/battle")!,
        level: 3,
        exp: 600,
        bio: "Power Panda loves eating bamboo shoots and leaves.")
    
    static let egghead = EmojiRanger(
        name: "Egghead",
        avatar: "🦄",
        healthLevel: 0.67,
        heroType: "Free Ranger",
        healthRecoveryRatePerHour: 0.22,
        url: URL(string: "game:///egghead")!,
        battleCode: URL(string: "game:///egghead/battle")!,
        level: 5,
        exp: 1000,
        bio: "Egghead comes from the magical land of Eggopolis and flies through the air with their magnificent mane billowing.")
    
    static let spouty = EmojiRanger(
        name: "Spouty",
        avatar: "🐳",
        healthLevel: 0.99,
        heroType: "Deep Sea Goer",
        healthRecoveryRatePerHour: 0.59,
        url: URL(string: "game:///spouty")!,
        battleCode: URL(string: "game:///spouty/battle")!,
        level: 50,
        exp: 20_000,
        bio: "Spouty rises from the depths to bring joy and laughter to everyone. They are best friends with Octo.")
    
    static let availableHeros = [panda, egghead, spouty]
    
    func hash(into hasher: inout Hasher) {
        hasher.combine(name)
    }
    
    var fullHealthDate: Date {
        let healthNeeded = min(1 - healthLevel, 1)
        let hoursUntilFullHealth = healthNeeded / healthRecoveryRatePerHour
        let minutesUntilFullHealth = (hoursUntilFullHealth * 60)
        let date = Calendar.current.date(byAdding: .minute, value: Int(minutesUntilFullHealth), to: Date())
        
        return date ?? Date()
    }
    
    var injuryDate: Date {
        let totalInjurySeconds = 3600 / healthRecoveryRatePerHour
        let injuryDate = fullHealthDate.advanced(by: -totalInjurySeconds)
        return injuryDate
    }
    
    static func heroFromName(name: String?) -> EmojiRanger {
        guard let hero = (allHeros).first(where: { (hero) -> Bool in
            return hero.name == name
        }) else {
            return .panda
        }
        return hero
    }
    
    static func heroFromURL(url: URL) -> EmojiRanger? {
        guard let hero = (allHeros).first(where: { (hero) -> Bool in
            return hero.url == url
        }) else {
            return .panda
        }
        return hero
    }
    
    static let session = ImageURLProtocol.urlSession()
    
    static func loadLeaderboardData(completion:@escaping ([EmojiRanger]?, Error?) -> Void) {
        // Save a faux API to the temporary directory and fetch it.
        // In your app, you fetch it from a real API.
        do {
            let responseURL = FileManager.default.temporaryDirectory.appendingPathComponent("userData.json")
            
            try fauxResponse.data(using: .utf8)?.write(to: responseURL)
            session.dataTask(with: responseURL) { (data, response, error) in
                if let playerData = data {
                    do {
                        let hero = try JSONDecoder().decode([EmojiRanger].self, from: playerData)
                            .sorted { $0.healthLevel > $1.healthLevel }
                        completion(hero, error)
                    } catch {
                        completion(nil, error)
                    }
                } else {
                    completion(nil, error)
                }
            }.resume()
        } catch {
            completion(nil, error)
        }
        
    }
    
    static let appGroup = "<App Group Here>"
    
    static func setLastSelectedHero(heroName: String) {
        UserDefaults(suiteName: appGroup)?.setValue(heroName, forKey: "hero")
    }
    
    static func getLastSelectedHero() -> EmojiRanger? {
        guard let name = UserDefaults(suiteName: appGroup)?.value(forKey: "hero") as? String else {
            return nil
        }
        return EmojiRanger.heroFromName(name: name)
    }
    
    static func superchargeHeros() {
        var val = herosAreSupercharged()
        val.toggle()
        UserDefaults(suiteName: appGroup)?.setValue(val, forKey: "supercharged")
    }
    
    static func herosAreSupercharged() -> Bool {
        guard let areCharged = UserDefaults(suiteName: appGroup)?.value(forKey: "supercharged") as? Bool else {
            return false
        }
        return areCharged
    }
}

let fauxResponse =
"""
[
    {
        "name": "Power Panda",
        "avatar": "🐼",
        "healthLevel": 0.99,
        "heroType": "Forest Dweller",
        "healthRecoveryRatePerHour": 0.25
    },
    {
        "name": "Egghead",
        "avatar": "🦄",
        "healthLevel": 0.84,
        "heroType": "Free Ranger",
        "healthRecoveryRatePerHour": 0.22
    },
    {
        "name": "Spouty",
        "avatar": "🐳",
        "healthLevel": 0.72,
        "heroType": "Deep Sea Goer",
        "healthRecoveryRatePerHour": 0.29
    }
]
"""

extension EmojiRanger {
    static let spook = EmojiRanger(
        name: "Mr. Spook",
        avatar: "💀",
        healthLevel: 0.14,
        heroType: "Calcium Lover",
        healthRecoveryRatePerHour: 0.25,
        url: URL(string: "game:///spook")!,
        battleCode: URL(string: "game:///spook/battle")!,
        level: 13,
        exp: 2640,
        bio: "Loves dancing, spooking, and playing their trumpet 🎺.")
    
    static let cake = EmojiRanger(
        name: "Cake",
        avatar: "🎂",
        healthLevel: 0.67,
        heroType: "Literally Cake",
        healthRecoveryRatePerHour: 0.22,
        url: URL(string: "game:///cake")!,
        battleCode: URL(string: "game:///cake/battle")!,
        level: 15,
        exp: 3121,
        bio: """
        • 1 cake mix
        • 2 tbsp butter
        • 4 large eggs
        • 1 cup semi-sweet chocolate chips
        """)
    
    static let octo = EmojiRanger(
        name: "Octo",
        avatar: "🐙",
        healthLevel: 0.83,
        heroType: "Etymology Aficionado",
        healthRecoveryRatePerHour: 0.29,
        url: URL(string: "game:///octo")!,
        battleCode: URL(string: "game:///octo/battle")!,
        level: 43,
        exp: 86_463,
        bio: "Can give eight hugs simultaneously. They are best friends with Spouty.")
    
    static let additionalHeros = [spook, cake, octo]
    
    static let allHeros = EmojiRanger.availableHeros + EmojiRanger.additionalHeros
}

extension DateFormatter {
    static let emojiFormatter: DateFormatter = {
        let formatter = DateFormatter()
        formatter.dateStyle = .short
        formatter.timeStyle = .medium
        return formatter
    }()
}
