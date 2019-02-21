class Cell {
    static size(width, height) {
        Cell.width = width;
        Cell.height = height;
    }

    static initTextures(renderer) {
        let g = new PIXI.Graphics();
        g.beginFill(0x000000);
        g.drawRect(0, 0, Cell.width, Cell.height);
        Cell.onTexture = PIXI.RenderTexture.create(g.width, g.height);
        renderer.render(g, Cell.onTexture);

        g = new PIXI.Graphics();
        g.beginFill(0xFFFFFF);
        g.drawRect(0, 0, Cell.width, Cell.height);
        Cell.offTexture = PIXI.RenderTexture.create(g.width, g.height);
        renderer.render(g, Cell.offTexture);
    }

    static initCells(stage, cellCountX, cellCountY) {
        Cell.cellsX = cellCountX;
        Cell.cellsY = cellCountY;

        for (let i = 0; i < Cell.cellsX; i++) {
            Cell.cells[i] = [];
            for (let j = 0; j < Cell.cellsY; j++) {

                if ((i + j) % 2 === 1) {
                    const sprite = new PIXI.Sprite(Cell.onTexture);
                    sprite.position.x = i * Cell.width;
                    sprite.position.y = j * Cell.height;
                    stage.addChild(sprite);
                    sprite.onTexture = true;
                    Cell.cells[i][j] = sprite;
                }
                else {
                    const sprite = new PIXI.Sprite(Cell.offTexture);
                    sprite.position.x = i * Cell.width;
                    sprite.position.y = j * Cell.height;
                    stage.addChild(sprite);
                    sprite.onTexture = false;
                    Cell.cells[i][j] = sprite;
                }
            }
        }
    }

    static update() {
        for (let i = 0; i < Cell.cellsX; i++) {
            for (let j = 0; j < Cell.cellsY; j++) {
                const sprite = Cell.cells[i][j];
                sprite.onTexture = ! sprite.onTexture;
                sprite.texture = sprite.onTexture ? Cell.onTexture : Cell.offTexture;
            }
        }
    }
}

Cell.cells = [];