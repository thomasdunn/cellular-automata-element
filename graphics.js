export class Graphics {

    constructor(cellWidth, cellHeight, stageWidth, stageHeight) {
        this.cellWidth = cellWidth;
        this.cellHeight = cellHeight;
        this.stageWidth = stageWidth;
        this.stageHeight = stageHeight;
        this.onData = [];
        this.offData = [];

        this.initCanvas(stageWidth, stageHeight);

        this.gl = this.canvas.getContext('webgl', {
            // do not clear previously rendering between drawArrays calls
            preserveDrawingBuffer: true
        });

        this.initPrograms();

        this.clear();
    }

    clear() {
        this.initBuffer();
        this.initContextSettings();
    }

    initBuffer() {
        // Create an empty buffer object to store the vertex buffer
        const vertexBuffer = this.gl.createBuffer();

        //Bind appropriate array buffer to it
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, vertexBuffer);

        // Pass the vertex data to the buffer
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array([]), this.gl.DYNAMIC_DRAW);

        // Unbind the buffer
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, null);
        this.vertexBuffer = vertexBuffer;
    }

    getShaders() {
        const vertexShaderCode =
            `      
            attribute vec2 a_cellCoordinates;
        
            uniform vec2 u_cellsResolution;
        
            void main() {
                // shift because clipspace needs cells centered on 0,0
                vec2 offsetCoordinates = a_cellCoordinates + vec2(0.5, 0.5);
                
                // convert the position from pixels to 0.0 to 1.0
                vec2 zeroToOne = offsetCoordinates / u_cellsResolution;
        
                // convert from 0->1 to 0->2
                vec2 zeroToTwo = zeroToOne * 2.0;
        
                // convert from 0->2 to -1->+1 (clipspace)
                vec2 clipSpace = zeroToTwo - 1.0;
                
                // input coordinates has positive Y going down, clipspace needs it to go up
                vec2 positiveYGoesUpClipSpace = clipSpace * vec2(1, -1);
        
                gl_Position = vec4(positiveYGoesUpClipSpace, 0, 1);
                gl_PointSize = ${this.cellWidth.toFixed(1)};
            }
        `;

        // fragment shader source code
        const onCellFragmentShaderCode =
            `
            void main(void) {
                // Black
                gl_FragColor = vec4(0.0, 0.0, 0.0, 1);
            }
        `;

        const offCellFragmentShaderCode =
            `
            void main(void) {
                // White
                gl_FragColor = vec4(1.0, 1.0, 1.0, 1);
            }
        `;

        return {
            vertex: this.createShader(this.gl.VERTEX_SHADER, vertexShaderCode),
            onCellFragment: this.createShader(this.gl.FRAGMENT_SHADER, onCellFragmentShaderCode),
            offCellFragment: this.createShader(this.gl.FRAGMENT_SHADER, offCellFragmentShaderCode)
        };
    }

    createShader(type, code) {
        // Create shader object
        const shader = this.gl.createShader(type);

        // Attach vertex shader source code
        this.gl.shaderSource(shader, code);

        // Compile the vertex shader
        this.gl.compileShader(shader);

        return shader;
    }

    getProgram(state) {
        if (state === 'on') {
            return this.onCellProgram;
        }
        else if (state === 'off') {
            return this.offCellProgram;
        }
    }

    createProgram(vertexShader, fragmentShader) {
        // Create a shader program object to store
        // the combined shader program
        const program = this.gl.createProgram();

        // Attach a vertex shader
        this.gl.attachShader(program, vertexShader);

        // Attach a fragment shader
        this.gl.attachShader(program, fragmentShader);

        // Link both programs
        this.gl.linkProgram(program);

        this.gl.validateProgram(program);

        if (! this.gl.getProgramParameter( program, this.gl.LINK_STATUS) ) {
            const info = this.gl.getProgramInfoLog(program);
            const msg = 'Could not compile WebGL program. \n\n' + info;

            console.error(msg);
            throw msg;
        }
        return program;
    }

    useProgram(state) {
        this.gl.useProgram(this.getProgram(state));
    }

    initPrograms() {
        const {vertex, onCellFragment, offCellFragment} = this.getShaders();

        this.onCellProgram = this.createProgram(vertex, onCellFragment);
        this.offCellProgram = this.createProgram(vertex, offCellFragment);
    }

    loadBuffer(state, data) {
        const program = this.getProgram(state);

        // Bind vertex buffer object
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertexBuffer);

        // Get the attribute location
        const cellCoordinates = this.gl.getAttribLocation(program, "a_cellCoordinates");

        // look up uniform locations
        const resolutionUniformLocation = this.gl.getUniformLocation(program, "u_cellsResolution");

        // set the resolution
        this.gl.uniform2f(resolutionUniformLocation, this.stageWidth / this.cellWidth, this.stageHeight / this.cellHeight);

        // fill up the buffer
        // Pass the vertex data to the buffer
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(data), this.gl.DYNAMIC_DRAW);

        // Point an attribute to the currently bound VBO
        this.gl.vertexAttribPointer(cellCoordinates, 2, this.gl.FLOAT, false, 0, 0);

        // Enable the attribute
        this.gl.enableVertexAttribArray(cellCoordinates);
    }

    initContextSettings() {
        // Clear the canvas
        this.gl.clearColor(1.0, 1.0, 1.0, 1);

        // Enable the depth test
        this.gl.disable(this.gl.DEPTH_TEST);

        // Clear the color buffer bit
        this.gl.clear(this.gl.COLOR_BUFFER_BIT);

        // Set the view port
        this.gl.viewport(0,0, this.canvas.width, this.canvas.height);
    }

    initCanvas(stageWidth, stageHeight) {
        this.canvas = document.createElement('canvas');
        this.canvas.setAttribute('width', stageWidth);
        this.canvas.setAttribute('height', stageHeight);
    }

    get view() {
        return this.canvas;
    }

    setBufferData(on, off) {
        this.onData = on;
        this.offData = off;
    }

    render() {
        if (this.offData.length > 0) {
            this.useProgram('off');
            this.loadBuffer('off', this.offData);
            this.gl.drawArrays(this.gl.POINTS, 0, this.offData.length / 2);
        }

        if (this.onData.length > 0) {
            this.useProgram('on');
            this.loadBuffer('on', this.onData);
            this.gl.drawArrays(this.gl.POINTS, 0, this.onData.length / 2);
        }
    }
}
