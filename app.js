const stage = new PIXI.Container();
const perf = new Perf({logEvery: 10});

const stageWidth = 800;
const stageHeight = 800;
const cellCountX = 400;
const cellCountY = 400;
const cellWidth = stageWidth / cellCountX;
const cellHeight = stageHeight / cellCountY;

Cell.size(cellWidth, cellHeight);

const renderer = PIXI.autoDetectRenderer(stageWidth, stageHeight, {
    backgroundColor: 0x00ff00
});

console.log(`Canvas: ${PIXI.RENDERER_TYPE.CANVAS} WebGL ${PIXI.RENDERER_TYPE.WEBGL}`);
console.log(`This renderer: ${renderer.type}`);

renderer.view.style.display = "block";
document.body.appendChild(renderer.view);

Cell.initTextures(renderer);
Cell.initCells(stage, cellCountX, cellCountY);

requestAnimationFrame(animate);

function animate() {
    Cell.update();

    renderer.render(stage);
    requestAnimationFrame(animate);

    perf.tick();
}
