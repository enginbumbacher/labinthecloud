import DomView from 'core/view/dom_view';
import Template from './bodyconfigs.html';
import $ from 'jquery';
import Utils from 'core/util/utils';

import './bodyconfigs.scss';

export default class BodyConfigurationsView extends DomView {
  constructor(model, tmpl) {
    super(tmpl || Template);
    Utils.bindMethods(this, ['_onChange','_render','_addLayer','_setBodyOpacity','_showConfig','_hideConfig'])

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

  _addLayer(imgID, imgPath) {

    var bodyNode = document.createElement('div');
    //bodyNode.style.visibility = "visible";
    bodyNode.id = imgID;
    bodyNode.className = 'multilayerimage__configuration'

    var imgNode = document.createElement('img');
    imgNode.src = imgPath + imgID + '.png';
    bodyNode.appendChild(imgNode);

    this.$el[0].appendChild(bodyNode)
  }

  _setBodyOpacity(opacity) {
    this.$el.find("#bodybckgrnd").css('opacity',opacity);
  }

  _showConfig(configId) {
    this.$el.find("#"+configId).css('visibility','visible');
  }

  _hideConfig(configId) {
    this.$el.find("#"+configId).css('visibility','hidden');
  }

}
