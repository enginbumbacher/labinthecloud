import $ from 'jquery';
import Utils from 'core/util/utils';
import Globals from 'core/model/globals';
import HM from 'core/event/hook_manager';
import DomView from 'core/view/dom_view';
import Template from './tab.html';
import './style.scss';

export default class ModelingTabView extends DomView {
  constructor(model, tmpl) {
    super(tmpl || Template);
    Utils.bindMethods(this, [
      '_onTabClick', '_onModelChange','_onTransitionEnd','_addLayer', '_showImg', '_hideImg'])

    model.addEventListener('Model.Change', this._onModelChange)

    if (!(Globals.get('AppConfig.system.expModelModality').match('justbody'))) {
      this.$el.find('.modeling__tab').on('click',this._onTabClick);
    } else {
      this.$el.find('.modeling__tab').css('display','none')
      this.$el.find('.modeling').css('visibility','hidden')
    }
    this.$el[0].addEventListener('transitionend', this._onTransitionEnd)
    this.disableFields();

    if (Globals.get('AppConfig.modeling.explanationOn')) {
        var acc = this.$el.find(".modeling__interface__accordion").on("click", this._onButtonClick);
    } else {
        var acc = this.$el.find(".modeling__interface__accordion").css('display','none');
    }
  }

  _onButtonClick() {
 		 /* Toggle between adding and removing the "active" class,
			to highlight the button that controls the panel */
      this.classList.toggle("active");

			/* Toggle between hiding and showing the active panel */
      var panel = $(this).parent().find(".modeling__interface__panel");
			if (panel.css('display')=== "block") {
				panel.css('display','none');
			} else {
				panel.css('display','block');
			}
  }

  _onTransitionEnd(evt) {
    Globals.get('Relay').dispatchEvent('ModelingTab.TransitionEnd', {type: 'model'}, true);
  }

  disable() {
    this.$el.find('.modeling__tab').off('click');
  }

  enable() {
    if (!(Globals.get('AppConfig.system.expModelModality')==='justbody')) {
      this.$el.find('.modeling__tab').on('click',this._onTabClick);
    }
  }

  _onModelChange(evt) {
    if (evt.data.path == "open") {
      this.$el.toggleClass('modeling__open', evt.data.value)
      this.updateFieldStatus(evt.currentTarget);
    }
 }

  updateFieldStatus(model) {
    if (model.get('open')) {
      this.enableFields();
    } else {
      this.disableFields();
    }
  }

  enableFields() {
    //this._graphSelect.enable();
    this.$el.find('input, button').removeProp('disabled');
    this.$el.find('.modeling__interface__accordion').prop('disabled',false);
  }

  disableFields() {
    //this._graphSelect.disable();
    this.$el.find('input, button').prop('disabled', true);
  }

  _onTabClick(jqevt) {
    Globals.get('Relay').dispatchEvent('ModelingTab.ToggleRequest', {tabType: 'mech'}, true);
  }

  _addLayer(divId, imgId, imgPath) {
    var $bodyNode = this.$el.find("#"+divId);
    //bodyNode.style.visibility = "visible";

    var imgNode = document.createElement('img');
    imgNode.src = imgPath + imgId + '.png';
    imgNode.id = imgId;
    imgNode.className = 'modeling__interface__images'
    $(imgNode).appendTo($bodyNode);

    if (divId === 'imgs_signal-generation_default') {
      this.$el.find("#"+imgId).css('visibility','visible');
    }
  }

  _showImg(imgId) {
    this.$el.find("#"+imgId).css('visibility','visible');
  }

  _hideImg(imgId) {
    this.$el.find("#"+imgId).css('visibility','hidden');
  }

  toggle(tabOpen) {
    if (tabOpen) {
      this.$el.find('#selectModeling').removeClass('notflippedY');
      this.$el.find('#selectModeling').addClass('flippedY');
    } else {
      this.$el.find('#selectModeling').removeClass('flippedY');
      this.$el.find('#selectModeling').addClass('notflippedY');
    }
  }
}
