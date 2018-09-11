'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

define(function (require) {
  var Utils = require('core/util/utils'),
      Globals = require('core/model/globals'),
      HM = require('core/event/hook_manager');

  var Component = require('core/component/component'),
      Model = require('./model'),
      View = require('./view');

  var ModelingDataTab = function (_Component) {
    _inherits(ModelingDataTab, _Component);

    function ModelingDataTab() {
      var settings = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      _classCallCheck(this, ModelingDataTab);

      settings.modelClass = settings.modelClass || Model;
      settings.viewClass = settings.viewClass || View;

      var _this = _possibleConstructorReturn(this, (ModelingDataTab.__proto__ || Object.getPrototypeOf(ModelingDataTab)).call(this, settings));

      Utils.bindMethods(_this, ['_onToggleRequest', '_onResultToggleRequest', '_onClearAllRequest', '_onClearRequest', '_onPhaseChange', 'toggleBlocklyEvent', '_onBlocklyLoad', '_listenBlocklyEvents', '_onDisableRequest', '_onEnableRequest', '_onBodyChange', '_updateToolbox']);

      Globals.set('blocklyLoaded', false);

      if (!(Globals.get('AppConfig.system.expModelModality') === 'justbody')) {
        Globals.get('Relay').addEventListener('ModelingTab.ToggleRequest', _this._onToggleRequest);
        Globals.get('Relay').addEventListener('Tab.Change', _this._onToggleRequest);
      }

      Globals.get('Relay').addEventListener('AppPhase.Change', _this._onPhaseChange);
      Globals.get('Relay').addEventListener('Blockly.Load', _this._onBlocklyLoad);

      Globals.get('Relay').addEventListener('Notifications.Remove', _this._listenBlocklyEvents);
      Globals.get('Relay').addEventListener('ModelingTab.TransitionEnd', _this._listenBlocklyEvents);

      Globals.get('Relay').addEventListener('Notifications.Add', _this._onDisableRequest);
      Globals.get('Relay').addEventListener('Notifications.Remove', _this._onEnableRequest);

      Globals.get('Relay').addEventListener('Body.Change', _this._onBodyChange);
      Globals.get('Relay').addEventListener('Toolbox.Update', _this._updateToolbox);

      return _this;
    }

    _createClass(ModelingDataTab, [{
      key: '_onDisableRequest',
      value: function _onDisableRequest(evt) {
        this.view().disable();
        if (this.workspace) {
          this.workspace.options.readOnly = true;
          this.workspace.options.maxBlocks = 0;
        }
      }
    }, {
      key: '_onEnableRequest',
      value: function _onEnableRequest(evt) {
        if (Globals.get('AppConfig.system.modelModality') === 'create') {
          this.view().enable();
          if (this.workspace) {
            this.workspace.options.readOnly = false;
            this.workspace.options.maxBlocks = 50;
          }
        } else if (Globals.get('AppConfig.system.modelModality') === 'explore') {
          this.view().enable();
        }
      }
    }, {
      key: 'hide',
      value: function hide() {
        this.view().hide();
      }
    }, {
      key: 'show',
      value: function show() {
        this.view().show();
      }
    }, {
      key: '_onToggleRequest',
      value: function _onToggleRequest(evt) {
        // Reload the blocks once toggled, to prevent them from being smushed
        if (!this._model.get('open')) {
          if (!this.workspace.getAllBlocks().length) {
            var defaultWorkspaceBlocks = document.getElementById("defaultWorkspaceBlocks");
            window.Blockly.Xml.domToWorkspace(defaultWorkspaceBlocks, this.workspace);

            // let oneEyeDiv = document.getElementById("one-eye");
            // let twoEyeDiv = document.getElementById("two-eyes");
            //
            // if (oneEyeDiv && twoEyeDiv) { // Will not activate on initial loading of page
            //   if (this._numSensors === 1) {
            //     oneEyeDiv.style.display='block';
            //     twoEyeDiv.style.display='none';
            //   } else {
            //     oneEyeDiv.style.display='none';
            //     twoEyeDiv.style.display='block';
            //   }
            // }
          } else {
            var blocklyXml = window.Blockly.Xml.workspaceToDom(window.Blockly.getMainWorkspace());
            this.workspace.removeChangeListener(this.toggleBlocklyEvent);
            this.workspace.clear();
            window.Blockly.Xml.domToWorkspace(blocklyXml, this.workspace);
          }
        }

        if (evt.name == 'ModelingTab.ToggleRequest') {
          this._model.toggle();
          this._view.toggle(this._model.get('open'));

          Globals.get('Logger').log({
            type: this._model.get('open') ? 'open' : 'close',
            category: 'modeling',
            data: {
              displayState: this._model.getDisplayState(),
              visualization: '' //this.view().getCurrentVisualization()
            }
          });
        } else if (evt.data.tabType == 'blockly') {
          this._model.toggle();
          this._view.toggle(this._model.get('open'));
        } else if (this._model.get('open')) {
          this._model.toggle();
          this._view.toggle(this._model.get('open'));
        }
      }
    }, {
      key: '_onResultToggleRequest',
      value: function _onResultToggleRequest(evt) {
        //this._model.toggleResult(evt.data.resultId);
        Globals.get('Logger').log({
          type: 'result_toggle',
          category: 'modeling',
          data: {
            displayState: this._model.getDisplayState(),
            visualization: '' //this.view().getCurrentVisualization()
          }
        });
      }
    }, {
      key: '_onClearRequest',
      value: function _onClearRequest(evt) {
        //this._model.clearResult(evt.data.resultId);
        Globals.get('Logger').log({
          type: 'remove_data',
          category: 'modeling',
          data: {
            resultId: evt.data.resultId,
            displayState: this._model.getDisplayState(),
            visualization: '' //this.view().getCurrentVisualization()
          }
        });
      }
    }, {
      key: '_onClearAllRequest',
      value: function _onClearAllRequest(evt) {
        //this._model.clearResultGroup(evt.data.experimentId);
        Globals.get('Logger').log({
          type: 'remove_group',
          category: 'modeling',
          data: {
            experimentId: evt.data.experimentId,
            displayState: this._model.getDisplayState(),
            visualization: '' //this.view().getCurrentVisualization()
          }
        });
      }
    }, {
      key: '_onPhaseChange',
      value: function _onPhaseChange(evt) {
        if (evt.data.phase == "login" || evt.data.phase == "login_attempted") {
          if (!Globals.get('blocklyLoaded')) {

            var blocklyOptions = {
              toolbox: document.getElementById('toolbox'),
              collapse: true,
              comments: true,
              disable: true,
              maxBlocks: Infinity,
              trashcan: true,
              horizontalLayout: true,
              toolboxPosition: 'start',
              css: true,
              media: 'https://blockly-demo.appspot.com/static/media/',
              rtl: false,
              scrollbars: true,
              sounds: true,
              oneBasedIndex: true
            };

            this.workspace = window.Blockly.inject(document.getElementById('BlocklyDiv'), blocklyOptions);

            var toolbox_scrollbars = document.getElementsByClassName('blocklyScrollbarHandle');
            for (var idx = 0; idx < toolbox_scrollbars.length; idx++) {
              toolbox_scrollbars[idx].style.fill = 'grey';
            }

            Globals.set('blocklyLoaded', true);
          }
        }
      }
    }, {
      key: '_updateToolbox',
      value: function _updateToolbox(block_type) {
        var counter = 0;
        this.workspace.getAllBlocks().forEach(function (block) {
          if (block.type === block_type) {
            counter += 1;
          }
        });

        var blockDiv = document.getElementById(block_type);
        if (String(counter) >= blockDiv.getAttribute('max_use')) {
          blockDiv.setAttribute('disabled', true);
        } else {
          blockDiv.setAttribute('disabled', false);
        }
      }
    }, {
      key: 'toggleBlocklyEvent',
      value: function toggleBlocklyEvent(evt) {
        var _this2 = this;

        if (evt.type != 'ui') {
          Globals.get('Relay').dispatchEvent('Blockly.Changed', { blocklyEvt: evt, modelType: 'blockly' });
        }

        // Check whether a block with max_use of 1 has been created resp deleted, and disable resp enable.
        if (evt.type == 'create') {
          var modify_block = true;
          Array.prototype.slice.call($(document.getElementById('defaultWorkspaceBlocks')).find('block')).map(function (block) {
            if (block.getAttribute('type') === _this2.workspace.getBlockById(evt.blockId).type) modify_block = false;
          });

          // Manipulate the toolbox according to which elements have max_use and which ones not.
          if (modify_block) {
            var block_type = this.workspace.getBlockById(evt.blockId).type;
            this._updateToolbox(block_type);
          }
        }

        // Then check if a block has been deleted that has a max_use of 1.
        if (evt.type == 'delete') {
          var block_type = evt.oldXml.getAttribute('type');
          this._updateToolbox(block_type);
        }

        if (evt.type == 'move') {
          if (['either_way', 'no_light', 'see_light'].indexOf(evt.blockId) > -1) {

            var newParent = evt.newParentId;
            var newBlock = this.workspace.getBlockById(newParent);
            if (['master_block', 'either_way', 'no_light', 'see_light'].indexOf(newParent) === -1) {
              newBlock.dispose(true);
            }
          }
        }

        //document.querySelectorAll('[type=move_change]')[0].setAttribute('disabled',true)
        //document.querySelectorAll('[type=move_change]')[0].parentNode.removeChild(document.querySelectorAll('[type=move_change]')[0])

        // ********* parse the code for errors *********
        // Send alerts

      }
    }, {
      key: '_onBlocklyLoad',
      value: function _onBlocklyLoad(evt) {
        //let workspace = window.Blockly.getMainWorkspace();

        if (!this.workspace) {
          throw new Error("Blockly workspace does not exist.");
        }
        this.workspace.removeChangeListener(this.toggleBlocklyEvent);
        this.workspace.clear();

        if (evt.data) {
          //const blocklyXml = window.Xml.textToDom(evt.data)
          var blocklyXml = $.parseXML(evt.data).documentElement;
          window.Blockly.Xml.domToWorkspace(blocklyXml, this.workspace); //.then(() => {console.log('here')});

          var blocksInToolbox = document.getElementById('toolbox').getElementsByTagName('block');
          for (var idx = 0; idx < blocksInToolbox.length; idx++) {
            this._updateToolbox(blocksInToolbox[idx].getAttribute('type'));
          }
        }

        if (!this.workspace.getAllBlocks().length) {
          var defaultWorkspaceBlocks = document.getElementById("defaultWorkspaceBlocks");
          window.Blockly.Xml.domToWorkspace(defaultWorkspaceBlocks, this.workspace);
        }
      }
    }, {
      key: '_listenBlocklyEvents',
      value: function _listenBlocklyEvents(evt) {
        if (evt.data.type === 'model' && !this.workspace.listeners_.length) {
          this.workspace.addChangeListener(this.toggleBlocklyEvent);
        }
      }
    }, {
      key: '_onBodyChange',
      value: function _onBodyChange(evt) {
        //var toolboxelem = document.getElementById("toolbox")
        //this.workspace.updateToolbox(toolboxelem)

        this._numSensors = evt.data.numSensors;

        // Hide or disable blocks in the toolbox that do not correspond to the number of sensorPosition
        var blocksInToolbox = toolbox.getElementsByTagName('block');
        for (var idx = 0; idx < blocksInToolbox.length; idx++) {
          var block = blocksInToolbox[idx];

          var numSensors = null;
          switch (block.getAttribute('sensors')) {
            case 'one':
              numSensors = 1;
              break;
            case 'two':
              numSensors = 2;
              break;
          }

          if (numSensors && String(numSensors) != evt.data.numSensors) {
            block.setAttribute('disabled', true);
          } else {
            block.setAttribute('disabled', false);
          }
        }

        // let oneEyeDiv = document.getElementById("one-eye");
        // let twoEyeDiv = document.getElementById("two-eyes");
        //
        // if (oneEyeDiv && twoEyeDiv) { // Will not activate on initial loading of page
        //   if (evt.data.numSensors === 1) {
        //     oneEyeDiv.style.display='block';
        //     twoEyeDiv.style.display='none';
        //   } else {
        //     oneEyeDiv.style.display='none';
        //     twoEyeDiv.style.display='block';
        //   }
        // }

        // Replace blocks in the workspace that do not correspond to the number of sensors with ones that do, where possible.
        // In particular: turn_at_1sensor or turn_at_1sensor_eyespot vs turn_at_2sensors
        // Use the attribute 'equivalence' of the divs to replace the blocks
        if (this.workspace) {
          this.workspace.removeChangeListener(this.toggleBlocklyEvent);

          var blocklyXml = window.Blockly.Xml.workspaceToDom(window.Blockly.getMainWorkspace());
          var blocksInWorkspace = blocklyXml.getElementsByTagName('block');
          for (var idx = 0; idx < blocksInWorkspace.length; idx++) {
            var oldBlock = blocksInWorkspace[idx];
            var oldBlockDiv = document.getElementById(oldBlock.id);
            if (oldBlockDiv.getAttribute('equivalence')) {
              var newBlock = document.getElementById(oldBlockDiv.getAttribute('equivalence')).cloneNode(true);
              var parentBlock = oldBlock.parentNode;
              var appendChild = oldBlock.getElementsByTagName('next').length ? oldBlock.getElementsByTagName('next')[0] : null;
              if (appendChild) newBlock.appendChild(appendChild);

              // Replace the field values where possible
              if (oldBlockDiv.id.match('turn_at_')) {
                var fieldValue = oldBlock.getElementsByTagName('field')['DIRECTION'].innerHTML;
                newBlock.getElementsByTagName('field')['DIRECTION'].innerHTML = fieldValue;
              }

              parentBlock.firstChild.remove();
              parentBlock.append(newBlock);
            }
          }
          this.workspace.clear();
          window.Blockly.Xml.domToWorkspace(blocklyXml, this.workspace);
          this.workspace.addChangeListener(this.toggleBlocklyEvent);
        }

        /*
                this.workspace.getAllBlocks().forEach(block => {
                  var blockDiv = document.getElementById(block.type);
                  if (blockDiv) {
                    // Check whether the block has to be replaced
                    let numSensors = null;
                    switch(blockDiv.getAttribute('sensors')) {
                      case 'one':
                        numSensors = 1;
                      break;
                      case 'two':
                        numSensors = 2;
                      break;
                    }
        
                    if (numSensors && (String(numSensors) != evt.data.numSensors)) {
                      if (blockDiv.getAttribute('equivalence')) {
                        var newBlockDiv = document.getElementById(blockDiv.getAttribute('equivalence')).cloneNode(true);
                        newBlockDiv.setAttribute('disabled',false);
        
                      }
                    }
                  }
                });
              */
      }
    }]);

    return ModelingDataTab;
  }(Component);

  ModelingDataTab.create = function () {
    var data = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    return new ModelingDataTab({ modelData: data });
  };

  return ModelingDataTab;
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9ldWdsZW5hL21vZGVsX2Jsb2NrbHkvYmxvY2tseXRhYi90YWIuanMiXSwibmFtZXMiOlsiZGVmaW5lIiwicmVxdWlyZSIsIlV0aWxzIiwiR2xvYmFscyIsIkhNIiwiQ29tcG9uZW50IiwiTW9kZWwiLCJWaWV3IiwiTW9kZWxpbmdEYXRhVGFiIiwic2V0dGluZ3MiLCJtb2RlbENsYXNzIiwidmlld0NsYXNzIiwiYmluZE1ldGhvZHMiLCJzZXQiLCJnZXQiLCJhZGRFdmVudExpc3RlbmVyIiwiX29uVG9nZ2xlUmVxdWVzdCIsIl9vblBoYXNlQ2hhbmdlIiwiX29uQmxvY2tseUxvYWQiLCJfbGlzdGVuQmxvY2tseUV2ZW50cyIsIl9vbkRpc2FibGVSZXF1ZXN0IiwiX29uRW5hYmxlUmVxdWVzdCIsIl9vbkJvZHlDaGFuZ2UiLCJfdXBkYXRlVG9vbGJveCIsImV2dCIsInZpZXciLCJkaXNhYmxlIiwid29ya3NwYWNlIiwib3B0aW9ucyIsInJlYWRPbmx5IiwibWF4QmxvY2tzIiwiZW5hYmxlIiwiaGlkZSIsInNob3ciLCJfbW9kZWwiLCJnZXRBbGxCbG9ja3MiLCJsZW5ndGgiLCJkZWZhdWx0V29ya3NwYWNlQmxvY2tzIiwiZG9jdW1lbnQiLCJnZXRFbGVtZW50QnlJZCIsIndpbmRvdyIsIkJsb2NrbHkiLCJYbWwiLCJkb21Ub1dvcmtzcGFjZSIsImJsb2NrbHlYbWwiLCJ3b3Jrc3BhY2VUb0RvbSIsImdldE1haW5Xb3Jrc3BhY2UiLCJyZW1vdmVDaGFuZ2VMaXN0ZW5lciIsInRvZ2dsZUJsb2NrbHlFdmVudCIsImNsZWFyIiwibmFtZSIsInRvZ2dsZSIsIl92aWV3IiwibG9nIiwidHlwZSIsImNhdGVnb3J5IiwiZGF0YSIsImRpc3BsYXlTdGF0ZSIsImdldERpc3BsYXlTdGF0ZSIsInZpc3VhbGl6YXRpb24iLCJ0YWJUeXBlIiwicmVzdWx0SWQiLCJleHBlcmltZW50SWQiLCJwaGFzZSIsImJsb2NrbHlPcHRpb25zIiwidG9vbGJveCIsImNvbGxhcHNlIiwiY29tbWVudHMiLCJJbmZpbml0eSIsInRyYXNoY2FuIiwiaG9yaXpvbnRhbExheW91dCIsInRvb2xib3hQb3NpdGlvbiIsImNzcyIsIm1lZGlhIiwicnRsIiwic2Nyb2xsYmFycyIsInNvdW5kcyIsIm9uZUJhc2VkSW5kZXgiLCJpbmplY3QiLCJ0b29sYm94X3Njcm9sbGJhcnMiLCJnZXRFbGVtZW50c0J5Q2xhc3NOYW1lIiwiaWR4Iiwic3R5bGUiLCJmaWxsIiwiYmxvY2tfdHlwZSIsImNvdW50ZXIiLCJmb3JFYWNoIiwiYmxvY2siLCJibG9ja0RpdiIsIlN0cmluZyIsImdldEF0dHJpYnV0ZSIsInNldEF0dHJpYnV0ZSIsImRpc3BhdGNoRXZlbnQiLCJibG9ja2x5RXZ0IiwibW9kZWxUeXBlIiwibW9kaWZ5X2Jsb2NrIiwiQXJyYXkiLCJwcm90b3R5cGUiLCJzbGljZSIsImNhbGwiLCIkIiwiZmluZCIsIm1hcCIsImdldEJsb2NrQnlJZCIsImJsb2NrSWQiLCJvbGRYbWwiLCJpbmRleE9mIiwibmV3UGFyZW50IiwibmV3UGFyZW50SWQiLCJuZXdCbG9jayIsImRpc3Bvc2UiLCJFcnJvciIsInBhcnNlWE1MIiwiZG9jdW1lbnRFbGVtZW50IiwiYmxvY2tzSW5Ub29sYm94IiwiZ2V0RWxlbWVudHNCeVRhZ05hbWUiLCJsaXN0ZW5lcnNfIiwiYWRkQ2hhbmdlTGlzdGVuZXIiLCJfbnVtU2Vuc29ycyIsIm51bVNlbnNvcnMiLCJibG9ja3NJbldvcmtzcGFjZSIsIm9sZEJsb2NrIiwib2xkQmxvY2tEaXYiLCJpZCIsImNsb25lTm9kZSIsInBhcmVudEJsb2NrIiwicGFyZW50Tm9kZSIsImFwcGVuZENoaWxkIiwibWF0Y2giLCJmaWVsZFZhbHVlIiwiaW5uZXJIVE1MIiwiZmlyc3RDaGlsZCIsInJlbW92ZSIsImFwcGVuZCIsImNyZWF0ZSIsIm1vZGVsRGF0YSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBQSxPQUFPLFVBQUNDLE9BQUQsRUFBYTtBQUNsQixNQUFNQyxRQUFRRCxRQUFRLGlC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QXNDL0UsTUFBdEMsR0FBK0NxRixTQUFTTixvQkFBVCxDQUE4QixNQUE5QixFQUFzQyxDQUF0QyxDQUEvQyxHQUEwRixJQUE1RztBQUNBLGtCQUFJWSxXQUFKLEVBQWlCbEIsU0FBU2tCLFdBQVQsQ0FBcUJBLFdBQXJCOztBQUVqQjtBQUNBLGtCQUFJTCxZQUFZQyxFQUFaLENBQWVLLEtBQWYsQ0FBcUIsVUFBckIsQ0FBSixFQUFzQztBQUNwQyxvQkFBSUMsYUFBYVIsU0FBU04sb0JBQVQsQ0FBOEIsT0FBOUIsRUFBdUMsV0FBdkMsRUFBb0RlLFNBQXJFO0FBQ0FyQix5QkFBU00sb0JBQVQsQ0FBOEIsT0FBOUIsRUFBdUMsV0FBdkMsRUFBb0RlLFNBQXBELEdBQWdFRCxVQUFoRTtBQUNEOztBQUVESiwwQkFBWU0sVUFBWixDQUF1QkMsTUFBdkI7QUFDQVAsMEJBQVlRLE1BQVosQ0FBbUJ4QixRQUFuQjtBQUNEO0FBQ0Y7QUFDRCxlQUFLbEYsU0FBTCxDQUFlc0IsS0FBZjtBQUNBVCxpQkFBT0MsT0FBUCxDQUFlQyxHQUFmLENBQW1CQyxjQUFuQixDQUFrQ0MsVUFBbEMsRUFBOEMsS0FBS2pCLFNBQW5EO0FBQ0EsZUFBS0EsU0FBTCxDQUFlMEYsaUJBQWYsQ0FBaUMsS0FBS3JFLGtCQUF0QztBQUNEOztBQUVQOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBeUJLO0FBN1hlOztBQUFBO0FBQUEsSUFTWTNDLFNBVFo7O0FBaVlsQkcsa0JBQWdCOEgsTUFBaEIsR0FBeUIsWUFBZTtBQUFBLFFBQWQ5RSxJQUFjLHVFQUFQLEVBQU87O0FBQ3RDLFdBQU8sSUFBSWhELGVBQUosQ0FBb0IsRUFBRStILFdBQVcvRSxJQUFiLEVBQXBCLENBQVA7QUFDRCxHQUZEOztBQUlBLFNBQU9oRCxlQUFQO0FBQ0QsQ0F0WUQiLCJmaWxlIjoibW9kdWxlL2V1Z2xlbmEvbW9kZWxfYmxvY2tseS9ibG9ja2x5dGFiL3RhYi5qcyIsInNvdXJjZXNDb250ZW50IjpbImRlZmluZSgocmVxdWlyZSkgPT4ge1xuICBjb25zdCBVdGlscyA9IHJlcXVpcmUoJ2NvcmUvdXRpbC91dGlscycpLFxuICAgIEdsb2JhbHMgPSByZXF1aXJlKCdjb3JlL21vZGVsL2dsb2JhbHMnKSxcbiAgICBITSA9IHJlcXVpcmUoJ2NvcmUvZXZlbnQvaG9va19tYW5hZ2VyJyk7XG5cbiAgY29uc3QgQ29tcG9uZW50ID0gcmVxdWlyZSgnY29yZS9jb21wb25lbnQvY29tcG9uZW50JyksXG4gICAgTW9kZWwgPSByZXF1aXJlKCcuL21vZGVsJyksXG4gICAgVmlldyA9IHJlcXVpcmUoJy4vdmlldycpO1xuXG4gIGNsYXNzIE1vZGVsaW5nRGF0YVRhYiBleHRlbmRzIENvbXBvbmVudCB7XG4gICAgY29uc3RydWN0b3Ioc2V0dGluZ3MgPSB7fSkge1xuICAgICAgc2V0dGluZ3MubW9kZWxDbGFzcyA9IHNldHRpbmdzLm1vZGVsQ2xhc3MgfHwgTW9kZWw7XG4gICAgICBzZXR0aW5ncy52aWV3Q2xhc3MgPSBzZXR0aW5ncy52aWV3Q2xhc3MgfHwgVmlldztcbiAgICAgIHN1cGVyKHNldHRpbmdzKTtcbiAgICAgIFV0aWxzLmJpbmRNZXRob2RzKHRoaXMsIFsnX29uVG9nZ2xlUmVxdWVzdCcsICdfb25SZXN1bHRUb2dnbGVSZXF1ZXN0JywgJ19vbkNsZWFyQWxsUmVxdWVzdCcsICdfb25DbGVhclJlcXVlc3QnLCAnX29uUGhhc2VDaGFuZ2UnLFxuICAgICAgJ3RvZ2dsZUJsb2NrbHlFdmVudCcsICdfb25CbG9ja2x5TG9hZCcsICdfbGlzdGVuQmxvY2tseUV2ZW50cycsJ19vbkRpc2FibGVSZXF1ZXN0JywnX29uRW5hYmxlUmVxdWVzdCcsJ19vbkJvZHlDaGFuZ2UnLCdfdXBkYXRlVG9vbGJveCddKVxuXG4gICAgICBHbG9iYWxzLnNldCgnYmxvY2tseUxvYWRlZCcsZmFsc2UpO1xuXG4gICAgICBpZiAoIShHbG9iYWxzLmdldCgnQXBwQ29uZmlnLnN5c3RlbS5leHBNb2RlbE1vZGFsaXR5Jyk9PT0nanVzdGJvZHknKSkge1xuICAgICAgICBHbG9iYWxzLmdldCgnUmVsYXknKS5hZGRFdmVudExpc3RlbmVyKCdNb2RlbGluZ1RhYi5Ub2dnbGVSZXF1ZXN0JywgdGhpcy5fb25Ub2dnbGVSZXF1ZXN0KVxuICAgICAgICBHbG9iYWxzLmdldCgnUmVsYXknKS5hZGRFdmVudExpc3RlbmVyKCdUYWIuQ2hhbmdlJywgdGhpcy5fb25Ub2dnbGVSZXF1ZXN0KVxuICAgICAgfVxuXG4gICAgICBHbG9iYWxzLmdldCgnUmVsYXknKS5hZGRFdmVudExpc3RlbmVyKCdBcHBQaGFzZS5DaGFuZ2UnLCB0aGlzLl9vblBoYXNlQ2hhbmdlKVxuICAgICAgR2xvYmFscy5nZXQoJ1JlbGF5JykuYWRkRXZlbnRMaXN0ZW5lcignQmxvY2tseS5Mb2FkJywgdGhpcy5fb25CbG9ja2x5TG9hZClcblxuICAgICAgR2xvYmFscy5nZXQoJ1JlbGF5JykuYWRkRXZlbnRMaXN0ZW5lcignTm90aWZpY2F0aW9ucy5SZW1vdmUnLHRoaXMuX2xpc3RlbkJsb2NrbHlFdmVudHMpXG4gICAgICBHbG9iYWxzLmdldCgnUmVsYXknKS5hZGRFdmVudExpc3RlbmVyKCdNb2RlbGluZ1RhYi5UcmFuc2l0aW9uRW5kJyx0aGlzLl9saXN0ZW5CbG9ja2x5RXZlbnRzKVxuXG4gICAgICBHbG9iYWxzLmdldCgnUmVsYXknKS5hZGRFdmVudExpc3RlbmVyKCdOb3RpZmljYXRpb25zLkFkZCcsdGhpcy5fb25EaXNhYmxlUmVxdWVzdCk7XG4gICAgICBHbG9iYWxzLmdldCgnUmVsYXknKS5hZGRFdmVudExpc3RlbmVyKCdOb3RpZmljYXRpb25zLlJlbW92ZScsdGhpcy5fb25FbmFibGVSZXF1ZXN0KTtcblxuICAgICAgR2xvYmFscy5nZXQoJ1JlbGF5JykuYWRkRXZlbnRMaXN0ZW5lcignQm9keS5DaGFuZ2UnLCB0aGlzLl9vbkJvZHlDaGFuZ2UpO1xuICAgICAgR2xvYmFscy5nZXQoJ1JlbGF5JykuYWRkRXZlbnRMaXN0ZW5lcignVG9vbGJveC5VcGRhdGUnLHRoaXMuX3VwZGF0ZVRvb2xib3gpO1xuXG5cbiAgICB9XG5cbiAgICBfb25EaXNhYmxlUmVxdWVzdChldnQpe1xuICAgICAgdGhpcy52aWV3KCkuZGlzYWJsZSgpO1xuICAgICAgaWYgKHRoaXMud29ya3NwYWNlKSB7XG4gICAgICAgIHRoaXMud29ya3NwYWNlLm9wdGlvbnMucmVhZE9ubHkgPSB0cnVlO1xuICAgICAgICB0aGlzLndvcmtzcGFjZS5vcHRpb25zLm1heEJsb2NrcyA9IDA7XG4gICAgICB9XG4gICAgfVxuXG4gICAgX29uRW5hYmxlUmVxdWVzdChldnQpe1xuICAgICAgaWYgKEdsb2JhbHMuZ2V0KCdBcHBDb25maWcuc3lzdGVtLm1vZGVsTW9kYWxpdHknKSA9PT0gJ2NyZWF0ZScpIHtcbiAgICAgICAgdGhpcy52aWV3KCkuZW5hYmxlKCk7XG4gICAgICAgIGlmICh0aGlzLndvcmtzcGFjZSkge1xuICAgICAgICAgIHRoaXMud29ya3NwYWNlLm9wdGlvbnMucmVhZE9ubHkgPSBmYWxzZTtcbiAgICAgICAgICB0aGlzLndvcmtzcGFjZS5vcHRpb25zLm1heEJsb2NrcyA9IDUwO1xuICAgICAgICB9XG4gICAgICB9IGVsc2UgaWYgKEdsb2JhbHMuZ2V0KCdBcHBDb25maWcuc3lzdGVtLm1vZGVsTW9kYWxpdHknKSA9PT0gJ2V4cGxvcmUnKSB7XG4gICAgICAgIHRoaXMudmlldygpLmVuYWJsZSgpO1xuICAgICAgfVxuICAgIH1cblxuICAgIGhpZGUoKSB7XG4gICAgICB0aGlzLnZpZXcoKS5oaWRlKCk7XG4gICAgfVxuXG4gICAgc2hvdygpIHtcbiAgICAgIHRoaXMudmlldygpLnNob3coKTtcbiAgICB9XG5cbiAgICBfb25Ub2dnbGVSZXF1ZXN0KGV2dCkge1xuICAgICAgLy8gUmVsb2FkIHRoZSBibG9ja3Mgb25jZSB0b2dnbGVkLCB0byBwcmV2ZW50IHRoZW0gZnJvbSBiZWluZyBzbXVzaGVkXG4gICAgICBpZiAoIXRoaXMuX21vZGVsLmdldCgnb3BlbicpKSB7XG4gICAgICAgIGlmICghdGhpcy53b3Jrc3BhY2UuZ2V0QWxsQmxvY2tzKCkubGVuZ3RoKSB7XG4gICAgICAgICAgdmFyIGRlZmF1bHRXb3Jrc3BhY2VCbG9ja3MgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImRlZmF1bHRXb3Jrc3BhY2VCbG9ja3NcIik7XG4gICAgICAgICAgd2luZG93LkJsb2NrbHkuWG1sLmRvbVRvV29ya3NwYWNlKGRlZmF1bHRXb3Jrc3BhY2VCbG9ja3MsIHRoaXMud29ya3NwYWNlKTtcblxuICAgICAgICAgIC8vIGxldCBvbmVFeWVEaXYgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm9uZS1leWVcIik7XG4gICAgICAgICAgLy8gbGV0IHR3b0V5ZURpdiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwidHdvLWV5ZXNcIik7XG4gICAgICAgICAgLy9cbiAgICAgICAgICAvLyBpZiAob25lRXllRGl2ICYmIHR3b0V5ZURpdikgeyAvLyBXaWxsIG5vdCBhY3RpdmF0ZSBvbiBpbml0aWFsIGxvYWRpbmcgb2YgcGFnZVxuICAgICAgICAgIC8vICAgaWYgKHRoaXMuX251bVNlbnNvcnMgPT09IDEpIHtcbiAgICAgICAgICAvLyAgICAgb25lRXllRGl2LnN0eWxlLmRpc3BsYXk9J2Jsb2NrJztcbiAgICAgICAgICAvLyAgICAgdHdvRXllRGl2LnN0eWxlLmRpc3BsYXk9J25vbmUnO1xuICAgICAgICAgIC8vICAgfSBlbHNlIHtcbiAgICAgICAgICAvLyAgICAgb25lRXllRGl2LnN0eWxlLmRpc3BsYXk9J25vbmUnO1xuICAgICAgICAgIC8vICAgICB0d29FeWVEaXYuc3R5bGUuZGlzcGxheT0nYmxvY2snO1xuICAgICAgICAgIC8vICAgfVxuICAgICAgICAgIC8vIH1cblxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHZhciBibG9ja2x5WG1sID0gd2luZG93LkJsb2NrbHkuWG1sLndvcmtzcGFjZVRvRG9tKHdpbmRvdy5CbG9ja2x5LmdldE1haW5Xb3Jrc3BhY2UoKSk7XG4gICAgICAgICAgdGhpcy53b3Jrc3BhY2UucmVtb3ZlQ2hhbmdlTGlzdGVuZXIodGhpcy50b2dnbGVCbG9ja2x5RXZlbnQpO1xuICAgICAgICAgIHRoaXMud29ya3NwYWNlLmNsZWFyKCk7XG4gICAgICAgICAgd2luZG93LkJsb2NrbHkuWG1sLmRvbVRvV29ya3NwYWNlKGJsb2NrbHlYbWwsIHRoaXMud29ya3NwYWNlKTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBpZiAoZXZ0Lm5hbWUgPT0gJ01vZGVsaW5nVGFiLlRvZ2dsZVJlcXVlc3QnKSB7XG4gICAgICAgIHRoaXMuX21vZGVsLnRvZ2dsZSgpO1xuICAgICAgICB0aGlzLl92aWV3LnRvZ2dsZSh0aGlzLl9tb2RlbC5nZXQoJ29wZW4nKSk7XG5cbiAgICAgICAgR2xvYmFscy5nZXQoJ0xvZ2dlcicpLmxvZyh7XG4gICAgICAgICAgdHlwZTogdGhpcy5fbW9kZWwuZ2V0KCdvcGVuJykgPyAnb3BlbicgOiAnY2xvc2UnLFxuICAgICAgICAgIGNhdGVnb3J5OiAnbW9kZWxpbmcnLFxuICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgIGRpc3BsYXlTdGF0ZTogdGhpcy5fbW9kZWwuZ2V0RGlzcGxheVN0YXRlKCksXG4gICAgICAgICAgICB2aXN1YWxpemF0aW9uOiAnJy8vdGhpcy52aWV3KCkuZ2V0Q3VycmVudFZpc3VhbGl6YXRpb24oKVxuICAgICAgICAgIH1cbiAgICAgICAgfSlcbiAgICAgIH0gZWxzZSBpZiAoZXZ0LmRhdGEudGFiVHlwZSA9PSAnYmxvY2tseScpIHtcbiAgICAgICAgdGhpcy5fbW9kZWwudG9nZ2xlKCk7XG4gICAgICAgIHRoaXMuX3ZpZXcudG9nZ2xlKHRoaXMuX21vZGVsLmdldCgnb3BlbicpKTtcbiAgICAgIH0gZWxzZSBpZiAodGhpcy5fbW9kZWwuZ2V0KCdvcGVuJykpIHtcbiAgICAgICAgdGhpcy5fbW9kZWwudG9nZ2xlKCk7XG4gICAgICAgIHRoaXMuX3ZpZXcudG9nZ2xlKHRoaXMuX21vZGVsLmdldCgnb3BlbicpKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBfb25SZXN1bHRUb2dnbGVSZXF1ZXN0KGV2dCkge1xuICAgICAgLy90aGlzLl9tb2RlbC50b2dnbGVSZXN1bHQoZXZ0LmRhdGEucmVzdWx0SWQpO1xuICAgICAgR2xvYmFscy5nZXQoJ0xvZ2dlcicpLmxvZyh7XG4gICAgICAgIHR5cGU6ICdyZXN1bHRfdG9nZ2xlJyxcbiAgICAgICAgY2F0ZWdvcnk6ICdtb2RlbGluZycsXG4gICAgICAgIGRhdGE6IHtcbiAgICAgICAgICBkaXNwbGF5U3RhdGU6IHRoaXMuX21vZGVsLmdldERpc3BsYXlTdGF0ZSgpLFxuICAgICAgICAgIHZpc3VhbGl6YXRpb246ICcnLy90aGlzLnZpZXcoKS5nZXRDdXJyZW50VmlzdWFsaXphdGlvbigpXG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgfVxuXG4gICAgX29uQ2xlYXJSZXF1ZXN0KGV2dCkge1xuICAgICAgLy90aGlzLl9tb2RlbC5jbGVhclJlc3VsdChldnQuZGF0YS5yZXN1bHRJZCk7XG4gICAgICBHbG9iYWxzLmdldCgnTG9nZ2VyJykubG9nKHtcbiAgICAgICAgdHlwZTogJ3JlbW92ZV9kYXRhJyxcbiAgICAgICAgY2F0ZWdvcnk6ICdtb2RlbGluZycsXG4gICAgICAgIGRhdGE6IHtcbiAgICAgICAgICByZXN1bHRJZDogZXZ0LmRhdGEucmVzdWx0SWQsXG4gICAgICAgICAgZGlzcGxheVN0YXRlOiB0aGlzLl9tb2RlbC5nZXREaXNwbGF5U3RhdGUoKSxcbiAgICAgICAgICB2aXN1YWxpemF0aW9uOiAnJy8vdGhpcy52aWV3KCkuZ2V0Q3VycmVudFZpc3VhbGl6YXRpb24oKVxuICAgICAgICB9XG4gICAgICB9KVxuICAgIH1cblxuICAgIF9vbkNsZWFyQWxsUmVxdWVzdChldnQpIHtcbiAgICAgIC8vdGhpcy5fbW9kZWwuY2xlYXJSZXN1bHRHcm91cChldnQuZGF0YS5leHBlcmltZW50SWQpO1xuICAgICAgR2xvYmFscy5nZXQoJ0xvZ2dlcicpLmxvZyh7XG4gICAgICAgIHR5cGU6ICdyZW1vdmVfZ3JvdXAnLFxuICAgICAgICBjYXRlZ29yeTogJ21vZGVsaW5nJyxcbiAgICAgICAgZGF0YToge1xuICAgICAgICAgIGV4cGVyaW1lbnRJZDogZXZ0LmRhdGEuZXhwZXJpbWVudElkLFxuICAgICAgICAgIGRpc3BsYXlTdGF0ZTogdGhpcy5fbW9kZWwuZ2V0RGlzcGxheVN0YXRlKCksXG4gICAgICAgICAgdmlzdWFsaXphdGlvbjogJycvL3RoaXMudmlldygpLmdldEN1cnJlbnRWaXN1YWxpemF0aW9uKClcbiAgICAgICAgfVxuICAgICAgfSlcbiAgICB9XG5cblxuICAgIF9vblBoYXNlQ2hhbmdlKGV2dCkge1xuICAgICAgaWYgKGV2dC5kYXRhLnBoYXNlID09IFwibG9naW5cIiB8fCBldnQuZGF0YS5waGFzZSA9PSBcImxvZ2luX2F0dGVtcHRlZFwiKSB7XG4gICAgICAgIGlmICghR2xvYmFscy5nZXQoJ2Jsb2NrbHlMb2FkZWQnKSkge1xuXG4gICAgICAgICAgdmFyIGJsb2NrbHlPcHRpb25zID0ge1xuICAgICAgICAgICAgdG9vbGJveCA6IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd0b29sYm94JyksXG4gICAgICAgICAgICBjb2xsYXBzZSA6IHRydWUsXG4gICAgICAgICAgICBjb21tZW50cyA6IHRydWUsXG4gICAgICAgICAgICBkaXNhYmxlIDogdHJ1ZSxcbiAgICAgICAgICAgIG1heEJsb2NrcyA6IEluZmluaXR5LFxuICAgICAgICAgICAgdHJhc2hjYW4gOiB0cnVlLFxuICAgICAgICAgICAgaG9yaXpvbnRhbExheW91dCA6IHRydWUsXG4gICAgICAgICAgICB0b29sYm94UG9zaXRpb24gOiAnc3RhcnQnLFxuICAgICAgICAgICAgY3NzIDogdHJ1ZSxcbiAgICAgICAgICAgIG1lZGlhIDogJ2h0dHBzOi8vYmxvY2tseS1kZW1vLmFwcHNwb3QuY29tL3N0YXRpYy9tZWRpYS8nLFxuICAgICAgICAgICAgcnRsIDogZmFsc2UsXG4gICAgICAgICAgICBzY3JvbGxiYXJzIDogdHJ1ZSxcbiAgICAgICAgICAgIHNvdW5kcyA6IHRydWUsXG4gICAgICAgICAgICBvbmVCYXNlZEluZGV4IDogdHJ1ZVxuICAgICAgICAgIH07XG5cbiAgICAgICAgICB0aGlzLndvcmtzcGFjZSA9IHdpbmRvdy5CbG9ja2x5LmluamVjdChkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnQmxvY2tseURpdicpLCBibG9ja2x5T3B0aW9ucyk7XG5cbiAgICAgICAgICB2YXIgdG9vbGJveF9zY3JvbGxiYXJzID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgnYmxvY2tseVNjcm9sbGJhckhhbmRsZScpO1xuICAgICAgICAgIGZvciAobGV0IGlkeD0wO2lkeDx0b29sYm94X3Njcm9sbGJhcnMubGVuZ3RoO2lkeCsrKSB7XG4gICAgICAgICAgICB0b29sYm94X3Njcm9sbGJhcnNbaWR4XS5zdHlsZS5maWxsPSdncmV5JztcbiAgICAgICAgICB9XG5cblxuICAgICAgICAgIEdsb2JhbHMuc2V0KCdibG9ja2x5TG9hZGVkJyx0cnVlKTtcblxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgX3VwZGF0ZVRvb2xib3goYmxvY2tfdHlwZSkge1xuICAgICAgICB2YXIgY291bnRlciA9IDA7XG4gICAgICAgIHRoaXMud29ya3NwYWNlLmdldEFsbEJsb2NrcygpLmZvckVhY2goYmxvY2sgPT4ge1xuICAgICAgICAgIGlmIChibG9jay50eXBlID09PSBibG9ja190eXBlKSB7IGNvdW50ZXIgKz0gMTsgfVxuICAgICAgICB9KTtcblxuICAgICAgICB2YXIgYmxvY2tEaXYgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChibG9ja190eXBlKTtcbiAgICAgICAgaWYgKFN0cmluZyhjb3VudGVyKSA+PSBibG9ja0Rpdi5nZXRBdHRyaWJ1dGUoJ21heF91c2UnKSkge1xuICAgICAgICAgIGJsb2NrRGl2LnNldEF0dHJpYnV0ZSgnZGlzYWJsZWQnLHRydWUpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGJsb2NrRGl2LnNldEF0dHJpYnV0ZSgnZGlzYWJsZWQnLGZhbHNlKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHRvZ2dsZUJsb2NrbHlFdmVudChldnQpIHtcbiAgICAgIGlmIChldnQudHlwZSAhPSAndWknKSB7XG4gICAgICAgIEdsb2JhbHMuZ2V0KCdSZWxheScpLmRpc3BhdGNoRXZlbnQoJ0Jsb2NrbHkuQ2hhbmdlZCcsIHtibG9ja2x5RXZ0OiBldnQsIG1vZGVsVHlwZTogJ2Jsb2NrbHknfSk7XG4gICAgICB9XG5cbiAgICAgIC8vIENoZWNrIHdoZXRoZXIgYSBibG9jayB3aXRoIG1heF91c2Ugb2YgMSBoYXMgYmVlbiBjcmVhdGVkIHJlc3AgZGVsZXRlZCwgYW5kIGRpc2FibGUgcmVzcCBlbmFibGUuXG4gICAgICBpZiAoZXZ0LnR5cGUgPT0gJ2NyZWF0ZScpIHtcbiAgICAgICAgdmFyIG1vZGlmeV9ibG9jayA9IHRydWU7XG4gICAgICAgIEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKCQoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2RlZmF1bHRXb3Jrc3BhY2VCbG9ja3MnKSkuZmluZCgnYmxvY2snKSkubWFwKGJsb2NrID0+IHtcbiAgICAgICAgICBpZihibG9jay5nZXRBdHRyaWJ1dGUoJ3R5cGUnKSA9PT0gdGhpcy53b3Jrc3BhY2UuZ2V0QmxvY2tCeUlkKGV2dC5ibG9ja0lkKS50eXBlKSBtb2RpZnlfYmxvY2sgPSBmYWxzZTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgLy8gTWFuaXB1bGF0ZSB0aGUgdG9vbGJveCBhY2NvcmRpbmcgdG8gd2hpY2ggZWxlbWVudHMgaGF2ZSBtYXhfdXNlIGFuZCB3aGljaCBvbmVzIG5vdC5cbiAgICAgICAgaWYgKG1vZGlmeV9ibG9jaykge1xuICAgICAgICAgIHZhciBibG9ja190eXBlID0gdGhpcy53b3Jrc3BhY2UuZ2V0QmxvY2tCeUlkKGV2dC5ibG9ja0lkKS50eXBlO1xuICAgICAgICAgIHRoaXMuX3VwZGF0ZVRvb2xib3goYmxvY2tfdHlwZSk7XG5cbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICAvLyBUaGVuIGNoZWNrIGlmIGEgYmxvY2sgaGFzIGJlZW4gZGVsZXRlZCB0aGF0IGhhcyBhIG1heF91c2Ugb2YgMS5cbiAgICAgIGlmIChldnQudHlwZSA9PSAnZGVsZXRlJykge1xuICAgICAgICB2YXIgYmxvY2tfdHlwZSA9IGV2dC5vbGRYbWwuZ2V0QXR0cmlidXRlKCd0eXBlJyk7XG4gICAgICAgIHRoaXMuX3VwZGF0ZVRvb2xib3goYmxvY2tfdHlwZSk7XG4gICAgICB9XG5cbiAgICAgIGlmKGV2dC50eXBlID09ICdtb3ZlJykge1xuICAgICAgICBpZiAoWydlaXRoZXJfd2F5Jywnbm9fbGlnaHQnLCdzZWVfbGlnaHQnXS5pbmRleE9mKGV2dC5ibG9ja0lkKSA+IC0xKSB7XG5cbiAgICAgICAgICB2YXIgbmV3UGFyZW50ID0gZXZ0Lm5ld1BhcmVudElkO1xuICAgICAgICAgIHZhciBuZXdCbG9jayA9IHRoaXMud29ya3NwYWNlLmdldEJsb2NrQnlJZChuZXdQYXJlbnQpO1xuICAgICAgICAgIGlmIChbJ21hc3Rlcl9ibG9jaycsJ2VpdGhlcl93YXknLCdub19saWdodCcsJ3NlZV9saWdodCddLmluZGV4T2YobmV3UGFyZW50KSA9PT0gLTEpIHtcbiAgICAgICAgICAgIG5ld0Jsb2NrLmRpc3Bvc2UodHJ1ZSk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIC8vZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnW3R5cGU9bW92ZV9jaGFuZ2VdJylbMF0uc2V0QXR0cmlidXRlKCdkaXNhYmxlZCcsdHJ1ZSlcbiAgICAgIC8vZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnW3R5cGU9bW92ZV9jaGFuZ2VdJylbMF0ucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCdbdHlwZT1tb3ZlX2NoYW5nZV0nKVswXSlcblxuICAgICAgLy8gKioqKioqKioqIHBhcnNlIHRoZSBjb2RlIGZvciBlcnJvcnMgKioqKioqKioqXG4gICAgICAvLyBTZW5kIGFsZXJ0c1xuXG5cbiAgICB9XG5cbiAgICBfb25CbG9ja2x5TG9hZChldnQpIHtcbiAgICAgIC8vbGV0IHdvcmtzcGFjZSA9IHdpbmRvdy5CbG9ja2x5LmdldE1haW5Xb3Jrc3BhY2UoKTtcblxuICAgICAgaWYgKCF0aGlzLndvcmtzcGFjZSkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJCbG9ja2x5IHdvcmtzcGFjZSBkb2VzIG5vdCBleGlzdC5cIik7XG4gICAgICB9XG4gICAgICB0aGlzLndvcmtzcGFjZS5yZW1vdmVDaGFuZ2VMaXN0ZW5lcih0aGlzLnRvZ2dsZUJsb2NrbHlFdmVudCk7XG4gICAgICB0aGlzLndvcmtzcGFjZS5jbGVhcigpO1xuXG4gICAgICBpZiAoZXZ0LmRhdGEpIHtcbiAgICAgICAgLy9jb25zdCBibG9ja2x5WG1sID0gd2luZG93LlhtbC50ZXh0VG9Eb20oZXZ0LmRhdGEpXG4gICAgICAgIGNvbnN0IGJsb2NrbHlYbWwgPSAkLnBhcnNlWE1MKGV2dC5kYXRhKS5kb2N1bWVudEVsZW1lbnQ7XG4gICAgICAgIHdpbmRvdy5CbG9ja2x5LlhtbC5kb21Ub1dvcmtzcGFjZShibG9ja2x5WG1sLCB0aGlzLndvcmtzcGFjZSk7Ly8udGhlbigoKSA9PiB7Y29uc29sZS5sb2coJ2hlcmUnKX0pO1xuXG4gICAgICAgIHZhciBibG9ja3NJblRvb2xib3ggPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgndG9vbGJveCcpLmdldEVsZW1lbnRzQnlUYWdOYW1lKCdibG9jaycpO1xuICAgICAgICBmb3IgKHZhciBpZHggPSAwOyBpZHggPCBibG9ja3NJblRvb2xib3gubGVuZ3RoOyBpZHgrKykge1xuICAgICAgICAgIHRoaXMuX3VwZGF0ZVRvb2xib3goYmxvY2tzSW5Ub29sYm94W2lkeF0uZ2V0QXR0cmlidXRlKCd0eXBlJykpO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGlmICghdGhpcy53b3Jrc3BhY2UuZ2V0QWxsQmxvY2tzKCkubGVuZ3RoKSB7XG4gICAgICAgIHZhciBkZWZhdWx0V29ya3NwYWNlQmxvY2tzID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJkZWZhdWx0V29ya3NwYWNlQmxvY2tzXCIpO1xuICAgICAgICB3aW5kb3cuQmxvY2tseS5YbWwuZG9tVG9Xb3Jrc3BhY2UoZGVmYXVsdFdvcmtzcGFjZUJsb2NrcywgdGhpcy53b3Jrc3BhY2UpO1xuICAgICAgfVxuXG4gICAgfVxuXG4gICAgX2xpc3RlbkJsb2NrbHlFdmVudHMoZXZ0KSB7XG4gICAgICBpZiAoZXZ0LmRhdGEudHlwZT09PSAnbW9kZWwnICYmICF0aGlzLndvcmtzcGFjZS5saXN0ZW5lcnNfLmxlbmd0aCkge1xuICAgICAgICB0aGlzLndvcmtzcGFjZS5hZGRDaGFuZ2VMaXN0ZW5lcih0aGlzLnRvZ2dsZUJsb2NrbHlFdmVudCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgX29uQm9keUNoYW5nZShldnQpIHtcbiAgICAgIC8vdmFyIHRvb2xib3hlbGVtID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJ0b29sYm94XCIpXG4gICAgICAvL3RoaXMud29ya3NwYWNlLnVwZGF0ZVRvb2xib3godG9vbGJveGVsZW0pXG5cbiAgICAgIHRoaXMuX251bVNlbnNvcnMgPSBldnQuZGF0YS5udW1TZW5zb3JzO1xuXG4gICAgICAvLyBIaWRlIG9yIGRpc2FibGUgYmxvY2tzIGluIHRoZSB0b29sYm94IHRoYXQgZG8gbm90IGNvcnJlc3BvbmQgdG8gdGhlIG51bWJlciBvZiBzZW5zb3JQb3NpdGlvblxuICAgICAgdmFyIGJsb2Nrc0luVG9vbGJveCA9IHRvb2xib3guZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ2Jsb2NrJyk7XG4gICAgICBmb3IgKHZhciBpZHggPSAwOyBpZHggPCBibG9ja3NJblRvb2xib3gubGVuZ3RoOyBpZHgrKykge1xuICAgICAgICBsZXQgYmxvY2sgPSBibG9ja3NJblRvb2xib3hbaWR4XTtcblxuICAgICAgICBsZXQgbnVtU2Vuc29ycyA9IG51bGw7XG4gICAgICAgIHN3aXRjaChibG9jay5nZXRBdHRyaWJ1dGUoJ3NlbnNvcnMnKSkge1xuICAgICAgICAgIGNhc2UgJ29uZSc6XG4gICAgICAgICAgICBudW1TZW5zb3JzID0gMTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgICBjYXNlICd0d28nOlxuICAgICAgICAgICAgbnVtU2Vuc29ycyA9IDI7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAobnVtU2Vuc29ycyAmJiAoU3RyaW5nKG51bVNlbnNvcnMpICE9IGV2dC5kYXRhLm51bVNlbnNvcnMpKSB7XG4gICAgICAgICAgYmxvY2suc2V0QXR0cmlidXRlKCdkaXNhYmxlZCcsdHJ1ZSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgYmxvY2suc2V0QXR0cmlidXRlKCdkaXNhYmxlZCcsZmFsc2UpO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIC8vIGxldCBvbmVFeWVEaXYgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm9uZS1leWVcIik7XG4gICAgICAvLyBsZXQgdHdvRXllRGl2ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJ0d28tZXllc1wiKTtcbiAgICAgIC8vXG4gICAgICAvLyBpZiAob25lRXllRGl2ICYmIHR3b0V5ZURpdikgeyAvLyBXaWxsIG5vdCBhY3RpdmF0ZSBvbiBpbml0aWFsIGxvYWRpbmcgb2YgcGFnZVxuICAgICAgLy8gICBpZiAoZXZ0LmRhdGEubnVtU2Vuc29ycyA9PT0gMSkge1xuICAgICAgLy8gICAgIG9uZUV5ZURpdi5zdHlsZS5kaXNwbGF5PSdibG9jayc7XG4gICAgICAvLyAgICAgdHdvRXllRGl2LnN0eWxlLmRpc3BsYXk9J25vbmUnO1xuICAgICAgLy8gICB9IGVsc2Uge1xuICAgICAgLy8gICAgIG9uZUV5ZURpdi5zdHlsZS5kaXNwbGF5PSdub25lJztcbiAgICAgIC8vICAgICB0d29FeWVEaXYuc3R5bGUuZGlzcGxheT0nYmxvY2snO1xuICAgICAgLy8gICB9XG4gICAgICAvLyB9XG5cbiAgICAgIC8vIFJlcGxhY2UgYmxvY2tzIGluIHRoZSB3b3Jrc3BhY2UgdGhhdCBkbyBub3QgY29ycmVzcG9uZCB0byB0aGUgbnVtYmVyIG9mIHNlbnNvcnMgd2l0aCBvbmVzIHRoYXQgZG8sIHdoZXJlIHBvc3NpYmxlLlxuICAgICAgLy8gSW4gcGFydGljdWxhcjogdHVybl9hdF8xc2Vuc29yIG9yIHR1cm5fYXRfMXNlbnNvcl9leWVzcG90IHZzIHR1cm5fYXRfMnNlbnNvcnNcbiAgICAgIC8vIFVzZSB0aGUgYXR0cmlidXRlICdlcXVpdmFsZW5jZScgb2YgdGhlIGRpdnMgdG8gcmVwbGFjZSB0aGUgYmxvY2tzXG4gICAgICBpZiAodGhpcy53b3Jrc3BhY2UpIHtcbiAgICAgICAgdGhpcy53b3Jrc3BhY2UucmVtb3ZlQ2hhbmdlTGlzdGVuZXIodGhpcy50b2dnbGVCbG9ja2x5RXZlbnQpO1xuXG4gICAgICAgIHZhciBibG9ja2x5WG1sID0gd2luZG93LkJsb2NrbHkuWG1sLndvcmtzcGFjZVRvRG9tKHdpbmRvdy5CbG9ja2x5LmdldE1haW5Xb3Jrc3BhY2UoKSk7XG4gICAgICAgIHZhciBibG9ja3NJbldvcmtzcGFjZSA9IGJsb2NrbHlYbWwuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ2Jsb2NrJylcbiAgICAgICAgZm9yICh2YXIgaWR4ID0gMDsgaWR4IDwgYmxvY2tzSW5Xb3Jrc3BhY2UubGVuZ3RoOyBpZHgrKykge1xuICAgICAgICAgIGxldCBvbGRCbG9jayA9IGJsb2Nrc0luV29ya3NwYWNlW2lkeF07XG4gICAgICAgICAgbGV0IG9sZEJsb2NrRGl2ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQob2xkQmxvY2suaWQpXG4gICAgICAgICAgaWYgKG9sZEJsb2NrRGl2LmdldEF0dHJpYnV0ZSgnZXF1aXZhbGVuY2UnKSkge1xuICAgICAgICAgICAgbGV0IG5ld0Jsb2NrID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQob2xkQmxvY2tEaXYuZ2V0QXR0cmlidXRlKCdlcXVpdmFsZW5jZScpKS5jbG9uZU5vZGUodHJ1ZSk7XG4gICAgICAgICAgICBsZXQgcGFyZW50QmxvY2sgPSBvbGRCbG9jay5wYXJlbnROb2RlO1xuICAgICAgICAgICAgbGV0IGFwcGVuZENoaWxkID0gb2xkQmxvY2suZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ25leHQnKS5sZW5ndGggPyBvbGRCbG9jay5nZXRFbGVtZW50c0J5VGFnTmFtZSgnbmV4dCcpWzBdIDogbnVsbDtcbiAgICAgICAgICAgIGlmIChhcHBlbmRDaGlsZCkgbmV3QmxvY2suYXBwZW5kQ2hpbGQoYXBwZW5kQ2hpbGQpO1xuXG4gICAgICAgICAgICAvLyBSZXBsYWNlIHRoZSBmaWVsZCB2YWx1ZXMgd2hlcmUgcG9zc2libGVcbiAgICAgICAgICAgIGlmIChvbGRCbG9ja0Rpdi5pZC5tYXRjaCgndHVybl9hdF8nKSkge1xuICAgICAgICAgICAgICBsZXQgZmllbGRWYWx1ZSA9IG9sZEJsb2NrLmdldEVsZW1lbnRzQnlUYWdOYW1lKCdmaWVsZCcpWydESVJFQ1RJT04nXS5pbm5lckhUTUw7XG4gICAgICAgICAgICAgIG5ld0Jsb2NrLmdldEVsZW1lbnRzQnlUYWdOYW1lKCdmaWVsZCcpWydESVJFQ1RJT04nXS5pbm5lckhUTUwgPSBmaWVsZFZhbHVlO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBwYXJlbnRCbG9jay5maXJzdENoaWxkLnJlbW92ZSgpO1xuICAgICAgICAgICAgcGFyZW50QmxvY2suYXBwZW5kKG5ld0Jsb2NrKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy53b3Jrc3BhY2UuY2xlYXIoKTtcbiAgICAgICAgd2luZG93LkJsb2NrbHkuWG1sLmRvbVRvV29ya3NwYWNlKGJsb2NrbHlYbWwsIHRoaXMud29ya3NwYWNlKTtcbiAgICAgICAgdGhpcy53b3Jrc3BhY2UuYWRkQ2hhbmdlTGlzdGVuZXIodGhpcy50b2dnbGVCbG9ja2x5RXZlbnQpXG4gICAgICB9XG5cbi8qXG4gICAgICAgIHRoaXMud29ya3NwYWNlLmdldEFsbEJsb2NrcygpLmZvckVhY2goYmxvY2sgPT4ge1xuICAgICAgICAgIHZhciBibG9ja0RpdiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGJsb2NrLnR5cGUpO1xuICAgICAgICAgIGlmIChibG9ja0Rpdikge1xuICAgICAgICAgICAgLy8gQ2hlY2sgd2hldGhlciB0aGUgYmxvY2sgaGFzIHRvIGJlIHJlcGxhY2VkXG4gICAgICAgICAgICBsZXQgbnVtU2Vuc29ycyA9IG51bGw7XG4gICAgICAgICAgICBzd2l0Y2goYmxvY2tEaXYuZ2V0QXR0cmlidXRlKCdzZW5zb3JzJykpIHtcbiAgICAgICAgICAgICAgY2FzZSAnb25lJzpcbiAgICAgICAgICAgICAgICBudW1TZW5zb3JzID0gMTtcbiAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgIGNhc2UgJ3R3byc6XG4gICAgICAgICAgICAgICAgbnVtU2Vuc29ycyA9IDI7XG4gICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAobnVtU2Vuc29ycyAmJiAoU3RyaW5nKG51bVNlbnNvcnMpICE9IGV2dC5kYXRhLm51bVNlbnNvcnMpKSB7XG4gICAgICAgICAgICAgIGlmIChibG9ja0Rpdi5nZXRBdHRyaWJ1dGUoJ2VxdWl2YWxlbmNlJykpIHtcbiAgICAgICAgICAgICAgICB2YXIgbmV3QmxvY2tEaXYgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChibG9ja0Rpdi5nZXRBdHRyaWJ1dGUoJ2VxdWl2YWxlbmNlJykpLmNsb25lTm9kZSh0cnVlKTtcbiAgICAgICAgICAgICAgICBuZXdCbG9ja0Rpdi5zZXRBdHRyaWJ1dGUoJ2Rpc2FibGVkJyxmYWxzZSk7XG5cbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAqL1xuICAgIH1cblxuICB9XG5cbiAgTW9kZWxpbmdEYXRhVGFiLmNyZWF0ZSA9IChkYXRhID0ge30pID0+IHtcbiAgICByZXR1cm4gbmV3IE1vZGVsaW5nRGF0YVRhYih7IG1vZGVsRGF0YTogZGF0YSB9KVxuICB9XG5cbiAgcmV0dXJuIE1vZGVsaW5nRGF0YVRhYjtcbn0pXG4iXX0=
