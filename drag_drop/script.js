const createElement = outer => {
    const element = document.createElement('input');
    element.id = 'txt_' + document.querySelectorAll('input').length;
    element.classList.add('txt');
    element.setAttribute('draggable', 'true');
    bindEventDragDrop(element, outer);
    return element;
};

const bindEventDragDrop = (target, outer) => {
    let diffX = 0,
        diffY = 0;
    let targetRef = null;
    function dragStartHandler(e) {
        targetRef = e.target;
        diffX = e.clientX - e.target.offsetLeft;
        diffY = e.clientY - e.target.offsetTop;
        e.target.style.opacity = 0.25;
    }
    function dragEndHandler(e) {
        targetRef = null;
        e.target.style.opacity = 1;
    }
    function dropHandler(e) {
        if (targetRef) {
            targetRef.style.top = `${e.clientY - diffY}px`;
            targetRef.style.left = `${e.clientX - diffX}px`;
        }
    }
    outer.addEventListener('dragover', function (e) {
        e.preventDefault();
    });
    outer.addEventListener('drop', dropHandler);
    target.setAttribute('draggable', 'true');
    target.addEventListener('dragstart', dragStartHandler);
    target.addEventListener('dragend', dragEndHandler);
};

const bindEventCreateElement = (target, outer) => {
    function clickHandler(e) {
        const posPointerX = e.clientX;
        const posPointerY = e.clientY;
        const element = createElement(outer);
        element.style.top = `${posPointerY - outer.offsetTop}px`;
        element.style.left = `${posPointerX - outer.offsetLeft}px`;
        outer.appendChild(element);
    }
    target.addEventListener('click', clickHandler);
};

const txt_0 = document.getElementById('txt_0');
const background = document.getElementById('background');
const outer = document.getElementById('outer');
bindEventDragDrop(txt_0, outer);
bindEventCreateElement(background, outer);
