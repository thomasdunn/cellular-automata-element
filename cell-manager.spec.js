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

    // const collectionsUrl = 'node_modules/cellular-automata-patterns'; 
    // const patternLoader = new PatternLoader(collectionsUrl);
    // const patternIndex = await this.patternLoader.getPatternIndex();

    // before(async() => {
    // });

    beforeEach(() => {
        graphicsSpy.reset();
    });

    it('#init sets buffer data', () => {
        cellManager = new CellManager(800, 800, graphicsSpy);
        cellManager.init({width: 5, height: 5, pattern: []});
        expect(graphicsSpy.setBufferDataCalls).to.equal(1);

        // const data = await this.patternLoader.getRleData('conwaylife', 'glider');
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


        // const data = await this.patternLoader.getRleData('conwaylife', 'glider');
    });

    describe('PatternLoader integration', () => {
        
        it('generates without error', async() => {
    
            const url = 'http://localhost:6633';
            // const url = await getUrl();
            const patternLoader = new PatternLoader(`${url}`);

            const data = await patternLoader.getRleData('conwaylife', 'glider');
            cellManager = new CellManager(data.width, data.height, graphicsSpy);
            cellManager.init(data);
            
            cellManager.nextGeneration();
            const gen0 = cellManager.toCellsText();
            console.log(`gen0:\n${gen0}`);

            cellManager.nextGeneration();
            const gen1 = cellManager.toCellsText();
            console.log(`gen1:\n${gen1}`);

            expect(gen1).to.equal(gen0);
        });
    
        // this.patternLoader.getPatternIndex().then(patternIndex => {
        // });
    });

});