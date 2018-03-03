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

      Globals.get('Relay').addEventListener('ModelingTab.ToggleRequest', _this._onToggleRequest);
      Globals.get('Relay').addEventListener('Tab.Change', _this._onToggleRequest);

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
        this.view().enable();
        this.workspace.options.readOnly = false;
        this.workspace.options.maxBlocks = 50;
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

            var oneEyeDiv = document.getElementById("one-eye");
            var twoEyeDiv = document.getElementById("two-eyes");

            if (oneEyeDiv && twoEyeDiv) {
              // Will not activate on initial loading of page
              if (this._numSensors === 1) {
                oneEyeDiv.style.display = 'block';
                twoEyeDiv.style.display = 'none';
              } else {
                oneEyeDiv.style.display = 'none';
                twoEyeDiv.style.display = 'block';
              }
            }
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

        //document.querySelectorAll('[type=forward_speed]')[0].setAttribute('disabled',true)
        //document.querySelectorAll('[type=forward_speed]')[0].parentNode.removeChild(document.querySelectorAll('[type=forward_speed]')[0])

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

        var oneEyeDiv = document.getElementById("one-eye");
        var twoEyeDiv = document.getElementById("two-eyes");

        if (oneEyeDiv && twoEyeDiv) {
          // Will not activate on initial loading of page
          if (evt.data.numSensors === 1) {
            oneEyeDiv.style.display = 'block';
            twoEyeDiv.style.display = 'none';
          } else {
            oneEyeDiv.style.display = 'none';
            twoEyeDiv.style.display = 'block';
          }
        }

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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9ldWdsZW5hL21vZGVsX2Jsb2NrbHkvYmxvY2tseXRhYi90YWIuanMiXSwibmFtZXMiOlsiZGVmaW5lIiwicmVxdWlyZSIsIlV0aWxzIiwiR2xvYmFscyIsIkhNIiwiQ29tcG9uZW50IiwiTW9kZWwiLCJWaWV3IiwiTW9kZWxpbmdEYXRhVGFiIiwic2V0dGluZ3MiLCJtb2RlbENsYXNzIiwidmlld0NsYXNzIiwiYmluZE1ldGhvZHMiLCJzZXQiLCJnZXQiLCJhZGRFdmVudExpc3RlbmVyIiwiX29uVG9nZ2xlUmVxdWVzdCIsIl9vblBoYXNlQ2hhbmdlIiwiX29uQmxvY2tseUxvYWQiLCJfbGlzdGVuQmxvY2tseUV2ZW50cyIsIl9vbkRpc2FibGVSZXF1ZXN0IiwiX29uRW5hYmxlUmVxdWVzdCIsIl9vbkJvZHlDaGFuZ2UiLCJldnQiLCJ2aWV3IiwiZGlzYWJsZSIsIndvcmtzcGFjZSIsIm9wdGlvbnMiLCJyZWFkT25seSIsIm1heEJsb2NrcyIsImVuYWJsZSIsImhpZGUiLCJzaG93IiwiX21vZGVsIiwiZ2V0QWxsQmxvY2tzIiwibGVuZ3RoIiwiZGVmYXVsdFdvcmtzcGFjZUJsb2NrcyIsImRvY3VtZW50IiwiZ2V0RWxlbWVudEJ5SWQiLCJ3aW5kb3ciLCJCbG9ja2x5IiwiWG1sIiwiZG9tVG9Xb3Jrc3BhY2UiLCJvbmVFeWVEaXYiLCJ0d29FeWVEaXYiLCJfbnVtU2Vuc29ycyIsInN0eWxlIiwiZGlzcGxheSIsImJsb2NrbHlYbWwiLCJ3b3Jrc3BhY2VUb0RvbSIsImdldE1haW5Xb3Jrc3BhY2UiLCJyZW1vdmVDaGFuZ2VMaXN0ZW5lciIsInRvZ2dsZUJsb2NrbHlFdmVudCIsImNsZWFyIiwibmFtZSIsInRvZ2dsZSIsIl92aWV3IiwibG9nIiwidHlwZSIsImNhdGVnb3J5IiwiZGF0YSIsImRpc3BsYXlTdGF0ZSIsImdldERpc3BsYXlTdGF0ZSIsInZpc3VhbGl6YXRpb24iLCJ0YWJUeXBlIiwicmVzdWx0SWQiLCJleHBlcmltZW50SWQiLCJwaGFzZSIsImJsb2NrbHlPcHRpb25zIiwidG9vbGJveCIsImNvbGxhcHNlIiwiY29tbWVudHMiLCJJbmZpbml0eSIsInRyYXNoY2FuIiwiaG9yaXpvbnRhbExheW91dCIsInRvb2xib3hQb3NpdGlvbiIsImNzcyIsIm1lZGlhIiwicnRsIiwic2Nyb2xsYmFycyIsInNvdW5kcyIsIm9uZUJhc2VkSW5kZXgiLCJpbmplY3QiLCJkaXNwYXRjaEV2ZW50IiwiYmxvY2tseUV2dCIsIm1vZGVsVHlwZSIsIm1vZGlmeV9ibG9jayIsIkFycmF5IiwicHJvdG90eXBlIiwic2xpY2UiLCJjYWxsIiwiJCIsImZpbmQiLCJtYXAiLCJibG9jayIsImdldEF0dHJpYnV0ZSIsImdldEJsb2NrQnlJZCIsImJsb2NrSWQiLCJibG9ja190eXBlIiwiY291bnRlciIsImZvckVhY2giLCJibG9ja0RpdiIsIlN0cmluZyIsInNldEF0dHJpYnV0ZSIsIm9sZFhtbCIsIkVycm9yIiwicGFyc2VYTUwiLCJkb2N1bWVudEVsZW1lbnQiLCJwcmVzZW50QmxvY2tzIiwibGlzdGVuZXJzXyIsImFkZENoYW5nZUxpc3RlbmVyIiwibnVtU2Vuc29ycyIsImJsb2Nrc0luVG9vbGJveCIsImdldEVsZW1lbnRzQnlUYWdOYW1lIiwiaWR4IiwiYmxvY2tzSW5Xb3Jrc3BhY2UiLCJvbGRCbG9jayIsIm9sZEJsb2NrRGl2IiwiaWQiLCJuZXdCbG9jayIsImNsb25lTm9kZSIsInBhcmVudEJsb2NrIiwicGFyZW50Tm9kZSIsImFwcGVuZENoaWxkIiwibWF0Y2giLCJmaWVsZFZhbHVlIiwiaW5uZXJIVE1MIiwiZmlyc3RDaGlsZCIsInJlbW92ZSIsImFwcGVuZCIsImNyZWF0ZSIsIm1vZGVsRGF0YSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBQSxPQUFPLFVBQUNDLE9BQUQsRUFBYTtBQUNsQixNQUFNQyxRQUFRRCxRQUFRLGlCQUFSLENBQWQ7QUFBQSxNQUNFRSxVQUFVRixRQUFRLG9CQUFSLENBRFo7QUFBQSxNQUVFRyxLQUFLSCxRQUFRLHlC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QyxhQUFhVCxTQUFTSCxvQkFBVCxDQUE4QixPQUE5QixFQUF1QyxXQUF2QyxFQUFvRGEsU0FBckU7QUFDQVAseUJBQVNOLG9CQUFULENBQThCLE9BQTlCLEVBQXVDLFdBQXZDLEVBQW9EYSxTQUFwRCxHQUFnRUQsVUFBaEU7QUFDRDs7QUFFREosMEJBQVlNLFVBQVosQ0FBdUJDLE1BQXZCO0FBQ0FQLDBCQUFZUSxNQUFaLENBQW1CVixRQUFuQjtBQUNEO0FBQ0Y7QUFDRCxlQUFLN0YsU0FBTCxDQUFlMkIsS0FBZjtBQUNBZCxpQkFBT0MsT0FBUCxDQUFlQyxHQUFmLENBQW1CQyxjQUFuQixDQUFrQ00sVUFBbEMsRUFBOEMsS0FBS3RCLFNBQW5EO0FBQ0EsZUFBS0EsU0FBTCxDQUFlb0YsaUJBQWYsQ0FBaUMsS0FBSzFELGtCQUF0QztBQUNEOztBQUVQOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBeUJLO0FBdFdlOztBQUFBO0FBQUEsSUFTWS9DLFNBVFo7O0FBMFdsQkcsa0JBQWdCMEgsTUFBaEIsR0FBeUIsWUFBZTtBQUFBLFFBQWR0RSxJQUFjLHVFQUFQLEVBQU87O0FBQ3RDLFdBQU8sSUFBSXBELGVBQUosQ0FBb0IsRUFBRTJILFdBQVd2RSxJQUFiLEVBQXBCLENBQVA7QUFDRCxHQUZEOztBQUlBLFNBQU9wRCxlQUFQO0FBQ0QsQ0EvV0QiLCJmaWxlIjoibW9kdWxlL2V1Z2xlbmEvbW9kZWxfYmxvY2tseS9ibG9ja2x5dGFiL3RhYi5qcyIsInNvdXJjZXNDb250ZW50IjpbImRlZmluZSgocmVxdWlyZSkgPT4ge1xuICBjb25zdCBVdGlscyA9IHJlcXVpcmUoJ2NvcmUvdXRpbC91dGlscycpLFxuICAgIEdsb2JhbHMgPSByZXF1aXJlKCdjb3JlL21vZGVsL2dsb2JhbHMnKSxcbiAgICBITSA9IHJlcXVpcmUoJ2NvcmUvZXZlbnQvaG9va19tYW5hZ2VyJyk7XG5cbiAgY29uc3QgQ29tcG9uZW50ID0gcmVxdWlyZSgnY29yZS9jb21wb25lbnQvY29tcG9uZW50JyksXG4gICAgTW9kZWwgPSByZXF1aXJlKCcuL21vZGVsJyksXG4gICAgVmlldyA9IHJlcXVpcmUoJy4vdmlldycpO1xuXG4gIGNsYXNzIE1vZGVsaW5nRGF0YVRhYiBleHRlbmRzIENvbXBvbmVudCB7XG4gICAgY29uc3RydWN0b3Ioc2V0dGluZ3MgPSB7fSkge1xuICAgICAgc2V0dGluZ3MubW9kZWxDbGFzcyA9IHNldHRpbmdzLm1vZGVsQ2xhc3MgfHwgTW9kZWw7XG4gICAgICBzZXR0aW5ncy52aWV3Q2xhc3MgPSBzZXR0aW5ncy52aWV3Q2xhc3MgfHwgVmlldztcbiAgICAgIHN1cGVyKHNldHRpbmdzKTtcbiAgICAgIFV0aWxzLmJpbmRNZXRob2RzKHRoaXMsIFsnX29uVG9nZ2xlUmVxdWVzdCcsICdfb25SZXN1bHRUb2dnbGVSZXF1ZXN0JywgJ19vbkNsZWFyQWxsUmVxdWVzdCcsICdfb25DbGVhclJlcXVlc3QnLCAnX29uUGhhc2VDaGFuZ2UnLFxuICAgICAgJ3RvZ2dsZUJsb2NrbHlFdmVudCcsICdfb25CbG9ja2x5TG9hZCcsICdfbGlzdGVuQmxvY2tseUV2ZW50cycsJ19vbkRpc2FibGVSZXF1ZXN0JywnX29uRW5hYmxlUmVxdWVzdCcsJ19vbkJvZHlDaGFuZ2UnXSlcblxuICAgICAgR2xvYmFscy5zZXQoJ2Jsb2NrbHlMb2FkZWQnLGZhbHNlKTtcblxuICAgICAgR2xvYmFscy5nZXQoJ1JlbGF5JykuYWRkRXZlbnRMaXN0ZW5lcignTW9kZWxpbmdUYWIuVG9nZ2xlUmVxdWVzdCcsIHRoaXMuX29uVG9nZ2xlUmVxdWVzdClcbiAgICAgIEdsb2JhbHMuZ2V0KCdSZWxheScpLmFkZEV2ZW50TGlzdGVuZXIoJ1RhYi5DaGFuZ2UnLCB0aGlzLl9vblRvZ2dsZVJlcXVlc3QpXG5cbiAgICAgIEdsb2JhbHMuZ2V0KCdSZWxheScpLmFkZEV2ZW50TGlzdGVuZXIoJ0FwcFBoYXNlLkNoYW5nZScsIHRoaXMuX29uUGhhc2VDaGFuZ2UpXG4gICAgICBHbG9iYWxzLmdldCgnUmVsYXknKS5hZGRFdmVudExpc3RlbmVyKCdCbG9ja2x5LkxvYWQnLCB0aGlzLl9vbkJsb2NrbHlMb2FkKVxuXG4gICAgICBHbG9iYWxzLmdldCgnUmVsYXknKS5hZGRFdmVudExpc3RlbmVyKCdOb3RpZmljYXRpb25zLlJlbW92ZScsdGhpcy5fbGlzdGVuQmxvY2tseUV2ZW50cylcbiAgICAgIEdsb2JhbHMuZ2V0KCdSZWxheScpLmFkZEV2ZW50TGlzdGVuZXIoJ01vZGVsaW5nVGFiLlRyYW5zaXRpb25FbmQnLHRoaXMuX2xpc3RlbkJsb2NrbHlFdmVudHMpXG5cbiAgICAgIEdsb2JhbHMuZ2V0KCdSZWxheScpLmFkZEV2ZW50TGlzdGVuZXIoJ05vdGlmaWNhdGlvbnMuQWRkJyx0aGlzLl9vbkRpc2FibGVSZXF1ZXN0KTtcbiAgICAgIEdsb2JhbHMuZ2V0KCdSZWxheScpLmFkZEV2ZW50TGlzdGVuZXIoJ05vdGlmaWNhdGlvbnMuUmVtb3ZlJyx0aGlzLl9vbkVuYWJsZVJlcXVlc3QpO1xuXG4gICAgICBHbG9iYWxzLmdldCgnUmVsYXknKS5hZGRFdmVudExpc3RlbmVyKCdCb2R5LkNoYW5nZScsIHRoaXMuX29uQm9keUNoYW5nZSk7XG5cblxuICAgIH1cblxuICAgIF9vbkRpc2FibGVSZXF1ZXN0KGV2dCl7XG4gICAgICB0aGlzLnZpZXcoKS5kaXNhYmxlKCk7XG4gICAgICB0aGlzLndvcmtzcGFjZS5vcHRpb25zLnJlYWRPbmx5ID0gdHJ1ZTtcbiAgICAgIHRoaXMud29ya3NwYWNlLm9wdGlvbnMubWF4QmxvY2tzID0gMDtcbiAgICB9XG5cbiAgICBfb25FbmFibGVSZXF1ZXN0KGV2dCl7XG4gICAgICB0aGlzLnZpZXcoKS5lbmFibGUoKTtcbiAgICAgIHRoaXMud29ya3NwYWNlLm9wdGlvbnMucmVhZE9ubHkgPSBmYWxzZTtcbiAgICAgIHRoaXMud29ya3NwYWNlLm9wdGlvbnMubWF4QmxvY2tzID0gNTA7XG4gICAgfVxuXG4gICAgaGlkZSgpIHtcbiAgICAgIHRoaXMudmlldygpLmhpZGUoKTtcbiAgICB9XG5cbiAgICBzaG93KCkge1xuICAgICAgdGhpcy52aWV3KCkuc2hvdygpO1xuICAgIH1cblxuICAgIF9vblRvZ2dsZVJlcXVlc3QoZXZ0KSB7XG4gICAgICAvLyBSZWxvYWQgdGhlIGJsb2NrcyBvbmNlIHRvZ2dsZWQsIHRvIHByZXZlbnQgdGhlbSBmcm9tIGJlaW5nIHNtdXNoZWRcbiAgICAgIGlmICghdGhpcy5fbW9kZWwuZ2V0KCdvcGVuJykpIHtcbiAgICAgICAgaWYgKCF0aGlzLndvcmtzcGFjZS5nZXRBbGxCbG9ja3MoKS5sZW5ndGgpIHtcbiAgICAgICAgICB2YXIgZGVmYXVsdFdvcmtzcGFjZUJsb2NrcyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiZGVmYXVsdFdvcmtzcGFjZUJsb2Nrc1wiKTtcbiAgICAgICAgICB3aW5kb3cuQmxvY2tseS5YbWwuZG9tVG9Xb3Jrc3BhY2UoZGVmYXVsdFdvcmtzcGFjZUJsb2NrcywgdGhpcy53b3Jrc3BhY2UpO1xuXG4gICAgICAgICAgbGV0IG9uZUV5ZURpdiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwib25lLWV5ZVwiKTtcbiAgICAgICAgICBsZXQgdHdvRXllRGl2ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJ0d28tZXllc1wiKTtcblxuICAgICAgICAgIGlmIChvbmVFeWVEaXYgJiYgdHdvRXllRGl2KSB7IC8vIFdpbGwgbm90IGFjdGl2YXRlIG9uIGluaXRpYWwgbG9hZGluZyBvZiBwYWdlXG4gICAgICAgICAgICBpZiAodGhpcy5fbnVtU2Vuc29ycyA9PT0gMSkge1xuICAgICAgICAgICAgICBvbmVFeWVEaXYuc3R5bGUuZGlzcGxheT0nYmxvY2snO1xuICAgICAgICAgICAgICB0d29FeWVEaXYuc3R5bGUuZGlzcGxheT0nbm9uZSc7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICBvbmVFeWVEaXYuc3R5bGUuZGlzcGxheT0nbm9uZSc7XG4gICAgICAgICAgICAgIHR3b0V5ZURpdi5zdHlsZS5kaXNwbGF5PSdibG9jayc7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdmFyIGJsb2NrbHlYbWwgPSB3aW5kb3cuQmxvY2tseS5YbWwud29ya3NwYWNlVG9Eb20od2luZG93LkJsb2NrbHkuZ2V0TWFpbldvcmtzcGFjZSgpKTtcbiAgICAgICAgICB0aGlzLndvcmtzcGFjZS5yZW1vdmVDaGFuZ2VMaXN0ZW5lcih0aGlzLnRvZ2dsZUJsb2NrbHlFdmVudCk7XG4gICAgICAgICAgdGhpcy53b3Jrc3BhY2UuY2xlYXIoKTtcbiAgICAgICAgICB3aW5kb3cuQmxvY2tseS5YbWwuZG9tVG9Xb3Jrc3BhY2UoYmxvY2tseVhtbCwgdGhpcy53b3Jrc3BhY2UpO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGlmIChldnQubmFtZSA9PSAnTW9kZWxpbmdUYWIuVG9nZ2xlUmVxdWVzdCcpIHtcbiAgICAgICAgdGhpcy5fbW9kZWwudG9nZ2xlKCk7XG4gICAgICAgIHRoaXMuX3ZpZXcudG9nZ2xlKHRoaXMuX21vZGVsLmdldCgnb3BlbicpKTtcblxuICAgICAgICBHbG9iYWxzLmdldCgnTG9nZ2VyJykubG9nKHtcbiAgICAgICAgICB0eXBlOiB0aGlzLl9tb2RlbC5nZXQoJ29wZW4nKSA/ICdvcGVuJyA6ICdjbG9zZScsXG4gICAgICAgICAgY2F0ZWdvcnk6ICdtb2RlbGluZycsXG4gICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgZGlzcGxheVN0YXRlOiB0aGlzLl9tb2RlbC5nZXREaXNwbGF5U3RhdGUoKSxcbiAgICAgICAgICAgIHZpc3VhbGl6YXRpb246ICcnLy90aGlzLnZpZXcoKS5nZXRDdXJyZW50VmlzdWFsaXphdGlvbigpXG4gICAgICAgICAgfVxuICAgICAgICB9KVxuICAgICAgfSBlbHNlIGlmIChldnQuZGF0YS50YWJUeXBlID09ICdibG9ja2x5Jykge1xuICAgICAgICB0aGlzLl9tb2RlbC50b2dnbGUoKTtcbiAgICAgICAgdGhpcy5fdmlldy50b2dnbGUodGhpcy5fbW9kZWwuZ2V0KCdvcGVuJykpO1xuICAgICAgfSBlbHNlIGlmICh0aGlzLl9tb2RlbC5nZXQoJ29wZW4nKSkge1xuICAgICAgICB0aGlzLl9tb2RlbC50b2dnbGUoKTtcbiAgICAgICAgdGhpcy5fdmlldy50b2dnbGUodGhpcy5fbW9kZWwuZ2V0KCdvcGVuJykpO1xuICAgICAgfVxuICAgIH1cblxuICAgIF9vblJlc3VsdFRvZ2dsZVJlcXVlc3QoZXZ0KSB7XG4gICAgICAvL3RoaXMuX21vZGVsLnRvZ2dsZVJlc3VsdChldnQuZGF0YS5yZXN1bHRJZCk7XG4gICAgICBHbG9iYWxzLmdldCgnTG9nZ2VyJykubG9nKHtcbiAgICAgICAgdHlwZTogJ3Jlc3VsdF90b2dnbGUnLFxuICAgICAgICBjYXRlZ29yeTogJ21vZGVsaW5nJyxcbiAgICAgICAgZGF0YToge1xuICAgICAgICAgIGRpc3BsYXlTdGF0ZTogdGhpcy5fbW9kZWwuZ2V0RGlzcGxheVN0YXRlKCksXG4gICAgICAgICAgdmlzdWFsaXphdGlvbjogJycvL3RoaXMudmlldygpLmdldEN1cnJlbnRWaXN1YWxpemF0aW9uKClcbiAgICAgICAgfVxuICAgICAgfSlcbiAgICB9XG5cbiAgICBfb25DbGVhclJlcXVlc3QoZXZ0KSB7XG4gICAgICAvL3RoaXMuX21vZGVsLmNsZWFyUmVzdWx0KGV2dC5kYXRhLnJlc3VsdElkKTtcbiAgICAgIEdsb2JhbHMuZ2V0KCdMb2dnZXInKS5sb2coe1xuICAgICAgICB0eXBlOiAncmVtb3ZlX2RhdGEnLFxuICAgICAgICBjYXRlZ29yeTogJ21vZGVsaW5nJyxcbiAgICAgICAgZGF0YToge1xuICAgICAgICAgIHJlc3VsdElkOiBldnQuZGF0YS5yZXN1bHRJZCxcbiAgICAgICAgICBkaXNwbGF5U3RhdGU6IHRoaXMuX21vZGVsLmdldERpc3BsYXlTdGF0ZSgpLFxuICAgICAgICAgIHZpc3VhbGl6YXRpb246ICcnLy90aGlzLnZpZXcoKS5nZXRDdXJyZW50VmlzdWFsaXphdGlvbigpXG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgfVxuXG4gICAgX29uQ2xlYXJBbGxSZXF1ZXN0KGV2dCkge1xuICAgICAgLy90aGlzLl9tb2RlbC5jbGVhclJlc3VsdEdyb3VwKGV2dC5kYXRhLmV4cGVyaW1lbnRJZCk7XG4gICAgICBHbG9iYWxzLmdldCgnTG9nZ2VyJykubG9nKHtcbiAgICAgICAgdHlwZTogJ3JlbW92ZV9ncm91cCcsXG4gICAgICAgIGNhdGVnb3J5OiAnbW9kZWxpbmcnLFxuICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgZXhwZXJpbWVudElkOiBldnQuZGF0YS5leHBlcmltZW50SWQsXG4gICAgICAgICAgZGlzcGxheVN0YXRlOiB0aGlzLl9tb2RlbC5nZXREaXNwbGF5U3RhdGUoKSxcbiAgICAgICAgICB2aXN1YWxpemF0aW9uOiAnJy8vdGhpcy52aWV3KCkuZ2V0Q3VycmVudFZpc3VhbGl6YXRpb24oKVxuICAgICAgICB9XG4gICAgICB9KVxuICAgIH1cblxuXG4gICAgX29uUGhhc2VDaGFuZ2UoZXZ0KSB7XG4gICAgICBpZiAoZXZ0LmRhdGEucGhhc2UgPT0gXCJsb2dpblwiIHx8IGV2dC5kYXRhLnBoYXNlID09IFwibG9naW5fYXR0ZW1wdGVkXCIpIHtcbiAgICAgICAgaWYgKCFHbG9iYWxzLmdldCgnYmxvY2tseUxvYWRlZCcpKSB7XG5cbiAgICAgICAgICB2YXIgYmxvY2tseU9wdGlvbnMgPSB7XG4gICAgICAgICAgICB0b29sYm94IDogZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3Rvb2xib3gnKSxcbiAgICAgICAgICAgIGNvbGxhcHNlIDogdHJ1ZSxcbiAgICAgICAgICAgIGNvbW1lbnRzIDogdHJ1ZSxcbiAgICAgICAgICAgIGRpc2FibGUgOiB0cnVlLFxuICAgICAgICAgICAgbWF4QmxvY2tzIDogSW5maW5pdHksXG4gICAgICAgICAgICB0cmFzaGNhbiA6IHRydWUsXG4gICAgICAgICAgICBob3Jpem9udGFsTGF5b3V0IDogdHJ1ZSxcbiAgICAgICAgICAgIHRvb2xib3hQb3NpdGlvbiA6ICdzdGFydCcsXG4gICAgICAgICAgICBjc3MgOiB0cnVlLFxuICAgICAgICAgICAgbWVkaWEgOiAnaHR0cHM6Ly9ibG9ja2x5LWRlbW8uYXBwc3BvdC5jb20vc3RhdGljL21lZGlhLycsXG4gICAgICAgICAgICBydGwgOiBmYWxzZSxcbiAgICAgICAgICAgIHNjcm9sbGJhcnMgOiB0cnVlLFxuICAgICAgICAgICAgc291bmRzIDogdHJ1ZSxcbiAgICAgICAgICAgIG9uZUJhc2VkSW5kZXggOiB0cnVlXG4gICAgICAgICAgfTtcblxuICAgICAgICAgIHRoaXMud29ya3NwYWNlID0gd2luZG93LkJsb2NrbHkuaW5qZWN0KGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdCbG9ja2x5RGl2JyksIGJsb2NrbHlPcHRpb25zKTtcblxuICAgICAgICAgIEdsb2JhbHMuc2V0KCdibG9ja2x5TG9hZGVkJyx0cnVlKTtcblxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgdG9nZ2xlQmxvY2tseUV2ZW50KGV2dCkge1xuICAgICAgaWYgKGV2dC50eXBlICE9ICd1aScpIHtcbiAgICAgICAgR2xvYmFscy5nZXQoJ1JlbGF5JykuZGlzcGF0Y2hFdmVudCgnQmxvY2tseS5DaGFuZ2VkJywge2Jsb2NrbHlFdnQ6IGV2dCwgbW9kZWxUeXBlOiAnYmxvY2tseSd9KTtcbiAgICAgIH1cblxuICAgICAgLy8gQ2hlY2sgd2hldGhlciBhIGJsb2NrIHdpdGggbWF4X3VzZSBvZiAxIGhhcyBiZWVuIGNyZWF0ZWQgcmVzcCBkZWxldGVkLCBhbmQgZGlzYWJsZSByZXNwIGVuYWJsZS5cbiAgICAgIGlmIChldnQudHlwZSA9PSAnY3JlYXRlJykge1xuICAgICAgICB2YXIgbW9kaWZ5X2Jsb2NrID0gdHJ1ZTtcbiAgICAgICAgQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoJChkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZGVmYXVsdFdvcmtzcGFjZUJsb2NrcycpKS5maW5kKCdibG9jaycpKS5tYXAoYmxvY2sgPT4ge1xuICAgICAgICAgIGlmKGJsb2NrLmdldEF0dHJpYnV0ZSgndHlwZScpID09PSB0aGlzLndvcmtzcGFjZS5nZXRCbG9ja0J5SWQoZXZ0LmJsb2NrSWQpLnR5cGUpIG1vZGlmeV9ibG9jayA9IGZhbHNlO1xuICAgICAgICB9KTtcblxuICAgICAgICAvLyBNYW5pcHVsYXRlIHRoZSB0b29sYm94IGFjY29yZGluZyB0byB3aGljaCBlbGVtZW50cyBoYXZlIG1heF91c2UgYW5kIHdoaWNoIG9uZXMgbm90LlxuICAgICAgICBpZiAobW9kaWZ5X2Jsb2NrKSB7XG4gICAgICAgICAgdmFyIGJsb2NrX3R5cGUgPSB0aGlzLndvcmtzcGFjZS5nZXRCbG9ja0J5SWQoZXZ0LmJsb2NrSWQpLnR5cGU7XG4gICAgICAgICAgdmFyIGNvdW50ZXIgPSAwO1xuICAgICAgICAgIHRoaXMud29ya3NwYWNlLmdldEFsbEJsb2NrcygpLmZvckVhY2goYmxvY2sgPT4ge1xuICAgICAgICAgICAgaWYgKGJsb2NrLnR5cGUgPT09IGJsb2NrX3R5cGUpIHsgY291bnRlciArPSAxOyB9XG4gICAgICAgICAgfSk7XG5cbiAgICAgICAgICB2YXIgYmxvY2tEaXYgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChibG9ja190eXBlKTtcbiAgICAgICAgICBpZiAoU3RyaW5nKGNvdW50ZXIpID49IGJsb2NrRGl2LmdldEF0dHJpYnV0ZSgnbWF4X3VzZScpKSB7XG4gICAgICAgICAgICBibG9ja0Rpdi5zZXRBdHRyaWJ1dGUoJ2Rpc2FibGVkJyx0cnVlKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgLy8gVGhlbiBjaGVjayBpZiBhIGJsb2NrIGhhcyBiZWVuIGRlbGV0ZWQgdGhhdCBoYXMgYSBtYXhfdXNlIG9mIDEuXG4gICAgICBpZiAoZXZ0LnR5cGUgPT0gJ2RlbGV0ZScpIHtcbiAgICAgICAgdmFyIGJsb2NrX3R5cGUgPSBldnQub2xkWG1sLmdldEF0dHJpYnV0ZSgndHlwZScpO1xuICAgICAgICB2YXIgY291bnRlciA9IDA7XG4gICAgICAgIHRoaXMud29ya3NwYWNlLmdldEFsbEJsb2NrcygpLmZvckVhY2goYmxvY2sgPT4ge1xuICAgICAgICAgIGlmIChibG9jay50eXBlID09PSBibG9ja190eXBlKSB7IGNvdW50ZXIgKz0gMTsgfVxuICAgICAgICB9KTtcbiAgICAgICAgdmFyIGJsb2NrRGl2ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoYmxvY2tfdHlwZSk7XG4gICAgICAgIGlmIChTdHJpbmcoY291bnRlcikgPCBibG9ja0Rpdi5nZXRBdHRyaWJ1dGUoJ21heF91c2UnKSkge1xuICAgICAgICAgIGJsb2NrRGl2LnNldEF0dHJpYnV0ZSgnZGlzYWJsZWQnLGZhbHNlKTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICAvL2RvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJ1t0eXBlPWZvcndhcmRfc3BlZWRdJylbMF0uc2V0QXR0cmlidXRlKCdkaXNhYmxlZCcsdHJ1ZSlcbiAgICAgIC8vZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnW3R5cGU9Zm9yd2FyZF9zcGVlZF0nKVswXS5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJ1t0eXBlPWZvcndhcmRfc3BlZWRdJylbMF0pXG5cbiAgICAgIC8vICoqKioqKioqKiBwYXJzZSB0aGUgY29kZSBmb3IgZXJyb3JzICoqKioqKioqKlxuICAgICAgLy8gU2VuZCBhbGVydHNcblxuXG4gICAgfVxuXG4gICAgX29uQmxvY2tseUxvYWQoZXZ0KSB7XG4gICAgICAvL2xldCB3b3Jrc3BhY2UgPSB3aW5kb3cuQmxvY2tseS5nZXRNYWluV29ya3NwYWNlKCk7XG5cbiAgICAgIGlmICghdGhpcy53b3Jrc3BhY2UpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiQmxvY2tseSB3b3Jrc3BhY2UgZG9lcyBub3QgZXhpc3QuXCIpO1xuICAgICAgfVxuICAgICAgdGhpcy53b3Jrc3BhY2UucmVtb3ZlQ2hhbmdlTGlzdGVuZXIodGhpcy50b2dnbGVCbG9ja2x5RXZlbnQpO1xuICAgICAgdGhpcy53b3Jrc3BhY2UuY2xlYXIoKTtcblxuICAgICAgaWYgKGV2dC5kYXRhKSB7XG4gICAgICAgIC8vY29uc3QgYmxvY2tseVhtbCA9IHdpbmRvdy5YbWwudGV4dFRvRG9tKGV2dC5kYXRhKVxuICAgICAgICBjb25zdCBibG9ja2x5WG1sID0gJC5wYXJzZVhNTChldnQuZGF0YSkuZG9jdW1lbnRFbGVtZW50O1xuICAgICAgICB3aW5kb3cuQmxvY2tseS5YbWwuZG9tVG9Xb3Jrc3BhY2UoYmxvY2tseVhtbCwgdGhpcy53b3Jrc3BhY2UpOy8vLnRoZW4oKCkgPT4ge2NvbnNvbGUubG9nKCdoZXJlJyl9KTtcblxuICAgICAgICBjb25zdCBwcmVzZW50QmxvY2tzID0gdGhpcy53b3Jrc3BhY2UuZ2V0QWxsQmxvY2tzKCk7XG4gICAgICAgIHByZXNlbnRCbG9ja3MubWFwKGJsb2NrID0+IHtcbiAgICAgICAgICB2YXIgYmxvY2tEaXYgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChibG9jay50eXBlKTtcbiAgICAgICAgICBpZiAoYmxvY2tEaXYpIHtcbiAgICAgICAgICAgIGlmIChibG9ja0Rpdi5nZXRBdHRyaWJ1dGUoJ21heF91c2UnKSA9PT0gJzEnKSB7XG4gICAgICAgICAgICAgIGJsb2NrRGl2LnNldEF0dHJpYnV0ZSgnZGlzYWJsZWQnLHRydWUpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9XG5cbiAgICAgIGlmICghdGhpcy53b3Jrc3BhY2UuZ2V0QWxsQmxvY2tzKCkubGVuZ3RoKSB7XG4gICAgICAgIHZhciBkZWZhdWx0V29ya3NwYWNlQmxvY2tzID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJkZWZhdWx0V29ya3NwYWNlQmxvY2tzXCIpO1xuICAgICAgICB3aW5kb3cuQmxvY2tseS5YbWwuZG9tVG9Xb3Jrc3BhY2UoZGVmYXVsdFdvcmtzcGFjZUJsb2NrcywgdGhpcy53b3Jrc3BhY2UpO1xuICAgICAgfVxuXG4gICAgfVxuXG4gICAgX2xpc3RlbkJsb2NrbHlFdmVudHMoZXZ0KSB7XG4gICAgICBpZiAoZXZ0LmRhdGEudHlwZT09PSAnbW9kZWwnICYmICF0aGlzLndvcmtzcGFjZS5saXN0ZW5lcnNfLmxlbmd0aCkge1xuICAgICAgICB0aGlzLndvcmtzcGFjZS5hZGRDaGFuZ2VMaXN0ZW5lcih0aGlzLnRvZ2dsZUJsb2NrbHlFdmVudCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgX29uQm9keUNoYW5nZShldnQpIHtcbiAgICAgIC8vdmFyIHRvb2xib3hlbGVtID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJ0b29sYm94XCIpXG4gICAgICAvL3RoaXMud29ya3NwYWNlLnVwZGF0ZVRvb2xib3godG9vbGJveGVsZW0pXG5cbiAgICAgIHRoaXMuX251bVNlbnNvcnMgPSBldnQuZGF0YS5udW1TZW5zb3JzO1xuXG4gICAgICAvLyBIaWRlIG9yIGRpc2FibGUgYmxvY2tzIGluIHRoZSB0b29sYm94IHRoYXQgZG8gbm90IGNvcnJlc3BvbmQgdG8gdGhlIG51bWJlciBvZiBzZW5zb3JQb3NpdGlvblxuICAgICAgdmFyIGJsb2Nrc0luVG9vbGJveCA9IHRvb2xib3guZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ2Jsb2NrJyk7XG4gICAgICBmb3IgKHZhciBpZHggPSAwOyBpZHggPCBibG9ja3NJblRvb2xib3gubGVuZ3RoOyBpZHgrKykge1xuICAgICAgICBsZXQgYmxvY2sgPSBibG9ja3NJblRvb2xib3hbaWR4XTtcblxuICAgICAgICBsZXQgbnVtU2Vuc29ycyA9IG51bGw7XG4gICAgICAgIHN3aXRjaChibG9jay5nZXRBdHRyaWJ1dGUoJ3NlbnNvcnMnKSkge1xuICAgICAgICAgIGNhc2UgJ29uZSc6XG4gICAgICAgICAgICBudW1TZW5zb3JzID0gMTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgICBjYXNlICd0d28nOlxuICAgICAgICAgICAgbnVtU2Vuc29ycyA9IDI7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAobnVtU2Vuc29ycyAmJiAoU3RyaW5nKG51bVNlbnNvcnMpICE9IGV2dC5kYXRhLm51bVNlbnNvcnMpKSB7XG4gICAgICAgICAgYmxvY2suc2V0QXR0cmlidXRlKCdkaXNhYmxlZCcsdHJ1ZSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgYmxvY2suc2V0QXR0cmlidXRlKCdkaXNhYmxlZCcsZmFsc2UpO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGxldCBvbmVFeWVEaXYgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm9uZS1leWVcIik7XG4gICAgICBsZXQgdHdvRXllRGl2ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJ0d28tZXllc1wiKTtcblxuICAgICAgaWYgKG9uZUV5ZURpdiAmJiB0d29FeWVEaXYpIHsgLy8gV2lsbCBub3QgYWN0aXZhdGUgb24gaW5pdGlhbCBsb2FkaW5nIG9mIHBhZ2VcbiAgICAgICAgaWYgKGV2dC5kYXRhLm51bVNlbnNvcnMgPT09IDEpIHtcbiAgICAgICAgICBvbmVFeWVEaXYuc3R5bGUuZGlzcGxheT0nYmxvY2snO1xuICAgICAgICAgIHR3b0V5ZURpdi5zdHlsZS5kaXNwbGF5PSdub25lJztcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBvbmVFeWVEaXYuc3R5bGUuZGlzcGxheT0nbm9uZSc7XG4gICAgICAgICAgdHdvRXllRGl2LnN0eWxlLmRpc3BsYXk9J2Jsb2NrJztcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICAvLyBSZXBsYWNlIGJsb2NrcyBpbiB0aGUgd29ya3NwYWNlIHRoYXQgZG8gbm90IGNvcnJlc3BvbmQgdG8gdGhlIG51bWJlciBvZiBzZW5zb3JzIHdpdGggb25lcyB0aGF0IGRvLCB3aGVyZSBwb3NzaWJsZS5cbiAgICAgIC8vIEluIHBhcnRpY3VsYXI6IHR1cm5fYXRfMXNlbnNvciBvciB0dXJuX2F0XzFzZW5zb3JfZXllc3BvdCB2cyB0dXJuX2F0XzJzZW5zb3JzXG4gICAgICAvLyBVc2UgdGhlIGF0dHJpYnV0ZSAnZXF1aXZhbGVuY2UnIG9mIHRoZSBkaXZzIHRvIHJlcGxhY2UgdGhlIGJsb2Nrc1xuICAgICAgaWYgKHRoaXMud29ya3NwYWNlKSB7XG4gICAgICAgIHRoaXMud29ya3NwYWNlLnJlbW92ZUNoYW5nZUxpc3RlbmVyKHRoaXMudG9nZ2xlQmxvY2tseUV2ZW50KTtcblxuICAgICAgICB2YXIgYmxvY2tseVhtbCA9IHdpbmRvdy5CbG9ja2x5LlhtbC53b3Jrc3BhY2VUb0RvbSh3aW5kb3cuQmxvY2tseS5nZXRNYWluV29ya3NwYWNlKCkpO1xuICAgICAgICB2YXIgYmxvY2tzSW5Xb3Jrc3BhY2UgPSBibG9ja2x5WG1sLmdldEVsZW1lbnRzQnlUYWdOYW1lKCdibG9jaycpXG4gICAgICAgIGZvciAodmFyIGlkeCA9IDA7IGlkeCA8IGJsb2Nrc0luV29ya3NwYWNlLmxlbmd0aDsgaWR4KyspIHtcbiAgICAgICAgICBsZXQgb2xkQmxvY2sgPSBibG9ja3NJbldvcmtzcGFjZVtpZHhdO1xuICAgICAgICAgIGxldCBvbGRCbG9ja0RpdiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKG9sZEJsb2NrLmlkKVxuICAgICAgICAgIGlmIChvbGRCbG9ja0Rpdi5nZXRBdHRyaWJ1dGUoJ2VxdWl2YWxlbmNlJykpIHtcbiAgICAgICAgICAgIGxldCBuZXdCbG9jayA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKG9sZEJsb2NrRGl2LmdldEF0dHJpYnV0ZSgnZXF1aXZhbGVuY2UnKSkuY2xvbmVOb2RlKHRydWUpO1xuICAgICAgICAgICAgbGV0IHBhcmVudEJsb2NrID0gb2xkQmxvY2sucGFyZW50Tm9kZTtcbiAgICAgICAgICAgIGxldCBhcHBlbmRDaGlsZCA9IG9sZEJsb2NrLmdldEVsZW1lbnRzQnlUYWdOYW1lKCduZXh0JykubGVuZ3RoID8gb2xkQmxvY2suZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ25leHQnKVswXSA6IG51bGw7XG4gICAgICAgICAgICBpZiAoYXBwZW5kQ2hpbGQpIG5ld0Jsb2NrLmFwcGVuZENoaWxkKGFwcGVuZENoaWxkKTtcblxuICAgICAgICAgICAgLy8gUmVwbGFjZSB0aGUgZmllbGQgdmFsdWVzIHdoZXJlIHBvc3NpYmxlXG4gICAgICAgICAgICBpZiAob2xkQmxvY2tEaXYuaWQubWF0Y2goJ3R1cm5fYXRfJykpIHtcbiAgICAgICAgICAgICAgbGV0IGZpZWxkVmFsdWUgPSBvbGRCbG9jay5nZXRFbGVtZW50c0J5VGFnTmFtZSgnZmllbGQnKVsnRElSRUNUSU9OJ10uaW5uZXJIVE1MO1xuICAgICAgICAgICAgICBuZXdCbG9jay5nZXRFbGVtZW50c0J5VGFnTmFtZSgnZmllbGQnKVsnRElSRUNUSU9OJ10uaW5uZXJIVE1MID0gZmllbGRWYWx1ZTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcGFyZW50QmxvY2suZmlyc3RDaGlsZC5yZW1vdmUoKTtcbiAgICAgICAgICAgIHBhcmVudEJsb2NrLmFwcGVuZChuZXdCbG9jayk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHRoaXMud29ya3NwYWNlLmNsZWFyKCk7XG4gICAgICAgIHdpbmRvdy5CbG9ja2x5LlhtbC5kb21Ub1dvcmtzcGFjZShibG9ja2x5WG1sLCB0aGlzLndvcmtzcGFjZSk7XG4gICAgICAgIHRoaXMud29ya3NwYWNlLmFkZENoYW5nZUxpc3RlbmVyKHRoaXMudG9nZ2xlQmxvY2tseUV2ZW50KVxuICAgICAgfVxuXG4vKlxuICAgICAgICB0aGlzLndvcmtzcGFjZS5nZXRBbGxCbG9ja3MoKS5mb3JFYWNoKGJsb2NrID0+IHtcbiAgICAgICAgICB2YXIgYmxvY2tEaXYgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChibG9jay50eXBlKTtcbiAgICAgICAgICBpZiAoYmxvY2tEaXYpIHtcbiAgICAgICAgICAgIC8vIENoZWNrIHdoZXRoZXIgdGhlIGJsb2NrIGhhcyB0byBiZSByZXBsYWNlZFxuICAgICAgICAgICAgbGV0IG51bVNlbnNvcnMgPSBudWxsO1xuICAgICAgICAgICAgc3dpdGNoKGJsb2NrRGl2LmdldEF0dHJpYnV0ZSgnc2Vuc29ycycpKSB7XG4gICAgICAgICAgICAgIGNhc2UgJ29uZSc6XG4gICAgICAgICAgICAgICAgbnVtU2Vuc29ycyA9IDE7XG4gICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICBjYXNlICd0d28nOlxuICAgICAgICAgICAgICAgIG51bVNlbnNvcnMgPSAyO1xuICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKG51bVNlbnNvcnMgJiYgKFN0cmluZyhudW1TZW5zb3JzKSAhPSBldnQuZGF0YS5udW1TZW5zb3JzKSkge1xuICAgICAgICAgICAgICBpZiAoYmxvY2tEaXYuZ2V0QXR0cmlidXRlKCdlcXVpdmFsZW5jZScpKSB7XG4gICAgICAgICAgICAgICAgdmFyIG5ld0Jsb2NrRGl2ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoYmxvY2tEaXYuZ2V0QXR0cmlidXRlKCdlcXVpdmFsZW5jZScpKS5jbG9uZU5vZGUodHJ1ZSk7XG4gICAgICAgICAgICAgICAgbmV3QmxvY2tEaXYuc2V0QXR0cmlidXRlKCdkaXNhYmxlZCcsZmFsc2UpO1xuXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgKi9cbiAgICB9XG5cbiAgfVxuXG4gIE1vZGVsaW5nRGF0YVRhYi5jcmVhdGUgPSAoZGF0YSA9IHt9KSA9PiB7XG4gICAgcmV0dXJuIG5ldyBNb2RlbGluZ0RhdGFUYWIoeyBtb2RlbERhdGE6IGRhdGEgfSlcbiAgfVxuXG4gIHJldHVybiBNb2RlbGluZ0RhdGFUYWI7XG59KVxuIl19
