import Game from "../game/Game";

type ScriptInfo = {
    name: string,
    version: number,
    author: string
}

abstract class Script {

    public name: string;
    public version: number;
    public author: string;

    constructor({ name, version, author }: ScriptInfo) {
        this.name = name;
        this.version = version;
        this.author = author;
    }

    abstract load(): unknown | Promise<unknown>
    abstract unload(): unknown | Promise<unknown>
    
}

export default Script;