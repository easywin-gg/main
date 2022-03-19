const GameClient = {
    GameTime: 0x310DF84,
    LocalPlayer: 0x31168D4,
}

const GameObject = {
    Health: 0xDB4,
    MaxHealth: 0xDC4
}

export default { ...GameClient, ...GameObject };