import Game from "../core/game/Game";
import Plugin from "../core/plugin/Plugin";
import GameRenderer from "../core/renderer/GameRenderer";
import { PluginSettings } from "../plugins/@types";

export type APIFunction = {
    name: string,
    handler: Function;
}

class SDK {

    private static API = new Map<string, APIFunction[]>();

    constructor(
        public readonly game: Game,
        // public readonly renderer?: GameRenderer
    ) {

    }

    public getAPIFunction(plugin: PluginSettings, name: string): Function | undefined {
        console.log('hhahaha?');
        const functions = SDK.API.get(plugin.name);
        if (!functions) {
            return undefined;
        }

        for (const functionInfo of functions) {
            if (functionInfo.name === name) {
                return functionInfo.handler;
            }
        }

        return undefined;
    }

    public registerAPIFunction(plugin: PluginSettings, api: APIFunction) {
        const functions = SDK.API.get(plugin.name);
        if (!functions) {
            SDK.API.set(plugin.name, [api]);
            return;
        }

        functions.push(api);
        return;
    }
}

export default SDK;