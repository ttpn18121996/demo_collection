const Macroable = {
  macroList: {},
  macro: (key, callback) => {
    Macroable.macroList[key] = callback;
  },
  has: key => {
    return Macroable.macroList?.[key];
  },
  get: (key, defaultValue = () => undefined) => {
    return Macroable.has(key) || defaultValue;
  },
};

class Collection {
  static macroable = Macroable;
  items = [];

  constructor(list = []) {
    this.items = list;
  }

  static macro(key, callback) {
    Collection.macroable.macro(key, callback);
  }

  call(key) {
    if (Collection.macroable.has(key)) {
      const _this = this;

      return function () {
        return Collection.macroable.get(key)(_this, ...arguments);
      };
    }

    return () => undefined;
  }
}

Collection.macro('map', (_this, callback) => {
  return _this.items.map(callback); 
});

Collection.macro('toString', (_this) => {
  return _this.call('map')(i => i.name)?.join(', '); 
});

const collect = new Collection([{id: 1, name: 'Nam'}, {id: 2, name: 'Nguyet'}]);
console.log(collect.call('toString')())
console.log(collect.call('map')(item => item.name))
