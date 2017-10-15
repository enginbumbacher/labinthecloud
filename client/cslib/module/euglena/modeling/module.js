'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

define(function (require) {
  var Utils = require('core/util/utils'),
      Globals = require('core/model/globals'),
      HM = require('core/event/hook_manager');

  var Module = require('core/app/module'),
      ModelingDataTab = require('./tab/tab');

  var ModelingDataModule = function (_Module) {
    _inherits(ModelingDataModule, _Module);

    function ModelingDataModule() {
      _classCallCheck(this, ModelingDataModule);

      var _this = _possibleConstructorReturn(this, (ModelingDataModule.__proto__ || Object.getPrototypeOf(ModelingDataModule)).call(this));

      if (Globals.get('AppConfig.modeling')) {
        Utils.bindMethods(_this, ['_onPhaseChange', '_onExperimentCountChange']);
        _this.tab = new ModelingDataTab();
        Globals.get('Relay').addEventListener('AppPhase.Change', _this._onPhaseChange);
        Globals.get('Relay').addEventListener('ExperimentCount.Change', _this._onExperimentCountChange);
      }
      return _this;
    }

    _createClass(ModelingDataModule, [{
      key: 'run',
      value: function run() {
        if (this.tab) Globals.get('Layout').getPanel('result').addContent(this.tab.view());
      }
    }, {
      key: '_onPhaseChange',
      value: function _onPhaseChange(evt) {
        if (evt.data.phase == "login" || evt.data.phase == "login_attempted") {
          this.tab.hide();
        }
      }
    }, {
      key: '_onExperimentCountChange',
      value: function _onExperimentCountChange(evt) {
        if (evt.data.count && !evt.data.old) {
          this.tab.show();
        } else if (!evt.data.count) {
          this.tab.hide();
        }
      }
    }]);

    return ModelingDataModule;
  }(Module);

  return ModelingDataModule;
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9ldWdsZW5hL21vZGVsaW5nL21vZHVsZS5qcyJdLCJuYW1lcyI6WyJkZWZpbmUiLCJyZXF1aXJlIiwiVXRpbHMiLCJHbG9iYWxzIiwiSE0iLCJNb2R1bGUiLCJNb2RlbGluZ0RhdGFUYWIiLCJNb2RlbGluZ0RhdGFNb2R1bGUiLCJnZXQiLCJiaW5kTWV0aG9kcyIsInRhYiIsImFkZEV2ZW50TGlzdGVuZXIiLCJfb25QaGFzZUNoYW5nZSIsIl9vbkV4cGVyaW1lbnRDb3VudENoYW5nZSIsImdldFBhbmVsIiwiYWRkQ29udGVudCIsInZpZXciLCJldnQiLCJkYXRhIiwicGhhc2UiLCJoaWRlIiwiY291bnQiLCJvbGQiLCJzaG93Il0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQUFBLE9BQU8sVUFBQ0MsT0FBRCxFQUFhO0FBQ2xCLE1BQU1DLFFBQVFELFFBQVEsaUJBQVIsQ0FBZDtBQUFBLE1BQ0VFLFVBQVVGLFFBQVEsb0JBQVIsQ0FEWjtBQUFBLE1BRUVHLEtBQUtILFFBQVEseUJBQVIsQ0FGUDs7QUFJQSxNQUFNSSxTQUFTSixRQUFRLGlCQUFSLENBQWY7QUFBQSxNQUNFSyxrQkFBa0JMLFFBQVEsV0FBUixDQURwQjs7QUFMa0IsTUFRWk0sa0JBUlk7QUFBQTs7QUFTaEIsa0NBQWM7QUFBQTs7QUFBQTs7QUFFWixVQUFJSixRQUFRSyxHQUFSLENBQVksb0JBQVosQ0FBSixFQUF1QztBQUNyQ04sY0FBTU8sV0FBTixRQUF3QixDQUFDLGdCQUFELEVBQW1CLDBCQUFuQixDQUF4QjtBQUNBLGNBQUtDLEdBQUwsR0FBVyxJQUFJSixlQUFKLEVBQVg7QUFDQUgsZ0JBQVFLLEdBQVIsQ0FBWSxPQUFaLEVBQXFCRyxnQkFBckIsQ0FBc0MsaUJBQXRDLEVBQXlELE1BQUtDLGNBQTlEO0FBQ0FULGdCQUFRSyxHQUFSLENBQVksT0FBWixFQUFxQkcsZ0JBQXJCLENBQXNDLHdCQUF0QyxFQUFnRSxNQUFLRSx3QkFBckU7QUFDRDtBQVBXO0FBUWI7O0FBakJlO0FBQUE7QUFBQSw0QkFtQlY7QUFDSixZQUFJLEtBQUtILEdBQVQsRUFBY1AsUUFBUUssR0FBUixDQUFZLFFBQVosRUFBc0JNLFFBQXRCLENBQStCLFFBQS9CLEVBQXlDQyxVQUF6QyxDQUFvRCxLQUFLTCxHQUFMLENBQVNNLElBQVQsRUFBcEQ7QUFDZjtBQXJCZTtBQUFBO0FBQUEscUNBdUJEQyxHQXZCQyxFQXVCSTtBQUNsQixZQUFJQSxJQUFJQyxJQUFKLENBQVNDLEtBQVQsSUFBa0IsT0FBbEIsSUFBNkJGLElBQUlDLElBQUosQ0FBU0MsS0FBVCxJQUFrQixpQkFBbkQsRUFBc0U7QUFDcEUsZUFBS1QsR0FBTCxDQUFTVSxJQUFUO0FBQ0Q7QUFDRjtBQTNCZTtBQUFBO0FBQUEsK0NBNkJTSCxHQTdCVCxFQTZCYztBQUM1QixZQUFJQSxJQUFJQyxJQUFKLENBQVNHLEtBQVQsSUFBa0IsQ0FBQ0osSUFBSUMsSUFBSixDQUFTSSxHQUFoQyxFQUFxQztBQUNuQyxlQUFLWixHQUFMLENBQVNhLElBQVQ7QUFDRCxTQUZELE1BRU8sSUFBSSxDQUFDTixJQUFJQyxJQUFKLENBQVNHLEtBQWQsRUFBcUI7QUFDMUIsZUFBS1gsR0FBTCxDQUFTVSxJQUFUO0FBQ0Q7QUFDRjtBQW5DZTs7QUFBQTtBQUFBLElBUWVmLE1BUmY7O0FBc0NsQixTQUFPRSxrQkFBUDtBQUNELENBdkNEIiwiZmlsZSI6Im1vZHVsZS9ldWdsZW5hL21vZGVsaW5nL21vZHVsZS5qcyIsInNvdXJjZXNDb250ZW50IjpbImRlZmluZSgocmVxdWlyZSkgPT4ge1xuICBjb25zdCBVdGlscyA9IHJlcXVpcmUoJ2NvcmUvdXRpbC91dGlscycpLFxuICAgIEdsb2JhbHMgPSByZXF1aXJlKCdjb3JlL21vZGVsL2dsb2JhbHMnKSxcbiAgICBITSA9IHJlcXVpcmUoJ2NvcmUvZXZlbnQvaG9va19tYW5hZ2VyJyk7XG5cbiAgY29uc3QgTW9kdWxlID0gcmVxdWlyZSgnY29yZS9hcHAvbW9kdWxlJyksXG4gICAgTW9kZWxpbmdEYXRhVGFiID0gcmVxdWlyZSgnLi90YWIvdGFiJyk7XG5cbiAgY2xhc3MgTW9kZWxpbmdEYXRhTW9kdWxlIGV4dGVuZHMgTW9kdWxlIHtcbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgIHN1cGVyKCk7XG4gICAgICBpZiAoR2xvYmFscy5nZXQoJ0FwcENvbmZpZy5tb2RlbGluZycpKSB7XG4gICAgICAgIFV0aWxzLmJpbmRNZXRob2RzKHRoaXMsIFsnX29uUGhhc2VDaGFuZ2UnLCAnX29uRXhwZXJpbWVudENvdW50Q2hhbmdlJ10pXG4gICAgICAgIHRoaXMudGFiID0gbmV3IE1vZGVsaW5nRGF0YVRhYigpO1xuICAgICAgICBHbG9iYWxzLmdldCgnUmVsYXknKS5hZGRFdmVudExpc3RlbmVyKCdBcHBQaGFzZS5DaGFuZ2UnLCB0aGlzLl9vblBoYXNlQ2hhbmdlKVxuICAgICAgICBHbG9iYWxzLmdldCgnUmVsYXknKS5hZGRFdmVudExpc3RlbmVyKCdFeHBlcmltZW50Q291bnQuQ2hhbmdlJywgdGhpcy5fb25FeHBlcmltZW50Q291bnRDaGFuZ2UpXG4gICAgICB9XG4gICAgfVxuXG4gICAgcnVuKCkge1xuICAgICAgaWYgKHRoaXMudGFiKSBHbG9iYWxzLmdldCgnTGF5b3V0JykuZ2V0UGFuZWwoJ3Jlc3VsdCcpLmFkZENvbnRlbnQodGhpcy50YWIudmlldygpKVxuICAgIH1cblxuICAgIF9vblBoYXNlQ2hhbmdlKGV2dCkge1xuICAgICAgaWYgKGV2dC5kYXRhLnBoYXNlID09IFwibG9naW5cIiB8fCBldnQuZGF0YS5waGFzZSA9PSBcImxvZ2luX2F0dGVtcHRlZFwiKSB7XG4gICAgICAgIHRoaXMudGFiLmhpZGUoKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBfb25FeHBlcmltZW50Q291bnRDaGFuZ2UoZXZ0KSB7XG4gICAgICBpZiAoZXZ0LmRhdGEuY291bnQgJiYgIWV2dC5kYXRhLm9sZCkge1xuICAgICAgICB0aGlzLnRhYi5zaG93KCk7XG4gICAgICB9IGVsc2UgaWYgKCFldnQuZGF0YS5jb3VudCkge1xuICAgICAgICB0aGlzLnRhYi5oaWRlKCk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIE1vZGVsaW5nRGF0YU1vZHVsZTtcbn0pXG4iXX0=
