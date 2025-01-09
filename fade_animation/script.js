"use strict";

const App = (function () {
    function bindEvent() {
        document.querySelectorAll('.dropdown-trigger').forEach(function (trigger) {
            trigger.addEventListener('click', function (e) {
                const parent = e.target.closest('.dropdown');
                const content = parent.querySelector('.dropdown-content');

                if (content.classList.contains('show')) {
                    content.classList.remove('show');
                    setTimeout(() => content.style.display = 'none', 500);
                } else {
                    content.style.display = 'block';
                    setTimeout(() => content.classList.add('show'), 0);
                }
            })
        });
    }

    return {
        init: function () {
            bindEvent();
        }
    };
})();

App.init();
