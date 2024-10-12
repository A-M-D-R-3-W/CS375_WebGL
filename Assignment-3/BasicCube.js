/////////////////////////////////////////////////////////////////////////////
//
//  BasicCube.js
//
//  A cube defined of 12 triangles
//

// GLSL template literal for syntax highlighting in vertex/fragment shaders
function glsl(strings, ...values) {
    return strings.raw[0];
}

class BasicCube {
    constructor(gl, vertexShader, fragmentShader) {


    
        
        vertexShader ||= glsl`
            //uniform mat4 P;  // Projection transformation
            //uniform mat4 MV; // Model-view transformation
        
            void main() {

                // Vertex positions
                // 12 triangles (two triangles per face)
                // 3 vertices per triangle
                // 3 components per vertex (x, y, z)
                // Counter-clockwise winding order

                vColor[gl_VertexID] = 1.0;

                const vec3 vertices[] = vec3[3](
                    vec3( 1.0, 0.0, 0.0),       // Vertex 0
                    vec3(-0.5, 0.866, 0.0),     // Vertex 1
                    vec3(-0.5, -0.866, 0.0)     // Vertex 2
                );

                // Choose the appropriate vertex based on gl_VertexID
                gl_Position = vec4(vertices[gl_VertexID], 1.0);
            }
        `;

        fragmentShader ||= glsl`
            //uniform vec4 color;
            out vec4 fColor;

            void main() {
                fColor = vec4(1.0, 1.0, 0.0, 1.0);
            }
        `;



        // encapsulates our shader program (what was previously returned from initShaders(), 
        // and initializes all of the uniform variables.
        let program = new ShaderProgram(gl, this, vertexShader, fragmentShader);






        this.draw = () => {
            program.use();

            // drawArrays(type, starting index, number of indices)
            gl.drawArrays(gl.TRIANGLES, 0, 3);


        };
    }
};