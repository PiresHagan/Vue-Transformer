const dirRE = /^v-|^@|^:/
const jscodeshift = require('jscodeshift')
function walk(tree, opts) {
  tree.forEach(function(item,index) {
    if(item.tag) {
      opts.visitTag && opts.visitTag(item)
    }
    if(item.attrs) {
      for(let key in item.attrs) {
        if(dirRE.test(key)) {
          opts.visitExpression && opts.visitExpression(item, key, item.attrs[key], jscodeshift)
        }
      }
    }
    if(item.content) {
      walk(item.content, opts)
    }
  })
}
module.exports = function transform(opts) {
  return function(tree) {
    return walk(tree, opts)
  }
}