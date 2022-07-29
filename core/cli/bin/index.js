#!/usr/bin/env node

const commander = require('commander')
const pkg = require('../package')

const { program } = commander

program
  .name(Object.keys(pkg.bin)[0])
  .usage('<command> [options]')
  .version(pkg.version)
  .option('-d, --debug', '是否开启调试模式', false)
  .option('-e, --envName <envName>', '获取环境变量名称')
  // 

  // command  api 注册命令
  // <> 必须传参
  // [] 可选参数
  const clone = program.command('clone <source> [description]')
  clone 
    .description('clone a repository')
    .option('-f, --force', '是否强制克隆')
    .action((source, description, cmdObj) => {
      console.log('source==>', source)
      console.log('description==>', description)
      console.log('cmdObj==>', cmdObj)
    })
  // addCommand  注册子命令


  program
    .parse(process.argv)
// const importLocal = require('import-local')
//
//
// if(importLocal(__filename)) {
//   require('npmlog').info('cli', '正在使用')
// } else {
//   require('../lib/index')(process.argv.slice(2))
// }
