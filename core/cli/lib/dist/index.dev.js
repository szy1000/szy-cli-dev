'use strict';

module.exports = core;

var path = require('path');

var semver = require('semver');

var colors = require('colors/safe');

var commander = require('commander');

var pathExists = require('path-exists').sync;

var userHome = require('user-home');

var log = require('@szy-cli-dev/log');

var rootCheck = require('root-check');

var constant = require('./const');

var pkg = require('../package');

var init = require('@szy-cli-dev/init');

var process = require('process');

var console = require('console'); // require 支持 .js .json .node
// js==> modules.exports/exports
// .json ==> JSON.parse
// .node ==> process.dlopen C++ addOn
// .any ==> .js


var args, config;
var program = new commander.Command();

function core() {
  try {
    checkPkgVersion();
    checkNodeVersion();
    checkRoot();
    checkUserHome(); // checkInputArgs()

    checkEnv();
    checkGlobalUpdate();
    registerCommand();
  } catch (e) {
    log.error(e.message);
  }
}

function registerCommand() {
  program.name(Object.keys(pkg.bin)[0]).usage('<command> [options]').version(pkg.version).option('-d --debug', '是否是开发模式', false);
  program.command('init [name]').option('-f, --force', '是否强制初始化项目').action(init); // 开启debug模式

  program.on('option:debug', function () {
    if (program.debug) {
      process.env.LOG_LEVEL = 'verbose';
    } else {
      process.env.LOG_LEVEL = 'info';
    }

    log.level = process.env.LOG_LEVEL;
  }); // 为未知命令的监听

  program.on('command:*', function (obj) {
    console.log(colors.red("\u672A\u77E5\u547D\u4EE4: ".concat([obj[0]])));
    var availableCommands = program.commands.map(function (cmd) {
      return cmd.name();
    });

    if (availableCommands.length) {
      console.log('可用命令:', availableCommands.join(','));
    }
  });

  if (program.args && program.args.length < 1) {// program.outputHelp()
  }

  program.parse(process.argv);
}

function checkGlobalUpdate() {
  var currentVersion, npmName, _require, getNpmSemverVersion, lastVersion;

  return regeneratorRuntime.async(function checkGlobalUpdate$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          // 1、获取当前版本号和模块名
          currentVersion = pkg.version;
          npmName = pkg.name; // 2、调用npm API 获取所有版本号

          _require = require('@szy-cli-dev/get-npm-info'), getNpmSemverVersion = _require.getNpmSemverVersion;
          _context.next = 5;
          return regeneratorRuntime.awrap(getNpmSemverVersion(currentVersion, npmName));

        case 5:
          lastVersion = _context.sent;

          // console.log(lastVersion)
          if (lastVersion && semver.gt(lastVersion, currentVersion)) {
            log.warn(colors.yellow("\u8BF7\u624B\u52A8\u66F4\u65B0 ".concat(npmName, ",\u5F53\u524D\u7248\u672C: ").concat(currentVersion, ", \u6700\u65B0\u7248\u672C: ").concat(lastVersion, " \u66F4\u65B0\u547D\u4EE4: npm install -g ").concat(npmName, "\n    ")));
          } // 3、提取所有版本号进行比对 哪些版本号大于当前版本
          // 4、获取最新版本号 提示用户升级


        case 7:
        case "end":
          return _context.stop();
      }
    }
  });
}

function checkEnv() {
  var dotenv = require('dotenv');

  var dotenvPath = path.resolve(userHome, '.env');

  if (dotenvPath) {
    config = dotenv.config({
      path: dotenvPath
    });
  } // todo
  // log.verbose('环境变量', config)

}

function createDefaultConfig() {
  var cliConfig = {
    home: userHome
  }; // if(pr)
} // function checkInputArgs() {
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
  if (!userHome || !pathExists(userHome)) {
    throw new Error(colors.red('当前登录用户主目录不存在'));
  }
}

function checkRoot() {
  // 获取管理员权限 0 为管理员
  // console.log(process.geteuid())
  rootCheck(); // 核心 process.setuid()
}

function checkNodeVersion() {
  var currentVersion = process.version;
  var lowestVersion = constant.LOWEST_NODE_VERSION;

  if (!semver.gte(currentVersion, lowestVersion)) {
    throw new Error(colors.red("szy-cli \u9700\u8981\u5B89\u88C5 v".concat(lowestVersion, " \u4EE5\u4E0A\u7248\u672C\u7684 nodejs")));
  } else {// throw  new Error(colors.red(`szy-cli 需要安装 v${lowestVersion} 以上版本的 nodejs`))
  }
}

function checkPkgVersion() {
  log.notice('cli', pkg.version);
}