import Game from "../core/game/Game";
import GameRenderer from "../core/renderer/GameRenderer";
import EventManager from "./event/EventManager";
import Orbwalker from "./orbwalker/Orbwalker";
import TargetSelector from "./targetSelector/TargetSelector";


class SDK {

    public readonly renderer: GameRenderer;
    public readonly eventManager: EventManager;

    public readonly targetSelector: TargetSelector;
    public readonly orbwalker: Orbwalker;

    constructor(public readonly game: Game) {
        this.renderer = new GameRenderer();
        this.eventManager = new EventManager();

        this.targetSelector = new TargetSelector(this);
        this.orbwalker = new Orbwalker(this);
    }
}

export default SDK;