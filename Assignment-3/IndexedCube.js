/////////////////////////////////////////////////////////////////////////////
//
//  IndexedCube.js
//
//  A cube defined of 12 triangles using vertex indices.
//


// GLSL template literal for syntax highlighting in vertex/fragment shaders
// For all transparency, I did not come up with this solution for syntax highlighting,
// but it is very useful in debugging the shaders.
function glsl(strings) {
    return strings.raw[0];
}



class IndexedCube {
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
        `;




        // looking down the negative z-axis
        // Six faces, each face is two triangles, each triangle is three vertices
        // Skip the w component for now, easier to add later in the vertex shader
        let positions = new Float32Array([

            0.5, 0.5, 0.5,      // position 0
            -0.5, 0.5, 0.5,     // position 1
            -0.5, -0.5, 0.5,    // position 2
            -0.5, -0.5, -0.5,   // position 3
            0.5, -0.5, -0.5,   // position 4
            0.5, 0.5, -0.5,   // position 5
            0.5, -0.5, 0.5,   // position 6
            -0.5, 0.5, -0.5   // position 7
            
        ]);


        // Colors for each face
        // declaring them here makes it easier to change colors later,
        // and also makes it easier to see the color-vertex relationship
        // all values are normalized to 0-1 from 0-255

        const color1 = [255/255, 173/255, 173/255]; // red
        const color2 = [255/255, 214/255, 165/255]; // orange
        const color3 = [253/255, 255/255, 182/255]; // yellow
        const color4 = [202/255, 255/255, 191/255]; // green
        const color5 = [155/255, 246/255, 255/255]; // light blue
        const color6 = [160/255, 196/255, 255/255]; // dark blue
        const color7 = [189/255, 178/255, 255/255]; // purple
        const color8 = [255/255, 198/255, 255/255]; // pink



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


        let indices = new Uint16Array([

            // Front face 0, 1, 2, 3, 4, 5

            0, 1, 2,
            0, 2, 6,

            // Back face 6, 7, 8, 9, 10, 11

            3, 7, 5,
            4, 3, 5,

            // Top face 12, 13, 14, 15, 16, 17

            7, 1, 0,
            5, 7, 0,

            // Bottom face 18, 19, 20, 21, 22, 23

            6, 2, 3,
            6, 3, 4,

            // Right face 24, 25, 26, 27, 28, 29

            0, 6, 4,
            0, 4, 5,

            // Left face 30, 31, 32, 33, 34, 35

            3, 2, 1,
            7, 3, 1

        ]);


        indices = new Indices(gl, indices);


        // encapsulates our shader program (what was previously returned from initShaders(), 
        // and initializes all of the uniform variables.
        let program = new ShaderProgram(gl, this, vertexShader, fragmentShader);

        let aPosition = new Attribute(gl, program, "aPosition", positions, 3, gl.FLOAT);
        let aColor = new Attribute(gl, program, "aColor", colors, 3, gl.FLOAT);


        this.draw = () => {
            program.use();

            aPosition.enable();
            aColor.enable();
            indices.enable();

            gl.drawElements(gl.TRIANGLES, indices.count, indices.type, 0);
            
            indices.disable();
            aColor.disable();
            aPosition.disable();
        };
    }
};
