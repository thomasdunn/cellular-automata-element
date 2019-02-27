class Graphics {
    constructor(cellCountX, cellCountY, cellWidth, cellHeight, stageWidth, stageHeight) {

        this.renderer = PIXI.autoDetectRenderer(stageWidth, stageHeight, {
            backgroundColor: 0x00ff00
        });
        console.log(`Renderer: ${this.renderer.type === PIXI.RENDERER_TYPE.WEBGL ? 'WebGL' : 'Canvas'}`);

        this.stage = new PIXI.Container();
        this.particles = new PIXI.particles.ParticleContainer(cellCountX * cellCountY, {
            tint: true,

            vertices: false,
            position: false,
            rotation: false,
            uvs: false,

            scale: false,
            alpha: false
        });

        this.stage.addChild(this.particles);

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
                this.particles.addChild(sprite);
                this.sprites[i][j] = sprite;
            }
        }
    }

    draw(x, y, active) {
        const sprite = this.sprites[x][y];
        sprite.tint = active ? 0x000000 : 0xFFFFFF;
    }

    render() {
        this.renderer.render(this.stage);
    }

    get view() {
        return this.renderer.view;
    }
}