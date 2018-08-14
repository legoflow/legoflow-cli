'use strict'

const chalk = require('chalk')
const ora = require('ora')
const prompt = require('inquirer').prompt
const legoflowProject = require('legoflow-project')
const getConfig = require('./local_config').get

const { version: cVersion } = require('../package.json')

module.exports = async function () {
  let projectTypes = { }

  let spinner = void 0

  if (getConfig('loadNPMLegoFlowTemplate')) {
    spinner = ora('正在获取 LegoFlow NPM 模板').start()
  }

  projectTypes = await legoflowProject.getProjectType()

  spinner && spinner.stop()

  const types = Object.keys(projectTypes)

  const toSpace = (str) => {
    return str + (Array(str.length < 8 ? 8 - str.length + 1 || 0 : 0).join(' '))
  }

  types.forEach((item, index) => {
    switch (item) {
      case 'Vue.js': {
        types[ index ] = {
          name: `${chalk.bold(toSpace(item))}${chalk.whiteBright('- Vue.js 项目基础模板')}`,
          value: item
        }
        break
      }
      case 'Vue.ts': {
        types[ index ] = {
          name: `${chalk.bold(toSpace(item))}${chalk.whiteBright('- Vue.js 项目 TypeScript 模板')}`,
          value: item
        }
        break
      }
      case 'PC': {
        types[ index ] = {
          name: `${chalk.bold(toSpace(item))}${chalk.whiteBright('- PC 端项目模板')}`,
          value: item
        }
        break
      }
      case 'Mobile': {
        types[ index ] = {
          name: `${chalk.bold(toSpace(item))}${chalk.whiteBright('- 移动端项目模板')}`,
          value: item
        }
        break
      }
    }
  })

  let questions = [
    {
      type: 'input',
      name: 'name',
      message: '项目名称',
      default: '',
      validate (input) {
        const done = this.async()

        !input ? done('项目名称不能为空') : done(null, true)
      }
    },
    {
      type: 'list',
      name: 'type',
      message: '项目类型',
      choices: types,
      default: 0
    },
    {
      type: 'input',
      name: 'version',
      message: '版本号',
      default: '0.0.1'
    },
    {
      type: 'input',
      name: 'description',
      message: '项目描述',
      default: ''
    },
    {
      type: 'list',
      name: 'isSourcePath',
      message: '是否作为源路径',
      choices: [ { name: 'no', value: false }, { name: 'yes', value: true } ],
      default: 0
    }
  ]

  const { name, type, version, description, isSourcePath } = await prompt(questions)

  const isESNext = true

  const options = {
    path: process.cwd(),
    name,
    type,
    version,
    isESNext,
    isSourcePath,
    author: getConfig('user'),
    c_version: `cli@${cVersion}`,
    description,
    typeSourcePath: projectTypes[ type ],
    from: 'cli'
  }

  const result = await legoflowProject.new(options)

  result && result.newProjectSuccessMessage && console.log(result.newProjectSuccessMessage)

  typeof result !== 'string' ? global.print.success('新建成功') : global.print.error(result)
}
