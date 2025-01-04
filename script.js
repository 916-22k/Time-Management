let positionX = window.innerWidth / 2;
let startX = 0;
let startY = 0;
let scrollSpeed = 0.1;

if (/Android/i.test(navigator.userAgent)) {
    scrollSpeed = 1.5;
} else if (/Windows NT/i.test(navigator.userAgent)) {
    scrollSpeed = 0.1;
}

let container = document.getElementById('container');
let days = [];

// Get the current hour (0-23)
let currentHour = new Date().getHours();

// Initialize squares and assign positions
for (let dayIndex = 0; dayIndex < 1; dayIndex++) { // Focus on one day
    let day = [];
    for (let hourIndex = 0; hourIndex < 24; hourIndex++) {
        let square = document.createElement('div');
        square.className = 'square';
        square.setAttribute('data-hour', hourIndex + 1);

        // Calculate initial horizontal position
        if (hourIndex + 1 === currentHour) {
            square.positionX = window.innerWidth / 2; // Center the current hour square
        } else if (hourIndex + 1 < currentHour) {
            let offset = (currentHour - (hourIndex + 1)) * 60; // 50px square + 10px padding
            square.positionX = window.innerWidth / 2 - offset;
        } else if (hourIndex + 1 > currentHour) {
            let offset = ((hourIndex + 1) - currentHour) * 60; // 50px square + 10px padding
            square.positionX = window.innerWidth / 2 + offset;
        }

        // Apply the calculated position to the square
        square.style.left = `${square.positionX}px`;

        day.push(square);
    }
    days.push(day);
}

// Append squares to the container
days.forEach((day) => {
    day.forEach((hourSquare) => {
        container.appendChild(hourSquare);
    });
});

// Update positions of all squares on scroll
function updatePosition(delta) {
    days.forEach((day) => {
        day.forEach((square) => {
            square.positionX += delta * scrollSpeed;
            square.style.left = `${square.positionX}px`; // Update position visually
        });
    });
}

// Event listeners for scrolling
window.addEventListener('wheel', (event) => {
    updatePosition(event.deltaX + event.deltaY);
});

window.addEventListener('touchstart', (event) => {
    startX = event.touches[0].clientX;
    startY = event.touches[0].clientY;
});

window.addEventListener('touchmove', (event) => {
    let deltaX = event.touches[0].clientX - startX;
    let deltaY = event.touches[0].clientY - startY;
    updatePosition(deltaX + deltaY);
    startX = event.touches[0].clientX;
    startY = event.touches[0].clientY;
});
