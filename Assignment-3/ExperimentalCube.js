/////////////////////////////////////////////////////////////////////////////
//
//  ExperimentalCube.js
//
//  A cube defined ???
//

// create an array of the 8 colors of the cube, and use the index to also
// choose the color of each vertex

// GLSL template literal for syntax highlighting in vertex/fragment shaders
function glsl(strings, ...values) {
    return strings.raw[0];
}

class ExperimentalCube {
    constructor(gl, vertexShader, fragmentShader) {


    
        
        vertexShader ||= glsl`
            //uniform mat4 P;  // Projection transformation
            //uniform mat4 MV; // Model-view transformation

            uniform mat4 P;  // Projection transformation
            uniform mat4 MV; // Model-view transformation
        
            void main() {

                // Vertex positions
                // 12 triangles (two triangles per face)
                // 3 vertices per triangle
                // 3 components per vertex (x, y, z)
                // Counter-clockwise winding order

                const vec3 vertices[] = vec3[8](
                    vec3(0.5, 0.5, 0.5),      // position 0
                    vec3(-0.5, 0.5, 0.5),     // position 1
                    vec3(-0.5, -0.5, 0.5),    // position 2
                    vec3(-0.5, -0.5, -0.5),   // position 3
                    vec3(0.5, -0.5, -0.5),   // position 4
                    vec3(0.5, 0.5, -0.5),   // position 5
                    vec3(0.5, -0.5, 0.5),   // position 6
                    vec3(-0.5, 0.5, -0.5)   // position 7
                );

                vec3 position;

                // vertex indicies (left is positions above, and right is vertex numbers (gl_VertexID))
                // 0:  (0, 3, 14, 17, 24, 27)
                // 1:  (1, 13, 32, 35)
                // 2:  (2, 4, 19, 31)
                // 3:  (6, 10, 20, 22, 30, 34)
                // 4:  (9, 23, 26, 28)
                // 5:  (8, 11, 15, 29)
                // 6:  (5, 18, 21, 25)
                // 7:  (7, 12, 16, 33)

                switch (gl_VertexID) {
                    case 0: case 3: case 14: case 17: case 24: case 27:
                        position = vertices[0];
                        break;
                    case 1: case 13: case 32: case 35:
                        position = vertices[1];
                        break;
                    case 2: case 4: case 19: case 31:
                        position = vertices[2];
                        break;
                    case 6: case 10: case 20: case 22: case 30: case 34:
                        position = vertices[3];
                        break;
                    case 9: case 23: case 26: case 28:
                        position = vertices[4];
                        break;
                    case 8: case 11: case 15: case 29:
                        position = vertices[5];
                        break;
                    case 5: case 18: case 21: case 25:
                        position = vertices[6];
                        break;
                    case 7: case 12: case 16: case 33:
                        position = vertices[7];
                        break;
                }

                // negative x face is incorrect
                


                // Add switch case here to choose which position for each vertexID
                // do the same for color, and assign it to vColor to use in the 
                // fragment shader

                // Choose the appropriate vertex based on gl_VertexID
                gl_Position = P * MV * vec4(position, 1.0);
            }
        `;

        fragmentShader ||= glsl`
            //uniform vec4 color;
            out vec4 fColor;

            //void main() {
            //    fColor = vec4(1.0, 1.0, 0.0, 1.0);
            //}

            // Front facing (yellow, correct) and back facing (green, incorrect) colors
            const vec4 frontColor = vec4(1.0, 1.0, 0.0, 1.0);
            const vec4 backColor = vec4(0.0, 1.0, 0.0, 1.0);

            void main() {
                fColor = gl_FrontFacing ? frontColor : backColor;
            }

        `;



        // encapsulates our shader program (what was previously returned from initShaders(), 
        // and initializes all of the uniform variables.
        let program = new ShaderProgram(gl, this, vertexShader, fragmentShader);





        this.draw = () => {
            program.use();

            // drawArrays(type, starting index, number of indices)
            gl.drawArrays(gl.TRIANGLES, 0, 33);


        };
    }
};