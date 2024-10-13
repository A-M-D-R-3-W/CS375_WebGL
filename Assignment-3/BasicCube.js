/////////////////////////////////////////////////////////////////////////////
//
//  BasicCube.js
//
//  A cube defined of 12 triangles
//

// GLSL template literal for syntax highlighting in vertex/fragment shaders
function glsl(strings) {
    return strings.raw[0];
}

class BasicCube {
    constructor(gl, vertexShader, fragmentShader) {


        vertexShader ||= glsl`

            // From Class 12

            // Vertex position (input to vertex shader)
            // aPosition is an attribute, so it has a leading 'a'
            // Can be a vec4, but using vec3 as all vertices have w=1.0
            in vec3 aPosition;

            in vec3 aColor;

            out vec4 vColor;

            uniform mat4 P;  // Projection transformation
            uniform mat4 MV; // Model-view transformation

            // webGL version of float is gl.FLOAT
        
            void main() {

                vColor = vec4(aColor, 1.0);

                // Set gl_Position to the transformed vertex position, and set w to 1.0
                gl_Position = P * MV * vec4(aPosition, 1.0);

            }
        `;

        fragmentShader ||= glsl`

            out vec4 fColor;
            in vec4 vColor;

            void main() {
                fColor = vColor;
            }

            // Front facing (yellow, correct) and back facing (green, incorrect) colors
            /*
            const vec4 frontColor = vec4(1.0, 1.0, 0.0, 1.0);
            const vec4 backColor = vec4(0.0, 1.0, 0.0, 1.0);

            void main() {
                fColor = gl_FrontFacing ? frontColor : backColor;
            }
            */

        `;





        // looking down the negative z-axis
        // Six faces, each face is two triangles, each triangle is three vertices
        // Skip the w component for now, easier to add later in the vertex shader
        let positions = new Float32Array([

            // Front face
            0.5, 0.5, 0.5,
            -0.5, 0.5, 0.5,
            -0.5, -0.5, 0.5,

            0.5, 0.5, 0.5,
            -0.5, -0.5, 0.5,
            0.5, -0.5, 0.5,


            // Back face
            0.5, 0.5, -0.5,
            -0.5, 0.5, -0.5,
            -0.5, -0.5, -0.5,

            0.5, 0.5, -0.5,
            -0.5, -0.5, -0.5,
            0.5, -0.5, -0.5,


            // Top face
            0.5, 0.5, 0.5,
            -0.5, 0.5, 0.5,
            -0.5, 0.5, -0.5,

            0.5, 0.5, 0.5,
            -0.5, 0.5, -0.5,
            0.5, 0.5, -0.5,


            // Bottom face
            0.5, -0.5, 0.5,
            -0.5, -0.5, 0.5,
            -0.5, -0.5, -0.5,

            0.5, -0.5, 0.5,
            -0.5, -0.5, -0.5,
            0.5, -0.5, -0.5,


            // Right face
            0.5, 0.5, 0.5,
            0.5, -0.5, 0.5,
            0.5, -0.5, -0.5,

            0.5, 0.5, 0.5,
            0.5, -0.5, -0.5,
            0.5, 0.5, -0.5,


            // Left face
            -0.5, 0.5, 0.5,  
            -0.5, -0.5, 0.5,  
            -0.5, -0.5, -0.5,

            -0.5, 0.5, 0.5,
            -0.5, -0.5, -0.5,
            -0.5, 0.5, -0.5,

        ])

        // orange: 1.0, 0.608, 1.0,
        // yellow: 1.0, 1.0, 0.0,
        // green: 0.0, 1.0, 0.0,
        // blue: 0.0, 0.0, 1.0,
        // purple: 1.0, 0.0, 1.0,
        // white: 1.0, 1.0, 1.0,


        let colors = new Float32Array([

            // Front face
            1.0,  0.6, 0.0,
            1.0,  0.6, 0.0,
            1.0,  0.6, 0.0,

            1.0,  0.6, 0.0,
            1.0,  0.6, 0.0,
            1.0,  0.6, 0.0,


            // Back face
            1.0, 1.0, 0.0,
            1.0, 1.0, 0.0,
            1.0, 1.0, 0.0,

            1.0, 1.0, 0.0,
            1.0, 1.0, 0.0,
            1.0, 1.0, 0.0,


            // Top face
            0.0, 1.0, 0.0,
            0.0, 1.0, 0.0,
            0.0, 1.0, 0.0,

            0.0, 1.0, 0.0,
            0.0, 1.0, 0.0,
            0.0, 1.0, 0.0,


            // Bottom face
            0.0, 0.0, 1.0,
            0.0, 0.0, 1.0,
            0.0, 0.0, 1.0,

            0.0, 0.0, 1.0,
            0.0, 0.0, 1.0,
            0.0, 0.0, 1.0,


            // Right face
            1.0, 0.0, 1.0,
            1.0, 0.0, 1.0,
            1.0, 0.0, 1.0,

            1.0, 0.0, 1.0,
            1.0, 0.0, 1.0,
            1.0, 0.0, 1.0,


            // Left face
            1.0, 1.0, 1.0, 
            1.0, 1.0, 1.0, 
            1.0, 1.0, 1.0,

            1.0, 1.0, 1.0,
            1.0, 1.0, 1.0,
            1.0, 1.0, 1.0,
        ]);



        // Manual version, as opposed to using the Attribute class
        /*
        // Create and bind a buffer - from Class 12

        // Create a buffer to store the vertex positions
        let buffer = gl.createBuffer();
        // Bind the buffer
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        // Load the buffer with data
        gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);
        */







        // encapsulates our shader program (what was previously returned from initShaders(), 
        // and initializes all of the uniform variables.
        let program = new ShaderProgram(gl, this, vertexShader, fragmentShader);



        let aPosition = new Attribute(gl, program, "aPosition", positions, 3, gl.FLOAT);
        let aColor = new Attribute(gl, program, "aColor", colors, 3, gl.FLOAT);



        this.draw = () => {
            program.use();

            aPosition.enable();
            aColor.enable();

            gl.drawArrays(gl.TRIANGLES, 0, aPosition.count);

            aPosition.disable();
            aColor.disable();






            // Manual version of the above code, as opposed to using the Attribute class

            /*
            // Class 12

            // Specifying the connection --------------------------------------------

            // Determine the variable's location just like we did for uniforms,
            // and store that location for later use.
            let location = gl.getAttribLocation(program.program, 'aPosition');

            // ----------------------------------------------------------------------


            // Configuring the data -------------------------------------------------

            // Bind the buffer
            gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
            
            // Specify it's data layout
            gl.vertexAttribPointer(location, 3, gl.FLOAT, false, 0, 0);

            // Turn on the flow of data (from buffer to attribute)
            gl.enableVertexAttribArray(location);
            

            // Each model (draw call) will require its buffers 
            // bound and attributes specified (every frame)


            // Draw the cube
            // Notice that '3' matches what we passed to vertexAttribPointer
            gl.drawArrays(gl.TRIANGLES, 0, positions.length / 3);

            // ----------------------------------------------------------------------



            // Cleaning up ----------------------------------------------------------

            // Once done drawing, disable the buffers and attribute arrays
            gl.disableVertexAttribArray(location);
            gl.bindBuffer(gl.ARRAY_BUFFER, null);

            // ----------------------------------------------------------------------
            */
        };
    }
};