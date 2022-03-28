// make PluginManager with load function, store in Map with key as PluginInfo.name
// and read plugins from appdata/rank1/scripts folder

import Core from "../Core";
import Plugin, { PluginInfo } from "./Plugin";
import fs from 'fs';
import path from 'path'
import SDK from "../sdk/SDK";

class PluginManager {

    private plugins: Map<string, Plugin>;

    constructor(private sdk: SDK) {
        this.plugins = new Map<string, Plugin>();
    }

    public async load() {
        const files = fs.readdirSync(path.join(Core.MAIN_FOLDER_PATH, 'scripts'))
            .filter((fileName) => fileName.endsWith('.js'));

        for (const file of files) {
            const Plugin = (
                await import(
                    path.join(Core.MAIN_FOLDER_PATH, 'scripts', file)
                )
            ).default;

            const plugin = new Plugin(this.sdk);
            const pluginInfo = plugin.info as PluginInfo;

            console.log(`[PluginManager] Loaded plugin ${pluginInfo.name} v${pluginInfo.version} by ${pluginInfo.author}`);
            this.plugins.set(pluginInfo.name, plugin);
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