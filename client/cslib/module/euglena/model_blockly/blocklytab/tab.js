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

      Utils.bindMethods(_this, ['_onToggleRequest', '_onResultToggleRequest', '_onClearAllRequest', '_onClearRequest', '_onPhaseChange', 'toggleBlocklyEvent', '_onBlocklyLoad', '_listenBlocklyEvents']);

      Globals.set('blocklyLoaded', false);

      Globals.get('Relay').addEventListener('ModelingTab.ToggleRequest', _this._onToggleRequest);
      Globals.get('Relay').addEventListener('Tab.Change', _this._onToggleRequest);

      Globals.get('Relay').addEventListener('AppPhase.Change', _this._onPhaseChange);
      Globals.get('Relay').addEventListener('Blockly.Load', _this._onBlocklyLoad);

      Globals.get('Relay').addEventListener('Notifications.Remove', _this._listenBlocklyEvents);
      Globals.get('Relay').addEventListener('ModelingTab.TransitionEnd', _this._listenBlocklyEvents);

      return _this;
    }

    _createClass(ModelingDataTab, [{
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9ldWdsZW5hL21vZGVsX2Jsb2NrbHkvYmxvY2tseXRhYi90YWIuanMiXSwibmFtZXMiOlsiZGVmaW5lIiwicmVxdWlyZSIsIlV0aWxzIiwiR2xvYmFscyIsIkhNIiwiQ29tcG9uZW50IiwiTW9kZWwiLCJWaWV3IiwiTW9kZWxpbmdEYXRhVGFiIiwic2V0dGluZ3MiLCJtb2RlbENsYXNzIiwidmlld0NsYXNzIiwiYmluZE1ldGhvZHMiLCJzZXQiLCJnZXQiLCJhZGRFdmVudExpc3RlbmVyIiwiX29uVG9nZ2xlUmVxdWVzdCIsIl9vblBoYXNlQ2hhbmdlIiwiX29uQmxvY2tseUxvYWQiLCJfbGlzdGVuQmxvY2tseUV2ZW50cyIsInZpZXciLCJoaWRlIiwic2hvdyIsImV2dCIsIl9tb2RlbCIsIndvcmtzcGFjZSIsImdldEFsbEJsb2NrcyIsImxlbmd0aCIsImRlZmF1bHRXb3Jrc3BhY2VCbG9ja3MiLCJkb2N1bWVudCIsImdldEVsZW1lbnRCeUlkIiwid2luZG93IiwiQmxvY2tseSIsIlhtbCIsImRvbVRvV29ya3NwYWNlIiwiYmxvY2tseVhtbCIsIndvcmtzcGFjZVRvRG9tIiwiZ2V0TWFpbldvcmtzcGFjZSIsInJlbW92ZUNoYW5nZUxpc3RlbmVyIiwidG9nZ2xlQmxvY2tseUV2ZW50IiwiY2xlYXIiLCJuYW1lIiwidG9nZ2xlIiwibG9nIiwidHlwZSIsImNhdGVnb3J5IiwiZGF0YSIsImRpc3BsYXlTdGF0ZSIsImdldERpc3BsYXlTdGF0ZSIsInZpc3VhbGl6YXRpb24iLCJ0YWJUeXBlIiwicmVzdWx0SWQiLCJleHBlcmltZW50SWQiLCJwaGFzZSIsImJsb2NrbHlPcHRpb25zIiwidG9vbGJveCIsImNvbGxhcHNlIiwiY29tbWVudHMiLCJkaXNhYmxlIiwibWF4QmxvY2tzIiwiSW5maW5pdHkiLCJ0cmFzaGNhbiIsImhvcml6b250YWxMYXlvdXQiLCJ0b29sYm94UG9zaXRpb24iLCJjc3MiLCJtZWRpYSIsInJ0bCIsInNjcm9sbGJhcnMiLCJzb3VuZHMiLCJvbmVCYXNlZEluZGV4IiwiaW5qZWN0IiwiZGlzcGF0Y2hFdmVudCIsImJsb2NrbHlFdnQiLCJtb2RlbFR5cGUiLCJtb2RpZnlfYmxvY2siLCJBcnJheSIsInByb3RvdHlwZSIsInNsaWNlIiwiY2FsbCIsIiQiLCJmaW5kIiwibWFwIiwiYmxvY2siLCJnZXRBdHRyaWJ1dGUiLCJnZXRCbG9ja0J5SWQiLCJibG9ja0lkIiwiYmxvY2tfdHlwZSIsImJsb2NrRGl2Iiwic2V0QXR0cmlidXRlIiwib2xkWG1sIiwiRXJyb3IiLCJwYXJzZVhNTCIsImRvY3VtZW50RWxlbWVudCIsInByZXNlbnRCbG9ja3MiLCJsaXN0ZW5lcnNfIiwiYWRkQ2hhbmdlTGlzdGVuZXIiLCJjcmVhdGUiLCJtb2RlbERhdGEiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBQUEsT0FBTyxVQUFDQyxPQUFELEVBQWE7QUFDbEIsTUFBTUMsUUFBUUQsUUFBUSxpQkFBUixDQUFkO0FBQUEsTUFDRUUsVUFBVUYsUUFBUSxvQkFBUixDQURaO0FBQUEsTUFFRUcsS0FBS0gsUUFBUSx5QkFBUixDQUZQOztBQUlBLE1BQU1JLFlBQVlKLFFBQVEsMEJBQVIsQ0FBbEI7QUFBQSxNQUNFSyxRQUFRTCxRQUFRLFNBQVIsQ0FEVjtBQUFBLE1BRUVNLE9BQU9OLFFBQVEsUUFBUixDQUZUOztBQUxrQixNQVNaTyxlQVRZO0FBQUE7O0FBVWhCLCtCQUEyQjtBQUFBLFVBQWZDLFFBQWUsdUVBQUosRUFBSTs7QUFBQTs7QUFDekJBLGVBQVNDLFVBQVQsR0FBc0JELFNBQVNDLFVBQVQsSUFBdUJKLEtBQTdDO0FBQ0FHLGVBQVNFLFNBQVQsR0FBcUJGLFNBQVNFLFNBQVQsSUFBc0JKLElBQTNDOztBQUZ5QixvSUFHbkJFLFFBSG1COztBQUl6QlAsWUFBTVUsV0FBTixRQUF3QixDQUFDLGtCQUFELEVBQXFCLHdCQUFyQixFQUErQyxvQkFBL0MsRUFBcUUsaUJBQXJFLEVBQXdGLGdCQUF4RixFQUEwRyxvQkFBMUcsRUFBZ0ksZ0JBQWhJLEVBQWtK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RCxHQUZEOztBQUlBLFNBQU90QyxlQUFQO0FBQ0QsQ0FuT0QiLCJmaWxlIjoibW9kdWxlL2V1Z2xlbmEvbW9kZWxfYmxvY2tseS9ibG9ja2x5dGFiL3RhYi5qcyIsInNvdXJjZXNDb250ZW50IjpbImRlZmluZSgocmVxdWlyZSkgPT4ge1xuICBjb25zdCBVdGlscyA9IHJlcXVpcmUoJ2NvcmUvdXRpbC91dGlscycpLFxuICAgIEdsb2JhbHMgPSByZXF1aXJlKCdjb3JlL21vZGVsL2dsb2JhbHMnKSxcbiAgICBITSA9IHJlcXVpcmUoJ2NvcmUvZXZlbnQvaG9va19tYW5hZ2VyJyk7XG5cbiAgY29uc3QgQ29tcG9uZW50ID0gcmVxdWlyZSgnY29yZS9jb21wb25lbnQvY29tcG9uZW50JyksXG4gICAgTW9kZWwgPSByZXF1aXJlKCcuL21vZGVsJyksXG4gICAgVmlldyA9IHJlcXVpcmUoJy4vdmlldycpO1xuXG4gIGNsYXNzIE1vZGVsaW5nRGF0YVRhYiBleHRlbmRzIENvbXBvbmVudCB7XG4gICAgY29uc3RydWN0b3Ioc2V0dGluZ3MgPSB7fSkge1xuICAgICAgc2V0dGluZ3MubW9kZWxDbGFzcyA9IHNldHRpbmdzLm1vZGVsQ2xhc3MgfHwgTW9kZWw7XG4gICAgICBzZXR0aW5ncy52aWV3Q2xhc3MgPSBzZXR0aW5ncy52aWV3Q2xhc3MgfHwgVmlldztcbiAgICAgIHN1cGVyKHNldHRpbmdzKTtcbiAgICAgIFV0aWxzLmJpbmRNZXRob2RzKHRoaXMsIFsnX29uVG9nZ2xlUmVxdWVzdCcsICdfb25SZXN1bHRUb2dnbGVSZXF1ZXN0JywgJ19vbkNsZWFyQWxsUmVxdWVzdCcsICdfb25DbGVhclJlcXVlc3QnLCAnX29uUGhhc2VDaGFuZ2UnLCAndG9nZ2xlQmxvY2tseUV2ZW50JywgJ19vbkJsb2NrbHlMb2FkJywgJ19saXN0ZW5CbG9ja2x5RXZlbnRzJ10pXG5cbiAgICAgIEdsb2JhbHMuc2V0KCdibG9ja2x5TG9hZGVkJyxmYWxzZSk7XG5cbiAgICAgIEdsb2JhbHMuZ2V0KCdSZWxheScpLmFkZEV2ZW50TGlzdGVuZXIoJ01vZGVsaW5nVGFiLlRvZ2dsZVJlcXVlc3QnLCB0aGlzLl9vblRvZ2dsZVJlcXVlc3QpXG4gICAgICBHbG9iYWxzLmdldCgnUmVsYXknKS5hZGRFdmVudExpc3RlbmVyKCdUYWIuQ2hhbmdlJywgdGhpcy5fb25Ub2dnbGVSZXF1ZXN0KVxuXG4gICAgICBHbG9iYWxzLmdldCgnUmVsYXknKS5hZGRFdmVudExpc3RlbmVyKCdBcHBQaGFzZS5DaGFuZ2UnLCB0aGlzLl9vblBoYXNlQ2hhbmdlKVxuICAgICAgR2xvYmFscy5nZXQoJ1JlbGF5JykuYWRkRXZlbnRMaXN0ZW5lcignQmxvY2tseS5Mb2FkJywgdGhpcy5fb25CbG9ja2x5TG9hZClcblxuICAgICAgR2xvYmFscy5nZXQoJ1JlbGF5JykuYWRkRXZlbnRMaXN0ZW5lcignTm90aWZpY2F0aW9ucy5SZW1vdmUnLHRoaXMuX2xpc3RlbkJsb2NrbHlFdmVudHMpXG4gICAgICBHbG9iYWxzLmdldCgnUmVsYXknKS5hZGRFdmVudExpc3RlbmVyKCdNb2RlbGluZ1RhYi5UcmFuc2l0aW9uRW5kJyx0aGlzLl9saXN0ZW5CbG9ja2x5RXZlbnRzKVxuXG5cbiAgICB9XG5cbiAgICBoaWRlKCkge1xuICAgICAgdGhpcy52aWV3KCkuaGlkZSgpO1xuICAgIH1cblxuICAgIHNob3coKSB7XG4gICAgICB0aGlzLnZpZXcoKS5zaG93KCk7XG4gICAgfVxuXG4gICAgX29uVG9nZ2xlUmVxdWVzdChldnQpIHtcbiAgICAgIC8vIFJlbG9hZCB0aGUgYmxvY2tzIG9uY2UgdG9nZ2xlZCwgdG8gcHJldmVudCB0aGVtIGZyb20gYmVpbmcgc211c2hlZFxuICAgICAgaWYgKCF0aGlzLl9tb2RlbC5nZXQoJ29wZW4nKSkge1xuICAgICAgICBpZiAoIXRoaXMud29ya3NwYWNlLmdldEFsbEJsb2NrcygpLmxlbmd0aCkge1xuICAgICAgICAgIHZhciBkZWZhdWx0V29ya3NwYWNlQmxvY2tzID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJkZWZhdWx0V29ya3NwYWNlQmxvY2tzXCIpO1xuICAgICAgICAgIHdpbmRvdy5CbG9ja2x5LlhtbC5kb21Ub1dvcmtzcGFjZShkZWZhdWx0V29ya3NwYWNlQmxvY2tzLCB0aGlzLndvcmtzcGFjZSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdmFyIGJsb2NrbHlYbWwgPSB3aW5kb3cuQmxvY2tseS5YbWwud29ya3NwYWNlVG9Eb20od2luZG93LkJsb2NrbHkuZ2V0TWFpbldvcmtzcGFjZSgpKTtcbiAgICAgICAgICB0aGlzLndvcmtzcGFjZS5yZW1vdmVDaGFuZ2VMaXN0ZW5lcih0aGlzLnRvZ2dsZUJsb2NrbHlFdmVudCk7XG4gICAgICAgICAgdGhpcy53b3Jrc3BhY2UuY2xlYXIoKTtcbiAgICAgICAgICB3aW5kb3cuQmxvY2tseS5YbWwuZG9tVG9Xb3Jrc3BhY2UoYmxvY2tseVhtbCwgdGhpcy53b3Jrc3BhY2UpO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGlmIChldnQubmFtZSA9PSAnTW9kZWxpbmdUYWIuVG9nZ2xlUmVxdWVzdCcpIHtcbiAgICAgICAgdGhpcy5fbW9kZWwudG9nZ2xlKCk7XG5cbiAgICAgICAgR2xvYmFscy5nZXQoJ0xvZ2dlcicpLmxvZyh7XG4gICAgICAgICAgdHlwZTogdGhpcy5fbW9kZWwuZ2V0KCdvcGVuJykgPyAnb3BlbicgOiAnY2xvc2UnLFxuICAgICAgICAgIGNhdGVnb3J5OiAnbW9kZWxpbmcnLFxuICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgIGRpc3BsYXlTdGF0ZTogdGhpcy5fbW9kZWwuZ2V0RGlzcGxheVN0YXRlKCksXG4gICAgICAgICAgICB2aXN1YWxpemF0aW9uOiAnJy8vdGhpcy52aWV3KCkuZ2V0Q3VycmVudFZpc3VhbGl6YXRpb24oKVxuICAgICAgICAgIH1cbiAgICAgICAgfSlcbiAgICAgIH0gZWxzZSBpZiAoZXZ0LmRhdGEudGFiVHlwZSA9PSAnYmxvY2tseScpIHtcbiAgICAgICAgdGhpcy5fbW9kZWwudG9nZ2xlKCk7XG4gICAgICB9IGVsc2UgaWYgKHRoaXMuX21vZGVsLmdldCgnb3BlbicpKSB7XG4gICAgICAgIHRoaXMuX21vZGVsLnRvZ2dsZSgpO1xuICAgICAgfVxuICAgIH1cblxuICAgIF9vblJlc3VsdFRvZ2dsZVJlcXVlc3QoZXZ0KSB7XG4gICAgICAvL3RoaXMuX21vZGVsLnRvZ2dsZVJlc3VsdChldnQuZGF0YS5yZXN1bHRJZCk7XG4gICAgICBHbG9iYWxzLmdldCgnTG9nZ2VyJykubG9nKHtcbiAgICAgICAgdHlwZTogJ3Jlc3VsdF90b2dnbGUnLFxuICAgICAgICBjYXRlZ29yeTogJ21vZGVsaW5nJyxcbiAgICAgICAgZGF0YToge1xuICAgICAgICAgIGRpc3BsYXlTdGF0ZTogdGhpcy5fbW9kZWwuZ2V0RGlzcGxheVN0YXRlKCksXG4gICAgICAgICAgdmlzdWFsaXphdGlvbjogJycvL3RoaXMudmlldygpLmdldEN1cnJlbnRWaXN1YWxpemF0aW9uKClcbiAgICAgICAgfVxuICAgICAgfSlcbiAgICB9XG5cbiAgICBfb25DbGVhclJlcXVlc3QoZXZ0KSB7XG4gICAgICAvL3RoaXMuX21vZGVsLmNsZWFyUmVzdWx0KGV2dC5kYXRhLnJlc3VsdElkKTtcbiAgICAgIEdsb2JhbHMuZ2V0KCdMb2dnZXInKS5sb2coe1xuICAgICAgICB0eXBlOiAncmVtb3ZlX2RhdGEnLFxuICAgICAgICBjYXRlZ29yeTogJ21vZGVsaW5nJyxcbiAgICAgICAgZGF0YToge1xuICAgICAgICAgIHJlc3VsdElkOiBldnQuZGF0YS5yZXN1bHRJZCxcbiAgICAgICAgICBkaXNwbGF5U3RhdGU6IHRoaXMuX21vZGVsLmdldERpc3BsYXlTdGF0ZSgpLFxuICAgICAgICAgIHZpc3VhbGl6YXRpb246ICcnLy90aGlzLnZpZXcoKS5nZXRDdXJyZW50VmlzdWFsaXphdGlvbigpXG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgfVxuXG4gICAgX29uQ2xlYXJBbGxSZXF1ZXN0KGV2dCkge1xuICAgICAgLy90aGlzLl9tb2RlbC5jbGVhclJlc3VsdEdyb3VwKGV2dC5kYXRhLmV4cGVyaW1lbnRJZCk7XG4gICAgICBHbG9iYWxzLmdldCgnTG9nZ2VyJykubG9nKHtcbiAgICAgICAgdHlwZTogJ3JlbW92ZV9ncm91cCcsXG4gICAgICAgIGNhdGVnb3J5OiAnbW9kZWxpbmcnLFxuICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgZXhwZXJpbWVudElkOiBldnQuZGF0YS5leHBlcmltZW50SWQsXG4gICAgICAgICAgZGlzcGxheVN0YXRlOiB0aGlzLl9tb2RlbC5nZXREaXNwbGF5U3RhdGUoKSxcbiAgICAgICAgICB2aXN1YWxpemF0aW9uOiAnJy8vdGhpcy52aWV3KCkuZ2V0Q3VycmVudFZpc3VhbGl6YXRpb24oKVxuICAgICAgICB9XG4gICAgICB9KVxuICAgIH1cblxuXG4gICAgX29uUGhhc2VDaGFuZ2UoZXZ0KSB7XG4gICAgICBpZiAoZXZ0LmRhdGEucGhhc2UgPT0gXCJsb2dpblwiIHx8IGV2dC5kYXRhLnBoYXNlID09IFwibG9naW5fYXR0ZW1wdGVkXCIpIHtcbiAgICAgICAgaWYgKCFHbG9iYWxzLmdldCgnYmxvY2tseUxvYWRlZCcpKSB7XG5cbiAgICAgICAgICB2YXIgYmxvY2tseU9wdGlvbnMgPSB7XG4gICAgICAgICAgICB0b29sYm94IDogZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3Rvb2xib3gnKSxcbiAgICAgICAgICAgIGNvbGxhcHNlIDogdHJ1ZSxcbiAgICAgICAgICAgIGNvbW1lbnRzIDogdHJ1ZSxcbiAgICAgICAgICAgIGRpc2FibGUgOiB0cnVlLFxuICAgICAgICAgICAgbWF4QmxvY2tzIDogSW5maW5pdHksXG4gICAgICAgICAgICB0cmFzaGNhbiA6IHRydWUsXG4gICAgICAgICAgICBob3Jpem9udGFsTGF5b3V0IDogdHJ1ZSxcbiAgICAgICAgICAgIHRvb2xib3hQb3NpdGlvbiA6ICdzdGFydCcsXG4gICAgICAgICAgICBjc3MgOiB0cnVlLFxuICAgICAgICAgICAgbWVkaWEgOiAnaHR0cHM6Ly9ibG9ja2x5LWRlbW8uYXBwc3BvdC5jb20vc3RhdGljL21lZGlhLycsXG4gICAgICAgICAgICBydGwgOiBmYWxzZSxcbiAgICAgICAgICAgIHNjcm9sbGJhcnMgOiB0cnVlLFxuICAgICAgICAgICAgc291bmRzIDogdHJ1ZSxcbiAgICAgICAgICAgIG9uZUJhc2VkSW5kZXggOiB0cnVlXG4gICAgICAgICAgfTtcblxuICAgICAgICAgIHRoaXMud29ya3NwYWNlID0gd2luZG93LkJsb2NrbHkuaW5qZWN0KGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdCbG9ja2x5RGl2JyksIGJsb2NrbHlPcHRpb25zKTtcblxuICAgICAgICAgIEdsb2JhbHMuc2V0KCdibG9ja2x5TG9hZGVkJyx0cnVlKTtcblxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgdG9nZ2xlQmxvY2tseUV2ZW50KGV2dCkge1xuICAgICAgaWYgKGV2dC50eXBlICE9ICd1aScpIHtcbiAgICAgICAgR2xvYmFscy5nZXQoJ1JlbGF5JykuZGlzcGF0Y2hFdmVudCgnQmxvY2tseS5DaGFuZ2VkJywge2Jsb2NrbHlFdnQ6IGV2dCwgbW9kZWxUeXBlOiAnYmxvY2tseSd9KTtcbiAgICAgIH1cblxuICAgICAgLy8gQ2hlY2sgd2hldGhlciBhIGJsb2NrIHdpdGggbWF4X3VzZSBvZiAxIGhhcyBiZWVuIGNyZWF0ZWQgcmVzcCBkZWxldGVkLCBhbmQgZGlzYWJsZSByZXNwIGVuYWJsZS5cbiAgICAgIGlmIChldnQudHlwZSA9PSAnY3JlYXRlJykge1xuICAgICAgICB2YXIgbW9kaWZ5X2Jsb2NrID0gdHJ1ZTtcbiAgICAgICAgQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoJChkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZGVmYXVsdFdvcmtzcGFjZUJsb2NrcycpKS5maW5kKCdibG9jaycpKS5tYXAoYmxvY2sgPT4ge1xuICAgICAgICAgIGlmKGJsb2NrLmdldEF0dHJpYnV0ZSgndHlwZScpID09PSB0aGlzLndvcmtzcGFjZS5nZXRCbG9ja0J5SWQoZXZ0LmJsb2NrSWQpLnR5cGUpIG1vZGlmeV9ibG9jayA9IGZhbHNlO1xuICAgICAgICB9KTtcblxuICAgICAgICBpZiAobW9kaWZ5X2Jsb2NrKSB7XG4gICAgICAgICAgdmFyIGJsb2NrX3R5cGUgPSB0aGlzLndvcmtzcGFjZS5nZXRCbG9ja0J5SWQoZXZ0LmJsb2NrSWQpLnR5cGU7XG4gICAgICAgICAgdmFyIGJsb2NrRGl2ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoYmxvY2tfdHlwZSk7XG4gICAgICAgICAgaWYgKGJsb2NrRGl2LmdldEF0dHJpYnV0ZSgnbWF4X3VzZScpID09PSAnMScpIHtcbiAgICAgICAgICAgIGJsb2NrRGl2LnNldEF0dHJpYnV0ZSgnZGlzYWJsZWQnLHRydWUpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICAvLyBUaGVuIGNoZWNrIGlmIGEgYmxvY2sgaGFzIGJlZW4gZGVsZXRlZCB0aGF0IGhhcyBhIG1heF91c2Ugb2YgMS5cbiAgICAgIGlmIChldnQudHlwZSA9PSAnZGVsZXRlJykge1xuICAgICAgICB2YXIgYmxvY2tfdHlwZSA9IGV2dC5vbGRYbWwuZ2V0QXR0cmlidXRlKCd0eXBlJyk7XG4gICAgICAgIHZhciBibG9ja0RpdiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGJsb2NrX3R5cGUpO1xuICAgICAgICBpZiAoYmxvY2tEaXYuZ2V0QXR0cmlidXRlKCdtYXhfdXNlJykgPT09ICcxJykge1xuICAgICAgICAgIGJsb2NrRGl2LnNldEF0dHJpYnV0ZSgnZGlzYWJsZWQnLGZhbHNlKTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICAvL2RvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJ1t0eXBlPWZvcndhcmRfc3BlZWRdJylbMF0uc2V0QXR0cmlidXRlKCdkaXNhYmxlZCcsdHJ1ZSlcbiAgICAgIC8vZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnW3R5cGU9Zm9yd2FyZF9zcGVlZF0nKVswXS5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJ1t0eXBlPWZvcndhcmRfc3BlZWRdJylbMF0pXG5cbiAgICAgIC8vdmFyIHRvb2xib3hlbGVtID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJ0b29sYm94XCIpXG4gICAgICAvL3RoaXMud29ya3NwYWNlLnVwZGF0ZVRvb2xib3godG9vbGJveGVsZW0pXG5cbiAgICAgIC8vIE1hbmlwdWxhdGUgdGhlIHRvb2xib3ggYWNjb3JkaW5nIHRvIHdoaWNoIGVsZW1lbnRzIGhhdmUgbWF4X3VzZSBhbmQgd2hpY2ggb25lcyBub3QuXG5cbiAgICAgIC8vICoqKioqKioqKiBwYXJzZSB0aGUgY29kZSBmb3IgZXJyb3JzICoqKioqKioqKlxuICAgICAgLy8gU2VuZCBhbGVydHNcblxuXG4gICAgfVxuXG4gICAgX29uQmxvY2tseUxvYWQoZXZ0KSB7XG4gICAgICAvL2xldCB3b3Jrc3BhY2UgPSB3aW5kb3cuQmxvY2tseS5nZXRNYWluV29ya3NwYWNlKCk7XG5cbiAgICAgIGlmICghdGhpcy53b3Jrc3BhY2UpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiQmxvY2tseSB3b3Jrc3BhY2UgZG9lcyBub3QgZXhpc3QuXCIpO1xuICAgICAgfVxuICAgICAgdGhpcy53b3Jrc3BhY2UucmVtb3ZlQ2hhbmdlTGlzdGVuZXIodGhpcy50b2dnbGVCbG9ja2x5RXZlbnQpO1xuICAgICAgdGhpcy53b3Jrc3BhY2UuY2xlYXIoKTtcblxuICAgICAgaWYgKGV2dC5kYXRhKSB7XG4gICAgICAgIC8vY29uc3QgYmxvY2tseVhtbCA9IHdpbmRvdy5YbWwudGV4dFRvRG9tKGV2dC5kYXRhKVxuICAgICAgICBjb25zdCBibG9ja2x5WG1sID0gJC5wYXJzZVhNTChldnQuZGF0YSkuZG9jdW1lbnRFbGVtZW50O1xuICAgICAgICB3aW5kb3cuQmxvY2tseS5YbWwuZG9tVG9Xb3Jrc3BhY2UoYmxvY2tseVhtbCwgdGhpcy53b3Jrc3BhY2UpOy8vLnRoZW4oKCkgPT4ge2NvbnNvbGUubG9nKCdoZXJlJyl9KTtcblxuICAgICAgICBjb25zdCBwcmVzZW50QmxvY2tzID0gdGhpcy53b3Jrc3BhY2UuZ2V0QWxsQmxvY2tzKCk7XG4gICAgICAgIHByZXNlbnRCbG9ja3MubWFwKGJsb2NrID0+IHtcbiAgICAgICAgICB2YXIgYmxvY2tEaXYgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChibG9jay50eXBlKTtcbiAgICAgICAgICBpZiAoYmxvY2tEaXYpIHtcbiAgICAgICAgICAgIGlmIChibG9ja0Rpdi5nZXRBdHRyaWJ1dGUoJ21heF91c2UnKSA9PT0gJzEnKSB7XG4gICAgICAgICAgICAgIGJsb2NrRGl2LnNldEF0dHJpYnV0ZSgnZGlzYWJsZWQnLHRydWUpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9XG5cbiAgICAgIGlmICghdGhpcy53b3Jrc3BhY2UuZ2V0QWxsQmxvY2tzKCkubGVuZ3RoKSB7XG4gICAgICAgIHZhciBkZWZhdWx0V29ya3NwYWNlQmxvY2tzID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJkZWZhdWx0V29ya3NwYWNlQmxvY2tzXCIpO1xuICAgICAgICB3aW5kb3cuQmxvY2tseS5YbWwuZG9tVG9Xb3Jrc3BhY2UoZGVmYXVsdFdvcmtzcGFjZUJsb2NrcywgdGhpcy53b3Jrc3BhY2UpO1xuICAgICAgfVxuXG4gICAgfVxuXG4gICAgX2xpc3RlbkJsb2NrbHlFdmVudHMoZXZ0KSB7XG4gICAgICBpZiAoZXZ0LmRhdGEudHlwZT09PSAnbW9kZWwnICYmICF0aGlzLndvcmtzcGFjZS5saXN0ZW5lcnNfLmxlbmd0aCkge1xuICAgICAgICB0aGlzLndvcmtzcGFjZS5hZGRDaGFuZ2VMaXN0ZW5lcih0aGlzLnRvZ2dsZUJsb2NrbHlFdmVudCk7XG4gICAgICB9XG4gICAgfVxuXG4gIH1cblxuICBNb2RlbGluZ0RhdGFUYWIuY3JlYXRlID0gKGRhdGEgPSB7fSkgPT4ge1xuICAgIHJldHVybiBuZXcgTW9kZWxpbmdEYXRhVGFiKHsgbW9kZWxEYXRhOiBkYXRhIH0pXG4gIH1cblxuICByZXR1cm4gTW9kZWxpbmdEYXRhVGFiO1xufSlcbiJdfQ==
