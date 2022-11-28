#! /usr/bin/env node

const { program } = require('commander')
const inquirer = require('inquirer')
const download = require('download-git-repo')
const ora = require('ora')
const chalk = require('chalk')

const config = {
  framwork: [
    {
      target: 'express',
      url: 'https://gitee.com/beiyaoyaoyao/express-template.git',
    },
    {
      target: 'koa',
      url: 'https://gitee.com/beiyaoyaoyao/koa-template.git',
    },
    {
      target: 'egg',
      url: 'https://gitee.com/beiyaoyaoyao/egg-template.git',
    },
  ],
}

program
  .option('-d, --debug', 'output extra debugging')
  .option('-s, --small', 'small pizza size')
  .option('-p, --pizza-type <type>', 'flavour of pizza')

program
  .command('create <project> [other...]')
  .alias('crt')
  .description('create a project by cli')
  .action(async (project, args) => {
    const answers = await inquirer.prompt([
      {
        name: 'framwork',
        type: 'list',
        choices: config.framwork.map((item) => item.target),
        message: '请选择项目框架',
      },
    ])
    const spinner = ora('loading...').start()
    spinner.spinner = 'monkey'
    spinner.color = 'magenta'
    const repoUrl = config.framwork.find((item) => item.target === answers.framwork).url
    download(`direct:${repoUrl}`, `./${project}`, { clone: true }, (err) => {
      if (err) {
        spinner.fail('下载错误')
      } else {
        spinner.succeed('下载成功')
        console.log('Done! you run: ')
        console.log(chalk.green(`cd ${project}`))
        console.log(chalk.yellow('npm install'))
        console.log(chalk.cyan('npm run dev'))
      }
    })
  })

program.parse(process.argv)
