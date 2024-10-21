function range(start, end) {
  const rs = [];
  for (let i = start; i <= end; i++) {
    rs.push(i);
  }

  return rs;
}

class UrlWindow {
  constructor(currentPage, totalPage, onEachSide = 3) {
    this.currentPage = currentPage;
    this.totalPage = totalPage;
    this.onEachSide = onEachSide;
  }

  get() {
    if (this.totalPage <= 1) {
      return null;
    }

    if (this.totalPage < this.onEachSide * 2 + 8) {
      return this.getSmallSilder();
    }

    return this.getUrlSilder();
  }

  getSmallSilder() {
    return {
      first: range(1, this.totalPage),
      slider: [],
      last: [],
    };
  }

  getUrlSilder() {
    const window = this.onEachSide + 4;
    const totalPage = this.totalPage;
    const elements = {
      first: [1, 2],
      slider: [],
      last: [totalPage - 1, totalPage],
    };

    if (this.currentPage <= window) {
      elements.first = range(1, window + this.onEachSide);
    } else if (this.currentPage > totalPage - window) {
      elements.last = range(this.currentPage - this.onEachSide, totalPage);
    } else {
      elements.slider = range(this.currentPage - this.onEachSide, this.currentPage + this.onEachSide);
    }

    return elements;
  }
}

console.log(new UrlWindow(9, 20, 3).get());
