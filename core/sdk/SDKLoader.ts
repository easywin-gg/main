import SDK, { PluginSettings } from "./SDK";
import path from 'path'
import fs from 'fs';

const PLUGINS_FOLDER = `${process.env.APPDATA}/rank1/scripts`;
class SDKPluginLoader {

    public static async load(
        sdk: SDK,
    ) {
        const files = fs.readdirSync(PLUGINS_FOLDER).filter((fileName) => fileName.endsWith('.js'));
        const game = sdk.game;
        for (const file of files) {
            const fileContent = fs.readFileSync(
                path.join(PLUGINS_FOLDER, file),
                'utf-8'
            );

            try {
                const plugin = new (eval(fileContent));
                const pluginSettings = plugin?.settings as PluginSettings;
                this.loadPlugin(pluginSettings);
            } catch (error) {
                console.error(`[PluginManager] Failed to load plugin ${file}`);
                console.error(error);
            }
        }
    }

    private static loadPlugin(plugin: PluginSettings) {
        if (!plugin) throw new Error('Plugin settings cannot be undefined');
        const { name, version, author } = plugin;

        if (!name) throw new Error('Plugin name cannot be undefined');
        if (!version) throw new Error('Plugin version cannot be undefined');
        if (!author) throw new Error('Plugin author cannot be undefined');

        console.log(`[PluginManager] Loaded plugin ${name} v${version} by ${author}`);
        SDK.plugins.set(name, plugin);
    }

}

export default SDKPluginLoader