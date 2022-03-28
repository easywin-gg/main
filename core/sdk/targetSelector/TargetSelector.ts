import Game from "../../game/Game";
import GameObject from "../../game/GameObject";
import { Vector2, Vector3 } from "../../game/renderer/GameRenderer";

class TargetSelector {

    constructor(
        private readonly game: Game
    ) {

    }

    isValidTarget(target: GameObject) {
    }

    private distanceBetween(position: Vector3) {
        const myPosition = this.game.localPlayer.getPosition();
        return Math.sqrt((myPosition.x - position.x)**2 + (myPosition.y - position.y)**2)
    }
}

export default TargetSelector;