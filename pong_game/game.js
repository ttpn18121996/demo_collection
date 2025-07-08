const canvas = document.getElementById('pong');
const ctx = canvas.getContext('2d');

// Game settings
const paddleWidth = 14, paddleHeight = 100;
const ballRadius = 10;
const playerX = 10;
const aiX = canvas.width - paddleWidth - 10;

// Game objects
let playerY = (canvas.height - paddleHeight) / 2;
let aiY = (canvas.height - paddleHeight) / 2;
let ball = {
  x: canvas.width / 2,
  y: canvas.height / 2,
  vx: 6 * (Math.random() > 0.5 ? 1 : -1),
  vy: 4 * (Math.random() > 0.5 ? 1 : -1)
};

// Mouse control
canvas.addEventListener('mousemove', function(e) {
  const rect = canvas.getBoundingClientRect();
  const mouseY = e.clientY - rect.top;
  playerY = mouseY - paddleHeight / 2;
  // Clamp paddle to canvas
  playerY = Math.max(0, Math.min(canvas.height - paddleHeight, playerY));
});

// Draw everything
function draw() {
  // Background
  ctx.fillStyle = '#222';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Net
  ctx.strokeStyle = '#fff';
  ctx.setLineDash([10, 15]);
  ctx.beginPath();
  ctx.moveTo(canvas.width/2, 0);
  ctx.lineTo(canvas.width/2, canvas.height);
  ctx.stroke();
  ctx.setLineDash([]);

  // Paddles
  ctx.fillStyle = '#fff';
  ctx.fillRect(playerX, playerY, paddleWidth, paddleHeight);
  ctx.fillRect(aiX, aiY, paddleWidth, paddleHeight);

  // Ball
  ctx.beginPath();
  ctx.arc(ball.x, ball.y, ballRadius, 0, Math.PI*2);
  ctx.fill();
}

// Update positions and check collisions
function update() {
  // Move ball
  ball.x += ball.vx;
  ball.y += ball.vy;

  // Ball collision with top and bottom
  if (ball.y - ballRadius < 0) {
    ball.y = ballRadius;
    ball.vy *= -1;
  }
  if (ball.y + ballRadius > canvas.height) {
    ball.y = canvas.height - ballRadius;
    ball.vy *= -1;
  }

  // Ball collision with player paddle
  if (
    ball.x - ballRadius < playerX + paddleWidth &&
    ball.y > playerY &&
    ball.y < playerY + paddleHeight
  ) {
    ball.x = playerX + paddleWidth + ballRadius;
    ball.vx *= -1.08; // speed up a bit
    // Add a bit of "english" based on where hit
    let deltaY = ball.y - (playerY + paddleHeight / 2);
    ball.vy += deltaY * 0.15;
  }

  // Ball collision with AI paddle
  if (
    ball.x + ballRadius > aiX &&
    ball.y > aiY &&
    ball.y < aiY + paddleHeight
  ) {
    ball.x = aiX - ballRadius;
    ball.vx *= -1.08; // speed up a bit
    let deltaY = ball.y - (aiY + paddleHeight / 2);
    ball.vy += deltaY * 0.15;
  }

  // Ball out of bounds (left or right)
  if (ball.x < 0 || ball.x > canvas.width) {
    // Reset ball to center
    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2;
    ball.vx = 6 * (Math.random() > 0.5 ? 1 : -1);
    ball.vy = 4 * (Math.random() > 0.5 ? 1 : -1);
  }

  // AI movement: simple follow ball
  let aiCenter = aiY + paddleHeight / 2;
  if (aiCenter < ball.y - 20) {
    aiY += Math.min(6, ball.y - aiCenter);
  } else if (aiCenter > ball.y + 20) {
    aiY -= Math.min(6, aiCenter - ball.y);
  }
  // Clamp AI paddle
  aiY = Math.max(0, Math.min(canvas.height - paddleHeight, aiY));
}

// Main loop
function loop() {
  update();
  draw();
  requestAnimationFrame(loop);
}

loop();

