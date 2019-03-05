/*================Grid dimensions=================*/

const stageWidth = 800;
const stageHeight = 800;
const cellCountX = 200;
const cellCountY = 200;

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
    1, 0,
    1, 1,
    2, 1,
    0, 2,
    1, 2,
    199, 199
];

// Create an empty buffer object to store the vertex buffer
var vertex_buffer = gl.createBuffer();

//Bind appropriate array buffer to it
gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer);

// Pass the vertex data to the buffer
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

// Unbind the buffer
gl.bindBuffer(gl.ARRAY_BUFFER, null);

/*=========================Shaders========================*/

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

// Create a vertex shader object
var vertShader = gl.createShader(gl.VERTEX_SHADER);

// Attach vertex shader source code
gl.shaderSource(vertShader, vertCode);

// Compile the vertex shader
gl.compileShader(vertShader);

// fragment shader source code
var fragCode =
    `
    void main(void) {
        gl_FragColor = vec4(0.0, 0.0, 0.0, 1);
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
