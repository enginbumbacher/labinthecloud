define((require) => {
  const DomView = require('core/view/dom_view'),
    Template = require('text!./bodyconfigs.html'),
    $ = require('jquery'),
    Utils = require('core/util/utils');

  require('link!./bodyconfigs.css')

  return class BodyConfigurationsView extends DomView {
    constructor(model, tmpl) {
      super(tmpl || Template);
      Utils.bindMethods(this, ['_onChange','_render','_addLayer','_setBodyOpacity'])

      //this._render(model);
      //this.addChild(model.get('contents'), ".component__multilayerimage");

      model.addEventListener('Model.Change', this._onChange);
    }

    _onChange(evt) {
      this._render(evt.currentTarget);
    }

    _render(model) {
      //this.$el.toggleClass("dragitem__selected", );
      console.log('move render code to here')

    }

    _addLayer(params, imgPath) {
      var bodyNode = document.createElement('div');
      //bodyNode.style.visibility = "visible";
      bodyNode.id = params.id;
      bodyNode.className = 'multilayerimage__configuration'

      var imgNode = document.createElement('img');
      imgNode.src = imgPath + params.id + '.png';
      bodyNode.appendChild(imgNode);

      this.$el[0].appendChild(bodyNode)
    }

    _setBodyOpacity(opacity) {
      this.$el.find("#bodybckgrnd").css('opacity',opacity);
    }

    _showBodyConfig(configId) {
      this.$el.find("#"+configId).css('visibility','visible');
    }

    _hideBodyConfig(configId) {
      this.$el.find("#"+configId).css('visibility','hidden');
    }
  }
});
