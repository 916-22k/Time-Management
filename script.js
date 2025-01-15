const currentDate = new Date();
const year = 2025;
const daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
const currentMonth = currentDate.getMonth();
const currentDay = currentDate.getDate();
let dayOfYear = currentDay + daysInMonth.slice(0, currentMonth).reduce((a, b) => a + b, 0);
const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const currentDayName = dayNames[currentDate.getDay()];
document.title = "Time";
let currentHour = currentDate.getHours();
const dayString = `${currentDayName} ${String(currentDay).padStart(2, '0')}/${String(currentMonth + 1).padStart(2, '0')}`;
let startX = 0, startY = 0, scrollSpeed = /Android/i.test(navigator.userAgent) ? 1.5 : /Windows NT/i.test(navigator.userAgent) ? 0.5 : 0.1;
let container = document.getElementById('container');
let days = [];
const textbox = document.createElement('div');
textbox.id = 'textbox';
textbox.textContent = `${dayString}\n`;
document.body.appendChild(textbox);
const line = document.createElement('div');
line.id = 'line';
document.body.appendChild(line);

function calculateSpiralPosition(hourIndex, dayIndex) {
    const radius = 50;
    const angle = (hourIndex / 24) * (2 * Math.PI);
    const zDepth = Math.sin(angle) * 200;
    const yPosition = Math.cos(angle) * 200;
    const xPosition = ((hourIndex - currentHour) * 60) + ((dayIndex - (currentDay - 1)) * 1450);
    return { x: xPosition, y: yPosition, z: zDepth };
}

for (let dayIndex = 0; dayIndex < currentDay + 7; dayIndex++) {
    let day = [];
    for (let hourIndex = 0; hourIndex < 24; hourIndex++) {
        let square = document.createElement('div');
        square.className = 'square';
        square.setAttribute('data-hour', hourIndex + 1);
        square.setAttribute('data-day', dayIndex + 1);
        square.setAttribute('data-Records', '');
        const { x, y, z } = calculateSpiralPosition(hourIndex, dayIndex);
        square.style.left = `${window.innerWidth / 2 + x}px`;
        square.style.top = `${window.innerHeight / 2 + y}px`;
        square.style.transform = `translateZ(${z}px) rotateY(60deg)`;
        square.style.width = '50px';
        square.style.height = '50px';
        if (dayIndex === currentDay - 1 && hourIndex === currentHour) {
            square.style.backgroundColor = 'red';
        }
        day.push(square);
    }
    days.push(day);
}

days.forEach((day) => {
    day.forEach((hourSquare) => {
        container.appendChild(hourSquare);
    });
});

fetch('timeframes.txt')
    .then(response => response.text())
    .then(data => {
        const lines = data.split('\n');
        lines.forEach(line => {
            const [day, hour, activity, color] = line.split(',');
            const square = document.querySelector(`[data-day="${day}"][data-hour="${hour}"]`);
            if (square) {
                square.style.backgroundColor = color.trim();
                square.setAttribute('data-Records', activity.trim());
            }
        });
    });

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
                const Records = square.getAttribute('data-Records') || 'No Activity';
                textbox.textContent = `${dayString}\nRecords: Day ${day}, Hour ${hour} - ${Records}`;
            }
        });
    });
}

window.addEventListener('wheel', (event) => updatePosition(event.deltaX + event.deltaY));
window.addEventListener('touchstart', (event) => {
    startX = event.touches[0].clientX;
    startY = event.touches[0].clientY;
});
window.addEventListener('touchmove', (event) => {
    event.preventDefault();
    let deltaX = event.touches[0].clientX - startX;
    let deltaY = event.touches[0].clientY - startY;
    updatePosition(deltaX + deltaY);
    startX = event.touches[0].clientX;
    startY = event.touches[0].clientY;
}, { passive: false });
