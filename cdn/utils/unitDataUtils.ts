import fs from 'fs';
import DDragonAPI from '../api/DDragonAPI';
import CDN from '../app/CDN';

const downloadUnitData = async (units: any[]) => {
    if (!fs.existsSync(`${CDN.MAIN_FOLDER_PATH}/unitData`)) {
        fs.mkdirSync(`${CDN.MAIN_FOLDER_PATH}/unitData`);
    }

    await Promise.all(units.map(async (unit) => {
        try {
            const unitPage = await DDragonAPI.getUnitData({ unitName: unit });
            const path = `${CDN.MAIN_FOLDER_PATH}/unitData/${unit}.bin.json`;
            fs.writeFileSync(path, JSON.stringify(unitPage), {
                encoding: 'utf-8',
                flag: 'w'
            });
        } catch (error: any) {
            if (!error?.response) {
                console.log(error)
                return;
            }
        }
    }));
}

const transformUnitDataToJson = async () => {
    const files = fs.readdirSync(`${CDN.MAIN_FOLDER_PATH}/unitData`);
    const unitData: any = [];
    const spells: any = []
    await Promise.all(files.map(async (file) => {
        const unitPage = JSON.parse(fs.readFileSync(`${CDN.MAIN_FOLDER_PATH}/unitData/${file}`, {
            encoding: 'utf-8'
        }));

        let root: any = {};
        for (const key of Object.keys(unitPage)) {
            if (key.endsWith('/Root')) {
                root = unitPage[key];
                break;
            }
        }

        const name = root['mCharacterName'] || "";
        if (name?.length < 1) {
            return;
        }

        let missile_speed = 0.0
        let windup = 0.0

        let basic_attack;
        for (const key of Object.keys(unitPage)) {
            if (key.endsWith(`${name}BasicAttack`)) {
                basic_attack = unitPage[key];
                break;
            }
        }

        if (basic_attack) {
            const spell = basic_attack['mSpell'];
            if (spell) {
                missile_speed = spell['missileSpeed'] || 0.0;
            }
        }

        if (root['basicAttack']) {
            basic_attack = root['basicAttack'];
            if (basic_attack['mAttackTotalTime'] && basic_attack['mAttackCastTime']) {
                windup = basic_attack['mAttackCastTime'] / basic_attack['mAttackTotalTime']
            } else {
                windup = 0.3 + (basic_attack['mAttackDelayCastOffsetPercent'] || 0.0)
            }
        }

        const tags = [];
        const preTags = [];
        if (root['unitTagsString']?.includes('|')) {
            preTags.push(...root['unitTagsString'].split('|'));
        } else if (root['unitTagsString']) {
            preTags.push(root['unitTagsString']);
        }

        for (const tag of preTags) {
            tags.push(`Unit_${tag.trim().replace('=', '_')}`);
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
            basicAtkMissileSpeed: missile_speed,
            basicAtkWindup: windup,
            tags: tags
        }

        unitData.push(unit);

        for (const [key, value] of Object.entries(unitPage)) {
            const s = (value as any)['mSpell'];

            if (s) {
                const spell = {
                    name: (value as any)['mScriptName'],
                    "flags": s["mAffectsTypeFlags"] || 0,
                    "delay": s["mCastTime"] || 0.5 + 0.5 * (s["delayCastOffsetPercent" || 0.0]),
                    "castRadius": (s["castRangeDisplayOverride"] || (s['castRange'] || [s['castConeDistance'] || 0.0]))[0],
                    "castRange": (s["castRangeDisplayOverride"] || (s["castRadius"] || [0.0]))[0],
                    "width": s["mLineWidth"] || 0.0,
                    "height": 0.0,
                    "speed": s["missileSpeed"] || 0.0,
                    "travelTime": 0.0,
                    "projectDestination": false
                }

                if (s['mCastRangeGrowthMax']) {
                    spell['castRange'] = s['mCastRangeGrowthMax'][4]
                }

                const missile = s['mMissileSpec'];
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

                spells.push(spell);
            }
        }
    }));

    fs.writeFileSync(`${CDN.MAIN_FOLDER_PATH}/UnitData.json`, JSON.stringify(unitData), {
        encoding: 'utf-8',
        flag: 'w'
    });

    fs.writeFileSync(`${CDN.MAIN_FOLDER_PATH}/SpellData.json`, JSON.stringify(spells), {
        encoding: 'utf-8',
        flag: 'w'
    });
}

export { downloadUnitData, transformUnitDataToJson }