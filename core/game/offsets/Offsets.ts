const GameClient = {
    ObjectManager: 0x1879830,
    LocalPlayer: 0x31168D4,
    UnderMouseObject: 0x310A9D8,
}

const GameObject = {
    ObjectName: 0x6C,

    ObjectHealth: 0xDB4,
    ObjectMaxHealth: 0xDC4,

    ObjectSpellBook: 0x27e4,
    ObjectSpellBookArray: 0x488,

    MapCount: 0x2C,
    MapRoot: 0x28,
    MapNodeNetId: 0x10,
    MapNodeObject: 0x14
}

const SpellSlot = {
    SpellSlotSize: 0x60,
    SpellSlotLevel: 0x20,
    SpellSlotCooldownExpire: 0x28
}

export default { 
    GameTime: 0x310DF84,
    ...GameClient,
    ...GameObject,
    ...SpellSlot
};