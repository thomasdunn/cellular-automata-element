import {Perf} from './perf.js';
import {Lexicon} from './lexicon.js';
import {Graphics} from './graphics.js';
import {CellManager} from './cellmanager.js';

const stageWidth = 900;
const stageHeight = 900;
const cellCountX = 300;
const cellCountY = 300;
const cellWidth = stageWidth / cellCountX;
const cellHeight = stageHeight / cellCountY;

const perf = new Perf({logEvery: 10});
const lexicon = new Lexicon();
const graphics = new Graphics(cellCountX, cellCountY, cellWidth, cellHeight, stageWidth, stageHeight);
const cellManager = new CellManager(cellCountX, cellCountY, graphics);

document.getElementById('container').appendChild(graphics.view);

lexicon.getData('space rake').then(data => {

    console.log(JSON.stringify(data));
    cellManager.init(data);
    requestAnimationFrame(animate);

}).catch (err => console.error(err));

function animate() {
    cellManager.nextGeneration();
    graphics.render();
    perf.tick();

    if (perf.ticks === 1000) {
        perf.end();
        return;
    }

    requestAnimationFrame(animate);
}

// TODO
// more simply computing offsets for neighbor counting
// implement wrapping
// try class objects for cells rather than object literals to see if helps perf