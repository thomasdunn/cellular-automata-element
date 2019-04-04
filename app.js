import {Perf} from './perf.js';
import {PatternLoader} from './pattern-loader.js';
import {PatternSelector} from './pattern-selector.js';
import {Graphics} from './graphics.js';
import {CellManager} from './cell-manager.js';

// TODO
// * step thru files and fix errors on loading (rle parser updates?)
// * setup public and private remotes
// * web component-ize
// ** src
// ** height/width
// ** bbox padding
// ** state colors
// ** media style contorls: play, pause, speed select, step

class App {
    collectionsUrl;
    collectionName;
    
    stageWidth = 800;
    stageHeight = 800;
    cellCountX = 400;
    cellCountY = 400;
    
    cellWidth = this.stageWidth / this.cellCountX;
    cellHeight = this.stageHeight / this.cellCountY;

    frameId;

    constructor(collectionsUrl, collectionsName) {
        this.collectionsUrl = collectionsUrl;
        this.collectionName = collectionsName;
        
        this.perf = new Perf({logEvery: 10});
        this.patternLoader = new PatternLoader(this.collectionsUrl);
        this.graphics = new Graphics(this.cellWidth, this.cellHeight, this.stageWidth, this.stageHeight);
        this.cellManager = new CellManager(this.cellCountX, this.cellCountY, this.graphics);        
    }

    async init() {
        document.getElementById('container').appendChild(this.graphics.view);

        const index = await this.patternLoader.getPatternIndex();
        const collection = index.find(obj => obj.hasOwnProperty(this.collectionName));
        const patterns = collection[this.collectionName];
        if (patterns) {
            const patternSelector = new PatternSelector(patterns);
            patternSelector.render(document.getElementById('selector'));
            patternSelector.addEventListener('patternselected', async function(e) {
                e.detail ?
                    await this.loadPattern(e.detail) :
                    this.clear();
            }.bind(this));
        }
    }

    async loadPattern(patternFilename) {
        try {
            const [, patternName] = patternFilename.match(/^(.+)\.\w+$/);
            const data = await this.patternLoader.getRleData(this.collectionName, patternName);
    
            console.log(JSON.stringify(data));
            this.cellManager.init(data);
    
            this.clear();
            this.graphics.render();
            // console.log(cellManager.toCellsText());
        
            this.frameId = requestAnimationFrame(this.animate.bind(this));
            // setTimeout(() => requestAnimationFrame(animate), 256);
        }
        catch (err) {
            console.error(err);
        }
    }

    clear() {
        if (this.frameId) {
            cancelAnimationFrame(this.frameId);
        }

        this.graphics.clear();
    }

    animate() {
        this.cellManager.nextGeneration();
        this.graphics.render();
        this.perf.tick();
    
        if (this.perf.ticks === 1000000) {
            this.perf.end();
            return;
        }
    
        this.frameId = requestAnimationFrame(this.animate.bind(this));
        // setTimeout(() => requestAnimationFrame(animate), 256);
    }
}

(async() => {
    // if on development port for local development, load patterns locally
    const url = document.location.port === '' ?
        'https://raw.githubusercontent.com/thomasdunn/cellular-automata-patterns/master' :
        'node_modules/cellular-automata-patterns';

    const app = new App(url, 'conwaylife');
    app.init();
})();
