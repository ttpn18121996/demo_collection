'use strict';

if (!window.Terminal) {
  window.Terminal = (function () {
    let _config = {
      targetId: 'terminal',
      helpers: [],
      introduction: '<p>Welcome to my world!<br>Tell me what you want?<br>↓↓↓</p>',
      username: '',
      executor: (command, args = []) => {
        console.log({ command, args });
        _output.innerHTML = `<p>Command not found: <strong>${command}</strong>. Type <code>help</code> to see available commands.</p>`;
      },
      terminate: () => {},
    };
    let _terminal;
    let _prompt;
    let _input;
    let _output;
    let _caret;
    let _canvas = createElement({ localName: 'canvas' });
    let _context = _canvas.getContext('2d');
    let _timeout;
    let _history = [];
    let _historyIndex = -1;

    const Terminal = {};

    Terminal.configure = function (options = {}) {
      _config = { ..._config, ...options };
      return Terminal;
    }

    Terminal.run = function () {
      _terminal = document.getElementById(_config.targetId.replace(/^\#/, ''));
      if (!_terminal) return;
      _terminal.classList.add('terminal');

      _output = createElement({ className: 'terminal__output', html: _config.introduction });
      _input = createElement({ className: 'terminal__input' });

      if (isMobile()) {
        _output.innerHTML = `<p>The terminal mode doesn't support on the mobile devices.</p>`;
        _terminal.appendChild(_output);
        return;
      }

      _terminal.appendChild(_output);
      generateControl();
      bindEvents();
      console.log('Terminal is ready!')
    }

    Terminal.printOut = function (content) {
      _output.innerHTML = content;
    }

    function bindEvents() {
      document.addEventListener('click', () => {
        _input.focus();
      });
    }

    function generateControl() {
      const control = createElement({ className: 'terminal__control' });
      _prompt = createElement({ className: 'terminal__prompt', html: `→ ${_config.username}`});
      control.appendChild(_prompt);

      const inputWrapper = createElement({ className: 'terminal__input-wrapper' });
      _input = createElement({ localName: 'input', className: 'terminal__input', attr: { name: 'terminal_input', autofocus: 'true' } });
      inputWrapper.appendChild(_input);
      _input.addEventListener('focus', () => {
        _caret.style.display = 'inline-block';
      });
      _input.addEventListener('blur', event => {
        event.target.classList.remove('typing');
        _caret.style.display = 'none';
      });
      _input.addEventListener('keydown', event => {
        requestAnimationFrame(() => {
          updateCaret();
        });
        if (event.key === 'Enter') {
          event.preventDefault();
          const val = event.target.value.trim();
          if (val) {
            executeCommand(val);
          }
          _input.value = '';
        } else if (event.key === 'ArrowUp') {
          event.preventDefault();
          if (_historyIndex > 0) {
            _historyIndex -= 1;
            _input.value = _history[_historyIndex];
          }
        } else if (event.key === 'ArrowDown') {
          event.preventDefault();
          if (_historyIndex < _history.length - 1) {
            _historyIndex += 1;
            _input.value = _history[_historyIndex];
          } else {
            _historyIndex = _history.length;
            _input.value = '';
          }
        }
        updateCaret();
      });
      _input.addEventListener('input', event => {
        event.target.classList.add('typing');
        updateCaret();

        clearTimeout(_timeout);
        _timeout = setTimeout(() => {
          event.target.classList.remove('typing');
        }, 500);
      });

      _caret = createElement({ className: 'terminal__caret' });
      inputWrapper.appendChild(_caret);
      control.appendChild(inputWrapper);

      _terminal.appendChild(control);
    }

    function executeCommand(command) {
      _history.push(command);
      _historyIndex = _history.length;
      const parts = command.split(' ');
      const {  baseCommand, args } = getArgumentsFromCommand(command);

      switch (baseCommand) {
        case 'help':
          _output.innerHTML += `<p>Available commands:<br></p>`;
          Terminal.printList(_config.helpers);
          break;
        case 'clear':
        case 'cls':
          _output.innerHTML = '';
          break;
        case 'exit':
        case 'quit':
          _config.terminate();
          _terminal.innerHTML = '';
          _terminal.appendChild(_output);
          _output.innerHTML = 'Goodbye!';
          break;
        case 'refresh':
          window.location.reload();
          break;
        default:
          _config.executor(baseCommand, args);
          break;
      }

    }

    function getArgumentsFromCommand(command) {
      const parts = command.split(' ');
      const baseCommand = parts[0].toLowerCase();
      const args = [];
      const tmpCurrentArg = {
        isOpen: false,
        openChar: '',
        value: '',
      };

      for (let i = 1; i < parts.length; i++) {
        if (!parts[i]) {
          break;
        }

        if (parts[i].startsWith('"') || parts[i].startsWith("'")) {
          tmpCurrentArg.isOpen = true;
          tmpCurrentArg.openChar = parts[i].charAt(0);
          tmpCurrentArg.value = parts[i].slice(1);
        } else if (parts[i].endsWith(tmpCurrentArg.openChar) && tmpCurrentArg.isOpen) {
          tmpCurrentArg.value += ' ' + parts[i].slice(0, -1);
          args.push(tmpCurrentArg.value);
          tmpCurrentArg.isOpen = false;
          tmpCurrentArg.openChar = '';
          tmpCurrentArg.value = '';
        } else if (tmpCurrentArg.isOpen) {
          tmpCurrentArg.value += ' ' + parts[i];
        } else {
          args.push(parts[i]);
        }

        if (i === parts.length - 1 && tmpCurrentArg.isOpen) {
          args.push(tmpCurrentArg.value.replace(/^["']|["']$/g, ''));
        }
      }

      return { baseCommand, args };
    }

    function updateCaret() {
      const input = _input;
      const style = window.getComputedStyle(_input);

      _context.font = style.font;

      const cursorIndex = input.selectionStart;
      const textBeforeCursor = input.value.slice(0, cursorIndex);

      const textWidth = _context.measureText(textBeforeCursor).width;

      const paddingLeft = parseFloat(style.paddingLeft) || 0;
      const letterSpacing = parseFloat(style.letterSpacing) || 0;
      const scrollLeft = input.scrollLeft;

      _caret.style.left =
        `${paddingLeft
          + textWidth
          + letterSpacing * cursorIndex
          - scrollLeft}px`;
    }

    function createElement(props = {}) {
      const element = document.createElement(props?.localName ?? 'div');
      if (props?.className) {
        props.className = Array.isArray(props.className) ? props.className : props.className.split(' ');
        element.classList.add(...props.className.filter(n => n !== ''));
      }
      if (props?.attr) {
        for (const attrName in props.attr) {
          element.setAttribute(attrName, props.attr[attrName]);
        }
      }
      if (props?.text) {
        element.innerText = props.text;
      } else if (props?.html) {
        element.innerHTML = props.html;
      }

      return element;
    }

    Terminal.printList = function (list) {
      const table = createElement({ localName: 'table', className: 'terminal__list' });
      for (const item of list) {
        const hasTitle = '_title' in item;
        for (const index in item) {
          const value = item[index];
          const tr = createElement({ localName: 'tr' });
          if (index === '_title') {
            tr.appendChild(createElement({ localName: 'th', html: value, attr: { colspan: 2 } }));
          } else {
            const indexText = hasTitle ? `&nbsp;&nbsp;${index}` : index;
            tr.appendChild(createElement({ localName: 'th', html: indexText }));
            tr.appendChild(createElement({ localName: 'td', html: value }));
          }
          table.appendChild(tr);
        }
        if (hasTitle) {
          const blankRow = createElement({ localName: 'tr' });
          blankRow.appendChild(createElement({ localName: 'td', attr: { colspan: 2 }, html: '&nbsp;' }));
          table.appendChild(blankRow);
        }
      }
      _output.appendChild(table);
    }

    Terminal.printTable = function (heading, data = null) {
      if (!heading.length) return;
      const rows = data === null ? heading : data;
      const table = createElement({ localName: 'table', className: 'terminal__table' });
      if (data !== null) {
        const thead = createElement({ localName: 'thead' });
        const theadTr = createElement({ localName: 'tr' });
        for (const headingCell of heading) {
          theadTr.appendChild(createElement({ localName: 'th', text: headingCell }));
        }
        thead.appendChild(theadTr);
        table.appendChild(thead);
      }
      const tbody = createElement({ localName: 'tbody' });
      for (const row of rows) {
        const tbodyTr = createElement({ localName: 'tr' });
        for (const cell of row) {
          tbodyTr.appendChild(createElement({ localName: 'td', text: cell }));
        }
        tbody.appendChild(tbodyTr);
      }
      table.appendChild(tbody);

      _output.appendChild(table);
    }

    function isMobile() {
      return window.matchMedia("(max-width: 768px)").matches;
    }

    return Terminal;
  })();
}
