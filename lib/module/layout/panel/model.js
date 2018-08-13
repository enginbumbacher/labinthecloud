import BaseModel from 'core/model/model';
import Utils from 'core/util/utils';
const defaults = {
  contents: []
};

export default class LayoutPanelModel extends BaseModel {
  constructor(config) {
    config.defaults = Utils.ensureDefaults(config.defaults, defaults);
    if (!config.data.id) config.data.id = Utils.guid4();
    super(config);
  }

  addContent(content, index = null) {
    const contents = this.get('contents');
    if (index === null || index >= contents.length) {
      contents.push(content);
    } else {
      contents.splice(index, 0, content);
    }
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
