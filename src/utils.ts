


export module Utils {
    // shim layer with setTimeout fallback
    export const requestAnimFrame:Function = (function(){
    return  window.requestAnimationFrame       ||
            window['webkitRequestAnimationFrame'] ||
            window['mozRequestAnimationFrame'] ||
            function( callback ){
                window.setTimeout(callback, 1000 / 60);
            };
    })();
}