const adapt = require('../index');



var transform = {
  transformJs: function(fileInfo, api, options){
    const source = fileInfo.script.content;
    const j = api.jscodeshift;

    fileInfo.script.content = j(source)
      .find(j.Identifier)
      .replaceWith(
        p => j.identifier(p.node.name.split('').reverse().join(''))
      )
      .toSource();
  },
  templateModifier: {
    visitTag: function(item) {
      if(item.tag == 'div') {
        item.tag = 'p'
      }
    },
    visitExpression: function(item, attrName, attrValue, j) {
      // if(attrName == 'v-if') {
        let root = j(attrValue);
        root.find(j.Identifier).filter((path) => {
          return  path.node.name == 'hello'
        }).replaceWith(
          p => j.identifier(p.node.name.split('').reverse().join(''))
        )
        item.attrs[attrName] = root.toSource()
      // }
    }
  }
}
module.exports = adapt(transform);