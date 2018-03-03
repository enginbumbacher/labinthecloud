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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9ldWdsZW5hL21vZGVsX2Jsb2NrbHkvYmxvY2tseXRhYi90YWIuanMiXSwibmFtZXMiOlsiZGVmaW5lIiwicmVxdWlyZSIsIlV0aWxzIiwiR2xvYmFscyIsIkhNIiwiQ29tcG9uZW50IiwiTW9kZWwiLCJWaWV3IiwiTW9kZWxpbmdEYXRhVGFiIiwic2V0dGluZ3MiLCJtb2RlbENsYXNzIiwidmlld0NsYXNzIiwiYmluZE1ldGhvZHMiLCJzZXQiLCJnZXQiLCJhZGRFdmVudExpc3RlbmVyIiwiX29uVG9nZ2xlUmVxdWVzdCIsIl9vblBoYXNlQ2hhbmdlIiwiX29uQmxvY2tseUxvYWQiLCJfbGlzdGVuQmxvY2tseUV2ZW50cyIsIl9vbkRpc2FibGVSZXF1ZXN0IiwiX29uRW5hYmxlUmVxdWVzdCIsIl9vbkJvZHlDaGFuZ2UiLCJldnQiLCJ2aWV3IiwiZGlzYWJsZSIsIndvcmtzcGFjZSIsIm9wdGlvbnMiLCJyZWFkT25seSIsIm1heEJsb2NrcyIsImVuYWJsZSIsImhpZGUiLCJzaG93IiwiX21vZGVsIiwiZ2V0QWxsQmxvY2tzIiwibGVuZ3RoIiwiZGVmYXVsdFdvcmtzcGFjZUJsb2NrcyIsImRvY3VtZW50IiwiZ2V0RWxlbWVudEJ5SWQiLCJ3aW5kb3ciLCJCbG9ja2x5IiwiWG1sIiwiZG9tVG9Xb3Jrc3BhY2UiLCJibG9ja2x5WG1sIiwid29ya3NwYWNlVG9Eb20iLCJnZXRNYWluV29ya3NwYWNlIiwicmVtb3ZlQ2hhbmdlTGlzdGVuZXIiLCJ0b2dnbGVCbG9ja2x5RXZlbnQiLCJjbGVhciIsIm5hbWUiLCJ0b2dnbGUiLCJfdmlldyIsImxvZyIsInR5cGUiLCJjYXRlZ29yeSIsImRhdGEiLCJkaXNwbGF5U3RhdGUiLCJnZXREaXNwbGF5U3RhdGUiLCJ2aXN1YWxpemF0aW9uIiwidGFiVHlwZSIsInJlc3VsdElkIiwiZXhwZXJpbWVudElkIiwicGhhc2UiLCJibG9ja2x5T3B0aW9ucyIsInRvb2xib3giLCJjb2xsYXBzZSIsImNvbW1lbnRzIiwiSW5maW5pdHkiLCJ0cmFzaGNhbiIsImhvcml6b250YWxMYXlvdXQiLCJ0b29sYm94UG9zaXRpb24iLCJjc3MiLCJtZWRpYSIsInJ0bCIsInNjcm9sbGJhcnMiLCJzb3VuZHMiLCJvbmVCYXNlZEluZGV4IiwiaW5qZWN0IiwiZGlzcGF0Y2hFdmVudCIsImJsb2NrbHlFdnQiLCJtb2RlbFR5cGUiLCJtb2RpZnlfYmxvY2siLCJBcnJheSIsInByb3RvdHlwZSIsInNsaWNlIiwiY2FsbCIsIiQiLCJmaW5kIiwibWFwIiwiYmxvY2siLCJnZXRBdHRyaWJ1dGUiLCJnZXRCbG9ja0J5SWQiLCJibG9ja0lkIiwiYmxvY2tfdHlwZSIsImNvdW50ZXIiLCJmb3JFYWNoIiwiYmxvY2tEaXYiLCJTdHJpbmciLCJzZXRBdHRyaWJ1dGUiLCJvbGRYbWwiLCJFcnJvciIsInBhcnNlWE1MIiwiZG9jdW1lbnRFbGVtZW50IiwicHJlc2VudEJsb2NrcyIsImxpc3RlbmVyc18iLCJhZGRDaGFuZ2VMaXN0ZW5lciIsIl9udW1TZW5zb3JzIiwibnVtU2Vuc29ycyIsImJsb2Nrc0luVG9vbGJveCIsImdldEVsZW1lbnRzQnlUYWdOYW1lIiwiaWR4IiwiYmxvY2tzSW5Xb3Jrc3BhY2UiLCJvbGRCbG9jayIsIm9sZEJsb2NrRGl2IiwiaWQiLCJuZXdCbG9jayIsImNsb25lTm9kZSIsInBhcmVudEJsb2NrIiwicGFyZW50Tm9kZSIsImFwcGVuZENoaWxkIiwibWF0Y2giLCJmaWVsZFZhbHVlIiwiaW5uZXJIVE1MIiwiZmlyc3RDaGlsZCIsInJlbW92ZSIsImFwcGVuZCIsImNyZWF0ZSIsIm1vZGVsRGF0YSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBQSxPQUFPLFVBQUNDLE9BQUQsRUFBYTtBQUNsQixNQUFNQyxRQUFRRCxRQUFRLGlCQUFSLENBQWQ7QUFBQSxNQUNFRSxVQUFVRixRQUFRLG9CQUFSLENBRFo7QUFBQSxNQUVFRyxLQUFLSCxRQUFRLHlCQUFSLENBRlA7O0FBSUEsTUFBTUksWUFBWUosUUFBUSwwQkFBUixDQUFs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QWNQLFNBQVNILG9CQUFULENBQThCLE1BQTlCLEVBQXNDMUUsTUFBdEMsR0FBK0M2RSxTQUFTSCxvQkFBVCxDQUE4QixNQUE5QixFQUFzQyxDQUF0QyxDQUEvQyxHQUEwRixJQUE1RztBQUNBLGtCQUFJVSxXQUFKLEVBQWlCSixTQUFTSSxXQUFULENBQXFCQSxXQUFyQjs7QUFFakI7QUFDQSxrQkFBSU4sWUFBWUMsRUFBWixDQUFlTSxLQUFmLENBQXFCLFVBQXJCLENBQUosRUFBc0M7QUFDcEMsb0JBQUlDLGFBQWFULFNBQVNILG9CQUFULENBQThCLE9BQTlCLEVBQXVDLFdBQXZDLEVBQW9EYSxTQUFyRTtBQUNBUCx5QkFBU04sb0JBQVQsQ0FBOEIsT0FBOUIsRUFBdUMsV0FBdkMsRUFBb0RhLFNBQXBELEdBQWdFRCxVQUFoRTtBQUNEOztBQUVESiwwQkFBWU0sVUFBWixDQUF1QkMsTUFBdkI7QUFDQVAsMEJBQVlRLE1BQVosQ0FBbUJWLFFBQW5CO0FBQ0Q7QUFDRjtBQUNELGVBQUt6RixTQUFMLENBQWVzQixLQUFmO0FBQ0FULGlCQUFPQyxPQUFQLENBQWVDLEdBQWYsQ0FBbUJDLGNBQW5CLENBQWtDQyxVQUFsQyxFQUE4QyxLQUFLakIsU0FBbkQ7QUFDQSxlQUFLQSxTQUFMLENBQWUrRSxpQkFBZixDQUFpQyxLQUFLMUQsa0JBQXRDO0FBQ0Q7O0FBRVA7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUF5Qks7QUF0V2U7O0FBQUE7QUFBQSxJQVNZMUMsU0FUWjs7QUEwV2xCRyxrQkFBZ0JzSCxNQUFoQixHQUF5QixZQUFlO0FBQUEsUUFBZHZFLElBQWMsdUVBQVAsRUFBTzs7QUFDdEMsV0FBTyxJQUFJL0MsZUFBSixDQUFvQixFQUFFdUgsV0FBV3hFLElBQWIsRUFBcEIsQ0FBUDtBQUNELEdBRkQ7O0FBSUEsU0FBTy9DLGVBQVA7QUFDRCxDQS9XRCIsImZpbGUiOiJtb2R1bGUvZXVnbGVuYS9tb2RlbF9ibG9ja2x5L2Jsb2NrbHl0YWIvdGFiLmpzIiwic291cmNlc0NvbnRlbnQiOlsiZGVmaW5lKChyZXF1aXJlKSA9PiB7XG4gIGNvbnN0IFV0aWxzID0gcmVxdWlyZSgnY29yZS91dGlsL3V0aWxzJyksXG4gICAgR2xvYmFscyA9IHJlcXVpcmUoJ2NvcmUvbW9kZWwvZ2xvYmFscycpLFxuICAgIEhNID0gcmVxdWlyZSgnY29yZS9ldmVudC9ob29rX21hbmFnZXInKTtcblxuICBjb25zdCBDb21wb25lbnQgPSByZXF1aXJlKCdjb3JlL2NvbXBvbmVudC9jb21wb25lbnQnKSxcbiAgICBNb2RlbCA9IHJlcXVpcmUoJy4vbW9kZWwnKSxcbiAgICBWaWV3ID0gcmVxdWlyZSgnLi92aWV3Jyk7XG5cbiAgY2xhc3MgTW9kZWxpbmdEYXRhVGFiIGV4dGVuZHMgQ29tcG9uZW50IHtcbiAgICBjb25zdHJ1Y3RvcihzZXR0aW5ncyA9IHt9KSB7XG4gICAgICBzZXR0aW5ncy5tb2RlbENsYXNzID0gc2V0dGluZ3MubW9kZWxDbGFzcyB8fCBNb2RlbDtcbiAgICAgIHNldHRpbmdzLnZpZXdDbGFzcyA9IHNldHRpbmdzLnZpZXdDbGFzcyB8fCBWaWV3O1xuICAgICAgc3VwZXIoc2V0dGluZ3MpO1xuICAgICAgVXRpbHMuYmluZE1ldGhvZHModGhpcywgWydfb25Ub2dnbGVSZXF1ZXN0JywgJ19vblJlc3VsdFRvZ2dsZVJlcXVlc3QnLCAnX29uQ2xlYXJBbGxSZXF1ZXN0JywgJ19vbkNsZWFyUmVxdWVzdCcsICdfb25QaGFzZUNoYW5nZScsXG4gICAgICAndG9nZ2xlQmxvY2tseUV2ZW50JywgJ19vbkJsb2NrbHlMb2FkJywgJ19saXN0ZW5CbG9ja2x5RXZlbnRzJywnX29uRGlzYWJsZVJlcXVlc3QnLCdfb25FbmFibGVSZXF1ZXN0JywnX29uQm9keUNoYW5nZSddKVxuXG4gICAgICBHbG9iYWxzLnNldCgnYmxvY2tseUxvYWRlZCcsZmFsc2UpO1xuXG4gICAgICBHbG9iYWxzLmdldCgnUmVsYXknKS5hZGRFdmVudExpc3RlbmVyKCdNb2RlbGluZ1RhYi5Ub2dnbGVSZXF1ZXN0JywgdGhpcy5fb25Ub2dnbGVSZXF1ZXN0KVxuICAgICAgR2xvYmFscy5nZXQoJ1JlbGF5JykuYWRkRXZlbnRMaXN0ZW5lcignVGFiLkNoYW5nZScsIHRoaXMuX29uVG9nZ2xlUmVxdWVzdClcblxuICAgICAgR2xvYmFscy5nZXQoJ1JlbGF5JykuYWRkRXZlbnRMaXN0ZW5lcignQXBwUGhhc2UuQ2hhbmdlJywgdGhpcy5fb25QaGFzZUNoYW5nZSlcbiAgICAgIEdsb2JhbHMuZ2V0KCdSZWxheScpLmFkZEV2ZW50TGlzdGVuZXIoJ0Jsb2NrbHkuTG9hZCcsIHRoaXMuX29uQmxvY2tseUxvYWQpXG5cbiAgICAgIEdsb2JhbHMuZ2V0KCdSZWxheScpLmFkZEV2ZW50TGlzdGVuZXIoJ05vdGlmaWNhdGlvbnMuUmVtb3ZlJyx0aGlzLl9saXN0ZW5CbG9ja2x5RXZlbnRzKVxuICAgICAgR2xvYmFscy5nZXQoJ1JlbGF5JykuYWRkRXZlbnRMaXN0ZW5lcignTW9kZWxpbmdUYWIuVHJhbnNpdGlvbkVuZCcsdGhpcy5fbGlzdGVuQmxvY2tseUV2ZW50cylcblxuICAgICAgR2xvYmFscy5nZXQoJ1JlbGF5JykuYWRkRXZlbnRMaXN0ZW5lcignTm90aWZpY2F0aW9ucy5BZGQnLHRoaXMuX29uRGlzYWJsZVJlcXVlc3QpO1xuICAgICAgR2xvYmFscy5nZXQoJ1JlbGF5JykuYWRkRXZlbnRMaXN0ZW5lcignTm90aWZpY2F0aW9ucy5SZW1vdmUnLHRoaXMuX29uRW5hYmxlUmVxdWVzdCk7XG5cbiAgICAgIEdsb2JhbHMuZ2V0KCdSZWxheScpLmFkZEV2ZW50TGlzdGVuZXIoJ0JvZHkuQ2hhbmdlJywgdGhpcy5fb25Cb2R5Q2hhbmdlKTtcblxuXG4gICAgfVxuXG4gICAgX29uRGlzYWJsZVJlcXVlc3QoZXZ0KXtcbiAgICAgIHRoaXMudmlldygpLmRpc2FibGUoKTtcbiAgICAgIHRoaXMud29ya3NwYWNlLm9wdGlvbnMucmVhZE9ubHkgPSB0cnVlO1xuICAgICAgdGhpcy53b3Jrc3BhY2Uub3B0aW9ucy5tYXhCbG9ja3MgPSAwO1xuICAgIH1cblxuICAgIF9vbkVuYWJsZVJlcXVlc3QoZXZ0KXtcbiAgICAgIHRoaXMudmlldygpLmVuYWJsZSgpO1xuICAgICAgdGhpcy53b3Jrc3BhY2Uub3B0aW9ucy5yZWFkT25seSA9IGZhbHNlO1xuICAgICAgdGhpcy53b3Jrc3BhY2Uub3B0aW9ucy5tYXhCbG9ja3MgPSA1MDtcbiAgICB9XG5cbiAgICBoaWRlKCkge1xuICAgICAgdGhpcy52aWV3KCkuaGlkZSgpO1xuICAgIH1cblxuICAgIHNob3coKSB7XG4gICAgICB0aGlzLnZpZXcoKS5zaG93KCk7XG4gICAgfVxuXG4gICAgX29uVG9nZ2xlUmVxdWVzdChldnQpIHtcbiAgICAgIC8vIFJlbG9hZCB0aGUgYmxvY2tzIG9uY2UgdG9nZ2xlZCwgdG8gcHJldmVudCB0aGVtIGZyb20gYmVpbmcgc211c2hlZFxuICAgICAgaWYgKCF0aGlzLl9tb2RlbC5nZXQoJ29wZW4nKSkge1xuICAgICAgICBpZiAoIXRoaXMud29ya3NwYWNlLmdldEFsbEJsb2NrcygpLmxlbmd0aCkge1xuICAgICAgICAgIHZhciBkZWZhdWx0V29ya3NwYWNlQmxvY2tzID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJkZWZhdWx0V29ya3NwYWNlQmxvY2tzXCIpO1xuICAgICAgICAgIHdpbmRvdy5CbG9ja2x5LlhtbC5kb21Ub1dvcmtzcGFjZShkZWZhdWx0V29ya3NwYWNlQmxvY2tzLCB0aGlzLndvcmtzcGFjZSk7XG5cbiAgICAgICAgICAvLyBsZXQgb25lRXllRGl2ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJvbmUtZXllXCIpO1xuICAgICAgICAgIC8vIGxldCB0d29FeWVEaXYgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInR3by1leWVzXCIpO1xuICAgICAgICAgIC8vXG4gICAgICAgICAgLy8gaWYgKG9uZUV5ZURpdiAmJiB0d29FeWVEaXYpIHsgLy8gV2lsbCBub3QgYWN0aXZhdGUgb24gaW5pdGlhbCBsb2FkaW5nIG9mIHBhZ2VcbiAgICAgICAgICAvLyAgIGlmICh0aGlzLl9udW1TZW5zb3JzID09PSAxKSB7XG4gICAgICAgICAgLy8gICAgIG9uZUV5ZURpdi5zdHlsZS5kaXNwbGF5PSdibG9jayc7XG4gICAgICAgICAgLy8gICAgIHR3b0V5ZURpdi5zdHlsZS5kaXNwbGF5PSdub25lJztcbiAgICAgICAgICAvLyAgIH0gZWxzZSB7XG4gICAgICAgICAgLy8gICAgIG9uZUV5ZURpdi5zdHlsZS5kaXNwbGF5PSdub25lJztcbiAgICAgICAgICAvLyAgICAgdHdvRXllRGl2LnN0eWxlLmRpc3BsYXk9J2Jsb2NrJztcbiAgICAgICAgICAvLyAgIH1cbiAgICAgICAgICAvLyB9XG5cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB2YXIgYmxvY2tseVhtbCA9IHdpbmRvdy5CbG9ja2x5LlhtbC53b3Jrc3BhY2VUb0RvbSh3aW5kb3cuQmxvY2tseS5nZXRNYWluV29ya3NwYWNlKCkpO1xuICAgICAgICAgIHRoaXMud29ya3NwYWNlLnJlbW92ZUNoYW5nZUxpc3RlbmVyKHRoaXMudG9nZ2xlQmxvY2tseUV2ZW50KTtcbiAgICAgICAgICB0aGlzLndvcmtzcGFjZS5jbGVhcigpO1xuICAgICAgICAgIHdpbmRvdy5CbG9ja2x5LlhtbC5kb21Ub1dvcmtzcGFjZShibG9ja2x5WG1sLCB0aGlzLndvcmtzcGFjZSk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgaWYgKGV2dC5uYW1lID09ICdNb2RlbGluZ1RhYi5Ub2dnbGVSZXF1ZXN0Jykge1xuICAgICAgICB0aGlzLl9tb2RlbC50b2dnbGUoKTtcbiAgICAgICAgdGhpcy5fdmlldy50b2dnbGUodGhpcy5fbW9kZWwuZ2V0KCdvcGVuJykpO1xuXG4gICAgICAgIEdsb2JhbHMuZ2V0KCdMb2dnZXInKS5sb2coe1xuICAgICAgICAgIHR5cGU6IHRoaXMuX21vZGVsLmdldCgnb3BlbicpID8gJ29wZW4nIDogJ2Nsb3NlJyxcbiAgICAgICAgICBjYXRlZ29yeTogJ21vZGVsaW5nJyxcbiAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICBkaXNwbGF5U3RhdGU6IHRoaXMuX21vZGVsLmdldERpc3BsYXlTdGF0ZSgpLFxuICAgICAgICAgICAgdmlzdWFsaXphdGlvbjogJycvL3RoaXMudmlldygpLmdldEN1cnJlbnRWaXN1YWxpemF0aW9uKClcbiAgICAgICAgICB9XG4gICAgICAgIH0pXG4gICAgICB9IGVsc2UgaWYgKGV2dC5kYXRhLnRhYlR5cGUgPT0gJ2Jsb2NrbHknKSB7XG4gICAgICAgIHRoaXMuX21vZGVsLnRvZ2dsZSgpO1xuICAgICAgICB0aGlzLl92aWV3LnRvZ2dsZSh0aGlzLl9tb2RlbC5nZXQoJ29wZW4nKSk7XG4gICAgICB9IGVsc2UgaWYgKHRoaXMuX21vZGVsLmdldCgnb3BlbicpKSB7XG4gICAgICAgIHRoaXMuX21vZGVsLnRvZ2dsZSgpO1xuICAgICAgICB0aGlzLl92aWV3LnRvZ2dsZSh0aGlzLl9tb2RlbC5nZXQoJ29wZW4nKSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgX29uUmVzdWx0VG9nZ2xlUmVxdWVzdChldnQpIHtcbiAgICAgIC8vdGhpcy5fbW9kZWwudG9nZ2xlUmVzdWx0KGV2dC5kYXRhLnJlc3VsdElkKTtcbiAgICAgIEdsb2JhbHMuZ2V0KCdMb2dnZXInKS5sb2coe1xuICAgICAgICB0eXBlOiAncmVzdWx0X3RvZ2dsZScsXG4gICAgICAgIGNhdGVnb3J5OiAnbW9kZWxpbmcnLFxuICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgZGlzcGxheVN0YXRlOiB0aGlzLl9tb2RlbC5nZXREaXNwbGF5U3RhdGUoKSxcbiAgICAgICAgICB2aXN1YWxpemF0aW9uOiAnJy8vdGhpcy52aWV3KCkuZ2V0Q3VycmVudFZpc3VhbGl6YXRpb24oKVxuICAgICAgICB9XG4gICAgICB9KVxuICAgIH1cblxuICAgIF9vbkNsZWFyUmVxdWVzdChldnQpIHtcbiAgICAgIC8vdGhpcy5fbW9kZWwuY2xlYXJSZXN1bHQoZXZ0LmRhdGEucmVzdWx0SWQpO1xuICAgICAgR2xvYmFscy5nZXQoJ0xvZ2dlcicpLmxvZyh7XG4gICAgICAgIHR5cGU6ICdyZW1vdmVfZGF0YScsXG4gICAgICAgIGNhdGVnb3J5OiAnbW9kZWxpbmcnLFxuICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgcmVzdWx0SWQ6IGV2dC5kYXRhLnJlc3VsdElkLFxuICAgICAgICAgIGRpc3BsYXlTdGF0ZTogdGhpcy5fbW9kZWwuZ2V0RGlzcGxheVN0YXRlKCksXG4gICAgICAgICAgdmlzdWFsaXphdGlvbjogJycvL3RoaXMudmlldygpLmdldEN1cnJlbnRWaXN1YWxpemF0aW9uKClcbiAgICAgICAgfVxuICAgICAgfSlcbiAgICB9XG5cbiAgICBfb25DbGVhckFsbFJlcXVlc3QoZXZ0KSB7XG4gICAgICAvL3RoaXMuX21vZGVsLmNsZWFyUmVzdWx0R3JvdXAoZXZ0LmRhdGEuZXhwZXJpbWVudElkKTtcbiAgICAgIEdsb2JhbHMuZ2V0KCdMb2dnZXInKS5sb2coe1xuICAgICAgICB0eXBlOiAncmVtb3ZlX2dyb3VwJyxcbiAgICAgICAgY2F0ZWdvcnk6ICdtb2RlbGluZycsXG4gICAgICAgIGRhdGE6IHtcbiAgICAgICAgICBleHBlcmltZW50SWQ6IGV2dC5kYXRhLmV4cGVyaW1lbnRJZCxcbiAgICAgICAgICBkaXNwbGF5U3RhdGU6IHRoaXMuX21vZGVsLmdldERpc3BsYXlTdGF0ZSgpLFxuICAgICAgICAgIHZpc3VhbGl6YXRpb246ICcnLy90aGlzLnZpZXcoKS5nZXRDdXJyZW50VmlzdWFsaXphdGlvbigpXG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgfVxuXG5cbiAgICBfb25QaGFzZUNoYW5nZShldnQpIHtcbiAgICAgIGlmIChldnQuZGF0YS5waGFzZSA9PSBcImxvZ2luXCIgfHwgZXZ0LmRhdGEucGhhc2UgPT0gXCJsb2dpbl9hdHRlbXB0ZWRcIikge1xuICAgICAgICBpZiAoIUdsb2JhbHMuZ2V0KCdibG9ja2x5TG9hZGVkJykpIHtcblxuICAgICAgICAgIHZhciBibG9ja2x5T3B0aW9ucyA9IHtcbiAgICAgICAgICAgIHRvb2xib3ggOiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgndG9vbGJveCcpLFxuICAgICAgICAgICAgY29sbGFwc2UgOiB0cnVlLFxuICAgICAgICAgICAgY29tbWVudHMgOiB0cnVlLFxuICAgICAgICAgICAgZGlzYWJsZSA6IHRydWUsXG4gICAgICAgICAgICBtYXhCbG9ja3MgOiBJbmZpbml0eSxcbiAgICAgICAgICAgIHRyYXNoY2FuIDogdHJ1ZSxcbiAgICAgICAgICAgIGhvcml6b250YWxMYXlvdXQgOiB0cnVlLFxuICAgICAgICAgICAgdG9vbGJveFBvc2l0aW9uIDogJ3N0YXJ0JyxcbiAgICAgICAgICAgIGNzcyA6IHRydWUsXG4gICAgICAgICAgICBtZWRpYSA6ICdodHRwczovL2Jsb2NrbHktZGVtby5hcHBzcG90LmNvbS9zdGF0aWMvbWVkaWEvJyxcbiAgICAgICAgICAgIHJ0bCA6IGZhbHNlLFxuICAgICAgICAgICAgc2Nyb2xsYmFycyA6IHRydWUsXG4gICAgICAgICAgICBzb3VuZHMgOiB0cnVlLFxuICAgICAgICAgICAgb25lQmFzZWRJbmRleCA6IHRydWVcbiAgICAgICAgICB9O1xuXG4gICAgICAgICAgdGhpcy53b3Jrc3BhY2UgPSB3aW5kb3cuQmxvY2tseS5pbmplY3QoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ0Jsb2NrbHlEaXYnKSwgYmxvY2tseU9wdGlvbnMpO1xuXG4gICAgICAgICAgR2xvYmFscy5zZXQoJ2Jsb2NrbHlMb2FkZWQnLHRydWUpO1xuXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICB0b2dnbGVCbG9ja2x5RXZlbnQoZXZ0KSB7XG4gICAgICBpZiAoZXZ0LnR5cGUgIT0gJ3VpJykge1xuICAgICAgICBHbG9iYWxzLmdldCgnUmVsYXknKS5kaXNwYXRjaEV2ZW50KCdCbG9ja2x5LkNoYW5nZWQnLCB7YmxvY2tseUV2dDogZXZ0LCBtb2RlbFR5cGU6ICdibG9ja2x5J30pO1xuICAgICAgfVxuXG4gICAgICAvLyBDaGVjayB3aGV0aGVyIGEgYmxvY2sgd2l0aCBtYXhfdXNlIG9mIDEgaGFzIGJlZW4gY3JlYXRlZCByZXNwIGRlbGV0ZWQsIGFuZCBkaXNhYmxlIHJlc3AgZW5hYmxlLlxuICAgICAgaWYgKGV2dC50eXBlID09ICdjcmVhdGUnKSB7XG4gICAgICAgIHZhciBtb2RpZnlfYmxvY2sgPSB0cnVlO1xuICAgICAgICBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbCgkKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdkZWZhdWx0V29ya3NwYWNlQmxvY2tzJykpLmZpbmQoJ2Jsb2NrJykpLm1hcChibG9jayA9PiB7XG4gICAgICAgICAgaWYoYmxvY2suZ2V0QXR0cmlidXRlKCd0eXBlJykgPT09IHRoaXMud29ya3NwYWNlLmdldEJsb2NrQnlJZChldnQuYmxvY2tJZCkudHlwZSkgbW9kaWZ5X2Jsb2NrID0gZmFsc2U7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8vIE1hbmlwdWxhdGUgdGhlIHRvb2xib3ggYWNjb3JkaW5nIHRvIHdoaWNoIGVsZW1lbnRzIGhhdmUgbWF4X3VzZSBhbmQgd2hpY2ggb25lcyBub3QuXG4gICAgICAgIGlmIChtb2RpZnlfYmxvY2spIHtcbiAgICAgICAgICB2YXIgYmxvY2tfdHlwZSA9IHRoaXMud29ya3NwYWNlLmdldEJsb2NrQnlJZChldnQuYmxvY2tJZCkudHlwZTtcbiAgICAgICAgICB2YXIgY291bnRlciA9IDA7XG4gICAgICAgICAgdGhpcy53b3Jrc3BhY2UuZ2V0QWxsQmxvY2tzKCkuZm9yRWFjaChibG9jayA9PiB7XG4gICAgICAgICAgICBpZiAoYmxvY2sudHlwZSA9PT0gYmxvY2tfdHlwZSkgeyBjb3VudGVyICs9IDE7IH1cbiAgICAgICAgICB9KTtcblxuICAgICAgICAgIHZhciBibG9ja0RpdiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGJsb2NrX3R5cGUpO1xuICAgICAgICAgIGlmIChTdHJpbmcoY291bnRlcikgPj0gYmxvY2tEaXYuZ2V0QXR0cmlidXRlKCdtYXhfdXNlJykpIHtcbiAgICAgICAgICAgIGJsb2NrRGl2LnNldEF0dHJpYnV0ZSgnZGlzYWJsZWQnLHRydWUpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICAvLyBUaGVuIGNoZWNrIGlmIGEgYmxvY2sgaGFzIGJlZW4gZGVsZXRlZCB0aGF0IGhhcyBhIG1heF91c2Ugb2YgMS5cbiAgICAgIGlmIChldnQudHlwZSA9PSAnZGVsZXRlJykge1xuICAgICAgICB2YXIgYmxvY2tfdHlwZSA9IGV2dC5vbGRYbWwuZ2V0QXR0cmlidXRlKCd0eXBlJyk7XG4gICAgICAgIHZhciBjb3VudGVyID0gMDtcbiAgICAgICAgdGhpcy53b3Jrc3BhY2UuZ2V0QWxsQmxvY2tzKCkuZm9yRWFjaChibG9jayA9PiB7XG4gICAgICAgICAgaWYgKGJsb2NrLnR5cGUgPT09IGJsb2NrX3R5cGUpIHsgY291bnRlciArPSAxOyB9XG4gICAgICAgIH0pO1xuICAgICAgICB2YXIgYmxvY2tEaXYgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChibG9ja190eXBlKTtcbiAgICAgICAgaWYgKFN0cmluZyhjb3VudGVyKSA8IGJsb2NrRGl2LmdldEF0dHJpYnV0ZSgnbWF4X3VzZScpKSB7XG4gICAgICAgICAgYmxvY2tEaXYuc2V0QXR0cmlidXRlKCdkaXNhYmxlZCcsZmFsc2UpO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIC8vZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnW3R5cGU9Zm9yd2FyZF9zcGVlZF0nKVswXS5zZXRBdHRyaWJ1dGUoJ2Rpc2FibGVkJyx0cnVlKVxuICAgICAgLy9kb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCdbdHlwZT1mb3J3YXJkX3NwZWVkXScpWzBdLnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQoZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnW3R5cGU9Zm9yd2FyZF9zcGVlZF0nKVswXSlcblxuICAgICAgLy8gKioqKioqKioqIHBhcnNlIHRoZSBjb2RlIGZvciBlcnJvcnMgKioqKioqKioqXG4gICAgICAvLyBTZW5kIGFsZXJ0c1xuXG5cbiAgICB9XG5cbiAgICBfb25CbG9ja2x5TG9hZChldnQpIHtcbiAgICAgIC8vbGV0IHdvcmtzcGFjZSA9IHdpbmRvdy5CbG9ja2x5LmdldE1haW5Xb3Jrc3BhY2UoKTtcblxuICAgICAgaWYgKCF0aGlzLndvcmtzcGFjZSkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJCbG9ja2x5IHdvcmtzcGFjZSBkb2VzIG5vdCBleGlzdC5cIik7XG4gICAgICB9XG4gICAgICB0aGlzLndvcmtzcGFjZS5yZW1vdmVDaGFuZ2VMaXN0ZW5lcih0aGlzLnRvZ2dsZUJsb2NrbHlFdmVudCk7XG4gICAgICB0aGlzLndvcmtzcGFjZS5jbGVhcigpO1xuXG4gICAgICBpZiAoZXZ0LmRhdGEpIHtcbiAgICAgICAgLy9jb25zdCBibG9ja2x5WG1sID0gd2luZG93LlhtbC50ZXh0VG9Eb20oZXZ0LmRhdGEpXG4gICAgICAgIGNvbnN0IGJsb2NrbHlYbWwgPSAkLnBhcnNlWE1MKGV2dC5kYXRhKS5kb2N1bWVudEVsZW1lbnQ7XG4gICAgICAgIHdpbmRvdy5CbG9ja2x5LlhtbC5kb21Ub1dvcmtzcGFjZShibG9ja2x5WG1sLCB0aGlzLndvcmtzcGFjZSk7Ly8udGhlbigoKSA9PiB7Y29uc29sZS5sb2coJ2hlcmUnKX0pO1xuXG4gICAgICAgIGNvbnN0IHByZXNlbnRCbG9ja3MgPSB0aGlzLndvcmtzcGFjZS5nZXRBbGxCbG9ja3MoKTtcbiAgICAgICAgcHJlc2VudEJsb2Nrcy5tYXAoYmxvY2sgPT4ge1xuICAgICAgICAgIHZhciBibG9ja0RpdiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGJsb2NrLnR5cGUpO1xuICAgICAgICAgIGlmIChibG9ja0Rpdikge1xuICAgICAgICAgICAgaWYgKGJsb2NrRGl2LmdldEF0dHJpYnV0ZSgnbWF4X3VzZScpID09PSAnMScpIHtcbiAgICAgICAgICAgICAgYmxvY2tEaXYuc2V0QXR0cmlidXRlKCdkaXNhYmxlZCcsdHJ1ZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH1cblxuICAgICAgaWYgKCF0aGlzLndvcmtzcGFjZS5nZXRBbGxCbG9ja3MoKS5sZW5ndGgpIHtcbiAgICAgICAgdmFyIGRlZmF1bHRXb3Jrc3BhY2VCbG9ja3MgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImRlZmF1bHRXb3Jrc3BhY2VCbG9ja3NcIik7XG4gICAgICAgIHdpbmRvdy5CbG9ja2x5LlhtbC5kb21Ub1dvcmtzcGFjZShkZWZhdWx0V29ya3NwYWNlQmxvY2tzLCB0aGlzLndvcmtzcGFjZSk7XG4gICAgICB9XG5cbiAgICB9XG5cbiAgICBfbGlzdGVuQmxvY2tseUV2ZW50cyhldnQpIHtcbiAgICAgIGlmIChldnQuZGF0YS50eXBlPT09ICdtb2RlbCcgJiYgIXRoaXMud29ya3NwYWNlLmxpc3RlbmVyc18ubGVuZ3RoKSB7XG4gICAgICAgIHRoaXMud29ya3NwYWNlLmFkZENoYW5nZUxpc3RlbmVyKHRoaXMudG9nZ2xlQmxvY2tseUV2ZW50KTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBfb25Cb2R5Q2hhbmdlKGV2dCkge1xuICAgICAgLy92YXIgdG9vbGJveGVsZW0gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInRvb2xib3hcIilcbiAgICAgIC8vdGhpcy53b3Jrc3BhY2UudXBkYXRlVG9vbGJveCh0b29sYm94ZWxlbSlcblxuICAgICAgdGhpcy5fbnVtU2Vuc29ycyA9IGV2dC5kYXRhLm51bVNlbnNvcnM7XG5cbiAgICAgIC8vIEhpZGUgb3IgZGlzYWJsZSBibG9ja3MgaW4gdGhlIHRvb2xib3ggdGhhdCBkbyBub3QgY29ycmVzcG9uZCB0byB0aGUgbnVtYmVyIG9mIHNlbnNvclBvc2l0aW9uXG4gICAgICB2YXIgYmxvY2tzSW5Ub29sYm94ID0gdG9vbGJveC5nZXRFbGVtZW50c0J5VGFnTmFtZSgnYmxvY2snKTtcbiAgICAgIGZvciAodmFyIGlkeCA9IDA7IGlkeCA8IGJsb2Nrc0luVG9vbGJveC5sZW5ndGg7IGlkeCsrKSB7XG4gICAgICAgIGxldCBibG9jayA9IGJsb2Nrc0luVG9vbGJveFtpZHhdO1xuXG4gICAgICAgIGxldCBudW1TZW5zb3JzID0gbnVsbDtcbiAgICAgICAgc3dpdGNoKGJsb2NrLmdldEF0dHJpYnV0ZSgnc2Vuc29ycycpKSB7XG4gICAgICAgICAgY2FzZSAnb25lJzpcbiAgICAgICAgICAgIG51bVNlbnNvcnMgPSAxO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIGNhc2UgJ3R3byc6XG4gICAgICAgICAgICBudW1TZW5zb3JzID0gMjtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChudW1TZW5zb3JzICYmIChTdHJpbmcobnVtU2Vuc29ycykgIT0gZXZ0LmRhdGEubnVtU2Vuc29ycykpIHtcbiAgICAgICAgICBibG9jay5zZXRBdHRyaWJ1dGUoJ2Rpc2FibGVkJyx0cnVlKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBibG9jay5zZXRBdHRyaWJ1dGUoJ2Rpc2FibGVkJyxmYWxzZSk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgLy8gbGV0IG9uZUV5ZURpdiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwib25lLWV5ZVwiKTtcbiAgICAgIC8vIGxldCB0d29FeWVEaXYgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInR3by1leWVzXCIpO1xuICAgICAgLy9cbiAgICAgIC8vIGlmIChvbmVFeWVEaXYgJiYgdHdvRXllRGl2KSB7IC8vIFdpbGwgbm90IGFjdGl2YXRlIG9uIGluaXRpYWwgbG9hZGluZyBvZiBwYWdlXG4gICAgICAvLyAgIGlmIChldnQuZGF0YS5udW1TZW5zb3JzID09PSAxKSB7XG4gICAgICAvLyAgICAgb25lRXllRGl2LnN0eWxlLmRpc3BsYXk9J2Jsb2NrJztcbiAgICAgIC8vICAgICB0d29FeWVEaXYuc3R5bGUuZGlzcGxheT0nbm9uZSc7XG4gICAgICAvLyAgIH0gZWxzZSB7XG4gICAgICAvLyAgICAgb25lRXllRGl2LnN0eWxlLmRpc3BsYXk9J25vbmUnO1xuICAgICAgLy8gICAgIHR3b0V5ZURpdi5zdHlsZS5kaXNwbGF5PSdibG9jayc7XG4gICAgICAvLyAgIH1cbiAgICAgIC8vIH1cblxuICAgICAgLy8gUmVwbGFjZSBibG9ja3MgaW4gdGhlIHdvcmtzcGFjZSB0aGF0IGRvIG5vdCBjb3JyZXNwb25kIHRvIHRoZSBudW1iZXIgb2Ygc2Vuc29ycyB3aXRoIG9uZXMgdGhhdCBkbywgd2hlcmUgcG9zc2libGUuXG4gICAgICAvLyBJbiBwYXJ0aWN1bGFyOiB0dXJuX2F0XzFzZW5zb3Igb3IgdHVybl9hdF8xc2Vuc29yX2V5ZXNwb3QgdnMgdHVybl9hdF8yc2Vuc29yc1xuICAgICAgLy8gVXNlIHRoZSBhdHRyaWJ1dGUgJ2VxdWl2YWxlbmNlJyBvZiB0aGUgZGl2cyB0byByZXBsYWNlIHRoZSBibG9ja3NcbiAgICAgIGlmICh0aGlzLndvcmtzcGFjZSkge1xuICAgICAgICB0aGlzLndvcmtzcGFjZS5yZW1vdmVDaGFuZ2VMaXN0ZW5lcih0aGlzLnRvZ2dsZUJsb2NrbHlFdmVudCk7XG5cbiAgICAgICAgdmFyIGJsb2NrbHlYbWwgPSB3aW5kb3cuQmxvY2tseS5YbWwud29ya3NwYWNlVG9Eb20od2luZG93LkJsb2NrbHkuZ2V0TWFpbldvcmtzcGFjZSgpKTtcbiAgICAgICAgdmFyIGJsb2Nrc0luV29ya3NwYWNlID0gYmxvY2tseVhtbC5nZXRFbGVtZW50c0J5VGFnTmFtZSgnYmxvY2snKVxuICAgICAgICBmb3IgKHZhciBpZHggPSAwOyBpZHggPCBibG9ja3NJbldvcmtzcGFjZS5sZW5ndGg7IGlkeCsrKSB7XG4gICAgICAgICAgbGV0IG9sZEJsb2NrID0gYmxvY2tzSW5Xb3Jrc3BhY2VbaWR4XTtcbiAgICAgICAgICBsZXQgb2xkQmxvY2tEaXYgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChvbGRCbG9jay5pZClcbiAgICAgICAgICBpZiAob2xkQmxvY2tEaXYuZ2V0QXR0cmlidXRlKCdlcXVpdmFsZW5jZScpKSB7XG4gICAgICAgICAgICBsZXQgbmV3QmxvY2sgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChvbGRCbG9ja0Rpdi5nZXRBdHRyaWJ1dGUoJ2VxdWl2YWxlbmNlJykpLmNsb25lTm9kZSh0cnVlKTtcbiAgICAgICAgICAgIGxldCBwYXJlbnRCbG9jayA9IG9sZEJsb2NrLnBhcmVudE5vZGU7XG4gICAgICAgICAgICBsZXQgYXBwZW5kQ2hpbGQgPSBvbGRCbG9jay5nZXRFbGVtZW50c0J5VGFnTmFtZSgnbmV4dCcpLmxlbmd0aCA/IG9sZEJsb2NrLmdldEVsZW1lbnRzQnlUYWdOYW1lKCduZXh0JylbMF0gOiBudWxsO1xuICAgICAgICAgICAgaWYgKGFwcGVuZENoaWxkKSBuZXdCbG9jay5hcHBlbmRDaGlsZChhcHBlbmRDaGlsZCk7XG5cbiAgICAgICAgICAgIC8vIFJlcGxhY2UgdGhlIGZpZWxkIHZhbHVlcyB3aGVyZSBwb3NzaWJsZVxuICAgICAgICAgICAgaWYgKG9sZEJsb2NrRGl2LmlkLm1hdGNoKCd0dXJuX2F0XycpKSB7XG4gICAgICAgICAgICAgIGxldCBmaWVsZFZhbHVlID0gb2xkQmxvY2suZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ2ZpZWxkJylbJ0RJUkVDVElPTiddLmlubmVySFRNTDtcbiAgICAgICAgICAgICAgbmV3QmxvY2suZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ2ZpZWxkJylbJ0RJUkVDVElPTiddLmlubmVySFRNTCA9IGZpZWxkVmFsdWU7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHBhcmVudEJsb2NrLmZpcnN0Q2hpbGQucmVtb3ZlKCk7XG4gICAgICAgICAgICBwYXJlbnRCbG9jay5hcHBlbmQobmV3QmxvY2spO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICB0aGlzLndvcmtzcGFjZS5jbGVhcigpO1xuICAgICAgICB3aW5kb3cuQmxvY2tseS5YbWwuZG9tVG9Xb3Jrc3BhY2UoYmxvY2tseVhtbCwgdGhpcy53b3Jrc3BhY2UpO1xuICAgICAgICB0aGlzLndvcmtzcGFjZS5hZGRDaGFuZ2VMaXN0ZW5lcih0aGlzLnRvZ2dsZUJsb2NrbHlFdmVudClcbiAgICAgIH1cblxuLypcbiAgICAgICAgdGhpcy53b3Jrc3BhY2UuZ2V0QWxsQmxvY2tzKCkuZm9yRWFjaChibG9jayA9PiB7XG4gICAgICAgICAgdmFyIGJsb2NrRGl2ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoYmxvY2sudHlwZSk7XG4gICAgICAgICAgaWYgKGJsb2NrRGl2KSB7XG4gICAgICAgICAgICAvLyBDaGVjayB3aGV0aGVyIHRoZSBibG9jayBoYXMgdG8gYmUgcmVwbGFjZWRcbiAgICAgICAgICAgIGxldCBudW1TZW5zb3JzID0gbnVsbDtcbiAgICAgICAgICAgIHN3aXRjaChibG9ja0Rpdi5nZXRBdHRyaWJ1dGUoJ3NlbnNvcnMnKSkge1xuICAgICAgICAgICAgICBjYXNlICdvbmUnOlxuICAgICAgICAgICAgICAgIG51bVNlbnNvcnMgPSAxO1xuICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgY2FzZSAndHdvJzpcbiAgICAgICAgICAgICAgICBudW1TZW5zb3JzID0gMjtcbiAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChudW1TZW5zb3JzICYmIChTdHJpbmcobnVtU2Vuc29ycykgIT0gZXZ0LmRhdGEubnVtU2Vuc29ycykpIHtcbiAgICAgICAgICAgICAgaWYgKGJsb2NrRGl2LmdldEF0dHJpYnV0ZSgnZXF1aXZhbGVuY2UnKSkge1xuICAgICAgICAgICAgICAgIHZhciBuZXdCbG9ja0RpdiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGJsb2NrRGl2LmdldEF0dHJpYnV0ZSgnZXF1aXZhbGVuY2UnKSkuY2xvbmVOb2RlKHRydWUpO1xuICAgICAgICAgICAgICAgIG5ld0Jsb2NrRGl2LnNldEF0dHJpYnV0ZSgnZGlzYWJsZWQnLGZhbHNlKTtcblxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICovXG4gICAgfVxuXG4gIH1cblxuICBNb2RlbGluZ0RhdGFUYWIuY3JlYXRlID0gKGRhdGEgPSB7fSkgPT4ge1xuICAgIHJldHVybiBuZXcgTW9kZWxpbmdEYXRhVGFiKHsgbW9kZWxEYXRhOiBkYXRhIH0pXG4gIH1cblxuICByZXR1cm4gTW9kZWxpbmdEYXRhVGFiO1xufSlcbiJdfQ==
