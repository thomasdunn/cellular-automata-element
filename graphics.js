class Graphics {
    constructor(renderer, stage, cellCountX, cellCountY, cellWidth, cellHeight) {
        this.renderer = renderer;
        this.stage = stage;
        this.sprites = [];
        this.cellCountX = cellCountX;
        this.cellCountY = cellCountY;
        this.cellWidth = cellWidth;
        this.cellHeight = cellHeight;
        this.texture = null;

        this.initTexture();
        this.initSprites();
    }

    initTexture() {
        let g = new PIXI.Graphics();
        g.beginFill(0xFFFFFF);
        g.drawRect(0, 0, this.cellWidth, this.cellHeight);
        this.texture = PIXI.RenderTexture.create(g.width, g.height);
        this.renderer.render(g, this.texture);
    }

    initSprites() {
        for (let i = 0; i < this.cellCountX; i++) {
            this.sprites[i] = [];
            for (let j = 0; j < this.cellCountY; j++) {
                const sprite = new PIXI.Sprite(this.texture);
                sprite.position.x = i * this.cellWidth;
                sprite.position.y = j * this.cellHeight;
                this.stage.addChild(sprite);
                this.sprites[i][j] = sprite;
            }
        }
    }

    draw(x, y, active) {
        const sprite = this.sprites[x][y];
        sprite.tint = active ? 0x000000 : 0xFFFFFF;
    }
}