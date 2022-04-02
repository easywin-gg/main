const GameClient = {
    GameTime: 0x31023CC,
    ObjectManager: 0x24B9BB0,
    LocalPlayer: 0x310B314,
    UnderMouseObject: 0x30FED10,
    ViewProjMatrices: 0x3135818,
    Renderer: 0x3138718,
}

const GameObject = {
    ObjectNetworkID: 0xCC,
    ObjectName: 0x2BE4,
    ObjectPlayerName: 0x6C,

    ObjectTeam: 0x4C, 
    ObjectLevel: 0x339C,

    ObjectHealth: 0xDB4,
    ObjectMaxHealth: 0xDC4,

    ObjectArmor: 0x12E4,
    ObjectArmorBonus: 0x4,

    ObjectBaseAtk: 0x12BC,
    ObjectBonusAtk: 0x1234,
    ObjectAttackRange: 0x1304,
    ObjectAttackSpeedMultiplier: 0x12B8,

    ObjectPosition: 0x1F4,

    ObjectTargetable: 0xD1C,
    ObjectVisibility: 0x28C,
    ObjectInvulnerable: 0x3EC,
    ObjectRecallState: 0xD98,

    ObjectSpawnCount: 0x2A0,
    ObjectSizeMultiplier: 0x12D4,

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
    ...GameClient,
    ...GameObject,
    ...SpellSlot,
    ...Buff
};