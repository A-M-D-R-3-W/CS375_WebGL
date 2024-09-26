/////////////////////////////////////////////////////////////////////////////
//
//  Cylinder.js
//
//  Class for rendering a cylinder with a height of one, and base radius of
//    one (diameter of two).  The origin of the cylinder is in the middle of
//    the disk at z = 0.
//

'use strict;'

class Cylinder {
    constructor(gl, numSides, vertexShader, fragmentShader) {

        vertexShader ||= `
            uniform int  numSides; // number of slices around the perimeter

            uniform mat4 P;  // Projection transformation
            uniform mat4 MV; // Model-view transformation

            void main() {
                float iid = float(gl_InstanceID);
                vec4  v;  // our generated vertex

                if (gl_VertexID > 0 && gl_VertexID < 5) {
                    const float Pi = 3.14159265358979;
                    float delta = 2.0 * Pi / float(numSides);

                    float side = float(gl_VertexID % 2);
                    float angle = (iid - side) * delta;
                    
                    v.xy = vec2(cos(angle), sin(angle));
                }

                v.zw = vec2(float(gl_VertexID / 3), 1.0);

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

        let setupConstant = (name, value) => {
            let location = gl.getUniformLocation(program, name);
            gl.uniform1i(location, value);
        };

        setupConstant("numSides", numSides);
        gl.useProgram(null);

        this.draw = () => {
            gl.useProgram(program);

            program.MV();
            program.P();
            program.color();

            gl.drawArraysInstanced(gl.TRIANGLE_STRIP, 0, 6, numSides);

            gl.useProgram(null);
        };
    }

    get AABB() { 
        return { 
            min : [-1.0, -1.0, 0.0], 
            max : [1.0, 1.0, 1.0] };
    }
};


