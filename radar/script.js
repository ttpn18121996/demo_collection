const radar = document.getElementById('radar');
const TARGET_COUNT = 10;

function generateTarget() {
    const div = document.createElement('div');
    div.classList.add('target');
    div.style.top = Math.floor(Math.random() * 100) + '%';
    div.style.left = Math.floor(Math.random() * 100) + '%';
    return div;
}

function showTarget() {
    document.querySelectorAll('.target').forEach(target => {
        target.remove();
    });
    for (let i = 0; i < TARGET_COUNT; i++) {
        radar.append(generateTarget());
    }
}
showTarget();
setInterval(function () {
    showTarget();
}, 3000);
