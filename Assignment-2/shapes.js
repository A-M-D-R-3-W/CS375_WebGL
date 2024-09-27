//
//  Assingment 2: 3D Shapes
//  Andrew Garberolio
//


let gl = undefined;

function init() { // init can be defined as a lambda function (see examples)
    let canvas = document.getElementById("webgl-canvas");
    gl = canvas.getContext("webgl2");
    if (!gl) { alert("Your Web browser doesn't support WebGL 2\nPlease contact Dave"); }


    gl.clearColor(0.2, 0.2, 0.2, 1.0); // Background color
    gl.enable(gl.DEPTH_TEST); // Enable depth test


    let cone = new Cone(gl, 36);
    let tetra = new Tetrahedron(gl);
    let cyl = new Cylinder(gl, 36);
    let axes = new Axes(gl);
    let ms = new MatrixStack();
    let angle = 0;


    render(cone, tetra, cyl, axes, ms, angle); // Call render function

}

function render(cone, tetra, cyl, axes, ms, angle) { // if canvas is blank, render is broken

    // Clear the color as well as the depth buffer (part of the depth test)
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    // Update the rotation angle (for all shapes that are animated)
    angle += 1.0;
    angle %= 360.0;


    // TRS (Translate -> Rotate -> Scale) Boilerplate

    // ms.push();
    // translate(z, y, x);
    // rotate(angle, [x, y, z]);
    // scale(s);
    // shape.MV = ms.current();
    // shape.draw();
    // ms.pop();


    // ----------------- Drawing the Axes (stationary) ----------------- //

    ms.push();
    ms.translate(0.3, -0.6, 0);     // move to bottom right
    ms.rotate(40, [0, 1, 0]);       // rotate 40 degrees around y-axis
    ms.rotate(25, [1, 0, 0]);       // rotate 25 degrees around x-axis
    ms.scale(0.5);                  // scale 50%
    axes.MV = ms.current();
    axes.draw();
    ms.pop();

    // --------------------------------------------------------------- //


    // ----------------- Drawing the Cylinder ----------------- //

    ms.push();
    ms.translate(-0.5, 0.5, 0)      // move to top left
    ms.rotate(angle, [1, 1, 0]);    // rotate {angle} degrees around [1, 1, 0] (diagonal, animated)
    ms.scale(0.3);                  // scale 30%
    cyl.MV = ms.current();
    cyl.draw();
    ms.pop();

    // ------------------------------------------------------- //


    // ----------------- Drawing the Tetrahedron (stationary) ----------------- //

    ms.push();
    ms.translate(-0.5, 0, 0)        // move to the bottom left
    //ms.rotate(angle, [1, 1, 0]);  // how to rotate the tetrahedron
    ms.scale(0.4);                  // scale 40%
    tetra.MV = ms.current();
    tetra.draw();
    ms.pop();

    // ---------------------------------------------------- //


    // ----------------- Drawing the Cone ----------------- //

    ms.push();
    ms.translate(0.5, 0, 0)         // move to the top right
    ms.rotate(angle, [1, 1, 0]);    // rotate {angle} degrees around [1, 1, 0] (diagonal, animated)
    ms.scale(0.4);                  // scale 40%
    cone.MV = ms.current();
    cone.draw();
    ms.pop();

    // ---------------------------------------------------- //



    // Call render() again (anonymously)
    // This is the only way I could get it to work!
    requestAnimationFrame(() => render(cone, tetra, cyl, axes, ms, angle));

}


window.onload = init; // acts like calling main

