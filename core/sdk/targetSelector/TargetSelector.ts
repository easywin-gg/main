import Game from "../../game/Game";
import GameObject from "../../game/GameObject";
import { Vector3 } from "../../game/renderer/GameRenderer";
import SDK from "../SDK";

class TargetSelector {

    private readonly game: Game;

    constructor(
        private readonly sdk: SDK
    ) {
        this.game = this.sdk.game;
    }

    public calculateEffectiveDamage(damage: number, resist: number) {
        if (resist >= 0) {
            return damage * 100. / (100. + resist)
        }
        
        return damage * (2. - (100. / (100. - resist)))
    }

    public getLowestTarget(entities: GameObject[]) {
        return entities
            .filter((x)=> this.isInAutoAttackRange(x))
            .filter((x)=> this.isValidTarget(x))
            .sort((a, b)=> this.getBasicAttacksNeeded(a) - this.getBasicAttacksNeeded(b))?.[0];	
    }   
    
    public getBasicAttacksNeeded(target: GameObject) {
        const damage = this.game.localPlayer.getBaseAttack() + this.game.localPlayer.getBonusAttack();
        const effective_damage = this.calculateEffectiveDamage(damage, target.getArmor());
        return target.getHealth() / effective_damage
    }
    
    public isInAutoAttackRange(target: GameObject) {
        const targetRadius = target.getGameplayRadius() * target.getSizeMultiplier();
        const localRadius = this.game.localPlayer.getGameplayRadius() * this.game.localPlayer.getSizeMultiplier();

        return (this.distanceBetween(target.getPosition()) - targetRadius) <= this.game.localPlayer.getAttackRange() + localRadius;
    }
    
    public distanceBetween(position: Vector3) {
        const myPosition = this.game.localPlayer.getPosition();
        return Math.sqrt((myPosition.x - position.x)**2 + (myPosition.y - position.y)**2)
    
    }
    public isEnemy(target: GameObject) {
        return target.getTeam() !== this.game.localPlayer.getTeam();
    }
    
    public isClone(target: GameObject) {
        return target.getLevel() === 0;
    }
    
    public isValidTarget(target: GameObject) {
        return target.isAlive() && this.isEnemy(target) && target.isTargetable() && target.isVisible() && !this.isClone(target);
    }
}

export default TargetSelector;