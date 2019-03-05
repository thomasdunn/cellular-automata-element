/*================Grid dimensions=================*/

const stageWidth = 900;
const stageHeight = 900;
const cellCountX = 3;
const cellCountY = 3;

const cellWidth = stageWidth / cellCountX;
const cellHeight = stageHeight / cellCountY;

/*================Creating a canvas=================*/

const canvas = document.createElement('canvas');
canvas.setAttribute('width', stageWidth);
canvas.setAttribute('height', stageHeight);
document.getElementById('container').appendChild(canvas);
const gl = canvas.getContext('webgl');

/*==========Defining and storing the geometry=======*/

const verticesArrays = [
    {
        on: [
            0, 0,
            2, 0,
            1, 1,
            0, 2,
            2, 2
        ],
        off: [
            1, 0,
            0, 1,
            2, 1,
            1, 2
        ]
    },
    {
        on: [
            1, 0,
            0, 1,
            2, 1,
            1, 2
        ],
        off: [
            0, 0,
            2, 0,
            1, 1,
            0, 2,
            2, 2
        ]
    }
];
const bufferArrays = [{}, {}];

loadVertexBuffer(0, 'on');
loadVertexBuffer(0, 'off');
loadVertexBuffer(1, 'on');
loadVertexBuffer(1, 'off');

// vertex shader source code
var vertCode =
    `      
    attribute vec2 coordinates;

    uniform vec2 u_resolution;

    void main() {
        // convert the position from pixels to 0.0 to 1.0
        vec2 zeroToOne = (coordinates + vec2(0.5, 0.5)) / u_resolution;

        // convert from 0->1 to 0->2
        vec2 zeroToTwo = zeroToOne * 2.0;

        // convert from 0->2 to -1->+1 (clipspace)
        vec2 clipSpace = zeroToTwo - 1.0;

        gl_Position = vec4(clipSpace * vec2(1, -1), 0, 1);
        gl_PointSize = ${cellWidth.toFixed(1)};
    }
    `;


var vertShader = createShader(gl.VERTEX_SHADER, vertCode);

// fragment shader source code
var onFragCode =
    `
    void main(void) {
        gl_FragColor = vec4(0.0, 0.0, 0.0, 1);
    }
    `;

var offFragCode =
    `
    void main(void) {
        gl_FragColor = vec4(1.0, 1.0, 1.0, 1);
    }
    `;


var onFragShader = createShader(gl.FRAGMENT_SHADER, onFragCode);
var onShaderProgram = createProgram(vertShader, onFragShader);

var offFragShader = createShader(gl.FRAGMENT_SHADER, offFragCode);
var offShaderProgram = createProgram(vertShader, offFragShader);


/*============= Drawing the primitive ===============*/

// Clear the canvas
gl.clearColor(1, 1, 1, 1);

// Enable the depth test
gl.enable(gl.DEPTH_TEST);

// Clear the color buffer bit
gl.clear(gl.COLOR_BUFFER_BIT);

// Set the view port
gl.viewport(0,0,canvas.width,canvas.height);

function draw(index, state) {
    useProgram(index, state);

// Draw the points
    gl.drawArrays(gl.POINTS, 0, verticesArrays[index][state].length / 2);
}

function *generateStates() {
    const states = ['on','off'];

    while (true) {
        for (let i = 0; i < 2; i++) {
            for (let s = 0; s < 2; s++) {
                yield {
                    index: i,
                    state: states[s]
                };
            }
        }
    }
}

let states = generateStates();

function drawNext() {
    {
        let {index, state} = states.next().value;
        draw(index, state);
    }
    {
        let {index, state} = states.next().value;
        draw(index, state);
    }
}

let tick = 0;
const timeout = 64;

animate(tick);
function animate(t) {

    if (Math.floor(t / timeout) > tick) {
        tick++;
        drawNext();
    }
    requestAnimationFrame(animate);
}



////////////////////  Buffer and Program Setup  /////////////////////////

function loadVertexBuffer(index, state) {
    // Create an empty buffer object to store the vertex buffer
    let vertex_buffer = gl.createBuffer();

    //Bind appropriate array buffer to it
    gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer);

    // Pass the vertex data to the buffer
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(verticesArrays[index][state]), gl.STATIC_DRAW);

    // Unbind the buffer
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
    bufferArrays[index][state] = vertex_buffer;
}

function createShader(type, code) {
    // Create shader object
    var shader = gl.createShader(type);

    // Attach vertex shader source code
    gl.shaderSource(shader, code);

    // Compile the vertex shader
    gl.compileShader(shader);

    return shader;
}

function createProgram(vertexShader, fragmentShader) {
    // Create a shader program object to store
    // the combined shader program
    var program = gl.createProgram();

    // Attach a vertex shader
    gl.attachShader(program, vertexShader);

    // Attach a fragment shader
    gl.attachShader(program, fragmentShader);

    // Link both programs
    gl.linkProgram(program);

    return program;
}

function associateBuffers(index, state) {
    /*======== Associating shaders to buffer objects ========*/

    const program = getProgram(state);

    // Bind vertex buffer object
    gl.bindBuffer(gl.ARRAY_BUFFER, bufferArrays[index][state]);

    // Get the attribute location
    var coord = gl.getAttribLocation(program, "coordinates");

    // look up uniform locations
    var resolutionUniformLocation = gl.getUniformLocation(program, "u_resolution");

    // set the resolution
    gl.uniform2f(resolutionUniformLocation, stageWidth / cellWidth, stageHeight / cellHeight);

    // Point an attribute to the currently bound VBO
    gl.vertexAttribPointer(coord, 2, gl.FLOAT, false, 0, 0);

    // Enable the attribute
    gl.enableVertexAttribArray(coord);
}

function getProgram(state) {
    if (state === 'on') {
        return onShaderProgram;
    }
    else if (state === 'off') {
        return offShaderProgram;
    }
}

function useProgram(index, state) {
    gl.useProgram(getProgram(state));

    associateBuffers(index, state);
}
