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
        this.workspace.options.readOnly = true;
        this.workspace.options.maxBlocks = 0;
      }
    }, {
      key: '_onEnableRequest',
      value: function _onEnableRequest(evt) {
        if (Globals.get('AppConfig.system.modelModality') === 'create') {
          this.view().enable();
          this.workspace.options.readOnly = false;
          this.workspace.options.maxBlocks = 50;
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
        var _this3 = this;

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

          var presentBlocks = this.workspace.getAllBlocks();
          presentBlocks.map(function (block) {
            _this3._updateToolbox(block.type);

            // var blockDiv = document.getElementById(block.type);
            // if (blockDiv) {
            //   if (blockDiv.getAttribute('max_use') === '1') {
            //     blockDiv.setAttribute('disabled',true);
            //   }
            // }
          });
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9ldWdsZW5hL21vZGVsX2Jsb2NrbHkvYmxvY2tseXRhYi90YWIuanMiXSwibmFtZXMiOlsiZGVmaW5lIiwicmVxdWlyZSIsIlV0aWxzIiwiR2xvYmFscyIsIkhNIiwiQ29tcG9uZW50IiwiTW9kZWwiLCJWaWV3IiwiTW9kZWxpbmdEYXRhVGFiIiwic2V0dGluZ3MiLCJtb2RlbENsYXNzIiwidmlld0NsYXNzIiwiYmluZE1ldGhvZHMiLCJzZXQiLCJnZXQiLCJhZGRFdmVudExpc3RlbmVyIiwiX29uVG9nZ2xlUmVxdWVzdCIsIl9vblBoYXNlQ2hhbmdlIiwiX29uQmxvY2tseUxvYWQiLCJfbGlzdGVuQmxvY2tseUV2ZW50cyIsIl9vbkRpc2FibGVSZXF1ZXN0IiwiX29uRW5hYmxlUmVxdWVzdCIsIl9vbkJvZHlDaGFuZ2UiLCJfdXBkYXRlVG9vbGJveCIsImV2dCIsInZpZXciLCJkaXNhYmxlIiwid29ya3NwYWNlIiwib3B0aW9ucyIsInJlYWRPbmx5IiwibWF4QmxvY2tzIiwiZW5hYmxlIiwiaGlkZSIsInNob3ciLCJfbW9kZWwiLCJnZXRBbGxCbG9ja3MiLCJsZW5ndGgiLCJkZWZhdWx0V29ya3NwYWNlQmxvY2tzIiwiZG9jdW1lbnQiLCJnZXRFbGVtZW50QnlJZCIsIndpbmRvdyIsIkJsb2NrbHkiLCJYbWwiLCJkb21Ub1dvcmtzcGFjZSIsImJsb2NrbHlYbWwiLCJ3b3Jrc3BhY2VUb0RvbSIsImdldE1haW5Xb3Jrc3BhY2UiLCJyZW1vdmVDaGFuZ2VMaXN0ZW5lciIsInRvZ2dsZUJsb2NrbHlFdmVudCIsImNsZWFyIiwibmFtZSIsInRvZ2dsZSIsIl92aWV3IiwibG9nIiwidHlwZSIsImNhdGVnb3J5IiwiZGF0YSIsImRpc3BsYXlTdGF0ZSIsImdldERpc3BsYXlTdGF0ZSIsInZpc3VhbGl6YXRpb24iLCJ0YWJUeXBlIiwicmVzdWx0SWQiLCJleHBlcmltZW50SWQiLCJwaGFzZSIsImJsb2NrbHlPcHRpb25zIiwidG9vbGJveCIsImNvbGxhcHNlIiwiY29tbWVudHMiLCJJbmZpbml0eSIsInRyYXNoY2FuIiwiaG9yaXpvbnRhbExheW91dCIsInRvb2xib3hQb3NpdGlvbiIsImNzcyIsIm1lZGlhIiwicnRsIiwic2Nyb2xsYmFycyIsInNvdW5kcyIsIm9uZUJhc2VkSW5kZXgiLCJpbmplY3QiLCJ0b29sYm94X3Njcm9sbGJhcnMiLCJnZXRFbGVtZW50c0J5Q2xhc3NOYW1lIiwiaWR4Iiwic3R5bGUiLCJmaWxsIiwiYmxvY2tfdHlwZSIsImNvdW50ZXIiLCJmb3JFYWNoIiwiYmxvY2siLCJibG9ja0RpdiIsIlN0cmluZyIsImdldEF0dHJpYnV0ZSIsInNldEF0dHJpYnV0ZSIsImRpc3BhdGNoRXZlbnQiLCJibG9ja2x5RXZ0IiwibW9kZWxUeXBlIiwibW9kaWZ5X2Jsb2NrIiwiQXJyYXkiLCJwcm90b3R5cGUiLCJzbGljZSIsImNhbGwiLCIkIiwiZmluZCIsIm1hcCIsImdldEJsb2NrQnlJZCIsImJsb2NrSWQiLCJvbGRYbWwiLCJpbmRleE9mIiwibmV3UGFyZW50IiwibmV3UGFyZW50SWQiLCJuZXdCbG9jayIsImRpc3Bvc2UiLCJFcnJvciIsInBhcnNlWE1MIiwiZG9jdW1lbnRFbGVtZW50IiwicHJlc2VudEJsb2NrcyIsImxpc3RlbmVyc18iLCJhZGRDaGFuZ2VMaXN0ZW5lciIsIl9udW1TZW5zb3JzIiwibnVtU2Vuc29ycyIsImJsb2Nrc0luVG9vbGJveCIsImdldEVsZW1lbnRzQnlUYWdOYW1lIiwiYmxvY2tzSW5Xb3Jrc3BhY2UiLCJvbGRCbG9jayIsIm9sZEJsb2NrRGl2IiwiaWQiLCJjbG9uZU5vZGUiLCJwYXJlbnRCbG9jayIsInBhcmVudE5vZGUiLCJhcHBlbmRDaGlsZCIsIm1hdGNoIiwiZmllbGRWYWx1ZSIsImlubmVySFRNTCIsImZpcnN0Q2hpbGQiLCJyZW1vdmUiLCJhcHBlbmQiLCJjcmVhdGUiLCJtb2RlbERhdGEiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBQUEsT0FBTyxVQUFDQyxPQUFELEVBQWE7QUFDbEIsTUFB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LFdBQXJCOztBQUVqQjtBQUNBLGtCQUFJTCxZQUFZQyxFQUFaLENBQWVLLEtBQWYsQ0FBcUIsVUFBckIsQ0FBSixFQUFzQztBQUNwQyxvQkFBSUMsYUFBYVIsU0FBU0Ysb0JBQVQsQ0FBOEIsT0FBOUIsRUFBdUMsV0FBdkMsRUFBb0RXLFNBQXJFO0FBQ0F0Qix5QkFBU1csb0JBQVQsQ0FBOEIsT0FBOUIsRUFBdUMsV0FBdkMsRUFBb0RXLFNBQXBELEdBQWdFRCxVQUFoRTtBQUNEOztBQUVESiwwQkFBWU0sVUFBWixDQUF1QkMsTUFBdkI7QUFDQVAsMEJBQVlRLE1BQVosQ0FBbUJ6QixRQUFuQjtBQUNEO0FBQ0Y7QUFDRCxlQUFLbEYsU0FBTCxDQUFlc0IsS0FBZjtBQUNBVCxpQkFBT0MsT0FBUCxDQUFlQyxHQUFmLENBQW1CQyxjQUFuQixDQUFrQ0MsVUFBbEMsRUFBOEMsS0FBS2pCLFNBQW5EO0FBQ0EsZUFBS0EsU0FBTCxDQUFleUYsaUJBQWYsQ0FBaUMsS0FBS3BFLGtCQUF0QztBQUNEOztBQUVQOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBeUJLO0FBaFllOztBQUFBO0FBQUEsSUFTWTNDLFNBVFo7O0FBb1lsQkcsa0JBQWdCK0gsTUFBaEIsR0FBeUIsWUFBZTtBQUFBLFFBQWQvRSxJQUFjLHVFQUFQLEVBQU87O0FBQ3RDLFdBQU8sSUFBSWhELGVBQUosQ0FBb0IsRUFBRWdJLFdBQVdoRixJQUFiLEVBQXBCLENBQVA7QUFDRCxHQUZEOztBQUlBLFNBQU9oRCxlQUFQO0FBQ0QsQ0F6WUQiLCJmaWxlIjoibW9kdWxlL2V1Z2xlbmEvbW9kZWxfYmxvY2tseS9ibG9ja2x5dGFiL3RhYi5qcyIsInNvdXJjZXNDb250ZW50IjpbImRlZmluZSgocmVxdWlyZSkgPT4ge1xuICBjb25zdCBVdGlscyA9IHJlcXVpcmUoJ2NvcmUvdXRpbC91dGlscycpLFxuICAgIEdsb2JhbHMgPSByZXF1aXJlKCdjb3JlL21vZGVsL2dsb2JhbHMnKSxcbiAgICBITSA9IHJlcXVpcmUoJ2NvcmUvZXZlbnQvaG9va19tYW5hZ2VyJyk7XG5cbiAgY29uc3QgQ29tcG9uZW50ID0gcmVxdWlyZSgnY29yZS9jb21wb25lbnQvY29tcG9uZW50JyksXG4gICAgTW9kZWwgPSByZXF1aXJlKCcuL21vZGVsJyksXG4gICAgVmlldyA9IHJlcXVpcmUoJy4vdmlldycpO1xuXG4gIGNsYXNzIE1vZGVsaW5nRGF0YVRhYiBleHRlbmRzIENvbXBvbmVudCB7XG4gICAgY29uc3RydWN0b3Ioc2V0dGluZ3MgPSB7fSkge1xuICAgICAgc2V0dGluZ3MubW9kZWxDbGFzcyA9IHNldHRpbmdzLm1vZGVsQ2xhc3MgfHwgTW9kZWw7XG4gICAgICBzZXR0aW5ncy52aWV3Q2xhc3MgPSBzZXR0aW5ncy52aWV3Q2xhc3MgfHwgVmlldztcbiAgICAgIHN1cGVyKHNldHRpbmdzKTtcbiAgICAgIFV0aWxzLmJpbmRNZXRob2RzKHRoaXMsIFsnX29uVG9nZ2xlUmVxdWVzdCcsICdfb25SZXN1bHRUb2dnbGVSZXF1ZXN0JywgJ19vbkNsZWFyQWxsUmVxdWVzdCcsICdfb25DbGVhclJlcXVlc3QnLCAnX29uUGhhc2VDaGFuZ2UnLFxuICAgICAgJ3RvZ2dsZUJsb2NrbHlFdmVudCcsICdfb25CbG9ja2x5TG9hZCcsICdfbGlzdGVuQmxvY2tseUV2ZW50cycsJ19vbkRpc2FibGVSZXF1ZXN0JywnX29uRW5hYmxlUmVxdWVzdCcsJ19vbkJvZHlDaGFuZ2UnLCdfdXBkYXRlVG9vbGJveCddKVxuXG4gICAgICBHbG9iYWxzLnNldCgnYmxvY2tseUxvYWRlZCcsZmFsc2UpO1xuXG4gICAgICBpZiAoIShHbG9iYWxzLmdldCgnQXBwQ29uZmlnLnN5c3RlbS5leHBNb2RlbE1vZGFsaXR5Jyk9PT0nanVzdGJvZHknKSkge1xuICAgICAgICBHbG9iYWxzLmdldCgnUmVsYXknKS5hZGRFdmVudExpc3RlbmVyKCdNb2RlbGluZ1RhYi5Ub2dnbGVSZXF1ZXN0JywgdGhpcy5fb25Ub2dnbGVSZXF1ZXN0KVxuICAgICAgICBHbG9iYWxzLmdldCgnUmVsYXknKS5hZGRFdmVudExpc3RlbmVyKCdUYWIuQ2hhbmdlJywgdGhpcy5fb25Ub2dnbGVSZXF1ZXN0KVxuICAgICAgfVxuXG4gICAgICBHbG9iYWxzLmdldCgnUmVsYXknKS5hZGRFdmVudExpc3RlbmVyKCdBcHBQaGFzZS5DaGFuZ2UnLCB0aGlzLl9vblBoYXNlQ2hhbmdlKVxuICAgICAgR2xvYmFscy5nZXQoJ1JlbGF5JykuYWRkRXZlbnRMaXN0ZW5lcignQmxvY2tseS5Mb2FkJywgdGhpcy5fb25CbG9ja2x5TG9hZClcblxuICAgICAgR2xvYmFscy5nZXQoJ1JlbGF5JykuYWRkRXZlbnRMaXN0ZW5lcignTm90aWZpY2F0aW9ucy5SZW1vdmUnLHRoaXMuX2xpc3RlbkJsb2NrbHlFdmVudHMpXG4gICAgICBHbG9iYWxzLmdldCgnUmVsYXknKS5hZGRFdmVudExpc3RlbmVyKCdNb2RlbGluZ1RhYi5UcmFuc2l0aW9uRW5kJyx0aGlzLl9saXN0ZW5CbG9ja2x5RXZlbnRzKVxuXG4gICAgICBHbG9iYWxzLmdldCgnUmVsYXknKS5hZGRFdmVudExpc3RlbmVyKCdOb3RpZmljYXRpb25zLkFkZCcsdGhpcy5fb25EaXNhYmxlUmVxdWVzdCk7XG4gICAgICBHbG9iYWxzLmdldCgnUmVsYXknKS5hZGRFdmVudExpc3RlbmVyKCdOb3RpZmljYXRpb25zLlJlbW92ZScsdGhpcy5fb25FbmFibGVSZXF1ZXN0KTtcblxuICAgICAgR2xvYmFscy5nZXQoJ1JlbGF5JykuYWRkRXZlbnRMaXN0ZW5lcignQm9keS5DaGFuZ2UnLCB0aGlzLl9vbkJvZHlDaGFuZ2UpO1xuICAgICAgR2xvYmFscy5nZXQoJ1JlbGF5JykuYWRkRXZlbnRMaXN0ZW5lcignVG9vbGJveC5VcGRhdGUnLHRoaXMuX3VwZGF0ZVRvb2xib3gpO1xuXG5cbiAgICB9XG5cbiAgICBfb25EaXNhYmxlUmVxdWVzdChldnQpe1xuICAgICAgdGhpcy52aWV3KCkuZGlzYWJsZSgpO1xuICAgICAgdGhpcy53b3Jrc3BhY2Uub3B0aW9ucy5yZWFkT25seSA9IHRydWU7XG4gICAgICB0aGlzLndvcmtzcGFjZS5vcHRpb25zLm1heEJsb2NrcyA9IDA7XG4gICAgfVxuXG4gICAgX29uRW5hYmxlUmVxdWVzdChldnQpe1xuICAgICAgaWYgKEdsb2JhbHMuZ2V0KCdBcHBDb25maWcuc3lzdGVtLm1vZGVsTW9kYWxpdHknKSA9PT0gJ2NyZWF0ZScpIHtcbiAgICAgICAgdGhpcy52aWV3KCkuZW5hYmxlKCk7XG4gICAgICAgIHRoaXMud29ya3NwYWNlLm9wdGlvbnMucmVhZE9ubHkgPSBmYWxzZTtcbiAgICAgICAgdGhpcy53b3Jrc3BhY2Uub3B0aW9ucy5tYXhCbG9ja3MgPSA1MDtcbiAgICAgIH0gZWxzZSBpZiAoR2xvYmFscy5nZXQoJ0FwcENvbmZpZy5zeXN0ZW0ubW9kZWxNb2RhbGl0eScpID09PSAnZXhwbG9yZScpIHtcbiAgICAgICAgdGhpcy52aWV3KCkuZW5hYmxlKCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaGlkZSgpIHtcbiAgICAgIHRoaXMudmlldygpLmhpZGUoKTtcbiAgICB9XG5cbiAgICBzaG93KCkge1xuICAgICAgdGhpcy52aWV3KCkuc2hvdygpO1xuICAgIH1cblxuICAgIF9vblRvZ2dsZVJlcXVlc3QoZXZ0KSB7XG4gICAgICAvLyBSZWxvYWQgdGhlIGJsb2NrcyBvbmNlIHRvZ2dsZWQsIHRvIHByZXZlbnQgdGhlbSBmcm9tIGJlaW5nIHNtdXNoZWRcbiAgICAgIGlmICghdGhpcy5fbW9kZWwuZ2V0KCdvcGVuJykpIHtcbiAgICAgICAgaWYgKCF0aGlzLndvcmtzcGFjZS5nZXRBbGxCbG9ja3MoKS5sZW5ndGgpIHtcbiAgICAgICAgICB2YXIgZGVmYXVsdFdvcmtzcGFjZUJsb2NrcyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiZGVmYXVsdFdvcmtzcGFjZUJsb2Nrc1wiKTtcbiAgICAgICAgICB3aW5kb3cuQmxvY2tseS5YbWwuZG9tVG9Xb3Jrc3BhY2UoZGVmYXVsdFdvcmtzcGFjZUJsb2NrcywgdGhpcy53b3Jrc3BhY2UpO1xuXG4gICAgICAgICAgLy8gbGV0IG9uZUV5ZURpdiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwib25lLWV5ZVwiKTtcbiAgICAgICAgICAvLyBsZXQgdHdvRXllRGl2ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJ0d28tZXllc1wiKTtcbiAgICAgICAgICAvL1xuICAgICAgICAgIC8vIGlmIChvbmVFeWVEaXYgJiYgdHdvRXllRGl2KSB7IC8vIFdpbGwgbm90IGFjdGl2YXRlIG9uIGluaXRpYWwgbG9hZGluZyBvZiBwYWdlXG4gICAgICAgICAgLy8gICBpZiAodGhpcy5fbnVtU2Vuc29ycyA9PT0gMSkge1xuICAgICAgICAgIC8vICAgICBvbmVFeWVEaXYuc3R5bGUuZGlzcGxheT0nYmxvY2snO1xuICAgICAgICAgIC8vICAgICB0d29FeWVEaXYuc3R5bGUuZGlzcGxheT0nbm9uZSc7XG4gICAgICAgICAgLy8gICB9IGVsc2Uge1xuICAgICAgICAgIC8vICAgICBvbmVFeWVEaXYuc3R5bGUuZGlzcGxheT0nbm9uZSc7XG4gICAgICAgICAgLy8gICAgIHR3b0V5ZURpdi5zdHlsZS5kaXNwbGF5PSdibG9jayc7XG4gICAgICAgICAgLy8gICB9XG4gICAgICAgICAgLy8gfVxuXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdmFyIGJsb2NrbHlYbWwgPSB3aW5kb3cuQmxvY2tseS5YbWwud29ya3NwYWNlVG9Eb20od2luZG93LkJsb2NrbHkuZ2V0TWFpbldvcmtzcGFjZSgpKTtcbiAgICAgICAgICB0aGlzLndvcmtzcGFjZS5yZW1vdmVDaGFuZ2VMaXN0ZW5lcih0aGlzLnRvZ2dsZUJsb2NrbHlFdmVudCk7XG4gICAgICAgICAgdGhpcy53b3Jrc3BhY2UuY2xlYXIoKTtcbiAgICAgICAgICB3aW5kb3cuQmxvY2tseS5YbWwuZG9tVG9Xb3Jrc3BhY2UoYmxvY2tseVhtbCwgdGhpcy53b3Jrc3BhY2UpO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGlmIChldnQubmFtZSA9PSAnTW9kZWxpbmdUYWIuVG9nZ2xlUmVxdWVzdCcpIHtcbiAgICAgICAgdGhpcy5fbW9kZWwudG9nZ2xlKCk7XG4gICAgICAgIHRoaXMuX3ZpZXcudG9nZ2xlKHRoaXMuX21vZGVsLmdldCgnb3BlbicpKTtcblxuICAgICAgICBHbG9iYWxzLmdldCgnTG9nZ2VyJykubG9nKHtcbiAgICAgICAgICB0eXBlOiB0aGlzLl9tb2RlbC5nZXQoJ29wZW4nKSA/ICdvcGVuJyA6ICdjbG9zZScsXG4gICAgICAgICAgY2F0ZWdvcnk6ICdtb2RlbGluZycsXG4gICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgZGlzcGxheVN0YXRlOiB0aGlzLl9tb2RlbC5nZXREaXNwbGF5U3RhdGUoKSxcbiAgICAgICAgICAgIHZpc3VhbGl6YXRpb246ICcnLy90aGlzLnZpZXcoKS5nZXRDdXJyZW50VmlzdWFsaXphdGlvbigpXG4gICAgICAgICAgfVxuICAgICAgICB9KVxuICAgICAgfSBlbHNlIGlmIChldnQuZGF0YS50YWJUeXBlID09ICdibG9ja2x5Jykge1xuICAgICAgICB0aGlzLl9tb2RlbC50b2dnbGUoKTtcbiAgICAgICAgdGhpcy5fdmlldy50b2dnbGUodGhpcy5fbW9kZWwuZ2V0KCdvcGVuJykpO1xuICAgICAgfSBlbHNlIGlmICh0aGlzLl9tb2RlbC5nZXQoJ29wZW4nKSkge1xuICAgICAgICB0aGlzLl9tb2RlbC50b2dnbGUoKTtcbiAgICAgICAgdGhpcy5fdmlldy50b2dnbGUodGhpcy5fbW9kZWwuZ2V0KCdvcGVuJykpO1xuICAgICAgfVxuICAgIH1cblxuICAgIF9vblJlc3VsdFRvZ2dsZVJlcXVlc3QoZXZ0KSB7XG4gICAgICAvL3RoaXMuX21vZGVsLnRvZ2dsZVJlc3VsdChldnQuZGF0YS5yZXN1bHRJZCk7XG4gICAgICBHbG9iYWxzLmdldCgnTG9nZ2VyJykubG9nKHtcbiAgICAgICAgdHlwZTogJ3Jlc3VsdF90b2dnbGUnLFxuICAgICAgICBjYXRlZ29yeTogJ21vZGVsaW5nJyxcbiAgICAgICAgZGF0YToge1xuICAgICAgICAgIGRpc3BsYXlTdGF0ZTogdGhpcy5fbW9kZWwuZ2V0RGlzcGxheVN0YXRlKCksXG4gICAgICAgICAgdmlzdWFsaXphdGlvbjogJycvL3RoaXMudmlldygpLmdldEN1cnJlbnRWaXN1YWxpemF0aW9uKClcbiAgICAgICAgfVxuICAgICAgfSlcbiAgICB9XG5cbiAgICBfb25DbGVhclJlcXVlc3QoZXZ0KSB7XG4gICAgICAvL3RoaXMuX21vZGVsLmNsZWFyUmVzdWx0KGV2dC5kYXRhLnJlc3VsdElkKTtcbiAgICAgIEdsb2JhbHMuZ2V0KCdMb2dnZXInKS5sb2coe1xuICAgICAgICB0eXBlOiAncmVtb3ZlX2RhdGEnLFxuICAgICAgICBjYXRlZ29yeTogJ21vZGVsaW5nJyxcbiAgICAgICAgZGF0YToge1xuICAgICAgICAgIHJlc3VsdElkOiBldnQuZGF0YS5yZXN1bHRJZCxcbiAgICAgICAgICBkaXNwbGF5U3RhdGU6IHRoaXMuX21vZGVsLmdldERpc3BsYXlTdGF0ZSgpLFxuICAgICAgICAgIHZpc3VhbGl6YXRpb246ICcnLy90aGlzLnZpZXcoKS5nZXRDdXJyZW50VmlzdWFsaXphdGlvbigpXG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgfVxuXG4gICAgX29uQ2xlYXJBbGxSZXF1ZXN0KGV2dCkge1xuICAgICAgLy90aGlzLl9tb2RlbC5jbGVhclJlc3VsdEdyb3VwKGV2dC5kYXRhLmV4cGVyaW1lbnRJZCk7XG4gICAgICBHbG9iYWxzLmdldCgnTG9nZ2VyJykubG9nKHtcbiAgICAgICAgdHlwZTogJ3JlbW92ZV9ncm91cCcsXG4gICAgICAgIGNhdGVnb3J5OiAnbW9kZWxpbmcnLFxuICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgZXhwZXJpbWVudElkOiBldnQuZGF0YS5leHBlcmltZW50SWQsXG4gICAgICAgICAgZGlzcGxheVN0YXRlOiB0aGlzLl9tb2RlbC5nZXREaXNwbGF5U3RhdGUoKSxcbiAgICAgICAgICB2aXN1YWxpemF0aW9uOiAnJy8vdGhpcy52aWV3KCkuZ2V0Q3VycmVudFZpc3VhbGl6YXRpb24oKVxuICAgICAgICB9XG4gICAgICB9KVxuICAgIH1cblxuXG4gICAgX29uUGhhc2VDaGFuZ2UoZXZ0KSB7XG4gICAgICBpZiAoZXZ0LmRhdGEucGhhc2UgPT0gXCJsb2dpblwiIHx8IGV2dC5kYXRhLnBoYXNlID09IFwibG9naW5fYXR0ZW1wdGVkXCIpIHtcbiAgICAgICAgaWYgKCFHbG9iYWxzLmdldCgnYmxvY2tseUxvYWRlZCcpKSB7XG5cbiAgICAgICAgICB2YXIgYmxvY2tseU9wdGlvbnMgPSB7XG4gICAgICAgICAgICB0b29sYm94IDogZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3Rvb2xib3gnKSxcbiAgICAgICAgICAgIGNvbGxhcHNlIDogdHJ1ZSxcbiAgICAgICAgICAgIGNvbW1lbnRzIDogdHJ1ZSxcbiAgICAgICAgICAgIGRpc2FibGUgOiB0cnVlLFxuICAgICAgICAgICAgbWF4QmxvY2tzIDogSW5maW5pdHksXG4gICAgICAgICAgICB0cmFzaGNhbiA6IHRydWUsXG4gICAgICAgICAgICBob3Jpem9udGFsTGF5b3V0IDogdHJ1ZSxcbiAgICAgICAgICAgIHRvb2xib3hQb3NpdGlvbiA6ICdzdGFydCcsXG4gICAgICAgICAgICBjc3MgOiB0cnVlLFxuICAgICAgICAgICAgbWVkaWEgOiAnaHR0cHM6Ly9ibG9ja2x5LWRlbW8uYXBwc3BvdC5jb20vc3RhdGljL21lZGlhLycsXG4gICAgICAgICAgICBydGwgOiBmYWxzZSxcbiAgICAgICAgICAgIHNjcm9sbGJhcnMgOiB0cnVlLFxuICAgICAgICAgICAgc291bmRzIDogdHJ1ZSxcbiAgICAgICAgICAgIG9uZUJhc2VkSW5kZXggOiB0cnVlXG4gICAgICAgICAgfTtcblxuICAgICAgICAgIHRoaXMud29ya3NwYWNlID0gd2luZG93LkJsb2NrbHkuaW5qZWN0KGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdCbG9ja2x5RGl2JyksIGJsb2NrbHlPcHRpb25zKTtcblxuICAgICAgICAgIHZhciB0b29sYm94X3Njcm9sbGJhcnMgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCdibG9ja2x5U2Nyb2xsYmFySGFuZGxlJyk7XG4gICAgICAgICAgZm9yIChsZXQgaWR4PTA7aWR4PHRvb2xib3hfc2Nyb2xsYmFycy5sZW5ndGg7aWR4KyspIHtcbiAgICAgICAgICAgIHRvb2xib3hfc2Nyb2xsYmFyc1tpZHhdLnN0eWxlLmZpbGw9J2dyZXknO1xuICAgICAgICAgIH1cblxuXG4gICAgICAgICAgR2xvYmFscy5zZXQoJ2Jsb2NrbHlMb2FkZWQnLHRydWUpO1xuXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICBfdXBkYXRlVG9vbGJveChibG9ja190eXBlKSB7XG4gICAgICAgIHZhciBjb3VudGVyID0gMDtcbiAgICAgICAgdGhpcy53b3Jrc3BhY2UuZ2V0QWxsQmxvY2tzKCkuZm9yRWFjaChibG9jayA9PiB7XG4gICAgICAgICAgaWYgKGJsb2NrLnR5cGUgPT09IGJsb2NrX3R5cGUpIHsgY291bnRlciArPSAxOyB9XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHZhciBibG9ja0RpdiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGJsb2NrX3R5cGUpO1xuICAgICAgICBpZiAoU3RyaW5nKGNvdW50ZXIpID49IGJsb2NrRGl2LmdldEF0dHJpYnV0ZSgnbWF4X3VzZScpKSB7XG4gICAgICAgICAgYmxvY2tEaXYuc2V0QXR0cmlidXRlKCdkaXNhYmxlZCcsdHJ1ZSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgYmxvY2tEaXYuc2V0QXR0cmlidXRlKCdkaXNhYmxlZCcsZmFsc2UpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgdG9nZ2xlQmxvY2tseUV2ZW50KGV2dCkge1xuICAgICAgaWYgKGV2dC50eXBlICE9ICd1aScpIHtcbiAgICAgICAgR2xvYmFscy5nZXQoJ1JlbGF5JykuZGlzcGF0Y2hFdmVudCgnQmxvY2tseS5DaGFuZ2VkJywge2Jsb2NrbHlFdnQ6IGV2dCwgbW9kZWxUeXBlOiAnYmxvY2tseSd9KTtcbiAgICAgIH1cblxuICAgICAgLy8gQ2hlY2sgd2hldGhlciBhIGJsb2NrIHdpdGggbWF4X3VzZSBvZiAxIGhhcyBiZWVuIGNyZWF0ZWQgcmVzcCBkZWxldGVkLCBhbmQgZGlzYWJsZSByZXNwIGVuYWJsZS5cbiAgICAgIGlmIChldnQudHlwZSA9PSAnY3JlYXRlJykge1xuICAgICAgICB2YXIgbW9kaWZ5X2Jsb2NrID0gdHJ1ZTtcbiAgICAgICAgQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoJChkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZGVmYXVsdFdvcmtzcGFjZUJsb2NrcycpKS5maW5kKCdibG9jaycpKS5tYXAoYmxvY2sgPT4ge1xuICAgICAgICAgIGlmKGJsb2NrLmdldEF0dHJpYnV0ZSgndHlwZScpID09PSB0aGlzLndvcmtzcGFjZS5nZXRCbG9ja0J5SWQoZXZ0LmJsb2NrSWQpLnR5cGUpIG1vZGlmeV9ibG9jayA9IGZhbHNlO1xuICAgICAgICB9KTtcblxuICAgICAgICAvLyBNYW5pcHVsYXRlIHRoZSB0b29sYm94IGFjY29yZGluZyB0byB3aGljaCBlbGVtZW50cyBoYXZlIG1heF91c2UgYW5kIHdoaWNoIG9uZXMgbm90LlxuICAgICAgICBpZiAobW9kaWZ5X2Jsb2NrKSB7XG4gICAgICAgICAgdmFyIGJsb2NrX3R5cGUgPSB0aGlzLndvcmtzcGFjZS5nZXRCbG9ja0J5SWQoZXZ0LmJsb2NrSWQpLnR5cGU7XG4gICAgICAgICAgdGhpcy5fdXBkYXRlVG9vbGJveChibG9ja190eXBlKTtcblxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIC8vIFRoZW4gY2hlY2sgaWYgYSBibG9jayBoYXMgYmVlbiBkZWxldGVkIHRoYXQgaGFzIGEgbWF4X3VzZSBvZiAxLlxuICAgICAgaWYgKGV2dC50eXBlID09ICdkZWxldGUnKSB7XG4gICAgICAgIHZhciBibG9ja190eXBlID0gZXZ0Lm9sZFhtbC5nZXRBdHRyaWJ1dGUoJ3R5cGUnKTtcbiAgICAgICAgdGhpcy5fdXBkYXRlVG9vbGJveChibG9ja190eXBlKTtcbiAgICAgIH1cblxuICAgICAgaWYoZXZ0LnR5cGUgPT0gJ21vdmUnKSB7XG4gICAgICAgIGlmIChbJ2VpdGhlcl93YXknLCdub19saWdodCcsJ3NlZV9saWdodCddLmluZGV4T2YoZXZ0LmJsb2NrSWQpID4gLTEpIHtcblxuICAgICAgICAgIHZhciBuZXdQYXJlbnQgPSBldnQubmV3UGFyZW50SWQ7XG4gICAgICAgICAgdmFyIG5ld0Jsb2NrID0gdGhpcy53b3Jrc3BhY2UuZ2V0QmxvY2tCeUlkKG5ld1BhcmVudCk7XG4gICAgICAgICAgaWYgKFsnbWFzdGVyX2Jsb2NrJywnZWl0aGVyX3dheScsJ25vX2xpZ2h0Jywnc2VlX2xpZ2h0J10uaW5kZXhPZihuZXdQYXJlbnQpID09PSAtMSkge1xuICAgICAgICAgICAgbmV3QmxvY2suZGlzcG9zZSh0cnVlKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgLy9kb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCdbdHlwZT1tb3ZlX2NoYW5nZV0nKVswXS5zZXRBdHRyaWJ1dGUoJ2Rpc2FibGVkJyx0cnVlKVxuICAgICAgLy9kb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCdbdHlwZT1tb3ZlX2NoYW5nZV0nKVswXS5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJ1t0eXBlPW1vdmVfY2hhbmdlXScpWzBdKVxuXG4gICAgICAvLyAqKioqKioqKiogcGFyc2UgdGhlIGNvZGUgZm9yIGVycm9ycyAqKioqKioqKipcbiAgICAgIC8vIFNlbmQgYWxlcnRzXG5cblxuICAgIH1cblxuICAgIF9vbkJsb2NrbHlMb2FkKGV2dCkge1xuICAgICAgLy9sZXQgd29ya3NwYWNlID0gd2luZG93LkJsb2NrbHkuZ2V0TWFpbldvcmtzcGFjZSgpO1xuXG4gICAgICBpZiAoIXRoaXMud29ya3NwYWNlKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcIkJsb2NrbHkgd29ya3NwYWNlIGRvZXMgbm90IGV4aXN0LlwiKTtcbiAgICAgIH1cbiAgICAgIHRoaXMud29ya3NwYWNlLnJlbW92ZUNoYW5nZUxpc3RlbmVyKHRoaXMudG9nZ2xlQmxvY2tseUV2ZW50KTtcbiAgICAgIHRoaXMud29ya3NwYWNlLmNsZWFyKCk7XG5cbiAgICAgIGlmIChldnQuZGF0YSkge1xuICAgICAgICAvL2NvbnN0IGJsb2NrbHlYbWwgPSB3aW5kb3cuWG1sLnRleHRUb0RvbShldnQuZGF0YSlcbiAgICAgICAgY29uc3QgYmxvY2tseVhtbCA9ICQucGFyc2VYTUwoZXZ0LmRhdGEpLmRvY3VtZW50RWxlbWVudDtcbiAgICAgICAgd2luZG93LkJsb2NrbHkuWG1sLmRvbVRvV29ya3NwYWNlKGJsb2NrbHlYbWwsIHRoaXMud29ya3NwYWNlKTsvLy50aGVuKCgpID0+IHtjb25zb2xlLmxvZygnaGVyZScpfSk7XG5cbiAgICAgICAgY29uc3QgcHJlc2VudEJsb2NrcyA9IHRoaXMud29ya3NwYWNlLmdldEFsbEJsb2NrcygpO1xuICAgICAgICBwcmVzZW50QmxvY2tzLm1hcChibG9jayA9PiB7XG4gICAgICAgICAgdGhpcy5fdXBkYXRlVG9vbGJveChibG9jay50eXBlKTtcblxuICAgICAgICAgIC8vIHZhciBibG9ja0RpdiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGJsb2NrLnR5cGUpO1xuICAgICAgICAgIC8vIGlmIChibG9ja0Rpdikge1xuICAgICAgICAgIC8vICAgaWYgKGJsb2NrRGl2LmdldEF0dHJpYnV0ZSgnbWF4X3VzZScpID09PSAnMScpIHtcbiAgICAgICAgICAvLyAgICAgYmxvY2tEaXYuc2V0QXR0cmlidXRlKCdkaXNhYmxlZCcsdHJ1ZSk7XG4gICAgICAgICAgLy8gICB9XG4gICAgICAgICAgLy8gfVxuICAgICAgICB9KTtcbiAgICAgIH1cblxuICAgICAgaWYgKCF0aGlzLndvcmtzcGFjZS5nZXRBbGxCbG9ja3MoKS5sZW5ndGgpIHtcbiAgICAgICAgdmFyIGRlZmF1bHRXb3Jrc3BhY2VCbG9ja3MgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImRlZmF1bHRXb3Jrc3BhY2VCbG9ja3NcIik7XG4gICAgICAgIHdpbmRvdy5CbG9ja2x5LlhtbC5kb21Ub1dvcmtzcGFjZShkZWZhdWx0V29ya3NwYWNlQmxvY2tzLCB0aGlzLndvcmtzcGFjZSk7XG4gICAgICB9XG5cbiAgICB9XG5cbiAgICBfbGlzdGVuQmxvY2tseUV2ZW50cyhldnQpIHtcbiAgICAgIGlmIChldnQuZGF0YS50eXBlPT09ICdtb2RlbCcgJiYgIXRoaXMud29ya3NwYWNlLmxpc3RlbmVyc18ubGVuZ3RoKSB7XG4gICAgICAgIHRoaXMud29ya3NwYWNlLmFkZENoYW5nZUxpc3RlbmVyKHRoaXMudG9nZ2xlQmxvY2tseUV2ZW50KTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBfb25Cb2R5Q2hhbmdlKGV2dCkge1xuICAgICAgLy92YXIgdG9vbGJveGVsZW0gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInRvb2xib3hcIilcbiAgICAgIC8vdGhpcy53b3Jrc3BhY2UudXBkYXRlVG9vbGJveCh0b29sYm94ZWxlbSlcblxuICAgICAgdGhpcy5fbnVtU2Vuc29ycyA9IGV2dC5kYXRhLm51bVNlbnNvcnM7XG5cbiAgICAgIC8vIEhpZGUgb3IgZGlzYWJsZSBibG9ja3MgaW4gdGhlIHRvb2xib3ggdGhhdCBkbyBub3QgY29ycmVzcG9uZCB0byB0aGUgbnVtYmVyIG9mIHNlbnNvclBvc2l0aW9uXG4gICAgICB2YXIgYmxvY2tzSW5Ub29sYm94ID0gdG9vbGJveC5nZXRFbGVtZW50c0J5VGFnTmFtZSgnYmxvY2snKTtcbiAgICAgIGZvciAodmFyIGlkeCA9IDA7IGlkeCA8IGJsb2Nrc0luVG9vbGJveC5sZW5ndGg7IGlkeCsrKSB7XG4gICAgICAgIGxldCBibG9jayA9IGJsb2Nrc0luVG9vbGJveFtpZHhdO1xuXG4gICAgICAgIGxldCBudW1TZW5zb3JzID0gbnVsbDtcbiAgICAgICAgc3dpdGNoKGJsb2NrLmdldEF0dHJpYnV0ZSgnc2Vuc29ycycpKSB7XG4gICAgICAgICAgY2FzZSAnb25lJzpcbiAgICAgICAgICAgIG51bVNlbnNvcnMgPSAxO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIGNhc2UgJ3R3byc6XG4gICAgICAgICAgICBudW1TZW5zb3JzID0gMjtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChudW1TZW5zb3JzICYmIChTdHJpbmcobnVtU2Vuc29ycykgIT0gZXZ0LmRhdGEubnVtU2Vuc29ycykpIHtcbiAgICAgICAgICBibG9jay5zZXRBdHRyaWJ1dGUoJ2Rpc2FibGVkJyx0cnVlKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBibG9jay5zZXRBdHRyaWJ1dGUoJ2Rpc2FibGVkJyxmYWxzZSk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgLy8gbGV0IG9uZUV5ZURpdiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwib25lLWV5ZVwiKTtcbiAgICAgIC8vIGxldCB0d29FeWVEaXYgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInR3by1leWVzXCIpO1xuICAgICAgLy9cbiAgICAgIC8vIGlmIChvbmVFeWVEaXYgJiYgdHdvRXllRGl2KSB7IC8vIFdpbGwgbm90IGFjdGl2YXRlIG9uIGluaXRpYWwgbG9hZGluZyBvZiBwYWdlXG4gICAgICAvLyAgIGlmIChldnQuZGF0YS5udW1TZW5zb3JzID09PSAxKSB7XG4gICAgICAvLyAgICAgb25lRXllRGl2LnN0eWxlLmRpc3BsYXk9J2Jsb2NrJztcbiAgICAgIC8vICAgICB0d29FeWVEaXYuc3R5bGUuZGlzcGxheT0nbm9uZSc7XG4gICAgICAvLyAgIH0gZWxzZSB7XG4gICAgICAvLyAgICAgb25lRXllRGl2LnN0eWxlLmRpc3BsYXk9J25vbmUnO1xuICAgICAgLy8gICAgIHR3b0V5ZURpdi5zdHlsZS5kaXNwbGF5PSdibG9jayc7XG4gICAgICAvLyAgIH1cbiAgICAgIC8vIH1cblxuICAgICAgLy8gUmVwbGFjZSBibG9ja3MgaW4gdGhlIHdvcmtzcGFjZSB0aGF0IGRvIG5vdCBjb3JyZXNwb25kIHRvIHRoZSBudW1iZXIgb2Ygc2Vuc29ycyB3aXRoIG9uZXMgdGhhdCBkbywgd2hlcmUgcG9zc2libGUuXG4gICAgICAvLyBJbiBwYXJ0aWN1bGFyOiB0dXJuX2F0XzFzZW5zb3Igb3IgdHVybl9hdF8xc2Vuc29yX2V5ZXNwb3QgdnMgdHVybl9hdF8yc2Vuc29yc1xuICAgICAgLy8gVXNlIHRoZSBhdHRyaWJ1dGUgJ2VxdWl2YWxlbmNlJyBvZiB0aGUgZGl2cyB0byByZXBsYWNlIHRoZSBibG9ja3NcbiAgICAgIGlmICh0aGlzLndvcmtzcGFjZSkge1xuICAgICAgICB0aGlzLndvcmtzcGFjZS5yZW1vdmVDaGFuZ2VMaXN0ZW5lcih0aGlzLnRvZ2dsZUJsb2NrbHlFdmVudCk7XG5cbiAgICAgICAgdmFyIGJsb2NrbHlYbWwgPSB3aW5kb3cuQmxvY2tseS5YbWwud29ya3NwYWNlVG9Eb20od2luZG93LkJsb2NrbHkuZ2V0TWFpbldvcmtzcGFjZSgpKTtcbiAgICAgICAgdmFyIGJsb2Nrc0luV29ya3NwYWNlID0gYmxvY2tseVhtbC5nZXRFbGVtZW50c0J5VGFnTmFtZSgnYmxvY2snKVxuICAgICAgICBmb3IgKHZhciBpZHggPSAwOyBpZHggPCBibG9ja3NJbldvcmtzcGFjZS5sZW5ndGg7IGlkeCsrKSB7XG4gICAgICAgICAgbGV0IG9sZEJsb2NrID0gYmxvY2tzSW5Xb3Jrc3BhY2VbaWR4XTtcbiAgICAgICAgICBsZXQgb2xkQmxvY2tEaXYgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChvbGRCbG9jay5pZClcbiAgICAgICAgICBpZiAob2xkQmxvY2tEaXYuZ2V0QXR0cmlidXRlKCdlcXVpdmFsZW5jZScpKSB7XG4gICAgICAgICAgICBsZXQgbmV3QmxvY2sgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChvbGRCbG9ja0Rpdi5nZXRBdHRyaWJ1dGUoJ2VxdWl2YWxlbmNlJykpLmNsb25lTm9kZSh0cnVlKTtcbiAgICAgICAgICAgIGxldCBwYXJlbnRCbG9jayA9IG9sZEJsb2NrLnBhcmVudE5vZGU7XG4gICAgICAgICAgICBsZXQgYXBwZW5kQ2hpbGQgPSBvbGRCbG9jay5nZXRFbGVtZW50c0J5VGFnTmFtZSgnbmV4dCcpLmxlbmd0aCA/IG9sZEJsb2NrLmdldEVsZW1lbnRzQnlUYWdOYW1lKCduZXh0JylbMF0gOiBudWxsO1xuICAgICAgICAgICAgaWYgKGFwcGVuZENoaWxkKSBuZXdCbG9jay5hcHBlbmRDaGlsZChhcHBlbmRDaGlsZCk7XG5cbiAgICAgICAgICAgIC8vIFJlcGxhY2UgdGhlIGZpZWxkIHZhbHVlcyB3aGVyZSBwb3NzaWJsZVxuICAgICAgICAgICAgaWYgKG9sZEJsb2NrRGl2LmlkLm1hdGNoKCd0dXJuX2F0XycpKSB7XG4gICAgICAgICAgICAgIGxldCBmaWVsZFZhbHVlID0gb2xkQmxvY2suZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ2ZpZWxkJylbJ0RJUkVDVElPTiddLmlubmVySFRNTDtcbiAgICAgICAgICAgICAgbmV3QmxvY2suZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ2ZpZWxkJylbJ0RJUkVDVElPTiddLmlubmVySFRNTCA9IGZpZWxkVmFsdWU7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHBhcmVudEJsb2NrLmZpcnN0Q2hpbGQucmVtb3ZlKCk7XG4gICAgICAgICAgICBwYXJlbnRCbG9jay5hcHBlbmQobmV3QmxvY2spO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICB0aGlzLndvcmtzcGFjZS5jbGVhcigpO1xuICAgICAgICB3aW5kb3cuQmxvY2tseS5YbWwuZG9tVG9Xb3Jrc3BhY2UoYmxvY2tseVhtbCwgdGhpcy53b3Jrc3BhY2UpO1xuICAgICAgICB0aGlzLndvcmtzcGFjZS5hZGRDaGFuZ2VMaXN0ZW5lcih0aGlzLnRvZ2dsZUJsb2NrbHlFdmVudClcbiAgICAgIH1cblxuLypcbiAgICAgICAgdGhpcy53b3Jrc3BhY2UuZ2V0QWxsQmxvY2tzKCkuZm9yRWFjaChibG9jayA9PiB7XG4gICAgICAgICAgdmFyIGJsb2NrRGl2ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoYmxvY2sudHlwZSk7XG4gICAgICAgICAgaWYgKGJsb2NrRGl2KSB7XG4gICAgICAgICAgICAvLyBDaGVjayB3aGV0aGVyIHRoZSBibG9jayBoYXMgdG8gYmUgcmVwbGFjZWRcbiAgICAgICAgICAgIGxldCBudW1TZW5zb3JzID0gbnVsbDtcbiAgICAgICAgICAgIHN3aXRjaChibG9ja0Rpdi5nZXRBdHRyaWJ1dGUoJ3NlbnNvcnMnKSkge1xuICAgICAgICAgICAgICBjYXNlICdvbmUnOlxuICAgICAgICAgICAgICAgIG51bVNlbnNvcnMgPSAxO1xuICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgY2FzZSAndHdvJzpcbiAgICAgICAgICAgICAgICBudW1TZW5zb3JzID0gMjtcbiAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChudW1TZW5zb3JzICYmIChTdHJpbmcobnVtU2Vuc29ycykgIT0gZXZ0LmRhdGEubnVtU2Vuc29ycykpIHtcbiAgICAgICAgICAgICAgaWYgKGJsb2NrRGl2LmdldEF0dHJpYnV0ZSgnZXF1aXZhbGVuY2UnKSkge1xuICAgICAgICAgICAgICAgIHZhciBuZXdCbG9ja0RpdiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGJsb2NrRGl2LmdldEF0dHJpYnV0ZSgnZXF1aXZhbGVuY2UnKSkuY2xvbmVOb2RlKHRydWUpO1xuICAgICAgICAgICAgICAgIG5ld0Jsb2NrRGl2LnNldEF0dHJpYnV0ZSgnZGlzYWJsZWQnLGZhbHNlKTtcblxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICovXG4gICAgfVxuXG4gIH1cblxuICBNb2RlbGluZ0RhdGFUYWIuY3JlYXRlID0gKGRhdGEgPSB7fSkgPT4ge1xuICAgIHJldHVybiBuZXcgTW9kZWxpbmdEYXRhVGFiKHsgbW9kZWxEYXRhOiBkYXRhIH0pXG4gIH1cblxuICByZXR1cm4gTW9kZWxpbmdEYXRhVGFiO1xufSlcbiJdfQ==
