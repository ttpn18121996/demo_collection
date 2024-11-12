const fs = require('node:fs');
const path = require('node:path');

const LOG_LEVEL = {};
(function (LOG_LEVEL) {
  LOG_LEVEL[(LOG_LEVEL['EMERGENCY'] = 0)] = 'EMERGENCY';
  LOG_LEVEL[(LOG_LEVEL['ALERT'] = 1)] = 'ALERT';
  LOG_LEVEL[(LOG_LEVEL['CRITICAL'] = 2)] = 'CRITICAL';
  LOG_LEVEL[(LOG_LEVEL['ERROR'] = 3)] = 'ERROR';
  LOG_LEVEL[(LOG_LEVEL['WARNING'] = 4)] = 'WARNING';
  LOG_LEVEL[(LOG_LEVEL['NOTICE'] = 5)] = 'NOTICE';
  LOG_LEVEL[(LOG_LEVEL['INFO'] = 6)] = 'INFO';
  LOG_LEVEL[(LOG_LEVEL['DEBUG'] = 7)] = 'DEBUG';
})(LOG_LEVEL);

class Logger {
  static instance;

  constructor(driver = 'single') {
    this.driver = driver;
  }

  static getInstance(driver = 'single') {
    if (!Logger.instance) {
      Logger.instance = new Logger(driver);
    }

    return Logger.instance;
  }

  emergency(message, context = {}) {
    this.log(LOG_LEVEL.EMERGENCY, message, context);
  }

  alert(message, context = {}) {
    this.log(LOG_LEVEL.ALERT, message, context);
  }

  critical(message, context = {}) {
    this.log(LOG_LEVEL.CRITICAL, message, context);
  }

  error(message, context = {}) {
    this.log(LOG_LEVEL.ERROR, message, context);
  }

  warning(message, context = {}) {
    this.log(LOG_LEVEL.WARNING, message, context);
  }

  notice(message, context = {}) {
    this.log(LOG_LEVEL.NOTICE, message, context);
  }

  info(message, context = {}) {
    this.log(LOG_LEVEL.INFO, message, context);
  }

  debug(message, context = {}) {
    this.log(LOG_LEVEL.DEBUG, message, context);
  }

  log(level, message, context = {}) {
    const now = this.nowFormat();
    let result = `[${now}] `;
    const replace = {};

    if (Object.keys(context).length) {
      const matches = message.match(/\{[a-zA-Z0-9_\-]+\}/g)?.map(m => m.replace(/^\{/, '').replace(/\}$/, ''));

      if (matches) {
        for (const match of matches) {
          const regex = RegExp('{' + match + '}');
          const param = context?.[match];
          if (!param) continue;

          message = message.replace(regex, context?.[match] ?? '');
        }
      }
    }

    switch (level) {
      case LOG_LEVEL.EMERGENCY:
        result += `\x1b[41m[${LOG_LEVEL[level]}]\x1b[0m ${message}`;
        break;
      case LOG_LEVEL.ALERT:
        result += `\x1b[43m[${LOG_LEVEL[level]}]\x1b[0m ${message}`;
        break;
      case LOG_LEVEL.CRITICAL:
        result += `\x1b[31m[${LOG_LEVEL[level]}]\x1b[37m ${message}`;
        break;
      case LOG_LEVEL.ERROR:
        result += `\x1b[31m[${LOG_LEVEL[level]}]\x1b[37m ${message}`;
        break;
      case LOG_LEVEL.WARNING:
        result += `\x1b[33m[${LOG_LEVEL[level]}]\x1b[37m ${message}`;
        break;
      case LOG_LEVEL.NOTICE:
        result += `\x1b[35m[${LOG_LEVEL[level]}]\x1b[37m ${message}`;
        break;
      case LOG_LEVEL.INFO:
        result += `\x1b[32m[${LOG_LEVEL[level]}]\x1b[37m ${message}`;
        break;
      case LOG_LEVEL.DEBUG:
        result += `\x1b[34m[${LOG_LEVEL[level]}]\x1b[37m ${message}`;
        break;
    }
    console.log(result);

    this.appendFile(`[${now}] [${LOG_LEVEL[level]}] ${message}`);
  }

  nowFormat() {
    const now = new Date();
    const timeFormat = this.timeFormat(now);

    if (this.driver == 'daily') {
      return timeFormat;
    }

    const dateFormat = this.dateFormat(now);

    return `${dateFormat} ${timeFormat}`;
  }

  dateFormat(date) {
    const year = date.getFullYear();
    let month = date.getMonth();
    let day = date.getDate();

    month = `0${month + 1}`.slice(-2);
    day = `0${day}`.slice(-2);

    return `${year}-${month}-${day}`;
  }

  timeFormat(date) {
    let hours = date.getHours();
    let minutes = date.getMinutes();
    let seconds = date.getSeconds();

    hours = `0${hours}`.slice(-2);
    minutes = `0${minutes}`.slice(-2);
    seconds = `0${seconds}`.slice(-2);

    return `${hours}:${minutes}:${seconds}`;
  }

  appendFile(content) {
    let fileName = 'single_log.log';

    if (this.driver == 'daily') {
      fileName = this.dateFormat(new Date()) + '.log';
    }

    const filePath = path.join(__dirname, '../storage/logs/', fileName);
    fs.appendFile(filePath, content + "\n", err => {
      if (err) console.log(err.message);
    })
  }
}

Logger.getInstance().emergency('Hello, {name}', { name: 'Trinh Tran Phuong Nam' });
Logger.getInstance().alert('Hello, alert');
Logger.getInstance().critical('Hello, critical');
Logger.getInstance().error('Hello, error');
Logger.getInstance().warning('Hello, warning');
Logger.getInstance().notice('Hello, notice');
Logger.getInstance().info('Hello, info');
Logger.getInstance().debug('Hello, debug');
