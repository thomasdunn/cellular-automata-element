const perf = new Perf({logEvery: 10});
const lexicon = new Lexicon();
const stageWidth = 800;
const stageHeight = 800;
const cellCountX = 200;
const cellCountY = 200;
const cellWidth = stageWidth / cellCountX;
const cellHeight = stageHeight / cellCountY;

const graphics = new Graphics(cellCountX, cellCountY, cellWidth, cellHeight, stageWidth, stageHeight);

document.body.appendChild(graphics.view);

lexicon.getData('zweiback').then(data => {

    console.log(JSON.stringify(data.pattern));
    Cell.init(cellCountX, cellCountY, data, graphics);
    requestAnimationFrame(animate);

}).catch (err => console.error(err));

function animate() {
    Cell.update();

    graphics.render();
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
