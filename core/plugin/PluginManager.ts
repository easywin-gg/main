// make PluginManager with load function, store in Map with key as PluginInfo.name
// and read plugins from appdata/rank1/scripts folder

import Plugin, { PluginInfo } from "./Plugin";
import fs from 'fs';
import path from 'path'
import SDK from "../../sdk/SDK";

const PLUGINS_FOLDER = `${process.env.APPDATA}/rank1/scripts`

class PluginManager {

    private plugins: Map<string, Plugin>;

    constructor(
        private readonly sdk: SDK
    ) {
        this.plugins = new Map<string, Plugin>();
    }

    public async load() {
        const files = fs.readdirSync(PLUGINS_FOLDER)
            .filter((fileName) => fileName.endsWith('.js'));

        const sdk = this.sdk;
        const game = sdk.game;
        // const renderer = sdk.renderer;

        for (const file of files) {
            const plugin = new (eval(fs.readFileSync(
                path.join(PLUGINS_FOLDER, file)
                , 'utf-8')
            ));

            const pluginSettings = plugin.settings as PluginInfo;
            console.log(`[PluginManager] Loaded plugin ${pluginSettings.name} v${pluginSettings.version} by ${pluginSettings.author}`);
            // this.plugins.set(pluginInfo.name, plugin);
        }
    }

    public unload() {
        for (const plugin of this.plugins.values()) {
            plugin.unload();
        }
    }

    public getPlugin(name: string): Plugin | undefined {
        return this.plugins.get(name);
    }

    public getPlugins(): Plugin[] {
        return Array.from(this.plugins.values());
    }

}

export default PluginManager;