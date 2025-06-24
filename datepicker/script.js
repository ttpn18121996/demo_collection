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

  class DatePicker {
    constructor(settings = {}) {
      this.settings = {
        displayFormat: 'YYYY-MM-DD',
        target: '.date-picker',
        name: 'date_of_birth',
        ...settings,
      };
      this.calendar = null;
    }

    createInput() {
      const input = document.createElement('input');
      input.type = 'text';
      input.name = this.settings.name;
      input.classList.add('date-picker__input');
      return input;
    }

    handleShowCalendar(datePicker) {
      if (this.calendar) {
        this.handleRemoveCalendar(datePicker);
        return;
      }

      this.calendar = new Calendar().create(datePicker);
      document.body.appendChild(this.calendar.element);

      setTimeout(() => {
        document.addEventListener('click', (e) => {
          this.outsideClickHandler(datePicker, e);
        });
      });
    }

    handleRemoveCalendar(datePicker) {
      if (this.calendar && this.calendar.getParentNode()) {
        this.calendar.getParentNode().removeChild(this.calendar.element);
        this.calendar = null;
        document.removeEventListener('click', (e) => {
          this.outsideClickHandler(datePicker, e);
        });
      }
    }

    outsideClickHandler(datePicker, e) {
      if (this.calendar && !this.calendar.contains(e.target) && !datePicker.contains(e.target)) {
        this.handleRemoveCalendar(datePicker);
      }
    }

    load() {
      const _datePickers = document.querySelectorAll(this.settings.target);

      for (const _datePicker of _datePickers) {
        const inputDatePicker = this.createInput();
        inputDatePicker.addEventListener('click', (e) => {
          e.stopPropagation();

          this.handleShowCalendar(_datePicker);
        });
        _datePicker.appendChild(inputDatePicker);
      }
    }
  }

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
      };
    }

    create(datePicker) {
      this.element = document.createElement('div');
      this.element.classList.add('date-picker__calendar');
      
      this.generateHead();
      this.generateBody();

      const rectDatePicker = datePicker.getBoundingClientRect();

      const rectCalendar = this.element.getBoundingClientRect();

      const spaceBelow = window.innerHeight - rectDatePicker.bottom;
      const spaceAbove = rectDatePicker.top;

      let top;

      if (spaceBelow >= rectCalendar.height) {
        // đủ chỗ bên dưới
        top = rectDatePicker.bottom + window.scrollY - 5;
      } else if (spaceAbove >= rectCalendar.height) {
        // đủ chỗ bên trên
        top = rectDatePicker.top - rectCalendar.height + window.scrollY;
      } else {
        // không đủ chỗ cả 2 bên, ưu tiên bên dưới
        top = rectDatePicker.bottom + window.scrollY - 5;
      }

      const left = rectDatePicker.left + window.scrollX;

      this.element.style.top = `${top}px`;
      this.element.style.left = `${left}px`;
      this.element.style.visibility = 'visible';

      return this;
    }

    generateHead() {
      const calendarHead = document.createElement('div');
      calendarHead.classList.add('date-picker__calendar__header');

      const calendarHeadPrev = document.createElement('button');
      calendarHeadPrev.classList.add('date-picker__calendar__header__prev');
      calendarHeadPrev.textContent = '<';

      const calendarHeadMonth = document.createElement('span');
      calendarHeadMonth.classList.add('date-picker__calendar__header__month');
      calendarHeadMonth.textContent = '2025 - 06';

      const calendarHeadNext = document.createElement('button');
      calendarHeadNext.classList.add('date-picker__calendar__header__next');
      calendarHeadNext.textContent = '>';

      calendarHead.appendChild(calendarHeadPrev);
      calendarHead.appendChild(calendarHeadMonth);
      calendarHead.appendChild(calendarHeadNext);

      this.element.appendChild(calendarHead);
    }

    generateBody() {
      const calendarBody = document.createElement('div');
      calendarBody.classList.add('date-picker__calendar__body');

      const table = document.createElement('table');
      const thead = document.createElement('thead');
      const tbody = document.createElement('tbody');
      const tr = document.createElement('tr');

      this.element.appendChild(calendarBody);
    }

    getParentNode() {
      if (this.element) {
        return this.element.parentNode;
      }

      return null;
    }

    contains(target) {
      return this.element.contains(target);
    }
  }

  return {
    create(settings = {}) {
      return new DatePicker(settings);
    }
  };
});
