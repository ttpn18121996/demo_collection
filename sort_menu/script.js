(function (global, factory) {
  if (typeof exports === 'object' && typeof module !== 'undefined') {
    // Node. Does not work with strict CommonJS, but only CommonJS-like environments that support module.exports, like Node.
    module.exports = factory();
  } else if (typeof define === 'function' && define.amd) {
    // AMD
    define([], factory);
  } else {
    global.ListSorter = factory();
  }
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  const ListSorter = {};
  let draggedItem;
  let draggableElements = [];

  ListSorter.configs = {
    target: 'sortable',
    callback: null,
  };

  ListSorter.configure = function (config = {}) {
    this.configs = { ...this.configs, ...config };

    return this;
  };

  ListSorter.run = function () {
    if (typeof document === undefined) {
      return;
    }

    const elements = document.querySelectorAll('.' + this.configs.target.replace(/^\./, ''));

    for (const element of elements) {
      draggableElements = [...element.children];
      element.addEventListener('dragstart', e => {
        draggedItem = e.target;
        draggedItem.classList.add('dragging');
      });
      element.addEventListener('dragend', e => {
        draggedItem.classList.remove('dragging');
        if (this.configs.callback) {
          this.configs.callback(draggableElements);
        }
        draggedItem = undefined;
      });
      element.addEventListener('dragover', e => {
        e.preventDefault();
        const afterElement = getDragAfterElement(e.clientY);
        if (!afterElement) {
          element.appendChild(draggedItem);
        } else {
          element.insertBefore(draggedItem, afterElement);
        }

        draggableElements = [...element.children];
      });
      for (const child of element.children) {
        child.setAttribute('draggable', 'true')
      }
    }
  };

  function getDragAfterElement(y) {
    return draggableElements.reduce(
      (closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = y - box.top - box.height / 2;
        if (offset < 0 && offset > closest.offset) {
          return {
            offset,
            element: child,
          };
        } else {
          return closest;
        }
      },
      { offset: Number.NEGATIVE_INFINITY }
    ).element;
  }

  return ListSorter;
});
