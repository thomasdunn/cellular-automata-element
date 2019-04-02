import {Perf} from './perf.js';
import {PatternLoader} from './pattern-loader.js';
import {PatternSelector} from './pattern-selector.js';
import {Graphics} from './graphics.js';
import {CellManager} from './cell-manager.js';

const collectionsUrl = 'node_modules/cellular-automata-patterns';
const collectionName = 'conwaylife';

const stageWidth = 800;
const stageHeight = 800;
const cellCountX = 400;
const cellCountY = 400;

// testing... nearly 60fps with one million cells!!!
// const stageWidth = 1000;
// const stageHeight = 1000;
// const cellCountX = 1000;
// const cellCountY = 1000;

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
const patternLoader = new PatternLoader(collectionsUrl);
const graphics = new Graphics(cellWidth, cellHeight, stageWidth, stageHeight);
const cellManager = new CellManager(cellCountX, cellCountY, graphics);
let frameId;
document.getElementById('container').appendChild(graphics.view);

patternLoader.getPatternIndex().then(index => {
    const collection = index.find(obj => obj.hasOwnProperty(collectionName));
    const patterns = collection[collectionName];
    if (patterns) {
        const patternSelector = new PatternSelector(patterns);
        patternSelector.render(document.getElementById('selector'));
        patternSelector.addEventListener('patternselected', function(e) {
            const [, patternName] = e.detail.match(/^([^.]+)\.\w+$/);
            patternLoader.getRleData(collectionName, patternName).then(data => {

                console.log(JSON.stringify(data));
                cellManager.init(data);
                
                if (frameId) {
                    cancelAnimationFrame(frameId);
                }

                graphics.clear();
                graphics.render();
                // console.log(cellManager.toCellsText());
            
                frameId = requestAnimationFrame(animate);
                // setTimeout(() => requestAnimationFrame(animate), 256);
            
            }).catch (err => console.error(err));
        });
    }
});

function animate() {
    cellManager.nextGeneration();
    graphics.render();
    perf.tick();

    if (perf.ticks === 1000000) {
        perf.end();
        return;
    }

    frameId = requestAnimationFrame(animate);
    // setTimeout(() => requestAnimationFrame(animate), 256);
}
