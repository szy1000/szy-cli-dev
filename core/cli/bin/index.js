#! /usr/bin/env node

const importLocal = require('import-local')


// const utils = require('@szy-cli-dev/utils')
// utils()

if(importLocal(__filename)) {
  require('npmlog').info('cli', '正在使用')
} else {
  require('../lib/index')(process.argv.slice(2))
}