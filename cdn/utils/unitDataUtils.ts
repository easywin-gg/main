import fs from 'fs';
import DDragonAPI from '../api/DDragonAPI';
import CDN from '../CDN';

const UNIT_DATA_FILES_FOLDER = `${process.env.APPDATA}/rank1/data/units`;

// TODO: Refactor this
const downloadUnitData = async (units: any[]) => {
    if (!fs.existsSync(UNIT_DATA_FILES_FOLDER)) {
        fs.mkdirSync(UNIT_DATA_FILES_FOLDER);
    }

    await Promise.all(units.map(async (unit) => {
        try {
            const unitPage = await DDragonAPI.getUnitData({ unitName: unit });
            const path = `${UNIT_DATA_FILES_FOLDER}/${unit}.bin.json`;
            fs.writeFileSync(path, JSON.stringify(unitPage), {
                encoding: 'utf-8',
                flag: 'w'
            });
        } catch { }
    }));
}

const transformUnitDataToJson = async () => {
    const files = fs.readdirSync(UNIT_DATA_FILES_FOLDER);

    const unitData: any = [];
    const spellData: any = []
    await Promise.all(files.map(async (file) => {
        const unitPage = JSON.parse(fs.readFileSync(`${UNIT_DATA_FILES_FOLDER}/${file}`, {
            encoding: 'utf-8'
        }));

        const rootKey = Object.keys(unitPage)
            .find((key) => key.endsWith('/Root'))

        if (!rootKey) return;
        const root = unitPage[rootKey];

        const name = root['mCharacterName'] || "";
        if (name?.length < 1) {
            return;
        }

        let missile_speed = 0.0
        let windup = 0.0

        const basicAttackKey = Object.keys(unitPage)
            .find((key) => key.endsWith(`${name}BasicAttack`));

        let basicAttack;
        if (basicAttackKey) {
            basicAttack = unitPage[basicAttackKey];
            const spell = basicAttack['mSpell'];
            if (spell) {
                missile_speed = spell['missileSpeed'] || 0.0;
            }
        }

        if (root['basicAttack']) {
            basicAttack = root['basicAttack'];
            if (basicAttack['mAttackTotalTime'] && basicAttack['mAttackCastTime']) {
                windup = basicAttack['mAttackCastTime'] / basicAttack['mAttackTotalTime']
            } else {
                windup = 0.3 + (basicAttack['mAttackDelayCastOffsetPercent'] || 0.0)
            }
        }

        const tags = [];

        if(root['unitTagsString']?.includes('|')) {
            for (const tag of root['unitTagsString'].split('|')) {
                tags.push(`Unit_${tag.trim().replace('=', '_')}`);
            }
        } else {
            tags.push(`Unit_${root['unitTagsString']}`);
        }

        const unit = {
            name: name.toLowerCase(),
            healthBarHeight: root['healthBarHeight'] || 100,
            baseMoveSpeed: root['baseMoveSpeed'] || 0,
            attackRange: root['attackRange'] || 0,
            attackSpeed: root['attackSpeed'] || 0,
            attackSpeedRatio: root['attackSpeedRatio'] || 0,
            acquisitionRange: root['acquisitionRange'] || 0,
            selectionRadius: root['selectionRadius'] || 0,
            pathingRadius: root['pathfindingCollisionRadius'] || 0,
            gameplayRadius: root['overrideGameplayCollisionRadius'] || 65,
            purchaseIdentities: root['purchaseIdentities'] || [],
            basicAtkMissileSpeed: missile_speed,
            basicAtkWindup: windup,
            tags: tags
        }

        unitData.push(unit);

        for (const value of Object.values(unitPage)) {
            const mSpell = (value as any)['mSpell'];

            if (mSpell) {
                const spell = {
                    name: (value as any)['mScriptName'],
                    "flags": mSpell["mAffectsTypeFlags"] || 0,
                    "delay": mSpell["mCastTime"] || 0.5 + 0.5 * (mSpell["delayCastOffsetPercent" || 0.0]),
                    "castRadius": (mSpell["castRangeDisplayOverride"] || (mSpell['castRange'] || [mSpell['castConeDistance'] || 0.0]))[0],
                    "castRange": (mSpell["castRangeDisplayOverride"] || (mSpell["castRadius"] || [0.0]))[0],
                    "width": mSpell["mLineWidth"] || 0.0,
                    "height": 0.0,
                    "speed": mSpell["missileSpeed"] || 0.0,
                    "travelTime": 0.0,
                    "projectDestination": false
                }

                if (mSpell['mCastRangeGrowthMax']) {
                    spell['castRange'] = mSpell['mCastRangeGrowthMax'][4]
                }

                const missile = mSpell['mMissileSpec'];
                if (missile) {
                    const movcomp = missile["movementComponent"]
                    if (movcomp) {
                        if (spell["speed"] == 0)
                            spell["speed"] = movcomp["mSpeed"] || 0.0

                        spell["height"] = movcomp['mOffsetInitialTargetHeight'] || 100.0
                        spell["projectDestination"] = movcomp['mProjectTargetToCastRange'] || false
                        spell["travelTime"] = movcomp['mTravelTime'] || 0.0
                    }
                }

                spellData.push(spell);
            }
        }
    }));

    fs.writeFileSync(`${CDN.MAIN_FOLDER_PATH}/UnitData.json`, JSON.stringify(unitData), {
        encoding: 'utf-8',
        flag: 'w'
    });

    fs.writeFileSync(`${CDN.MAIN_FOLDER_PATH}/SpellData.json`, JSON.stringify(spellData), {
        encoding: 'utf-8',
        flag: 'w'
    });
}

export { downloadUnitData, transformUnitDataToJson }