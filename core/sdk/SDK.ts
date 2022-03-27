import Core from "../app/Core";
import Game from "../game/Game";
import GameRenderer from "../game/renderer/GameRenderer";
import EventManager from "./event/EventManager";

class SDK {

    public readonly game: Game;
    public readonly renderer: GameRenderer;
    public readonly eventManager: EventManager;

    constructor(
        private readonly core: Core
    ) {
        this.game = core.game;
        this.renderer = new GameRenderer(this.core);
        this.eventManager = new EventManager();
    }


}

export default SDK;