(function (global, factory) {
  if (typeof exports === 'object' && typeof module !== 'undefined') {
    module.exports = factory();
  } else if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else {
    global.Combobox = factory();
  }
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';
  let _config = {
    target: '.combobox',
    withoutInput: false,
    inputClasses: [],
    comboboxClasses: [],
    name: null,
    id: null,
    renderBodyHandler: null,
    onClick: null,
  };
  let _combobox;

  function createInput(index) {
    const input = document.createElement('input');
    input.classList.add('combobox__input', ..._config.inputClasses);
    input.type = 'text';
    let inputName;
    let inputId;

    if (inputName = _config?.name) {
      input.name = inputName;
    }

    if (inputId = _config?.id) {
      input.id = `${inputId}-${index}`;
    }

    return input;
  }

  function createAndMountCombobox(parent) {
    _combobox = document.createElement('div');
    _combobox.classList.add('combobox__content', ..._config.comboboxClasses);
    _config.renderBodyHandler && _config.renderBodyHandler({
      parent,
      combobox: _combobox,
      close: () => {
        handleRemoveCombobox(parent);
      }
    });

    document.body.appendChild(_combobox);

    const rectParent = parent.getBoundingClientRect();
    const rectCombobox = _combobox.getBoundingClientRect();

    const spaceBelow = window.innerHeight - rectParent.bottom;
    const spaceAbove = rectParent.top;

    let top;

    if (spaceBelow >= rectCombobox.height) {
      // đủ chỗ bên dưới
      top = rectParent.bottom + window.scrollY + 3;
    } else if (spaceAbove >= rectCombobox.height) {
      // đủ chỗ bên trên
      top = rectParent.top - rectCombobox.height + window.scrollY - 3;
    } else {
      // không đủ chỗ cả 2 bên, ưu tiên bên dưới
      top = rectParent.bottom + window.scrollY + 3;
    }

    const left = rectParent.left + window.scrollX;

    _combobox.style.position = 'absolute';
    _combobox.style.top = `${top}px`;
    _combobox.style.left = `${left}px`;
    _combobox.style.visibility = 'visible';
  }

  function handleShowCombobox(parent) {
    if (_combobox) {
      handleRemoveCombobox(parent);
      return;
    }

    createAndMountCombobox(parent);

    setTimeout(() => {
      document.addEventListener('click', (e) => {
        outsideClickHandler(parent, e);
      });
    });
  }

  function handleRemoveCombobox(parent) {
    if (_combobox) {
      _combobox.remove();
      _combobox = null;
      document.removeEventListener('click', (e) => {
        outsideClickHandler(parent, e);
      });
    }
  }

  function outsideClickHandler(parent, e) {
    if (_combobox && !_combobox.contains(e.target) && !parent.contains(e.target)) {
      handleRemoveCombobox(parent);
    }
  }

  function create(config = {}) {
    _config = {..._config, ...config};
    const comboboxes = document.querySelectorAll(_config.target);

    for (let i = 0; i < comboboxes.length; i++) {
      if (!_config.withoutInput) {
        const input = createInput(i);
        comboboxes[i].appendChild(input);
      }

      comboboxes[i].addEventListener('click', e => {
        e.stopPropagation();
        if (_config.onClick) {
          _config.onClick(e);
        } else {
          handleShowCombobox(comboboxes[i]);
        }
      });
    }

    return this;
  }

  function useBody(callback) {
    _config.renderBodyHandler = callback;
    return this;
  }

  function useClickEvent(callback) {
    _config.onClick = callback;
    return this;
  }

  return {
    create,
    useBody,
    useClickEvent,
  };
});
