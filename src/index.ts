import Offsets from "./game/Offsets";
import LeagueProcess from "./process/LeagueProcess";
import memoryjs from 'memoryjs';

const league = new LeagueProcess({ searchProcessIntervalSeconds: 1 });

league.on("load", async(league: LeagueProcess)=> {
    console.log(`League Process found, ${league.process.th32ProcessID}.`);

    while(true) {
        const gametime = memoryjs.readMemory(league.process.handle, league.module.modBaseAddr + Offsets.GameTime, memoryjs.FLOAT);
        console.log(gametime);
           await new Promise((resolve)=> setTimeout(resolve, 100));
    }
});

league.on("unload", ()=> {
    console.log(`League closed.`);
})

league.startSearchProcess();