export class CellManager {

    constructor(cellCountX, cellCountY, graphics) {
        this.cellsX = cellCountX;
        this.cellsY = cellCountY;
        this.graphics = graphics;
        this.generations = [[], []];
        this.thisGenIndex = 0;
        this.nextGenIndex = 1;
        this.generationCount = 0;
    }

    init(patternData) {
        this.initGenerations();
        this.initPattern(patternData);
        this.initLife();
    }

    initGenerations() {
        const length = this.cellsY;

        for (let i = 0; i < this.cellsX; i++) {
            // slightly better perf when the two arrays share the same array buffer (just different offsets inside of it)
            const buffer = new ArrayBuffer(2 * length);
            this.generations[0][i] = new Uint8Array(buffer, 0, length);
            this.generations[1][i] = new Uint8Array(buffer, length, length);
        }
    }

    initLife() {
        for (let i = 0; i < this.cellsX; i++) {
            for (let j = 0; j < this.cellsY; j++) {
                this.initCellLife(i, j, this.readCellNextGen(i, j));
            }
        }
        this.generationCount = 0;
    }

    initPattern(data) {
        const offsetX = Math.floor(this.cellsX / 2 - data.width / 2);
        const offsetY = Math.floor(this.cellsY / 2 - data.height / 2);

        data.pattern.forEach(onCell => {
            this.setCell(onCell[0] + offsetX, onCell[1] + offsetY, true);
        });
    }

    nextGeneration() {
        this.copyCellDataThisToNext();

        for (let i = 0; i < this.cellsX; i++) {
            for (let j = 0; j < this.cellsY; j++) {
                const cell = this.readCellLife(i, j);
                const neighborCount = cell >> 1;
                const active = (cell & 0b01) === 1;
                if (! active && neighborCount === 0) {
                    continue;
                }

                let nextState = false;
                if (active && neighborCount === 2 || neighborCount === 3) {
                    nextState = true;
                }
                else if (! active && neighborCount === 3) {
                    nextState = true;
                }

                if (active !== nextState) {
                    this.updateNeighborCounts(i, j, nextState);
                    this.setCell(i, j, nextState);
                }
            }
        }

        this.generationCount++;
        this.swapGenerations();
    }

    copyCellDataThisToNext() {
        for (let i = 0; i < this.cellsX; i++) {
            this.generations[this.nextGenIndex][i].set(this.generations[this.thisGenIndex][i]);
        }
    }

    setCell(x, y, active) {
        if (active) {
            // turn on LSB to indicate active
            this.generations[this.nextGenIndex][x][y] |= 0b01;
        }
        else {
            // turn off LSB to indicate inactive
            this.generations[this.nextGenIndex][x][y] &= ~0b01;
        }

        this.graphics.draw(x, y, active);
    }

    initCellLife(x, y, active) {
        const xoleft = x === 0 ? this.cellsX-1 : x-1;
        const xoright = x === this.cellsX-1 ? 0 : x+1;
        const yoabove = y === 0 ? this.cellsY-1 : y-1;
        const yobelow = y === this.cellsY-1 ? 0 : y+1;
        
        const neighborCount =
            this.readNeighborActive(xoleft, yoabove) +
            this.readNeighborActive(x, yoabove) +
            this.readNeighborActive(xoright, yoabove) +
            this.readNeighborActive(xoleft, y) +
            this.readNeighborActive(xoright, y) +
            this.readNeighborActive(xoleft, yobelow) +
            this.readNeighborActive(x, yobelow) +
            this.readNeighborActive(xoright, yobelow);

        if (active) {
            // shift the neighbor count to start at 2nd lowest bit, add cell active state as first bit
            this.generations[this.thisGenIndex][x][y] = neighborCount << 1 | 0b01;
        }
        else {
            this.generations[this.thisGenIndex][x][y] = neighborCount << 1;
        }
    }

    updateNeighborCounts(x, y, active) {
        // const delta = active ? 1 : -1;
        // delta of 2 (not 1) because we're talking binary
        const delta = active ? 2 : -2;
        const xoleft = x === 0 ? this.cellsX-1 : x-1;
        const xoright = x === this.cellsX-1 ? 0 : x+1;
        const yoabove = y === 0 ? this.cellsY-1 : y-1;
        const yobelow = y === this.cellsY-1 ? 0 : y+1;

        this.updateNeighborCount(xoleft, yoabove, delta);
        this.updateNeighborCount(x, yoabove, delta);
        this.updateNeighborCount(xoright, yoabove, delta);
        this.updateNeighborCount(xoleft, y, delta);
        this.updateNeighborCount(xoright, y, delta);
        this.updateNeighborCount(xoleft, yobelow, delta);
        this.updateNeighborCount(x, yobelow, delta);
        this.updateNeighborCount(xoright, yobelow, delta);
    }

    updateNeighborCount(x, y, delta) {
        this.generations[this.nextGenIndex][x][y] += delta;
    }

    // returns 1 or 0
    readNeighborActive(x, y) {
        return this.generations[this.nextGenIndex][x][y] & 0b01;
    }

    // return boolean for active
    readCellNextGen(x, y) {
        return this.generations[this.nextGenIndex][x][y] & 0b01 === 1;
    }

    readCellLife(x, y) {
        return this.generations[this.thisGenIndex][x][y];
    }

    swapGenerations() {
        let temp = this.thisGenIndex;
        this.thisGenIndex = this.nextGenIndex;
        this.nextGenIndex = temp;
    }
}
