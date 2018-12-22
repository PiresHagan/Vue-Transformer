/*!
 * Original code by Paul Salaets
 * https://github.com/psalaets/vue-jscodeshift-adapter/blob/master/src/parse-sfc.js
 */
const descriptorToString = require('vue-sfc-descriptor-to-string');
const parseSfc = require('./parse-sfc');
const PostHTML = require('posthtml');
const posthtmlVueTemplate = require('./posthtml-vue-template')
module.exports = adapt;

function adapt(transform, settings) {
  return function newTransform(fileInfo, api, options) {
    if (!fileInfo.path.endsWith('.vue')) {
      throw new Error(`vueOnly mode can only process vue files but received: ${fileInfo.path}`);
    }

    const vueFileInfo = {
      path: fileInfo.path
    };

    const sfcDescriptor = parseSfc(fileInfo.source);

    const templateBlock = sfcDescriptor.template;
    if (templateBlock) {
      const template = templateBlock.content;
      vueFileInfo.template = createOutputBlock('template', template);
    }

    const scriptBlock = sfcDescriptor.script;
    if (scriptBlock) {
      const script = scriptBlock.content;
      vueFileInfo.script = createOutputBlock('script', script);
    }

    const styleBlock = sfcDescriptor.styles[0];
    if (styleBlock) {
      const style = styleBlock.content;
      vueFileInfo.style = createOutputBlock('style', style);
    }
    console.log(transform)

    transform.transformJs(vueFileInfo, api, options);
    if(transform.templateModifier) {
      vueFileInfo.template.content = new PostHTML().use(
        posthtmlVueTemplate(
          transform.templateModifier
        )
      ).process(vueFileInfo.template.content, {sync: true}).html
    }

    const hasChanges = [
      vueFileInfo.script,
      vueFileInfo.template,
      vueFileInfo.style
    ]
      .filter(block => !!block)
      .some(block => block.contentChanged);

    if (hasChanges) {
      if(vueFileInfo.template) {
        templateBlock.content = vueFileInfo.template.content;
      }
      if(vueFileInfo.script) {
        scriptBlock.content = vueFileInfo.script.content;
      }
      if(vueFileInfo.style) {
        styleBlock.content = vueFileInfo.style.content;
      }

      return descriptorToString(sfcDescriptor, {
        indents: {
          template: 0
        }
      });
    } else {
      return undefined;
    }
  };
}

function createOutputBlock(type, content) {
  let _contentChanged = false;
  let _content = content;

  return {
    type,
    get contentChanged() {
      return _contentChanged;
    },
    get content() {
      return _content;
    },
    set content(c) {
      _contentChanged = true;
      _content = c;
    }
  };
}