function spinToWinWithProbability(data) {
  const prizes = Object.keys(data);
  const probabilities = Object.values(data);
  const totalWeight = probabilities.reduce((acc, prob) => acc + prob, 0);
  let randomNum = Math.random() * totalWeight;

  let i = 0;
  while (randomNum >= 0) {
    randomNum -= probabilities[i];
    i++;
  }

  return prizes[i - 1];
}

// Tổng xác suất phải bằng 1 (0.3 + 0.5 + 0.2 = 1);
const data = {
  'Món quà A': 0.01,
  'Giảm giá 10%': 0.06,
  'Mã giảm giá XYZ': 0.03,
  'Chúc bạn may mắn lần sau': 0.6,
  'An ủi': 0.3,
};

for (let i = 0; i < 20; i++) {
  const randomPrize = spinToWinWithProbability(data);
  console.log(randomPrize);
}
