type PluginInfo = {
    name: string,
    version: number,
    author: string
}

abstract class Plugin {

    public name: string;
    public version: number;
    public author: string;

    constructor({ name, version, author }: PluginInfo) {
        this.name = name;
        this.version = version;
        this.author = author;
    }

    abstract load(): unknown | Promise<unknown>
    abstract unload(): unknown | Promise<unknown>
    
}

export default Plugin;