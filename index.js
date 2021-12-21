process.on('uncaughtException', function (e) {
  console.log(e);
  process.send('child-error');
});

process.on('unhandledRejection', function (e) {
  console.log(e);
  process.send('child-error');
});

module.exports = function (_process) {
  const util = require('./util')

  const fs = require('fs')
  const path = require('path')
  const fse = require('fs-extra')

  const args = util.formatArgs(_process.argv)

  let platform = 'local'

  if (args.isLocal === 'true') {
    platform = 'local'
  }

  if (args.isCloud === 'true') {
    platform = 'cloud'
  }

  // add node path (hack)
  process.env.NODE_PATH = path.join(__dirname, '../../../node_modules')
  require('module').Module._initPaths()

  return function (callback) {
    if (/^cloud$/.test(platform)) {
      try {
        callback({
          userFolder: args.userFolder,
          srcFolder: args.srcFolder,
          buildFolder: args.buildFolder,
          currentEnv: args.currentEnv,
          debugPort: args.debugPort,
          serverIp: util.serverIp
        })
      } catch (e) {
        console.log(e);
        _process.send('child-error');
      }

      _process.on('message', function (_msg) {
        if (_msg.name === 'kill-process') {
          _process.exit(2)
        }
      })
    } else if (/^local$/.test(platform)) {
      try {
        callback({
          userFolder: args.userFolder,
          srcFolder: args.srcFolder,
          buildFolder: args.buildFolder,
          currentEnv: args.currentEnv,
          debugPort: args.debugPort,
          serverIp: '127.0.0.1'
        })
      } catch (e) {
        console.log(e);
        _process.send('child-error');
      }
    } else {
      console.log('vbuilder-helper 不支持该平台: ', platform);
    }
  }
}
