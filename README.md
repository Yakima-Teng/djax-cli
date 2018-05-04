# djax-cli

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

> A simple CLI for scaffolding Djax projects.

### Installation

Prerequisites: [Node.js](https://nodejs.org/en/) (>=6.x, 8.x preferred), npm version 3+ and [Git](https://git-scm.com/).

``` bash
$ npm install -g djax-cli
```

### Usage

``` bash
$ djax init <template-name> <project-name>
```

Example:

``` bash
$ djax init default my-project
# the above command is the same as the one below:
$ djax init djax my-project
```

The above command pulls the template from [Yakima-Teng/djax](https://github.com/Yakima-Teng/djax), prompts for some information, and generates the project at `./my-project/`.

### Official Templates

The purpose of official djax project templates are to provide opinionated, battery-included development tooling setups so that users can get started with actual app code as fast as possible. However, these templates are un-opinionated in terms of how you structure your app code and what libraries you use.

All official project templates are repos whose name is started with letters 'djax' (except for djax-cli) in the [Yakima-Teng (github repository)](https://github.com/Yakima-Teng). When a new official template is added, you will be able to run `djax init <template-name> <project-name>` to use that template. You can run `djax list` to see all available official templates.

Current available templates include:

- [djax](https://github.com/Yakima-Teng/djax) - A full-featured gulp setup with refresh-on-change, lint-on-save, http proxy, and etc.

### Custom Templates

It's unlikely to make everyone happy with the official templates. You can simply fork an official template and then use it via `djax-cli` with:

``` bash
djax init username/repo my-project
```

Where `username/repo` is the GitHub repo shorthand for your fork.

The shorthand repo notation is passed to [download-git-repo](https://github.com/flipxfx/download-git-repo) so you can also use things like `bitbucket:username/repo` for a Bitbucket repo and `username/repo#branch` for tags or branches.

If you would like to download from a private repository use the `--clone` flag and the cli will use `git clone` so your SSH keys are used.

### Local Templates

Instead of a GitHub repo, you can also use a template on your local file system:

``` bash
djax init ~/fs/path/to-custom-template my-project
```

### Writing Custom Templates from Scratch

- A template repo **must** have a `template` directory that holds the template files.

- A template repo **may** have a metadata file for the template which can be either a `meta.js` or `meta.json` file. It can contain the following fields:

  - `prompts`: used to collect user options data;

  - `filters`: used to conditional filter files to render.
  
  - `metalsmith`: used to add custom metalsmith plugins in the chain.

  - `completeMessage`: the message to be displayed to the user when the template has been generated. You can include custom instruction here.

  - `complete`: Instead of using `completeMessage`, you can use a function to run stuffs when the template has been generated.

#### prompts

The `prompts` field in the metadata file should be an object hash containing prompts for the user. For each entry, the key is the variable name and the value is an [Inquirer.js question object](https://github.com/SBoudrias/Inquirer.js/#question). Example:

``` json
{
  "prompts": {
    "name": {
      "type": "string",
      "required": true,
      "message": "Project name"
    }
  }
}
```

After all prompts are finished, all files inside `template` will be rendered using [Handlebars](http://handlebarsjs.com/), with the prompt results as the data.

##### Conditional Prompts

A prompt can be made conditional by adding a `when` field, which should be a JavaScript expression evaluated with data collected from previous prompts. For example:

``` json
{
  "prompts": {
    "lint": {
      "type": "confirm",
      "message": "Use a linter?"
    },
    "lintConfig": {
      "when": "lint",
      "type": "list",
      "message": "Pick a lint config",
      "choices": [
        "standard",
        "airbnb",
        "none"
      ]
    }
  }
}
```

The prompt for `lintConfig` will only be triggered when the user answered yes to the `lint` prompt.

##### Pre-registered Handlebars Helpers

Two commonly used Handlebars helpers, `if_eq` and `unless_eq` are pre-registered:

``` handlebars
{{#if_eq lintConfig "airbnb"}};{{/if_eq}}
```

##### Custom Handlebars Helpers

You may want to register additional Handlebars helpers using the `helpers` property in the metadata file. The object key is the helper name:

``` js
module.exports = {
  helpers: {
    lowercase: str => str.toLowerCase()
  }
}
```

Upon registration, they can be used as follows:

``` handlebars
{{ lowercase name }}
```

#### File filters

The `filters` field in the metadata file should be an object hash containing file filtering rules. For each entry, the key is a [minimatch glob pattern](https://github.com/isaacs/minimatch) and the value is a JavaScript expression evaluated in the context of prompt answers data. Example:

``` json
{
  "filters": {
    "test/**/*": "needTests"
  }
}
```

Files under `test` will only be generated if the user answered yes to the prompt for `needTests`.

Note that the `dot` option for minimatch is set to `true` so glob patterns would also match dotfiles by default.

#### Skip rendering

The `skipInterpolation` field in the metadata file should be a [minimatch glob pattern](https://github.com/isaacs/minimatch). The files matched should skip rendering. Example:

``` json
{
  "skipInterpolation": "src/**/*.temp"
}
```

#### Metalsmith

`djax-cli` uses [metalsmith](https://github.com/segmentio/metalsmith) to generate the project.

You may customize the metalsmith builder created by djax-cli to register custom plugins.

```js
{
  "metalsmith": function (metalsmith, opts, helpers) {
    function customMetalsmithPlugin (files, metalsmith, done) {
      // Implement something really custom here.
      done(null, files)
    }
    
    metalsmith.use(customMetalsmithPlugin)
  }
}
```

If you need to hook metalsmith before questions are asked, you may use an object with `before` key.

```js
{
  "metalsmith": {
    before: function (metalsmith, opts, helpers) {},
    after: function (metalsmith, opts, helpers) {}
  }
}
```

#### Additional data available in meta.{js,json}

- `destDirName` - destination directory name

```json
{
  "completeMessage": "To get started:\n\n  cd {{destDirName}}\n  npm install\n  npm run dev"
}
```

- `inPlace` - generating template into current directory

```json
{
  "completeMessage": "{{#inPlace}}To get started:\n\n  npm install\n  npm run dev.{{else}}To get started:\n\n  cd {{destDirName}}\n  npm install\n  npm run dev.{{/inPlace}}"
}
```

### `complete` function

Arguments:

- `data`: the same data you can access in `completeMessage`:
  ```js
  {
    complete (data) {
      if (!data.inPlace) {
        console.log(`cd ${data.destDirName}`)
      }
    }
  }
  ```

- `helpers`: some helpers you can use to log results.
  - `chalk`: the `chalk` module
  - `logger`: [the built-in djax-cli logger](/lib/logger.js)
  - `files`: An array of generated files
  ```js
  {
    complete (data, {logger, chalk}) {
      if (!data.inPlace) {
        logger.log(`cd ${chalk.yellow(data.destDirName)}`)
      }
    }
  }
  ```

### Installing a specific template version

`djax-cli` uses the tool [`download-git-repo`](https://github.com/flipxfx/download-git-repo) to download the official templates used. The `download-git-repo` tool allows you to indicate a specific branch for a given repository by providing the desired branch name after a pound sign (`#`).

The format needed for a specific official template is:

```
djax init '<template-name>#<branch-name>' <project-name>
```

Example:

Installing the [`dev` branch](https://github.com/Yakima-Teng/djax/tree/dev) of the djax template:

```
djax init 'djax#dev' mynewproject
```

_Note_: The surrounding quotes are necessary on zsh shells because of the special meaning of the `#` character.

### Thanks

This project is based on the project [vue-cli (version 2+)](https://github.com/vuejs/vue-cli).

### License

[MIT](http://opensource.org/licenses/MIT)
