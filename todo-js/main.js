const initData = [
  { id: 1, title: 'Code thư viện todo', status: 'open' },
  { id: 2, title: 'Test thử đổi status', status: 'open' },
];

(function () {
  'use strict';

  function getData() {
    const localData = localStorage.getItem('todo-data');
    let data;

    if (localData) {
      data = JSON.parse(localData);
    } else {
      data = initData;
      localStorage.setItem('todo-data', JSON.stringify(data));
    }

    return data;
  }

  function setData(data) {
    localStorage.setItem('todo-data', JSON.stringify(data));
  }

  function mountElement() {
    const data = getData();

    for (const todo of data) {
      const todoElement = document.createElement('div');
      todoElement.classList.add('draggable');
      todoElement.classList.add(todo.status);
      todoElement.dataset.id = todo.id;
      todoElement.dataset.status = todo.status;
      todoElement.textContent = todo.title;
      document.getElementById(todo.status).appendChild(todoElement);
    }
  }

  function bindEvent() {
    DragDropHandler.setup({
      afterMount: (elem, parent) => {
        const id = elem.dataset.id;
        const status = parent.id;

        elem.classList.remove('open', 'in-progress', 'done');
        elem.classList.add(status);
        elem.dataset.status = status;

        const data = getData();
        const index = data.findIndex((todo) => todo.id === +id);
        data[index].status = status;
        setData(data);
      }
    }).run();
  }

  mountElement();
  bindEvent();
})();
