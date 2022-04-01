import Game from "../../core/game/Game";
import GameObject from "../../core/game/GameObject";
import SDK from "../SDK";
import Vector3 from "../utils/Vector3";

class TargetSelector {

    private readonly game: Game;

    constructor(private readonly sdk: SDK) {
        this.game = sdk.game;
    }

    // public calculateEffectiveDamage(damage: number, resist: number) {
    //     if (resist >= 0) {
    //         return damage * 100. / (100. + resist)
    //     }

    //     return damage * (2. - (100. / (100. - resist)))
    // }

    public getLowestTarget(entities: GameObject[]) {
        return entities
            .filter((x) => this.isInAutoAttackRange(x))
            .filter((x) => this.isValidTarget(x))
        // .sort((a, b)=> this.getBasicAttacksNeeded(a) - this.getBasicAttacksNeeded(b))?.[0];	
    }

    // public getBasicAttacksNeeded(target: GameObject) {
    //     const damage = this.game.localPlayer.getBaseAttack() + this.game.localPlayer.getBonusAttack();
    //     const effective_damage = this.calculateEffectiveDamage(damage, target.getArmor());
    //     return target.health / effective_damage
    // }

    public isInAutoAttackRange(target: GameObject) {
        const localPlayer = this.sdk.game.getLocalPlayer()
        return this.distanceBetween(target.position) <= localPlayer.attackRange;
    }

    // calcule distance entre deux vecteurs
    public distanceBetween(vector1: Vector3, vector2: Vector3 = this.game.getLocalPlayer().position) {
        return Math.sqrt(Math.pow(vector1.x - vector2.x, 2) + Math.pow(vector1.y - vector2.y, 2));
    }

    public isEnemy(target: GameObject) {
        return target.team !== this.game.getLocalPlayer().team;
    }

    public isClone(target: GameObject) {
        return target.level === 0;
    }

    public isValidTarget(target: GameObject) {
        console.log({
            isEnemy: this.isEnemy(target),
            isClone: this.isClone(target),
            isAlive: target.isAlive(),
            isInAutoAttackRange: this.isInAutoAttackRange(target),
            isTargetable: target.isTargetable,
            isVisible: target.isVisible
        })
        return target.isAlive() && this.isEnemy(target) && target.isTargetable && target.isVisible && !this.isClone(target);
    }
}

export default TargetSelector;