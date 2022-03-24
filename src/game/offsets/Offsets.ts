const GameClient = {
    GameTime: 0x310DF84,
    ObjectManager: 0x1879830,
    LocalPlayer: 0x31168D4,
    UnderMouseObject: 0x310A9D8,
    MapCount: 0x2C,
    MapRoot: 0x28,
    MapNodeNetId: 0x10,
    MapNodeObject: 0x14
}

const GameObject = {
    Name: 0x6C,
    Health: 0xDB4,
    MaxHealth: 0xDC4,
}

export default { ...GameClient, ...GameObject };