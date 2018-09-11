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
      '_onTabClick', '_onModelChange','_onTransitionEnd'])

    model.addEventListener('Model.Change', this._onModelChange)

    if (!(Globals.get('AppConfig.system.expModelModality').match('justbody'))) {
      this.$el.find('.modeling__tab').on('click',this._onTabClick);
    } else {
      this.$el.find('.modeling__tab').css('display','none')
      this.$el.find('.modeling').css('visibility','hidden')
    }
    this.$el[0].addEventListener('transitionend', this._onTransitionEnd)
    this.disableFields();
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
  }

  disableFields() {
    //this._graphSelect.disable();
    this.$el.find('input, button').prop('disabled', true);
  }

  _onTabClick(jqevt) {
    Globals.get('Relay').dispatchEvent('ModelingTab.ToggleRequest', {tabType: 'blockly'}, true);
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
