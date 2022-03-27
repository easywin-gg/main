import Core from "../core/app/Core";
import { EventType } from "../core/events/EventBus";
import Script from "../core/script/Script";

class TestScript extends Script {

    constructor(
        private readonly core: Core
    ) {
        super({
            name: 'test',
            version: 1.0,
            author: 'Nospher'
        })
    }

    public async load() {
        Core.getEventManager().subscribe(EventType.OnDraw, this.onDraw);
    }

    public async unload() {

    }

    private async onDraw() {
    }
}

export default TestScript;