/////////////////////////////////////////////////////////////////////////////
//
//  Tetrahedron.js
//
//  Class for rendering a tetrahedron, symmetric around the origin.  
//

'use strict;'

class Tetrahedron {
    constructor(gl, vertexShader, fragmentShader) {

        vertexShader ||= `
            uniform mat4 P;  // Projection transformation
            uniform mat4 MV; // Model-view transformation


            void main() {
                const vec3 vertices[] = vec3[4](
                    vec3(0, 0, 1),
                    vec3(0.9428, 0, -0.3333),
                    vec3(-0.4714, 0.8164, -0.3333),
                    vec3(-0.4714, -0.8164, -0.3333)
                );

                const ivec3 indices[] = ivec3[4](
                    ivec3(0, 2, 1),
                    ivec3(0, 3, 2),
                    ivec3(0, 1, 3),
                    ivec3(1, 2, 3)
                );

                vec4 v = vec4(vertices[indices[gl_InstanceID][gl_VertexID]], 1.0);
                gl_Position = P * MV * v;
            }
        `;

        fragmentShader ||= `
            uniform vec4 color;
            out vec4 fColor;

            void main() {
                fColor = color;
            }
        `;

        let program = initShaders(gl, vertexShader, fragmentShader);
        gl.useProgram(program);

        let setupUniform = (program, name, value) => {
            let location = gl.getUniformLocation(program, name);
            this[name] = value;
            program[name] = ()  => {
                switch(value.type) {
                    case "vec4":
                        gl.uniform4fv(location, this[name]);
                        break;

                    case "mat4":
                        gl.uniformMatrix4fv(location, false, flatten(this[name])); 
                        break;
                }
            };
        };

        setupUniform(program, "MV", mat4());
        setupUniform(program, "P", mat4());
        setupUniform(program, "color", vec4(0.8, 0.8, 0.8, 1.0));

        this.draw = () => {
            gl.useProgram(program);

            program.MV();
            program.P();
            program.color();

            gl.drawArraysInstanced(gl.TRIANGLES, 0, 3, 4);

            gl.useProgram(null);
        };
    }

    get AABB() { 
        return { 
            min : [-0.4714, -0.8164, -0.3333],
            max : [0.9428, 0.8164, 1.0]
        }; 
    }

};