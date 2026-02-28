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
          monthLabel: 'month',
        },
        ja: {
          dayOfWeeks: ['日曜日', '月曜日', '火曜日', '水曜日', '木曜日', '金曜日', '土曜日'],
          shortDayOfWeeks: ['日', '月', '火', '水', '木', '金', '土'],
          monthLabel: '月',
        },
        vi: {
          dayOfWeeks: ['Chủ nhật', 'Thứ hai', 'Thứ ba', 'Thứ tư', 'Thứ năm', 'Thứ sáu', 'Thứ bảy'],
          shortDayOfWeeks: ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'],
          monthLabel: 'tháng',
        },
      },
      afterRender: _this => {},
      onGo: _this => {},
    },
    current: {
        year: 0,
        month: 0,
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

    _this.current.year = _this.now.getFullYear();
    _this.current.month = _this.now.getMonth() + 1;

    _this.generateNoOfDays();

    _this.configs.afterRender(_this);
  };

  _this.generateTable = function () {
    _this.calendarBody = _this.makeTable();
    const heading = _this.makeHeading();

    _this.calendarBody.appendChild(heading);
    _this.target.appendChild(_this.calendarBody);
  };

  _this.makeTable = function () {
    const table = document.createElement('div');
    table.classList.add('calendar');

    return table;
  };

  _this.makeHeading = function () {
    const heading = document.createElement('div');
    heading.classList.add('calendar__row', 'calendar__heading');

    for (const day of _this.getTranslations(_this.configs.displayShortDayOfWeek ? 'shortDayOfWeeks' : 'dayOfWeeks')) {
      const headingCell = document.createElement('div');
      headingCell.classList.add('calendar__day-of-week');
      headingCell.textContent = day;
      heading.appendChild(headingCell);
    }

    return heading;
  };

  _this.generateNoOfDays = function () {
    const { blankDays, days } = _this.getNoOfDays();

    let noDayOfWeekFilled = 0;
    let week = 0;

    _this.calendarBody.remove();
    _this.generateTable();

    while (days.length) {
      const bodyRow = document.createElement('div');
      bodyRow.classList.add('calendar__row');

      if (!week) {
        for (let i = 0; i < blankDays.length; i++) {
          const bodyCell = document.createElement('div');
          bodyCell.classList.add('calendar__date', 'blank-day');
          bodyRow.appendChild(bodyCell);
          noDayOfWeekFilled++;
        }
      }

      while (noDayOfWeekFilled < 7) {
        const bodyCell = document.createElement('div');
        bodyCell.classList.add('calendar__date');
        const day = days.shift();

        if (!day) {
          bodyCell.classList.add('blank-day');
        } else {
          bodyCell.innerHTML = `<p class="day-value${_this.isToday(day) ? ' active' : ''}"><span>${day}</span></p>`;
        }

        if (_this.isToday(day) && _this.configs.onDoubleClickToday) {
          bodyCell.addEventListener('dblclick', e => {
            _this.configs.onDoubleClickToday(e, _this);
          });
        } else if (_this.configs.onDoubleClickDay) {
          bodyCell.addEventListener('dblclick', e => {
            _this.configs.onDoubleClickDay(e, _this, day);
          });
        }

        bodyRow.appendChild(bodyCell);
        noDayOfWeekFilled++;
      }

      week++;
      _this.calendarBody.appendChild(bodyRow);

      if (noDayOfWeekFilled >= 7) {
        noDayOfWeekFilled = 0;
      }
    }
  };

  /**
   * Get the list of blank days and the list of dates in a month.
   */
  _this.getNoOfDays = function () {
    const daysInMonth = new Date(_this.current.year, _this.current.month, 0).getDate();
    const dayOfWeek = new Date(_this.current.year, _this.current.month - 1, 1).getDay();
    
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
    if (_this.current.month == 1) {
      _this.current.month = 12;
      _this.current.year--;
    } else {
      _this.current.month--;
    }

    _this.generateNoOfDays();
    _this.configs?.onGo(_this);
  };

  _this.goToToday = function () {
    _this.current.year = _this.now.getFullYear();
    _this.current.month = _this.now.getMonth() + 1;
    _this.generateNoOfDays();
    _this.configs?.onGo(_this);
  };

  _this.goToNextMonth = function () {
    if (_this.current.month == 12) {
      _this.current.month = 1;
      _this.current.year++;
    } else {
      _this.current.month++;
    }

    _this.generateNoOfDays();
    _this.configs?.onGo(_this);
  };

  _this.isToday = function (date) {
    const d = new Date(_this.current.year, _this.current.month - 1, date);
    return _this.now.toDateString() === d.toDateString();
  };

  _this.getTranslations = function (key = null) {
    let translations = _this.configs.translation[_this.configs.locale];

    if (!translations) {
      translations = _this.configs.translation['en'];
    }

    if (key) {
      return translations[key];
    }
    
    return translations;
  };

  _this.setTranslations = function (locale, data) {
    _this.configs.translation[locale] = data;

    return _this;
  };

  return _this;
});
