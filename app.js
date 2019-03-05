import {Perf} from './perf.js';
import {Lexicon} from './lexicon.js';
import {Graphics} from './graphics.js';
import {CellManager} from './cellmanager.js';

// const stageWidth = 90;
// const stageHeight = 90;
// const cellCountX = 9;
// const cellCountY = 9;

// testing... nearly 60fps with one million cells!!!
const stageWidth = 1000;
const stageHeight = 1000;
const cellCountX = 1000;
const cellCountY = 1000;

// // 35fps,32.3,32.2,35
// const stageWidth = 1200;
// const stageHeight = 1200;
// const cellCountX = 600;
// const cellCountY = 600;

// 44fps
// const stageWidth = 1000;
// const stageHeight = 1000;
// const cellCountX = 500;
// const cellCountY = 500;

// // 59fps
// const stageWidth = 800;
// const stageHeight = 800;
// const cellCountX = 400;
// const cellCountY = 400;

// 59fps
// const stageWidth = 90;
// const stageHeight = 90;
// const cellCountX = 300;
// const cellCountY = 300;

const cellWidth = stageWidth / cellCountX;
const cellHeight = stageHeight / cellCountY;

const perf = new Perf({logEvery: 10});
const lexicon = new Lexicon();
const graphics = new Graphics(cellWidth, cellHeight, stageWidth, stageHeight);
const cellManager = new CellManager(cellCountX, cellCountY, graphics);

document.getElementById('container').appendChild(graphics.view);

lexicon.getData('spacefiller').then(data => {

    console.log(JSON.stringify(data));
    cellManager.init(data);
    graphics.render();

    requestAnimationFrame(animate);
    // setTimeout(() => requestAnimationFrame(animate), 256);

}).catch (err => console.error(err));

function animate() {
    cellManager.nextGeneration();
    graphics.render();
    perf.tick();

    if (perf.ticks === 1000000) {
        perf.end();
        return;
    }

    requestAnimationFrame(animate);
    // setTimeout(() => requestAnimationFrame(animate), 256);
}
