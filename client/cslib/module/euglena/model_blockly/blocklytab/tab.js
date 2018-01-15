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
          // open the tab
          this._model.set('open', true);
        } else if (this._model.get('open')) {
          // close the tab
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

            var defaultWorkspaceBlocks = document.getElementById("defaultWorkspaceBlocks");
            window.Blockly.Xml.domToWorkspace(defaultWorkspaceBlocks, this.workspace);

            this.workspace.addChangeListener(this.toggleBlocklyEvent);
            this.hasListener = true;

            Globals.set('blocklyLoaded', true);
          }
        }
      }
    }, {
      key: 'toggleBlocklyEvent',
      value: function toggleBlocklyEvent(evt) {
        if (evt.type != window.Blockly.Events.UI) {
          Globals.get('Relay').dispatchEvent('Blockly.Changed', { blocklyEvt: evt, modelType: 'blockly' });
        }
      }
    }, {
      key: '_onBlocklyLoad',
      value: function _onBlocklyLoad(evt) {
        //let workspace = window.Blockly.getMainWorkspace();
        if (!this.workspace) {
          throw new Error("Blockly workspace does not exist.");
        }
        this.workspace.removeChangeListener(this.toggleBlocklyEvent);
        this.hasListener = false;
        this.workspace.clear();
        if (evt.data) {
          var blocklyXml = $.parseXML(evt.data).documentElement;
          window.Blockly.Xml.domToWorkspace(blocklyXml, this.workspace); //.then(() => {console.log('here')});
        }
      }
    }, {
      key: '_listenBlocklyEvents',
      value: function _listenBlocklyEvents(evt) {
        if (!this.hasListener) {
          this.workspace.addChangeListener(this.toggleBlocklyEvent);
          this.hasListener = true;
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9ldWdsZW5hL21vZGVsX2Jsb2NrbHkvYmxvY2tseXRhYi90YWIuanMiXSwibmFtZXMiOlsiZGVmaW5lIiwicmVxdWlyZSIsIlV0aWxzIiwiR2xvYmFscyIsIkhNIiwiQ29tcG9uZW50IiwiTW9kZWwiLCJWaWV3IiwiTW9kZWxpbmdEYXRhVGFiIiwic2V0dGluZ3MiLCJtb2RlbENsYXNzIiwidmlld0NsYXNzIiwiYmluZE1ldGhvZHMiLCJzZXQiLCJnZXQiLCJhZGRFdmVudExpc3RlbmVyIiwiX29uVG9nZ2xlUmVxdWVzdCIsIl9vblBoYXNlQ2hhbmdlIiwiX29uQmxvY2tseUxvYWQiLCJfbGlzdGVuQmxvY2tseUV2ZW50cyIsInZpZXciLCJoaWRlIiwic2hvdyIsImV2dCIsIm5hbWUiLCJfbW9kZWwiLCJ0b2dnbGUiLCJsb2ciLCJ0eXBlIiwiY2F0ZWdvcnkiLCJkYXRhIiwiZGlzcGxheVN0YXRlIiwiZ2V0RGlzcGxheVN0YXRlIiwidmlzdWFsaXphdGlvbiIsInRhYlR5cGUiLCJyZXN1bHRJZCIsImV4cGVyaW1lbnRJZCIsInBoYXNlIiwiYmxvY2tseU9wdGlvbnMiLCJ0b29sYm94IiwiZG9jdW1lbnQiLCJnZXRFbGVtZW50QnlJZCIsImNvbGxhcHNlIiwiY29tbWVudHMiLCJkaXNhYmxlIiwibWF4QmxvY2tzIiwiSW5maW5pdHkiLCJ0cmFzaGNhbiIsImhvcml6b250YWxMYXlvdXQiLCJ0b29sYm94UG9zaXRpb24iLCJjc3MiLCJtZWRpYSIsInJ0bCIsInNjcm9sbGJhcnMiLCJzb3VuZHMiLCJvbmVCYXNlZEluZGV4Iiwid29ya3NwYWNlIiwid2luZG93IiwiQmxvY2tseSIsImluamVjdCIsImRlZmF1bHRXb3Jrc3BhY2VCbG9ja3MiLCJYbWwiLCJkb21Ub1dvcmtzcGFjZSIsImFkZENoYW5nZUxpc3RlbmVyIiwidG9nZ2xlQmxvY2tseUV2ZW50IiwiaGFzTGlzdGVuZXIiLCJFdmVudHMiLCJVSSIsImRpc3BhdGNoRXZlbnQiLCJibG9ja2x5RXZ0IiwibW9kZWxUeXBlIiwiRXJyb3IiLCJyZW1vdmVDaGFuZ2VMaXN0ZW5lciIsImNsZWFyIiwiYmxvY2tseVhtbCIsIiQiLCJwYXJzZVhNTCIsImRvY3VtZW50RWxlbWVudCIsImNyZWF0ZSIsIm1vZGVsRGF0YSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBQSxPQUFPLFVBQUNDLE9BQUQsRUFBYTtBQUNsQixNQUFNQyxRQUFRRCxRQUFRLGlCQUFSLENBQWQ7QUFBQSxNQUNFRSxVQUFVRixRQUFRLG9CQUFSLENBRFo7QUFBQSxNQUVFRyxLQUFLSCxRQUFRLHlCQUFSLENBRlA7O0FBSUEsTUFBTUksWUFBWUosUUFBUSwwQkFBUixDQUFsQjtBQUFBLE1BQ0VLLFFBQVFMLFFBQVEsU0FBUixDQURWO0FBQUEsTUFFRU0sT0FBT04sUUFBUSxRQUFSLENBRlQ7O0FBTGtCLE1BU1pPLGVBVFk7QUFBQTs7QUFVaEIsK0JBQTJCO0FBQUEsVUFBZkMsUUFBZSx1RUFBSixFQUFJOztBQUFBOztBQUN6QkEsZUFBU0MsVUFBVCxHQUFzQkQsU0FBU0MsVUFBVCxJQUF1QkosS0FBN0M7QUFDQUcsZUFBU0UsU0FBVCxHQUFxQkYsU0FBU0UsU0FBVCxJQUFzQkosSUFBM0M7O0FBRnlCLG9JQUduQkUsUUFIbUI7O0FBSXpCUCxZQUFNVSxXQUFOLFFBQXdCLENBQUMsa0JBQUQsRUFBcUIsd0JBQXJCLEVBQStDLG9CQUEvQyxFQUFxRSxpQkFBckUsRUFBd0YsZ0JBQXhGLEVBQTBHLG9CQUExRyxFQUFnSSxnQkFBaEksRUFBa0osc0JBQWxKLENBQXhCOztBQUVBVCxjQUFRVSxHQUFSLENBQVksZUFBWixFQUE0QixLQUE1Qjs7QUFFQVYsY0FBUVcsR0FBUixDQUFZLE9BQVosRUFBcUJDLGdCQUFyQixDQUFzQywyQkFBdEMsRUFBbUUsTUFBS0MsZ0JBQXhFO0FBQ0FiLGNBQVFXLEdBQVIsQ0FBWSxPQUFaLEVBQXFCQyxnQkFBckIsQ0FBc0MsWUFBdEMsRUFBb0QsTUFBS0MsZ0JBQXpEOztBQUVBYixjQUFRVyxHQUFSLENB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RjtBQXpJZTtBQUFBO0FBQUEscUNBMklEL0MsR0EzSUMsRUEySUk7QUFDbEI7QUFDQSxZQUFJLENBQUMsS0FBS2lDLFNBQVYsRUFBcUI7QUFDbkIsZ0JBQU0sSUFBSWUsS0FBSixDQUFVLG1DQUFWLENBQU47QUFDRDtBQUNELGFBQUtmLFNBQUwsQ0FBZWdCLG9CQUFmLENBQW9DLEtBQUtSLGtCQUF6QztBQUNBLGFBQUtDLFdBQUwsR0FBbUIsS0FBbkI7QUFDQSxhQUFLVCxTQUFMLENBQWVpQixLQUFmO0FBQ0EsWUFBSWxELElBQUlPLElBQVIsRUFBYztBQUNaLGNBQU00QyxhQUFhQyxFQUFFQyxRQUFGLENBQVdyRCxJQUFJTyxJQUFmLEVBQXFCK0MsZUFBeEM7QUFDQXBCLGlCQUFPQyxPQUFQLENBQWVHLEdBQWYsQ0FBbUJDLGNBQW5CLENBQWtDWSxVQUFsQyxFQUE4QyxLQUFLbEIsU0FBbkQsRUFGWSxDQUVrRDtBQUMvRDtBQUNGO0FBdkplO0FBQUE7QUFBQSwyQ0F5SktqQyxHQXpKTCxFQXlKVTtBQUN4QixZQUFJLENBQUMsS0FBSzBDLFdBQVYsRUFBdUI7QUFDckIsZUFBS1QsU0FBTCxDQUFlTyxpQkFBZixDQUFpQyxLQUFLQyxrQkFBdEM7QUFDQSxlQUFLQyxXQUFMLEdBQW1CLElBQW5CO0FBQ0Q7QUFDRjtBQTlKZTs7QUFBQTtBQUFBLElBU1k1RCxTQVRaOztBQWtLbEJHLGtCQUFnQnNFLE1BQWhCLEdBQXlCLFlBQWU7QUFBQSxRQUFkaEQsSUFBYyx1RUFBUCxFQUFPOztBQUN0QyxXQUFPLElBQUl0QixlQUFKLENBQW9CLEVBQUV1RSxXQUFXakQsSUFBYixFQUFwQixDQUFQO0FBQ0QsR0FGRDs7QUFJQSxTQUFPdEIsZUFBUDtBQUNELENBdktEIiwiZmlsZSI6Im1vZHVsZS9ldWdsZW5hL21vZGVsX2Jsb2NrbHkvYmxvY2tseXRhYi90YWIuanMiLCJzb3VyY2VzQ29udGVudCI6WyJkZWZpbmUoKHJlcXVpcmUpID0+IHtcbiAgY29uc3QgVXRpbHMgPSByZXF1aXJlKCdjb3JlL3V0aWwvdXRpbHMnKSxcbiAgICBHbG9iYWxzID0gcmVxdWlyZSgnY29yZS9tb2RlbC9nbG9iYWxzJyksXG4gICAgSE0gPSByZXF1aXJlKCdjb3JlL2V2ZW50L2hvb2tfbWFuYWdlcicpO1xuXG4gIGNvbnN0IENvbXBvbmVudCA9IHJlcXVpcmUoJ2NvcmUvY29tcG9uZW50L2NvbXBvbmVudCcpLFxuICAgIE1vZGVsID0gcmVxdWlyZSgnLi9tb2RlbCcpLFxuICAgIFZpZXcgPSByZXF1aXJlKCcuL3ZpZXcnKTtcblxuICBjbGFzcyBNb2RlbGluZ0RhdGFUYWIgZXh0ZW5kcyBDb21wb25lbnQge1xuICAgIGNvbnN0cnVjdG9yKHNldHRpbmdzID0ge30pIHtcbiAgICAgIHNldHRpbmdzLm1vZGVsQ2xhc3MgPSBzZXR0aW5ncy5tb2RlbENsYXNzIHx8IE1vZGVsO1xuICAgICAgc2V0dGluZ3Mudmlld0NsYXNzID0gc2V0dGluZ3Mudmlld0NsYXNzIHx8IFZpZXc7XG4gICAgICBzdXBlcihzZXR0aW5ncyk7XG4gICAgICBVdGlscy5iaW5kTWV0aG9kcyh0aGlzLCBbJ19vblRvZ2dsZVJlcXVlc3QnLCAnX29uUmVzdWx0VG9nZ2xlUmVxdWVzdCcsICdfb25DbGVhckFsbFJlcXVlc3QnLCAnX29uQ2xlYXJSZXF1ZXN0JywgJ19vblBoYXNlQ2hhbmdlJywgJ3RvZ2dsZUJsb2NrbHlFdmVudCcsICdfb25CbG9ja2x5TG9hZCcsICdfbGlzdGVuQmxvY2tseUV2ZW50cyddKVxuXG4gICAgICBHbG9iYWxzLnNldCgnYmxvY2tseUxvYWRlZCcsZmFsc2UpO1xuXG4gICAgICBHbG9iYWxzLmdldCgnUmVsYXknKS5hZGRFdmVudExpc3RlbmVyKCdNb2RlbGluZ1RhYi5Ub2dnbGVSZXF1ZXN0JywgdGhpcy5fb25Ub2dnbGVSZXF1ZXN0KVxuICAgICAgR2xvYmFscy5nZXQoJ1JlbGF5JykuYWRkRXZlbnRMaXN0ZW5lcignVGFiLkNoYW5nZScsIHRoaXMuX29uVG9nZ2xlUmVxdWVzdClcblxuICAgICAgR2xvYmFscy5nZXQoJ1JlbGF5JykuYWRkRXZlbnRMaXN0ZW5lcignQXBwUGhhc2UuQ2hhbmdlJywgdGhpcy5fb25QaGFzZUNoYW5nZSlcbiAgICAgIEdsb2JhbHMuZ2V0KCdSZWxheScpLmFkZEV2ZW50TGlzdGVuZXIoJ0Jsb2NrbHkuTG9hZCcsIHRoaXMuX29uQmxvY2tseUxvYWQpXG5cbiAgICAgIEdsb2JhbHMuZ2V0KCdSZWxheScpLmFkZEV2ZW50TGlzdGVuZXIoJ05vdGlmaWNhdGlvbnMuUmVtb3ZlJyx0aGlzLl9saXN0ZW5CbG9ja2x5RXZlbnRzKVxuXG5cbiAgICB9XG5cbiAgICBoaWRlKCkge1xuICAgICAgdGhpcy52aWV3KCkuaGlkZSgpO1xuICAgIH1cblxuICAgIHNob3coKSB7XG4gICAgICB0aGlzLnZpZXcoKS5zaG93KCk7XG4gICAgfVxuXG4gICAgX29uVG9nZ2xlUmVxdWVzdChldnQpIHtcbiAgICAgIGlmIChldnQubmFtZSA9PSAnTW9kZWxpbmdUYWIuVG9nZ2xlUmVxdWVzdCcpIHtcbiAgICAgICAgdGhpcy5fbW9kZWwudG9nZ2xlKCk7XG5cbiAgICAgICAgR2xvYmFscy5nZXQoJ0xvZ2dlcicpLmxvZyh7XG4gICAgICAgICAgdHlwZTogdGhpcy5fbW9kZWwuZ2V0KCdvcGVuJykgPyAnb3BlbicgOiAnY2xvc2UnLFxuICAgICAgICAgIGNhdGVnb3J5OiAnbW9kZWxpbmcnLFxuICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgIGRpc3BsYXlTdGF0ZTogdGhpcy5fbW9kZWwuZ2V0RGlzcGxheVN0YXRlKCksXG4gICAgICAgICAgICB2aXN1YWxpemF0aW9uOiAnJy8vdGhpcy52aWV3KCkuZ2V0Q3VycmVudFZpc3VhbGl6YXRpb24oKVxuICAgICAgICAgIH1cbiAgICAgICAgfSlcbiAgICAgIH0gZWxzZSBpZiAoZXZ0LmRhdGEudGFiVHlwZSA9PSAnYmxvY2tseScpIHtcbiAgICAgICAgICAvLyBvcGVuIHRoZSB0YWJcbiAgICAgICAgICB0aGlzLl9tb2RlbC5zZXQoJ29wZW4nLHRydWUpO1xuXG4gICAgICB9IGVsc2UgaWYgKHRoaXMuX21vZGVsLmdldCgnb3BlbicpKSB7XG4gICAgICAgIC8vIGNsb3NlIHRoZSB0YWJcbiAgICAgICAgdGhpcy5fbW9kZWwudG9nZ2xlKCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgX29uUmVzdWx0VG9nZ2xlUmVxdWVzdChldnQpIHtcbiAgICAgIC8vdGhpcy5fbW9kZWwudG9nZ2xlUmVzdWx0KGV2dC5kYXRhLnJlc3VsdElkKTtcbiAgICAgIEdsb2JhbHMuZ2V0KCdMb2dnZXInKS5sb2coe1xuICAgICAgICB0eXBlOiAncmVzdWx0X3RvZ2dsZScsXG4gICAgICAgIGNhdGVnb3J5OiAnbW9kZWxpbmcnLFxuICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgZGlzcGxheVN0YXRlOiB0aGlzLl9tb2RlbC5nZXREaXNwbGF5U3RhdGUoKSxcbiAgICAgICAgICB2aXN1YWxpemF0aW9uOiAnJy8vdGhpcy52aWV3KCkuZ2V0Q3VycmVudFZpc3VhbGl6YXRpb24oKVxuICAgICAgICB9XG4gICAgICB9KVxuICAgIH1cblxuICAgIF9vbkNsZWFyUmVxdWVzdChldnQpIHtcbiAgICAgIC8vdGhpcy5fbW9kZWwuY2xlYXJSZXN1bHQoZXZ0LmRhdGEucmVzdWx0SWQpO1xuICAgICAgR2xvYmFscy5nZXQoJ0xvZ2dlcicpLmxvZyh7XG4gICAgICAgIHR5cGU6ICdyZW1vdmVfZGF0YScsXG4gICAgICAgIGNhdGVnb3J5OiAnbW9kZWxpbmcnLFxuICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgcmVzdWx0SWQ6IGV2dC5kYXRhLnJlc3VsdElkLFxuICAgICAgICAgIGRpc3BsYXlTdGF0ZTogdGhpcy5fbW9kZWwuZ2V0RGlzcGxheVN0YXRlKCksXG4gICAgICAgICAgdmlzdWFsaXphdGlvbjogJycvL3RoaXMudmlldygpLmdldEN1cnJlbnRWaXN1YWxpemF0aW9uKClcbiAgICAgICAgfVxuICAgICAgfSlcbiAgICB9XG5cbiAgICBfb25DbGVhckFsbFJlcXVlc3QoZXZ0KSB7XG4gICAgICAvL3RoaXMuX21vZGVsLmNsZWFyUmVzdWx0R3JvdXAoZXZ0LmRhdGEuZXhwZXJpbWVudElkKTtcbiAgICAgIEdsb2JhbHMuZ2V0KCdMb2dnZXInKS5sb2coe1xuICAgICAgICB0eXBlOiAncmVtb3ZlX2dyb3VwJyxcbiAgICAgICAgY2F0ZWdvcnk6ICdtb2RlbGluZycsXG4gICAgICAgIGRhdGE6IHtcbiAgICAgICAgICBleHBlcmltZW50SWQ6IGV2dC5kYXRhLmV4cGVyaW1lbnRJZCxcbiAgICAgICAgICBkaXNwbGF5U3RhdGU6IHRoaXMuX21vZGVsLmdldERpc3BsYXlTdGF0ZSgpLFxuICAgICAgICAgIHZpc3VhbGl6YXRpb246ICcnLy90aGlzLnZpZXcoKS5nZXRDdXJyZW50VmlzdWFsaXphdGlvbigpXG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgfVxuXG5cbiAgICBfb25QaGFzZUNoYW5nZShldnQpIHtcbiAgICAgIGlmIChldnQuZGF0YS5waGFzZSA9PSBcImxvZ2luXCIgfHwgZXZ0LmRhdGEucGhhc2UgPT0gXCJsb2dpbl9hdHRlbXB0ZWRcIikge1xuICAgICAgICBpZiAoIUdsb2JhbHMuZ2V0KCdibG9ja2x5TG9hZGVkJykpIHtcblxuICAgICAgICAgIHZhciBibG9ja2x5T3B0aW9ucyA9IHtcbiAgICAgICAgICAgIHRvb2xib3ggOiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgndG9vbGJveCcpLFxuICAgICAgICAgICAgY29sbGFwc2UgOiB0cnVlLFxuICAgICAgICAgICAgY29tbWVudHMgOiB0cnVlLFxuICAgICAgICAgICAgZGlzYWJsZSA6IHRydWUsXG4gICAgICAgICAgICBtYXhCbG9ja3MgOiBJbmZpbml0eSxcbiAgICAgICAgICAgIHRyYXNoY2FuIDogdHJ1ZSxcbiAgICAgICAgICAgIGhvcml6b250YWxMYXlvdXQgOiB0cnVlLFxuICAgICAgICAgICAgdG9vbGJveFBvc2l0aW9uIDogJ3N0YXJ0JyxcbiAgICAgICAgICAgIGNzcyA6IHRydWUsXG4gICAgICAgICAgICBtZWRpYSA6ICdodHRwczovL2Jsb2NrbHktZGVtby5hcHBzcG90LmNvbS9zdGF0aWMvbWVkaWEvJyxcbiAgICAgICAgICAgIHJ0bCA6IGZhbHNlLFxuICAgICAgICAgICAgc2Nyb2xsYmFycyA6IHRydWUsXG4gICAgICAgICAgICBzb3VuZHMgOiB0cnVlLFxuICAgICAgICAgICAgb25lQmFzZWRJbmRleCA6IHRydWVcbiAgICAgICAgICB9O1xuXG4gICAgICAgICAgdGhpcy53b3Jrc3BhY2UgPSB3aW5kb3cuQmxvY2tseS5pbmplY3QoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ0Jsb2NrbHlEaXYnKSwgYmxvY2tseU9wdGlvbnMpO1xuXG4gICAgICAgICAgdmFyIGRlZmF1bHRXb3Jrc3BhY2VCbG9ja3MgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImRlZmF1bHRXb3Jrc3BhY2VCbG9ja3NcIik7XG4gICAgICAgICAgd2luZG93LkJsb2NrbHkuWG1sLmRvbVRvV29ya3NwYWNlKGRlZmF1bHRXb3Jrc3BhY2VCbG9ja3MsIHRoaXMud29ya3NwYWNlKTtcblxuICAgICAgICAgIHRoaXMud29ya3NwYWNlLmFkZENoYW5nZUxpc3RlbmVyKHRoaXMudG9nZ2xlQmxvY2tseUV2ZW50KTtcbiAgICAgICAgICB0aGlzLmhhc0xpc3RlbmVyID0gdHJ1ZTtcblxuICAgICAgICAgIEdsb2JhbHMuc2V0KCdibG9ja2x5TG9hZGVkJyx0cnVlKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIHRvZ2dsZUJsb2NrbHlFdmVudChldnQpIHtcbiAgICAgIGlmIChldnQudHlwZSAhPSB3aW5kb3cuQmxvY2tseS5FdmVudHMuVUkpIHtcbiAgICAgICAgR2xvYmFscy5nZXQoJ1JlbGF5JykuZGlzcGF0Y2hFdmVudCgnQmxvY2tseS5DaGFuZ2VkJywge2Jsb2NrbHlFdnQ6IGV2dCwgbW9kZWxUeXBlOiAnYmxvY2tseSd9KTtcbiAgICAgIH1cblxuICAgIH1cblxuICAgIF9vbkJsb2NrbHlMb2FkKGV2dCkge1xuICAgICAgLy9sZXQgd29ya3NwYWNlID0gd2luZG93LkJsb2NrbHkuZ2V0TWFpbldvcmtzcGFjZSgpO1xuICAgICAgaWYgKCF0aGlzLndvcmtzcGFjZSkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJCbG9ja2x5IHdvcmtzcGFjZSBkb2VzIG5vdCBleGlzdC5cIik7XG4gICAgICB9XG4gICAgICB0aGlzLndvcmtzcGFjZS5yZW1vdmVDaGFuZ2VMaXN0ZW5lcih0aGlzLnRvZ2dsZUJsb2NrbHlFdmVudCk7XG4gICAgICB0aGlzLmhhc0xpc3RlbmVyID0gZmFsc2U7XG4gICAgICB0aGlzLndvcmtzcGFjZS5jbGVhcigpO1xuICAgICAgaWYgKGV2dC5kYXRhKSB7XG4gICAgICAgIGNvbnN0IGJsb2NrbHlYbWwgPSAkLnBhcnNlWE1MKGV2dC5kYXRhKS5kb2N1bWVudEVsZW1lbnQ7XG4gICAgICAgIHdpbmRvdy5CbG9ja2x5LlhtbC5kb21Ub1dvcmtzcGFjZShibG9ja2x5WG1sLCB0aGlzLndvcmtzcGFjZSk7Ly8udGhlbigoKSA9PiB7Y29uc29sZS5sb2coJ2hlcmUnKX0pO1xuICAgICAgfVxuICAgIH1cblxuICAgIF9saXN0ZW5CbG9ja2x5RXZlbnRzKGV2dCkge1xuICAgICAgaWYgKCF0aGlzLmhhc0xpc3RlbmVyKSB7XG4gICAgICAgIHRoaXMud29ya3NwYWNlLmFkZENoYW5nZUxpc3RlbmVyKHRoaXMudG9nZ2xlQmxvY2tseUV2ZW50KTtcbiAgICAgICAgdGhpcy5oYXNMaXN0ZW5lciA9IHRydWU7XG4gICAgICB9XG4gICAgfVxuXG4gIH1cblxuICBNb2RlbGluZ0RhdGFUYWIuY3JlYXRlID0gKGRhdGEgPSB7fSkgPT4ge1xuICAgIHJldHVybiBuZXcgTW9kZWxpbmdEYXRhVGFiKHsgbW9kZWxEYXRhOiBkYXRhIH0pXG4gIH1cblxuICByZXR1cm4gTW9kZWxpbmdEYXRhVGFiO1xufSlcbiJdfQ==
