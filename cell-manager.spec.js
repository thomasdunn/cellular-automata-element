import { expect } from 'chai';
import { describe, beforeEach, it } from 'mocha';

import { CellManager } from './cell-manager';

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

    // it('generates without error', function(done) {
    //     const collectionsUrl = 'node_modules/cellular-automata-patterns'; 
    //     const patternLoader = new PatternLoader(collectionsUrl);

    //     patternLoader.getRleData('conwaylife', 'glider').then(data => {
    //         cellManager = new CellManager(data.width, data.height, graphicsSpy);
    //         cellManager.init(data);
    //         cellManager.nextGeneration();

    //         done();
    //     });
    // });

    // this.patternLoader.getPatternIndex().then(patternIndex => {
    // });


});