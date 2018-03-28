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

      Utils.bindMethods(_this, ['_onToggleRequest', '_onResultToggleRequest', '_onClearAllRequest', '_onClearRequest', '_onPhaseChange', 'toggleBlocklyEvent', '_onBlocklyLoad', '_listenBlocklyEvents', '_onDisableRequest', '_onEnableRequest', '_onBodyChange']);

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
            var counter = 0;
            this.workspace.getAllBlocks().forEach(function (block) {
              if (block.type === block_type) {
                counter += 1;
              }
            });

            var blockDiv = document.getElementById(block_type);
            if (String(counter) >= blockDiv.getAttribute('max_use')) {
              blockDiv.setAttribute('disabled', true);
            }
          }
        }

        // Then check if a block has been deleted that has a max_use of 1.
        if (evt.type == 'delete') {
          var block_type = evt.oldXml.getAttribute('type');
          var counter = 0;
          this.workspace.getAllBlocks().forEach(function (block) {
            if (block.type === block_type) {
              counter += 1;
            }
          });
          var blockDiv = document.getElementById(block_type);
          if (String(counter) < blockDiv.getAttribute('max_use')) {
            blockDiv.setAttribute('disabled', false);
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

          var presentBlocks = this.workspace.getAllBlocks();
          presentBlocks.map(function (block) {
            var blockDiv = document.getElementById(block.type);
            if (blockDiv) {
              if (blockDiv.getAttribute('max_use') === '1') {
                blockDiv.setAttribute('disabled', true);
              }
            }
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9ldWdsZW5hL21vZGVsX2Jsb2NrbHkvYmxvY2tseXRhYi90YWIuanMiXSwibmFtZXMiOlsiZGVmaW5lIiwicmVxdWlyZSIsIlV0aWxzIiwiR2xvYmFscyIsIkhNIiwiQ29tcG9uZW50IiwiTW9kZWwiLCJWaWV3IiwiTW9kZWxpbmdEYXRhVGFiIiwic2V0dGluZ3MiLCJtb2RlbENsYXNzIiwidmlld0NsYXNzIiwiYmluZE1ldGhvZHMiLCJzZXQiLCJnZXQiLCJhZGRFdmVudExpc3RlbmVyIiwiX29uVG9nZ2xlUmVxdWVzdCIsIl9vblBoYXNlQ2hhbmdlIiwiX29uQmxvY2tseUxvYWQiLCJfbGlzdGVuQmxvY2tseUV2ZW50cyIsIl9vbkRpc2FibGVSZXF1ZXN0IiwiX29uRW5hYmxlUmVxdWVzdCIsIl9vbkJvZHlDaGFuZ2UiLCJldnQiLCJ2aWV3IiwiZGlzYWJsZSIsIndvcmtzcGFjZSIsIm9wdGlvbnMiLCJyZWFkT25seSIsIm1heEJsb2NrcyIsImVuYWJsZSIsImhpZGUiLCJzaG93IiwiX21vZGVsIiwiZ2V0QWxsQmxvY2tzIiwibGVuZ3RoIiwiZGVmYXVsdFdvcmtzcGFjZUJsb2NrcyIsImRvY3VtZW50IiwiZ2V0RWxlbWVudEJ5SWQiLCJ3aW5kb3ciLCJCbG9ja2x5IiwiWG1sIiwiZG9tVG9Xb3Jrc3BhY2UiLCJibG9ja2x5WG1sIiwid29ya3NwYWNlVG9Eb20iLCJnZXRNYWluV29ya3NwYWNlIiwicmVtb3ZlQ2hhbmdlTGlzdGVuZXIiLCJ0b2dnbGVCbG9ja2x5RXZlbnQiLCJjbGVhciIsIm5hbWUiLCJ0b2dnbGUiLCJfdmlldyIsImxvZyIsInR5cGUiLCJjYXRlZ29yeSIsImRhdGEiLCJkaXNwbGF5U3RhdGUiLCJnZXREaXNwbGF5U3RhdGUiLCJ2aXN1YWxpemF0aW9uIiwidGFiVHlwZSIsInJlc3VsdElkIiwiZXhwZXJpbWVudElkIiwicGhhc2UiLCJibG9ja2x5T3B0aW9ucyIsInRvb2xib3giLCJjb2xsYXBzZSIsImNvbW1lbnRzIiwiSW5maW5pdHkiLCJ0cmFzaGNhbiIsImhvcml6b250YWxMYXlvdXQiLCJ0b29sYm94UG9zaXRpb24iLCJjc3MiLCJtZWRpYSIsInJ0bCIsInNjcm9sbGJhcnMiLCJzb3VuZHMiLCJvbmVCYXNlZEluZGV4IiwiaW5qZWN0IiwidG9vbGJveF9zY3JvbGxiYXJzIiwiZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSIsImlkeCIsInN0eWxlIiwiZmlsbCIsImRpc3BhdGNoRXZlbnQiLCJibG9ja2x5RXZ0IiwibW9kZWxUeXBlIiwibW9kaWZ5X2Jsb2NrIiwiQXJyYXkiLCJwcm90b3R5cGUiLCJzbGljZSIsImNhbGwiLCIkIiwiZmluZCIsIm1hcCIsImJsb2NrIiwiZ2V0QXR0cmlidXRlIiwiZ2V0QmxvY2tCeUlkIiwiYmxvY2tJZCIsImJsb2NrX3R5cGUiLCJjb3VudGVyIiwiZm9yRWFjaCIsImJsb2NrRGl2IiwiU3RyaW5nIiwic2V0QXR0cmlidXRlIiwib2xkWG1sIiwiRXJyb3IiLCJwYXJzZVhNTCIsImRvY3VtZW50RWxlbWVudCIsInByZXNlbnRCbG9ja3MiLCJsaXN0ZW5lcnNfIiwiYWRkQ2hhbmdlTGlzdGVuZXIiLCJfbnVtU2Vuc29ycyIsIm51bVNlbnNvcnMiLCJibG9ja3NJblRvb2xib3giLCJnZXRFbGVtZW50c0J5VGFnTmFtZSIsImJsb2Nrc0luV29ya3NwYWNlIiwib2xkQmxvY2siLCJvbGRCbG9ja0RpdiIsImlkIiwibmV3QmxvY2siLCJjbG9uZU5vZGUiLCJwYXJlbnRCbG9jayIsInBhcmVudE5vZGUiLCJhcHBlbmRDaGlsZCIsIm1hdGNoIiwiZmllbGRWYWx1ZSIsImlubmVySFRNTCIsImZpcnN0Q2hpbGQiLCJyZW1vdmUiLCJhcHBlbmQiLCJjcmVhdGUiLCJtb2RlbERhdGEiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBQUEsT0FBTyxVQUFDQyxPQUFELEVBQWE7QUFDbEIsTUFBTUMsUUFBUUQsUUFBUSxpQkFBUixDQUFkO0FBQUEsTUFDRUUsVUFBVUYsUUFBUSxvQkFBUixDQURaO0FBQUEs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QUNEO0FBQ0Y7QUFDRCxlQUFLN0YsU0FBTCxDQUFlc0IsS0FBZjtBQUNBVCxpQkFBT0MsT0FBUCxDQUFlQyxHQUFmLENBQW1CQyxjQUFuQixDQUFrQ0MsVUFBbEMsRUFBOEMsS0FBS2pCLFNBQW5EO0FBQ0EsZUFBS0EsU0FBTCxDQUFlb0YsaUJBQWYsQ0FBaUMsS0FBSy9ELGtCQUF0QztBQUNEOztBQUVQOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBeUJLO0FBbFhlOztBQUFBO0FBQUEsSUFTWTFDLFNBVFo7O0FBc1hsQkcsa0JBQWdCMEgsTUFBaEIsR0FBeUIsWUFBZTtBQUFBLFFBQWQzRSxJQUFjLHVFQUFQLEVBQU87O0FBQ3RDLFdBQU8sSUFBSS9DLGVBQUosQ0FBb0IsRUFBRTJILFdBQVc1RSxJQUFiLEVBQXBCLENBQVA7QUFDRCxHQUZEOztBQUlBLFNBQU8vQyxlQUFQO0FBQ0QsQ0EzWEQiLCJmaWxlIjoibW9kdWxlL2V1Z2xlbmEvbW9kZWxfYmxvY2tseS9ibG9ja2x5dGFiL3RhYi5qcyIsInNvdXJjZXNDb250ZW50IjpbImRlZmluZSgocmVxdWlyZSkgPT4ge1xuICBjb25zdCBVdGlscyA9IHJlcXVpcmUoJ2NvcmUvdXRpbC91dGlscycpLFxuICAgIEdsb2JhbHMgPSByZXF1aXJlKCdjb3JlL21vZGVsL2dsb2JhbHMnKSxcbiAgICBITSA9IHJlcXVpcmUoJ2NvcmUvZXZlbnQvaG9va19tYW5hZ2VyJyk7XG5cbiAgY29uc3QgQ29tcG9uZW50ID0gcmVxdWlyZSgnY29yZS9jb21wb25lbnQvY29tcG9uZW50JyksXG4gICAgTW9kZWwgPSByZXF1aXJlKCcuL21vZGVsJyksXG4gICAgVmlldyA9IHJlcXVpcmUoJy4vdmlldycpO1xuXG4gIGNsYXNzIE1vZGVsaW5nRGF0YVRhYiBleHRlbmRzIENvbXBvbmVudCB7XG4gICAgY29uc3RydWN0b3Ioc2V0dGluZ3MgPSB7fSkge1xuICAgICAgc2V0dGluZ3MubW9kZWxDbGFzcyA9IHNldHRpbmdzLm1vZGVsQ2xhc3MgfHwgTW9kZWw7XG4gICAgICBzZXR0aW5ncy52aWV3Q2xhc3MgPSBzZXR0aW5ncy52aWV3Q2xhc3MgfHwgVmlldztcbiAgICAgIHN1cGVyKHNldHRpbmdzKTtcbiAgICAgIFV0aWxzLmJpbmRNZXRob2RzKHRoaXMsIFsnX29uVG9nZ2xlUmVxdWVzdCcsICdfb25SZXN1bHRUb2dnbGVSZXF1ZXN0JywgJ19vbkNsZWFyQWxsUmVxdWVzdCcsICdfb25DbGVhclJlcXVlc3QnLCAnX29uUGhhc2VDaGFuZ2UnLFxuICAgICAgJ3RvZ2dsZUJsb2NrbHlFdmVudCcsICdfb25CbG9ja2x5TG9hZCcsICdfbGlzdGVuQmxvY2tseUV2ZW50cycsJ19vbkRpc2FibGVSZXF1ZXN0JywnX29uRW5hYmxlUmVxdWVzdCcsJ19vbkJvZHlDaGFuZ2UnXSlcblxuICAgICAgR2xvYmFscy5zZXQoJ2Jsb2NrbHlMb2FkZWQnLGZhbHNlKTtcblxuICAgICAgaWYgKCEoR2xvYmFscy5nZXQoJ0FwcENvbmZpZy5zeXN0ZW0uZXhwTW9kZWxNb2RhbGl0eScpPT09J2p1c3Rib2R5JykpIHtcbiAgICAgICAgR2xvYmFscy5nZXQoJ1JlbGF5JykuYWRkRXZlbnRMaXN0ZW5lcignTW9kZWxpbmdUYWIuVG9nZ2xlUmVxdWVzdCcsIHRoaXMuX29uVG9nZ2xlUmVxdWVzdClcbiAgICAgICAgR2xvYmFscy5nZXQoJ1JlbGF5JykuYWRkRXZlbnRMaXN0ZW5lcignVGFiLkNoYW5nZScsIHRoaXMuX29uVG9nZ2xlUmVxdWVzdClcbiAgICAgIH1cblxuICAgICAgR2xvYmFscy5nZXQoJ1JlbGF5JykuYWRkRXZlbnRMaXN0ZW5lcignQXBwUGhhc2UuQ2hhbmdlJywgdGhpcy5fb25QaGFzZUNoYW5nZSlcbiAgICAgIEdsb2JhbHMuZ2V0KCdSZWxheScpLmFkZEV2ZW50TGlzdGVuZXIoJ0Jsb2NrbHkuTG9hZCcsIHRoaXMuX29uQmxvY2tseUxvYWQpXG5cbiAgICAgIEdsb2JhbHMuZ2V0KCdSZWxheScpLmFkZEV2ZW50TGlzdGVuZXIoJ05vdGlmaWNhdGlvbnMuUmVtb3ZlJyx0aGlzLl9saXN0ZW5CbG9ja2x5RXZlbnRzKVxuICAgICAgR2xvYmFscy5nZXQoJ1JlbGF5JykuYWRkRXZlbnRMaXN0ZW5lcignTW9kZWxpbmdUYWIuVHJhbnNpdGlvbkVuZCcsdGhpcy5fbGlzdGVuQmxvY2tseUV2ZW50cylcblxuICAgICAgR2xvYmFscy5nZXQoJ1JlbGF5JykuYWRkRXZlbnRMaXN0ZW5lcignTm90aWZpY2F0aW9ucy5BZGQnLHRoaXMuX29uRGlzYWJsZVJlcXVlc3QpO1xuICAgICAgR2xvYmFscy5nZXQoJ1JlbGF5JykuYWRkRXZlbnRMaXN0ZW5lcignTm90aWZpY2F0aW9ucy5SZW1vdmUnLHRoaXMuX29uRW5hYmxlUmVxdWVzdCk7XG5cbiAgICAgIEdsb2JhbHMuZ2V0KCdSZWxheScpLmFkZEV2ZW50TGlzdGVuZXIoJ0JvZHkuQ2hhbmdlJywgdGhpcy5fb25Cb2R5Q2hhbmdlKTtcblxuXG4gICAgfVxuXG4gICAgX29uRGlzYWJsZVJlcXVlc3QoZXZ0KXtcbiAgICAgIHRoaXMudmlldygpLmRpc2FibGUoKTtcbiAgICAgIHRoaXMud29ya3NwYWNlLm9wdGlvbnMucmVhZE9ubHkgPSB0cnVlO1xuICAgICAgdGhpcy53b3Jrc3BhY2Uub3B0aW9ucy5tYXhCbG9ja3MgPSAwO1xuICAgIH1cblxuICAgIF9vbkVuYWJsZVJlcXVlc3QoZXZ0KXtcbiAgICAgIGlmIChHbG9iYWxzLmdldCgnQXBwQ29uZmlnLnN5c3RlbS5tb2RlbE1vZGFsaXR5JykgPT09ICdjcmVhdGUnKSB7XG4gICAgICAgIHRoaXMudmlldygpLmVuYWJsZSgpO1xuICAgICAgICB0aGlzLndvcmtzcGFjZS5vcHRpb25zLnJlYWRPbmx5ID0gZmFsc2U7XG4gICAgICAgIHRoaXMud29ya3NwYWNlLm9wdGlvbnMubWF4QmxvY2tzID0gNTA7XG4gICAgICB9IGVsc2UgaWYgKEdsb2JhbHMuZ2V0KCdBcHBDb25maWcuc3lzdGVtLm1vZGVsTW9kYWxpdHknKSA9PT0gJ2V4cGxvcmUnKSB7XG4gICAgICAgIHRoaXMudmlldygpLmVuYWJsZSgpO1xuICAgICAgfVxuICAgIH1cblxuICAgIGhpZGUoKSB7XG4gICAgICB0aGlzLnZpZXcoKS5oaWRlKCk7XG4gICAgfVxuXG4gICAgc2hvdygpIHtcbiAgICAgIHRoaXMudmlldygpLnNob3coKTtcbiAgICB9XG5cbiAgICBfb25Ub2dnbGVSZXF1ZXN0KGV2dCkge1xuICAgICAgLy8gUmVsb2FkIHRoZSBibG9ja3Mgb25jZSB0b2dnbGVkLCB0byBwcmV2ZW50IHRoZW0gZnJvbSBiZWluZyBzbXVzaGVkXG4gICAgICBpZiAoIXRoaXMuX21vZGVsLmdldCgnb3BlbicpKSB7XG4gICAgICAgIGlmICghdGhpcy53b3Jrc3BhY2UuZ2V0QWxsQmxvY2tzKCkubGVuZ3RoKSB7XG4gICAgICAgICAgdmFyIGRlZmF1bHRXb3Jrc3BhY2VCbG9ja3MgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImRlZmF1bHRXb3Jrc3BhY2VCbG9ja3NcIik7XG4gICAgICAgICAgd2luZG93LkJsb2NrbHkuWG1sLmRvbVRvV29ya3NwYWNlKGRlZmF1bHRXb3Jrc3BhY2VCbG9ja3MsIHRoaXMud29ya3NwYWNlKTtcblxuICAgICAgICAgIC8vIGxldCBvbmVFeWVEaXYgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm9uZS1leWVcIik7XG4gICAgICAgICAgLy8gbGV0IHR3b0V5ZURpdiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwidHdvLWV5ZXNcIik7XG4gICAgICAgICAgLy9cbiAgICAgICAgICAvLyBpZiAob25lRXllRGl2ICYmIHR3b0V5ZURpdikgeyAvLyBXaWxsIG5vdCBhY3RpdmF0ZSBvbiBpbml0aWFsIGxvYWRpbmcgb2YgcGFnZVxuICAgICAgICAgIC8vICAgaWYgKHRoaXMuX251bVNlbnNvcnMgPT09IDEpIHtcbiAgICAgICAgICAvLyAgICAgb25lRXllRGl2LnN0eWxlLmRpc3BsYXk9J2Jsb2NrJztcbiAgICAgICAgICAvLyAgICAgdHdvRXllRGl2LnN0eWxlLmRpc3BsYXk9J25vbmUnO1xuICAgICAgICAgIC8vICAgfSBlbHNlIHtcbiAgICAgICAgICAvLyAgICAgb25lRXllRGl2LnN0eWxlLmRpc3BsYXk9J25vbmUnO1xuICAgICAgICAgIC8vICAgICB0d29FeWVEaXYuc3R5bGUuZGlzcGxheT0nYmxvY2snO1xuICAgICAgICAgIC8vICAgfVxuICAgICAgICAgIC8vIH1cblxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHZhciBibG9ja2x5WG1sID0gd2luZG93LkJsb2NrbHkuWG1sLndvcmtzcGFjZVRvRG9tKHdpbmRvdy5CbG9ja2x5LmdldE1haW5Xb3Jrc3BhY2UoKSk7XG4gICAgICAgICAgdGhpcy53b3Jrc3BhY2UucmVtb3ZlQ2hhbmdlTGlzdGVuZXIodGhpcy50b2dnbGVCbG9ja2x5RXZlbnQpO1xuICAgICAgICAgIHRoaXMud29ya3NwYWNlLmNsZWFyKCk7XG4gICAgICAgICAgd2luZG93LkJsb2NrbHkuWG1sLmRvbVRvV29ya3NwYWNlKGJsb2NrbHlYbWwsIHRoaXMud29ya3NwYWNlKTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBpZiAoZXZ0Lm5hbWUgPT0gJ01vZGVsaW5nVGFiLlRvZ2dsZVJlcXVlc3QnKSB7XG4gICAgICAgIHRoaXMuX21vZGVsLnRvZ2dsZSgpO1xuICAgICAgICB0aGlzLl92aWV3LnRvZ2dsZSh0aGlzLl9tb2RlbC5nZXQoJ29wZW4nKSk7XG5cbiAgICAgICAgR2xvYmFscy5nZXQoJ0xvZ2dlcicpLmxvZyh7XG4gICAgICAgICAgdHlwZTogdGhpcy5fbW9kZWwuZ2V0KCdvcGVuJykgPyAnb3BlbicgOiAnY2xvc2UnLFxuICAgICAgICAgIGNhdGVnb3J5OiAnbW9kZWxpbmcnLFxuICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgIGRpc3BsYXlTdGF0ZTogdGhpcy5fbW9kZWwuZ2V0RGlzcGxheVN0YXRlKCksXG4gICAgICAgICAgICB2aXN1YWxpemF0aW9uOiAnJy8vdGhpcy52aWV3KCkuZ2V0Q3VycmVudFZpc3VhbGl6YXRpb24oKVxuICAgICAgICAgIH1cbiAgICAgICAgfSlcbiAgICAgIH0gZWxzZSBpZiAoZXZ0LmRhdGEudGFiVHlwZSA9PSAnYmxvY2tseScpIHtcbiAgICAgICAgdGhpcy5fbW9kZWwudG9nZ2xlKCk7XG4gICAgICAgIHRoaXMuX3ZpZXcudG9nZ2xlKHRoaXMuX21vZGVsLmdldCgnb3BlbicpKTtcbiAgICAgIH0gZWxzZSBpZiAodGhpcy5fbW9kZWwuZ2V0KCdvcGVuJykpIHtcbiAgICAgICAgdGhpcy5fbW9kZWwudG9nZ2xlKCk7XG4gICAgICAgIHRoaXMuX3ZpZXcudG9nZ2xlKHRoaXMuX21vZGVsLmdldCgnb3BlbicpKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBfb25SZXN1bHRUb2dnbGVSZXF1ZXN0KGV2dCkge1xuICAgICAgLy90aGlzLl9tb2RlbC50b2dnbGVSZXN1bHQoZXZ0LmRhdGEucmVzdWx0SWQpO1xuICAgICAgR2xvYmFscy5nZXQoJ0xvZ2dlcicpLmxvZyh7XG4gICAgICAgIHR5cGU6ICdyZXN1bHRfdG9nZ2xlJyxcbiAgICAgICAgY2F0ZWdvcnk6ICdtb2RlbGluZycsXG4gICAgICAgIGRhdGE6IHtcbiAgICAgICAgICBkaXNwbGF5U3RhdGU6IHRoaXMuX21vZGVsLmdldERpc3BsYXlTdGF0ZSgpLFxuICAgICAgICAgIHZpc3VhbGl6YXRpb246ICcnLy90aGlzLnZpZXcoKS5nZXRDdXJyZW50VmlzdWFsaXphdGlvbigpXG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgfVxuXG4gICAgX29uQ2xlYXJSZXF1ZXN0KGV2dCkge1xuICAgICAgLy90aGlzLl9tb2RlbC5jbGVhclJlc3VsdChldnQuZGF0YS5yZXN1bHRJZCk7XG4gICAgICBHbG9iYWxzLmdldCgnTG9nZ2VyJykubG9nKHtcbiAgICAgICAgdHlwZTogJ3JlbW92ZV9kYXRhJyxcbiAgICAgICAgY2F0ZWdvcnk6ICdtb2RlbGluZycsXG4gICAgICAgIGRhdGE6IHtcbiAgICAgICAgICByZXN1bHRJZDogZXZ0LmRhdGEucmVzdWx0SWQsXG4gICAgICAgICAgZGlzcGxheVN0YXRlOiB0aGlzLl9tb2RlbC5nZXREaXNwbGF5U3RhdGUoKSxcbiAgICAgICAgICB2aXN1YWxpemF0aW9uOiAnJy8vdGhpcy52aWV3KCkuZ2V0Q3VycmVudFZpc3VhbGl6YXRpb24oKVxuICAgICAgICB9XG4gICAgICB9KVxuICAgIH1cblxuICAgIF9vbkNsZWFyQWxsUmVxdWVzdChldnQpIHtcbiAgICAgIC8vdGhpcy5fbW9kZWwuY2xlYXJSZXN1bHRHcm91cChldnQuZGF0YS5leHBlcmltZW50SWQpO1xuICAgICAgR2xvYmFscy5nZXQoJ0xvZ2dlcicpLmxvZyh7XG4gICAgICAgIHR5cGU6ICdyZW1vdmVfZ3JvdXAnLFxuICAgICAgICBjYXRlZ29yeTogJ21vZGVsaW5nJyxcbiAgICAgICAgZGF0YToge1xuICAgICAgICAgIGV4cGVyaW1lbnRJZDogZXZ0LmRhdGEuZXhwZXJpbWVudElkLFxuICAgICAgICAgIGRpc3BsYXlTdGF0ZTogdGhpcy5fbW9kZWwuZ2V0RGlzcGxheVN0YXRlKCksXG4gICAgICAgICAgdmlzdWFsaXphdGlvbjogJycvL3RoaXMudmlldygpLmdldEN1cnJlbnRWaXN1YWxpemF0aW9uKClcbiAgICAgICAgfVxuICAgICAgfSlcbiAgICB9XG5cblxuICAgIF9vblBoYXNlQ2hhbmdlKGV2dCkge1xuICAgICAgaWYgKGV2dC5kYXRhLnBoYXNlID09IFwibG9naW5cIiB8fCBldnQuZGF0YS5waGFzZSA9PSBcImxvZ2luX2F0dGVtcHRlZFwiKSB7XG4gICAgICAgIGlmICghR2xvYmFscy5nZXQoJ2Jsb2NrbHlMb2FkZWQnKSkge1xuXG4gICAgICAgICAgdmFyIGJsb2NrbHlPcHRpb25zID0ge1xuICAgICAgICAgICAgdG9vbGJveCA6IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd0b29sYm94JyksXG4gICAgICAgICAgICBjb2xsYXBzZSA6IHRydWUsXG4gICAgICAgICAgICBjb21tZW50cyA6IHRydWUsXG4gICAgICAgICAgICBkaXNhYmxlIDogdHJ1ZSxcbiAgICAgICAgICAgIG1heEJsb2NrcyA6IEluZmluaXR5LFxuICAgICAgICAgICAgdHJhc2hjYW4gOiB0cnVlLFxuICAgICAgICAgICAgaG9yaXpvbnRhbExheW91dCA6IHRydWUsXG4gICAgICAgICAgICB0b29sYm94UG9zaXRpb24gOiAnc3RhcnQnLFxuICAgICAgICAgICAgY3NzIDogdHJ1ZSxcbiAgICAgICAgICAgIG1lZGlhIDogJ2h0dHBzOi8vYmxvY2tseS1kZW1vLmFwcHNwb3QuY29tL3N0YXRpYy9tZWRpYS8nLFxuICAgICAgICAgICAgcnRsIDogZmFsc2UsXG4gICAgICAgICAgICBzY3JvbGxiYXJzIDogdHJ1ZSxcbiAgICAgICAgICAgIHNvdW5kcyA6IHRydWUsXG4gICAgICAgICAgICBvbmVCYXNlZEluZGV4IDogdHJ1ZVxuICAgICAgICAgIH07XG5cbiAgICAgICAgICB0aGlzLndvcmtzcGFjZSA9IHdpbmRvdy5CbG9ja2x5LmluamVjdChkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnQmxvY2tseURpdicpLCBibG9ja2x5T3B0aW9ucyk7XG5cbiAgICAgICAgICB2YXIgdG9vbGJveF9zY3JvbGxiYXJzID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgnYmxvY2tseVNjcm9sbGJhckhhbmRsZScpO1xuICAgICAgICAgIGZvciAobGV0IGlkeD0wO2lkeDx0b29sYm94X3Njcm9sbGJhcnMubGVuZ3RoO2lkeCsrKSB7XG4gICAgICAgICAgICB0b29sYm94X3Njcm9sbGJhcnNbaWR4XS5zdHlsZS5maWxsPSdncmV5JztcbiAgICAgICAgICB9XG5cblxuICAgICAgICAgIEdsb2JhbHMuc2V0KCdibG9ja2x5TG9hZGVkJyx0cnVlKTtcblxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgdG9nZ2xlQmxvY2tseUV2ZW50KGV2dCkge1xuICAgICAgaWYgKGV2dC50eXBlICE9ICd1aScpIHtcbiAgICAgICAgR2xvYmFscy5nZXQoJ1JlbGF5JykuZGlzcGF0Y2hFdmVudCgnQmxvY2tseS5DaGFuZ2VkJywge2Jsb2NrbHlFdnQ6IGV2dCwgbW9kZWxUeXBlOiAnYmxvY2tseSd9KTtcbiAgICAgIH1cblxuICAgICAgLy8gQ2hlY2sgd2hldGhlciBhIGJsb2NrIHdpdGggbWF4X3VzZSBvZiAxIGhhcyBiZWVuIGNyZWF0ZWQgcmVzcCBkZWxldGVkLCBhbmQgZGlzYWJsZSByZXNwIGVuYWJsZS5cbiAgICAgIGlmIChldnQudHlwZSA9PSAnY3JlYXRlJykge1xuICAgICAgICB2YXIgbW9kaWZ5X2Jsb2NrID0gdHJ1ZTtcbiAgICAgICAgQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoJChkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZGVmYXVsdFdvcmtzcGFjZUJsb2NrcycpKS5maW5kKCdibG9jaycpKS5tYXAoYmxvY2sgPT4ge1xuICAgICAgICAgIGlmKGJsb2NrLmdldEF0dHJpYnV0ZSgndHlwZScpID09PSB0aGlzLndvcmtzcGFjZS5nZXRCbG9ja0J5SWQoZXZ0LmJsb2NrSWQpLnR5cGUpIG1vZGlmeV9ibG9jayA9IGZhbHNlO1xuICAgICAgICB9KTtcblxuICAgICAgICAvLyBNYW5pcHVsYXRlIHRoZSB0b29sYm94IGFjY29yZGluZyB0byB3aGljaCBlbGVtZW50cyBoYXZlIG1heF91c2UgYW5kIHdoaWNoIG9uZXMgbm90LlxuICAgICAgICBpZiAobW9kaWZ5X2Jsb2NrKSB7XG4gICAgICAgICAgdmFyIGJsb2NrX3R5cGUgPSB0aGlzLndvcmtzcGFjZS5nZXRCbG9ja0J5SWQoZXZ0LmJsb2NrSWQpLnR5cGU7XG4gICAgICAgICAgdmFyIGNvdW50ZXIgPSAwO1xuICAgICAgICAgIHRoaXMud29ya3NwYWNlLmdldEFsbEJsb2NrcygpLmZvckVhY2goYmxvY2sgPT4ge1xuICAgICAgICAgICAgaWYgKGJsb2NrLnR5cGUgPT09IGJsb2NrX3R5cGUpIHsgY291bnRlciArPSAxOyB9XG4gICAgICAgICAgfSk7XG5cbiAgICAgICAgICB2YXIgYmxvY2tEaXYgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChibG9ja190eXBlKTtcbiAgICAgICAgICBpZiAoU3RyaW5nKGNvdW50ZXIpID49IGJsb2NrRGl2LmdldEF0dHJpYnV0ZSgnbWF4X3VzZScpKSB7XG4gICAgICAgICAgICBibG9ja0Rpdi5zZXRBdHRyaWJ1dGUoJ2Rpc2FibGVkJyx0cnVlKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgLy8gVGhlbiBjaGVjayBpZiBhIGJsb2NrIGhhcyBiZWVuIGRlbGV0ZWQgdGhhdCBoYXMgYSBtYXhfdXNlIG9mIDEuXG4gICAgICBpZiAoZXZ0LnR5cGUgPT0gJ2RlbGV0ZScpIHtcbiAgICAgICAgdmFyIGJsb2NrX3R5cGUgPSBldnQub2xkWG1sLmdldEF0dHJpYnV0ZSgndHlwZScpO1xuICAgICAgICB2YXIgY291bnRlciA9IDA7XG4gICAgICAgIHRoaXMud29ya3NwYWNlLmdldEFsbEJsb2NrcygpLmZvckVhY2goYmxvY2sgPT4ge1xuICAgICAgICAgIGlmIChibG9jay50eXBlID09PSBibG9ja190eXBlKSB7IGNvdW50ZXIgKz0gMTsgfVxuICAgICAgICB9KTtcbiAgICAgICAgdmFyIGJsb2NrRGl2ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoYmxvY2tfdHlwZSk7XG4gICAgICAgIGlmIChTdHJpbmcoY291bnRlcikgPCBibG9ja0Rpdi5nZXRBdHRyaWJ1dGUoJ21heF91c2UnKSkge1xuICAgICAgICAgIGJsb2NrRGl2LnNldEF0dHJpYnV0ZSgnZGlzYWJsZWQnLGZhbHNlKTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICAvL2RvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJ1t0eXBlPW1vdmVfY2hhbmdlXScpWzBdLnNldEF0dHJpYnV0ZSgnZGlzYWJsZWQnLHRydWUpXG4gICAgICAvL2RvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJ1t0eXBlPW1vdmVfY2hhbmdlXScpWzBdLnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQoZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnW3R5cGU9bW92ZV9jaGFuZ2VdJylbMF0pXG5cbiAgICAgIC8vICoqKioqKioqKiBwYXJzZSB0aGUgY29kZSBmb3IgZXJyb3JzICoqKioqKioqKlxuICAgICAgLy8gU2VuZCBhbGVydHNcblxuXG4gICAgfVxuXG4gICAgX29uQmxvY2tseUxvYWQoZXZ0KSB7XG4gICAgICAvL2xldCB3b3Jrc3BhY2UgPSB3aW5kb3cuQmxvY2tseS5nZXRNYWluV29ya3NwYWNlKCk7XG5cbiAgICAgIGlmICghdGhpcy53b3Jrc3BhY2UpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiQmxvY2tseSB3b3Jrc3BhY2UgZG9lcyBub3QgZXhpc3QuXCIpO1xuICAgICAgfVxuICAgICAgdGhpcy53b3Jrc3BhY2UucmVtb3ZlQ2hhbmdlTGlzdGVuZXIodGhpcy50b2dnbGVCbG9ja2x5RXZlbnQpO1xuICAgICAgdGhpcy53b3Jrc3BhY2UuY2xlYXIoKTtcblxuICAgICAgaWYgKGV2dC5kYXRhKSB7XG4gICAgICAgIC8vY29uc3QgYmxvY2tseVhtbCA9IHdpbmRvdy5YbWwudGV4dFRvRG9tKGV2dC5kYXRhKVxuICAgICAgICBjb25zdCBibG9ja2x5WG1sID0gJC5wYXJzZVhNTChldnQuZGF0YSkuZG9jdW1lbnRFbGVtZW50O1xuICAgICAgICB3aW5kb3cuQmxvY2tseS5YbWwuZG9tVG9Xb3Jrc3BhY2UoYmxvY2tseVhtbCwgdGhpcy53b3Jrc3BhY2UpOy8vLnRoZW4oKCkgPT4ge2NvbnNvbGUubG9nKCdoZXJlJyl9KTtcblxuICAgICAgICBjb25zdCBwcmVzZW50QmxvY2tzID0gdGhpcy53b3Jrc3BhY2UuZ2V0QWxsQmxvY2tzKCk7XG4gICAgICAgIHByZXNlbnRCbG9ja3MubWFwKGJsb2NrID0+IHtcbiAgICAgICAgICB2YXIgYmxvY2tEaXYgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChibG9jay50eXBlKTtcbiAgICAgICAgICBpZiAoYmxvY2tEaXYpIHtcbiAgICAgICAgICAgIGlmIChibG9ja0Rpdi5nZXRBdHRyaWJ1dGUoJ21heF91c2UnKSA9PT0gJzEnKSB7XG4gICAgICAgICAgICAgIGJsb2NrRGl2LnNldEF0dHJpYnV0ZSgnZGlzYWJsZWQnLHRydWUpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9XG5cbiAgICAgIGlmICghdGhpcy53b3Jrc3BhY2UuZ2V0QWxsQmxvY2tzKCkubGVuZ3RoKSB7XG4gICAgICAgIHZhciBkZWZhdWx0V29ya3NwYWNlQmxvY2tzID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJkZWZhdWx0V29ya3NwYWNlQmxvY2tzXCIpO1xuICAgICAgICB3aW5kb3cuQmxvY2tseS5YbWwuZG9tVG9Xb3Jrc3BhY2UoZGVmYXVsdFdvcmtzcGFjZUJsb2NrcywgdGhpcy53b3Jrc3BhY2UpO1xuICAgICAgfVxuXG4gICAgfVxuXG4gICAgX2xpc3RlbkJsb2NrbHlFdmVudHMoZXZ0KSB7XG4gICAgICBpZiAoZXZ0LmRhdGEudHlwZT09PSAnbW9kZWwnICYmICF0aGlzLndvcmtzcGFjZS5saXN0ZW5lcnNfLmxlbmd0aCkge1xuICAgICAgICB0aGlzLndvcmtzcGFjZS5hZGRDaGFuZ2VMaXN0ZW5lcih0aGlzLnRvZ2dsZUJsb2NrbHlFdmVudCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgX29uQm9keUNoYW5nZShldnQpIHtcbiAgICAgIC8vdmFyIHRvb2xib3hlbGVtID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJ0b29sYm94XCIpXG4gICAgICAvL3RoaXMud29ya3NwYWNlLnVwZGF0ZVRvb2xib3godG9vbGJveGVsZW0pXG5cbiAgICAgIHRoaXMuX251bVNlbnNvcnMgPSBldnQuZGF0YS5udW1TZW5zb3JzO1xuXG4gICAgICAvLyBIaWRlIG9yIGRpc2FibGUgYmxvY2tzIGluIHRoZSB0b29sYm94IHRoYXQgZG8gbm90IGNvcnJlc3BvbmQgdG8gdGhlIG51bWJlciBvZiBzZW5zb3JQb3NpdGlvblxuICAgICAgdmFyIGJsb2Nrc0luVG9vbGJveCA9IHRvb2xib3guZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ2Jsb2NrJyk7XG4gICAgICBmb3IgKHZhciBpZHggPSAwOyBpZHggPCBibG9ja3NJblRvb2xib3gubGVuZ3RoOyBpZHgrKykge1xuICAgICAgICBsZXQgYmxvY2sgPSBibG9ja3NJblRvb2xib3hbaWR4XTtcblxuICAgICAgICBsZXQgbnVtU2Vuc29ycyA9IG51bGw7XG4gICAgICAgIHN3aXRjaChibG9jay5nZXRBdHRyaWJ1dGUoJ3NlbnNvcnMnKSkge1xuICAgICAgICAgIGNhc2UgJ29uZSc6XG4gICAgICAgICAgICBudW1TZW5zb3JzID0gMTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgICBjYXNlICd0d28nOlxuICAgICAgICAgICAgbnVtU2Vuc29ycyA9IDI7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAobnVtU2Vuc29ycyAmJiAoU3RyaW5nKG51bVNlbnNvcnMpICE9IGV2dC5kYXRhLm51bVNlbnNvcnMpKSB7XG4gICAgICAgICAgYmxvY2suc2V0QXR0cmlidXRlKCdkaXNhYmxlZCcsdHJ1ZSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgYmxvY2suc2V0QXR0cmlidXRlKCdkaXNhYmxlZCcsZmFsc2UpO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIC8vIGxldCBvbmVFeWVEaXYgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm9uZS1leWVcIik7XG4gICAgICAvLyBsZXQgdHdvRXllRGl2ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJ0d28tZXllc1wiKTtcbiAgICAgIC8vXG4gICAgICAvLyBpZiAob25lRXllRGl2ICYmIHR3b0V5ZURpdikgeyAvLyBXaWxsIG5vdCBhY3RpdmF0ZSBvbiBpbml0aWFsIGxvYWRpbmcgb2YgcGFnZVxuICAgICAgLy8gICBpZiAoZXZ0LmRhdGEubnVtU2Vuc29ycyA9PT0gMSkge1xuICAgICAgLy8gICAgIG9uZUV5ZURpdi5zdHlsZS5kaXNwbGF5PSdibG9jayc7XG4gICAgICAvLyAgICAgdHdvRXllRGl2LnN0eWxlLmRpc3BsYXk9J25vbmUnO1xuICAgICAgLy8gICB9IGVsc2Uge1xuICAgICAgLy8gICAgIG9uZUV5ZURpdi5zdHlsZS5kaXNwbGF5PSdub25lJztcbiAgICAgIC8vICAgICB0d29FeWVEaXYuc3R5bGUuZGlzcGxheT0nYmxvY2snO1xuICAgICAgLy8gICB9XG4gICAgICAvLyB9XG5cbiAgICAgIC8vIFJlcGxhY2UgYmxvY2tzIGluIHRoZSB3b3Jrc3BhY2UgdGhhdCBkbyBub3QgY29ycmVzcG9uZCB0byB0aGUgbnVtYmVyIG9mIHNlbnNvcnMgd2l0aCBvbmVzIHRoYXQgZG8sIHdoZXJlIHBvc3NpYmxlLlxuICAgICAgLy8gSW4gcGFydGljdWxhcjogdHVybl9hdF8xc2Vuc29yIG9yIHR1cm5fYXRfMXNlbnNvcl9leWVzcG90IHZzIHR1cm5fYXRfMnNlbnNvcnNcbiAgICAgIC8vIFVzZSB0aGUgYXR0cmlidXRlICdlcXVpdmFsZW5jZScgb2YgdGhlIGRpdnMgdG8gcmVwbGFjZSB0aGUgYmxvY2tzXG4gICAgICBpZiAodGhpcy53b3Jrc3BhY2UpIHtcbiAgICAgICAgdGhpcy53b3Jrc3BhY2UucmVtb3ZlQ2hhbmdlTGlzdGVuZXIodGhpcy50b2dnbGVCbG9ja2x5RXZlbnQpO1xuXG4gICAgICAgIHZhciBibG9ja2x5WG1sID0gd2luZG93LkJsb2NrbHkuWG1sLndvcmtzcGFjZVRvRG9tKHdpbmRvdy5CbG9ja2x5LmdldE1haW5Xb3Jrc3BhY2UoKSk7XG4gICAgICAgIHZhciBibG9ja3NJbldvcmtzcGFjZSA9IGJsb2NrbHlYbWwuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ2Jsb2NrJylcbiAgICAgICAgZm9yICh2YXIgaWR4ID0gMDsgaWR4IDwgYmxvY2tzSW5Xb3Jrc3BhY2UubGVuZ3RoOyBpZHgrKykge1xuICAgICAgICAgIGxldCBvbGRCbG9jayA9IGJsb2Nrc0luV29ya3NwYWNlW2lkeF07XG4gICAgICAgICAgbGV0IG9sZEJsb2NrRGl2ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQob2xkQmxvY2suaWQpXG4gICAgICAgICAgaWYgKG9sZEJsb2NrRGl2LmdldEF0dHJpYnV0ZSgnZXF1aXZhbGVuY2UnKSkge1xuICAgICAgICAgICAgbGV0IG5ld0Jsb2NrID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQob2xkQmxvY2tEaXYuZ2V0QXR0cmlidXRlKCdlcXVpdmFsZW5jZScpKS5jbG9uZU5vZGUodHJ1ZSk7XG4gICAgICAgICAgICBsZXQgcGFyZW50QmxvY2sgPSBvbGRCbG9jay5wYXJlbnROb2RlO1xuICAgICAgICAgICAgbGV0IGFwcGVuZENoaWxkID0gb2xkQmxvY2suZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ25leHQnKS5sZW5ndGggPyBvbGRCbG9jay5nZXRFbGVtZW50c0J5VGFnTmFtZSgnbmV4dCcpWzBdIDogbnVsbDtcbiAgICAgICAgICAgIGlmIChhcHBlbmRDaGlsZCkgbmV3QmxvY2suYXBwZW5kQ2hpbGQoYXBwZW5kQ2hpbGQpO1xuXG4gICAgICAgICAgICAvLyBSZXBsYWNlIHRoZSBmaWVsZCB2YWx1ZXMgd2hlcmUgcG9zc2libGVcbiAgICAgICAgICAgIGlmIChvbGRCbG9ja0Rpdi5pZC5tYXRjaCgndHVybl9hdF8nKSkge1xuICAgICAgICAgICAgICBsZXQgZmllbGRWYWx1ZSA9IG9sZEJsb2NrLmdldEVsZW1lbnRzQnlUYWdOYW1lKCdmaWVsZCcpWydESVJFQ1RJT04nXS5pbm5lckhUTUw7XG4gICAgICAgICAgICAgIG5ld0Jsb2NrLmdldEVsZW1lbnRzQnlUYWdOYW1lKCdmaWVsZCcpWydESVJFQ1RJT04nXS5pbm5lckhUTUwgPSBmaWVsZFZhbHVlO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBwYXJlbnRCbG9jay5maXJzdENoaWxkLnJlbW92ZSgpO1xuICAgICAgICAgICAgcGFyZW50QmxvY2suYXBwZW5kKG5ld0Jsb2NrKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy53b3Jrc3BhY2UuY2xlYXIoKTtcbiAgICAgICAgd2luZG93LkJsb2NrbHkuWG1sLmRvbVRvV29ya3NwYWNlKGJsb2NrbHlYbWwsIHRoaXMud29ya3NwYWNlKTtcbiAgICAgICAgdGhpcy53b3Jrc3BhY2UuYWRkQ2hhbmdlTGlzdGVuZXIodGhpcy50b2dnbGVCbG9ja2x5RXZlbnQpXG4gICAgICB9XG5cbi8qXG4gICAgICAgIHRoaXMud29ya3NwYWNlLmdldEFsbEJsb2NrcygpLmZvckVhY2goYmxvY2sgPT4ge1xuICAgICAgICAgIHZhciBibG9ja0RpdiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGJsb2NrLnR5cGUpO1xuICAgICAgICAgIGlmIChibG9ja0Rpdikge1xuICAgICAgICAgICAgLy8gQ2hlY2sgd2hldGhlciB0aGUgYmxvY2sgaGFzIHRvIGJlIHJlcGxhY2VkXG4gICAgICAgICAgICBsZXQgbnVtU2Vuc29ycyA9IG51bGw7XG4gICAgICAgICAgICBzd2l0Y2goYmxvY2tEaXYuZ2V0QXR0cmlidXRlKCdzZW5zb3JzJykpIHtcbiAgICAgICAgICAgICAgY2FzZSAnb25lJzpcbiAgICAgICAgICAgICAgICBudW1TZW5zb3JzID0gMTtcbiAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgIGNhc2UgJ3R3byc6XG4gICAgICAgICAgICAgICAgbnVtU2Vuc29ycyA9IDI7XG4gICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAobnVtU2Vuc29ycyAmJiAoU3RyaW5nKG51bVNlbnNvcnMpICE9IGV2dC5kYXRhLm51bVNlbnNvcnMpKSB7XG4gICAgICAgICAgICAgIGlmIChibG9ja0Rpdi5nZXRBdHRyaWJ1dGUoJ2VxdWl2YWxlbmNlJykpIHtcbiAgICAgICAgICAgICAgICB2YXIgbmV3QmxvY2tEaXYgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChibG9ja0Rpdi5nZXRBdHRyaWJ1dGUoJ2VxdWl2YWxlbmNlJykpLmNsb25lTm9kZSh0cnVlKTtcbiAgICAgICAgICAgICAgICBuZXdCbG9ja0Rpdi5zZXRBdHRyaWJ1dGUoJ2Rpc2FibGVkJyxmYWxzZSk7XG5cbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAqL1xuICAgIH1cblxuICB9XG5cbiAgTW9kZWxpbmdEYXRhVGFiLmNyZWF0ZSA9IChkYXRhID0ge30pID0+IHtcbiAgICByZXR1cm4gbmV3IE1vZGVsaW5nRGF0YVRhYih7IG1vZGVsRGF0YTogZGF0YSB9KVxuICB9XG5cbiAgcmV0dXJuIE1vZGVsaW5nRGF0YVRhYjtcbn0pXG4iXX0=
