(function (global, factory) {
  if (typeof exports === 'object' && typeof module !== 'undefined') {
    // Node. Does not work with strict CommonJS, but only CommonJS-like environments that support module.exports, like Node.
    module.exports = factory();
  } else if (typeof define === 'function' && define.amd) {
    // AMD
    define([], factory);
  } else {
    global.DragDropHandler = factory();
  }
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  let elementDragged;
  let configs = {
    dragTarget: '.draggable',
    dropTarget: '.droppable',
    beforeMount: () => {},
    afterMount: () => {},
  };

  function dragStartHandler(e) {
    elementDragged = e.target;
  }

  function dragOverHandler(e) {
    e.preventDefault();
  }

  function dropHandler(e) {
    e.preventDefault();

    if (!configs.dropTarget.includes(e.target.classList)) {
      elementDragged = undefined;
      return;
    }

    if (typeof configs?.beforeMount === 'function') {
      configs.beforeMount(elementDragged, e.target);
    }

    e.target.appendChild(elementDragged);

    if (typeof configs?.afterMount === 'function') {
      configs.afterMount(elementDragged, e.target);
    }

    elementDragged = undefined;
  }

  function bindEventForDrag(element) {
    element.setAttribute('draggable', true);
    element.addEventListener('dragstart', dragStartHandler);
  }

  function bindEventForDrop(element) {
    element.addEventListener('dragover', dragOverHandler);
    element.addEventListener('drop', dropHandler);
  }

  const _this = {};

  _this.setup = function (options = {}) {
    configs = { ...configs, ...options };

    return this;
  };

  _this.run = function () {
    const dragTargets = document.querySelectorAll(configs.dragTarget);
    for (const target of dragTargets) {
      bindEventForDrag(target);
    }

    const dropTargets = document.querySelectorAll(configs.dropTarget);
    for (const target of dropTargets) {
      bindEventForDrop(target);
    }
  };

  return _this;
});
