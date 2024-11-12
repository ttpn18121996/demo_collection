'use strict';

const FakeString = () => {
  const btnGen = document.getElementById('btn_gen');
  btnGen.addEventListener('click', e => {
    const result = document.getElementById('result');
    const txtAppName = document.getElementById('app_name').value;
    const txtUsername = document.getElementById('username').value;
    const txtKey = document.getElementById('key').value;

    if (
      txtAppName === ''
      || txtUsername === ''
      || txtKey === ''
    ) {
      return;
    }

    result.innerHTML = '';

    const appName = txtAppName.replace(/a/gi, '@').replace(/s/gi, '$');
    const name = txtUsername.replace(/\@[\S]+$/i, '');
    const appLen = appName.length.toString().padStart(2, '0');
    const usrnLen = name.length.toString().padStart(2, '0');
    const appNameHashed = appName[0] + appName[1] + appLen + appName[appName.length - 1];
    const usrnHashed = name[0] + name[1] + usrnLen + name[name.length - 1];

    result.append(`hash-12: N${appNameHashed}@m` + txtKey, document.createElement('br'));

    if (appName.length % 2 === 0) {
      result.append(`hash-14: N@m#${appNameHashed}#` + txtKey, document.createElement('br'));
      result.append(`hash-18: ${appNameHashed}${usrnHashed}$N@m${txtKey}`, document.createElement('br'));
    } else {
      result.append(`hash-14: ${txtKey}#${appNameHashed}#N@m`, document.createElement('br'));
      result.append(`hash-18: ${appNameHashed}${usrnHashed}$${txtKey}N@m`, document.createElement('br'));
    }
  });
};
FakeString();
