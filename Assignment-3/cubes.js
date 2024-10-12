/////////////////////////////////////////////////////////////////////////////
//
//  cubes.js
//
//  The main application source for the cube display program.  The
//    application will display each of your three Cube class implementations
//    in a single WebGL window (using multiple viewports).
//
//  This file uses our approach of defining our render() function within
//    our init() function to minimize the use of global variables.  render()
//    is defined using the more modern JavaScript approach using the '=>'
//    syntax (i.e., () => { ... })
//

function init() {
    let canvas = document.getElementById("webgl-canvas");
    let gl = canvas.getContext("webgl2");

    gl.clearColor(0, 0, 1, 1);

    gl.enable(gl.SCISSOR_TEST);
    gl.enable(gl.DEPTH_TEST);

    let cubes = [
        new BasicCube(gl),
        new IndexedCube(gl),
        new ExperimentalCube(gl)
    ];

    let near = 2.0;
    let far = 4.0;
    let P = perspective(60.0, 1.0, near, far);

    for (let c of cubes) {
        c.P = P;
    }

    let ms = new MatrixStack;
    ms.translate(0.0, 0.0, -0.5*(near + far));

    let angle = 0.0;

    let render = () => {

        let views = [
            { 
                vp : [  20, 340, 300, 300 ],
                cc : [ 1, 0, 0, 1 ],
            },
            { 
                vp : [ 340, 340, 300, 300 ],
                cc : [ 0, 1, 0, 1 ],
            },
            { 
                vp : [ 180,  20, 300, 300 ],
                cc : [ 0, 0, 1, 1 ],
            },
        ];

        angle += 3.0;
        angle %= 360.0;

        ms.push();
        ms.rotate(angle, [1, 1, 0]);

        for (let i = 0; i < views.length; ++i) {
            let v = views[i];
            gl.viewport(...v.vp);
            gl.scissor(...v.vp);
            gl.clearColor(...v.cc);
            gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);

            cubes[i].MV = ms.current();
            cubes[i].draw();
        }
        ms.pop();

        requestAnimationFrame(render);
    };

    render();
}

window.onload = init;