// Создаем холст
const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');
canvas.width = 800;
canvas.height = 600;
document.body.appendChild(canvas);

// Создаем игроков
const player1 = {
  x: canvas.width / 4,
  y: canvas.height / 2,
  width: 50,
  height: 50,
  speed: 5,
  angle: 0,
  health: 100,
  bullets: []
};

const player2 = {
  x: (canvas.width / 4) * 3,
  y: canvas.height / 2,
  width: 50,
  height: 50,
  speed: 5,
  angle: Math.PI,
  health: 100,
  bullets: []
};

// Создаем препятствие
const obstacle = {
  x: canvas.width / 2 - 25,
  y: canvas.height / 2 - 100,
  width: 50,
  height: 200
};

// Обработчик нажатия клавиш
const keys = [];
document.addEventListener('keydown', (e) => {
  keys[e.keyCode] = true;
});

document.addEventListener('keyup', (e) => {
  keys[e.keyCode] = false;
});

// Функция для проверки столкновений
function checkCollision(rect1, rect2) {
  if (
    rect1.x < rect2.x + rect2.width &&
    rect1.x + rect1.width > rect2.x &&
    rect1.y < rect2.y + rect2.height &&
    rect1.y + rect1.height > rect2.y
  ) {
    return true;
  }
  return false;
}

// Функция для нанесения урона игроку
function damagePlayer(player) {
  player.health -= 10;
  if (player.health <= 0) {
    // Игрок погиб
    console.log("Игрок погиб!");
  }
}

// Обновление игры
function update() {
  // Перемещение игрока 1
  if (keys[65]) {
    // A
    player1.angle -= 0.1;
  }
  if (keys[68]) {
    // D
    player1.angle += 0.1;
  }
  if (keys[87]) {
    // W
    player1.x += Math.cos(player1.angle) * player1.speed;
    player1.y += Math.sin(player1.angle) * player1.speed;
  }
  if (keys[83]) {
    // S
    player1.x -= Math.cos(player1.angle) * player1.speed;
    player1.y -= Math.sin(player1.angle) * player1.speed;
  }
  if (keys[32]) {
    // Стрельба
    player1.bullets.push({
      x: player1.x,
      y: player1.y,
      angle: player1.angle
    });
  }

  // Перемещение игрока 2
  if (keys[37]) {
    // Стрелка влево
    player2.angle -= 0.1;
  }
  if (keys[39]) {
    // Стрелка вправо
    player2.angle += 0.1;
  }
  if (keys[38]) {
    // Стрелка вверх
    player2.x += Math.cos(player2.angle) * player2.speed;
    player2.y += Math.sin(player2.angle) * player2.speed;
  }
  if (keys[40]) {
    // Стрелка вниз
    player2.x -= Math.cos(player2.angle) * player2.speed;
    player2.y -= Math.sin(player2.angle) * player2.speed;
  }
  if (keys[13]) {
    // Enter
    player2.bullets.push({
      x: player2.x,
      y: player2.y,
      angle: player2.angle
    });
  }

  // Перемещение пуль игрока 1
  player1.bullets.forEach((bullet, index) => {
    bullet.x += Math.cos(bullet.angle) * 10;
    bullet.y += Math.sin(bullet.angle) * 10;
    if (
      bullet.x < 0 ||
      bullet.x > canvas.width ||
      bullet.y < 0 ||
      bullet.y > canvas.height
    ) {
      // Пуля вышла за пределы холста, удаляем ее
      player1.bullets.splice(index, 1);
    }
  });

  // Перемещение пуль игрока 2
  player2.bullets.forEach((bullet, index) => {
    bullet.x += Math.cos(bullet.angle) * 10;
    bullet.y += Math.sin(bullet.angle) * 10;
    if (
      bullet.x < 0 ||
      bullet.x > canvas.width ||
      bullet.y < 0 ||
      bullet.y > canvas.height
    ) {
      // Пуля вышла за пределы холста, удаляем ее
      player2.bullets.splice(index, 1);
    }
  });

  // Проверка столкновений игроков
  if (checkCollision(player1, player2)) {
    // Обработка столкновения
    // Например, можно нанести урон игрокам
    damagePlayer(player1);
    damagePlayer(player2);
  }

  // Проверка столкновений пуль с препятствием
  player1.bullets.forEach((bullet, index) => {
    if (checkCollision(bullet, obstacle)) {
      // Пуля попала в препятствие
      player1.bullets.splice(index, 1);
    }
  });

  player2.bullets.forEach((bullet, index) => {
    if (checkCollision(bullet, obstacle)) {
      // Пуля попала в препятствие
      player2.bullets.splice(index, 1);
    }
  });

  // Очистка холста
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Рисуем игрока 1
  ctx.fillStyle = 'blue';
  ctx.fillRect(player1.x, player1.y, player1.width, player1.height);

  // Рисуем игрока 2
  ctx.fillStyle = 'red';
  ctx.fillRect(player2.x, player2.y, player2.width, player2.height);

  // Рисуем препятствие
  ctx.fillStyle = 'gray';
  ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);

  // Рисуем пули игрока 1
  ctx.fillStyle = 'green';
  player1.bullets.forEach((bullet) => {
    ctx.beginPath();
    ctx.arc(bullet.x, bullet.y, 5, 0, Math.PI * 2);
    ctx.fill();
  });

  // Рисуем пули игрока 2
  ctx.fillStyle = 'orange';
  player2.bullets.forEach((bullet) => {
    ctx.beginPath();
    ctx.arc(bullet.x, bullet.y, 5, 0, Math.PI * 2);
    ctx.fill();
  });

  requestAnimationFrame(update);
}

update();
