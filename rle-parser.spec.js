import { RleParser } from './rle-parser';
import { expect } from 'chai';

describe('RleParser', () => {
    const glider = `#N Glider
#O Richard K. Guy
#C The smallest, most common, and first discovered spaceship. Diagonal, has period 4 and speed c/4.
#C www.conwaylife.com/wiki/index.php?title=Glider
x = 3, y = 3, rule = B3/S23
bob$2bo$3o!`;

    let parser;

    beforeEach(() => {
        parser = new RleParser();
    });

    it('#parses out rle file components', () => {
        const {pattern, rule, width, height, name, creator, comments} = parser.parse(glider);

        expect(pattern).to.be.equal('bob$2bo$3o');
        expect(width).to.be.equal(3);
        expect(height).to.be.equal(3);
        expect(comments[0]).to.be.equal('The smallest, most common, and first discovered spaceship. Diagonal, has period 4 and speed c/4.');
        expect(comments[1]).to.be.equal('www.conwaylife.com/wiki/index.php?title=Glider');
    });

    it('#toCellArray converts pattern to on cells array', () => {
        const onCells = parser.toOnCells('bob$2bo$3o');
        expect(onCells).to.be.deep.equal([
            [1, 0],
            [2, 1],
            [0, 2],
            [1, 2],
            [2, 2]
        ])
    });
});