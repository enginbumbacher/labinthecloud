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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9ldWdsZW5hL21vZGVsX2Jsb2NrbHkvYmxvY2tseXRhYi90YWIuanMiXSwibmFtZXMiOlsiZGVmaW5lIiwicmVxdWlyZSIsIlV0aWxzIiwiR2xvYmFscyIsIkhNIiwiQ29tcG9uZW50IiwiTW9kZWwiLCJWaWV3IiwiTW9kZWxpbmdEYXRhVGFiIiwic2V0dGluZ3MiLCJtb2RlbENsYXNzIiwidmlld0NsYXNzIiwiYmluZE1ldGhvZHMiLCJzZXQiLCJnZXQiLCJhZGRFdmVudExpc3RlbmVyIiwiX29uVG9nZ2xlUmVxdWVzdCIsIl9vblBoYXNlQ2hhbmdlIiwiX29uQmxvY2tseUxvYWQiLCJfbGlzdGVuQmxvY2tseUV2ZW50cyIsIl9vbkRpc2FibGVSZXF1ZXN0IiwiX29uRW5hYmxlUmVxdWVzdCIsIl9vbkJvZHlDaGFuZ2UiLCJldnQiLCJ2aWV3IiwiZGlzYWJsZSIsIndvcmtzcGFjZSIsIm9wdGlvbnMiLCJyZWFkT25seSIsIm1heEJsb2NrcyIsImVuYWJsZSIsImhpZGUiLCJzaG93IiwiX21vZGVsIiwiZ2V0QWxsQmxvY2tzIiwibGVuZ3RoIiwiZGVmYXVsdFdvcmtzcGFjZUJsb2NrcyIsImRvY3VtZW50IiwiZ2V0RWxlbWVudEJ5SWQiLCJ3aW5kb3ciLCJCbG9ja2x5IiwiWG1sIiwiZG9tVG9Xb3Jrc3BhY2UiLCJibG9ja2x5WG1sIiwid29ya3NwYWNlVG9Eb20iLCJnZXRNYWluV29ya3NwYWNlIiwicmVtb3ZlQ2hhbmdlTGlzdGVuZXIiLCJ0b2dnbGVCbG9ja2x5RXZlbnQiLCJjbGVhciIsIm5hbWUiLCJ0b2dnbGUiLCJfdmlldyIsImxvZyIsInR5cGUiLCJjYXRlZ29yeSIsImRhdGEiLCJkaXNwbGF5U3RhdGUiLCJnZXREaXNwbGF5U3RhdGUiLCJ2aXN1YWxpemF0aW9uIiwidGFiVHlwZSIsInJlc3VsdElkIiwiZXhwZXJpbWVudElkIiwicGhhc2UiLCJibG9ja2x5T3B0aW9ucyIsInRvb2xib3giLCJjb2xsYXBzZSIsImNvbW1lbnRzIiwiSW5maW5pdHkiLCJ0cmFzaGNhbiIsImhvcml6b250YWxMYXlvdXQiLCJ0b29sYm94UG9zaXRpb24iLCJjc3MiLCJtZWRpYSIsInJ0bCIsInNjcm9sbGJhcnMiLCJzb3VuZHMiLCJvbmVCYXNlZEluZGV4IiwiaW5qZWN0IiwidG9vbGJveF9zY3JvbGxiYXJzIiwiZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSIsImlkeCIsInN0eWxlIiwiZmlsbCIsImRpc3BhdGNoRXZlbnQiLCJibG9ja2x5RXZ0IiwibW9kZWxUeXBlIiwibW9kaWZ5X2Jsb2NrIiwiQXJyYXkiLCJwcm90b3R5cGUiLCJzbGljZSIsImNhbGwiLCIkIiwiZmluZCIsIm1hcCIsImJsb2NrIiwiZ2V0QXR0cmlidXRlIiwiZ2V0QmxvY2tCeUlkIiwiYmxvY2tJZCIsImJsb2NrX3R5cGUiLCJjb3VudGVyIiwiZm9yRWFjaCIsImJsb2NrRGl2IiwiU3RyaW5nIiwic2V0QXR0cmlidXRlIiwib2xkWG1sIiwiRXJyb3IiLCJwYXJzZVhNTCIsImRvY3VtZW50RWxlbWVudCIsInByZXNlbnRCbG9ja3MiLCJsaXN0ZW5lcnNfIiwiYWRkQ2hhbmdlTGlzdGVuZXIiLCJfbnVtU2Vuc29ycyIsIm51bVNlbnNvcnMiLCJibG9ja3NJblRvb2xib3giLCJnZXRFbGVtZW50c0J5VGFnTmFtZSIsImJsb2Nrc0luV29ya3NwYWNlIiwib2xkQmxvY2siLCJvbGRCbG9ja0RpdiIsImlkIiwibmV3QmxvY2siLCJjbG9uZU5vZGUiLCJwYXJlbnRCbG9jayIsInBhcmVudE5vZGUiLCJhcHBlbmRDaGlsZCIsIm1hdGNoIiwiZmllbGRWYWx1ZSIsImlubmVySFRNTCIsImZpcnN0Q2hpbGQiLCJyZW1vdmUiLCJhcHBlbmQiLCJjcmVhdGUiLCJtb2RlbERhdGEiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBQUEsT0FBTyxVQUFDQyxPQUFELEVBQWE7QUFDbEIsTUFBTUMsUUFBUUQsUUFBUSxpQkFBUixDQUFkO0FBQUEsTUFDRUUsVUFBVUYsUUFBUSxvQkFBUixDQURaO0FBQUEs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QSxJQVNZMUMsU0FUWjs7QUFnWGxCRyxrQkFBZ0IwSCxNQUFoQixHQUF5QixZQUFlO0FBQUEsUUFBZDNFLElBQWMsdUVBQVAsRUFBTzs7QUFDdEMsV0FBTyxJQUFJL0MsZUFBSixDQUFvQixFQUFFMkgsV0FBVzVFLElBQWIsRUFBcEIsQ0FBUDtBQUNELEdBRkQ7O0FBSUEsU0FBTy9DLGVBQVA7QUFDRCxDQXJYRCIsImZpbGUiOiJtb2R1bGUvZXVnbGVuYS9tb2RlbF9ibG9ja2x5L2Jsb2NrbHl0YWIvdGFiLmpzIiwic291cmNlc0NvbnRlbnQiOlsiZGVmaW5lKChyZXF1aXJlKSA9PiB7XG4gIGNvbnN0IFV0aWxzID0gcmVxdWlyZSgnY29yZS91dGlsL3V0aWxzJyksXG4gICAgR2xvYmFscyA9IHJlcXVpcmUoJ2NvcmUvbW9kZWwvZ2xvYmFscycpLFxuICAgIEhNID0gcmVxdWlyZSgnY29yZS9ldmVudC9ob29rX21hbmFnZXInKTtcblxuICBjb25zdCBDb21wb25lbnQgPSByZXF1aXJlKCdjb3JlL2NvbXBvbmVudC9jb21wb25lbnQnKSxcbiAgICBNb2RlbCA9IHJlcXVpcmUoJy4vbW9kZWwnKSxcbiAgICBWaWV3ID0gcmVxdWlyZSgnLi92aWV3Jyk7XG5cbiAgY2xhc3MgTW9kZWxpbmdEYXRhVGFiIGV4dGVuZHMgQ29tcG9uZW50IHtcbiAgICBjb25zdHJ1Y3RvcihzZXR0aW5ncyA9IHt9KSB7XG4gICAgICBzZXR0aW5ncy5tb2RlbENsYXNzID0gc2V0dGluZ3MubW9kZWxDbGFzcyB8fCBNb2RlbDtcbiAgICAgIHNldHRpbmdzLnZpZXdDbGFzcyA9IHNldHRpbmdzLnZpZXdDbGFzcyB8fCBWaWV3O1xuICAgICAgc3VwZXIoc2V0dGluZ3MpO1xuICAgICAgVXRpbHMuYmluZE1ldGhvZHModGhpcywgWydfb25Ub2dnbGVSZXF1ZXN0JywgJ19vblJlc3VsdFRvZ2dsZVJlcXVlc3QnLCAnX29uQ2xlYXJBbGxSZXF1ZXN0JywgJ19vbkNsZWFyUmVxdWVzdCcsICdfb25QaGFzZUNoYW5nZScsXG4gICAgICAndG9nZ2xlQmxvY2tseUV2ZW50JywgJ19vbkJsb2NrbHlMb2FkJywgJ19saXN0ZW5CbG9ja2x5RXZlbnRzJywnX29uRGlzYWJsZVJlcXVlc3QnLCdfb25FbmFibGVSZXF1ZXN0JywnX29uQm9keUNoYW5nZSddKVxuXG4gICAgICBHbG9iYWxzLnNldCgnYmxvY2tseUxvYWRlZCcsZmFsc2UpO1xuXG4gICAgICBHbG9iYWxzLmdldCgnUmVsYXknKS5hZGRFdmVudExpc3RlbmVyKCdNb2RlbGluZ1RhYi5Ub2dnbGVSZXF1ZXN0JywgdGhpcy5fb25Ub2dnbGVSZXF1ZXN0KVxuICAgICAgR2xvYmFscy5nZXQoJ1JlbGF5JykuYWRkRXZlbnRMaXN0ZW5lcignVGFiLkNoYW5nZScsIHRoaXMuX29uVG9nZ2xlUmVxdWVzdClcblxuICAgICAgR2xvYmFscy5nZXQoJ1JlbGF5JykuYWRkRXZlbnRMaXN0ZW5lcignQXBwUGhhc2UuQ2hhbmdlJywgdGhpcy5fb25QaGFzZUNoYW5nZSlcbiAgICAgIEdsb2JhbHMuZ2V0KCdSZWxheScpLmFkZEV2ZW50TGlzdGVuZXIoJ0Jsb2NrbHkuTG9hZCcsIHRoaXMuX29uQmxvY2tseUxvYWQpXG5cbiAgICAgIEdsb2JhbHMuZ2V0KCdSZWxheScpLmFkZEV2ZW50TGlzdGVuZXIoJ05vdGlmaWNhdGlvbnMuUmVtb3ZlJyx0aGlzLl9saXN0ZW5CbG9ja2x5RXZlbnRzKVxuICAgICAgR2xvYmFscy5nZXQoJ1JlbGF5JykuYWRkRXZlbnRMaXN0ZW5lcignTW9kZWxpbmdUYWIuVHJhbnNpdGlvbkVuZCcsdGhpcy5fbGlzdGVuQmxvY2tseUV2ZW50cylcblxuICAgICAgR2xvYmFscy5nZXQoJ1JlbGF5JykuYWRkRXZlbnRMaXN0ZW5lcignTm90aWZpY2F0aW9ucy5BZGQnLHRoaXMuX29uRGlzYWJsZVJlcXVlc3QpO1xuICAgICAgR2xvYmFscy5nZXQoJ1JlbGF5JykuYWRkRXZlbnRMaXN0ZW5lcignTm90aWZpY2F0aW9ucy5SZW1vdmUnLHRoaXMuX29uRW5hYmxlUmVxdWVzdCk7XG5cbiAgICAgIEdsb2JhbHMuZ2V0KCdSZWxheScpLmFkZEV2ZW50TGlzdGVuZXIoJ0JvZHkuQ2hhbmdlJywgdGhpcy5fb25Cb2R5Q2hhbmdlKTtcblxuXG4gICAgfVxuXG4gICAgX29uRGlzYWJsZVJlcXVlc3QoZXZ0KXtcbiAgICAgIHRoaXMudmlldygpLmRpc2FibGUoKTtcbiAgICAgIHRoaXMud29ya3NwYWNlLm9wdGlvbnMucmVhZE9ubHkgPSB0cnVlO1xuICAgICAgdGhpcy53b3Jrc3BhY2Uub3B0aW9ucy5tYXhCbG9ja3MgPSAwO1xuICAgIH1cblxuICAgIF9vbkVuYWJsZVJlcXVlc3QoZXZ0KXtcbiAgICAgIHRoaXMudmlldygpLmVuYWJsZSgpO1xuICAgICAgdGhpcy53b3Jrc3BhY2Uub3B0aW9ucy5yZWFkT25seSA9IGZhbHNlO1xuICAgICAgdGhpcy53b3Jrc3BhY2Uub3B0aW9ucy5tYXhCbG9ja3MgPSA1MDtcbiAgICB9XG5cbiAgICBoaWRlKCkge1xuICAgICAgdGhpcy52aWV3KCkuaGlkZSgpO1xuICAgIH1cblxuICAgIHNob3coKSB7XG4gICAgICB0aGlzLnZpZXcoKS5zaG93KCk7XG4gICAgfVxuXG4gICAgX29uVG9nZ2xlUmVxdWVzdChldnQpIHtcbiAgICAgIC8vIFJlbG9hZCB0aGUgYmxvY2tzIG9uY2UgdG9nZ2xlZCwgdG8gcHJldmVudCB0aGVtIGZyb20gYmVpbmcgc211c2hlZFxuICAgICAgaWYgKCF0aGlzLl9tb2RlbC5nZXQoJ29wZW4nKSkge1xuICAgICAgICBpZiAoIXRoaXMud29ya3NwYWNlLmdldEFsbEJsb2NrcygpLmxlbmd0aCkge1xuICAgICAgICAgIHZhciBkZWZhdWx0V29ya3NwYWNlQmxvY2tzID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJkZWZhdWx0V29ya3NwYWNlQmxvY2tzXCIpO1xuICAgICAgICAgIHdpbmRvdy5CbG9ja2x5LlhtbC5kb21Ub1dvcmtzcGFjZShkZWZhdWx0V29ya3NwYWNlQmxvY2tzLCB0aGlzLndvcmtzcGFjZSk7XG5cbiAgICAgICAgICAvLyBsZXQgb25lRXllRGl2ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJvbmUtZXllXCIpO1xuICAgICAgICAgIC8vIGxldCB0d29FeWVEaXYgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInR3by1leWVzXCIpO1xuICAgICAgICAgIC8vXG4gICAgICAgICAgLy8gaWYgKG9uZUV5ZURpdiAmJiB0d29FeWVEaXYpIHsgLy8gV2lsbCBub3QgYWN0aXZhdGUgb24gaW5pdGlhbCBsb2FkaW5nIG9mIHBhZ2VcbiAgICAgICAgICAvLyAgIGlmICh0aGlzLl9udW1TZW5zb3JzID09PSAxKSB7XG4gICAgICAgICAgLy8gICAgIG9uZUV5ZURpdi5zdHlsZS5kaXNwbGF5PSdibG9jayc7XG4gICAgICAgICAgLy8gICAgIHR3b0V5ZURpdi5zdHlsZS5kaXNwbGF5PSdub25lJztcbiAgICAgICAgICAvLyAgIH0gZWxzZSB7XG4gICAgICAgICAgLy8gICAgIG9uZUV5ZURpdi5zdHlsZS5kaXNwbGF5PSdub25lJztcbiAgICAgICAgICAvLyAgICAgdHdvRXllRGl2LnN0eWxlLmRpc3BsYXk9J2Jsb2NrJztcbiAgICAgICAgICAvLyAgIH1cbiAgICAgICAgICAvLyB9XG5cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB2YXIgYmxvY2tseVhtbCA9IHdpbmRvdy5CbG9ja2x5LlhtbC53b3Jrc3BhY2VUb0RvbSh3aW5kb3cuQmxvY2tseS5nZXRNYWluV29ya3NwYWNlKCkpO1xuICAgICAgICAgIHRoaXMud29ya3NwYWNlLnJlbW92ZUNoYW5nZUxpc3RlbmVyKHRoaXMudG9nZ2xlQmxvY2tseUV2ZW50KTtcbiAgICAgICAgICB0aGlzLndvcmtzcGFjZS5jbGVhcigpO1xuICAgICAgICAgIHdpbmRvdy5CbG9ja2x5LlhtbC5kb21Ub1dvcmtzcGFjZShibG9ja2x5WG1sLCB0aGlzLndvcmtzcGFjZSk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgaWYgKGV2dC5uYW1lID09ICdNb2RlbGluZ1RhYi5Ub2dnbGVSZXF1ZXN0Jykge1xuICAgICAgICB0aGlzLl9tb2RlbC50b2dnbGUoKTtcbiAgICAgICAgdGhpcy5fdmlldy50b2dnbGUodGhpcy5fbW9kZWwuZ2V0KCdvcGVuJykpO1xuXG4gICAgICAgIEdsb2JhbHMuZ2V0KCdMb2dnZXInKS5sb2coe1xuICAgICAgICAgIHR5cGU6IHRoaXMuX21vZGVsLmdldCgnb3BlbicpID8gJ29wZW4nIDogJ2Nsb3NlJyxcbiAgICAgICAgICBjYXRlZ29yeTogJ21vZGVsaW5nJyxcbiAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICBkaXNwbGF5U3RhdGU6IHRoaXMuX21vZGVsLmdldERpc3BsYXlTdGF0ZSgpLFxuICAgICAgICAgICAgdmlzdWFsaXphdGlvbjogJycvL3RoaXMudmlldygpLmdldEN1cnJlbnRWaXN1YWxpemF0aW9uKClcbiAgICAgICAgICB9XG4gICAgICAgIH0pXG4gICAgICB9IGVsc2UgaWYgKGV2dC5kYXRhLnRhYlR5cGUgPT0gJ2Jsb2NrbHknKSB7XG4gICAgICAgIHRoaXMuX21vZGVsLnRvZ2dsZSgpO1xuICAgICAgICB0aGlzLl92aWV3LnRvZ2dsZSh0aGlzLl9tb2RlbC5nZXQoJ29wZW4nKSk7XG4gICAgICB9IGVsc2UgaWYgKHRoaXMuX21vZGVsLmdldCgnb3BlbicpKSB7XG4gICAgICAgIHRoaXMuX21vZGVsLnRvZ2dsZSgpO1xuICAgICAgICB0aGlzLl92aWV3LnRvZ2dsZSh0aGlzLl9tb2RlbC5nZXQoJ29wZW4nKSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgX29uUmVzdWx0VG9nZ2xlUmVxdWVzdChldnQpIHtcbiAgICAgIC8vdGhpcy5fbW9kZWwudG9nZ2xlUmVzdWx0KGV2dC5kYXRhLnJlc3VsdElkKTtcbiAgICAgIEdsb2JhbHMuZ2V0KCdMb2dnZXInKS5sb2coe1xuICAgICAgICB0eXBlOiAncmVzdWx0X3RvZ2dsZScsXG4gICAgICAgIGNhdGVnb3J5OiAnbW9kZWxpbmcnLFxuICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgZGlzcGxheVN0YXRlOiB0aGlzLl9tb2RlbC5nZXREaXNwbGF5U3RhdGUoKSxcbiAgICAgICAgICB2aXN1YWxpemF0aW9uOiAnJy8vdGhpcy52aWV3KCkuZ2V0Q3VycmVudFZpc3VhbGl6YXRpb24oKVxuICAgICAgICB9XG4gICAgICB9KVxuICAgIH1cblxuICAgIF9vbkNsZWFyUmVxdWVzdChldnQpIHtcbiAgICAgIC8vdGhpcy5fbW9kZWwuY2xlYXJSZXN1bHQoZXZ0LmRhdGEucmVzdWx0SWQpO1xuICAgICAgR2xvYmFscy5nZXQoJ0xvZ2dlcicpLmxvZyh7XG4gICAgICAgIHR5cGU6ICdyZW1vdmVfZGF0YScsXG4gICAgICAgIGNhdGVnb3J5OiAnbW9kZWxpbmcnLFxuICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgcmVzdWx0SWQ6IGV2dC5kYXRhLnJlc3VsdElkLFxuICAgICAgICAgIGRpc3BsYXlTdGF0ZTogdGhpcy5fbW9kZWwuZ2V0RGlzcGxheVN0YXRlKCksXG4gICAgICAgICAgdmlzdWFsaXphdGlvbjogJycvL3RoaXMudmlldygpLmdldEN1cnJlbnRWaXN1YWxpemF0aW9uKClcbiAgICAgICAgfVxuICAgICAgfSlcbiAgICB9XG5cbiAgICBfb25DbGVhckFsbFJlcXVlc3QoZXZ0KSB7XG4gICAgICAvL3RoaXMuX21vZGVsLmNsZWFyUmVzdWx0R3JvdXAoZXZ0LmRhdGEuZXhwZXJpbWVudElkKTtcbiAgICAgIEdsb2JhbHMuZ2V0KCdMb2dnZXInKS5sb2coe1xuICAgICAgICB0eXBlOiAncmVtb3ZlX2dyb3VwJyxcbiAgICAgICAgY2F0ZWdvcnk6ICdtb2RlbGluZycsXG4gICAgICAgIGRhdGE6IHtcbiAgICAgICAgICBleHBlcmltZW50SWQ6IGV2dC5kYXRhLmV4cGVyaW1lbnRJZCxcbiAgICAgICAgICBkaXNwbGF5U3RhdGU6IHRoaXMuX21vZGVsLmdldERpc3BsYXlTdGF0ZSgpLFxuICAgICAgICAgIHZpc3VhbGl6YXRpb246ICcnLy90aGlzLnZpZXcoKS5nZXRDdXJyZW50VmlzdWFsaXphdGlvbigpXG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgfVxuXG5cbiAgICBfb25QaGFzZUNoYW5nZShldnQpIHtcbiAgICAgIGlmIChldnQuZGF0YS5waGFzZSA9PSBcImxvZ2luXCIgfHwgZXZ0LmRhdGEucGhhc2UgPT0gXCJsb2dpbl9hdHRlbXB0ZWRcIikge1xuICAgICAgICBpZiAoIUdsb2JhbHMuZ2V0KCdibG9ja2x5TG9hZGVkJykpIHtcblxuICAgICAgICAgIHZhciBibG9ja2x5T3B0aW9ucyA9IHtcbiAgICAgICAgICAgIHRvb2xib3ggOiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgndG9vbGJveCcpLFxuICAgICAgICAgICAgY29sbGFwc2UgOiB0cnVlLFxuICAgICAgICAgICAgY29tbWVudHMgOiB0cnVlLFxuICAgICAgICAgICAgZGlzYWJsZSA6IHRydWUsXG4gICAgICAgICAgICBtYXhCbG9ja3MgOiBJbmZpbml0eSxcbiAgICAgICAgICAgIHRyYXNoY2FuIDogdHJ1ZSxcbiAgICAgICAgICAgIGhvcml6b250YWxMYXlvdXQgOiB0cnVlLFxuICAgICAgICAgICAgdG9vbGJveFBvc2l0aW9uIDogJ3N0YXJ0JyxcbiAgICAgICAgICAgIGNzcyA6IHRydWUsXG4gICAgICAgICAgICBtZWRpYSA6ICdodHRwczovL2Jsb2NrbHktZGVtby5hcHBzcG90LmNvbS9zdGF0aWMvbWVkaWEvJyxcbiAgICAgICAgICAgIHJ0bCA6IGZhbHNlLFxuICAgICAgICAgICAgc2Nyb2xsYmFycyA6IHRydWUsXG4gICAgICAgICAgICBzb3VuZHMgOiB0cnVlLFxuICAgICAgICAgICAgb25lQmFzZWRJbmRleCA6IHRydWVcbiAgICAgICAgICB9O1xuXG4gICAgICAgICAgdGhpcy53b3Jrc3BhY2UgPSB3aW5kb3cuQmxvY2tseS5pbmplY3QoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ0Jsb2NrbHlEaXYnKSwgYmxvY2tseU9wdGlvbnMpO1xuXG4gICAgICAgICAgdmFyIHRvb2xib3hfc2Nyb2xsYmFycyA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ2Jsb2NrbHlTY3JvbGxiYXJIYW5kbGUnKTtcbiAgICAgICAgICBmb3IgKGxldCBpZHg9MDtpZHg8dG9vbGJveF9zY3JvbGxiYXJzLmxlbmd0aDtpZHgrKykge1xuICAgICAgICAgICAgdG9vbGJveF9zY3JvbGxiYXJzW2lkeF0uc3R5bGUuZmlsbD0nZ3JleSc7XG4gICAgICAgICAgfVxuXG5cbiAgICAgICAgICBHbG9iYWxzLnNldCgnYmxvY2tseUxvYWRlZCcsdHJ1ZSk7XG5cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIHRvZ2dsZUJsb2NrbHlFdmVudChldnQpIHtcbiAgICAgIGlmIChldnQudHlwZSAhPSAndWknKSB7XG4gICAgICAgIEdsb2JhbHMuZ2V0KCdSZWxheScpLmRpc3BhdGNoRXZlbnQoJ0Jsb2NrbHkuQ2hhbmdlZCcsIHtibG9ja2x5RXZ0OiBldnQsIG1vZGVsVHlwZTogJ2Jsb2NrbHknfSk7XG4gICAgICB9XG5cbiAgICAgIC8vIENoZWNrIHdoZXRoZXIgYSBibG9jayB3aXRoIG1heF91c2Ugb2YgMSBoYXMgYmVlbiBjcmVhdGVkIHJlc3AgZGVsZXRlZCwgYW5kIGRpc2FibGUgcmVzcCBlbmFibGUuXG4gICAgICBpZiAoZXZ0LnR5cGUgPT0gJ2NyZWF0ZScpIHtcbiAgICAgICAgdmFyIG1vZGlmeV9ibG9jayA9IHRydWU7XG4gICAgICAgIEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKCQoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2RlZmF1bHRXb3Jrc3BhY2VCbG9ja3MnKSkuZmluZCgnYmxvY2snKSkubWFwKGJsb2NrID0+IHtcbiAgICAgICAgICBpZihibG9jay5nZXRBdHRyaWJ1dGUoJ3R5cGUnKSA9PT0gdGhpcy53b3Jrc3BhY2UuZ2V0QmxvY2tCeUlkKGV2dC5ibG9ja0lkKS50eXBlKSBtb2RpZnlfYmxvY2sgPSBmYWxzZTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgLy8gTWFuaXB1bGF0ZSB0aGUgdG9vbGJveCBhY2NvcmRpbmcgdG8gd2hpY2ggZWxlbWVudHMgaGF2ZSBtYXhfdXNlIGFuZCB3aGljaCBvbmVzIG5vdC5cbiAgICAgICAgaWYgKG1vZGlmeV9ibG9jaykge1xuICAgICAgICAgIHZhciBibG9ja190eXBlID0gdGhpcy53b3Jrc3BhY2UuZ2V0QmxvY2tCeUlkKGV2dC5ibG9ja0lkKS50eXBlO1xuICAgICAgICAgIHZhciBjb3VudGVyID0gMDtcbiAgICAgICAgICB0aGlzLndvcmtzcGFjZS5nZXRBbGxCbG9ja3MoKS5mb3JFYWNoKGJsb2NrID0+IHtcbiAgICAgICAgICAgIGlmIChibG9jay50eXBlID09PSBibG9ja190eXBlKSB7IGNvdW50ZXIgKz0gMTsgfVxuICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgdmFyIGJsb2NrRGl2ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoYmxvY2tfdHlwZSk7XG4gICAgICAgICAgaWYgKFN0cmluZyhjb3VudGVyKSA+PSBibG9ja0Rpdi5nZXRBdHRyaWJ1dGUoJ21heF91c2UnKSkge1xuICAgICAgICAgICAgYmxvY2tEaXYuc2V0QXR0cmlidXRlKCdkaXNhYmxlZCcsdHJ1ZSk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIC8vIFRoZW4gY2hlY2sgaWYgYSBibG9jayBoYXMgYmVlbiBkZWxldGVkIHRoYXQgaGFzIGEgbWF4X3VzZSBvZiAxLlxuICAgICAgaWYgKGV2dC50eXBlID09ICdkZWxldGUnKSB7XG4gICAgICAgIHZhciBibG9ja190eXBlID0gZXZ0Lm9sZFhtbC5nZXRBdHRyaWJ1dGUoJ3R5cGUnKTtcbiAgICAgICAgdmFyIGNvdW50ZXIgPSAwO1xuICAgICAgICB0aGlzLndvcmtzcGFjZS5nZXRBbGxCbG9ja3MoKS5mb3JFYWNoKGJsb2NrID0+IHtcbiAgICAgICAgICBpZiAoYmxvY2sudHlwZSA9PT0gYmxvY2tfdHlwZSkgeyBjb3VudGVyICs9IDE7IH1cbiAgICAgICAgfSk7XG4gICAgICAgIHZhciBibG9ja0RpdiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGJsb2NrX3R5cGUpO1xuICAgICAgICBpZiAoU3RyaW5nKGNvdW50ZXIpIDwgYmxvY2tEaXYuZ2V0QXR0cmlidXRlKCdtYXhfdXNlJykpIHtcbiAgICAgICAgICBibG9ja0Rpdi5zZXRBdHRyaWJ1dGUoJ2Rpc2FibGVkJyxmYWxzZSk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgLy9kb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCdbdHlwZT1tb3ZlX2NoYW5nZV0nKVswXS5zZXRBdHRyaWJ1dGUoJ2Rpc2FibGVkJyx0cnVlKVxuICAgICAgLy9kb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCdbdHlwZT1tb3ZlX2NoYW5nZV0nKVswXS5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJ1t0eXBlPW1vdmVfY2hhbmdlXScpWzBdKVxuXG4gICAgICAvLyAqKioqKioqKiogcGFyc2UgdGhlIGNvZGUgZm9yIGVycm9ycyAqKioqKioqKipcbiAgICAgIC8vIFNlbmQgYWxlcnRzXG5cblxuICAgIH1cblxuICAgIF9vbkJsb2NrbHlMb2FkKGV2dCkge1xuICAgICAgLy9sZXQgd29ya3NwYWNlID0gd2luZG93LkJsb2NrbHkuZ2V0TWFpbldvcmtzcGFjZSgpO1xuXG4gICAgICBpZiAoIXRoaXMud29ya3NwYWNlKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcIkJsb2NrbHkgd29ya3NwYWNlIGRvZXMgbm90IGV4aXN0LlwiKTtcbiAgICAgIH1cbiAgICAgIHRoaXMud29ya3NwYWNlLnJlbW92ZUNoYW5nZUxpc3RlbmVyKHRoaXMudG9nZ2xlQmxvY2tseUV2ZW50KTtcbiAgICAgIHRoaXMud29ya3NwYWNlLmNsZWFyKCk7XG5cbiAgICAgIGlmIChldnQuZGF0YSkge1xuICAgICAgICAvL2NvbnN0IGJsb2NrbHlYbWwgPSB3aW5kb3cuWG1sLnRleHRUb0RvbShldnQuZGF0YSlcbiAgICAgICAgY29uc3QgYmxvY2tseVhtbCA9ICQucGFyc2VYTUwoZXZ0LmRhdGEpLmRvY3VtZW50RWxlbWVudDtcbiAgICAgICAgd2luZG93LkJsb2NrbHkuWG1sLmRvbVRvV29ya3NwYWNlKGJsb2NrbHlYbWwsIHRoaXMud29ya3NwYWNlKTsvLy50aGVuKCgpID0+IHtjb25zb2xlLmxvZygnaGVyZScpfSk7XG5cbiAgICAgICAgY29uc3QgcHJlc2VudEJsb2NrcyA9IHRoaXMud29ya3NwYWNlLmdldEFsbEJsb2NrcygpO1xuICAgICAgICBwcmVzZW50QmxvY2tzLm1hcChibG9jayA9PiB7XG4gICAgICAgICAgdmFyIGJsb2NrRGl2ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoYmxvY2sudHlwZSk7XG4gICAgICAgICAgaWYgKGJsb2NrRGl2KSB7XG4gICAgICAgICAgICBpZiAoYmxvY2tEaXYuZ2V0QXR0cmlidXRlKCdtYXhfdXNlJykgPT09ICcxJykge1xuICAgICAgICAgICAgICBibG9ja0Rpdi5zZXRBdHRyaWJ1dGUoJ2Rpc2FibGVkJyx0cnVlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfVxuXG4gICAgICBpZiAoIXRoaXMud29ya3NwYWNlLmdldEFsbEJsb2NrcygpLmxlbmd0aCkge1xuICAgICAgICB2YXIgZGVmYXVsdFdvcmtzcGFjZUJsb2NrcyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiZGVmYXVsdFdvcmtzcGFjZUJsb2Nrc1wiKTtcbiAgICAgICAgd2luZG93LkJsb2NrbHkuWG1sLmRvbVRvV29ya3NwYWNlKGRlZmF1bHRXb3Jrc3BhY2VCbG9ja3MsIHRoaXMud29ya3NwYWNlKTtcbiAgICAgIH1cblxuICAgIH1cblxuICAgIF9saXN0ZW5CbG9ja2x5RXZlbnRzKGV2dCkge1xuICAgICAgaWYgKGV2dC5kYXRhLnR5cGU9PT0gJ21vZGVsJyAmJiAhdGhpcy53b3Jrc3BhY2UubGlzdGVuZXJzXy5sZW5ndGgpIHtcbiAgICAgICAgdGhpcy53b3Jrc3BhY2UuYWRkQ2hhbmdlTGlzdGVuZXIodGhpcy50b2dnbGVCbG9ja2x5RXZlbnQpO1xuICAgICAgfVxuICAgIH1cblxuICAgIF9vbkJvZHlDaGFuZ2UoZXZ0KSB7XG4gICAgICAvL3ZhciB0b29sYm94ZWxlbSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwidG9vbGJveFwiKVxuICAgICAgLy90aGlzLndvcmtzcGFjZS51cGRhdGVUb29sYm94KHRvb2xib3hlbGVtKVxuXG4gICAgICB0aGlzLl9udW1TZW5zb3JzID0gZXZ0LmRhdGEubnVtU2Vuc29ycztcblxuICAgICAgLy8gSGlkZSBvciBkaXNhYmxlIGJsb2NrcyBpbiB0aGUgdG9vbGJveCB0aGF0IGRvIG5vdCBjb3JyZXNwb25kIHRvIHRoZSBudW1iZXIgb2Ygc2Vuc29yUG9zaXRpb25cbiAgICAgIHZhciBibG9ja3NJblRvb2xib3ggPSB0b29sYm94LmdldEVsZW1lbnRzQnlUYWdOYW1lKCdibG9jaycpO1xuICAgICAgZm9yICh2YXIgaWR4ID0gMDsgaWR4IDwgYmxvY2tzSW5Ub29sYm94Lmxlbmd0aDsgaWR4KyspIHtcbiAgICAgICAgbGV0IGJsb2NrID0gYmxvY2tzSW5Ub29sYm94W2lkeF07XG5cbiAgICAgICAgbGV0IG51bVNlbnNvcnMgPSBudWxsO1xuICAgICAgICBzd2l0Y2goYmxvY2suZ2V0QXR0cmlidXRlKCdzZW5zb3JzJykpIHtcbiAgICAgICAgICBjYXNlICdvbmUnOlxuICAgICAgICAgICAgbnVtU2Vuc29ycyA9IDE7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgY2FzZSAndHdvJzpcbiAgICAgICAgICAgIG51bVNlbnNvcnMgPSAyO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKG51bVNlbnNvcnMgJiYgKFN0cmluZyhudW1TZW5zb3JzKSAhPSBldnQuZGF0YS5udW1TZW5zb3JzKSkge1xuICAgICAgICAgIGJsb2NrLnNldEF0dHJpYnV0ZSgnZGlzYWJsZWQnLHRydWUpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGJsb2NrLnNldEF0dHJpYnV0ZSgnZGlzYWJsZWQnLGZhbHNlKTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICAvLyBsZXQgb25lRXllRGl2ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJvbmUtZXllXCIpO1xuICAgICAgLy8gbGV0IHR3b0V5ZURpdiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwidHdvLWV5ZXNcIik7XG4gICAgICAvL1xuICAgICAgLy8gaWYgKG9uZUV5ZURpdiAmJiB0d29FeWVEaXYpIHsgLy8gV2lsbCBub3QgYWN0aXZhdGUgb24gaW5pdGlhbCBsb2FkaW5nIG9mIHBhZ2VcbiAgICAgIC8vICAgaWYgKGV2dC5kYXRhLm51bVNlbnNvcnMgPT09IDEpIHtcbiAgICAgIC8vICAgICBvbmVFeWVEaXYuc3R5bGUuZGlzcGxheT0nYmxvY2snO1xuICAgICAgLy8gICAgIHR3b0V5ZURpdi5zdHlsZS5kaXNwbGF5PSdub25lJztcbiAgICAgIC8vICAgfSBlbHNlIHtcbiAgICAgIC8vICAgICBvbmVFeWVEaXYuc3R5bGUuZGlzcGxheT0nbm9uZSc7XG4gICAgICAvLyAgICAgdHdvRXllRGl2LnN0eWxlLmRpc3BsYXk9J2Jsb2NrJztcbiAgICAgIC8vICAgfVxuICAgICAgLy8gfVxuXG4gICAgICAvLyBSZXBsYWNlIGJsb2NrcyBpbiB0aGUgd29ya3NwYWNlIHRoYXQgZG8gbm90IGNvcnJlc3BvbmQgdG8gdGhlIG51bWJlciBvZiBzZW5zb3JzIHdpdGggb25lcyB0aGF0IGRvLCB3aGVyZSBwb3NzaWJsZS5cbiAgICAgIC8vIEluIHBhcnRpY3VsYXI6IHR1cm5fYXRfMXNlbnNvciBvciB0dXJuX2F0XzFzZW5zb3JfZXllc3BvdCB2cyB0dXJuX2F0XzJzZW5zb3JzXG4gICAgICAvLyBVc2UgdGhlIGF0dHJpYnV0ZSAnZXF1aXZhbGVuY2UnIG9mIHRoZSBkaXZzIHRvIHJlcGxhY2UgdGhlIGJsb2Nrc1xuICAgICAgaWYgKHRoaXMud29ya3NwYWNlKSB7XG4gICAgICAgIHRoaXMud29ya3NwYWNlLnJlbW92ZUNoYW5nZUxpc3RlbmVyKHRoaXMudG9nZ2xlQmxvY2tseUV2ZW50KTtcblxuICAgICAgICB2YXIgYmxvY2tseVhtbCA9IHdpbmRvdy5CbG9ja2x5LlhtbC53b3Jrc3BhY2VUb0RvbSh3aW5kb3cuQmxvY2tseS5nZXRNYWluV29ya3NwYWNlKCkpO1xuICAgICAgICB2YXIgYmxvY2tzSW5Xb3Jrc3BhY2UgPSBibG9ja2x5WG1sLmdldEVsZW1lbnRzQnlUYWdOYW1lKCdibG9jaycpXG4gICAgICAgIGZvciAodmFyIGlkeCA9IDA7IGlkeCA8IGJsb2Nrc0luV29ya3NwYWNlLmxlbmd0aDsgaWR4KyspIHtcbiAgICAgICAgICBsZXQgb2xkQmxvY2sgPSBibG9ja3NJbldvcmtzcGFjZVtpZHhdO1xuICAgICAgICAgIGxldCBvbGRCbG9ja0RpdiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKG9sZEJsb2NrLmlkKVxuICAgICAgICAgIGlmIChvbGRCbG9ja0Rpdi5nZXRBdHRyaWJ1dGUoJ2VxdWl2YWxlbmNlJykpIHtcbiAgICAgICAgICAgIGxldCBuZXdCbG9jayA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKG9sZEJsb2NrRGl2LmdldEF0dHJpYnV0ZSgnZXF1aXZhbGVuY2UnKSkuY2xvbmVOb2RlKHRydWUpO1xuICAgICAgICAgICAgbGV0IHBhcmVudEJsb2NrID0gb2xkQmxvY2sucGFyZW50Tm9kZTtcbiAgICAgICAgICAgIGxldCBhcHBlbmRDaGlsZCA9IG9sZEJsb2NrLmdldEVsZW1lbnRzQnlUYWdOYW1lKCduZXh0JykubGVuZ3RoID8gb2xkQmxvY2suZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ25leHQnKVswXSA6IG51bGw7XG4gICAgICAgICAgICBpZiAoYXBwZW5kQ2hpbGQpIG5ld0Jsb2NrLmFwcGVuZENoaWxkKGFwcGVuZENoaWxkKTtcblxuICAgICAgICAgICAgLy8gUmVwbGFjZSB0aGUgZmllbGQgdmFsdWVzIHdoZXJlIHBvc3NpYmxlXG4gICAgICAgICAgICBpZiAob2xkQmxvY2tEaXYuaWQubWF0Y2goJ3R1cm5fYXRfJykpIHtcbiAgICAgICAgICAgICAgbGV0IGZpZWxkVmFsdWUgPSBvbGRCbG9jay5nZXRFbGVtZW50c0J5VGFnTmFtZSgnZmllbGQnKVsnRElSRUNUSU9OJ10uaW5uZXJIVE1MO1xuICAgICAgICAgICAgICBuZXdCbG9jay5nZXRFbGVtZW50c0J5VGFnTmFtZSgnZmllbGQnKVsnRElSRUNUSU9OJ10uaW5uZXJIVE1MID0gZmllbGRWYWx1ZTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcGFyZW50QmxvY2suZmlyc3RDaGlsZC5yZW1vdmUoKTtcbiAgICAgICAgICAgIHBhcmVudEJsb2NrLmFwcGVuZChuZXdCbG9jayk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHRoaXMud29ya3NwYWNlLmNsZWFyKCk7XG4gICAgICAgIHdpbmRvdy5CbG9ja2x5LlhtbC5kb21Ub1dvcmtzcGFjZShibG9ja2x5WG1sLCB0aGlzLndvcmtzcGFjZSk7XG4gICAgICAgIHRoaXMud29ya3NwYWNlLmFkZENoYW5nZUxpc3RlbmVyKHRoaXMudG9nZ2xlQmxvY2tseUV2ZW50KVxuICAgICAgfVxuXG4vKlxuICAgICAgICB0aGlzLndvcmtzcGFjZS5nZXRBbGxCbG9ja3MoKS5mb3JFYWNoKGJsb2NrID0+IHtcbiAgICAgICAgICB2YXIgYmxvY2tEaXYgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChibG9jay50eXBlKTtcbiAgICAgICAgICBpZiAoYmxvY2tEaXYpIHtcbiAgICAgICAgICAgIC8vIENoZWNrIHdoZXRoZXIgdGhlIGJsb2NrIGhhcyB0byBiZSByZXBsYWNlZFxuICAgICAgICAgICAgbGV0IG51bVNlbnNvcnMgPSBudWxsO1xuICAgICAgICAgICAgc3dpdGNoKGJsb2NrRGl2LmdldEF0dHJpYnV0ZSgnc2Vuc29ycycpKSB7XG4gICAgICAgICAgICAgIGNhc2UgJ29uZSc6XG4gICAgICAgICAgICAgICAgbnVtU2Vuc29ycyA9IDE7XG4gICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICBjYXNlICd0d28nOlxuICAgICAgICAgICAgICAgIG51bVNlbnNvcnMgPSAyO1xuICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKG51bVNlbnNvcnMgJiYgKFN0cmluZyhudW1TZW5zb3JzKSAhPSBldnQuZGF0YS5udW1TZW5zb3JzKSkge1xuICAgICAgICAgICAgICBpZiAoYmxvY2tEaXYuZ2V0QXR0cmlidXRlKCdlcXVpdmFsZW5jZScpKSB7XG4gICAgICAgICAgICAgICAgdmFyIG5ld0Jsb2NrRGl2ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoYmxvY2tEaXYuZ2V0QXR0cmlidXRlKCdlcXVpdmFsZW5jZScpKS5jbG9uZU5vZGUodHJ1ZSk7XG4gICAgICAgICAgICAgICAgbmV3QmxvY2tEaXYuc2V0QXR0cmlidXRlKCdkaXNhYmxlZCcsZmFsc2UpO1xuXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgKi9cbiAgICB9XG5cbiAgfVxuXG4gIE1vZGVsaW5nRGF0YVRhYi5jcmVhdGUgPSAoZGF0YSA9IHt9KSA9PiB7XG4gICAgcmV0dXJuIG5ldyBNb2RlbGluZ0RhdGFUYWIoeyBtb2RlbERhdGE6IGRhdGEgfSlcbiAgfVxuXG4gIHJldHVybiBNb2RlbGluZ0RhdGFUYWI7XG59KVxuIl19
