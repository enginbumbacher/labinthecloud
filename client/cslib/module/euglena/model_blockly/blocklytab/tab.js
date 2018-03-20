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

      if (!(Globals.get('AppConfig.system.expModelModality') === 'justmodel')) {
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9ldWdsZW5hL21vZGVsX2Jsb2NrbHkvYmxvY2tseXRhYi90YWIuanMiXSwibmFtZXMiOlsiZGVmaW5lIiwicmVxdWlyZSIsIlV0aWxzIiwiR2xvYmFscyIsIkhNIiwiQ29tcG9uZW50IiwiTW9kZWwiLCJWaWV3IiwiTW9kZWxpbmdEYXRhVGFiIiwic2V0dGluZ3MiLCJtb2RlbENsYXNzIiwidmlld0NsYXNzIiwiYmluZE1ldGhvZHMiLCJzZXQiLCJnZXQiLCJhZGRFdmVudExpc3RlbmVyIiwiX29uVG9nZ2xlUmVxdWVzdCIsIl9vblBoYXNlQ2hhbmdlIiwiX29uQmxvY2tseUxvYWQiLCJfbGlzdGVuQmxvY2tseUV2ZW50cyIsIl9vbkRpc2FibGVSZXF1ZXN0IiwiX29uRW5hYmxlUmVxdWVzdCIsIl9vbkJvZHlDaGFuZ2UiLCJldnQiLCJ2aWV3IiwiZGlzYWJsZSIsIndvcmtzcGFjZSIsIm9wdGlvbnMiLCJyZWFkT25seSIsIm1heEJsb2NrcyIsImVuYWJsZSIsImhpZGUiLCJzaG93IiwiX21vZGVsIiwiZ2V0QWxsQmxvY2tzIiwibGVuZ3RoIiwiZGVmYXVsdFdvcmtzcGFjZUJsb2NrcyIsImRvY3VtZW50IiwiZ2V0RWxlbWVudEJ5SWQiLCJ3aW5kb3ciLCJCbG9ja2x5IiwiWG1sIiwiZG9tVG9Xb3Jrc3BhY2UiLCJibG9ja2x5WG1sIiwid29ya3NwYWNlVG9Eb20iLCJnZXRNYWluV29ya3NwYWNlIiwicmVtb3ZlQ2hhbmdlTGlzdGVuZXIiLCJ0b2dnbGVCbG9ja2x5RXZlbnQiLCJjbGVhciIsIm5hbWUiLCJ0b2dnbGUiLCJfdmlldyIsImxvZyIsInR5cGUiLCJjYXRlZ29yeSIsImRhdGEiLCJkaXNwbGF5U3RhdGUiLCJnZXREaXNwbGF5U3RhdGUiLCJ2aXN1YWxpemF0aW9uIiwidGFiVHlwZSIsInJlc3VsdElkIiwiZXhwZXJpbWVudElkIiwicGhhc2UiLCJibG9ja2x5T3B0aW9ucyIsInRvb2xib3giLCJjb2xsYXBzZSIsImNvbW1lbnRzIiwiSW5maW5pdHkiLCJ0cmFzaGNhbiIsImhvcml6b250YWxMYXlvdXQiLCJ0b29sYm94UG9zaXRpb24iLCJjc3MiLCJtZWRpYSIsInJ0bCIsInNjcm9sbGJhcnMiLCJzb3VuZHMiLCJvbmVCYXNlZEluZGV4IiwiaW5qZWN0IiwidG9vbGJveF9zY3JvbGxiYXJzIiwiZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSIsImlkeCIsInN0eWxlIiwiZmlsbCIsImRpc3BhdGNoRXZlbnQiLCJibG9ja2x5RXZ0IiwibW9kZWxUeXBlIiwibW9kaWZ5X2Jsb2NrIiwiQXJyYXkiLCJwcm90b3R5cGUiLCJzbGljZSIsImNhbGwiLCIkIiwiZmluZCIsIm1hcCIsImJsb2NrIiwiZ2V0QXR0cmlidXRlIiwiZ2V0QmxvY2tCeUlkIiwiYmxvY2tJZCIsImJsb2NrX3R5cGUiLCJjb3VudGVyIiwiZm9yRWFjaCIsImJsb2NrRGl2IiwiU3RyaW5nIiwic2V0QXR0cmlidXRlIiwib2xkWG1sIiwiRXJyb3IiLCJwYXJzZVhNTCIsImRvY3VtZW50RWxlbWVudCIsInByZXNlbnRCbG9ja3MiLCJsaXN0ZW5lcnNfIiwiYWRkQ2hhbmdlTGlzdGVuZXIiLCJfbnVtU2Vuc29ycyIsIm51bVNlbnNvcnMiLCJibG9ja3NJblRvb2xib3giLCJnZXRFbGVtZW50c0J5VGFnTmFtZSIsImJsb2Nrc0luV29ya3NwYWNlIiwib2xkQmxvY2siLCJvbGRCbG9ja0RpdiIsImlkIiwibmV3QmxvY2siLCJjbG9uZU5vZGUiLCJwYXJlbnRCbG9jayIsInBhcmVudE5vZGUiLCJhcHBlbmRDaGlsZCIsIm1hdGNoIiwiZmllbGRWYWx1ZSIsImlubmVySFRNTCIsImZpcnN0Q2hpbGQiLCJyZW1vdmUiLCJhcHBlbmQiLCJjcmVhdGUiLCJtb2RlbERhdGEiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBQUEsT0FBTyxVQUFDQyxPQUFELEVBQWE7QUFDbEIsTUFBTUMsUUFBUUQsUUFBUSxpQkFBUixDQUFkO0FBQUEsTUFDRUUsVUFBVUYsUUFBUSxvQkFBUixDQURaO0FBQUEs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bEMsRUFBOEMsS0FBS2pCLFNBQW5EO0FBQ0EsZUFBS0EsU0FBTCxDQUFlb0YsaUJBQWYsQ0FBaUMsS0FBSy9ELGtCQUF0QztBQUNEOztBQUVQOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBeUJLO0FBaFhlOztBQUFBO0FBQUEsSUFTWTFDLFNBVFo7O0FBb1hsQkcsa0JBQWdCMEgsTUFBaEIsR0FBeUIsWUFBZTtBQUFBLFFBQWQzRSxJQUFjLHVFQUFQLEVBQU87O0FBQ3RDLFdBQU8sSUFBSS9DLGVBQUosQ0FBb0IsRUFBRTJILFdBQVc1RSxJQUFiLEVBQXBCLENBQVA7QUFDRCxHQUZEOztBQUlBLFNBQU8vQyxlQUFQO0FBQ0QsQ0F6WEQiLCJmaWxlIjoibW9kdWxlL2V1Z2xlbmEvbW9kZWxfYmxvY2tseS9ibG9ja2x5dGFiL3RhYi5qcyIsInNvdXJjZXNDb250ZW50IjpbImRlZmluZSgocmVxdWlyZSkgPT4ge1xuICBjb25zdCBVdGlscyA9IHJlcXVpcmUoJ2NvcmUvdXRpbC91dGlscycpLFxuICAgIEdsb2JhbHMgPSByZXF1aXJlKCdjb3JlL21vZGVsL2dsb2JhbHMnKSxcbiAgICBITSA9IHJlcXVpcmUoJ2NvcmUvZXZlbnQvaG9va19tYW5hZ2VyJyk7XG5cbiAgY29uc3QgQ29tcG9uZW50ID0gcmVxdWlyZSgnY29yZS9jb21wb25lbnQvY29tcG9uZW50JyksXG4gICAgTW9kZWwgPSByZXF1aXJlKCcuL21vZGVsJyksXG4gICAgVmlldyA9IHJlcXVpcmUoJy4vdmlldycpO1xuXG4gIGNsYXNzIE1vZGVsaW5nRGF0YVRhYiBleHRlbmRzIENvbXBvbmVudCB7XG4gICAgY29uc3RydWN0b3Ioc2V0dGluZ3MgPSB7fSkge1xuICAgICAgc2V0dGluZ3MubW9kZWxDbGFzcyA9IHNldHRpbmdzLm1vZGVsQ2xhc3MgfHwgTW9kZWw7XG4gICAgICBzZXR0aW5ncy52aWV3Q2xhc3MgPSBzZXR0aW5ncy52aWV3Q2xhc3MgfHwgVmlldztcbiAgICAgIHN1cGVyKHNldHRpbmdzKTtcbiAgICAgIFV0aWxzLmJpbmRNZXRob2RzKHRoaXMsIFsnX29uVG9nZ2xlUmVxdWVzdCcsICdfb25SZXN1bHRUb2dnbGVSZXF1ZXN0JywgJ19vbkNsZWFyQWxsUmVxdWVzdCcsICdfb25DbGVhclJlcXVlc3QnLCAnX29uUGhhc2VDaGFuZ2UnLFxuICAgICAgJ3RvZ2dsZUJsb2NrbHlFdmVudCcsICdfb25CbG9ja2x5TG9hZCcsICdfbGlzdGVuQmxvY2tseUV2ZW50cycsJ19vbkRpc2FibGVSZXF1ZXN0JywnX29uRW5hYmxlUmVxdWVzdCcsJ19vbkJvZHlDaGFuZ2UnXSlcblxuICAgICAgR2xvYmFscy5zZXQoJ2Jsb2NrbHlMb2FkZWQnLGZhbHNlKTtcblxuICAgICAgaWYgKCEgKEdsb2JhbHMuZ2V0KCdBcHBDb25maWcuc3lzdGVtLmV4cE1vZGVsTW9kYWxpdHknKT09PSdqdXN0bW9kZWwnKSkge1xuICAgICAgICBHbG9iYWxzLmdldCgnUmVsYXknKS5hZGRFdmVudExpc3RlbmVyKCdNb2RlbGluZ1RhYi5Ub2dnbGVSZXF1ZXN0JywgdGhpcy5fb25Ub2dnbGVSZXF1ZXN0KVxuICAgICAgICBHbG9iYWxzLmdldCgnUmVsYXknKS5hZGRFdmVudExpc3RlbmVyKCdUYWIuQ2hhbmdlJywgdGhpcy5fb25Ub2dnbGVSZXF1ZXN0KVxuICAgICAgfVxuXG4gICAgICBHbG9iYWxzLmdldCgnUmVsYXknKS5hZGRFdmVudExpc3RlbmVyKCdBcHBQaGFzZS5DaGFuZ2UnLCB0aGlzLl9vblBoYXNlQ2hhbmdlKVxuICAgICAgR2xvYmFscy5nZXQoJ1JlbGF5JykuYWRkRXZlbnRMaXN0ZW5lcignQmxvY2tseS5Mb2FkJywgdGhpcy5fb25CbG9ja2x5TG9hZClcblxuICAgICAgR2xvYmFscy5nZXQoJ1JlbGF5JykuYWRkRXZlbnRMaXN0ZW5lcignTm90aWZpY2F0aW9ucy5SZW1vdmUnLHRoaXMuX2xpc3RlbkJsb2NrbHlFdmVudHMpXG4gICAgICBHbG9iYWxzLmdldCgnUmVsYXknKS5hZGRFdmVudExpc3RlbmVyKCdNb2RlbGluZ1RhYi5UcmFuc2l0aW9uRW5kJyx0aGlzLl9saXN0ZW5CbG9ja2x5RXZlbnRzKVxuXG4gICAgICBHbG9iYWxzLmdldCgnUmVsYXknKS5hZGRFdmVudExpc3RlbmVyKCdOb3RpZmljYXRpb25zLkFkZCcsdGhpcy5fb25EaXNhYmxlUmVxdWVzdCk7XG4gICAgICBHbG9iYWxzLmdldCgnUmVsYXknKS5hZGRFdmVudExpc3RlbmVyKCdOb3RpZmljYXRpb25zLlJlbW92ZScsdGhpcy5fb25FbmFibGVSZXF1ZXN0KTtcblxuICAgICAgR2xvYmFscy5nZXQoJ1JlbGF5JykuYWRkRXZlbnRMaXN0ZW5lcignQm9keS5DaGFuZ2UnLCB0aGlzLl9vbkJvZHlDaGFuZ2UpO1xuXG5cbiAgICB9XG5cbiAgICBfb25EaXNhYmxlUmVxdWVzdChldnQpe1xuICAgICAgdGhpcy52aWV3KCkuZGlzYWJsZSgpO1xuICAgICAgdGhpcy53b3Jrc3BhY2Uub3B0aW9ucy5yZWFkT25seSA9IHRydWU7XG4gICAgICB0aGlzLndvcmtzcGFjZS5vcHRpb25zLm1heEJsb2NrcyA9IDA7XG4gICAgfVxuXG4gICAgX29uRW5hYmxlUmVxdWVzdChldnQpe1xuICAgICAgaWYgKEdsb2JhbHMuZ2V0KCdBcHBDb25maWcuc3lzdGVtLm1vZGVsTW9kYWxpdHknKT09PSdjcmVhdGUnKSB7XG4gICAgICAgIHRoaXMudmlldygpLmVuYWJsZSgpO1xuICAgICAgICB0aGlzLndvcmtzcGFjZS5vcHRpb25zLnJlYWRPbmx5ID0gZmFsc2U7XG4gICAgICAgIHRoaXMud29ya3NwYWNlLm9wdGlvbnMubWF4QmxvY2tzID0gNTA7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaGlkZSgpIHtcbiAgICAgIHRoaXMudmlldygpLmhpZGUoKTtcbiAgICB9XG5cbiAgICBzaG93KCkge1xuICAgICAgdGhpcy52aWV3KCkuc2hvdygpO1xuICAgIH1cblxuICAgIF9vblRvZ2dsZVJlcXVlc3QoZXZ0KSB7XG4gICAgICAvLyBSZWxvYWQgdGhlIGJsb2NrcyBvbmNlIHRvZ2dsZWQsIHRvIHByZXZlbnQgdGhlbSBmcm9tIGJlaW5nIHNtdXNoZWRcbiAgICAgIGlmICghdGhpcy5fbW9kZWwuZ2V0KCdvcGVuJykpIHtcbiAgICAgICAgaWYgKCF0aGlzLndvcmtzcGFjZS5nZXRBbGxCbG9ja3MoKS5sZW5ndGgpIHtcbiAgICAgICAgICB2YXIgZGVmYXVsdFdvcmtzcGFjZUJsb2NrcyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiZGVmYXVsdFdvcmtzcGFjZUJsb2Nrc1wiKTtcbiAgICAgICAgICB3aW5kb3cuQmxvY2tseS5YbWwuZG9tVG9Xb3Jrc3BhY2UoZGVmYXVsdFdvcmtzcGFjZUJsb2NrcywgdGhpcy53b3Jrc3BhY2UpO1xuXG4gICAgICAgICAgLy8gbGV0IG9uZUV5ZURpdiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwib25lLWV5ZVwiKTtcbiAgICAgICAgICAvLyBsZXQgdHdvRXllRGl2ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJ0d28tZXllc1wiKTtcbiAgICAgICAgICAvL1xuICAgICAgICAgIC8vIGlmIChvbmVFeWVEaXYgJiYgdHdvRXllRGl2KSB7IC8vIFdpbGwgbm90IGFjdGl2YXRlIG9uIGluaXRpYWwgbG9hZGluZyBvZiBwYWdlXG4gICAgICAgICAgLy8gICBpZiAodGhpcy5fbnVtU2Vuc29ycyA9PT0gMSkge1xuICAgICAgICAgIC8vICAgICBvbmVFeWVEaXYuc3R5bGUuZGlzcGxheT0nYmxvY2snO1xuICAgICAgICAgIC8vICAgICB0d29FeWVEaXYuc3R5bGUuZGlzcGxheT0nbm9uZSc7XG4gICAgICAgICAgLy8gICB9IGVsc2Uge1xuICAgICAgICAgIC8vICAgICBvbmVFeWVEaXYuc3R5bGUuZGlzcGxheT0nbm9uZSc7XG4gICAgICAgICAgLy8gICAgIHR3b0V5ZURpdi5zdHlsZS5kaXNwbGF5PSdibG9jayc7XG4gICAgICAgICAgLy8gICB9XG4gICAgICAgICAgLy8gfVxuXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdmFyIGJsb2NrbHlYbWwgPSB3aW5kb3cuQmxvY2tseS5YbWwud29ya3NwYWNlVG9Eb20od2luZG93LkJsb2NrbHkuZ2V0TWFpbldvcmtzcGFjZSgpKTtcbiAgICAgICAgICB0aGlzLndvcmtzcGFjZS5yZW1vdmVDaGFuZ2VMaXN0ZW5lcih0aGlzLnRvZ2dsZUJsb2NrbHlFdmVudCk7XG4gICAgICAgICAgdGhpcy53b3Jrc3BhY2UuY2xlYXIoKTtcbiAgICAgICAgICB3aW5kb3cuQmxvY2tseS5YbWwuZG9tVG9Xb3Jrc3BhY2UoYmxvY2tseVhtbCwgdGhpcy53b3Jrc3BhY2UpO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGlmIChldnQubmFtZSA9PSAnTW9kZWxpbmdUYWIuVG9nZ2xlUmVxdWVzdCcpIHtcbiAgICAgICAgdGhpcy5fbW9kZWwudG9nZ2xlKCk7XG4gICAgICAgIHRoaXMuX3ZpZXcudG9nZ2xlKHRoaXMuX21vZGVsLmdldCgnb3BlbicpKTtcblxuICAgICAgICBHbG9iYWxzLmdldCgnTG9nZ2VyJykubG9nKHtcbiAgICAgICAgICB0eXBlOiB0aGlzLl9tb2RlbC5nZXQoJ29wZW4nKSA/ICdvcGVuJyA6ICdjbG9zZScsXG4gICAgICAgICAgY2F0ZWdvcnk6ICdtb2RlbGluZycsXG4gICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgZGlzcGxheVN0YXRlOiB0aGlzLl9tb2RlbC5nZXREaXNwbGF5U3RhdGUoKSxcbiAgICAgICAgICAgIHZpc3VhbGl6YXRpb246ICcnLy90aGlzLnZpZXcoKS5nZXRDdXJyZW50VmlzdWFsaXphdGlvbigpXG4gICAgICAgICAgfVxuICAgICAgICB9KVxuICAgICAgfSBlbHNlIGlmIChldnQuZGF0YS50YWJUeXBlID09ICdibG9ja2x5Jykge1xuICAgICAgICB0aGlzLl9tb2RlbC50b2dnbGUoKTtcbiAgICAgICAgdGhpcy5fdmlldy50b2dnbGUodGhpcy5fbW9kZWwuZ2V0KCdvcGVuJykpO1xuICAgICAgfSBlbHNlIGlmICh0aGlzLl9tb2RlbC5nZXQoJ29wZW4nKSkge1xuICAgICAgICB0aGlzLl9tb2RlbC50b2dnbGUoKTtcbiAgICAgICAgdGhpcy5fdmlldy50b2dnbGUodGhpcy5fbW9kZWwuZ2V0KCdvcGVuJykpO1xuICAgICAgfVxuICAgIH1cblxuICAgIF9vblJlc3VsdFRvZ2dsZVJlcXVlc3QoZXZ0KSB7XG4gICAgICAvL3RoaXMuX21vZGVsLnRvZ2dsZVJlc3VsdChldnQuZGF0YS5yZXN1bHRJZCk7XG4gICAgICBHbG9iYWxzLmdldCgnTG9nZ2VyJykubG9nKHtcbiAgICAgICAgdHlwZTogJ3Jlc3VsdF90b2dnbGUnLFxuICAgICAgICBjYXRlZ29yeTogJ21vZGVsaW5nJyxcbiAgICAgICAgZGF0YToge1xuICAgICAgICAgIGRpc3BsYXlTdGF0ZTogdGhpcy5fbW9kZWwuZ2V0RGlzcGxheVN0YXRlKCksXG4gICAgICAgICAgdmlzdWFsaXphdGlvbjogJycvL3RoaXMudmlldygpLmdldEN1cnJlbnRWaXN1YWxpemF0aW9uKClcbiAgICAgICAgfVxuICAgICAgfSlcbiAgICB9XG5cbiAgICBfb25DbGVhclJlcXVlc3QoZXZ0KSB7XG4gICAgICAvL3RoaXMuX21vZGVsLmNsZWFyUmVzdWx0KGV2dC5kYXRhLnJlc3VsdElkKTtcbiAgICAgIEdsb2JhbHMuZ2V0KCdMb2dnZXInKS5sb2coe1xuICAgICAgICB0eXBlOiAncmVtb3ZlX2RhdGEnLFxuICAgICAgICBjYXRlZ29yeTogJ21vZGVsaW5nJyxcbiAgICAgICAgZGF0YToge1xuICAgICAgICAgIHJlc3VsdElkOiBldnQuZGF0YS5yZXN1bHRJZCxcbiAgICAgICAgICBkaXNwbGF5U3RhdGU6IHRoaXMuX21vZGVsLmdldERpc3BsYXlTdGF0ZSgpLFxuICAgICAgICAgIHZpc3VhbGl6YXRpb246ICcnLy90aGlzLnZpZXcoKS5nZXRDdXJyZW50VmlzdWFsaXphdGlvbigpXG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgfVxuXG4gICAgX29uQ2xlYXJBbGxSZXF1ZXN0KGV2dCkge1xuICAgICAgLy90aGlzLl9tb2RlbC5jbGVhclJlc3VsdEdyb3VwKGV2dC5kYXRhLmV4cGVyaW1lbnRJZCk7XG4gICAgICBHbG9iYWxzLmdldCgnTG9nZ2VyJykubG9nKHtcbiAgICAgICAgdHlwZTogJ3JlbW92ZV9ncm91cCcsXG4gICAgICAgIGNhdGVnb3J5OiAnbW9kZWxpbmcnLFxuICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgZXhwZXJpbWVudElkOiBldnQuZGF0YS5leHBlcmltZW50SWQsXG4gICAgICAgICAgZGlzcGxheVN0YXRlOiB0aGlzLl9tb2RlbC5nZXREaXNwbGF5U3RhdGUoKSxcbiAgICAgICAgICB2aXN1YWxpemF0aW9uOiAnJy8vdGhpcy52aWV3KCkuZ2V0Q3VycmVudFZpc3VhbGl6YXRpb24oKVxuICAgICAgICB9XG4gICAgICB9KVxuICAgIH1cblxuXG4gICAgX29uUGhhc2VDaGFuZ2UoZXZ0KSB7XG4gICAgICBpZiAoZXZ0LmRhdGEucGhhc2UgPT0gXCJsb2dpblwiIHx8IGV2dC5kYXRhLnBoYXNlID09IFwibG9naW5fYXR0ZW1wdGVkXCIpIHtcbiAgICAgICAgaWYgKCFHbG9iYWxzLmdldCgnYmxvY2tseUxvYWRlZCcpKSB7XG5cbiAgICAgICAgICB2YXIgYmxvY2tseU9wdGlvbnMgPSB7XG4gICAgICAgICAgICB0b29sYm94IDogZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3Rvb2xib3gnKSxcbiAgICAgICAgICAgIGNvbGxhcHNlIDogdHJ1ZSxcbiAgICAgICAgICAgIGNvbW1lbnRzIDogdHJ1ZSxcbiAgICAgICAgICAgIGRpc2FibGUgOiB0cnVlLFxuICAgICAgICAgICAgbWF4QmxvY2tzIDogSW5maW5pdHksXG4gICAgICAgICAgICB0cmFzaGNhbiA6IHRydWUsXG4gICAgICAgICAgICBob3Jpem9udGFsTGF5b3V0IDogdHJ1ZSxcbiAgICAgICAgICAgIHRvb2xib3hQb3NpdGlvbiA6ICdzdGFydCcsXG4gICAgICAgICAgICBjc3MgOiB0cnVlLFxuICAgICAgICAgICAgbWVkaWEgOiAnaHR0cHM6Ly9ibG9ja2x5LWRlbW8uYXBwc3BvdC5jb20vc3RhdGljL21lZGlhLycsXG4gICAgICAgICAgICBydGwgOiBmYWxzZSxcbiAgICAgICAgICAgIHNjcm9sbGJhcnMgOiB0cnVlLFxuICAgICAgICAgICAgc291bmRzIDogdHJ1ZSxcbiAgICAgICAgICAgIG9uZUJhc2VkSW5kZXggOiB0cnVlXG4gICAgICAgICAgfTtcblxuICAgICAgICAgIHRoaXMud29ya3NwYWNlID0gd2luZG93LkJsb2NrbHkuaW5qZWN0KGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdCbG9ja2x5RGl2JyksIGJsb2NrbHlPcHRpb25zKTtcblxuICAgICAgICAgIHZhciB0b29sYm94X3Njcm9sbGJhcnMgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCdibG9ja2x5U2Nyb2xsYmFySGFuZGxlJyk7XG4gICAgICAgICAgZm9yIChsZXQgaWR4PTA7aWR4PHRvb2xib3hfc2Nyb2xsYmFycy5sZW5ndGg7aWR4KyspIHtcbiAgICAgICAgICAgIHRvb2xib3hfc2Nyb2xsYmFyc1tpZHhdLnN0eWxlLmZpbGw9J2dyZXknO1xuICAgICAgICAgIH1cblxuXG4gICAgICAgICAgR2xvYmFscy5zZXQoJ2Jsb2NrbHlMb2FkZWQnLHRydWUpO1xuXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICB0b2dnbGVCbG9ja2x5RXZlbnQoZXZ0KSB7XG4gICAgICBpZiAoZXZ0LnR5cGUgIT0gJ3VpJykge1xuICAgICAgICBHbG9iYWxzLmdldCgnUmVsYXknKS5kaXNwYXRjaEV2ZW50KCdCbG9ja2x5LkNoYW5nZWQnLCB7YmxvY2tseUV2dDogZXZ0LCBtb2RlbFR5cGU6ICdibG9ja2x5J30pO1xuICAgICAgfVxuXG4gICAgICAvLyBDaGVjayB3aGV0aGVyIGEgYmxvY2sgd2l0aCBtYXhfdXNlIG9mIDEgaGFzIGJlZW4gY3JlYXRlZCByZXNwIGRlbGV0ZWQsIGFuZCBkaXNhYmxlIHJlc3AgZW5hYmxlLlxuICAgICAgaWYgKGV2dC50eXBlID09ICdjcmVhdGUnKSB7XG4gICAgICAgIHZhciBtb2RpZnlfYmxvY2sgPSB0cnVlO1xuICAgICAgICBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbCgkKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdkZWZhdWx0V29ya3NwYWNlQmxvY2tzJykpLmZpbmQoJ2Jsb2NrJykpLm1hcChibG9jayA9PiB7XG4gICAgICAgICAgaWYoYmxvY2suZ2V0QXR0cmlidXRlKCd0eXBlJykgPT09IHRoaXMud29ya3NwYWNlLmdldEJsb2NrQnlJZChldnQuYmxvY2tJZCkudHlwZSkgbW9kaWZ5X2Jsb2NrID0gZmFsc2U7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8vIE1hbmlwdWxhdGUgdGhlIHRvb2xib3ggYWNjb3JkaW5nIHRvIHdoaWNoIGVsZW1lbnRzIGhhdmUgbWF4X3VzZSBhbmQgd2hpY2ggb25lcyBub3QuXG4gICAgICAgIGlmIChtb2RpZnlfYmxvY2spIHtcbiAgICAgICAgICB2YXIgYmxvY2tfdHlwZSA9IHRoaXMud29ya3NwYWNlLmdldEJsb2NrQnlJZChldnQuYmxvY2tJZCkudHlwZTtcbiAgICAgICAgICB2YXIgY291bnRlciA9IDA7XG4gICAgICAgICAgdGhpcy53b3Jrc3BhY2UuZ2V0QWxsQmxvY2tzKCkuZm9yRWFjaChibG9jayA9PiB7XG4gICAgICAgICAgICBpZiAoYmxvY2sudHlwZSA9PT0gYmxvY2tfdHlwZSkgeyBjb3VudGVyICs9IDE7IH1cbiAgICAgICAgICB9KTtcblxuICAgICAgICAgIHZhciBibG9ja0RpdiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGJsb2NrX3R5cGUpO1xuICAgICAgICAgIGlmIChTdHJpbmcoY291bnRlcikgPj0gYmxvY2tEaXYuZ2V0QXR0cmlidXRlKCdtYXhfdXNlJykpIHtcbiAgICAgICAgICAgIGJsb2NrRGl2LnNldEF0dHJpYnV0ZSgnZGlzYWJsZWQnLHRydWUpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICAvLyBUaGVuIGNoZWNrIGlmIGEgYmxvY2sgaGFzIGJlZW4gZGVsZXRlZCB0aGF0IGhhcyBhIG1heF91c2Ugb2YgMS5cbiAgICAgIGlmIChldnQudHlwZSA9PSAnZGVsZXRlJykge1xuICAgICAgICB2YXIgYmxvY2tfdHlwZSA9IGV2dC5vbGRYbWwuZ2V0QXR0cmlidXRlKCd0eXBlJyk7XG4gICAgICAgIHZhciBjb3VudGVyID0gMDtcbiAgICAgICAgdGhpcy53b3Jrc3BhY2UuZ2V0QWxsQmxvY2tzKCkuZm9yRWFjaChibG9jayA9PiB7XG4gICAgICAgICAgaWYgKGJsb2NrLnR5cGUgPT09IGJsb2NrX3R5cGUpIHsgY291bnRlciArPSAxOyB9XG4gICAgICAgIH0pO1xuICAgICAgICB2YXIgYmxvY2tEaXYgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChibG9ja190eXBlKTtcbiAgICAgICAgaWYgKFN0cmluZyhjb3VudGVyKSA8IGJsb2NrRGl2LmdldEF0dHJpYnV0ZSgnbWF4X3VzZScpKSB7XG4gICAgICAgICAgYmxvY2tEaXYuc2V0QXR0cmlidXRlKCdkaXNhYmxlZCcsZmFsc2UpO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIC8vZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnW3R5cGU9bW92ZV9jaGFuZ2VdJylbMF0uc2V0QXR0cmlidXRlKCdkaXNhYmxlZCcsdHJ1ZSlcbiAgICAgIC8vZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnW3R5cGU9bW92ZV9jaGFuZ2VdJylbMF0ucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCdbdHlwZT1tb3ZlX2NoYW5nZV0nKVswXSlcblxuICAgICAgLy8gKioqKioqKioqIHBhcnNlIHRoZSBjb2RlIGZvciBlcnJvcnMgKioqKioqKioqXG4gICAgICAvLyBTZW5kIGFsZXJ0c1xuXG5cbiAgICB9XG5cbiAgICBfb25CbG9ja2x5TG9hZChldnQpIHtcbiAgICAgIC8vbGV0IHdvcmtzcGFjZSA9IHdpbmRvdy5CbG9ja2x5LmdldE1haW5Xb3Jrc3BhY2UoKTtcblxuICAgICAgaWYgKCF0aGlzLndvcmtzcGFjZSkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJCbG9ja2x5IHdvcmtzcGFjZSBkb2VzIG5vdCBleGlzdC5cIik7XG4gICAgICB9XG4gICAgICB0aGlzLndvcmtzcGFjZS5yZW1vdmVDaGFuZ2VMaXN0ZW5lcih0aGlzLnRvZ2dsZUJsb2NrbHlFdmVudCk7XG4gICAgICB0aGlzLndvcmtzcGFjZS5jbGVhcigpO1xuXG4gICAgICBpZiAoZXZ0LmRhdGEpIHtcbiAgICAgICAgLy9jb25zdCBibG9ja2x5WG1sID0gd2luZG93LlhtbC50ZXh0VG9Eb20oZXZ0LmRhdGEpXG4gICAgICAgIGNvbnN0IGJsb2NrbHlYbWwgPSAkLnBhcnNlWE1MKGV2dC5kYXRhKS5kb2N1bWVudEVsZW1lbnQ7XG4gICAgICAgIHdpbmRvdy5CbG9ja2x5LlhtbC5kb21Ub1dvcmtzcGFjZShibG9ja2x5WG1sLCB0aGlzLndvcmtzcGFjZSk7Ly8udGhlbigoKSA9PiB7Y29uc29sZS5sb2coJ2hlcmUnKX0pO1xuXG4gICAgICAgIGNvbnN0IHByZXNlbnRCbG9ja3MgPSB0aGlzLndvcmtzcGFjZS5nZXRBbGxCbG9ja3MoKTtcbiAgICAgICAgcHJlc2VudEJsb2Nrcy5tYXAoYmxvY2sgPT4ge1xuICAgICAgICAgIHZhciBibG9ja0RpdiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGJsb2NrLnR5cGUpO1xuICAgICAgICAgIGlmIChibG9ja0Rpdikge1xuICAgICAgICAgICAgaWYgKGJsb2NrRGl2LmdldEF0dHJpYnV0ZSgnbWF4X3VzZScpID09PSAnMScpIHtcbiAgICAgICAgICAgICAgYmxvY2tEaXYuc2V0QXR0cmlidXRlKCdkaXNhYmxlZCcsdHJ1ZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH1cblxuICAgICAgaWYgKCF0aGlzLndvcmtzcGFjZS5nZXRBbGxCbG9ja3MoKS5sZW5ndGgpIHtcbiAgICAgICAgdmFyIGRlZmF1bHRXb3Jrc3BhY2VCbG9ja3MgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImRlZmF1bHRXb3Jrc3BhY2VCbG9ja3NcIik7XG4gICAgICAgIHdpbmRvdy5CbG9ja2x5LlhtbC5kb21Ub1dvcmtzcGFjZShkZWZhdWx0V29ya3NwYWNlQmxvY2tzLCB0aGlzLndvcmtzcGFjZSk7XG4gICAgICB9XG5cbiAgICB9XG5cbiAgICBfbGlzdGVuQmxvY2tseUV2ZW50cyhldnQpIHtcbiAgICAgIGlmIChldnQuZGF0YS50eXBlPT09ICdtb2RlbCcgJiYgIXRoaXMud29ya3NwYWNlLmxpc3RlbmVyc18ubGVuZ3RoKSB7XG4gICAgICAgIHRoaXMud29ya3NwYWNlLmFkZENoYW5nZUxpc3RlbmVyKHRoaXMudG9nZ2xlQmxvY2tseUV2ZW50KTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBfb25Cb2R5Q2hhbmdlKGV2dCkge1xuICAgICAgLy92YXIgdG9vbGJveGVsZW0gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInRvb2xib3hcIilcbiAgICAgIC8vdGhpcy53b3Jrc3BhY2UudXBkYXRlVG9vbGJveCh0b29sYm94ZWxlbSlcblxuICAgICAgdGhpcy5fbnVtU2Vuc29ycyA9IGV2dC5kYXRhLm51bVNlbnNvcnM7XG5cbiAgICAgIC8vIEhpZGUgb3IgZGlzYWJsZSBibG9ja3MgaW4gdGhlIHRvb2xib3ggdGhhdCBkbyBub3QgY29ycmVzcG9uZCB0byB0aGUgbnVtYmVyIG9mIHNlbnNvclBvc2l0aW9uXG4gICAgICB2YXIgYmxvY2tzSW5Ub29sYm94ID0gdG9vbGJveC5nZXRFbGVtZW50c0J5VGFnTmFtZSgnYmxvY2snKTtcbiAgICAgIGZvciAodmFyIGlkeCA9IDA7IGlkeCA8IGJsb2Nrc0luVG9vbGJveC5sZW5ndGg7IGlkeCsrKSB7XG4gICAgICAgIGxldCBibG9jayA9IGJsb2Nrc0luVG9vbGJveFtpZHhdO1xuXG4gICAgICAgIGxldCBudW1TZW5zb3JzID0gbnVsbDtcbiAgICAgICAgc3dpdGNoKGJsb2NrLmdldEF0dHJpYnV0ZSgnc2Vuc29ycycpKSB7XG4gICAgICAgICAgY2FzZSAnb25lJzpcbiAgICAgICAgICAgIG51bVNlbnNvcnMgPSAxO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIGNhc2UgJ3R3byc6XG4gICAgICAgICAgICBudW1TZW5zb3JzID0gMjtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChudW1TZW5zb3JzICYmIChTdHJpbmcobnVtU2Vuc29ycykgIT0gZXZ0LmRhdGEubnVtU2Vuc29ycykpIHtcbiAgICAgICAgICBibG9jay5zZXRBdHRyaWJ1dGUoJ2Rpc2FibGVkJyx0cnVlKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBibG9jay5zZXRBdHRyaWJ1dGUoJ2Rpc2FibGVkJyxmYWxzZSk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgLy8gbGV0IG9uZUV5ZURpdiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwib25lLWV5ZVwiKTtcbiAgICAgIC8vIGxldCB0d29FeWVEaXYgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInR3by1leWVzXCIpO1xuICAgICAgLy9cbiAgICAgIC8vIGlmIChvbmVFeWVEaXYgJiYgdHdvRXllRGl2KSB7IC8vIFdpbGwgbm90IGFjdGl2YXRlIG9uIGluaXRpYWwgbG9hZGluZyBvZiBwYWdlXG4gICAgICAvLyAgIGlmIChldnQuZGF0YS5udW1TZW5zb3JzID09PSAxKSB7XG4gICAgICAvLyAgICAgb25lRXllRGl2LnN0eWxlLmRpc3BsYXk9J2Jsb2NrJztcbiAgICAgIC8vICAgICB0d29FeWVEaXYuc3R5bGUuZGlzcGxheT0nbm9uZSc7XG4gICAgICAvLyAgIH0gZWxzZSB7XG4gICAgICAvLyAgICAgb25lRXllRGl2LnN0eWxlLmRpc3BsYXk9J25vbmUnO1xuICAgICAgLy8gICAgIHR3b0V5ZURpdi5zdHlsZS5kaXNwbGF5PSdibG9jayc7XG4gICAgICAvLyAgIH1cbiAgICAgIC8vIH1cblxuICAgICAgLy8gUmVwbGFjZSBibG9ja3MgaW4gdGhlIHdvcmtzcGFjZSB0aGF0IGRvIG5vdCBjb3JyZXNwb25kIHRvIHRoZSBudW1iZXIgb2Ygc2Vuc29ycyB3aXRoIG9uZXMgdGhhdCBkbywgd2hlcmUgcG9zc2libGUuXG4gICAgICAvLyBJbiBwYXJ0aWN1bGFyOiB0dXJuX2F0XzFzZW5zb3Igb3IgdHVybl9hdF8xc2Vuc29yX2V5ZXNwb3QgdnMgdHVybl9hdF8yc2Vuc29yc1xuICAgICAgLy8gVXNlIHRoZSBhdHRyaWJ1dGUgJ2VxdWl2YWxlbmNlJyBvZiB0aGUgZGl2cyB0byByZXBsYWNlIHRoZSBibG9ja3NcbiAgICAgIGlmICh0aGlzLndvcmtzcGFjZSkge1xuICAgICAgICB0aGlzLndvcmtzcGFjZS5yZW1vdmVDaGFuZ2VMaXN0ZW5lcih0aGlzLnRvZ2dsZUJsb2NrbHlFdmVudCk7XG5cbiAgICAgICAgdmFyIGJsb2NrbHlYbWwgPSB3aW5kb3cuQmxvY2tseS5YbWwud29ya3NwYWNlVG9Eb20od2luZG93LkJsb2NrbHkuZ2V0TWFpbldvcmtzcGFjZSgpKTtcbiAgICAgICAgdmFyIGJsb2Nrc0luV29ya3NwYWNlID0gYmxvY2tseVhtbC5nZXRFbGVtZW50c0J5VGFnTmFtZSgnYmxvY2snKVxuICAgICAgICBmb3IgKHZhciBpZHggPSAwOyBpZHggPCBibG9ja3NJbldvcmtzcGFjZS5sZW5ndGg7IGlkeCsrKSB7XG4gICAgICAgICAgbGV0IG9sZEJsb2NrID0gYmxvY2tzSW5Xb3Jrc3BhY2VbaWR4XTtcbiAgICAgICAgICBsZXQgb2xkQmxvY2tEaXYgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChvbGRCbG9jay5pZClcbiAgICAgICAgICBpZiAob2xkQmxvY2tEaXYuZ2V0QXR0cmlidXRlKCdlcXVpdmFsZW5jZScpKSB7XG4gICAgICAgICAgICBsZXQgbmV3QmxvY2sgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChvbGRCbG9ja0Rpdi5nZXRBdHRyaWJ1dGUoJ2VxdWl2YWxlbmNlJykpLmNsb25lTm9kZSh0cnVlKTtcbiAgICAgICAgICAgIGxldCBwYXJlbnRCbG9jayA9IG9sZEJsb2NrLnBhcmVudE5vZGU7XG4gICAgICAgICAgICBsZXQgYXBwZW5kQ2hpbGQgPSBvbGRCbG9jay5nZXRFbGVtZW50c0J5VGFnTmFtZSgnbmV4dCcpLmxlbmd0aCA/IG9sZEJsb2NrLmdldEVsZW1lbnRzQnlUYWdOYW1lKCduZXh0JylbMF0gOiBudWxsO1xuICAgICAgICAgICAgaWYgKGFwcGVuZENoaWxkKSBuZXdCbG9jay5hcHBlbmRDaGlsZChhcHBlbmRDaGlsZCk7XG5cbiAgICAgICAgICAgIC8vIFJlcGxhY2UgdGhlIGZpZWxkIHZhbHVlcyB3aGVyZSBwb3NzaWJsZVxuICAgICAgICAgICAgaWYgKG9sZEJsb2NrRGl2LmlkLm1hdGNoKCd0dXJuX2F0XycpKSB7XG4gICAgICAgICAgICAgIGxldCBmaWVsZFZhbHVlID0gb2xkQmxvY2suZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ2ZpZWxkJylbJ0RJUkVDVElPTiddLmlubmVySFRNTDtcbiAgICAgICAgICAgICAgbmV3QmxvY2suZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ2ZpZWxkJylbJ0RJUkVDVElPTiddLmlubmVySFRNTCA9IGZpZWxkVmFsdWU7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHBhcmVudEJsb2NrLmZpcnN0Q2hpbGQucmVtb3ZlKCk7XG4gICAgICAgICAgICBwYXJlbnRCbG9jay5hcHBlbmQobmV3QmxvY2spO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICB0aGlzLndvcmtzcGFjZS5jbGVhcigpO1xuICAgICAgICB3aW5kb3cuQmxvY2tseS5YbWwuZG9tVG9Xb3Jrc3BhY2UoYmxvY2tseVhtbCwgdGhpcy53b3Jrc3BhY2UpO1xuICAgICAgICB0aGlzLndvcmtzcGFjZS5hZGRDaGFuZ2VMaXN0ZW5lcih0aGlzLnRvZ2dsZUJsb2NrbHlFdmVudClcbiAgICAgIH1cblxuLypcbiAgICAgICAgdGhpcy53b3Jrc3BhY2UuZ2V0QWxsQmxvY2tzKCkuZm9yRWFjaChibG9jayA9PiB7XG4gICAgICAgICAgdmFyIGJsb2NrRGl2ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoYmxvY2sudHlwZSk7XG4gICAgICAgICAgaWYgKGJsb2NrRGl2KSB7XG4gICAgICAgICAgICAvLyBDaGVjayB3aGV0aGVyIHRoZSBibG9jayBoYXMgdG8gYmUgcmVwbGFjZWRcbiAgICAgICAgICAgIGxldCBudW1TZW5zb3JzID0gbnVsbDtcbiAgICAgICAgICAgIHN3aXRjaChibG9ja0Rpdi5nZXRBdHRyaWJ1dGUoJ3NlbnNvcnMnKSkge1xuICAgICAgICAgICAgICBjYXNlICdvbmUnOlxuICAgICAgICAgICAgICAgIG51bVNlbnNvcnMgPSAxO1xuICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgY2FzZSAndHdvJzpcbiAgICAgICAgICAgICAgICBudW1TZW5zb3JzID0gMjtcbiAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChudW1TZW5zb3JzICYmIChTdHJpbmcobnVtU2Vuc29ycykgIT0gZXZ0LmRhdGEubnVtU2Vuc29ycykpIHtcbiAgICAgICAgICAgICAgaWYgKGJsb2NrRGl2LmdldEF0dHJpYnV0ZSgnZXF1aXZhbGVuY2UnKSkge1xuICAgICAgICAgICAgICAgIHZhciBuZXdCbG9ja0RpdiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGJsb2NrRGl2LmdldEF0dHJpYnV0ZSgnZXF1aXZhbGVuY2UnKSkuY2xvbmVOb2RlKHRydWUpO1xuICAgICAgICAgICAgICAgIG5ld0Jsb2NrRGl2LnNldEF0dHJpYnV0ZSgnZGlzYWJsZWQnLGZhbHNlKTtcblxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICovXG4gICAgfVxuXG4gIH1cblxuICBNb2RlbGluZ0RhdGFUYWIuY3JlYXRlID0gKGRhdGEgPSB7fSkgPT4ge1xuICAgIHJldHVybiBuZXcgTW9kZWxpbmdEYXRhVGFiKHsgbW9kZWxEYXRhOiBkYXRhIH0pXG4gIH1cblxuICByZXR1cm4gTW9kZWxpbmdEYXRhVGFiO1xufSlcbiJdfQ==
