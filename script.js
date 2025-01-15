const currentDate = new Date();
const year = 2025;

// Initialize constants and variables
const daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const currentMonth = currentDate.getMonth();
const currentDay = currentDate.getDate();
const currentHour = currentDate.getHours();
const currentDayName = dayNames[currentDate.getDay()];
const dayString = `${currentDayName} ${String(currentDay).padStart(2, '0')}/${String(currentMonth + 1).padStart(2, '0')}`;
let dayOfYear = daysInMonth.slice(0, currentMonth).reduce((acc, days) => acc + days, currentDay);

// Set dynamic title
document.title = "Time";

// Adjust scroll speed based on device
let scrollSpeed = /Android/i.test(navigator.userAgent) ? 1.5 : (/Windows NT/i.test(navigator.userAgent) ? 0.5 : 0.1);

// Create elements
const container = document.getElementById('container');
const textbox = document.createElement('div');
const line = document.createElement('div');
textbox.id = 'textbox';
textbox.textContent = `${dayString}\n`;
line.id = 'line';
document.body.appendChild(textbox);
document.body.appendChild(line);

// Calculate position in a spiral
function calculateSpiralPosition(hourIndex, dayIndex) {
    const radius = 50;
    const angle = (hourIndex / 24) * (2 * Math.PI);
    const zDepth = Math.sin(angle) * 200;
    const yPosition = Math.cos(angle) * 200;
    const xPosition = ((hourIndex - currentHour) * 60) + ((dayIndex - (currentDay - 1)) * 1450);
    return { x: xPosition, y: yPosition, z: zDepth };
}

// Generate squares and append them
const days = Array.from({ length: currentDay + 7 }, (_, dayIndex) =>
    Array.from({ length: 24 }, (_, hourIndex) => {
        const square = document.createElement('div');
        const { x, y, z } = calculateSpiralPosition(hourIndex, dayIndex);
        square.className = 'square';
        square.setAttribute('data-hour', hourIndex + 1);
        square.setAttribute('data-day', dayIndex + 1);
        square.setAttribute('data-Records', '');
        square.style.cssText = `
            left: ${window.innerWidth / 2 + x}px;
            top: ${window.innerHeight / 2 + y}px;
            transform: translateZ(${z}px) rotateY(60deg);
            width: 50px;
            height: 50px;
        `;
        if (dayIndex === currentDay - 1 && hourIndex === currentHour) {
            square.style.backgroundColor = 'red';
        }
        if (dayIndex === 0 && hourIndex < 7) {
            square.style.backgroundColor = 'blue';
        }
        container.appendChild(square);
        return square;
    })
);

// Update position during scrolling
function updatePosition(delta) {
    days.forEach((day) => {
        day.forEach((square) => {
            const xMovement = delta * scrollSpeed;
            square.style.left = parseFloat(square.style.left) + xMovement + 'px';
            const lineCenterX = window.innerWidth / 2;
            const squareLeft = parseFloat(square.style.left);
            const squareRight = squareLeft + parseFloat(square.style.width);
            if (squareLeft <= lineCenterX && squareRight >= lineCenterX) {
                const day = square.getAttribute('data-day');
                const hour = square.getAttribute('data-hour');
                const Records = square.getAttribute('data-Records') + "Hour: " + hour;
                textbox.textContent = `${dayString}\nRecords: ${Records}`;
            }
        });
    });
}

// Event listeners for scrolling and touch
window.addEventListener('wheel', (event) => updatePosition(event.deltaX + event.deltaY));
window.addEventListener('touchstart', (event) => {
    startX = event.touches[0].clientX;
    startY = event.touches[0].clientY;
});
window.addEventListener('touchmove', (event) => {
    event.preventDefault();
    const deltaX = event.touches[0].clientX - startX;
    const deltaY = event.touches[0].clientY - startY;
    updatePosition(deltaX + deltaY);
    startX = event.touches[0].clientX;
    startY = event.touches[0].clientY;
}, { passive: false });
