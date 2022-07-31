#!/usr/bin/env node

const commander = require('commander')
const pkg = require('../package')

const { program } = commander

program
  .name(Object.keys(pkg.bin)[0])
  .usage('<command> [options]')
  .version(pkg.version)
  .option('-d, --debug', '是否开启调试模式', false)
  .option('-e, --envName <envName>', '获取环境变量名称');
  // 

  // command  api 注册命令
  // <> 必须传参
  // [opts] 可选参数
  const clone = program.command('clone <source> [description]')
  clone 
    .description('clone a repository')
    .option('-f, --force', '是否强制克隆')
    .action((source, description, cmdObj) => {
      console.log('source==>', source)
      console.log('description==>', description)
      console.log('cmdObj==>', cmdObj)
    })
  // addCommand  注册子命令 可以对命令进行分组
  
  const service = new commander.Command('service')
  service.description('service operate')

  service
    .command('start [port]')
    .description('start service at some port')
    .action((port) => {
      console.log('start at', port)
    })

  service 
    .command('stop')
    .description('stop service')
    .action(() => {
      console.log('stop')
    })
  program.addCommand(service)


  program
    .command('install [name]', 'install package', {
    //   // executableFile: 'imooc-cli', // 执行别的命令
    //   // isDefault: true, // 默认执行命令
    //   // hidden: true //隐藏命令
    })
    .alias('i')


  // program
  //   .arguments('<cmd> [options]')
  //   .description('test command', {
  //     cmd: 'command to run',
  //     options: 'options for command'
  //   })
  //   .action(function(cmd, options){
  //     console.log(cmd)
  //     console.log(options)
  //   })

  // 高级订制1 自定义help信息
  // program.helpInformation =  function() { return '' }
  // program.on('--help', function() {
  //   // console.log('your help info')
  // })


  // 高级订制2 实现debugger模式
  program.on('option:debug', function() {
    if(program.debug) {
      process.env.LOG_LEVEL = 'verbose';
    }
    console.log('===',process.env.LOG_LEVEL)
  })

  // 高级订制3 未知命令监听
  program.on('command:*', function(obj) {
    console.error('未知命令', obj[0])
    const availableCommands = program.commands.map(cmd => cmd.name())
    console.log('可用命令:',availableCommands.join(','))
  })

  program
    .parse(process.argv)




// const importLocal = require('import-local')
// if(importLocal(__filename)) {
//   require('npmlog').info('cli', '正在使用')
// } else {
//   require('../lib/index')(process.argv.slice(2))
// }
