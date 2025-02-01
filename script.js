document.addEventListener("DOMContentLoaded", async () => {
    const container = document.getElementById('container');
    const currentDate = new Date();
    const currentHour = currentDate.getHours();
    const currentDay = currentDate.getDate();
    const year = 2025;
    const daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    const currentMonth = currentDate.getMonth();
    const monthIndexForTimeframes=currentDate.getMonth()+1;
    const timeframeFile=`timeframes${monthIndexForTimeframes}.txt`;
    const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const firstDayOfYear = new Date(year, 0, 1).getDay(); // Day of the week for Jan 1, 2025
    const startDayOffset = firstDayOfYear; // Use this to correct the alignment
    const currentDayName = dayNames[currentDate.getDay()];
    const dayString = `${currentDayName} ${String(currentDay).padStart(2, '0')}/${String(currentMonth + 1).padStart(2, '0')}`;
    const textbox = document.createElement('div');
    textbox.id = 'textbox';
    textbox.textContent = `${dayString}\n`; // Initial content
    document.body.appendChild(textbox);

    const line = document.createElement('div');
    line.id = 'line';
    document.body.appendChild(line);

    let scrollSpeed = /Android/i.test(navigator.userAgent) ? 1.5 : /Windows NT/i.test(navigator.userAgent) ? 0.5 : 0.1;

    const days = [];

    async function fetchTimeframes() {
        try {
            const response = await fetch(`https://916-22k.github.io/Time-Management/${timeframeFile}`);
            const text = await response.text();
            const lines = text.trim().split("\n");

            const timeframes = [];
            lines.forEach((line) => {
                const [day, hour, action, color] = line.split(",");
                timeframes.push({
                    day: parseInt(day, 10),
                    hour: parseInt(hour, 10),
                    action,
                    color,
                });
            });

            // Sort timeframes first by day, then by hour
            timeframes.sort((a, b) => {
                if (a.day !== b.day) return a.day - b.day;
                return a.hour - b.hour;
            });

            return timeframes;
        } catch (error) {
            console.error("Error fetching timeframes:", error);
            return [];
        }
    }

    function getTaskForDayAndHour(day, hour, timeframes) {
        for (let i = 0; i < timeframes.length; i++) {
            const start = timeframes[i];
            const end = timeframes[i + 1] || { day: Infinity, hour: Infinity }; // End defaults to infinity if last record

            if (
                (day > start.day || (day === start.day && hour >= start.hour)) &&
                (day < end.day || (day === end.day && hour < end.hour))
            ) {
                return start;
            }
        }
        return null;
    }

    function calculateSpiralPosition(hourIndex, dayIndex) {
        const angle = (hourIndex / 24) * (2 * Math.PI);
        const zDepth = Math.sin(angle) * 200;
        const yPosition = Math.cos(angle) * 200;
        const xPosition = ((hourIndex - currentHour) * 60) + ((dayIndex - (currentDay - 1)) * 1440);
        return { x: xPosition, y: yPosition, z: zDepth };
    }

    async function generateSquares() {
        const timeframes = await fetchTimeframes();

        for (let dayIndex = 0; dayIndex < currentDay + 7; dayIndex++) {
            let day = [];
            for (let hourIndex = 0; hourIndex < 24; hourIndex++) {
                const task = getTaskForDayAndHour(dayIndex + 1, hourIndex, timeframes);
                const square = document.createElement('div');
                square.className = 'square';
                square.setAttribute('data-hour', hourIndex + 1);
                square.setAttribute('data-day', dayIndex + 1);
                square.setAttribute('data-action', task ? task.action : '');
                square.setAttribute('data-color', task ? task.color : '');

                const { x, y, z } = calculateSpiralPosition(hourIndex, dayIndex);

                square.style.left = `${window.innerWidth / 2 + x}px`;
                square.style.top = `${window.innerHeight / 2 + y}px`;
                square.style.transform = `translateZ(${z}px) rotateY(60deg)`;
                square.style.width = '40px';
                square.style.height = '40px';

                if (dayIndex + 1 === currentDay && hourIndex === currentHour) {
                    square.style.backgroundColor = 'cyan';
                } else if (task) {
                    square.style.backgroundColor = task.color;
                }

                day.push(square);
            }
            days.push(day);
        }

        days.forEach((day, dayIndex) => {
            day.forEach((hourSquare) => {
                const correctedDayNameIndex = (dayIndex + startDayOffset) % 7;
                const correctedDayName = dayNames[correctedDayNameIndex];
                hourSquare.setAttribute('data-dayname', correctedDayName); // Add day name attribute
                container.appendChild(hourSquare);
            });
        });
    }

    function updatePosition(delta) {
        days.forEach((day) => {
            day.forEach((square) => {
                // Update position of each square
                const xMovement = delta * scrollSpeed;
                square.style.left = parseFloat(square.style.left) + xMovement + 'px';
    
                // Check for collision with the green line
                const lineCenterX = window.innerWidth / 2; // Center of the green line
                const squareLeft = parseFloat(square.style.left);
                const squareRight = squareLeft + parseFloat(square.style.width);
    
                // Update if the line intersects the hitbox (left to right)
                if (lineCenterX >= squareLeft && lineCenterX <= squareRight) {
                    const day = square.getAttribute('data-day');
                    const hour = square.getAttribute('data-hour');
                    const action = square.getAttribute('data-action');
                    const squareDayName = square.getAttribute('data-dayname');
    
                    // Update the textbox content immediately
                    textbox.textContent = `${squareDayName}\nDay: ${day}, Hour: ${hour}\nAction: ${action || 'None'}`;
                }
            });
        });
    }
    

    window.addEventListener('wheel', (event) => {
        updatePosition(event.deltaX + event.deltaY);
    });

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

    await generateSquares();
});
