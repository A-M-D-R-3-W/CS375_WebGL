
let gl = undefined;

function init() { // init can be defined as a lambda function (see examples)
    let canvas = document.getElementById("webgl-canvas");
    gl = canvas.getContext("webgl2");
    if (!gl) { alert("Your Web browser doesn't support WebGL 2\nPlease contact Dave"); }

    // Add initialization code here

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

    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT); // Clear the color as well as the depth buffer (part of the depth test)

    // Update the rotation angle (for all shapes that are animated)
    angle += 1.0;
    angle %= 360.0;


    // ----------------- Drawing the Axes ----------------- //

    ms.push();
    ms.translate(0.3, -0.6, 0); // translate(z, y, x)
    ms.rotate(40, [0, 1, 0]);    // rotate(angle, [x, y, z])
    ms.rotate(25, [1, 0, 0]);
    ms.scale(0.5);              // scale
    axes.MV = ms.current();
    axes.draw();
    ms.pop();


    // ---------------------------------------------------- //


    // ----------------- Drawing the Cylinder ----------------- //

    ms.push();
    ms.translate(-0.5, 0.5, 0)           // translate(z, y, x)
    ms.rotate(angle, [1, 1, 0]);    // rotate(angle, [x, y, z])
    ms.scale(0.3);                  // scale(s)
    cyl.MV = ms.current();
    cyl.draw();
    ms.pop();


    // ---------------------------------------------------- //




    // ----------------- Drawing the Tetrahedron (stationary) ----------------- //

    ms.push();
    ms.translate(-0.5, 0, 0)        // translate(z, y, x)
    //ms.rotate(angle, [1, 1, 0]);    // rotate(angle, [x, y, z])
    ms.scale(0.4);                  // scale(s)
    tetra.MV = ms.current();
    tetra.draw();
    ms.pop();


    // ---------------------------------------------------- //


    // ----------------- Drawing the Cone ----------------- //
    // Transforms should follow this order (TRS): Translate -> Rotate -> Scale

    // Draw the cone
    ms.push();
    ms.translate(0.5, 0, 0)         // translate(z, y, x)
    ms.rotate(angle, [1, 1, 0]);    // rotate(angle, [x, y, z])
    ms.scale(0.4);                  // scale(s)
    cone.MV = ms.current();
    cone.draw();
    ms.pop();

    // ---------------------------------------------------- //




    requestAnimationFrame(() => render(cone, tetra, cyl, axes, ms, angle)); // Call render() again (anonymously)

}


window.onload = init; // acts like calling main

