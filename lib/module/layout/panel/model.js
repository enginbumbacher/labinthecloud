define((require) => {
  const BaseModel = require('core/model/model'),
    Utils = require('core/util/utils'),
    defaults = {
      contents: []
    };

  return class LayoutPanelModel extends BaseModel {
    constructor(config) {
      config.defaults = Utils.ensureDefaults(config.defaults, defaults);
      if (!config.data.id) config.data.id = Utils.guid4();
      super(config);
    }

    addContent(content) {
      const contents = this.get('contents');
      contents.push(content);
      this.set('contents', contents);
    }

    removeContent(content) {
      const contents = this.get('contents');
      if (contents.includes(content)) {
        contents.splice(contents.indexOf(content), 1);
        this.set('contents', contents);
      }
    }
  }
})