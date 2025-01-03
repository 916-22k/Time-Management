let square = document.getElementById('blue-square');
let positionX = window.innerWidth / 2;
let startX = 0;
let startY = 0;

// Adjust sensitivity multiplier for touch movements
const desktopSensitivity = 0.12; // Default desktop sensitivity
const mobileSensitivity = 0.01; // Increase this value for faster mobile movement

function updatePosition(delta) {
    positionX += delta;
    square.style.left = positionX + 'px';
}

window.addEventListener('wheel', (event) => {
    // Combine horizontal (deltaX) and vertical (deltaY) scroll into horizontal movement
    updatePosition((event.deltaX + event.deltaY) * desktopSensitivity);
});

window.addEventListener('touchstart', (event) => {
    startX = event.touches[0].clientX;
    startY = event.touches[0].clientY;
});

window.addEventListener('touchmove', (event) => {
    // Calculate movement difference in both X and Y directions
    let deltaX = event.touches[0].clientX - startX;
    let deltaY = event.touches[0].clientY - startY;

    // Combine X and Y movement and apply a higher sensitivity for mobile
    updatePosition((deltaX + deltaY) * mobileSensitivity);

    startX = event.touches[0].clientX;
    startY = event.touches[0].clientY;
});
