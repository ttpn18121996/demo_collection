const readline = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout,
});

readline.question('App name: ', appName => {
  readline.question('Username: ', name => {
    name = name.replace(/\@[\S]+$/i, '');
    appName = appName.replace(/a/gi, '@').replace(/s/gi, '$');
    const appLen = appName.length.toString().padStart(2, '0');
    const usrnLen = name.length.toString().padStart(2, '0');
    const appNameHashed = appName[0] + appName[1] + appLen + appName[appName.length - 1];
    const usrnHashed = name[0] + name[1] + usrnLen + name[name.length - 1];
    const pin = '6626';
    const repin = '9299';

    console.log('========== Result ==========');
    console.log('hash-12: N%s@m' + pin, appNameHashed);
    console.log('re-hash-12: N%s@m' + repin, appNameHashed);

    if (appName.length % 2 === 0) {
      console.log('hash-14: N@m#%s#' + pin, appNameHashed);
      console.log('re-hash-14: N@m#%s#' + repin, appNameHashed);

      console.log('hash-18: %s%s$%s%s', appNameHashed, usrnHashed, 'N@m', pin);
      console.log('re-hash-18: %s%s$%s%s', appNameHashed, usrnHashed, 'N@m', '9299');
    } else {
      console.log('hash-14: ' + pin + '#%s#N@m', appNameHashed);
      console.log('re-hash-14: ' + repin + '#%s#N@m', appNameHashed);

      console.log('hash-18: %s%s$%s%s', appNameHashed, usrnHashed, pin, 'N@m');
      console.log('re-hash-18: %s%s$%s%s', appNameHashed, usrnHashed, '9299', 'N@m');
    }

    console.log(`PIN: ${pin}`);
    console.log(`Re-PIN: ${repin}`);
    console.log('Re-PIN5: 9599');
    console.log('default: dekbikpassfa123');

    readline.close();
  });
});

// N@m$ $6626
