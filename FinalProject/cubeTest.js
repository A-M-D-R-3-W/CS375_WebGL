


// Main program






window.onload = () => {
    let canvas = document.getElementById("webgl-canvas");
    let gl = canvas.getContext("webgl2");

    gl.clearColor(0.2, 0.2, 0.2, 1.0);
    gl.enable(gl.DEPTH_TEST);

    let cube = new BasicCube(gl);
    // let cube = new IndexedCube(gl);
    // let cube = new ExperimentalCube(gl);
    let axes = new Axes(gl);
    let ms = new MatrixStack;

    let near = 2.0;
    let far = 4.0;
    cube.P = perspective(60.0, 1.0, near, far);
    axes.P = cube.P;

    ms.translate(0, 0, -0.5*(near + far));

    let angle = 0.0;

    let render = () => {
        gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);

        angle += 3.0;
        angle %= 360.0;

        ms.push();
        ms.rotate(angle, [1, 1, 0]);
        cube.MV = ms.current();
        cube.draw();

        axes.MV = ms.current();
        axes.draw();
        ms.pop();

        requestAnimationFrame(render);
    };

    render();
};