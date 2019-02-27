const perf = new Perf({logEvery: 10});
const patterns = new Patterns();

const stageWidth = 800;
const stageHeight = 800;
const cellCountX = 200;
const cellCountY = 200;
const cellWidth = stageWidth / cellCountX;
const cellHeight = stageHeight / cellCountY;

const renderer = PIXI.autoDetectRenderer(stageWidth, stageHeight, {
    backgroundColor: 0x00ff00
});
// renderer.view.style.display = "block";
document.body.appendChild(renderer.view);

const stage = new PIXI.Container();
const particles = new PIXI.particles.ParticleContainer(cellCountX*cellCountY, {
    tint: true,

    vertices: false,
    position: false,
    rotation: false,
    uvs: false,

    scale: false,
    alpha: false
});
stage.addChild(particles);


console.log(`Canvas: ${PIXI.RENDERER_TYPE.CANVAS} WebGL ${PIXI.RENDERER_TYPE.WEBGL}`);
console.log(`This renderer: ${renderer.type}`);

patterns.getPattern('zweiback').then(pattern => {
    console.log(JSON.stringify(pattern));
    Cell.init(cellCountX, cellCountY, cellWidth, cellHeight, pattern, renderer, particles);
    requestAnimationFrame(animate);
});

function animate() {
    Cell.update();

    renderer.render(stage);
    perf.tick();

    if (perf.ticks === 1200) {
        perf.end();
        return;
    }

    requestAnimationFrame(animate);
}
