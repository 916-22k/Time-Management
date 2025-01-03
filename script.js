let square = document.getElementById('blue-square');
let positionX = window.innerWidth / 2;
let startX = 0;
let startY = 0;

function updatePosition(delta) {
    positionX += delta * 0.1;
    square.style.left = positionX + 'px';
}

window.addEventListener('wheel', (event) => {
    // Combine horizontal (deltaX) and vertical (deltaY) scroll into horizontal movement
    updatePosition(event.deltaX + event.deltaY);
});

window.addEventListener('touchstart', (event) => {
    startX = event.touches[0].clientX;
    startY = event.touches[0].clientY;
});

window.addEventListener('touchmove', (event) => {
    let deltaX = event.touches[0].clientX - startX;
    let deltaY = event.touches[0].clientY - startY;

    // Treat vertical movement (deltaY) as horizontal movement
    updatePosition(deltaX + deltaY);

    startX = event.touches[0].clientX;
    startY = event.touches[0].clientY;
});
