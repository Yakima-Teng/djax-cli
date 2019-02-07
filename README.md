# djax-cli，一个简单的模板项目生成器

***说明：开发中，请勿使用。***

<p align="center">
  <a href="https://npmcharts.com/compare/djax-cli?minimal=true">
    <img src="https://img.shields.io/npm/dm/djax-cli.svg" alt="Downloads">
  </a>
  <a href="https://www.npmjs.com/package/djax-cli">
    <img src="https://img.shields.io/npm/v/djax-cli.svg" alt="Version">
  </a>
  <a href="https://www.npmjs.com/package/djax-cli">
    <img src="https://img.shields.io/npm/l/djax-cli.svg" alt="License">
  </a>
</p>

> 一个简单的模板项目生成器。

## 安装

需要环境：[Node.js](https://nodejs.org/en/)（>=6.x）、npm 3+、[Git](https://git-scm.com/)。

`djax-cli`为命令行工具，为方便使用，需要全局安装，全局安装完毕后就可以直接在终端中使用`djax`命令了。

``` bash
npm install -g djax-cli
```

## 使用

### 创建本地项目

``` bash
# 需将<template-name>替换为模板名，将<project-name>替换为实际项目名
djax init <template-name> <project-name>
```

举例：

如果需要使用`resume`模板，假定你要创建的项目名为`my-project`，运行下面的命令即可根据`resume`模板在当前目录下创建一个名为`my-project`的目录/项目。

``` bash
djax init resume my-project
```

### 查看官方支持的模板列表

``` bash
djax list
```

目前支持的模板列表：

- resume: 简单移动端H5活动页开发模板，支持SEO，技术栈：gulp + ejs + ES6 + SASS + 附带常用第三方js库。
- quilt：简单PC多页应用开发模板，支持SEO，技术栈：gulp + pug + ES6 + SASS + gitbook文档编写。
- yxeye：复杂多页应用开发模板，支持SEO，webpack + ES6 + SASS。
- lookjavascript：gitbook文档项目模板。
- utils-daily：公共JS函数库项目模板。

### 查看当前djax-cli命令行工具的版本

``` bash
djax --version
```

## 致谢

[vue-cli (2+版本)](https://github.com/vuejs/vue-cli)

## License

[MIT](http://opensource.org/licenses/MIT)
