'use strict';

module.exports = core
const path = require('path')
const semver = require('semver')
const colors = require('colors/safe')
const commander = require('commander')
const pathExists = require('path-exists').sync
const userHome = require('user-home')
const log = require('@szy-cli-dev/log')
const rootCheck = require('root-check')
const constant = require('./const')
const pkg = require('../package');
const init = require('@szy-cli-dev/init')
const process = require('process');
const console = require('console');
// require 支持 .js .json .node
// js==> modules.exports/exports
// .json ==> JSON.parse
// .node ==> process.dlopen C++ addOn
// .any ==> .js

let args, config;
const program = new commander.Command()

function core() {
  try {
    checkPkgVersion()
    checkNodeVersion()
    checkRoot()
    checkUserHome()
    // checkInputArgs()
    checkEnv()
    checkGlobalUpdate()
    registerCommand()
  } catch (e) {
    log.error(e.message)
  }
}

function registerCommand() {
  program
    .name(Object.keys(pkg.bin)[0])
    .usage('<command> [options]')
    .version(pkg.version)
    .option('-d --debug', '是否是开发模式', false)
  
  program
    .command('init [name]')
    .option('-f, --force', '是否强制初始化项目')
    .action(init)

  // 开启debug模式
  program.on('option:debug', function() {
    if(program.debug) {
      process.env.LOG_LEVEL = 'verbose'
    } else {
      process.env.LOG_LEVEL = 'info'
    }
    log.level = process.env.LOG_LEVEL
  })

  // 为未知命令的监听
  program.on('command:*', function(obj) {
    console.log(colors.red(`未知命令: ${[obj[0]]}`))
    const availableCommands = program.commands.map(cmd => cmd.name())
    if(availableCommands.length) {
      console.log('可用命令:',availableCommands.join(','))
    }
  })

  if(program.args && program.args.length < 1) {
    // program.outputHelp()
  }

  program.parse(process.argv)
}

async function checkGlobalUpdate() {
  // 1、获取当前版本号和模块名
  const currentVersion = pkg.version;
  const npmName = pkg.name;
  // 2、调用npm API 获取所有版本号
  const {getNpmSemverVersion} = require('@szy-cli-dev/get-npm-info')
  const lastVersion = await getNpmSemverVersion(currentVersion, npmName)
  // console.log(lastVersion)
  if(lastVersion && semver.gt(lastVersion,currentVersion)) {
    log.warn(colors.yellow(`请手动更新 ${npmName},当前版本: ${currentVersion}, 最新版本: ${lastVersion} 更新命令: npm install -g ${npmName}
    `))
  }

  // 3、提取所有版本号进行比对 哪些版本号大于当前版本
  // 4、获取最新版本号 提示用户升级

}


function checkEnv() {
  const dotenv = require('dotenv')
  const dotenvPath = path.resolve(userHome, '.env')
  if(dotenvPath) {
    config = dotenv.config({
      path: dotenvPath
    })
  }
  // todo
  // log.verbose('环境变量', config)
}

function createDefaultConfig() {
  const cliConfig = {
    home: userHome
  }
  // if(pr)
}

// function checkInputArgs() {
  // const minimist = require('minimist')
  // args = minimist(process.argv.slice(2))
  // checkArgs()
// }


// function checkArgs() {
//   if(args.debug) {
//     process.env.LOG_LEVEL = 'verbose'
//   }
//   log.level = process.env.LOG_LEVEL
// }

function checkUserHome() {
  if(!userHome || !pathExists(userHome)) {
    throw new Error(colors.red('当前登录用户主目录不存在'))
  }
}

function checkRoot() {
  // 获取管理员权限 0 为管理员
  // console.log(process.geteuid())
  rootCheck() // 核心 process.setuid()

}

function checkNodeVersion() {
  const currentVersion = process.version
  const lowestVersion = constant.LOWEST_NODE_VERSION
  if(!semver.gte(currentVersion,lowestVersion)) {
    throw  new Error(colors.red(`szy-cli 需要安装 v${lowestVersion} 以上版本的 nodejs`))
  } else {
    // throw  new Error(colors.red(`szy-cli 需要安装 v${lowestVersion} 以上版本的 nodejs`))
  }

}

function checkPkgVersion() {
  log.notice('cli', pkg.version)
}
