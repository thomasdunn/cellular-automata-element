var stage = new PIXI.Container();

const stageWidth = 800;
const stageHeight = 800;
const cellCountX = 40;
const cellCountY = 40;
const cellWidth = stageWidth / cellCountX;
const cellHeight = stageHeight / cellCountY;

// create a renderer instance
//var renderer = new PIXI.CanvasRenderer(800, 600);//PIXI.autoDetectRenderer(800, 600);
var renderer = PIXI.autoDetectRenderer(stageWidth, stageHeight, {
    backgroundColor: 0xffffff
});

// set the canvas width and height to fill the screen
//renderer.view.style.width = window.innerWidth + "px";
//renderer.view.style.height = window.innerHeight + "px";
renderer.view.style.display = "block";

// add render view to DOM
document.body.appendChild(renderer.view);

const board = new Board(renderer, stage);
Cell.size(cellWidth, cellHeight);

const cells = [];
for (let i = 0; i < cellCountX; i++) {
    cells[i] = [];
    for (let j = 0; j < cellCountY; j++) {
        const c = new Cell(board, i, j);
        cells[i][j] = c;

        if ((i + j) % 2 === 1) {
            c.on().draw();
        }
        else {
            c.off().draw();
        }
    }
}

requestAnimationFrame(animate);

function animate() {
    for (let i = 0; i < cellCountX; i++) {
        for (let j = 0; j < cellCountY; j++) {
            cells[i][j].toggle().draw();
        }
    }

    board.render();
    requestAnimationFrame(animate);
}

// function setupClick() {
//     stage.click = stage.tap = function()
//     {
//         graphics.lineStyle(Math.random() * 30, Math.random() * 0xFFFFFF, 1);
//         graphics.moveTo(Math.random() * 620,Math.random() * 380);
//         graphics.lineTo(Math.random() * 620,Math.random() * 380);
//     };
// }
