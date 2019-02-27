const perf = new Perf({logEvery: 10});
const lexicon = new Lexicon();
const stageWidth = 800;
const stageHeight = 800;
const cellCountX = 200;
const cellCountY = 200;
const cellWidth = stageWidth / cellCountX;
const cellHeight = stageHeight / cellCountY;

const renderer = PIXI.autoDetectRenderer(stageWidth, stageHeight, {
    backgroundColor: 0x00ff00
});
document.body.appendChild(renderer.view);

console.log(`Renderer: ${renderer.type === PIXI.RENDERER_TYPE.WEBGL ? 'WebGL' : 'Canvas'}`);

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

const graphics = new Graphics(renderer, particles, cellCountX, cellCountY, cellWidth, cellHeight);

lexicon.getData('zweiback').then(data => {

    console.log(JSON.stringify(data.pattern));
    Cell.init(cellCountX, cellCountY, data, graphics);
    requestAnimationFrame(animate);

}).catch (err => console.error(err));

function animate() {
    Cell.update();

    renderer.render(stage);
    perf.tick();

    if (perf.ticks === 500) {
        perf.end();
        return;
    }

    requestAnimationFrame(animate);
}

// TODO
// more simply computing offsets for neighbor counting
// implement wrapping
// other code cleanup
