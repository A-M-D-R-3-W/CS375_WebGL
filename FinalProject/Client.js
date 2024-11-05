


// Main program



//require('dotenv').config();
//const apiKey = process.env.MESHY_API_KEY;




window.onload = () => {
    let canvas = document.getElementById("webgl-canvas");
    let gl = canvas.getContext("webgl2");

    if (!gl) { alert("Your Web browser doesn't support WebGL 2"); }



    // Initialize the GL context
    gl.clearColor(0.2, 0.2, 0.2, 1.0);
    gl.enable(gl.DEPTH_TEST);




    // Setup the scene


    // Create the model and axes
    let model = new Model(gl);
    let axes = new Axes(gl);
    let ms = new MatrixStack;

    // Set up the projection matrix
    let near = 2.0;
    let far = 4.0;
    model.P = perspective(60.0, 1.0, near, far);
    axes.P = model.P;

    ms.translate(0, 0, -0.5*(near + far));

    let angle = 0.0;






    // render loop
    let render = () => {
        // Clear the color as well as the depth buffer
        gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);

        // Update the rotation angle
        angle += 3.0;
        angle %= 360.0;

        // Draw the model
        ms.push();
        ms.rotate(angle, [1, 1, 0]);
        model.MV = ms.current();
        model.draw();

        // Draw the axes
        axes.MV = ms.current();
        axes.draw();
        ms.pop();

        // Call render again
        requestAnimationFrame(render);
    };

    render();
};