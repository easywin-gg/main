import Offsets from "./game/Offsets";
import LeagueProcess from "./process/LeagueProcess";
import memoryjs from 'memoryjs';

const main = async()=> {
    const league = new LeagueProcess({ searchProcessIntervalSeconds: 1 });
    league.startSearchProcess();

    // await league.getLeagueProcess();
    // console.log(`League Process found, ${league.process.th32ProcessID}.`);

    // while(true) {
    //     const gametime = memoryjs.readMemory(league.process.handle, league.module.modBaseAddr + Offsets.GameTime, memoryjs.FLOAT);
    //     console.log(gametime);
    //        await new Promise((resolve)=> setTimeout(resolve, 100));
    // }
}

main();