'use strict';
window.EngineLor = (function() {
  let canvas;

  function makeScreen() {
    canvas = document.createElement('canvas');
    document.body.appendChild(canvas);

    return canvas;
  }

  return {
    makeScreen,
  };
})();

