class CellManager {

    constructor(cellCountX, cellCountY, graphics) {
        this.cellsX = cellCountX;
        this.cellsY = cellCountY;
        this.graphics = graphics;
        this.cells = [];
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
        this.generations.forEach(gen => {
            for (let i = 0; i < this.cellsX; i++) {
                gen[i] = [];
                for (let j = 0; j < this.cellsY; j++) {
                    this.initCell(gen, i, j, false);
                }
            }
        });
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
                if (! cell.active && cell.neighborCount === 0) {
                    continue;
                }

                let nextState = false;
                if (cell.active && cell.neighborCount === 2 || cell.neighborCount === 3) {
                    nextState = true;
                }
                else if (! cell.active && cell.neighborCount === 3) {
                    nextState = true;
                }

                if (cell.active !== nextState) {
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
            this.generations[this.nextGenIndex][i] = [];
            for (let j = 0; j < this.cellsY; j++) {
                this.generations[this.nextGenIndex][i][j] = {
                    active: this.generations[this.thisGenIndex][i][j].active,
                    neighborCount: this.generations[this.thisGenIndex][i][j].neighborCount
                }
            }
        }
    }

    setCell(x, y, active) {
        this.generations[this.nextGenIndex][x][y].active = active;
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

        this.generations[this.thisGenIndex][x][y] = {
            active,
            neighborCount
        };
    }

    updateNeighborCounts(x, y, active) {
        const delta = active ? 1 : -1;
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
        const col = this.generations[this.nextGenIndex][x];
        if (col !== undefined) {
            const cell = col[y];
            if (cell !== undefined) {
                cell.neighborCount += delta;
            }
        }
    }

    // returns 1 or 0
    readNeighborActive(x, y) {
        const cell = (this.generations[this.nextGenIndex][x]||[])[y];
        if (cell === undefined) {
            return 0;
        }
        return cell.active ? 1 : 0;
    }

    initCell(gen, x, y, active) {
        if (! gen[x][y]) {
            gen[x][y] = {
                active
            };
        }
        else {
            gen[x][y].active = active;
        }
    }

    readCellNextGen(x, y) {
        return this.generations[this.nextGenIndex][x][y].active;
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
