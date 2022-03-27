const GameClient = {
    ObjectManager: 0x1879830,
    LocalPlayer: 0x31168D4,
    UnderMouseObject: 0x310A9D8,
    Renderer: 0x3143DE0,
    ViewProjMatrices: 0x3140F40, 
    ViewMatrix: 0x3143E38,
    ProjMatrix: 0x3143E78,
    oRendererWidth: 0x0,
    oRendererHeight: 0x4
}

const GameObject = {
    ObjectName: 0x2BE4,
    ObjectPlayerName: 0x6C,

    ObjectHealth: 0xDB4,
    ObjectMaxHealth: 0xDC4,

    ObjectPosition: 0x1F4, 
    ObjectPositionY: 0x4,
    ObjectPositionZ: 0x8,

    ObjectSpellBook: 0x27e4,
    ObjectSpellBookArray: 0x488,

    ObjectBuffManager: 0x21B8,
    ObjectBuffManagerEntriesStart: 0x10,
    ObjectBuffManagerEntriesEnd: 0x14,

    MapCount: 0x2C,
    MapRoot: 0x28,
    MapNodeNetId: 0x10,
    MapNodeObject: 0x14
}

const Buff = {
    BuffSize: 0x78,
    BuffInfo: 0x8,
    BuffCount: 0x74,
    BuffEndTime: 0x10,
    BuffInfoName: 0x8,
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
    ...SpellSlot,
    ...Buff
};