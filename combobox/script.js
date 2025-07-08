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
    onInputChange: null,
    data: [],
    placeholder: 'Select an option',
    clearSelection: false,
  };
  let _combobox;

  function createInput(index) {
    const input = document.createElement('input');
    input.classList.add('combobox__input', ..._config.inputClasses);
    input.type = 'text';
    input.placeholder = _config.placeholder;
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

  function createSpan(index) {
    const span = document.createElement('span');
    span.classList.add('combobox__span', ..._config.inputClasses);
    span.innerText = _config.placeholder;
    let spanName;
    let spanId;

    if (spanName = _config?.name) {
      span.name = spanName;
    }

    if (spanId = _config?.id) {
      span.id = `${spanId}-${index}`;
    }

    return span;
  }

  function createItemForData(parent, data) {
    const item = document.createElement('div');
    item.innerText = data?.label;
    item.classList.add('combobox__item');

    if (parent.querySelector('input').value === data?.value) {
      item.classList.add('combobox__item--selected');
    }

    item.addEventListener('click', e => {
      if (_config.onInputChange) {
        _config.onInputChange(e, {...data, selected: data?.value});
      }
      if (_config.withoutInput) {
        parent.querySelector('span').innerText = data?.label;
      }
      parent.querySelector('input').value = data?.value;
      handleRemoveCombobox(parent);
    });

    return item;
  }

  function createAndMountCombobox(parent) {
    _combobox = document.createElement('div');
    _combobox.classList.add('combobox__content', ..._config.comboboxClasses);

    if (_config.renderBodyHandler) {
      _config.renderBodyHandler({
        parent,
        combobox: _combobox,
        close: () => {
          handleRemoveCombobox(parent);
        }
      });
    } else if (_config.data?.length) {
      if (_config.clearSelection) {
        _combobox.appendChild(createItemForData(parent, { label: _config.placeholder, value: '' }));
      }

      for (let i = 0; i < _config.data.length; i++) {
        _combobox.appendChild(createItemForData(parent, _config.data[i]));
      }
    }

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
      if (_config.withoutInput) {
        const span = createSpan(i);
        const input = document.createElement('input');
        input.type = 'hidden';
        _config.name && (input.name = _config.name);
        
        comboboxes[i].appendChild(span);
        comboboxes[i].appendChild(input);
      } else {
        const input = createInput(i);
        comboboxes[i].appendChild(input);
      }

      // Check and set default value
      if (_config.data?.length) {
        for (const item of _config.data) {
          if (item?.selected) {
            if (_config.withoutInput) {
              comboboxes[i].querySelector('span').innerText = item?.label;
            }
            comboboxes[i].querySelector('input').value = item?.value;
          }
        }
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

  function setData(data, onInputChange = null) {
    _config.data = data;
    _config.onInputChange = onInputChange;
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
    setData,
  };
});
