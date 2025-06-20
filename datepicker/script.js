'use strict';

class DatePicker {
  constructor(settings = {}) {
    this.settings = {
      displayFormat: 'YYYY-MM-DD',
      target: '.date-picker',
      name: 'date_of_birth',
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

  createCalendar(datePicker) {
    const calendar = document.createElement('div');
    calendar.classList.add('date-picker__calendar');
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
    calendar.appendChild(calendarHead);

    const calendarBody = document.createElement('div');
    calendarBody.classList.add('date-picker__calendar__body');
    this.generateDays(calendarBody);
    calendar.appendChild(calendarBody);

    const rectDatePicker = datePicker.getBoundingClientRect();

    const rectCalendar = calendar.getBoundingClientRect();

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

    calendar.style.top = `${top}px`;
    calendar.style.left = `${left}px`;
    calendar.style.visibility = 'visible';

    return calendar;
  }

  generateDays(parentNode) {
    for (let i = 1; i <= 31; i++) {
      const day = document.createElement('div');
      day.classList.add('date-picker__calendar__body__day');
      day.textContent = i;
      parentNode.appendChild(day);
    }
  }

  handleShowCalendar(datePicker) {
    if (this.calendar) {
      this.handleRemoveCalendar(this.calendar, datePicker);
      return;
    }

    this.calendar = this.createCalendar(datePicker);
    document.body.appendChild(this.calendar);

    setTimeout(() => {
      document.addEventListener('click', (e) => {
        this.outsideClickHandler(this.calendar, datePicker, e);
      });
    });
  }

  handleRemoveCalendar(datePicker) {
    if (this.calendar && this.calendar.parentNode) {
      this.calendar.parentNode.removeChild(this.calendar);
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
