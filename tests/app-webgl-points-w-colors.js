/*================Grid dimensions=================*/

const stageWidth = 800;
const stageHeight = 800;
const cellCountX = 20;
const cellCountY = 20;

const cellWidth = stageWidth / cellCountX;
const cellHeight = stageHeight / cellCountY;

/*================Creating a canvas=================*/

const canvas = document.createElement('canvas');
canvas.setAttribute('width', stageWidth);
canvas.setAttribute('height', stageHeight);
document.getElementById('container').appendChild(canvas);
const gl = canvas.getContext('webgl');

/*==========Defining and storing the geometry=======*/

const vertices = [
    0, 0,
    1, 1,
    2, 2,
    19, 19
];

const colors = [
    1.0,  0.0,  0.0,  1.0,    // red
    0.0,  1.0,  0.0,  1.0,    // green
    0.0,  0.0,  1.0,  1.0,    // blue
    1.0,  0.0,  0.0,  1.0     // red
];

// Create an empty buffer object to store the vertex buffer
var vertex_buffer = gl.createBuffer();

//Bind appropriate array buffer to it
gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer);

// Pass the vertex data to the buffer
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

// Unbind the buffer
gl.bindBuffer(gl.ARRAY_BUFFER, null);

// setup colors
const colorBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);


/*=========================Shaders========================*/

// vertex shader source code
var vertCode =
    `      
    attribute vec4 aVertexColor;
    attribute vec2 coordinates;

    uniform vec2 u_resolution;

    varying lowp vec4 vColor;

    void main() {
        // convert the position from pixels to 0.0 to 1.0
        vec2 zeroToOne = (coordinates + vec2(0.5, 0.5)) / u_resolution;

        // convert from 0->1 to 0->2
        vec2 zeroToTwo = zeroToOne * 2.0;

        // convert from 0->2 to -1->+1 (clipspace)
        vec2 clipSpace = zeroToTwo - 1.0;

        gl_Position = vec4(clipSpace * vec2(1, -1), 0, 1);
        vColor = aVertexColor;
        gl_PointSize = ${cellWidth.toFixed(1)};
    }
    `;

// Create a vertex shader object
var vertShader = gl.createShader(gl.VERTEX_SHADER);

// Attach vertex shader source code
gl.shaderSource(vertShader, vertCode);

// Compile the vertex shader
gl.compileShader(vertShader);

// fragment shader source code
var fragCode =
    `
    varying lowp vec4 vColor;

    void main(void) {
        gl_FragColor = vColor;
    }
    `;

// Create fragment shader object
var fragShader = gl.createShader(gl.FRAGMENT_SHADER);

// Attach fragment shader source code
gl.shaderSource(fragShader, fragCode);

// Compile the fragmentt shader
gl.compileShader(fragShader);

// Create a shader program object to store
// the combined shader program
var shaderProgram = gl.createProgram();

// Attach a vertex shader
gl.attachShader(shaderProgram, vertShader);

// Attach a fragment shader
gl.attachShader(shaderProgram, fragShader);

// Link both programs
gl.linkProgram(shaderProgram);

// Use the combined shader program object
gl.useProgram(shaderProgram);

/*======== Associating shaders to buffer objects ========*/

// Bind vertex buffer object
gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer);

// Get the attribute location
var coord = gl.getAttribLocation(shaderProgram, "coordinates");

// look up uniform locations
var resolutionUniformLocation = gl.getUniformLocation(shaderProgram, "u_resolution");

// set the resolution
gl.uniform2f(resolutionUniformLocation, stageWidth / cellWidth, stageHeight / cellHeight);

// Point an attribute to the currently bound VBO
gl.vertexAttribPointer(coord, 2, gl.FLOAT, false, 0, 0);

// Enable the attribute
gl.enableVertexAttribArray(coord);

/*========Colors=========*/

// Tell WebGL how to pull out the colors from the color buffer
// into the vertexColor attribute.
{
    const numComponents = 4;
    const type = gl.FLOAT;
    const normalize = false;
    const stride = 0;
    const offset = 0;
    const colorVertexAttribLoc = gl.getAttribLocation(shaderProgram, 'aVertexColor');
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    gl.vertexAttribPointer(
        colorVertexAttribLoc,
        numComponents,
        type,
        normalize,
        stride,
        offset);
    gl.enableVertexAttribArray(colorVertexAttribLoc);
}


/*============= Drawing the primitive ===============*/

// Clear the canvas
gl.clearColor(1, 1, 1, 1);

// Enable the depth test
gl.enable(gl.DEPTH_TEST);

// Clear the color buffer bit
gl.clear(gl.COLOR_BUFFER_BIT);

// Set the view port
gl.viewport(0,0,canvas.width,canvas.height);

// Draw the triangle
gl.drawArrays(gl.POINTS, 0, vertices.length / 2);
