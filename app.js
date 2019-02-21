var stage = new PIXI.Container();

const stageWidth = 800;
const stageHeight = 800;
const cellCountX = 400;
const cellCountY = 400;
const cellWidth = stageWidth / cellCountX;
const cellHeight = stageHeight / cellCountY;

// create a renderer instance
//var renderer = new PIXI.CanvasRenderer(800, 600);//PIXI.autoDetectRenderer(800, 600);
var renderer = PIXI.autoDetectRenderer(stageWidth, stageHeight, {
    backgroundColor: 0x00ff00
});

console.log(`Canvas: ${PIXI.RENDERER_TYPE.CANVAS} WebGL ${PIXI.RENDERER_TYPE.WEBGL}`);
console.log(`This renderer: ${renderer.type}`);

// set the canvas width and height to fill the screen
//renderer.view.style.width = window.innerWidth + "px";
//renderer.view.style.height = window.innerHeight + "px";
renderer.view.style.display = "block";

// add render view to DOM
document.body.appendChild(renderer.view);

const board = new Board(renderer, stage);
Cell.size(cellWidth, cellHeight);

let g = new PIXI.Graphics();
g.beginFill(0x000000);
g.drawRect(0, 0, Cell.width, Cell.height);
const onTexture = PIXI.RenderTexture.create(g.width, g.height);
renderer.render(g, onTexture);

g = new PIXI.Graphics();
g.beginFill(0xFFFFFF);
g.drawRect(0, 0, Cell.width, Cell.height);
const offTexture = PIXI.RenderTexture.create(g.width, g.height);
renderer.render(g, offTexture);

const cells = [];
for (let i = 0; i < cellCountX; i++) {
    cells[i] = [];
    for (let j = 0; j < cellCountY; j++) {
        // const c = new Cell(board, i, j);
        // cells[i][j] = c;

        if ((i + j) % 2 === 1) {
            // c.on().draw();
            const sprite = new PIXI.Sprite(onTexture);
            sprite.position.x = i * Cell.width;
            sprite.position.y = j * Cell.height;
            stage.addChild(sprite);
            sprite.onTexture = true;
            cells[i][j] = sprite;
        }
        else {
            // c.off().draw();
            const sprite = new PIXI.Sprite(offTexture);
            sprite.position.x = i * Cell.width;
            sprite.position.y = j * Cell.height;
            stage.addChild(sprite);
            sprite.onTexture = false;
            cells[i][j] = sprite;
        }
    }
}

requestAnimationFrame(animate);

function animate() {
    for (let i = 0; i < cellCountX; i++) {
        for (let j = 0; j < cellCountY; j++) {
            const sprite = cells[i][j];
            sprite.onTexture = ! sprite.onTexture;
            sprite.texture = sprite.onTexture ? onTexture : offTexture;
            // cells[i][j].toggle().draw();
        }
    }

    board.render();
    requestAnimationFrame(animate);
}
