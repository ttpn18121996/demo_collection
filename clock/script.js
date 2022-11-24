const container = document.getElementsByClassName('container');
const hourHand = document.getElementById('hour');
const minuteHand = document.getElementById('minute');
const secondsHand = document.getElementById('seconds');

function setTimeNow() {
    const now = new Date();
    const h = now.getHours();
    const m = now.getMinutes();
    const s = now.getSeconds();
    hourHand.style.transform = 'rotate(' + (h % 12) * 30 + 'deg)';
    minuteHand.style.transform = 'rotate(' + m * 6 + 'deg)';
    secondsHand.style.transform = 'rotate(' + s * 6 + 'deg)';
}

function generateDotAndDash(className, time) {
    const div = document.createElement('div');
    div.classList.add(className);
    div.style.transform = 'translate(-50%, -50%) rotate(' + time * 6 + 'deg)';
    return div;
}
console.log(container);
for (let i = 0; i < 60; i++) {
    container[0].append(generateDotAndDash(i % 5 === 0 ? 'dash' : 'dot', i));
}

setInterval(setTimeNow, 1000);
