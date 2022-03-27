import CDN from "./cdn/app/CDN";

class Rank1 {

    private readonly cdn: CDN;

    constructor() {
        this.cdn = new CDN();
    }

    async start() {
        console.log('       ______  ___   _   _  _   __  __  ');
        console.log('       | ___ \\/ _ \\ | \\ | || | / / /  | ');
        console.log('       | |_/ / /_\\ \\|  \\| || |/ /  `| | ');
        console.log('       |    /|  _  || . ` ||    \\   | | ');
        console.log('       | |\\ \\| | | || |\\  || |\\  \\ _| |_');
        console.log('       \\_| \\_\\_| |_/\\_| \\_/\\_| \\_/ \\___/');
        console.log('                                   ');

        console.log('[Rank1] Starting...');
        await this.cdn.start();
    }
}

const main = new Rank1();
main.start();