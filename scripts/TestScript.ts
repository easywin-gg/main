import SDK from "../core/sdk/SDK";
import { EventType } from "../core/events/LeagueEvent";
import Plugin from "../core/plugin/Plugin";

class TestScript extends Plugin {

    constructor(
        private readonly sdk: SDK
    ) {
        super({
            name: 'test',
            version: 1.0,
            author: 'Nospher'
        })
    }

    public async load() {
    }

    public async unload() {

    }

}

export default TestScript;