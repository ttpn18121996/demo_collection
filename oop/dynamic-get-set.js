class User {
  attributes = {};

  constructor(attributes = {}) {
    this.attributes = {...this.attributes, ...attributes};
    return new Proxy(this, {
      get(model, key, receiver) {
        const value = model[key];
        if (value instanceof Function) {
          return function (...args) {
            return value.apply(this === receiver ? model : this, args);
          }
        }

        if (key in model) {
          return Reflect.get(model, key, receiver);
        }

        return model.getAttributes(key);
      },
      set(model, key, value) {
        if (key in model) {
          Reflect.set(model, key, value);
          return;
        }

        model.setAttributes(key, value);
      },
    });
  }

  getAttributes(key = null) {
    if (key === null) {
      return this.attributes;
    }

    return key in this.attributes ? this.attributes[key] : null;
  }

  setAttributes(key, value) {
    this.attributes[key] = value;
  }

  save() {
    console.log(this.attributes);
  }
}

const user = new User({ id: 1 });
console.log(user.getAttributes());
user.name = 'Nam';
user.email = 'ttpn18121996@example.com';
user.save();





