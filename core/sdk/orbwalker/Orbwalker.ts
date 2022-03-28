import Game from "../../game/Game";
import GameObject from "../../game/GameObject";
import SDK from "../SDK";
import robotjs from 'robotjs';

const LETHAL_TEMPO = 'ASSETS/Perks/Styles/Precision/LethalTempo/LethalTempo.lua'
const HAIL_OF_BLADES = 'ASSETS/Perks/Styles/Domination/HailOfBlades/HailOfBladesBuff.lua'
const LETHAL_TEMPO_STACKS_UNCAPPED_RANGED = 6.
const LETHAL_TEMPO_STACKS_UNCAPPED_MELEE = 30.

class Orbwalker {

    private readonly game: Game;
    private canAttackTime: number;
    private canMoveTime: number;;

    constructor(
        private readonly sdk: SDK
    ) {
        this.game = sdk.game;
        const gametime = this.game.getGameTime();
        this.canAttackTime = gametime;
        this.canMoveTime = gametime;
    }

    public async orbwalk(target?: GameObject) {
        if(target && this.canAttackTime < this.game.getGameTime()) {
            const mousePosition = robotjs.getMousePos();
            const targetPosition = this.sdk.renderer.worldToScreen(target.getPosition());
            robotjs.moveMouse(targetPosition.x, targetPosition.y);
            robotjs.mouseClick('right');
            await new Promise((resolve)=> setTimeout(resolve, 10));
            const attackSpeedCap = this.getAttackSpeedCap();
            
            const gameTime = this.game.getGameTime();
            this.canAttackTime = gameTime + this.getAttackTime(attackSpeedCap);
            this.canMoveTime = gameTime + this.getWindupTime(attackSpeedCap);
            robotjs.moveMouse(mousePosition.x, mousePosition.y);
        } else if(this.canMoveTime < this.game.getGameTime()) {
            robotjs.mouseClick('right');
            this.canMoveTime = this.game.getGameTime() + 0.05;
        }
    }

    public getAttackTime(attackSpeedCap: number) {
        const localPlayer = this.game.localPlayer;
        const totalAttackSpeed = Math.min(
            attackSpeedCap,
            (localPlayer.getAttackSpeedMultiplier() - 1) * localPlayer.getAttackSpeedRatio() + localPlayer.getBaseAttackSpeed()
        )

        return 1. / totalAttackSpeed;
    }

    public getWindupTime(attackSpeedCap: number) {
        const localPlayer = this.game.localPlayer;

        const attackTime = this.getAttackTime(attackSpeedCap);
        const baseWindupTime = (1 / localPlayer.getBaseAttackSpeed()) * localPlayer.getBasicAttackWindup();
        const windupTime = baseWindupTime + ((attackTime * localPlayer.getBasicAttackWindup()) - baseWindupTime) * (1 + localPlayer.getAttackSpeedMultiplier())
        return Math.min(windupTime, attackTime);
    }

    public getAttackSpeedCap() {
        const localPlayer = this.game.localPlayer;
        const lethalTempoBuff = localPlayer.getBuffManager().get(LETHAL_TEMPO)
        let uncapped = false;
        if (lethalTempoBuff) {
            uncapped = lethalTempoBuff.count >= (
                localPlayer.isMeele() ? LETHAL_TEMPO_STACKS_UNCAPPED_MELEE : LETHAL_TEMPO_STACKS_UNCAPPED_RANGED
            );
        }

        if(localPlayer.getBuffManager().get(HAIL_OF_BLADES)) uncapped = true;
        return uncapped ? 90. : 2.5
    }

}

export default Orbwalker;