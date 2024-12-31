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

    _this.generateDataWeek();
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

    _this.target.appendChild(table);
  };

  _this.generateDataDay = function (startDay = 1) {
    const firstDayOfWeek = new Date(_this.yearInput.value, _this.monthInput.value - 1, startDay);
    const lastDayOfMonth = new Date(_this.yearInput.value, _this.monthInput.value, 0).getDate();
    const dayOfWeek = firstDayOfWeek.getDay();
    const result = [];
    let current = startDay;

    for (let i = 0; i < 7; i++) {
      if (i >= dayOfWeek && lastDayOfMonth >= current) {
        result.push(current);
        current++;
      } else {
        result.push(null);
      }
    }

    return {
      days: result,
      dayOfWeekend: result[6],
      lastDayOfMonth,
    };
  };

  _this.generateDataWeek = function () {
    let dayOfWeekend = 0;

    for (let i = 0; i < 5; i++) {
      const dataDay = _this.generateDataDay(dayOfWeekend + 1);
      const days = dataDay.days;
      dayOfWeekend = dataDay.dayOfWeekend;

      if (i === 4 && [1, 2].includes(dataDay.lastDayOfMonth - dayOfWeekend)) {
        document.querySelectorAll('.day-value').forEach((element, index) => {
          if (dataDay.lastDayOfMonth - index > dayOfWeekend) {
            element.innerText = dayOfWeekend + index + 1;
          }
        });
      }

      if (dayOfWeekend > dataDay.lastDayOfMonth) {
        break;
      }

      const week = document.createElement('tr');
      week.classList.add('week');

      for (const d of days) {
        const day = document.createElement('td');
        const isToday =
          _this.yearInput.value == _this.now.getFullYear() &&
          _this.monthInput.value == _this.now.getMonth() + 1 &&
          d == _this.now.getDate();
        day.innerHTML = `<span class="day-value${isToday ? ' active' : ''}">${d || ''}</span>`;

        if (isToday && _this.configs.onDoubleClickToday) {
          day.addEventListener('dblclick', function () {
            _this.configs.onDoubleClickToday(_this);
          }, false);
        } else if (d && _this.configs.onDoubleClickDay) {
          day.addEventListener('dblclick', function () {
            _this.configs.onDoubleClickDay(_this, d);
          }, false);
        }

        week.appendChild(day);
      }

      _this.bodyCalendar.appendChild(week);
    }
  };

  _this.setTranslations = function (locale, data) {
    _this.configs.translation[locale] = data;

    return _this;
  };

  return _this;
});
