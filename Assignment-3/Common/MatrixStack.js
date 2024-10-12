//
//  MatrixStack.js
//
"use strict";

//---------------------------------------------------------------------------
//
//  class MatrixStack
//
function MatrixStack() {
    let stack = [ mat4() ];

    this.current      = ()  => { return stack[0] };
    this.push         = ()  => { stack.unshift( stack[0] ); };
    this.pop          = ()  => { stack.shift(); };
    this.load         = (m) => { stack[0] = m; };
    this.mult         = (m) => { stack[0] = mult( stack[0], m ); };
    this.loadIdentity = ()  => { stack[0] = mat4(); };
    
    this.rotate = (angle, axis) => { 
        stack[0] = mult( stack[0], rotate(angle, axis) );
    };

    this.scale = (x, y, z) => {
        if (Array.isArray(x)) {
            z = x[2];
            y = x[1];
            x = x[0];
        }
        else {
            y ||= x;
            z ||= x;
        }
        stack[0] = mult( stack[0], scalem(x, y, z) );
    };
    
    this.translate = (x, y, z) => {
        if (Array.isArray(x)) {
            z = x[2];
            y = x[1];
            x = x[0];
        }
        else {
            y ||= x;
            z ||= x;
        }
        stack[0] = mult( stack[0], translate(x, y, z) ); 
    };
};