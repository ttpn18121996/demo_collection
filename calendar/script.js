(function (global, factory) {
  if (typeof exports === 'object' && typeof module !== 'undefined') {
    module.exports = factory();
  } else if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else {
    global.Calendar = factory();
  }
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  const _this = {
    configs: {
      targetId: 'calendar',
      yearInput: 'year',
      monthInput: 'month',
      locale: 'en',
      displayShortDayOfWeek: true,
      translation: {
        en: {
          dayOfWeeks: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
          shortDayOfWeeks: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
        },
        ja: {
          dayOfWeeks: ['日曜日', '月曜日', '火曜日', '水曜日', '木曜日', '金曜日', '土曜日'],
          shortDayOfWeeks: ['日', '月', '火', '水', '木', '金', '土'],
        },
        vi: {
          dayOfWeeks: ['Chủ nhật', 'Thứ hai', 'Thứ ba', 'Thứ tư', 'Thứ năm', 'Thứ sáu', 'Thứ bảy'],
          shortDayOfWeeks: ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'],
        },
      },
      afterRender: _this => {},
    },
  };
  _this.now = new Date();

  _this.setup = function (options) {
    _this.configs = { ..._this.configs, ...options };

    return _this;
  };

  _this.start = function () {
    _this.target = document.getElementById(_this.configs.targetId ?? 'calendar');

    _this.generateTable();

    _this.bodyCalendar = _this.target.querySelector(`table > tbody`);
    _this.yearInput = document.getElementById(_this.configs.yearInput ?? 'year');
    _this.monthInput = document.getElementById(_this.configs.monthInput ?? 'month');

    _this.yearInput.value = _this.now.getFullYear();
    _this.monthInput.value = _this.now.getMonth() + 1;

    _this.generateNoOfDays();

    _this.configs.afterRender(_this);
  };

  _this.generateTable = function () {
    const table = document.createElement('table');
    const thead = document.createElement('thead');
    const tbody = document.createElement('tbody');
    const tr = document.createElement('tr');

    for (const day of _this.configs.translation[_this.configs.locale][
      _this.configs.displayShortDayOfWeek ? 'shortDayOfWeeks' : 'dayOfWeeks'
    ]) {
      const th = document.createElement('th');
      th.textContent = day;
      tr.appendChild(th);
    }

    thead.appendChild(tr);

    table.appendChild(thead);
    table.appendChild(tbody);

    table.style.maxWidth = '768px';
    table.style.marginLeft = 'auto';
    table.style.marginRight = 'auto';

    _this.target.appendChild(table);
  };

  _this.generateNoOfDays = function () {
    const { blankDays, days } = _this.getNoOfDays();

    let noDayOfWeekFilled = 0;
    let week = 0;

    _this.bodyCalendar.innerHTML = '';

    while (days.length) {
      const tr = document.createElement('tr');

      if (!week) {
        for (let i = 0; i < blankDays.length; i++) {
          const td = document.createElement('td');
          td.classList.add('blank-day');
          tr.appendChild(td);
          noDayOfWeekFilled++;
        }
      }

      while (noDayOfWeekFilled < 7) {
        const td = document.createElement('td');
        const day = days.shift();

        if (!day) {
          td.classList.add('blank-day');
        } else {
          td.innerHTML = `<span class="day-value${_this.isToday(day) ? ' active' : ''}">${day}</span>`;
        }

        if (_this.isToday(day)) {
          td.addEventListener('dblclick', e => {
            _this.configs.onDoubleClickToday(e, _this);
          })
        } else {
          td.addEventListener('dblclick', e => {
            _this.configs.onDoubleClickDay(e, _this, day);
          })
        }

        tr.appendChild(td);
        noDayOfWeekFilled++;
      }

      week++;
      _this.bodyCalendar.appendChild(tr);

      if (noDayOfWeekFilled >= 7) {
        noDayOfWeekFilled = 0;
      }
    }
  };

  _this.getNoOfDays = function () {
    const daysInMonth = new Date(_this.yearInput.value, _this.monthInput.value, 0).getDate();
    const dayOfWeek = new Date(_this.yearInput.value, _this.monthInput.value - 1, 1).getDay();
    
    const blankDays = [];
    for (let i = 1; i <= dayOfWeek; i++) {
      blankDays.push(i);
    }

    const days = [];
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }

    return {
      blankDays,
      days,
    };
  };

  _this.goToPrevMonth = function () {
    if (_this.monthInput.value == 1) {
      _this.monthInput.value = 12;
      _this.yearInput.value--;
    } else {
      _this.monthInput.value--;
    }

    _this.generateNoOfDays();
  };

  _this.goToNextMonth = function () {
    if (_this.monthInput.value == 12) {
      _this.monthInput.value = 1;
      _this.yearInput.value++;
    } else {
      _this.monthInput.value++;
    }

    _this.generateNoOfDays();
  };

  _this.isToday = function (date) {
    const d = new Date(_this.yearInput.value, _this.monthInput.value - 1, date);
    return _this.now.toDateString() === d.toDateString();
  };

  _this.setTranslations = function (locale, data) {
    _this.configs.translation[locale] = data;

    return _this;
  };

  return _this;
});
