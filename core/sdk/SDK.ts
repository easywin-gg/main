import { EventEmitter } from "stream";
import Game from "../game/Game";
import GameRenderer from "../renderer/GameRenderer";

export type PluginSettings = {
    name: string;
    version: number;
    author: string;
}

export type APIFunction = {
    name: string,
    handler: Function;
}

class SDK extends EventEmitter {

    private static API = new Map<string, APIFunction[]>();
    public static plugins: Map<string, PluginSettings> = new Map<string, PluginSettings>();

    constructor(
        public readonly game: Game,
        public readonly renderer: GameRenderer
    ) {
        super();

    }

    public handleAPIFunction(plugin: PluginSettings, name: string): Function | undefined {
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