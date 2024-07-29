'use strict';

function typing(content) {
  let i = 0;
  let rs = '|';
  const codeC = document.getElementById('code-php');
  const interval = setInterval(() => {
    rs = rs.replace(/\|$/, '') + content[i] + '|';
    codeC.innerText = rs;
    i++;
    if (i === content.length) {
      codeC.innerText = codeC.innerText.replace(/\|$/, '');
      clearInterval(interval);

      showContent('Nam said: Hello mother fucker!!!', 'What the fuck are you looking for?');
    }
  }, 50);
}

function showContent(title, content) {
  let target = document.getElementById('title');
  let greeting = title;
  let rs = '|';
  let i = 0;
  let readyToClose = false;
  const interval = setInterval(() => {
    rs = rs.replace(/\|$/, '') + greeting[i] + '|';
    target.innerText = rs;
    i++;
    if (i === greeting.length) {
      target.innerText = target.innerText.replace(/\|$/, '');
      if (readyToClose) {
        clearInterval(interval);
        return;
      }
      rs = '|';
      target = document.getElementById('content');
      greeting = content;
      i = 0;
      readyToClose = true;
    }
  }, 100);
}
