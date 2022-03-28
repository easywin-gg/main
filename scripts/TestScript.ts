import SDK from "../core/sdk/SDK";
import Plugin, { PluginInfo } from "../core/plugin/Plugin";

class TestScript implements Plugin {

    public readonly info: PluginInfo;

    constructor(
        private readonly sdk: SDK
    ) {
        this.info = {
            name: 'TestScript',
            version: 1.0,
            author: 'Nospher'
        }
    }

    public async load() {
        console.log('[TestScript] Loaded');
    }

    public async unload() {
        console.log('[TestScript] Unloaded');
    }
}

export default TestScript;