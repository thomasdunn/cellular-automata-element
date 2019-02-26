class Cell {

    static init(cellCountX, cellCountY, width, height, pattern, renderer, stage) {
        Cell.cellsX = cellCountX;
        Cell.cellsY = cellCountY;
        Cell.width = width;
        Cell.height = height;

        Cell.pattern = pattern;

        Cell.initGenerations();
        // Cell.initRandom();
        Cell.initLifePattern(pattern);
        Cell.initLife();
        Cell.initTextures(renderer);
        Cell.initSprites(stage);
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

    static initTextures(renderer) {
        Cell.textures = {};

        let g = new PIXI.Graphics();
        g.beginFill(0x000000);
        g.drawRect(0, 0, Cell.width, Cell.height);
        Cell.textures.on = PIXI.RenderTexture.create(g.width, g.height);
        renderer.render(g, Cell.textures.on);

        g = new PIXI.Graphics();
        g.beginFill(0xFFFFFF);
        g.drawRect(0, 0, Cell.width, Cell.height);
        Cell.textures.off = PIXI.RenderTexture.create(g.width, g.height);
        renderer.render(g, Cell.textures.off);
    }

    static initSprites(stage) {
        for (let i = 0; i < Cell.cellsX; i++) {
            Cell.sprites[i] = [];
            for (let j = 0; j < Cell.cellsY; j++) {
                const sprite = new PIXI.Sprite(Cell.getTexture(Cell.readCell(i, j)));
                sprite.position.x = i * Cell.width;
                sprite.position.y = j * Cell.height;
                stage.addChild(sprite);
                Cell.sprites[i][j] = sprite;
            }
        }
    }

    static initCheckerboard() {
        for (let i = 0; i < Cell.cellsX; i++) {
            for (let j = 0; j < Cell.cellsY; j++) {
                Cell.setCell(i, j, (i + j) % 2 === 1);
            }
        }
        Cell.nextGen();
    }

    static initLife() {
        for (let i = 0; i < Cell.cellsX; i++) {
            for (let j = 0; j < Cell.cellsY; j++) {
                Cell.initCellLife(i, j, Cell.readCellNextGen(i, j));
            }
        }
        Cell.nextGen();
        Cell.generationCount = 0;
    }

    static initRandom() {
        for (let i = 0; i < Cell.cellsX; i++) {
            for (let j = 0; j < Cell.cellsY; j++) {
                Cell.setCell(i, j, Cell.randomBoolean());
            }
        }
        Cell.nextGen();
    }

    static initLifePattern(patternObj) {
        const offsetX = 100;
        const offsetY = 100;

        patternObj.pattern.forEach(onCell => {
            Cell.setCell(onCell[0] + offsetX, onCell[1] + offsetY, true);;
        });
    }

    static update() {
        Cell.updateLife();
        Cell.nextGen();
    }

    static updateCheckerboard() {
        for (let i = 0; i < Cell.cellsX; i++) {
            for (let j = 0; j < Cell.cellsY; j++) {
                const next = ! Cell.readCell(i, j);
                Cell.setCell(i, j, next);
                Cell.draw(i, j, next);
            }
        }
    }

    static updateLife() {
        // if (Cell.generationCount >= 10) {
        //     return;
        // }
        // console.log('drawing');
        //
//         for (let i = 0; i < Cell.cellsX; i++) {
//             //TODO better way
//             Cell.generations[Cell.nextGenIndex][i] = [...Cell.generations[Cell.thisGenIndex][i]];
//         }
// Cell.generations[Cell.thisGenIndex][22][22].name = 'Tom';
//         console.log(`name ${Cell.generations[Cell.nextGenIndex][22][22].name}`);

        for (let i = 0; i < Cell.cellsX; i++) {
            Cell.generations[Cell.nextGenIndex][i] = [];
            for (let j = 0; j < Cell.cellsY; j++) {
                Cell.generations[Cell.nextGenIndex][i][j] = {
                    ...Cell.generations[Cell.thisGenIndex][i][j]
                }
            }
        }

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
                    Cell.setCellLife(i, j, nextState);
                    Cell.draw(i, j, nextState);
                }
            }
        }
    }

    static updateRandom() {
        for (let i = 0; i < Cell.cellsX; i++) {
            for (let j = 0; j < Cell.cellsY; j++) {
                const next = Cell.randomBoolean();
                Cell.setCell(i, j, next);
                Cell.draw(i, j, next);
            }
        }
    }

    static randomBoolean() {
        return Math.random() >= 0.5;
    }

    static draw(x, y, active) {
        const sprite = Cell.sprites[x][y];
        sprite.texture = Cell.getTexture(active);
    }

    static getTexture(active) {
        const textureName = active ? 'on' : 'off';
        return Cell.textures[textureName];
    }

    static setCell(x, y, active) {
        Cell.generations[Cell.nextGenIndex][x][y].active = active;
    }

    static initCellLife(x, y, active) {
        const neighborCount =
            Cell.readNeighborCellLife(x-1, y-1) +
            Cell.readNeighborCellLife(x, y-1) +
            Cell.readNeighborCellLife(x+1, y-1) +
            Cell.readNeighborCellLife(x-1, y) +
            Cell.readNeighborCellLife(x+1, y) +
            Cell.readNeighborCellLife(x-1, y+1) +
            Cell.readNeighborCellLife(x, y+1) +
            Cell.readNeighborCellLife(x+1, y+1);
// console.log(`neighbors: ${neighborCount}`);
        Cell.generations[Cell.nextGenIndex][x][y] = {
            active,
            neighborCount
        };
        Cell.generations[Cell.thisGenIndex][x][y] = {
            active,
            neighborCount
        };
    }

    static setCellLife(x, y, active) {
        const delta = active ? 1 : -1;
        let cell = Cell.safeGetNeighborCell(x-1, y-1);
        if (cell) {
            Cell.safeSetNeighborCell(x-1, y-1, cell.neighborCount + delta)
        }
        cell = Cell.safeGetNeighborCell(x, y-1);
        if (cell) {
            Cell.safeSetNeighborCell(x, y-1, cell.neighborCount + delta)
        }
        cell = Cell.safeGetNeighborCell(x+1, y-1);
        if (cell) {
            Cell.safeSetNeighborCell(x+1, y-1, cell.neighborCount + delta)
        }
        cell = Cell.safeGetNeighborCell(x-1, y);
        if (cell) {
            Cell.safeSetNeighborCell(x-1, y, cell.neighborCount + delta)
        }
        cell = Cell.safeGetNeighborCell(x+1, y);
        if (cell) {
            Cell.safeSetNeighborCell(x+1, y, cell.neighborCount + delta)
        }
        cell = Cell.safeGetNeighborCell(x-1, y+1);
        if (cell) {
            Cell.safeSetNeighborCell(x-1, y+1, cell.neighborCount + delta)
        }
        cell = Cell.safeGetNeighborCell(x, y+1);
        if (cell) {
            Cell.safeSetNeighborCell(x, y+1, cell.neighborCount + delta)
        }
        cell = Cell.safeGetNeighborCell(x+1, y+1);
        if (cell) {
            Cell.safeSetNeighborCell(x+1, y+1, cell.neighborCount + delta)
        }

        Cell.generations[Cell.nextGenIndex][x][y].active = active;
    }

    static safeGetNeighborCell(x, y) {
        const col = Cell.generations[Cell.nextGenIndex][x];
        if (col === undefined) {
            return undefined
        }
        return col[y];
    }

    static safeSetNeighborCell(x, y, count) {
        const col = Cell.generations[Cell.nextGenIndex][x];
        if (col !== undefined) {
            const cell = col[y];
            if (cell !== undefined) {
                cell.neighborCount = count;
            }
        }
    }

    // returns 1 or 0
    static readNeighborCellLife(x, y) {
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

    static readCell(x, y) {
        return Cell.generations[Cell.thisGenIndex][x][y].active;
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

Cell.sprites = [];
Cell.cells = [];
Cell.generations = [[], []];
Cell.thisGenIndex = 0;
Cell.nextGenIndex = 1;
Cell.generationCount = 0;