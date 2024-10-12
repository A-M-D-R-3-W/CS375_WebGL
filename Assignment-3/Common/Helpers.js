/////////////////////////////////////////////////////////////////////////////
//
//  Helpers.js
//

'use strict;'

class ShaderProgram {
    constructor(gl, object, vertexShader, fragmentShader) {
        let program = initShaders(gl, vertexShader, fragmentShader);
        let numUniforms = gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS);
        
        let uniformFuncs = [];
        
        for (let i = 0; i < numUniforms; ++i) {
            let uniform = gl.getActiveUniform(program, i);
            let name = uniform.name;
            let location = gl.getUniformLocation(program, name);
        
            switch (uniform.type) {
                case gl.FLOAT:
                    uniformFuncs.push(() => gl.uniform1f(location, object[name]));
                    break;
        
                case gl.FLOAT_MAT4:
                    uniformFuncs.push(() => gl.uniformMatrix4fv(location, false, flatten(object[name])));
                    break;
        
                default:
                    console.log("Unknown uniform type " + uniform.type);
            }

            object[name] = undefined;
        }

        this.program = program;

        this.use = () => {
            gl.useProgram(program);
            for (let f of uniformFuncs) {
                f();
            }
        }
    }
};

class Attribute {
    constructor(gl, shaderProgram, name, values, numComponents, type, 
        normalize = false, stride = 0, offset = 0) {

        let program = shaderProgram.program;

        let buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        gl.bufferData(gl.ARRAY_BUFFER, values, gl.STATIC_DRAW);

        let index = gl.getAttribLocation(program, name);

        this.count = values.length / numComponents;
        
        if (stride != 0) {
            offset = numComponents * values.BYTES_PER_ELEMENT;
        }

        this.enable = () => {
            gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
            gl.vertexAttribPointer(index, numComponents, type, 
                normalize, stride, offset);
            gl.enableVertexAttribArray(index);
        };

        this.disable = () => {
            gl.disableVertexAttribArray(index);
            gl.bindBuffer(gl.ARRAY_BUFFER, null);
        }
    }
};

class Indices {
    constructor(gl, indices) {
        let buffer = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);

        this.count = indices.length;
        this.type = {
            1 : gl.UNSIGNED_BYTE,
            2 : gl.UNSIGNED_SHORT,
            4 : gl.UNSIGNED_INT
        }[indices.BYTES_PER_ELEMENT];

        this.enable = () => gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffer);
        this.disable = () => gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
    };
};

class AABB {
    constructor(gl, object, min, max) {
        this.min = min;
        this.max = max;

        this.extents = min.map((x, i) => max[i] - x);
        this.center = min.map((x, i) => 0.5 * (x + max[i]));
        let r = 0.0;
        this.extents.map((x, i) => r += x*x);
        this.diameter = Math.sqrt(r);
        this.radius = 0.5 * this.diameter;

        let vertexShader = `
            uniform mat4 P;
            uniform mat4 MV;

            void main() {
                const vec3 min = vec3(${min});
                const vec3 max = vec3(${max});
                const vec3 extents = max - min;
                const vec3 center = min + 0.5*extents;

                const vec2 p[] = vec2[](
                    vec2(0, 0),
                    vec2(1, 0),
                    vec2(1, 1),
                    vec2(0, 1)
                );

                int dim = gl_VertexID / 8;
                int i = (dim + 1) % 3;
                int j = (dim + 2) % 3;
                int idx = (gl_VertexID % 8) / 2;

                vec3 v;
                v[dim] = float(gl_VertexID % 2);
                switch(dim) {
                    case 0: v.yz = p[idx]; break;
                    case 1: v.xz = p[idx]; break;
                    case 2: v.xy = p[idx]; break;
                }
                // v.yz = p[idx];
                // v[i] = p[idx][i];
                // v[j] = p[idx][j];
                
                v -= vec3(0.5);
                v *= extents;
                v += center;

                gl_Position = P * MV * vec4(v, 1.0);
            }
        `;

        let fragmentShader = `
            uniform vec4 color;
            out vec4 fColor;

            void main() {
                fColor = color;
            }
        `;

        let program = new ShaderProgram(gl, this, vertexShader, fragmentShader);

        this.color = vec4(1.0, 1.0, 1.0, 1.0);

        this.draw = () => {
            program.use();
            
            gl.drawArrays(gl.LINES, 0, 24);

            gl.useProgram(null);
        }
    }
}