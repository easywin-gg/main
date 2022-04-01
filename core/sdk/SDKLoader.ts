import SDK, { Plugin, PluginSettings } from "./SDK";
import path from 'path'
import fs from 'fs';

const PLUGINS_FOLDER = `${process.env.APPDATA}/rank1/scripts`;
class SDKPluginLoader {

    public static async load(
        sdk: SDK,
    ) {
        const files = fs.readdirSync(PLUGINS_FOLDER).filter((fileName) => fileName.endsWith('.js'));
        console.log(files);
        
        const game = sdk.game;
        const renderer = sdk.renderer;
        
        for (const file of files) {
            const fileContent = fs.readFileSync(
                path.join(PLUGINS_FOLDER, file),
                'utf-8'
            );

            try {
                const plugin = new (eval(fileContent));
                this.loadPlugin(plugin);
            } catch (error) {
                console.error(`[PluginManager] Failed to load plugin ${file}`);
                console.error(error);
            }
        }
    }

    private static async loadPlugin(plugin: Plugin) {
        if (!plugin) throw new Error('Plugin settings cannot be undefined');
        const { name, version, author } = plugin?.settings;

        if (!name) throw new Error('Plugin name cannot be undefined');
        if (!version) throw new Error('Plugin version cannot be undefined');
        if (!author) throw new Error('Plugin author cannot be undefined');

        await plugin.onLoad();
        console.log(`[PluginManager] Loaded plugin ${name} v${version} by ${author}`);
        SDK.plugins.set(name, plugin);
    }

}

export default SDKPluginLoader