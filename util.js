var path = require('path')
var fs = require('fs')

var _undefined = void 0

var localIp = getLocalIp()

function getLocalIp () {
  var os = require('os')
  var ifaces = os.networkInterfaces()
  var ipRst = null

  for (var dev in ifaces) {
    var alias = 0
    ifaces[dev].forEach(function (details) {
      if (
        details.family == 'IPv4' &&
        !/^127.0.\d+.\d+$/g.test(details.address)
      ) {
        ipRst = details.address
        ++alias
      }
    })
  }

  return ipRst
}

module.exports = {
  serverIp: localIp,

  formatArgs: function (argv) {
    var obj = {}

    var arr = []
    var argvLength = argv.length

    for (var i = argvLength - 1; i >= 0; i--) {
      if (argv[i].indexOf('=') === -1) {
        break
      } else {
        arr.push(argv[i])
      }
    }

    for ((i = 0), (len = arr.length); i < len; i++) {
      var subArr = arr[i].split('=')

      if (subArr[1] !== _undefined && subArr[1] !== 'undefined') {
        obj[subArr[0]] = subArr[1]
      }
    }

    return obj
  }
}
