'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

define(function (require) {
  var Globals = require('core/model/globals'),
      Utils = require('core/util/utils'),
      HM = require('core/event/hook_manager');

  var Field = require('core/component/form/field/field'),
      Model = require('./model'),
      View = require('./view');

  var SliderField = function (_Field) {
    _inherits(SliderField, _Field);

    function SliderField() {
      var settings = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      _classCallCheck(this, SliderField);

      settings.modelClass = settings.modelClass || Model;
      settings.viewClass = settings.viewClass || View;

      var _this = _possibleConstructorReturn(this, (SliderField.__proto__ || Object.getPrototypeOf(SliderField)).call(this, settings));

      Utils.bindMethods(_this, ['_onUnitChangeRequest', '_onChangeRequest', '_onStopDrag']);

      _this.view().addEventListener('SliderField.UnitChangeRequest', _this._onUnitChangeRequest);
      _this.view().addEventListener('SliderField.ChangeRequest', _this._onChangeRequest);
      _this.view().addEventListener('SliderField.StopDrag', _this._onStopDrag);
      return _this;
    }

    _createClass(SliderField, [{
      key: '_onUnitChangeRequest',
      value: function _onUnitChangeRequest(evt) {
        if (!this._model.get('disabled')) {
          var oldVal = this._model.value();
          this._model.setUnitValue(evt.data.value);
          this.dispatchEvent('Field.Change', {
            oldValue: oldVal,
            value: this._model.value()
          });
        }
      }
    }, {
      key: '_onChangeRequest',
      value: function _onChangeRequest(evt) {
        if (!this._model.get('disabled')) {
          var oldVal = this._model.value();
          this._model.setValue(evt.data.value);
          this.dispatchEvent('Field.Change', {
            oldValue: oldVal,
            value: this._model.value()
          });
        }
      }
    }, {
      key: '_onStopDrag',
      value: function _onStopDrag(evt) {
        this.dispatchEvent('Field.StopDrag');
      }
    }, {
      key: 'setValue',
      value: function setValue(val) {
        var oldVal = this._model.value();
        this._model.setValue(val);
        this.dispatchEvent('Field.Change', {
          oldValue: oldVal,
          value: this._model.value()
        });
      }
    }]);

    return SliderField;
  }(Field);

  SliderField.create = function (data) {
    return new SliderField({ modelData: data });
  };

  return SliderField;
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9jb3JlL2NvbXBvbmVudC9zbGlkZXJmaWVsZC9maWVsZC5qcyJdLCJuYW1lcyI6WyJkZWZpbmUiLCJyZXF1aXJlIiwiR2xvYmFscyIsIlV0aWxzIiwiSE0iLCJGaWVsZCIsIk1vZGVsIiwiVmlldyIsIlNsaWRlckZpZWxkIiwic2V0dGluZ3MiLCJtb2RlbENsYXNzIiwidmlld0NsYXNzIiwiYmluZE1ldGhvZHMiLCJ2aWV3IiwiYWRkRXZlbnRMaXN0ZW5lciIsIl9vblVuaXRDaGFuZ2VSZXF1ZXN0IiwiX29uQ2hhbmdlUmVxdWVzdCIsIl9vblN0b3BEcmFnIiwiZXZ0IiwiX21vZGVsIiwiZ2V0Iiwib2xkVmFsIiwidmFsdWUiLCJzZXRVbml0VmFsdWUiLCJkYXRhIiwiZGlzcGF0Y2hFdmVudCIsIm9sZFZhbHVlIiwic2V0VmFsdWUiLCJ2YWwiLCJjcmVhdGUiLCJtb2RlbERhdGEiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBQUEsT0FBTyxVQUFDQyxPQUFELEVBQWE7QUFDbEIsTUFBTUMsVUFBVUQsUUFBUSxvQkFBUixDQUFoQjtBQUFBLE1BQ0VFLFFBQVFGLFFBQVEsaUJBQVIsQ0FEVjtBQUFBLE1BRUVHLEtBQUtILFFBQVEseUJBQVIsQ0FGUDs7QUFJQSxNQUFNSSxRQUFRSixRQUFRLGlDQUFSLENBQWQ7QUFBQSxNQUNFSyxRQUFRTCxRQUFRLFNBQVIsQ0FEVjtBQUFBLE1BRUVNLE9BQU9OLFFBQVEsUUFBUixDQUZUOztBQUxrQixNQVNaTyxXQVRZO0FBQUE7O0FBVWhCLDJCQUEyQjtBQUFBLFVBQWZDLFFBQWUsdUVBQUosRUFBSTs7QUFBQTs7QUFDekJBLGVBQVNDLFVBQVQsR0FBc0JELFNBQVNDLFVBQVQsSUFBdUJKLEtBQTdDO0FBQ0FHLGVBQVNFLFNBQVQsR0FBcUJGLFNBQVNFLFNBQVQsSUFBc0JKLElBQTNDOztBQUZ5Qiw0SEFHbkJFLFFBSG1COztBQUl6Qk4sWUFBTVMsV0FBTixRQUF3QixDQUFDLHNCQUFELEVBQXlCLGtCQUF6QixFQUE0QyxhQUE1QyxDQUF4Qjs7QUFFQSxZQUFLQyxJQUFMLEdBQVlDLGdCQUFaLENBQTZCLCtCQUE3QixFQUE4RCxNQUFLQyxvQkFBbkU7QUFDQSxZQUFLRixJQUFMLEdBQVlDLGdCQUFaLENBQTZCLDJCQUE3QixFQUEwRCxNQUFLRSxnQkFBL0Q7QUFDQSxZQUFLSCxJQUFMLEdBQVlDLGdCQUFaLENBQTZCLHNCQUE3QixFQUFxRCxNQUFLRyxXQUExRDtBQVJ5QjtBQVMxQjs7QUFuQmU7QUFBQTtBQUFBLDJDQXFCS0MsR0FyQkwsRUFxQlU7QUFDeEIsWUFBSSxDQUFDLEtBQUtDLE1BQUwsQ0FBWUMsR0FBWixDQUFnQixVQUFoQixDQUFMLEVBQWtDO0FBQ2hDLGNBQUlDLFNBQVMsS0FBS0YsTUFBTCxDQUFZRyxLQUFaLEVBQWI7QUFDQSxlQUFLSCxNQUFMLENBQVlJLFlBQVosQ0FBeUJMLElBQUlNLElBQUosQ0FBU0YsS0FBbEM7QUFDQSxlQUFLRyxhQUFMLENBQW1CLGNBQW5CLEVBQW1DO0FBQ2pDQyxzQkFBVUwsTUFEdUI7QUFFakNDLG1CQUFPLEtBQUtILE1BQUwsQ0FBWUcsS0FBWjtBQUYwQixXQUFuQztBQUlEO0FBQ0Y7QUE5QmU7QUFBQTtBQUFBLHVDQWdDQ0osR0FoQ0QsRUFnQ007QUFDcEIsWUFBSSxDQUFDLEtBQUtDLE1BQUwsQ0FBWUMsR0FBWixDQUFnQixVQUFoQixDQUFMLEVBQWtDO0FBQ2hDLGNBQUlDLFNBQVMsS0FBS0YsTUFBTCxDQUFZRyxLQUFaLEVBQWI7QUFDQSxlQUFLSCxNQUFMLENBQVlRLFFBQVosQ0FBcUJULElBQUlNLElBQUosQ0FBU0YsS0FBOUI7QUFDQSxlQUFLRyxhQUFMLENBQW1CLGNBQW5CLEVBQW1DO0FBQ2pDQyxzQkFBVUwsTUFEdUI7QUFFakNDLG1CQUFPLEtBQUtILE1BQUwsQ0FBWUcsS0FBWjtBQUYwQixXQUFuQztBQUlEO0FBQ0Y7QUF6Q2U7QUFBQTtBQUFBLGtDQTJDSkosR0EzQ0ksRUEyQ0M7QUFDZixhQUFLTyxhQUFMLENBQW1CLGdCQUFuQjtBQUNEO0FBN0NlO0FBQUE7QUFBQSwrQkErQ1BHLEdBL0NPLEVBK0NGO0FBQ1osWUFBSVAsU0FBUyxLQUFLRixNQUFMLENBQVlHLEtBQVosRUFBYjtBQUNBLGFBQUtILE1BQUwsQ0FBWVEsUUFBWixDQUFxQkMsR0FBckI7QUFDQSxhQUFLSCxhQUFMLENBQW1CLGNBQW5CLEVBQW1DO0FBQ2pDQyxvQkFBVUwsTUFEdUI7QUFFakNDLGlCQUFPLEtBQUtILE1BQUwsQ0FBWUcsS0FBWjtBQUYwQixTQUFuQztBQUlEO0FBdERlOztBQUFBO0FBQUEsSUFTUWpCLEtBVFI7O0FBeURsQkcsY0FBWXFCLE1BQVosR0FBcUIsVUFBQ0wsSUFBRCxFQUFVO0FBQzdCLFdBQU8sSUFBSWhCLFdBQUosQ0FBZ0IsRUFBRXNCLFdBQVdOLElBQWIsRUFBaEIsQ0FBUDtBQUNELEdBRkQ7O0FBSUEsU0FBT2hCLFdBQVA7QUFDRCxDQTlERCIsImZpbGUiOiJtb2R1bGUvY29yZS9jb21wb25lbnQvc2xpZGVyZmllbGQvZmllbGQuanMiLCJzb3VyY2VzQ29udGVudCI6WyJkZWZpbmUoKHJlcXVpcmUpID0+IHtcbiAgY29uc3QgR2xvYmFscyA9IHJlcXVpcmUoJ2NvcmUvbW9kZWwvZ2xvYmFscycpLFxuICAgIFV0aWxzID0gcmVxdWlyZSgnY29yZS91dGlsL3V0aWxzJyksXG4gICAgSE0gPSByZXF1aXJlKCdjb3JlL2V2ZW50L2hvb2tfbWFuYWdlcicpO1xuXG4gIGNvbnN0IEZpZWxkID0gcmVxdWlyZSgnY29yZS9jb21wb25lbnQvZm9ybS9maWVsZC9maWVsZCcpLFxuICAgIE1vZGVsID0gcmVxdWlyZSgnLi9tb2RlbCcpLFxuICAgIFZpZXcgPSByZXF1aXJlKCcuL3ZpZXcnKTtcblxuICBjbGFzcyBTbGlkZXJGaWVsZCBleHRlbmRzIEZpZWxkIHtcbiAgICBjb25zdHJ1Y3RvcihzZXR0aW5ncyA9IHt9KSB7XG4gICAgICBzZXR0aW5ncy5tb2RlbENsYXNzID0gc2V0dGluZ3MubW9kZWxDbGFzcyB8fCBNb2RlbDtcbiAgICAgIHNldHRpbmdzLnZpZXdDbGFzcyA9IHNldHRpbmdzLnZpZXdDbGFzcyB8fCBWaWV3O1xuICAgICAgc3VwZXIoc2V0dGluZ3MpO1xuICAgICAgVXRpbHMuYmluZE1ldGhvZHModGhpcywgWydfb25Vbml0Q2hhbmdlUmVxdWVzdCcsICdfb25DaGFuZ2VSZXF1ZXN0JywnX29uU3RvcERyYWcnXSlcblxuICAgICAgdGhpcy52aWV3KCkuYWRkRXZlbnRMaXN0ZW5lcignU2xpZGVyRmllbGQuVW5pdENoYW5nZVJlcXVlc3QnLCB0aGlzLl9vblVuaXRDaGFuZ2VSZXF1ZXN0KVxuICAgICAgdGhpcy52aWV3KCkuYWRkRXZlbnRMaXN0ZW5lcignU2xpZGVyRmllbGQuQ2hhbmdlUmVxdWVzdCcsIHRoaXMuX29uQ2hhbmdlUmVxdWVzdClcbiAgICAgIHRoaXMudmlldygpLmFkZEV2ZW50TGlzdGVuZXIoJ1NsaWRlckZpZWxkLlN0b3BEcmFnJywgdGhpcy5fb25TdG9wRHJhZylcbiAgICB9XG5cbiAgICBfb25Vbml0Q2hhbmdlUmVxdWVzdChldnQpIHtcbiAgICAgIGlmICghdGhpcy5fbW9kZWwuZ2V0KCdkaXNhYmxlZCcpKSB7XG4gICAgICAgIGxldCBvbGRWYWwgPSB0aGlzLl9tb2RlbC52YWx1ZSgpO1xuICAgICAgICB0aGlzLl9tb2RlbC5zZXRVbml0VmFsdWUoZXZ0LmRhdGEudmFsdWUpO1xuICAgICAgICB0aGlzLmRpc3BhdGNoRXZlbnQoJ0ZpZWxkLkNoYW5nZScsIHtcbiAgICAgICAgICBvbGRWYWx1ZTogb2xkVmFsLFxuICAgICAgICAgIHZhbHVlOiB0aGlzLl9tb2RlbC52YWx1ZSgpXG4gICAgICAgIH0pXG4gICAgICB9XG4gICAgfVxuXG4gICAgX29uQ2hhbmdlUmVxdWVzdChldnQpIHtcbiAgICAgIGlmICghdGhpcy5fbW9kZWwuZ2V0KCdkaXNhYmxlZCcpKSB7XG4gICAgICAgIGxldCBvbGRWYWwgPSB0aGlzLl9tb2RlbC52YWx1ZSgpO1xuICAgICAgICB0aGlzLl9tb2RlbC5zZXRWYWx1ZShldnQuZGF0YS52YWx1ZSk7XG4gICAgICAgIHRoaXMuZGlzcGF0Y2hFdmVudCgnRmllbGQuQ2hhbmdlJywge1xuICAgICAgICAgIG9sZFZhbHVlOiBvbGRWYWwsXG4gICAgICAgICAgdmFsdWU6IHRoaXMuX21vZGVsLnZhbHVlKClcbiAgICAgICAgfSlcbiAgICAgIH1cbiAgICB9XG5cbiAgICBfb25TdG9wRHJhZyhldnQpIHtcbiAgICAgIHRoaXMuZGlzcGF0Y2hFdmVudCgnRmllbGQuU3RvcERyYWcnKVxuICAgIH1cblxuICAgIHNldFZhbHVlKHZhbCkge1xuICAgICAgbGV0IG9sZFZhbCA9IHRoaXMuX21vZGVsLnZhbHVlKCk7XG4gICAgICB0aGlzLl9tb2RlbC5zZXRWYWx1ZSh2YWwpO1xuICAgICAgdGhpcy5kaXNwYXRjaEV2ZW50KCdGaWVsZC5DaGFuZ2UnLCB7XG4gICAgICAgIG9sZFZhbHVlOiBvbGRWYWwsXG4gICAgICAgIHZhbHVlOiB0aGlzLl9tb2RlbC52YWx1ZSgpXG4gICAgICB9KVxuICAgIH1cbiAgfVxuXG4gIFNsaWRlckZpZWxkLmNyZWF0ZSA9IChkYXRhKSA9PiB7XG4gICAgcmV0dXJuIG5ldyBTbGlkZXJGaWVsZCh7IG1vZGVsRGF0YTogZGF0YSB9KVxuICB9XG5cbiAgcmV0dXJuIFNsaWRlckZpZWxkO1xufSlcbiJdfQ==
