'use strict';

const _COUNTRIES = [
  {
    id: 1,
    name: 'Vietnam',
  },
  {
    id: 2,
    name: 'America',
  },
  {
    id: 3,
    name: 'Rusia',
  },
  {
    id: 4,
    name: 'England',
  },
  {
    id: 5,
    name: 'France',
  },
  {
    id: 6,
    name: 'Germany',
  },
  {
    id: 7,
    name: 'Japan',
  },
  {
    id: 8,
    name: 'China',
  },
];

ListSorter.configure({
  callback: function (list) {
    const _rs = [];
    for (const li of list) {
      _rs.push(li.innerText)
    }
    console.log(_rs.join(','))
  }
}).run();
