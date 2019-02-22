class Cell {
    static size(width, height) {
        Cell.width = width;
        Cell.height = height;
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

    static initCells(cellCountX, cellCountY) {
        Cell.cellsX = cellCountX;
        Cell.cellsY = cellCountY;

        for (let i = 0; i < Cell.cellsX; i++) {
            Cell.cells[i] = [];
            for (let j = 0; j < Cell.cellsY; j++) {
                Cell.cells[i][j] = (i + j) % 2 === 1;
            }
        }
    }

    static initSprites(stage, cellCountX, cellCountY) {
        Cell.cellsX = cellCountX;
        Cell.cellsY = cellCountY;

        for (let i = 0; i < Cell.cellsX; i++) {
            Cell.sprites[i] = [];
            for (let j = 0; j < Cell.cellsY; j++) {
                const sprite = new PIXI.Sprite(Cell.getTexture(Cell.cells[i][j]));
                sprite.position.x = i * Cell.width;
                sprite.position.y = j * Cell.height;
                stage.addChild(sprite);
                Cell.sprites[i][j] = sprite;
            }
        }
    }

    static update() {
        for (let i = 0; i < Cell.cellsX; i++) {
            for (let j = 0; j < Cell.cellsY; j++) {
                Cell.cells[i][j] = ! Cell.cells[i][j];

                const sprite = Cell.sprites[i][j];
                sprite.texture = Cell.getTexture(Cell.cells[i][j]);
            }
        }
    }

    static getTexture(active) {
        const textureName = active ? 'on' : 'off';
        return Cell.textures[textureName];
    }
}

Cell.sprites = [];
Cell.cells = [];
Cell.generations = [[], []];
Cell.thisGenIndex = 0;
Cell.nextGenIndex = 1;