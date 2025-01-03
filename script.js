let square = document.getElementById('blue-square');
let position = window.innerWidth / 2;

window.addEventListener('wheel', (event) => {
    position += event.deltaY * 0.1;
    square.style.left = position + 'px';
});
