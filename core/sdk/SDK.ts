import { EventEmitter } from "stream";
import Memory from "../memory/Memory";
import Offsets from "../offsets/Offsets";
import memoryjs from "memoryjs";

export type PluginSettings = {
    name: string;
    version: number;
    author: string;
}

export type Plugin = {
    settings: PluginSettings;
    onLoad(): Promise<void> | void;
    onUnload(): Promise<void> | void;
}

export type APIFunction = {
    name: string,
    handler: Function;
}

class SDK extends EventEmitter {

    private static API = new Map<string, APIFunction[]>();
    public static plugins: Map<string, Plugin> = new Map<string, Plugin>();

    public static getGameTime(): number {
        return Memory.readMemory(
            Memory.module.modBaseAddr + Offsets.GameTime,
            memoryjs.FLOAT
        );
    }

    public getGameTime(): number {
        return SDK.getGameTime();
    }

    public handleAPIFunction(plugin: Plugin, name: string): Function | undefined {
        const functions = SDK.API.get(plugin.settings.name);
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

    public registerAPIFunction(plugin: Plugin, api: APIFunction) {
        const functions = SDK.API.get(plugin.settings.name);
        if (!functions) {
            SDK.API.set(plugin.settings.name, [api]);
            return;
        }

        functions.push(api);
        return;
    }
}

export default SDK;