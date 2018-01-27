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
        this.hasListener = false;
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9ldWdsZW5hL21vZGVsX2Jsb2NrbHkvYmxvY2tseXRhYi90YWIuanMiXSwibmFtZXMiOlsiZGVmaW5lIiwicmVxdWlyZSIsIlV0aWxzIiwiR2xvYmFscyIsIkhNIiwiQ29tcG9uZW50IiwiTW9kZWwiLCJWaWV3IiwiTW9kZWxpbmdEYXRhVGFiIiwic2V0dGluZ3MiLCJtb2RlbENsYXNzIiwidmlld0NsYXNzIiwiYmluZE1ldGhvZHMiLCJzZXQiLCJnZXQiLCJhZGRFdmVudExpc3RlbmVyIiwiX29uVG9nZ2xlUmVxdWVzdCIsIl9vblBoYXNlQ2hhbmdlIiwiX29uQmxvY2tseUxvYWQiLCJfbGlzdGVuQmxvY2tseUV2ZW50cyIsInZpZXciLCJoaWRlIiwic2hvdyIsImV2dCIsIm5hbWUiLCJfbW9kZWwiLCJ0b2dnbGUiLCJsb2ciLCJ0eXBlIiwiY2F0ZWdvcnkiLCJkYXRhIiwiZGlzcGxheVN0YXRlIiwiZ2V0RGlzcGxheVN0YXRlIiwidmlzdWFsaXphdGlvbiIsInRhYlR5cGUiLCJyZXN1bHRJZCIsImV4cGVyaW1lbnRJZCIsInBoYXNlIiwiYmxvY2tseU9wdGlvbnMiLCJ0b29sYm94IiwiZG9jdW1lbnQiLCJnZXRFbGVtZW50QnlJZCIsImNvbGxhcHNlIiwiY29tbWVudHMiLCJkaXNhYmxlIiwibWF4QmxvY2tzIiwiSW5maW5pdHkiLCJ0cmFzaGNhbiIsImhvcml6b250YWxMYXlvdXQiLCJ0b29sYm94UG9zaXRpb24iLCJjc3MiLCJtZWRpYSIsInJ0bCIsInNjcm9sbGJhcnMiLCJzb3VuZHMiLCJvbmVCYXNlZEluZGV4Iiwid29ya3NwYWNlIiwid2luZG93IiwiQmxvY2tseSIsImluamVjdCIsImRlZmF1bHRXb3Jrc3BhY2VCbG9ja3MiLCJYbWwiLCJkb21Ub1dvcmtzcGFjZSIsImFkZENoYW5nZUxpc3RlbmVyIiwidG9nZ2xlQmxvY2tseUV2ZW50IiwiaGFzTGlzdGVuZXIiLCJkaXNwYXRjaEV2ZW50IiwiYmxvY2tseUV2dCIsIm1vZGVsVHlwZSIsIm1vZGlmeV9ibG9jayIsIkFycmF5IiwicHJvdG90eXBlIiwic2xpY2UiLCJjYWxsIiwiJCIsImZpbmQiLCJtYXAiLCJibG9jayIsImdldEF0dHJpYnV0ZSIsImdldEJsb2NrQnlJZCIsImJsb2NrSWQiLCJibG9ja190eXBlIiwiYmxvY2tEaXYiLCJzZXRBdHRyaWJ1dGUiLCJvbGRYbWwiLCJFcnJvciIsInJlbW92ZUNoYW5nZUxpc3RlbmVyIiwiY2xlYXIiLCJibG9ja2x5WG1sIiwicGFyc2VYTUwiLCJkb2N1bWVudEVsZW1lbnQiLCJwcmVzZW50QmxvY2tzIiwiZ2V0QWxsQmxvY2tzIiwiY3JlYXRlIiwibW9kZWxEYXRhIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQUFBLE9BQU8sVUFBQ0MsT0FBRCxFQUFhO0FBQ2xCLE1BQU1DLFFBQVFELFFBQVEsaUJBQVIsQ0FBZDtBQUFBLE1BQ0VFLFVBQVVGLFFBQVEsb0JBQVIsQ0FEWjtBQUFBLE1BRUVHLEtBQUtILFFBQVEseUJBQVIsQ0FGUDs7QUFJQSxNQUFNSSxZQUFZSixRQUFRLDBCQUFSLENBQWxCO0FBQUEsTUFDRUssUUFBUUwsUUFBUSxTQUFSLENBRFY7QUFBQSxNQUVFTSxPQUFPTixRQUFRLFFBQVIsQ0FGVDs7QUFMa0IsTUFTWk8sZUFUWTtBQUFBOztBQVVoQiwrQkFBMkI7QUFBQSxVQUFmQyxRQUFlLHVFQUFKLEVBQUk7O0FBQUE7O0FBQ3pCQSxlQUFTQyxVQUFULEdBQXNCRCxTQUFTQyxVQUFULElBQXVCSixLQUE3QztBQUNBRyxlQUFTRSxTQUFULEdBQXFCRixTQUFTRSxTQUFULElBQXNCSixJQUEzQzs7QUFGeUIsb0lBR25CRSxRQUhtQjs7QUFJekJQLFlBQU1VLFdBQU4sUUFBd0IsQ0FBQyxrQkFBRCxFQUFxQix3QkFBckIsRUFBK0Msb0JBQS9DLEVBQXFFLGlCQUFyRSxFQUF3RixnQkFBeEYsRUFBMEcsb0JBQTFHLEVBQWdJLGdCQUFoSSxFQUFrSixzQkFBbEosQ0FBeEI7O0FBRUFULGNBQVFVLEdBQVIsQ0FBWSxlQUFaLEVBQTRCLEtBQTVCOztBQUVBVixjQUFRVyxHQUFSLENBQVksT0FBWixFQUFxQkMsZ0JBQXJCLENBQXNDLDJCQUF0QyxFQUFtRSxNQUFLQyxnQkFBeEU7QUFDQWIsY0FBUVcsR0FBUixDQUFZLE9BQVosRUFBcUJDLGdCQUFyQixDQUFzQyxZQUF0QyxFQUFvRCxNQUFLQyxnQkFBekQ7O0FBRUFiLGNBQVFXLEdBQVIsQ0FBWSxPQUFaLEVBQXFCQyxnQkFBckIsQ0FBc0MsaUJBQXRDLEVBQXlELE1BQUtFLGNBQTlEO0FBQ0FkLGNBQVFXLEdBQVIsQ0FBWSxPQUFaLEVBQXFCQyxnQkFBckIsQ0FBc0MsY0FBdEMsRUFBc0QsTUFBS0csY0FBM0Q7O0FBRUFmLGNBQVFXLEdBQVIsQ0FBWSxPQUFaLEVBQXFCQyxnQkFBckIsQ0FBc0Msc0JBQXRDLEVBQTZELE1BQUtJLG9CQUFsRTs7QUFkeUI7QUFpQjFCOztBQTNCZTtBQUFBO0FBQUEsNkJBNkJUO0FBQ0wsYUFBS0MsSUFBTCxHQUFZQyxJQUFaO0FBQ0Q7QUEvQmU7QUFBQTtBQUFBLDZCQWlDVDtBQUNMLGFBQUtELElBQUwsR0FBWUUsSUFBWjtBQUNEO0FBbkNlO0FBQUE7QUFBQSx1Q0FxQ0NDLEdBckNELEVBcUNNO0FBQ3BCLFlBQUlBLElBQUlDLElBQUosSUFBWSwyQkFBaEIsRUFBNkM7QUFDM0MsZUFBS0MsTUFBTCxDQUFZQyxNQUFaOztBQUVBdkIsa0JBQVFXLEdBQVIsQ0FBWSxRQUFaLEVBQXNCYSxHQUF0QixDQUEwQjtBQUN4QkMsa0JBQU0sS0FBS0gsTUFBTCxDQUFZWCxHQUFaLENBQWdCLE1BQWhCLElBQTBCLE1BQTFCLEdBQW1DLE9BRGpCO0FBRXhCZSxzQkFBVSxVQUZjO0FBR3hCQyxrQkFBTTtBQUNKQyw0QkFBYyxLQUFLTixNQUFMLENBQVlPLGVBQVosRUFEVjtBQUVKQyw2QkFBZSxFQUZYLENBRWE7QUFGYjtBQUhrQixXQUExQjtBQVFELFNBWEQsTUFXTyxJQUFJVixJQUFJTyxJQUFKLENBQVNJLE9BQVQsSUFBb0IsU0FBeEIsRUFBbUM7QUFDdEM7QUFDQSxlQUFLVCxNQUFMLENBQVlaLEdBQVosQ0FBZ0IsTUFBaEIsRUFBdUIsSUFBdkI7QUFFSCxTQUpNLE1BSUEsSUFBSSxLQUFLWSxNQUFMLENBQVlYLEdBQVosQ0FBZ0IsTUFBaEIsQ0FBSixFQUE2QjtBQUNsQztBQUNBLGVBQUtXLE1BQUwsQ0FBWUMsTUFBWjtBQUNEO0FBQ0Y7QUF6RGU7QUFBQTtBQUFBLDZDQTJET0gsR0EzRFAsRUEyRFk7QUFDMUI7QUFDQXBCLGdCQUFRVyxHQUFSLENBQVksUUFBWixFQUFzQmEsR0FBdEIsQ0FBMEI7QUFDeEJDLGdCQUFNLGVBRGtCO0FBRXhCQyxvQkFBVSxVQUZjO0FBR3hCQyxnQkFBTTtBQUNKQywwQkFBYyxLQUFLTixNQUFMLENBQVlPLGVBQVosRUFEVjtBQUVKQywyQkFBZSxFQUZYLENBRWE7QUFGYjtBQUhrQixTQUExQjtBQVFEO0FBckVlO0FBQUE7QUFBQSxzQ0F1RUFWLEdBdkVBLEVBdUVLO0FBQ25CO0FBQ0FwQixnQkFBUVcsR0FBUixDQUFZLFFBQVosRUFBc0JhLEdBQXRCLENBQTBCO0FBQ3hCQyxnQkFBTSxhQURrQjtBQUV4QkMsb0JBQVUsVUFGYztBQUd4QkMsZ0JBQU07QUFDSkssc0JBQVVaLElBQUlPLElBQUosQ0FBU0ssUUFEZjtBQUVKSiwwQkFBYyxLQUFLTixNQUFMLENBQVlPLGVBQVosRUFGVjtBQUdKQywyQkFBZSxFQUhYLENBR2E7QUFIYjtBQUhrQixTQUExQjtBQVNEO0FBbEZlO0FBQUE7QUFBQSx5Q0FvRkdWLEdBcEZILEVBb0ZRO0FBQ3RCO0FBQ0FwQixnQkFBUVcsR0FBUixDQUFZLFFBQVosRUFBc0JhLEdBQXRCLENBQTBCO0FBQ3hCQyxnQkFBTSxjQURrQjtBQUV4QkMsb0JBQVUsVUFGYztBQUd4QkMsZ0JBQU07QUFDSk0sMEJBQWNiLElBQUlPLElBQUosQ0FBU00sWUFEbkI7QUFFSkwsMEJBQWMsS0FBS04sTUFBTCxDQUFZTyxlQUFaLEVBRlY7QUFHSkMsMkJBQWUsRUFIWCxDQUdhO0FBSGI7QUFIa0IsU0FBMUI7QUFTRDtBQS9GZTtBQUFBO0FBQUEscUNBa0dEVixHQWxHQyxFQWtHSTtBQUNsQixZQUFJQSxJQUFJTyxJQUFKLENBQVNPLEtBQVQsSUFBa0IsT0FBbEIsSUFBNkJkLElBQUlPLElBQUosQ0FBU08sS0FBVCxJQUFrQixpQkFBbkQsRUFBc0U7QUFDcEUsY0FBSSxDQUFDbEMsUUFBUVcsR0FBUixDQUFZLGVBQVosQ0FBTCxFQUFtQzs7QUFFakMsZ0JBQUl3QixpQkFBaUI7QUFDbkJDLHVCQUFVQyxTQUFTQyxjQUFULENBQXdCLFNBQXhCLENBRFM7QUFFbkJDLHdCQUFXLElBRlE7QUFHbkJDLHdCQUFXLElBSFE7QUFJbkJDLHVCQUFVLElBSlM7QUFLbkJDLHlCQUFZQyxRQUxPO0FBTW5CQyx3QkFBVyxJQU5RO0FBT25CQyxnQ0FBbUIsSUFQQTtBQVFuQkMsK0JBQWtCLE9BUkM7QUFTbkJDLG1CQUFNLElBVGE7QUFVbkJDLHFCQUFRLGdEQVZXO0FBV25CQyxtQkFBTSxLQVhhO0FBWW5CQywwQkFBYSxJQVpNO0FBYW5CQyxzQkFBUyxJQWJVO0FBY25CQyw2QkFBZ0I7QUFkRyxhQUFyQjs7QUFpQkEsaUJBQUtDLFNBQUwsR0FBaUJDLE9BQU9DLE9BQVAsQ0FBZUMsTUFBZixDQUFzQm5CLFNBQVNDLGNBQVQsQ0FBd0IsWUFBeEIsQ0FBdEIsRUFBNkRILGNBQTdELENBQWpCOztBQUVBLGdCQUFJc0IseUJBQXlCcEIsU0FBU0MsY0FBVCxDQUF3Qix3QkFBeEIsQ0FBN0I7QUFDQWdCLG1CQUFPQyxPQUFQLENBQWVHLEdBQWYsQ0FBbUJDLGNBQW5CLENBQWtDRixzQkFBbEMsRUFBMEQsS0FBS0osU0FBL0Q7O0FBRUEsaUJBQUtBLFNBQUwsQ0FBZU8saUJBQWYsQ0FBaUMsS0FBS0Msa0JBQXRDO0FBQ0EsaUJBQUtDLFdBQUwsR0FBbUIsSUFBbkI7O0FBRUE5RCxvQkFBUVUsR0FBUixDQUFZLGVBQVosRUFBNEIsSUFBNUI7QUFFRDtBQUNGO0FBQ0Y7QUFuSWU7QUFBQTtBQUFBLHlDQXFJR1UsR0FySUgsRUFxSVE7QUFBQTs7QUFDdEIsWUFBSUEsSUFBSUssSUFBSixJQUFZLElBQWhCLEVBQXNCO0FBQ3BCekIsa0JBQVFXLEdBQVIsQ0FBWSxPQUFaLEVBQXFCb0QsYUFBckIsQ0FBbUMsaUJBQW5DLEVBQXNELEVBQUNDLFlBQVk1QyxHQUFiLEVBQWtCNkMsV0FBVyxTQUE3QixFQUF0RDtBQUNEOztBQUVEO0FBQ0EsWUFBSTdDLElBQUlLLElBQUosSUFBWSxRQUFoQixFQUEwQjtBQUN4QixjQUFJeUMsZUFBZSxJQUFuQjtBQUNBQyxnQkFBTUMsU0FBTixDQUFnQkMsS0FBaEIsQ0FBc0JDLElBQXRCLENBQTJCQyxFQUFFbEMsU0FBU0MsY0FBVCxDQUF3Qix3QkFBeEIsQ0FBRixFQUFxRGtDLElBQXJELENBQTBELE9BQTFELENBQTNCLEVBQStGQyxHQUEvRixDQUFtRyxpQkFBUztBQUMxRyxnQkFBR0MsTUFBTUMsWUFBTixDQUFtQixNQUFuQixNQUErQixPQUFLdEIsU0FBTCxDQUFldUIsWUFBZixDQUE0QnhELElBQUl5RCxPQUFoQyxFQUF5Q3BELElBQTNFLEVBQWlGeUMsZUFBZSxLQUFmO0FBQ2xGLFdBRkQ7O0FBSUEsY0FBSUEsWUFBSixFQUFrQjtBQUNoQixnQkFBSVksYUFBYSxLQUFLekIsU0FBTCxDQUFldUIsWUFBZixDQUE0QnhELElBQUl5RCxPQUFoQyxFQUF5Q3BELElBQTFEO0FBQ0EsZ0JBQUlzRCxXQUFXMUMsU0FBU0MsY0FBVCxDQUF3QndDLFVBQXhCLENBQWY7QUFDQSxnQkFBSUMsU0FBU0osWUFBVCxDQUFzQixTQUF0QixNQUFxQyxHQUF6QyxFQUE4QztBQUM1Q0ksdUJBQVNDLFlBQVQsQ0FBc0IsVUFBdEIsRUFBaUMsSUFBakM7QUFDRDtBQUNGO0FBQ0Y7O0FBRUQ7QUFDQSxZQUFJNUQsSUFBSUssSUFBSixJQUFZLFFBQWhCLEVBQTBCO0FBQ3hCLGNBQUlxRCxhQUFhMUQsSUFBSTZELE1BQUosQ0FBV04sWUFBWCxDQUF3QixNQUF4QixDQUFqQjtBQUNBLGNBQUlJLFdBQVcxQyxTQUFTQyxjQUFULENBQXdCd0MsVUFBeEIsQ0FBZjtBQUNBLGNBQUlDLFNBQVNKLFlBQVQsQ0FBc0IsU0FBdEIsTUFBcUMsR0FBekMsRUFBOEM7QUFDNUNJLHFCQUFTQyxZQUFULENBQXNCLFVBQXRCLEVBQWlDLEtBQWpDO0FBQ0Q7QUFDRjs7QUFFRDtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTs7QUFNRDtBQWxMZTtBQUFBO0FBQUEscUNBb0xENUQsR0FwTEMsRUFvTEk7QUFDbEI7QUFDQSxZQUFJLENBQUMsS0FBS2lDLFNBQVYsRUFBcUI7QUFDbkIsZ0JBQU0sSUFBSTZCLEtBQUosQ0FBVSxtQ0FBVixDQUFOO0FBQ0Q7QUFDRCxhQUFLN0IsU0FBTCxDQUFlOEIsb0JBQWYsQ0FBb0MsS0FBS3RCLGtCQUF6QztBQUNBLGFBQUtDLFdBQUwsR0FBbUIsS0FBbkI7QUFDQSxhQUFLVCxTQUFMLENBQWUrQixLQUFmO0FBQ0EsWUFBSWhFLElBQUlPLElBQVIsRUFBYztBQUNaO0FBQ0EsY0FBTTBELGFBQWFkLEVBQUVlLFFBQUYsQ0FBV2xFLElBQUlPLElBQWYsRUFBcUI0RCxlQUF4QztBQUNBakMsaUJBQU9DLE9BQVAsQ0FBZUcsR0FBZixDQUFtQkMsY0FBbkIsQ0FBa0MwQixVQUFsQyxFQUE4QyxLQUFLaEMsU0FBbkQsRUFIWSxDQUdrRDs7QUFFOUQsY0FBTW1DLGdCQUFnQixLQUFLbkMsU0FBTCxDQUFlb0MsWUFBZixFQUF0QjtBQUNBRCx3QkFBY2YsR0FBZCxDQUFrQixpQkFBUztBQUN6QixnQkFBSU0sV0FBVzFDLFNBQVNDLGNBQVQsQ0FBd0JvQyxNQUFNakQsSUFBOUIsQ0FBZjtBQUNBLGdCQUFJc0QsUUFBSixFQUFjO0FBQ1osa0JBQUlBLFNBQVNKLFlBQVQsQ0FBc0IsU0FBdEIsTUFBcUMsR0FBekMsRUFBOEM7QUFDNUNJLHlCQUFTQyxZQUFULENBQXNCLFVBQXRCLEVBQWlDLElBQWpDO0FBQ0Q7QUFDRjtBQUNGLFdBUEQ7QUFRRDtBQUNGO0FBM01lO0FBQUE7QUFBQSwyQ0E2TUs1RCxHQTdNTCxFQTZNVTtBQUN4QixZQUFJLENBQUMsS0FBSzBDLFdBQVYsRUFBdUI7QUFDckIsZUFBS1QsU0FBTCxDQUFlTyxpQkFBZixDQUFpQyxLQUFLQyxrQkFBdEM7QUFDQSxlQUFLQyxXQUFMLEdBQW1CLElBQW5CO0FBQ0Q7QUFDRjtBQWxOZTs7QUFBQTtBQUFBLElBU1k1RCxTQVRaOztBQXNObEJHLGtCQUFnQnFGLE1BQWhCLEdBQXlCLFlBQWU7QUFBQSxRQUFkL0QsSUFBYyx1RUFBUCxFQUFPOztBQUN0QyxXQUFPLElBQUl0QixlQUFKLENBQW9CLEVBQUVzRixXQUFXaEUsSUFBYixFQUFwQixDQUFQO0FBQ0QsR0FGRDs7QUFJQSxTQUFPdEIsZUFBUDtBQUNELENBM05EIiwiZmlsZSI6Im1vZHVsZS9ldWdsZW5hL21vZGVsX2Jsb2NrbHkvYmxvY2tseXRhYi90YWIuanMiLCJzb3VyY2VzQ29udGVudCI6WyJkZWZpbmUoKHJlcXVpcmUpID0+IHtcbiAgY29uc3QgVXRpbHMgPSByZXF1aXJlKCdjb3JlL3V0aWwvdXRpbHMnKSxcbiAgICBHbG9iYWxzID0gcmVxdWlyZSgnY29yZS9tb2RlbC9nbG9iYWxzJyksXG4gICAgSE0gPSByZXF1aXJlKCdjb3JlL2V2ZW50L2hvb2tfbWFuYWdlcicpO1xuXG4gIGNvbnN0IENvbXBvbmVudCA9IHJlcXVpcmUoJ2NvcmUvY29tcG9uZW50L2NvbXBvbmVudCcpLFxuICAgIE1vZGVsID0gcmVxdWlyZSgnLi9tb2RlbCcpLFxuICAgIFZpZXcgPSByZXF1aXJlKCcuL3ZpZXcnKTtcblxuICBjbGFzcyBNb2RlbGluZ0RhdGFUYWIgZXh0ZW5kcyBDb21wb25lbnQge1xuICAgIGNvbnN0cnVjdG9yKHNldHRpbmdzID0ge30pIHtcbiAgICAgIHNldHRpbmdzLm1vZGVsQ2xhc3MgPSBzZXR0aW5ncy5tb2RlbENsYXNzIHx8IE1vZGVsO1xuICAgICAgc2V0dGluZ3Mudmlld0NsYXNzID0gc2V0dGluZ3Mudmlld0NsYXNzIHx8IFZpZXc7XG4gICAgICBzdXBlcihzZXR0aW5ncyk7XG4gICAgICBVdGlscy5iaW5kTWV0aG9kcyh0aGlzLCBbJ19vblRvZ2dsZVJlcXVlc3QnLCAnX29uUmVzdWx0VG9nZ2xlUmVxdWVzdCcsICdfb25DbGVhckFsbFJlcXVlc3QnLCAnX29uQ2xlYXJSZXF1ZXN0JywgJ19vblBoYXNlQ2hhbmdlJywgJ3RvZ2dsZUJsb2NrbHlFdmVudCcsICdfb25CbG9ja2x5TG9hZCcsICdfbGlzdGVuQmxvY2tseUV2ZW50cyddKVxuXG4gICAgICBHbG9iYWxzLnNldCgnYmxvY2tseUxvYWRlZCcsZmFsc2UpO1xuXG4gICAgICBHbG9iYWxzLmdldCgnUmVsYXknKS5hZGRFdmVudExpc3RlbmVyKCdNb2RlbGluZ1RhYi5Ub2dnbGVSZXF1ZXN0JywgdGhpcy5fb25Ub2dnbGVSZXF1ZXN0KVxuICAgICAgR2xvYmFscy5nZXQoJ1JlbGF5JykuYWRkRXZlbnRMaXN0ZW5lcignVGFiLkNoYW5nZScsIHRoaXMuX29uVG9nZ2xlUmVxdWVzdClcblxuICAgICAgR2xvYmFscy5nZXQoJ1JlbGF5JykuYWRkRXZlbnRMaXN0ZW5lcignQXBwUGhhc2UuQ2hhbmdlJywgdGhpcy5fb25QaGFzZUNoYW5nZSlcbiAgICAgIEdsb2JhbHMuZ2V0KCdSZWxheScpLmFkZEV2ZW50TGlzdGVuZXIoJ0Jsb2NrbHkuTG9hZCcsIHRoaXMuX29uQmxvY2tseUxvYWQpXG5cbiAgICAgIEdsb2JhbHMuZ2V0KCdSZWxheScpLmFkZEV2ZW50TGlzdGVuZXIoJ05vdGlmaWNhdGlvbnMuUmVtb3ZlJyx0aGlzLl9saXN0ZW5CbG9ja2x5RXZlbnRzKVxuXG5cbiAgICB9XG5cbiAgICBoaWRlKCkge1xuICAgICAgdGhpcy52aWV3KCkuaGlkZSgpO1xuICAgIH1cblxuICAgIHNob3coKSB7XG4gICAgICB0aGlzLnZpZXcoKS5zaG93KCk7XG4gICAgfVxuXG4gICAgX29uVG9nZ2xlUmVxdWVzdChldnQpIHtcbiAgICAgIGlmIChldnQubmFtZSA9PSAnTW9kZWxpbmdUYWIuVG9nZ2xlUmVxdWVzdCcpIHtcbiAgICAgICAgdGhpcy5fbW9kZWwudG9nZ2xlKCk7XG5cbiAgICAgICAgR2xvYmFscy5nZXQoJ0xvZ2dlcicpLmxvZyh7XG4gICAgICAgICAgdHlwZTogdGhpcy5fbW9kZWwuZ2V0KCdvcGVuJykgPyAnb3BlbicgOiAnY2xvc2UnLFxuICAgICAgICAgIGNhdGVnb3J5OiAnbW9kZWxpbmcnLFxuICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgIGRpc3BsYXlTdGF0ZTogdGhpcy5fbW9kZWwuZ2V0RGlzcGxheVN0YXRlKCksXG4gICAgICAgICAgICB2aXN1YWxpemF0aW9uOiAnJy8vdGhpcy52aWV3KCkuZ2V0Q3VycmVudFZpc3VhbGl6YXRpb24oKVxuICAgICAgICAgIH1cbiAgICAgICAgfSlcbiAgICAgIH0gZWxzZSBpZiAoZXZ0LmRhdGEudGFiVHlwZSA9PSAnYmxvY2tseScpIHtcbiAgICAgICAgICAvLyBvcGVuIHRoZSB0YWJcbiAgICAgICAgICB0aGlzLl9tb2RlbC5zZXQoJ29wZW4nLHRydWUpO1xuXG4gICAgICB9IGVsc2UgaWYgKHRoaXMuX21vZGVsLmdldCgnb3BlbicpKSB7XG4gICAgICAgIC8vIGNsb3NlIHRoZSB0YWJcbiAgICAgICAgdGhpcy5fbW9kZWwudG9nZ2xlKCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgX29uUmVzdWx0VG9nZ2xlUmVxdWVzdChldnQpIHtcbiAgICAgIC8vdGhpcy5fbW9kZWwudG9nZ2xlUmVzdWx0KGV2dC5kYXRhLnJlc3VsdElkKTtcbiAgICAgIEdsb2JhbHMuZ2V0KCdMb2dnZXInKS5sb2coe1xuICAgICAgICB0eXBlOiAncmVzdWx0X3RvZ2dsZScsXG4gICAgICAgIGNhdGVnb3J5OiAnbW9kZWxpbmcnLFxuICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgZGlzcGxheVN0YXRlOiB0aGlzLl9tb2RlbC5nZXREaXNwbGF5U3RhdGUoKSxcbiAgICAgICAgICB2aXN1YWxpemF0aW9uOiAnJy8vdGhpcy52aWV3KCkuZ2V0Q3VycmVudFZpc3VhbGl6YXRpb24oKVxuICAgICAgICB9XG4gICAgICB9KVxuICAgIH1cblxuICAgIF9vbkNsZWFyUmVxdWVzdChldnQpIHtcbiAgICAgIC8vdGhpcy5fbW9kZWwuY2xlYXJSZXN1bHQoZXZ0LmRhdGEucmVzdWx0SWQpO1xuICAgICAgR2xvYmFscy5nZXQoJ0xvZ2dlcicpLmxvZyh7XG4gICAgICAgIHR5cGU6ICdyZW1vdmVfZGF0YScsXG4gICAgICAgIGNhdGVnb3J5OiAnbW9kZWxpbmcnLFxuICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgcmVzdWx0SWQ6IGV2dC5kYXRhLnJlc3VsdElkLFxuICAgICAgICAgIGRpc3BsYXlTdGF0ZTogdGhpcy5fbW9kZWwuZ2V0RGlzcGxheVN0YXRlKCksXG4gICAgICAgICAgdmlzdWFsaXphdGlvbjogJycvL3RoaXMudmlldygpLmdldEN1cnJlbnRWaXN1YWxpemF0aW9uKClcbiAgICAgICAgfVxuICAgICAgfSlcbiAgICB9XG5cbiAgICBfb25DbGVhckFsbFJlcXVlc3QoZXZ0KSB7XG4gICAgICAvL3RoaXMuX21vZGVsLmNsZWFyUmVzdWx0R3JvdXAoZXZ0LmRhdGEuZXhwZXJpbWVudElkKTtcbiAgICAgIEdsb2JhbHMuZ2V0KCdMb2dnZXInKS5sb2coe1xuICAgICAgICB0eXBlOiAncmVtb3ZlX2dyb3VwJyxcbiAgICAgICAgY2F0ZWdvcnk6ICdtb2RlbGluZycsXG4gICAgICAgIGRhdGE6IHtcbiAgICAgICAgICBleHBlcmltZW50SWQ6IGV2dC5kYXRhLmV4cGVyaW1lbnRJZCxcbiAgICAgICAgICBkaXNwbGF5U3RhdGU6IHRoaXMuX21vZGVsLmdldERpc3BsYXlTdGF0ZSgpLFxuICAgICAgICAgIHZpc3VhbGl6YXRpb246ICcnLy90aGlzLnZpZXcoKS5nZXRDdXJyZW50VmlzdWFsaXphdGlvbigpXG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgfVxuXG5cbiAgICBfb25QaGFzZUNoYW5nZShldnQpIHtcbiAgICAgIGlmIChldnQuZGF0YS5waGFzZSA9PSBcImxvZ2luXCIgfHwgZXZ0LmRhdGEucGhhc2UgPT0gXCJsb2dpbl9hdHRlbXB0ZWRcIikge1xuICAgICAgICBpZiAoIUdsb2JhbHMuZ2V0KCdibG9ja2x5TG9hZGVkJykpIHtcblxuICAgICAgICAgIHZhciBibG9ja2x5T3B0aW9ucyA9IHtcbiAgICAgICAgICAgIHRvb2xib3ggOiBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgndG9vbGJveCcpLFxuICAgICAgICAgICAgY29sbGFwc2UgOiB0cnVlLFxuICAgICAgICAgICAgY29tbWVudHMgOiB0cnVlLFxuICAgICAgICAgICAgZGlzYWJsZSA6IHRydWUsXG4gICAgICAgICAgICBtYXhCbG9ja3MgOiBJbmZpbml0eSxcbiAgICAgICAgICAgIHRyYXNoY2FuIDogdHJ1ZSxcbiAgICAgICAgICAgIGhvcml6b250YWxMYXlvdXQgOiB0cnVlLFxuICAgICAgICAgICAgdG9vbGJveFBvc2l0aW9uIDogJ3N0YXJ0JyxcbiAgICAgICAgICAgIGNzcyA6IHRydWUsXG4gICAgICAgICAgICBtZWRpYSA6ICdodHRwczovL2Jsb2NrbHktZGVtby5hcHBzcG90LmNvbS9zdGF0aWMvbWVkaWEvJyxcbiAgICAgICAgICAgIHJ0bCA6IGZhbHNlLFxuICAgICAgICAgICAgc2Nyb2xsYmFycyA6IHRydWUsXG4gICAgICAgICAgICBzb3VuZHMgOiB0cnVlLFxuICAgICAgICAgICAgb25lQmFzZWRJbmRleCA6IHRydWVcbiAgICAgICAgICB9O1xuXG4gICAgICAgICAgdGhpcy53b3Jrc3BhY2UgPSB3aW5kb3cuQmxvY2tseS5pbmplY3QoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ0Jsb2NrbHlEaXYnKSwgYmxvY2tseU9wdGlvbnMpO1xuXG4gICAgICAgICAgdmFyIGRlZmF1bHRXb3Jrc3BhY2VCbG9ja3MgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImRlZmF1bHRXb3Jrc3BhY2VCbG9ja3NcIik7XG4gICAgICAgICAgd2luZG93LkJsb2NrbHkuWG1sLmRvbVRvV29ya3NwYWNlKGRlZmF1bHRXb3Jrc3BhY2VCbG9ja3MsIHRoaXMud29ya3NwYWNlKTtcblxuICAgICAgICAgIHRoaXMud29ya3NwYWNlLmFkZENoYW5nZUxpc3RlbmVyKHRoaXMudG9nZ2xlQmxvY2tseUV2ZW50KTtcbiAgICAgICAgICB0aGlzLmhhc0xpc3RlbmVyID0gdHJ1ZTtcblxuICAgICAgICAgIEdsb2JhbHMuc2V0KCdibG9ja2x5TG9hZGVkJyx0cnVlKTtcblxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgdG9nZ2xlQmxvY2tseUV2ZW50KGV2dCkge1xuICAgICAgaWYgKGV2dC50eXBlICE9ICd1aScpIHtcbiAgICAgICAgR2xvYmFscy5nZXQoJ1JlbGF5JykuZGlzcGF0Y2hFdmVudCgnQmxvY2tseS5DaGFuZ2VkJywge2Jsb2NrbHlFdnQ6IGV2dCwgbW9kZWxUeXBlOiAnYmxvY2tseSd9KTtcbiAgICAgIH1cblxuICAgICAgLy8gQ2hlY2sgd2hldGhlciBhIGJsb2NrIHdpdGggbWF4X3VzZSBvZiAxIGhhcyBiZWVuIGNyZWF0ZWQgcmVzcCBkZWxldGVkLCBhbmQgZGlzYWJsZSByZXNwIGVuYWJsZS5cbiAgICAgIGlmIChldnQudHlwZSA9PSAnY3JlYXRlJykge1xuICAgICAgICB2YXIgbW9kaWZ5X2Jsb2NrID0gdHJ1ZTtcbiAgICAgICAgQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoJChkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZGVmYXVsdFdvcmtzcGFjZUJsb2NrcycpKS5maW5kKCdibG9jaycpKS5tYXAoYmxvY2sgPT4ge1xuICAgICAgICAgIGlmKGJsb2NrLmdldEF0dHJpYnV0ZSgndHlwZScpID09PSB0aGlzLndvcmtzcGFjZS5nZXRCbG9ja0J5SWQoZXZ0LmJsb2NrSWQpLnR5cGUpIG1vZGlmeV9ibG9jayA9IGZhbHNlO1xuICAgICAgICB9KTtcblxuICAgICAgICBpZiAobW9kaWZ5X2Jsb2NrKSB7XG4gICAgICAgICAgdmFyIGJsb2NrX3R5cGUgPSB0aGlzLndvcmtzcGFjZS5nZXRCbG9ja0J5SWQoZXZ0LmJsb2NrSWQpLnR5cGU7XG4gICAgICAgICAgdmFyIGJsb2NrRGl2ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoYmxvY2tfdHlwZSk7XG4gICAgICAgICAgaWYgKGJsb2NrRGl2LmdldEF0dHJpYnV0ZSgnbWF4X3VzZScpID09PSAnMScpIHtcbiAgICAgICAgICAgIGJsb2NrRGl2LnNldEF0dHJpYnV0ZSgnZGlzYWJsZWQnLHRydWUpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICAvLyBUaGVuIGNoZWNrIGlmIGEgYmxvY2sgaGFzIGJlZW4gZGVsZXRlZCB0aGF0IGhhcyBhIG1heF91c2Ugb2YgMS5cbiAgICAgIGlmIChldnQudHlwZSA9PSAnZGVsZXRlJykge1xuICAgICAgICB2YXIgYmxvY2tfdHlwZSA9IGV2dC5vbGRYbWwuZ2V0QXR0cmlidXRlKCd0eXBlJyk7XG4gICAgICAgIHZhciBibG9ja0RpdiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGJsb2NrX3R5cGUpO1xuICAgICAgICBpZiAoYmxvY2tEaXYuZ2V0QXR0cmlidXRlKCdtYXhfdXNlJykgPT09ICcxJykge1xuICAgICAgICAgIGJsb2NrRGl2LnNldEF0dHJpYnV0ZSgnZGlzYWJsZWQnLGZhbHNlKTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICAvL2RvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJ1t0eXBlPWZvcndhcmRfc3BlZWRdJylbMF0uc2V0QXR0cmlidXRlKCdkaXNhYmxlZCcsdHJ1ZSlcbiAgICAgIC8vZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnW3R5cGU9Zm9yd2FyZF9zcGVlZF0nKVswXS5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJ1t0eXBlPWZvcndhcmRfc3BlZWRdJylbMF0pXG5cbiAgICAgIC8vdmFyIHRvb2xib3hlbGVtID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJ0b29sYm94XCIpXG4gICAgICAvL3RoaXMud29ya3NwYWNlLnVwZGF0ZVRvb2xib3godG9vbGJveGVsZW0pXG5cbiAgICAgIC8vIE1hbmlwdWxhdGUgdGhlIHRvb2xib3ggYWNjb3JkaW5nIHRvIHdoaWNoIGVsZW1lbnRzIGhhdmUgbWF4X3VzZSBhbmQgd2hpY2ggb25lcyBub3QuXG5cbiAgICAgIC8vICoqKioqKioqKiBwYXJzZSB0aGUgY29kZSBmb3IgZXJyb3JzICoqKioqKioqKlxuICAgICAgLy8gU2VuZCBhbGVydHNcblxuXG5cblxuXG4gICAgfVxuXG4gICAgX29uQmxvY2tseUxvYWQoZXZ0KSB7XG4gICAgICAvL2xldCB3b3Jrc3BhY2UgPSB3aW5kb3cuQmxvY2tseS5nZXRNYWluV29ya3NwYWNlKCk7XG4gICAgICBpZiAoIXRoaXMud29ya3NwYWNlKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcIkJsb2NrbHkgd29ya3NwYWNlIGRvZXMgbm90IGV4aXN0LlwiKTtcbiAgICAgIH1cbiAgICAgIHRoaXMud29ya3NwYWNlLnJlbW92ZUNoYW5nZUxpc3RlbmVyKHRoaXMudG9nZ2xlQmxvY2tseUV2ZW50KTtcbiAgICAgIHRoaXMuaGFzTGlzdGVuZXIgPSBmYWxzZTtcbiAgICAgIHRoaXMud29ya3NwYWNlLmNsZWFyKCk7XG4gICAgICBpZiAoZXZ0LmRhdGEpIHtcbiAgICAgICAgLy9jb25zdCBibG9ja2x5WG1sID0gd2luZG93LlhtbC50ZXh0VG9Eb20oZXZ0LmRhdGEpXG4gICAgICAgIGNvbnN0IGJsb2NrbHlYbWwgPSAkLnBhcnNlWE1MKGV2dC5kYXRhKS5kb2N1bWVudEVsZW1lbnQ7XG4gICAgICAgIHdpbmRvdy5CbG9ja2x5LlhtbC5kb21Ub1dvcmtzcGFjZShibG9ja2x5WG1sLCB0aGlzLndvcmtzcGFjZSk7Ly8udGhlbigoKSA9PiB7Y29uc29sZS5sb2coJ2hlcmUnKX0pO1xuXG4gICAgICAgIGNvbnN0IHByZXNlbnRCbG9ja3MgPSB0aGlzLndvcmtzcGFjZS5nZXRBbGxCbG9ja3MoKTtcbiAgICAgICAgcHJlc2VudEJsb2Nrcy5tYXAoYmxvY2sgPT4ge1xuICAgICAgICAgIHZhciBibG9ja0RpdiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGJsb2NrLnR5cGUpO1xuICAgICAgICAgIGlmIChibG9ja0Rpdikge1xuICAgICAgICAgICAgaWYgKGJsb2NrRGl2LmdldEF0dHJpYnV0ZSgnbWF4X3VzZScpID09PSAnMScpIHtcbiAgICAgICAgICAgICAgYmxvY2tEaXYuc2V0QXR0cmlidXRlKCdkaXNhYmxlZCcsdHJ1ZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBfbGlzdGVuQmxvY2tseUV2ZW50cyhldnQpIHtcbiAgICAgIGlmICghdGhpcy5oYXNMaXN0ZW5lcikge1xuICAgICAgICB0aGlzLndvcmtzcGFjZS5hZGRDaGFuZ2VMaXN0ZW5lcih0aGlzLnRvZ2dsZUJsb2NrbHlFdmVudCk7XG4gICAgICAgIHRoaXMuaGFzTGlzdGVuZXIgPSB0cnVlO1xuICAgICAgfVxuICAgIH1cblxuICB9XG5cbiAgTW9kZWxpbmdEYXRhVGFiLmNyZWF0ZSA9IChkYXRhID0ge30pID0+IHtcbiAgICByZXR1cm4gbmV3IE1vZGVsaW5nRGF0YVRhYih7IG1vZGVsRGF0YTogZGF0YSB9KVxuICB9XG5cbiAgcmV0dXJuIE1vZGVsaW5nRGF0YVRhYjtcbn0pXG4iXX0=
