const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const resetButton = document.getElementById('reset');

const circles = [{
        x: 50,
        y: 50,
        color: 'yellow',
        hit: false
    },
    {
        x: 50,
        y: 150,
        color: 'blue',
        hit: false
    },
    {
        x: 50,
        y: 250,
        color: 'red',
        hit: false
    },
    {
        x: 50,
        y: 350,
        color: 'green',
        hit: false
    }
];
const arrows = circles.map((circle, index) => ({
    x: 550,
    y: circle.y,
    target: circle,
    moving: false,
    color: 'black'
}));

function drawCircles() {
    circles.forEach(circle => {
        ctx.beginPath();
        ctx.arc(circle.x, circle.y, 30, 0, Math.PI * 2);
        ctx.fillStyle = circle.color;
        ctx.fill();
        ctx.closePath();
    });
}

function drawArrow(arrow) {
    const headLength = 10; // length of head in pixels
    const dx = arrow.target.x - arrow.x;
    const dy = arrow.target.y - arrow.y;
    const angle = Math.atan2(dy, dx);

    ctx.beginPath();
    ctx.moveTo(arrow.x, arrow.y);
    ctx.lineTo(arrow.x + Math.cos(angle) * 40, arrow.y + Math.sin(angle) * 40);
    ctx.strokeStyle = arrow.color;
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(arrow.x + Math.cos(angle) * 40, arrow.y + Math.sin(angle) * 40);
    ctx.lineTo(arrow.x + Math.cos(angle) * 40 - headLength * Math.cos(angle - Math.PI / 6), arrow.y + Math.sin(angle) * 40 - headLength * Math.sin(angle - Math.PI / 6));
    ctx.lineTo(arrow.x + Math.cos(angle) * 40 - headLength * Math.cos(angle + Math.PI / 6), arrow.y + Math.sin(angle) * 40 - headLength * Math.sin(angle + Math.PI / 6));
    ctx.lineTo(arrow.x + Math.cos(angle) * 40, arrow.y + Math.sin(angle) * 40);
    ctx.fillStyle = arrow.color;
    ctx.fill();
}

function drawArrows() {
    arrows.forEach(arrow => {
        if (arrow.moving) {
            arrow.x -= 2; // speed of arrow
            if (arrow.x <= arrow.target.x + 30) {
                arrow.x = arrow.target.x + 30;
                arrow.target.hit = true;
                arrow.target.color = 'gray';
                arrow.moving = false;
            }
        }
        drawArrow(arrow);
    });
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawCircles();
    drawArrows();
    requestAnimationFrame(draw);
}

canvas.addEventListener('click', (e) => {
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    circles.forEach((circle, index) => {
        if (Math.sqrt((x - circle.x) ** 2 + (y - circle.y) ** 2) < 30 && !circle.hit) {
            arrows[index].moving = true;
        }
    });
});

resetButton.addEventListener('click', () => {
    circles.forEach(circle => {
        circle.hit = false;
        circle.color = circle.color === 'gray' ? 'black' : circle.color;
    });
    arrows.forEach(arrow => {
        arrow.x = 550;
        arrow.moving = false;
    });
});

draw();