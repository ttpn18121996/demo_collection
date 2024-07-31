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
  'Trúng 10 tỷ': 0.000001,
  'Miễn phí chơi gái 1 năm': 0.000002,
  'Miễn phí chơi gái 1 tháng': 0.000007,
  'Miễn phí xài bao cao su 1 năm': 0.00002,
  'Giảm giá 50% mua bao cao su': 0.00007,
  'Giảm giá 10% mua bao cao su': 0.0009,
  'Chúc bạn may mắn lần sau': 0.999,
};

function checkNumberSpins(prize) {
  let count = 1;
  while (true) {
    const randomPrize = spinToWinWithProbability(data);

    if (randomPrize === prize) {
      console.log(`${prize}: ${count}`);
      break;
    }

    count++;
  }
}

function autoSpin(times = 1) {
  for (let i = 0; i < times; i++) {
    const randomPrize = spinToWinWithProbability(data);
    console.log(randomPrize);
  }
}

checkNumberSpins('Chúc bạn may mắn lần sau');
