/* eslint-disable no-console */

import { expect } from 'chai';
import { describe, beforeEach, it } from 'mocha';

import fetch from 'node-fetch';
global.fetch = fetch;

import { CellManager } from './cell-manager';
import { PatternLoader } from './pattern-loader';

describe('CellManager', () => {

    let cellManager;

    const graphicsSpy = {
        setBufferDataCalls: 0,
        setBufferData: function() { this.setBufferDataCalls++; },
        reset: function() { this.setBufferDataCalls = 0; }
    };

    beforeEach(() => {
        graphicsSpy.reset();
    });

    it('#init sets buffer data', () => {
        cellManager = new CellManager(800, 800, graphicsSpy);
        cellManager.init({width: 5, height: 5, pattern: []});
        expect(graphicsSpy.setBufferDataCalls).to.equal(1);
    });

    it('#nextGeneration generates correct data', () => {
        cellManager = new CellManager(5, 5, graphicsSpy);
        cellManager.init({width: 5, height: 5, pattern: [
            [1, 0],                 // .O.
            [2, 1],                 // ..O
            [0, 2], [1, 2], [2, 2]  // OOO
        ]});

        cellManager.nextGeneration();
        expect(cellManager.toCellsText()).to.equal(
`
O.O
.OO
.O

`
);

cellManager.nextGeneration();
expect(cellManager.toCellsText()).to.equal(
`
..O
O.O
.OO

`
);

cellManager.nextGeneration();
expect(cellManager.toCellsText()).to.equal(
`
.O
..OO
.OO

`
);

        expect(graphicsSpy.setBufferDataCalls).to.equal(4);
    });

    describe('PatternLoader integration', function() {
        this.timeout(10 * 60 * 1000); // 10min
        const collectionName = 'conwaylife';
        
        it('Completes a couple generations of glider without error', async() => {
            const url = 'http://localhost:6633';
            const patternLoader = new PatternLoader(`${url}`);

            const data = await patternLoader.getRleData(collectionName, 'glider');
            // going to run two generations so give space for it to expand
            cellManager = new CellManager(data.width + 4, data.height + 4, graphicsSpy);
            cellManager.init(data);
            
            cellManager.nextGeneration();
            const gen0 = cellManager.toCellsText();

            cellManager.nextGeneration();
            const gen1 = cellManager.toCellsText();

            expect(gen1).not.equal(gen0, `${gen1}\n != ${gen0}`);
        });

        it('retrieves index and loads all patterns', async() => {
            const url = 'http://localhost:6633';
            const patternLoader = new PatternLoader(`${url}`);

            const patternIndex = await patternLoader.getPatternIndex();
            const collection = patternIndex.find(c => Array.isArray(c[collectionName]));
            if (collection) {
                const patterns = collection[collectionName];
                for (let i = 0; i < patterns.length; i++) {
                    const [, patternName] = patterns[i].match(/^(.+)\.\w+$/);
                    const data = await patternLoader.getRleData(collectionName, patternName);
                    // going to run two generations so give space for it to expand
                    cellManager = new CellManager(data.width + 4, data.height + 4, graphicsSpy);
                    cellManager.init(data);
                    console.log('Initialized ' + patternName);
                    
                    cellManager.nextGeneration();
                    const gen0 = cellManager.toCellsText();
        
                    cellManager.nextGeneration();
                    const gen1 = cellManager.toCellsText();
                }
            }
        });
    
        // this.patternLoader.getPatternIndex().then(patternIndex => {
        // });
    });

});