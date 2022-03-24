const GameClient = {
    GameTime: 0x310DF84,
    ObjectManager: 0x1879830,
    LocalPlayer: 0x31168D4,
    UnderMouseObject: 0x310A9D8
}

const GameObject = {
    Health: 0xDB4,
    MaxHealth: 0xDC4,
    HeroList: 0x1877334,
    PlayerName: 0x6C,
    MapCount: 0x2C,
    MapRoot: 0x28,
    MapNodeNetId: 0x10,
    MapNodeObject: 0x14
}

export default { ...GameClient, ...GameObject };