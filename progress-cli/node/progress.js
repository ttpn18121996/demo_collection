const ProgressBar = require('./ProgressBar');

function sleep(timeout) {
  return new Promise(resolve => setTimeout(resolve, timeout));
}

async function run() {
  const progress = new ProgressBar(100, 100);

  for (let i = 1; i <= progress.getTotal(); i++) {
    progress.showProgress(i);
    await sleep(100);
  }
}

run();
