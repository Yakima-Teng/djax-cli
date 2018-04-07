/**
 * This is the matching library used internally by npm.
 * minimatch("bar.foo", "*.foo") // true!
 * minimatch("bar.foo", "*.bar") // false!
 */
const match = require('minimatch')
const evaluate = require('./eval')

module.exports = (files, filters, data, done) => {
  if (!filters) {
    return done()
  }
  const fileNames = Object.keys(files)
  Object.keys(filters).forEach(glob => {
    fileNames.forEach(file => {
      // Note that by default, a/**/b will not match a/.d/b, unless dot is set.
      if (match(file, glob, { dot: true })) {
        const condition = filters[glob]
        if (!evaluate(condition, data)) {
          delete files[file]
        }
      }
    })
  })
  done()
}
