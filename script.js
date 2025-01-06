// Calculate the current day of the year for 2025
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

// Initialize square data for 5 days (120 squares)
for (let dayIndex = 0; dayIndex < 6; dayIndex++) { // Generate 5 days (24 * 5 = 120 squares)
    let day = [];
    for (let hourIndex = 0; hourIndex < 24; hourIndex++) {
        let square = document.createElement('div');
        square.className = 'square';
        square.setAttribute('data-hour', hourIndex + 1);
        square.setAttribute('data-day', dayIndex + 1);
        square.setAttribute('data-notes', ''); // Empty notes attribute

        // Calculate initial horizontal position
        let offset = ((dayIndex * 24 + hourIndex + 1) - (dayOfYear - 1) * 24 - currentHour) * 60; // 50px square + 10px padding
        square.positionX = window.innerWidth / 2 + offset;
        square.style.left = `${square.positionX}px`;

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
            // Update position using delta
            square.positionX += delta * scrollSpeed;

            // Constrain position within visible bounds
            if (square.positionX < -60) { // Slight buffer for squares offscreen left
                square.style.display = "none"; // Hide squares completely offscreen
            } else if (square.positionX > window.innerWidth + 60) {
                square.style.display = "none"; // Hide squares completely offscreen
            } else {
                square.style.display = "block"; // Show squares within bounds
                square.style.left = `${square.positionX}px`;
            }

            // Check if the square intersects the green line
            const lineCenterX = window.innerWidth / 2;
            const squareLeft = square.positionX;
            const squareRight = square.positionX + 50;

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
