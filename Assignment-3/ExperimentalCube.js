/////////////////////////////////////////////////////////////////////////////
//
//  ExperimentalCube.js
//
//  A cube defined of 12 triangles using vertex indices (in the form of gl_VertexID),
//  bufferless rendering, and procedural position/color assignment in the vertex shader.
//
//  Interestingly, I found that this method resulted in faster rendering than both
//  Basic Cube and Indexed Cube. This may be due to my reasonably powerful GPU. Doing
//  all the heavy lifting.
//

// GLSL template literal for syntax highlighting in vertex/fragment shaders
function glsl(strings) {
    return strings.raw[0];
}

class ExperimentalCube {
    constructor(gl, vertexShader, fragmentShader) {

        vertexShader ||= glsl`

            uniform mat4 P;  // Projection transformation
            uniform mat4 MV; // Model-view transformation

            out vec4 vColor;
        
            void main() {

                vec3 position;
                vec3 color;

                switch (gl_VertexID) { // assign position and color based on gl_VertexID (same concept as indexed cube)
                    case 0: case 3: case 14: case 17: case 24: case 27:
                        position = vec3(0.5, 0.5, 0.5);      // position 0
                        color = vec3(1.0, 0.6784, 0.6784);   // red
                        break;
                    case 1: case 13: case 32: case 35:
                        position = vec3(-0.5, 0.5, 0.5);     // position 1
                        color = vec3(1.0, 0.8392, 0.6471);   // orange
                        break;
                    case 2: case 4: case 19: case 31:
                        position = vec3(-0.5, -0.5, 0.5);    // position 2
                        color = vec3(0.9922, 1.0, 0.7137);   // yellow
                        break;
                    case 6: case 10: case 20: case 22: case 30: case 34:
                        position = vec3(-0.5, -0.5, -0.5);   // position 3
                        color = vec3(0.7922, 1.0, 0.7490);   // green
                        break;
                    case 9: case 23: case 26: case 28:
                        position = vec3(0.5, -0.5, -0.5);   // position 4
                        color = vec3(0.6078, 0.9647, 1.0);  // light blue
                        break;
                    case 8: case 11: case 15: case 29:
                        position = vec3(0.5, 0.5, -0.5);    // position 5
                        color = vec3(0.6275, 0.7686, 1.0);  // dark blue
                        break;
                    case 5: case 18: case 21: case 25:
                        position = vec3(0.5, -0.5, 0.5);    // position 6
                        color = vec3(0.7412, 0.6980, 1.0);  // purple
                        break;
                    case 7: case 12: case 16: case 33:
                        position = vec3(-0.5, 0.5, -0.5);   // position 7
                        color = vec3(1.0, 0.7765, 1.0);     // pink
                        break;
                }
                
                vColor = vec4(color, 1.0);
                gl_Position = P * MV * vec4(position, 1.0);
            }
        `;

        fragmentShader ||= glsl`

            out vec4 fColor;
            in vec4 vColor;

            void main() {
                fColor = vColor;
            }
        `;

        let program = new ShaderProgram(gl, this, vertexShader, fragmentShader);

        this.draw = () => {
            program.use();
            gl.drawArrays(gl.TRIANGLES, 0, 36);
        };
    }
};