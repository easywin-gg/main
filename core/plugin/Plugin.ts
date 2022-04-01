export type PluginInfo = {
    name: string,
    version: number,
    author: string
}
 
export type Plugin = {
    info: PluginInfo,
    load: () => Promise<void>,
    unload: () => Promise<void>
}

export default Plugin;