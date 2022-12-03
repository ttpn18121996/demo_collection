const _COUNTRIES = [
    {
        id: 1,
        name: 'Vietnam',
    },
    {
        id: 2,
        name: 'American',
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
        name: 'Japan',
    },
    {
        id: 7,
        name: 'China',
    },
];

function loadCountries(parent) {
    for (const country of _COUNTRIES) {
        const item = document.createElement('li');
        li.id = item.id;
        li.innerText = country.name;
        parent.appendChild(li);
    }
}
