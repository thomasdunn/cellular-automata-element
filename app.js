var stage= new PIXI.Container();

// create a renderer instance
//var renderer = new PIXI.CanvasRenderer(800, 600);//PIXI.autoDetectRenderer(800, 600);
var renderer = PIXI.autoDetectRenderer(800, 800, {
    backgroundColor: 0xffffff
});

// set the canvas width and height to fill the screen
//renderer.view.style.width = window.innerWidth + "px";
//renderer.view.style.height = window.innerHeight + "px";
renderer.view.style.display = "block";

// add render view to DOM
document.body.appendChild(renderer.view);

// const cellsX = 40;
// const cellsY = 30;

// animateThing();

const c = new Cell(stage, 0, 0, 20, 20);
c.draw();

renderer.render(stage);

/////////////////////////////////////////////////////////////////////////

function animateThing() {
    // lets create moving shape
    var thing = new PIXI.Graphics();
    stage.addChild(thing);
    thing.position.x = 620/2;
    thing.position.y = 380/2;

    var count = 0;

    requestAnimationFrame(animate);

    function animate() {

        thing.clear();

        count += 0.1;

        thing.lineStyle(30, 0xff0000, 1);
        thing.beginFill(0xffFF00, 0.5);

        thing.moveTo(-120 + Math.sin(count) * 20, -100 + Math.cos(count)* 20);
        thing.lineTo(120 + Math.cos(count) * 20, -100 + Math.sin(count)* 20);
        thing.lineTo(120 + Math.sin(count) * 20, 100 + Math.cos(count)* 20);
        thing.lineTo(-120 + Math.cos(count)* 20, 100 + Math.sin(count)* 20);
        thing.lineTo(-120 + Math.sin(count) * 20, -100 + Math.cos(count)* 20);

        thing.rotation = count * 0.1;
        renderer.render(stage);
        requestAnimationFrame( animate );
    }
}

function createGraphicsContext() {
    var graphics = new PIXI.Graphics();

    // set a fill and line style
    graphics.beginFill(0xFF3300);
    graphics.lineStyle(10, 0xffd900, 1);

    stage.addChild(graphics);

}

function drawPolygon1() {
    // set a fill and line style
    graphics.beginFill(0xFF3300);
    graphics.lineStyle(10, 0xffd900, 1);

    // draw a shape
    graphics.moveTo(50,50);
    graphics.lineTo(250, 50);
    graphics.lineTo(100, 100);
    graphics.lineTo(250, 220);
    graphics.lineTo(50, 220);
    graphics.lineTo(50, 50);
    graphics.endFill();
}

function drawPolygon2() {
    // set a fill and line style again
    graphics.lineStyle(10, 0xFF0000, 0.8);
    graphics.beginFill(0xFF700B, 1);

    // draw a second shape
    graphics.moveTo(210,300);
    graphics.lineTo(450,320);
    graphics.lineTo(570,350);
    graphics.lineTo(580,20);
    graphics.lineTo(330,120);
    graphics.lineTo(410,200);
    graphics.lineTo(210,300);
    graphics.endFill();
}

function drawRectangle() {
    // draw a rectangle
    graphics.lineStyle(2, 0x0000FF, 1);
    graphics.drawRect(50, 250, 100, 100);
}

function drawCircle() {
    // draw a circle
    graphics.lineStyle(0);
    graphics.beginFill(0xFFFF0B, 0.5);
    graphics.drawCircle(470, 200,100);

    graphics.lineStyle(20, 0x33FF00);
    graphics.moveTo(30,30);
    graphics.lineTo(600, 300);
}

function setupClick() {
    stage.click = stage.tap = function()
    {
        graphics.lineStyle(Math.random() * 30, Math.random() * 0xFFFFFF, 1);
        graphics.moveTo(Math.random() * 620,Math.random() * 380);
        graphics.lineTo(Math.random() * 620,Math.random() * 380);
    };
}
