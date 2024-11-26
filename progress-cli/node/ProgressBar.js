class ProgressBar {
  constructor(total = 0, size = 30) {
    this.current = 0;
    this.startTime = null;
    this.total = total;
    this.size = size;
  }

  setTotal(total) {
    this.total = total;
  }

  getTotal() {
    return this.total;
  }

  showProgress(current) {
    if (this.total < current) {
      return null;
    }

    if (this.startTime === null) {
      this.startTime = new Date().getTime() / 1000;
    }

    let now = new Date().getTime() / 1000;

    let perc = current / this.total;

    let bar = (perc * this.size).toFixed(2);

    let statusBar = '\r[';
    statusBar += '='.repeat(bar);

    if (bar < this.size) {
      statusBar += '>';
      statusBar += '-'.repeat(this.size - bar);
    } else {
      statusBar += '=';
    }

    let disp = parseInt(perc * 100);

    statusBar += `] ${disp}% ${current}/${this.total}`;

    let rate = (now - this.startTime) / current;
    let left = this.total - current;
    let eta = (rate * left).toFixed(2);

    let elapsed = (now - this.startTime).toFixed(2);

    statusBar += ' remaining: ' + eta + ' sec. elapsed: ' + elapsed + ' sec.';

    console.log(statusBar);

    if (current == this.total) {
      console.log('Done.');
    }
  }
}

module.exports = ProgressBar;
