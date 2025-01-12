const currentDate = new Date();
const year = 2025;

// Days in each month for 2025 (non-leap year)
const daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

// Fetch the current month and day
const currentMonth = currentDate.getMonth(); // 0-indexed (January = 0, February = 1, etc.)
const currentDay = currentDate.getDate();   // Day of the month (1-indexed)

// Calculate the current day of the year
let dayOfYear = currentDay;
for (let i = 0; i < currentMonth; i++) {
    dayOfYear += daysInMonth[i];
}

// Get the current day name (e.g., Monday, Tuesday, etc.)
const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const currentDayName = dayNames[currentDate.getDay()];

// Set the title of the webpage dynamically based on the current date
document.title = "Time";

// Calculate the current hour (0-23)
let currentHour = currentDate.getHours();

// Get the day name and date for the textbox
const dayString = `${currentDayName} ${String(currentDay).padStart(2, '0')}/${String(currentMonth + 1).padStart(2, '0')}`;

// Initialize squares and assign positions
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

// Add the textbox
const textbox = document.createElement('div');
textbox.id = 'textbox';
textbox.textContent = `${dayString}\n`; // Add the current day and date at the top
document.body.appendChild(textbox);

// Add the static green line
const line = document.createElement('div');
line.id = 'line';
document.body.appendChild(line);

// Custom function to calculate the position and depth of each square
// This will create a spiral helix effect where squares move in a leftward spiral
function calculateSpiralPosition(hourIndex, dayIndex) {
    const radius = 50;  // Distance from the center
    const angle = (hourIndex / 24) * (2 * Math.PI);  // Angle in radians
    const zDepth = Math.sin(angle) * 200;  // Z axis (toward/away from viewer)
    const yPosition = Math.cos(angle) * 100;  // Y axis (vertical position)
    const xPosition = (hourIndex - 12) * 60;  // X axis (left-right movement)

    return { x: xPosition, y: yPosition + (dayIndex * 250), z: zDepth };
}

for (let dayIndex = 0; dayIndex < 365; dayIndex++) {
    let day = [];
    for (let hourIndex = 0; hourIndex < 24; hourIndex++) {
        let square = document.createElement('div');
        square.className = 'square';
        square.setAttribute('data-hour', hourIndex + 1);
        square.setAttribute('data-day', dayIndex + 1);
        square.setAttribute('data-notes', ''); // Empty notes attribute

        // Calculate the spiral position for the current square
        const { x, y, z } = calculateSpiralPosition(hourIndex, dayIndex);

        // Apply the calculated position and depth (Z-axis movement)
        square.style.left = `${window.innerWidth / 2 + x}px`;
        square.style.top = `${window.innerHeight / 2 + y}px`;
        square.style.transform = `translateZ(${z}px) rotateY(60deg)`;  // 2D transform with Z depth

        // Set the size of the squares
        square.style.width = '50px';
        square.style.height = '50px';

        // Center the current hour and set it to red
        if (dayIndex + 1 === currentDay && hourIndex + 1 === currentHour) {
            square.style.backgroundColor = 'red'; // Highlight the current square
        }

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

function updatePosition(delta) {
    days.forEach((day) => {
        day.forEach((square) => {
            // Update position using delta for horizontal movement
            const xMovement = delta * scrollSpeed;
            square.style.left = parseFloat(square.style.left) + xMovement + 'px';

            // Check if the square intersects the green line
            const lineCenterX = window.innerWidth / 2;
            const squareLeft = parseFloat(square.style.left);
            const squareRight = squareLeft + parseFloat(square.style.width);

            if (squareLeft <= lineCenterX && squareRight >= lineCenterX) {
                // Update textbox with square attributes
                const day = square.getAttribute('data-day');
                const hour = square.getAttribute('data-hour');
                const notes = square.getAttribute('data-notes');

                textbox.textContent = `${dayString}\nNotes: ${notes}`;
            }
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

// Prevent page scrolling when swiping or touching
window.addEventListener('touchmove', (event) => {
    // Prevent default touch behavior (like scrolling the page)
    event.preventDefault();

    let deltaX = event.touches[0].clientX - startX;
    let deltaY = event.touches[0].clientY - startY;
    updatePosition(deltaX + deltaY);
    startX = event.touches[0].clientX;
    startY = event.touches[0].clientY;
}, { passive: false }); // Use passive: false to allow preventDefault
