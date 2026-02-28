'use strict';

Calendar.setup({
  targetId: 'calendar',
  locale: 'vi',
  displayShortDayOfWeek: false,
  onDoubleClickToday: (e, _this) => {
    alert(_this.now.toString());
  },
  onDoubleClickDay: (e, _this, d) => {
    alert(new Date(_this.current.year, _this.current.month - 1, d).toString());
  },
  onGo: (_this) => {
    document.getElementById('current-date').textContent = _this.getTranslations('monthLabel')
      + ' '
      + `0${_this.current.month}`.slice(-2)
      + `, ${_this.current.year}`;
  },
  afterRender: (_this) => {
    document.getElementById('current-date').textContent = _this.getTranslations('monthLabel')
      + ' '
      + `0${_this.current.month}`.slice(-2)
      + `, ${_this.current.year}`;
    document.getElementById('btn_today').addEventListener('click', () => {
      _this.goToToday();
    });
    document.getElementById('btn_pre').addEventListener('click', () => {
      _this.goToPrevMonth();
    });
    document.getElementById('btn_next').addEventListener('click', () => {
      _this.goToNextMonth();
    });
  }
}).start();
