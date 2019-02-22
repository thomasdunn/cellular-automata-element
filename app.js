const stage = new PIXI.Container();
const perf = new Perf({logEvery: 10});
const patterns = new Patterns();

const stageWidth = 800;
const stageHeight = 800;
const cellCountX = 200;
const cellCountY = 200;
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

patterns.getPattern('zweiback').then(pattern => console.log(JSON.stringify(pattern)));

requestAnimationFrame(animate);

function animate() {
    Cell.update();

    renderer.render(stage);
    perf.tick();

    if (perf.ticks === 120) {
        perf.end();
        return;
    }

    requestAnimationFrame(animate);
}
