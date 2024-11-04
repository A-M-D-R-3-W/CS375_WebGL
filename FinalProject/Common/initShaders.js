//-----------------------------------------------------------------------------
//
//  initShaders.js
//
//  Helper functions for compiling and working with WebGL shaders.
//

//
// --- initShaders ---
//
//  A helper function for initializing WebGL shader programs.
//
//  Parameters:
//
//  - gl: the current WebGL context
//  - vertexShaderSrc: either the HTML DOM element id for a vertex
//      script element, or a string containing the source of a vertex shader.
//  - fragmentShaderSrc: same as vertexShaderSrc, except for the fragment
//      shader 
//
function initShaders( gl, vertexShaderSrc, fragmentShaderSrc )
{
    // Begin by determining which version the OpenGL Shading Language (GLSL)
    //   is supported by the version of WebGL.
    //
    //     WebGL 1.0 supports "GLSL ES 1.0", while
    //     WebGL 2.0 supports "GLSL ES 3.0"
    //
    //  which requires starting the shader with a "#version" line.
    //
    const version = gl.getParameter( gl.SHADING_LANGUAGE_VERSION )
    const es300 = /GLSL ES 3.0/.test( version );

    let vertexShaderId = null;
    let fragmentShaderId = null;

    // Create a local function to create and compile the shader's
    //   source.  The function also inserts the required #version
    //   string if necessary.
    const CompileShader = function( type, src ) {

        // Validate the appropriate shader type, and set up some
        //   diagnostic information.
        let typeStr = undefined;
        let id = undefined;

        switch( type ) {
            case gl.VERTEX_SHADER:
                typeStr = "Vertex";
                id = vertexShaderId;
                break;

            case gl.FRAGMENT_SHADER:
                typeStr = "Fragment";
                id = fragmentShaderId;
                break;

            default:
                alert( "Invalid shader type passed to CompileShader()" );
                return -1;
            }

        // Determine if there's a valid GLSL ES 3.0 version string
        //   already present in the shader, and if not, insert a
        //   version string at the start of the shader.
        const versionRegExp = /\s*#version\s+300\s+es/;

        if ( es300 && !versionRegExp.test(src) ) {
            src = "#version 300 es\n" + src;
        }

        // Create a WebGL shader object, load its source, and
        //   compile it.  If the compilation fails, retrieve and
        //   display the error log and shader source, and indicate
        //   the operation failed by passing back a "-1", which is
        //   an invalid shader id (they must be greater than zero)
        const shader = gl.createShader( type );
        gl.shaderSource( shader, src );
        gl.compileShader( shader );
        if ( !gl.getShaderParameter(shader, gl.COMPILE_STATUS) ) {

            const msg = typeStr + " shader '" + id + "' failed to compile." +
                "  The error log is:\n\n" + gl.getShaderInfoLog( shader ) +
                "\n-----------------------------------------\n\n" + src;
            alert( msg );
            return -1;
        }

        return shader;
    };

    // Attempt to retrieve the vertex shader's source, and compile it.  We
    //   first check to see if the value passed exists in the page's document.
    //   If so, we retrieve the text from that element.  If not, then we see
    //   if we were passed a completed, valid shader string (by testing to
    //   see if it contain "main")
    const vertElem = document.getElementById( vertexShaderSrc );
    if ( vertElem ) {
        vertexShaderId = vertexShaderSrc;
        vertexShaderSrc = vertElem.textContent;
    }
    else if ( typeof vertexShaderSrc === 'string'
        && /main/.test(vertexShaderSrc) ) {
            vertexShaderId = 'inline';
    }
    else {
        alert( "Unable to load vertex shader '" + vertexShaderSrc + "'" );
        return -1;
    }

    const vertShdr = CompileShader( gl.VERTEX_SHADER, vertexShaderSrc );
    if ( vertShdr < 0 ) { return -1; }
    
    // Do the identical operation for the fragment shader, verifying that
    //   the fragment shader also contains an appropriate precision
    //   specification
    const fragElem = document.getElementById( fragmentShaderSrc );
    if ( fragElem ) {
        fragmentShaderId = fragmentShaderSrc;
        fragmentShaderSrc = fragElem.textContent;
    }
    else if ( typeof fragmentShaderSrc === 'string' 
        && /main/.test(fragmentShaderSrc) ) {
            fragmentShaderId = 'inline';
    }
    else {
        alert( "Unable to load fragment shader '" + fragmentShaderSrc + "'" );
        return -1;
    }

    // This test is fairly rudimentary as it only checks on the "precision"
    //   keyword being present in the shader.  
    let src = fragmentShaderSrc;
    if ( !/precision/.test(src) ) { 
        src = "precision highp float; " + src;
    }

    const fragShdr = CompileShader( gl.FRAGMENT_SHADER, src );
    if ( fragShdr < 0 ) { return -1; }

    // Finally, compose the shader program pipeline by attaching shaders
    //   and linking the program.  If the link succeeds, we return the
    //   shader program, otherwise, we report an error and return a "-1"
    //   (an invalid shader program value).
    const program = gl.createProgram();
    gl.attachShader( program, vertShdr );
    gl.attachShader( program, fragShdr );
    gl.linkProgram( program );

    if ( !gl.getProgramParameter(program, gl.LINK_STATUS) ) {
        const msg = "Shader program failed to link.  The error log is:\n\n"
            + gl.getProgramInfoLog( program );
        alert( msg );
        return -1;
    }

    return program;
}