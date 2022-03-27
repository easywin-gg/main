"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Core_1 = __importDefault(require("./app/Core"));
const EventBus_1 = require("./events/EventBus");
const core = new Core_1.default({ searchProcessIntervalSeconds: 1 });
core.start();
function randomIntFromInterval(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}
Core_1.default.getEventManager().subscribe(EventBus_1.EventType.OnLoad, (script) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(`League Process found, ${script.process.th32ProcessID}.`);
    const player = script.game.localPlayer;
    console.log(`Welcome ${player.getName()}`);
    console.log('HAHAHAH');
    script.game.readObjects();
    console.log('-------------------------------');
    for (const [name, buff] of player.getBuffManager()) {
        console.log(`[BUFF] ${name} > Count: ${buff.count}, Expires At: ${buff.expiresAt}`);
    }
    for (const [slot, spell] of player.getSpellBook()) {
        console.log(`[${slot}] Level: ${spell.level}, Cooldown Expires At: ${spell.expiresAt}`);
    }
    script.draw.start();
    setInterval(() => {
        const position = script.game.localPlayer.getPosition();
        const renderer = script.game.getGameRenderer();
        const positionToScreen = renderer.worldToScreen(position);
        renderer.drawCircleAt({
            key: 'aa',
            position: positionToScreen,
            radius: 700 / 2,
            startAngle: 0,
            endAngle: Math.PI * 2,
            antiClockwise: false,
            color: 'red',
        });
    }, 1);
    // script.draw.render('arc', {
    //     x: 879.962338043385, 
    //     y: 504.39186332041413, 
    //     radius: 700/2, 
    //     startAngle: 0,
    //     endAngle: Math.PI*2, 
    //     antiCloclwise: false,
    //     color: 'blue' 
    // });
    // while (true) {
    //     console.clear();
    //     console.log(`${player.getName()} > HP: ${player.getHealth()}/${player.getMaxHealth()}`);
    //     for (const [slot, spell] of player.getSpellBook()) {
    //         console.log(`[${slot}] Level: ${spell.level}, Cooldown Expires At: ${spell.expiresAt}`)
    //     }
    //     await new Promise((resolve) => setTimeout(resolve, 1000));
    // }
}));
Core_1.default.getEventManager().subscribe(EventBus_1.EventType.OnUnload, () => {
    console.log(`League closed.`);
});
