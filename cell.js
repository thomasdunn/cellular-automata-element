class Cell {

    static init(cellCountX, cellCountY, patternData, graphics) {
        Cell.cellsX = cellCountX;
        Cell.cellsY = cellCountY;

        Cell.graphics = graphics;

        Cell.initGenerations();
        Cell.initLifePattern(patternData);
        Cell.initLife();
    }

    static initGenerations() {
        Cell.generations.forEach(gen => {
            for (let i = 0; i < Cell.cellsX; i++) {
                gen[i] = [];
                for (let j = 0; j < Cell.cellsY; j++) {
                    Cell.initCell(gen, i, j, false);
                }
            }
        });
    }

    static initLife() {
        for (let i = 0; i < Cell.cellsX; i++) {
            for (let j = 0; j < Cell.cellsY; j++) {
                Cell.initCellLife(i, j, Cell.readCellNextGen(i, j));
            }
        }
        Cell.generationCount = 0;
    }

    static initLifePattern(data) {
        const offsetX = Math.floor(Cell.cellsX / 2 - data.width / 2);
        const offsetY = Math.floor(Cell.cellsY / 2 - data.height / 2);

        data.pattern.forEach(onCell => {
            Cell.setCell(onCell[0] + offsetX, onCell[1] + offsetY, true);
        });
    }

    static update() {
        Cell.copyToNextGen();

        for (let i = 0; i < Cell.cellsX; i++) {
            for (let j = 0; j < Cell.cellsY; j++) {
                const cell = Cell.readCellLife(i, j);
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
                    Cell.updateNeighborCounts(i, j, nextState);
                    Cell.setCell(i, j, nextState);
                    Cell.graphics.draw(i, j, nextState);
                }
            }
        }

        Cell.nextGen();
    }

    static copyToNextGen() {
        for (let i = 0; i < Cell.cellsX; i++) {
            Cell.generations[Cell.nextGenIndex][i] = [];
            for (let j = 0; j < Cell.cellsY; j++) {
                Cell.generations[Cell.nextGenIndex][i][j] = {
                    active: Cell.generations[Cell.thisGenIndex][i][j].active,
                    neighborCount: Cell.generations[Cell.thisGenIndex][i][j].neighborCount
                }
            }
        }
    }

    static setCell(x, y, active) {
        Cell.generations[Cell.nextGenIndex][x][y].active = active;
    }

    static initCellLife(x, y, active) {
        const xoleft = x-1;
        const xoright = x+1;
        const yoabove = y-1;
        const yobelow = y+1;
        
        const neighborCount =
            Cell.readNeighborActive(xoleft, yoabove) +
            Cell.readNeighborActive(x, yoabove) +
            Cell.readNeighborActive(xoright, yoabove) +
            Cell.readNeighborActive(xoleft, y) +
            Cell.readNeighborActive(xoright, y) +
            Cell.readNeighborActive(xoleft, yobelow) +
            Cell.readNeighborActive(x, yobelow) +
            Cell.readNeighborActive(xoright, yobelow);

        Cell.generations[Cell.thisGenIndex][x][y] = {
            active,
            neighborCount
        };
    }

    static updateNeighborCounts(x, y, active) {
        const delta = active ? 1 : -1;
        const xoleft = x-1;
        const xoright = x+1;
        const yoabove = y-1;
        const yobelow = y+1;

        Cell.updateNeighborCount(xoleft, yoabove, delta);
        Cell.updateNeighborCount(x, yoabove, delta);
        Cell.updateNeighborCount(xoright, yoabove, delta);
        Cell.updateNeighborCount(xoleft, y, delta);
        Cell.updateNeighborCount(xoright, y, delta);
        Cell.updateNeighborCount(xoleft, yobelow, delta);
        Cell.updateNeighborCount(x, yobelow, delta);
        Cell.updateNeighborCount(xoright, yobelow, delta);
    }

    static updateNeighborCount(x, y, delta) {
        const col = Cell.generations[Cell.nextGenIndex][x];
        if (col !== undefined) {
            const cell = col[y];
            if (cell !== undefined) {
                cell.neighborCount += delta;
            }
        }
    }

    // returns 1 or 0
    static readNeighborActive(x, y) {
        const cell = (Cell.generations[Cell.nextGenIndex][x]||[])[y];
        if (cell === undefined) {
            return 0;
        }
        return cell.active ? 1 : 0;
    }

    static initCell(gen, x, y, active) {
        if (! gen[x][y]) {
            gen[x][y] = {
                active
            };
        }
        else {
            gen[x][y].active = active;
        }
    }

    static readCellNextGen(x, y) {
        return Cell.generations[Cell.nextGenIndex][x][y].active;
    }

    static readCellLife(x, y) {
        return Cell.generations[Cell.thisGenIndex][x][y];
    }

    static nextGen() {
        let temp = Cell.thisGenIndex;
        Cell.thisGenIndex = Cell.nextGenIndex;
        Cell.nextGenIndex = temp;
        Cell.generationCount += 1;
    }

}

Cell.cells = [];
Cell.generations = [[], []];
Cell.thisGenIndex = 0;
Cell.nextGenIndex = 1;
Cell.generationCount = 0;