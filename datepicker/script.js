(function (global, factory) {
  if (typeof exports === 'object' && typeof module !== 'undefined') {
    module.exports = factory();
  } else if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else {
    global.DatePicker = factory();
  }
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';
  class Calendar {
    constructor() {
      this.element = null;
      this.settings = {
        locale: 'en',
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
        onDoubleClickToday: () => {},
        onDoubleClickDay: () => {},
      };
      this.now = new Date();
      this.currentYear = this.now.getFullYear();
      this.currentMonth = this.now.getMonth() + 1;
    }

    create() {
      this.element = document.createElement('div');
      this.element.classList.add('date-picker__calendar');

      this.generateHead();
      this.generateTable();

      return this;
    }

    generateTable() {
      const table = document.createElement('table');
      const thead = this.generateTableHead();
      const tbody = this.generateTableBody();

      table.appendChild(thead);
      table.appendChild(tbody);

      this.element.appendChild(table);
    }

    generateTableHead() {
      const thead = document.createElement('thead');
      const tr = document.createElement('tr');
      for (const day of this.settings.translation[this.settings.locale].shortDayOfWeeks) {
        const th = document.createElement('th');
        const span = document.createElement('span');
        span.textContent = day;
        th.appendChild(span);
        th.style.width = '40px';
        th.style.height = '40px';
        tr.appendChild(th);
      }
      thead.appendChild(tr);

      return thead;
    }

    generateHead() {
      const calendarHead = document.createElement('div');
      calendarHead.classList.add('date-picker__calendar__header');

      const calendarHeadPrev = document.createElement('button');
      calendarHeadPrev.classList.add('date-picker__calendar__header__prev');

      const calendarHeadMonth = document.createElement('div');
      calendarHeadMonth.classList.add('date-picker__calendar__header__month');
      calendarHeadMonth.innerHTML = `<button>${this.currentYear}</button><button>${('0' + this.currentMonth).slice(-2)}</button>`;

      const calendarHeadNext = document.createElement('button');
      calendarHeadNext.classList.add('date-picker__calendar__header__next');

      calendarHead.appendChild(calendarHeadPrev);
      calendarHead.appendChild(calendarHeadMonth);
      calendarHead.appendChild(calendarHeadNext);

      this.element.appendChild(calendarHead);
    }

    generateTableBody() {
      const tbody = document.createElement('tbody');
      tbody.innerHTML = '';

      const rows = this.generateNoOfDays();

      for (const row of rows) {
        tbody.appendChild(row);
      }

      return tbody;
    }

    generateNoOfDays() {
      const { blankDays, days } = this.getNoOfDays();

      let noDayOfWeekFilled = 0;
      let week = 0;

      const rows = [];

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
          td.style.width = '40px';
          td.style.height = '40px';
  
          if (!day) {
            td.classList.add('blank-day');
          } else {
            td.innerHTML = `<span class="day-value${this.isToday(day) ? ' active' : ''}">${day}</span>`;
          }
  
          if (this.isToday(day)) {
            td.addEventListener('dblclick', e => {
              this.configs.onDoubleClickToday(e, this);
            })
          } else {
            td.addEventListener('dblclick', e => {
              this.settings.onDoubleClickDay(e, this, day);
            })
          }
  
          tr.appendChild(td);
          noDayOfWeekFilled++;
        }
  
        week++;
        rows.push(tr);
  
        if (noDayOfWeekFilled >= 7) {
          noDayOfWeekFilled = 0;
        }
      }

      return rows;
    }

    getNoOfDays() {
      const daysInMonth = new Date(this.currentYear, this.currentMonth, 0).getDate();
      const dayOfWeek = new Date(this.currentYear, this.currentMonth - 1, 1).getDay();
      
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
    }

    isToday(day) {
      const d = new Date(this.currentYear, this.currentMonth - 1, day);
      return this.now.toDateString() === d.toDateString();
    }
  }

  return {
    createCalendar: () => {
      return new Calendar();
    }
  };
});
