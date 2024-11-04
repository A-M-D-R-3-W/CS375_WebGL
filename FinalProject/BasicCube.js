/////////////////////////////////////////////////////////////////////////////
//
//  BasicCube.js (by A-M-D-R-3-W)
//
//  A cube defined of 12 triangles
//


// GLSL template literal for syntax highlighting in vertex/fragment shaders
// For all transparency, I did not come up with this solution for syntax highlighting,
// but it is very useful in debugging the shaders.
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
            
            /*const vec4 frontColor = vec4(1.0, 1.0, 0.0, 1.0);
            const vec4 backColor = vec4(0.0, 1.0, 0.0, 1.0);

            void main() {
                fColor = gl_FrontFacing ? frontColor : backColor;
            }*/
            
        `;




        // looking down the negative z-axis
        // Six faces, each face is two triangles, each triangle is three vertices
        // Skip the w component for now, easier to add later in the vertex shader
        let positions = new Float32Array([

            // Front face (positive z)

            0.5, 0.5, 0.5,   //vertex 0
            -0.5, 0.5, 0.5,  //vertex 1
            -0.5, -0.5, 0.5, //vertex 2
            
            0.5, 0.5, 0.5,   //vertex 3
            -0.5, -0.5, 0.5, //vertex 4
            0.5, -0.5, 0.5,  //vertex 5
            
            // Back face (negative z)

            -0.5, -0.5, -0.5, //vertex 6
            -0.5, 0.5, -0.5,  //vertex 7
            0.5, 0.5, -0.5,   //vertex 8
            
            0.5, -0.5, -0.5,  //vertex 9
            -0.5, -0.5, -0.5, //vertex 10
            0.5, 0.5, -0.5,   //vertex 11
            
            // Top face (positive y)

            -0.5, 0.5, -0.5,  //vertex 12
            -0.5, 0.5, 0.5,   //vertex 13
            0.5, 0.5, 0.5,    //vertex 14
            
            0.5, 0.5, -0.5,   //vertex 15
            -0.5, 0.5, -0.5,  //vertex 16
            0.5, 0.5, 0.5,    //vertex 17
            
            // Bottom face (negative y)

            0.5, -0.5, 0.5,   //vertex 18
            -0.5, -0.5, 0.5,  //vertex 19
            -0.5, -0.5, -0.5, //vertex 20
            
            0.5, -0.5, 0.5,   //vertex 21
            -0.5, -0.5, -0.5, //vertex 22
            0.5, -0.5, -0.5,  //vertex 23
            
            // Right face (positive x)

            0.5, 0.5, 0.5,    //vertex 24
            0.5, -0.5, 0.5,   //vertex 25
            0.5, -0.5, -0.5,  //vertex 26
            
            0.5, 0.5, 0.5,    //vertex 27
            0.5, -0.5, -0.5,  //vertex 28
            0.5, 0.5, -0.5,   //vertex 29
            
            // Left face (negative x)
            
            -0.5, -0.5, -0.5, //vertex 30
            -0.5, -0.5, 0.5,  //vertex 31
            -0.5, 0.5, 0.5,   //vertex 32
            
            -0.5, 0.5, -0.5,  //vertex 33
            -0.5, -0.5, -0.5, //vertex 34
            -0.5, 0.5, 0.5,   //vertex 35
        ]);


        // Colors for each face
        // declaring them here makes it easier to change colors later,
        // and also makes it easier to see the color-vertex relationship

        const color1 = [1.0, 0.6784, 0.6784]; // red
        const color2 = [1.0, 0.8392, 0.6471]; // orange
        const color3 = [0.9922, 1.0, 0.7137]; // yellow
        const color4 = [0.7922, 1.0, 0.7490]; // green
        const color5 = [0.6078, 0.9647, 1.0]; // light blue
        const color6 = [0.6275, 0.7686, 1.0]; // dark blue
        const color7 = [0.7412, 0.6980, 1.0]; // purple
        const color8 = [1.0, 0.7765, 1.0];    // pink



        let colors = new Float32Array([

            // Front face (positive z)

            ...color1, //vertex 0
            ...color2, //vertex 1
            ...color3, //vertex 2

            ...color1, //vertex 3
            ...color3, //vertex 4
            ...color7, //vertex 5


            // Back face (negative z)

            ...color4, //vertex 6
            ...color8, //vertex 7
            ...color6, //vertex 8

            ...color5, //vertex 9
            ...color4, //vertex 10
            ...color6, //vertex 11


            // Top face (positive y)

            ...color8, //vertex 12
            ...color2, //vertex 13
            ...color1, //vertex 14

            ...color6, //vertex 15
            ...color8, //vertex 16
            ...color1, //vertex 17


            // Bottom face (negative y)

            ...color7, //vertex 18
            ...color3, //vertex 19
            ...color4, //vertex 20

            ...color7, //vertex 21
            ...color4, //vertex 22
            ...color5, //vertex 23


            // Right face (positive x)

            ...color1, //vertex 24
            ...color7, //vertex 25
            ...color5, //vertex 26

            ...color1, //vertex 27
            ...color5, //vertex 28
            ...color6, //vertex 29


            // Left face (negative x)

            ...color4, //vertex 30
            ...color3, //vertex 31
            ...color2, //vertex 32

            ...color8, //vertex 33
            ...color4, //vertex 34
            ...color2, //vertex 35
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

            // Enable the attributes
            aPosition.enable();
            aColor.enable();

            gl.drawArrays(gl.TRIANGLES, 0, aPosition.count);

            // Disable the attributes (clean up)
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