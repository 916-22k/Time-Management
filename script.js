let square = document.getElementById('blue-square');
let positionX = window.innerWidth / 2;
let startX = 0;
let startY = 0;

let scrollSpeed = 0.1; // Default scroll speed for desktop

// Check if the User-Agent is for a mobile device (Android)
if (/Android/i.test(navigator.userAgent)) {
    scrollSpeed = 2; // Increase speed for mobile (Android)
} else if (/Windows NT/i.test(navigator.userAgent)) {
    scrollSpeed = 0.1; // Default scroll speed for Windows desktop (no change needed)
}

function updatePosition(delta) {
    positionX += delta * scrollSpeed;
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
