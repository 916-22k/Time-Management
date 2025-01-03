let square = document.getElementById('blue-square');
let position = window.innerWidth / 2;
let startX = 0;

function updatePosition(delta) {
    position += delta * 0.1;
    square.style.left = position + 'px';
}

window.addEventListener('wheel', (event) => {
    updatePosition(event.deltaY);
});

window.addEventListener('touchstart', (event) => {
    startX = event.touches[0].clientX;
});

window.addEventListener('touchmove', (event) => {
    let deltaX = event.touches[0].clientX - startX;
    updatePosition(-deltaX);
    startX = event.touches[0].clientX;
});
