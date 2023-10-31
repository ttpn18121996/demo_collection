'use strict';

const FakeString = () => {
  const btnGen = document.getElementById('btn_gen');
  btnGen.addEventListener('click', e => {
    const result = document.getElementById('result');
    const txtAppName = document.getElementById('app_name').value;
    const txtUsername = document.getElementById('username').value;
    const appName = txtAppName.replace(/a/gi, '@').replace(/s/gi, '$');
    const name = txtUsername.replace(/\@[\S]+$/i, '');
    const appLen = appName.length.toString().padStart(2, '0');
    const usrnLen = name.length.toString().padStart(2, '0');
    const appNameHashed = appName[0] + appName[1] + appLen + appName[appName.length - 1];
    const usrnHashed = name[0] + name[1] + usrnLen + name[name.length - 1];
    const pin = '6626';
    const repin = '9299';
    result.append('hash-12: N%s@m' + pin, appNameHashed, document.createElement('br'));
    result.append('re-hash-12: N%s@m' + repin, appNameHashed, document.createElement('br'));

    if (appName.length % 2 === 0) {
      result.append(`hash-14: N@m#${appNameHashed}#` + pin, document.createElement('br'));
      result.append(`re-hash-14: N@m#${appNameHashed}#` + repin, document.createElement('br'));

      result.append(`hash-18: ${appNameHashed}${usrnHashed}$N@m${pin}`, document.createElement('br'));
      result.append(`re-hash-18: ${appNameHashed}${usrnHashed}$N@m$9299`, document.createElement('br'));
    } else {
      result.append(`hash-14: ${pin}#${appNameHashed}#N@m`, document.createElement('br'));
      result.append(`re-hash-14: ${repin}#${appNameHashed}#N@m`, document.createElement('br'));

      result.append(`hash-18: ${appNameHashed}${usrnHashed}$${pin}N@m`, document.createElement('br'));
      result.append(`re-hash-18: ${appNameHashed}${usrnHashed}$9299N@m`, document.createElement('br'));
    }
  });
};
FakeString();
