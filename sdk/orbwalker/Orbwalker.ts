import SDK from "../SDK";
import robotjs from 'robotjs';
import { Vector2 } from "../../core/renderer/GameRenderer";

const LETHAL_TEMPO = 'ASSETS/Perks/Styles/Precision/LethalTempo/LethalTempo.lua'
const HAIL_OF_BLADES = 'ASSETS/Perks/Styles/Domination/HailOfBlades/HailOfBladesBuff.lua'
const LETHAL_TEMPO_STACKS_UNCAPPED_RANGED = 6.
const LETHAL_TEMPO_STACKS_UNCAPPED_MELEE = 30.

class Orbwalker {

    private canAttackTime: number;
    private canMoveTime: number;;

    constructor(private readonly sdk: SDK) {
        const gametime = this.sdk.game.getGameTime();

        this.canAttackTime = gametime;
        this.canMoveTime = gametime;
    }

    public async orbwalk(targetPosition?: Vector2) {
        robotjs.mouseToggle('down', 'middle');
        if (targetPosition && this.canAttackTime < this.sdk.game.getGameTime()) {
            const mousePosition = robotjs.getMousePos();
            
            const attackSpeedCap = this.getAttackSpeedCap();
            const windupTime = this.getWindupTime(attackSpeedCap);
            const attackTime = this.getAttackTime(attackSpeedCap);
            
            const gameTime = this.sdk.game.getGameTime();
            this.canAttackTime = gameTime + attackTime;
            this.canMoveTime = gameTime + windupTime;
            
            robotjs.mouseClick('right');
            robotjs.moveMouse(mousePosition.x, mousePosition.y);
        } else if (this.canMoveTime < this.sdk.game.getGameTime()) {
            robotjs.mouseClick('right');
            this.canMoveTime = this.sdk.game.getGameTime() + 0.1;
        }

        robotjs.mouseToggle('up', 'middle');
    }

    public getAttackTime(attackSpeedCap: number) {
        const localPlayer = this.sdk.game.getLocalPlayer();

        const totalAttackSpeed = Math.min(
            attackSpeedCap,
            (localPlayer.attackSpeedMultiplier - 1) * localPlayer.attackSpeedRatio + localPlayer.baseAttackSpeed
        )

        return 1. / totalAttackSpeed;
    }

    public getWindupTime(attackSpeedCap: number) {
        const localPlayer = this.sdk.game.getLocalPlayer();

        const attackTime = this.getAttackTime(attackSpeedCap);
        const baseWindupTime = (1 / localPlayer.baseAttackSpeed) * localPlayer.basicAtkWindup;
        const windupTime = baseWindupTime + ((attackTime * localPlayer.basicAtkWindup) - baseWindupTime) * (1 + localPlayer.attackSpeedMultiplier)
        return Math.min(windupTime, attackTime);
    }

    public getAttackSpeedCap() {
        const localPlayer = this.sdk.game.getLocalPlayer();
        const lethalTempoBuff = localPlayer.getBuffManager().get(LETHAL_TEMPO)
        let uncapped = false;
        if (lethalTempoBuff) {
            uncapped = lethalTempoBuff.count >= (
                localPlayer.isMeele() ? LETHAL_TEMPO_STACKS_UNCAPPED_MELEE : LETHAL_TEMPO_STACKS_UNCAPPED_RANGED
            );
        }

        if (localPlayer.getBuffManager().get(HAIL_OF_BLADES)) uncapped = true;
        return uncapped ? 10. : 2.5
    }

}

export default Orbwalker;