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

      Utils.bindMethods(_this, ['_onToggleRequest', '_onResultToggleRequest', '_onClearAllRequest', '_onClearRequest', '_onPhaseChange', 'toggleBlocklyEvent', '_onBlocklyLoad', '_listenBlocklyEvents', '_onDisableRequest', '_onEnableRequest']);

      Globals.set('blocklyLoaded', false);

      Globals.get('Relay').addEventListener('ModelingTab.ToggleRequest', _this._onToggleRequest);
      Globals.get('Relay').addEventListener('Tab.Change', _this._onToggleRequest);

      Globals.get('Relay').addEventListener('AppPhase.Change', _this._onPhaseChange);
      Globals.get('Relay').addEventListener('Blockly.Load', _this._onBlocklyLoad);

      Globals.get('Relay').addEventListener('Notifications.Remove', _this._listenBlocklyEvents);
      Globals.get('Relay').addEventListener('ModelingTab.TransitionEnd', _this._listenBlocklyEvents);

      Globals.get('Relay').addEventListener('Notifications.Add', _this._onDisableRequest);
      Globals.get('Relay').addEventListener('Notifications.Remove', _this._onEnableRequest);

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
          } else {
            var blocklyXml = window.Blockly.Xml.workspaceToDom(window.Blockly.getMainWorkspace());
            this.workspace.removeChangeListener(this.toggleBlocklyEvent);
            this.workspace.clear();
            window.Blockly.Xml.domToWorkspace(blocklyXml, this.workspace);
          }
        }

        if (evt.name == 'ModelingTab.ToggleRequest') {
          this._model.toggle();

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
        } else if (this._model.get('open')) {
          this._model.toggle();
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

          if (modify_block) {
            var block_type = this.workspace.getBlockById(evt.blockId).type;
            var blockDiv = document.getElementById(block_type);
            if (blockDiv.getAttribute('max_use') === '1') {
              blockDiv.setAttribute('disabled', true);
            }
          }
        }

        // Then check if a block has been deleted that has a max_use of 1.
        if (evt.type == 'delete') {
          var block_type = evt.oldXml.getAttribute('type');
          var blockDiv = document.getElementById(block_type);
          if (blockDiv.getAttribute('max_use') === '1') {
            blockDiv.setAttribute('disabled', false);
          }
        }

        //document.querySelectorAll('[type=forward_speed]')[0].setAttribute('disabled',true)
        //document.querySelectorAll('[type=forward_speed]')[0].parentNode.removeChild(document.querySelectorAll('[type=forward_speed]')[0])

        //var toolboxelem = document.getElementById("toolbox")
        //this.workspace.updateToolbox(toolboxelem)

        // Manipulate the toolbox according to which elements have max_use and which ones not.

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
    }]);

    return ModelingDataTab;
  }(Component);

  ModelingDataTab.create = function () {
    var data = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    return new ModelingDataTab({ modelData: data });
  };

  return ModelingDataTab;
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9ldWdsZW5hL21vZGVsX2Jsb2NrbHkvYmxvY2tseXRhYi90YWIuanMiXSwibmFtZXMiOlsiZGVmaW5lIiwicmVxdWlyZSIsIlV0aWxzIiwiR2xvYmFscyIsIkhNIiwiQ29tcG9uZW50IiwiTW9kZWwiLCJWaWV3IiwiTW9kZWxpbmdEYXRhVGFiIiwic2V0dGluZ3MiLCJtb2RlbENsYXNzIiwidmlld0NsYXNzIiwiYmluZE1ldGhvZHMiLCJzZXQiLCJnZXQiLCJhZGRFdmVudExpc3RlbmVyIiwiX29uVG9nZ2xlUmVxdWVzdCIsIl9vblBoYXNlQ2hhbmdlIiwiX29uQmxvY2tseUxvYWQiLCJfbGlzdGVuQmxvY2tseUV2ZW50cyIsIl9vbkRpc2FibGVSZXF1ZXN0IiwiX29uRW5hYmxlUmVxdWVzdCIsImV2dCIsInZpZXciLCJkaXNhYmxlIiwid29ya3NwYWNlIiwib3B0aW9ucyIsInJlYWRPbmx5IiwibWF4QmxvY2tzIiwiZW5hYmxlIiwiaGlkZSIsInNob3ciLCJfbW9kZWwiLCJnZXRBbGxCbG9ja3MiLCJsZW5ndGgiLCJkZWZhdWx0V29ya3NwYWNlQmxvY2tzIiwiZG9jdW1lbnQiLCJnZXRFbGVtZW50QnlJZCIsIndpbmRvdyIsIkJsb2NrbHkiLCJYbWwiLCJkb21Ub1dvcmtzcGFjZSIsImJsb2NrbHlYbWwiLCJ3b3Jrc3BhY2VUb0RvbSIsImdldE1haW5Xb3Jrc3BhY2UiLCJyZW1vdmVDaGFuZ2VMaXN0ZW5lciIsInRvZ2dsZUJsb2NrbHlFdmVudCIsImNsZWFyIiwibmFtZSIsInRvZ2dsZSIsImxvZyIsInR5cGUiLCJjYXRlZ29yeSIsImRhdGEiLCJkaXNwbGF5U3RhdGUiLCJnZXREaXNwbGF5U3RhdGUiLCJ2aXN1YWxpemF0aW9uIiwidGFiVHlwZSIsInJlc3VsdElkIiwiZXhwZXJpbWVudElkIiwicGhhc2UiLCJibG9ja2x5T3B0aW9ucyIsInRvb2xib3giLCJjb2xsYXBzZSIsImNvbW1lbnRzIiwiSW5maW5pdHkiLCJ0cmFzaGNhbiIsImhvcml6b250YWxMYXlvdXQiLCJ0b29sYm94UG9zaXRpb24iLCJjc3MiLCJtZWRpYSIsInJ0bCIsInNjcm9sbGJhcnMiLCJzb3VuZHMiLCJvbmVCYXNlZEluZGV4IiwiaW5qZWN0IiwiZGlzcGF0Y2hFdmVudCIsImJsb2NrbHlFdnQiLCJtb2RlbFR5cGUiLCJtb2RpZnlfYmxvY2siLCJBcnJheSIsInByb3RvdHlwZSIsInNsaWNlIiwiY2FsbCIsIiQiLCJmaW5kIiwibWFwIiwiYmxvY2siLCJnZXRBdHRyaWJ1dGUiLCJnZXRCbG9ja0J5SWQiLCJibG9ja0lkIiwiYmxvY2tfdHlwZSIsImJsb2NrRGl2Iiwic2V0QXR0cmlidXRlIiwib2xkWG1sIiwiRXJyb3IiLCJwYXJzZVhNTCIsImRvY3VtZW50RWxlbWVudCIsInByZXNlbnRCbG9ja3MiLCJsaXN0ZW5lcnNfIiwiYWRkQ2hhbmdlTGlzdGVuZXIiLCJjcmVhdGUiLCJtb2RlbERhdGEiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBQUEsT0FBTyxVQUFDQyxPQUFELEVBQWE7QUFDbEIsTUFBTUMsUUFBUUQsUUFBUSxpQkFBUixDQUFkO0FBQUEsTUFDRUUsVUFBVUYsUUFBUSxvQkFBUixDQURaO0FBQUEsTUFFRUcsS0FBS0gsUUFBUSx5QkFBUixDQUZQOztBQUlBLE1BQU1JLFlBQVlKLFFBQVEsMEJBQVIsQ0FBbEI7QUFBQSxNQUNFSyxRQUFRTCxRQUFRLFNBQVIsQ0FEVjtBQUFBLE1BRUVNLE9BQU9OLFFBQVEsUUFBUixDQUZUOztBQUxrQixNQVNaTyxlQVRZO0FBQUE7O0FBVWhCLCtCQUEyQjtBQUFBLFVBQWZDLFFBQWUsdUVBQUosRUFBSTs7QUFBQTs7QUFDekJBLGVBQVNDLFVBQVQsR0FBc0JELFNBQVNDLFVBQVQsSUFBdUJKLEtBQTdDO0FBQ0FHLGVBQVNFLFNBQVQsR0FBcUJGLFNBQVNFLFNBQVQsSUFBc0JKLElBQTNDOztBQUZ5QixvSUFHbkJFLFFBSG1COztBQUl6QlAsWUFBTVUsV0FBTixRQUF3QixDQUFDLGtCQUFELEVBQXFCLHdCQUFyQixF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LHlCQUFTQyxZQUFULENBQXNCLFVBQXRCLEVBQWlDLElBQWpDO0FBQ0Q7QUFDRjtBQUNGLFdBUEQ7QUFRRDs7QUFFRCxZQUFJLENBQUMsS0FBS3BFLFNBQUwsQ0FBZVEsWUFBZixHQUE4QkMsTUFBbkMsRUFBMkM7QUFDekMsY0FBSUMseUJBQXlCQyxTQUFTQyxjQUFULENBQXdCLHdCQUF4QixDQUE3QjtBQUNBQyxpQkFBT0MsT0FBUCxDQUFlQyxHQUFmLENBQW1CQyxjQUFuQixDQUFrQ04sc0JBQWxDLEVBQTBELEtBQUtWLFNBQS9EO0FBQ0Q7QUFFRjtBQW5PZTtBQUFBO0FBQUEsMkNBcU9LSCxHQXJPTCxFQXFPVTtBQUN4QixZQUFJQSxJQUFJK0IsSUFBSixDQUFTRixJQUFULEtBQWlCLE9BQWpCLElBQTRCLENBQUMsS0FBSzFCLFNBQUwsQ0FBZTBFLFVBQWYsQ0FBMEJqRSxNQUEzRCxFQUFtRTtBQUNqRSxlQUFLVCxTQUFMLENBQWUyRSxpQkFBZixDQUFpQyxLQUFLdEQsa0JBQXRDO0FBQ0Q7QUFDRjtBQXpPZTs7QUFBQTtBQUFBLElBU1l6QyxTQVRaOztBQTZPbEJHLGtCQUFnQjZGLE1BQWhCLEdBQXlCLFlBQWU7QUFBQSxRQUFkaEQsSUFBYyx1RUFBUCxFQUFPOztBQUN0QyxXQUFPLElBQUk3QyxlQUFKLENBQW9CLEVBQUU4RixXQUFXakQsSUFBYixFQUFwQixDQUFQO0FBQ0QsR0FGRDs7QUFJQSxTQUFPN0MsZUFBUDtBQUNELENBbFBEIiwiZmlsZSI6Im1vZHVsZS9ldWdsZW5hL21vZGVsX2Jsb2NrbHkvYmxvY2tseXRhYi90YWIuanMiLCJzb3VyY2VzQ29udGVudCI6WyJkZWZpbmUoKHJlcXVpcmUpID0+IHtcbiAgY29uc3QgVXRpbHMgPSByZXF1aXJlKCdjb3JlL3V0aWwvdXRpbHMnKSxcbiAgICBHbG9iYWxzID0gcmVxdWlyZSgnY29yZS9tb2RlbC9nbG9iYWxzJyksXG4gICAgSE0gPSByZXF1aXJlKCdjb3JlL2V2ZW50L2hvb2tfbWFuYWdlcicpO1xuXG4gIGNvbnN0IENvbXBvbmVudCA9IHJlcXVpcmUoJ2NvcmUvY29tcG9uZW50L2NvbXBvbmVudCcpLFxuICAgIE1vZGVsID0gcmVxdWlyZSgnLi9tb2RlbCcpLFxuICAgIFZpZXcgPSByZXF1aXJlKCcuL3ZpZXcnKTtcblxuICBjbGFzcyBNb2RlbGluZ0RhdGFUYWIgZXh0ZW5kcyBDb21wb25lbnQge1xuICAgIGNvbnN0cnVjdG9yKHNldHRpbmdzID0ge30pIHtcbiAgICAgIHNldHRpbmdzLm1vZGVsQ2xhc3MgPSBzZXR0aW5ncy5tb2RlbENsYXNzIHx8IE1vZGVsO1xuICAgICAgc2V0dGluZ3Mudmlld0NsYXNzID0gc2V0dGluZ3Mudmlld0NsYXNzIHx8IFZpZXc7XG4gICAgICBzdXBlcihzZXR0aW5ncyk7XG4gICAgICBVdGlscy5iaW5kTWV0aG9kcyh0aGlzLCBbJ19vblRvZ2dsZVJlcXVlc3QnLCAnX29uUmVzdWx0VG9nZ2xlUmVxdWVzdCcsICdfb25DbGVhckFsbFJlcXVlc3QnLCAnX29uQ2xlYXJSZXF1ZXN0JywgJ19vblBoYXNlQ2hhbmdlJywgJ3RvZ2dsZUJsb2NrbHlFdmVudCcsICdfb25CbG9ja2x5TG9hZCcsICdfbGlzdGVuQmxvY2tseUV2ZW50cycsJ19vbkRpc2FibGVSZXF1ZXN0JywnX29uRW5hYmxlUmVxdWVzdCddKVxuXG4gICAgICBHbG9iYWxzLnNldCgnYmxvY2tseUxvYWRlZCcsZmFsc2UpO1xuXG4gICAgICBHbG9iYWxzLmdldCgnUmVsYXknKS5hZGRFdmVudExpc3RlbmVyKCdNb2RlbGluZ1RhYi5Ub2dnbGVSZXF1ZXN0JywgdGhpcy5fb25Ub2dnbGVSZXF1ZXN0KVxuICAgICAgR2xvYmFscy5nZXQoJ1JlbGF5JykuYWRkRXZlbnRMaXN0ZW5lcignVGFiLkNoYW5nZScsIHRoaXMuX29uVG9nZ2xlUmVxdWVzdClcblxuICAgICAgR2xvYmFscy5nZXQoJ1JlbGF5JykuYWRkRXZlbnRMaXN0ZW5lcignQXBwUGhhc2UuQ2hhbmdlJywgdGhpcy5fb25QaGFzZUNoYW5nZSlcbiAgICAgIEdsb2JhbHMuZ2V0KCdSZWxheScpLmFkZEV2ZW50TGlzdGVuZXIoJ0Jsb2NrbHkuTG9hZCcsIHRoaXMuX29uQmxvY2tseUxvYWQpXG5cbiAgICAgIEdsb2JhbHMuZ2V0KCdSZWxheScpLmFkZEV2ZW50TGlzdGVuZXIoJ05vdGlmaWNhdGlvbnMuUmVtb3ZlJyx0aGlzLl9saXN0ZW5CbG9ja2x5RXZlbnRzKVxuICAgICAgR2xvYmFscy5nZXQoJ1JlbGF5JykuYWRkRXZlbnRMaXN0ZW5lcignTW9kZWxpbmdUYWIuVHJhbnNpdGlvbkVuZCcsdGhpcy5fbGlzdGVuQmxvY2tseUV2ZW50cylcblxuICAgICAgR2xvYmFscy5nZXQoJ1JlbGF5JykuYWRkRXZlbnRMaXN0ZW5lcignTm90aWZpY2F0aW9ucy5BZGQnLHRoaXMuX29uRGlzYWJsZVJlcXVlc3QpO1xuICAgICAgR2xvYmFscy5nZXQoJ1JlbGF5JykuYWRkRXZlbnRMaXN0ZW5lcignTm90aWZpY2F0aW9ucy5SZW1vdmUnLHRoaXMuX29uRW5hYmxlUmVxdWVzdCk7XG5cblxuICAgIH1cblxuICAgIF9vbkRpc2FibGVSZXF1ZXN0KGV2dCl7XG4gICAgICB0aGlzLnZpZXcoKS5kaXNhYmxlKCk7XG4gICAgICB0aGlzLndvcmtzcGFjZS5vcHRpb25zLnJlYWRPbmx5ID0gdHJ1ZTtcbiAgICAgIHRoaXMud29ya3NwYWNlLm9wdGlvbnMubWF4QmxvY2tzID0gMDtcbiAgICB9XG5cbiAgICBfb25FbmFibGVSZXF1ZXN0KGV2dCl7XG4gICAgICB0aGlzLnZpZXcoKS5lbmFibGUoKTtcbiAgICAgIHRoaXMud29ya3NwYWNlLm9wdGlvbnMucmVhZE9ubHkgPSBmYWxzZTtcbiAgICAgIHRoaXMud29ya3NwYWNlLm9wdGlvbnMubWF4QmxvY2tzID0gNTA7XG4gICAgfVxuXG4gICAgaGlkZSgpIHtcbiAgICAgIHRoaXMudmlldygpLmhpZGUoKTtcbiAgICB9XG5cbiAgICBzaG93KCkge1xuICAgICAgdGhpcy52aWV3KCkuc2hvdygpO1xuICAgIH1cblxuICAgIF9vblRvZ2dsZVJlcXVlc3QoZXZ0KSB7XG4gICAgICAvLyBSZWxvYWQgdGhlIGJsb2NrcyBvbmNlIHRvZ2dsZWQsIHRvIHByZXZlbnQgdGhlbSBmcm9tIGJlaW5nIHNtdXNoZWRcbiAgICAgIGlmICghdGhpcy5fbW9kZWwuZ2V0KCdvcGVuJykpIHtcbiAgICAgICAgaWYgKCF0aGlzLndvcmtzcGFjZS5nZXRBbGxCbG9ja3MoKS5sZW5ndGgpIHtcbiAgICAgICAgICB2YXIgZGVmYXVsdFdvcmtzcGFjZUJsb2NrcyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiZGVmYXVsdFdvcmtzcGFjZUJsb2Nrc1wiKTtcbiAgICAgICAgICB3aW5kb3cuQmxvY2tseS5YbWwuZG9tVG9Xb3Jrc3BhY2UoZGVmYXVsdFdvcmtzcGFjZUJsb2NrcywgdGhpcy53b3Jrc3BhY2UpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHZhciBibG9ja2x5WG1sID0gd2luZG93LkJsb2NrbHkuWG1sLndvcmtzcGFjZVRvRG9tKHdpbmRvdy5CbG9ja2x5LmdldE1haW5Xb3Jrc3BhY2UoKSk7XG4gICAgICAgICAgdGhpcy53b3Jrc3BhY2UucmVtb3ZlQ2hhbmdlTGlzdGVuZXIodGhpcy50b2dnbGVCbG9ja2x5RXZlbnQpO1xuICAgICAgICAgIHRoaXMud29ya3NwYWNlLmNsZWFyKCk7XG4gICAgICAgICAgd2luZG93LkJsb2NrbHkuWG1sLmRvbVRvV29ya3NwYWNlKGJsb2NrbHlYbWwsIHRoaXMud29ya3NwYWNlKTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBpZiAoZXZ0Lm5hbWUgPT0gJ01vZGVsaW5nVGFiLlRvZ2dsZVJlcXVlc3QnKSB7XG4gICAgICAgIHRoaXMuX21vZGVsLnRvZ2dsZSgpO1xuXG4gICAgICAgIEdsb2JhbHMuZ2V0KCdMb2dnZXInKS5sb2coe1xuICAgICAgICAgIHR5cGU6IHRoaXMuX21vZGVsLmdldCgnb3BlbicpID8gJ29wZW4nIDogJ2Nsb3NlJyxcbiAgICAgICAgICBjYXRlZ29yeTogJ21vZGVsaW5nJyxcbiAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICBkaXNwbGF5U3RhdGU6IHRoaXMuX21vZGVsLmdldERpc3BsYXlTdGF0ZSgpLFxuICAgICAgICAgICAgdmlzdWFsaXphdGlvbjogJycvL3RoaXMudmlldygpLmdldEN1cnJlbnRWaXN1YWxpemF0aW9uKClcbiAgICAgICAgICB9XG4gICAgICAgIH0pXG4gICAgICB9IGVsc2UgaWYgKGV2dC5kYXRhLnRhYlR5cGUgPT0gJ2Jsb2NrbHknKSB7XG4gICAgICAgIHRoaXMuX21vZGVsLnRvZ2dsZSgpO1xuICAgICAgfSBlbHNlIGlmICh0aGlzLl9tb2RlbC5nZXQoJ29wZW4nKSkge1xuICAgICAgICB0aGlzLl9tb2RlbC50b2dnbGUoKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBfb25SZXN1bHRUb2dnbGVSZXF1ZXN0KGV2dCkge1xuICAgICAgLy90aGlzLl9tb2RlbC50b2dnbGVSZXN1bHQoZXZ0LmRhdGEucmVzdWx0SWQpO1xuICAgICAgR2xvYmFscy5nZXQoJ0xvZ2dlcicpLmxvZyh7XG4gICAgICAgIHR5cGU6ICdyZXN1bHRfdG9nZ2xlJyxcbiAgICAgICAgY2F0ZWdvcnk6ICdtb2RlbGluZycsXG4gICAgICAgIGRhdGE6IHtcbiAgICAgICAgICBkaXNwbGF5U3RhdGU6IHRoaXMuX21vZGVsLmdldERpc3BsYXlTdGF0ZSgpLFxuICAgICAgICAgIHZpc3VhbGl6YXRpb246ICcnLy90aGlzLnZpZXcoKS5nZXRDdXJyZW50VmlzdWFsaXphdGlvbigpXG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgfVxuXG4gICAgX29uQ2xlYXJSZXF1ZXN0KGV2dCkge1xuICAgICAgLy90aGlzLl9tb2RlbC5jbGVhclJlc3VsdChldnQuZGF0YS5yZXN1bHRJZCk7XG4gICAgICBHbG9iYWxzLmdldCgnTG9nZ2VyJykubG9nKHtcbiAgICAgICAgdHlwZTogJ3JlbW92ZV9kYXRhJyxcbiAgICAgICAgY2F0ZWdvcnk6ICdtb2RlbGluZycsXG4gICAgICAgIGRhdGE6IHtcbiAgICAgICAgICByZXN1bHRJZDogZXZ0LmRhdGEucmVzdWx0SWQsXG4gICAgICAgICAgZGlzcGxheVN0YXRlOiB0aGlzLl9tb2RlbC5nZXREaXNwbGF5U3RhdGUoKSxcbiAgICAgICAgICB2aXN1YWxpemF0aW9uOiAnJy8vdGhpcy52aWV3KCkuZ2V0Q3VycmVudFZpc3VhbGl6YXRpb24oKVxuICAgICAgICB9XG4gICAgICB9KVxuICAgIH1cblxuICAgIF9vbkNsZWFyQWxsUmVxdWVzdChldnQpIHtcbiAgICAgIC8vdGhpcy5fbW9kZWwuY2xlYXJSZXN1bHRHcm91cChldnQuZGF0YS5leHBlcmltZW50SWQpO1xuICAgICAgR2xvYmFscy5nZXQoJ0xvZ2dlcicpLmxvZyh7XG4gICAgICAgIHR5cGU6ICdyZW1vdmVfZ3JvdXAnLFxuICAgICAgICBjYXRlZ29yeTogJ21vZGVsaW5nJyxcbiAgICAgICAgZGF0YToge1xuICAgICAgICAgIGV4cGVyaW1lbnRJZDogZXZ0LmRhdGEuZXhwZXJpbWVudElkLFxuICAgICAgICAgIGRpc3BsYXlTdGF0ZTogdGhpcy5fbW9kZWwuZ2V0RGlzcGxheVN0YXRlKCksXG4gICAgICAgICAgdmlzdWFsaXphdGlvbjogJycvL3RoaXMudmlldygpLmdldEN1cnJlbnRWaXN1YWxpemF0aW9uKClcbiAgICAgICAgfVxuICAgICAgfSlcbiAgICB9XG5cblxuICAgIF9vblBoYXNlQ2hhbmdlKGV2dCkge1xuICAgICAgaWYgKGV2dC5kYXRhLnBoYXNlID09IFwibG9naW5cIiB8fCBldnQuZGF0YS5waGFzZSA9PSBcImxvZ2luX2F0dGVtcHRlZFwiKSB7XG4gICAgICAgIGlmICghR2xvYmFscy5nZXQoJ2Jsb2NrbHlMb2FkZWQnKSkge1xuXG4gICAgICAgICAgdmFyIGJsb2NrbHlPcHRpb25zID0ge1xuICAgICAgICAgICAgdG9vbGJveCA6IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd0b29sYm94JyksXG4gICAgICAgICAgICBjb2xsYXBzZSA6IHRydWUsXG4gICAgICAgICAgICBjb21tZW50cyA6IHRydWUsXG4gICAgICAgICAgICBkaXNhYmxlIDogdHJ1ZSxcbiAgICAgICAgICAgIG1heEJsb2NrcyA6IEluZmluaXR5LFxuICAgICAgICAgICAgdHJhc2hjYW4gOiB0cnVlLFxuICAgICAgICAgICAgaG9yaXpvbnRhbExheW91dCA6IHRydWUsXG4gICAgICAgICAgICB0b29sYm94UG9zaXRpb24gOiAnc3RhcnQnLFxuICAgICAgICAgICAgY3NzIDogdHJ1ZSxcbiAgICAgICAgICAgIG1lZGlhIDogJ2h0dHBzOi8vYmxvY2tseS1kZW1vLmFwcHNwb3QuY29tL3N0YXRpYy9tZWRpYS8nLFxuICAgICAgICAgICAgcnRsIDogZmFsc2UsXG4gICAgICAgICAgICBzY3JvbGxiYXJzIDogdHJ1ZSxcbiAgICAgICAgICAgIHNvdW5kcyA6IHRydWUsXG4gICAgICAgICAgICBvbmVCYXNlZEluZGV4IDogdHJ1ZVxuICAgICAgICAgIH07XG5cbiAgICAgICAgICB0aGlzLndvcmtzcGFjZSA9IHdpbmRvdy5CbG9ja2x5LmluamVjdChkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnQmxvY2tseURpdicpLCBibG9ja2x5T3B0aW9ucyk7XG5cbiAgICAgICAgICBHbG9iYWxzLnNldCgnYmxvY2tseUxvYWRlZCcsdHJ1ZSk7XG5cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIHRvZ2dsZUJsb2NrbHlFdmVudChldnQpIHtcbiAgICAgIGlmIChldnQudHlwZSAhPSAndWknKSB7XG4gICAgICAgIEdsb2JhbHMuZ2V0KCdSZWxheScpLmRpc3BhdGNoRXZlbnQoJ0Jsb2NrbHkuQ2hhbmdlZCcsIHtibG9ja2x5RXZ0OiBldnQsIG1vZGVsVHlwZTogJ2Jsb2NrbHknfSk7XG4gICAgICB9XG5cbiAgICAgIC8vIENoZWNrIHdoZXRoZXIgYSBibG9jayB3aXRoIG1heF91c2Ugb2YgMSBoYXMgYmVlbiBjcmVhdGVkIHJlc3AgZGVsZXRlZCwgYW5kIGRpc2FibGUgcmVzcCBlbmFibGUuXG4gICAgICBpZiAoZXZ0LnR5cGUgPT0gJ2NyZWF0ZScpIHtcbiAgICAgICAgdmFyIG1vZGlmeV9ibG9jayA9IHRydWU7XG4gICAgICAgIEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKCQoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2RlZmF1bHRXb3Jrc3BhY2VCbG9ja3MnKSkuZmluZCgnYmxvY2snKSkubWFwKGJsb2NrID0+IHtcbiAgICAgICAgICBpZihibG9jay5nZXRBdHRyaWJ1dGUoJ3R5cGUnKSA9PT0gdGhpcy53b3Jrc3BhY2UuZ2V0QmxvY2tCeUlkKGV2dC5ibG9ja0lkKS50eXBlKSBtb2RpZnlfYmxvY2sgPSBmYWxzZTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaWYgKG1vZGlmeV9ibG9jaykge1xuICAgICAgICAgIHZhciBibG9ja190eXBlID0gdGhpcy53b3Jrc3BhY2UuZ2V0QmxvY2tCeUlkKGV2dC5ibG9ja0lkKS50eXBlO1xuICAgICAgICAgIHZhciBibG9ja0RpdiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGJsb2NrX3R5cGUpO1xuICAgICAgICAgIGlmIChibG9ja0Rpdi5nZXRBdHRyaWJ1dGUoJ21heF91c2UnKSA9PT0gJzEnKSB7XG4gICAgICAgICAgICBibG9ja0Rpdi5zZXRBdHRyaWJ1dGUoJ2Rpc2FibGVkJyx0cnVlKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgLy8gVGhlbiBjaGVjayBpZiBhIGJsb2NrIGhhcyBiZWVuIGRlbGV0ZWQgdGhhdCBoYXMgYSBtYXhfdXNlIG9mIDEuXG4gICAgICBpZiAoZXZ0LnR5cGUgPT0gJ2RlbGV0ZScpIHtcbiAgICAgICAgdmFyIGJsb2NrX3R5cGUgPSBldnQub2xkWG1sLmdldEF0dHJpYnV0ZSgndHlwZScpO1xuICAgICAgICB2YXIgYmxvY2tEaXYgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChibG9ja190eXBlKTtcbiAgICAgICAgaWYgKGJsb2NrRGl2LmdldEF0dHJpYnV0ZSgnbWF4X3VzZScpID09PSAnMScpIHtcbiAgICAgICAgICBibG9ja0Rpdi5zZXRBdHRyaWJ1dGUoJ2Rpc2FibGVkJyxmYWxzZSk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgLy9kb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCdbdHlwZT1mb3J3YXJkX3NwZWVkXScpWzBdLnNldEF0dHJpYnV0ZSgnZGlzYWJsZWQnLHRydWUpXG4gICAgICAvL2RvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJ1t0eXBlPWZvcndhcmRfc3BlZWRdJylbMF0ucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCdbdHlwZT1mb3J3YXJkX3NwZWVkXScpWzBdKVxuXG4gICAgICAvL3ZhciB0b29sYm94ZWxlbSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwidG9vbGJveFwiKVxuICAgICAgLy90aGlzLndvcmtzcGFjZS51cGRhdGVUb29sYm94KHRvb2xib3hlbGVtKVxuXG4gICAgICAvLyBNYW5pcHVsYXRlIHRoZSB0b29sYm94IGFjY29yZGluZyB0byB3aGljaCBlbGVtZW50cyBoYXZlIG1heF91c2UgYW5kIHdoaWNoIG9uZXMgbm90LlxuXG4gICAgICAvLyAqKioqKioqKiogcGFyc2UgdGhlIGNvZGUgZm9yIGVycm9ycyAqKioqKioqKipcbiAgICAgIC8vIFNlbmQgYWxlcnRzXG5cblxuICAgIH1cblxuICAgIF9vbkJsb2NrbHlMb2FkKGV2dCkge1xuICAgICAgLy9sZXQgd29ya3NwYWNlID0gd2luZG93LkJsb2NrbHkuZ2V0TWFpbldvcmtzcGFjZSgpO1xuXG4gICAgICBpZiAoIXRoaXMud29ya3NwYWNlKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcIkJsb2NrbHkgd29ya3NwYWNlIGRvZXMgbm90IGV4aXN0LlwiKTtcbiAgICAgIH1cbiAgICAgIHRoaXMud29ya3NwYWNlLnJlbW92ZUNoYW5nZUxpc3RlbmVyKHRoaXMudG9nZ2xlQmxvY2tseUV2ZW50KTtcbiAgICAgIHRoaXMud29ya3NwYWNlLmNsZWFyKCk7XG5cbiAgICAgIGlmIChldnQuZGF0YSkge1xuICAgICAgICAvL2NvbnN0IGJsb2NrbHlYbWwgPSB3aW5kb3cuWG1sLnRleHRUb0RvbShldnQuZGF0YSlcbiAgICAgICAgY29uc3QgYmxvY2tseVhtbCA9ICQucGFyc2VYTUwoZXZ0LmRhdGEpLmRvY3VtZW50RWxlbWVudDtcbiAgICAgICAgd2luZG93LkJsb2NrbHkuWG1sLmRvbVRvV29ya3NwYWNlKGJsb2NrbHlYbWwsIHRoaXMud29ya3NwYWNlKTsvLy50aGVuKCgpID0+IHtjb25zb2xlLmxvZygnaGVyZScpfSk7XG5cbiAgICAgICAgY29uc3QgcHJlc2VudEJsb2NrcyA9IHRoaXMud29ya3NwYWNlLmdldEFsbEJsb2NrcygpO1xuICAgICAgICBwcmVzZW50QmxvY2tzLm1hcChibG9jayA9PiB7XG4gICAgICAgICAgdmFyIGJsb2NrRGl2ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoYmxvY2sudHlwZSk7XG4gICAgICAgICAgaWYgKGJsb2NrRGl2KSB7XG4gICAgICAgICAgICBpZiAoYmxvY2tEaXYuZ2V0QXR0cmlidXRlKCdtYXhfdXNlJykgPT09ICcxJykge1xuICAgICAgICAgICAgICBibG9ja0Rpdi5zZXRBdHRyaWJ1dGUoJ2Rpc2FibGVkJyx0cnVlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfVxuXG4gICAgICBpZiAoIXRoaXMud29ya3NwYWNlLmdldEFsbEJsb2NrcygpLmxlbmd0aCkge1xuICAgICAgICB2YXIgZGVmYXVsdFdvcmtzcGFjZUJsb2NrcyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiZGVmYXVsdFdvcmtzcGFjZUJsb2Nrc1wiKTtcbiAgICAgICAgd2luZG93LkJsb2NrbHkuWG1sLmRvbVRvV29ya3NwYWNlKGRlZmF1bHRXb3Jrc3BhY2VCbG9ja3MsIHRoaXMud29ya3NwYWNlKTtcbiAgICAgIH1cblxuICAgIH1cblxuICAgIF9saXN0ZW5CbG9ja2x5RXZlbnRzKGV2dCkge1xuICAgICAgaWYgKGV2dC5kYXRhLnR5cGU9PT0gJ21vZGVsJyAmJiAhdGhpcy53b3Jrc3BhY2UubGlzdGVuZXJzXy5sZW5ndGgpIHtcbiAgICAgICAgdGhpcy53b3Jrc3BhY2UuYWRkQ2hhbmdlTGlzdGVuZXIodGhpcy50b2dnbGVCbG9ja2x5RXZlbnQpO1xuICAgICAgfVxuICAgIH1cblxuICB9XG5cbiAgTW9kZWxpbmdEYXRhVGFiLmNyZWF0ZSA9IChkYXRhID0ge30pID0+IHtcbiAgICByZXR1cm4gbmV3IE1vZGVsaW5nRGF0YVRhYih7IG1vZGVsRGF0YTogZGF0YSB9KVxuICB9XG5cbiAgcmV0dXJuIE1vZGVsaW5nRGF0YVRhYjtcbn0pXG4iXX0=
