'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

define(function (require) {
  var BaseModel = require('core/component/form/field/model'),
      Utils = require('core/util/utils'),
      defaults = {
    options: {},
    disabledOptions: []
  };

  return function (_BaseModel) {
    _inherits(SelectFieldModel, _BaseModel);

    function SelectFieldModel(config) {
      _classCallCheck(this, SelectFieldModel);

      config.defaults = Utils.ensureDefaults(config.defaults, defaults);

      var _this = _possibleConstructorReturn(this, (SelectFieldModel.__proto__ || Object.getPrototypeOf(SelectFieldModel)).call(this, config));

      if (!Utils.exists(_this.get('value'))) {
        _this.set('value', Object.keys(_this.get('options'))[0]);
      }
      return _this;
    }

    _createClass(SelectFieldModel, [{
      key: 'addOption',
      value: function addOption(opt) {
        // note that this overwrites an option label if the value already exists.
        var options = this.get('options');
        options[opt.value] = opt.label;
        this.set('options', options, true);
      }
    }, {
      key: 'removeOption',
      value: function removeOption(id) {
        var options = this.get('options');
        delete options[id];
        this.set('options', options, true);
      }
    }, {
      key: 'clearOptions',
      value: function clearOptions() {
        this.set('options', {}, true);
        this.set('value', null);
      }
    }, {
      key: 'disableOption',
      value: function disableOption(id) {
        var opts = this.get('options');
        var disabled = this.get('disabledOptions');
        if (opts[id] !== undefined && !disabled.includes(id)) {
          disabled.push(id);
          this.set('disabledOptions', disabled);
        }
      }
    }, {
      key: 'enableOption',
      value: function enableOption(id) {
        var opts = this.get('options');
        var disabled = this.get('disabledOptions');
        if (opts[id] !== undefined && disabled.includes(id)) {
          disabled.splice(disabled.indexOf(id), 1);
          this.set('disabledOptions', disabled);
        }
      }
    }, {
      key: 'listAbleOptions',
      value: function listAbleOptions() {
        var opts = Object.keys(this.get('options'));
        var disabled = this.get('disabledOptions');
        var able = [];
        opts.forEach(function (opt) {
          if (!disabled.includes(opt)) able.push(opt);
        });
        return able;
      }
    }]);

    return SelectFieldModel;
  }(BaseModel);
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9jb3JlL2NvbXBvbmVudC9zZWxlY3RmaWVsZC9tb2RlbC5qcyJdLCJuYW1lcyI6WyJkZWZpbmUiLCJyZXF1aXJlIiwiQmFzZU1vZGVsIiwiVXRpbHMiLCJkZWZhdWx0cyIsIm9wdGlvbnMiLCJkaXNhYmxlZE9wdGlvbnMiLCJjb25maWciLCJlbnN1cmVEZWZhdWx0cyIsImV4aXN0cyIsImdldCIsInNldCIsIk9iamVjdCIsImtleXMiLCJvcHQiLCJ2YWx1ZSIsImxhYmVsIiwiaWQiLCJvcHRzIiwiZGlzYWJsZWQiLCJ1bmRlZmluZWQiLCJpbmNsdWRlcyIsInB1c2giLCJzcGxpY2UiLCJpbmRleE9mIiwiYWJsZSIsImZvckVhY2giXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBQUEsT0FBTyxVQUFDQyxPQUFELEVBQWE7QUFDbEIsTUFBTUMsWUFBWUQsUUFBUSxpQ0FBUixDQUFsQjtBQUFBLE1BQ0VFLFFBQVFGLFFBQVEsaUJBQVIsQ0FEVjtBQUFBLE1BRUVHLFdBQVc7QUFDVEMsYUFBUyxFQURBO0FBRVRDLHFCQUFpQjtBQUZSLEdBRmI7O0FBT0E7QUFBQTs7QUFDRSw4QkFBWUMsTUFBWixFQUFvQjtBQUFBOztBQUNsQkEsYUFBT0gsUUFBUCxHQUFrQkQsTUFBTUssY0FBTixDQUFxQkQsT0FBT0gsUUFBNUIsRUFBc0NBLFFBQXRDLENBQWxCOztBQURrQixzSUFFWkcsTUFGWTs7QUFHbEIsVUFBSSxDQUFDSixNQUFNTSxNQUFOLENBQWEsTUFBS0MsR0FBTCxDQUFTLE9BQVQsQ0FBYixDQUFMLEVBQXNDO0FBQ3BDLGNBQUtDLEdBQUwsQ0FBUyxPQUFULEVBQWtCQyxPQUFPQyxJQUFQLENBQVksTUFBS0gsR0FBTCxDQUFTLFNBQVQsQ0FBWixFQUFpQyxDQUFqQyxDQUFsQjtBQUNEO0FBTGlCO0FBTW5COztBQVBIO0FBQUE7QUFBQSxnQ0FTWUksR0FUWixFQVNpQjtBQUNiO0FBQ0EsWUFBTVQsVUFBVSxLQUFLSyxHQUFMLENBQVMsU0FBVCxDQUFoQjtBQUNBTCxnQkFBUVMsSUFBSUMsS0FBWixJQUFxQkQsSUFBSUUsS0FBekI7QUFDQSxhQUFLTCxHQUFMLENBQVMsU0FBVCxFQUFvQk4sT0FBcEIsRUFBNkIsSUFBN0I7QUFDRDtBQWRIO0FBQUE7QUFBQSxtQ0FnQmVZLEVBaEJmLEVBZ0JtQjtBQUNmLFlBQU1aLFVBQVUsS0FBS0ssR0FBTCxDQUFTLFNBQVQsQ0FBaEI7QUFDQSxlQUFPTCxRQUFRWSxFQUFSLENBQVA7QUFDQSxhQUFLTixHQUFMLENBQVMsU0FBVCxFQUFvQk4sT0FBcEIsRUFBNkIsSUFBN0I7QUFDRDtBQXBCSDtBQUFBO0FBQUEscUNBc0JpQjtBQUNiLGFBQUtNLEdBQUwsQ0FBUyxTQUFULEVBQW9CLEVBQXBCLEVBQXdCLElBQXhCO0FBQ0EsYUFBS0EsR0FBTCxDQUFTLE9BQVQsRUFBa0IsSUFBbEI7QUFDRDtBQXpCSDtBQUFBO0FBQUEsb0NBMkJnQk0sRUEzQmhCLEVBMkJvQjtBQUNoQixZQUFNQyxPQUFPLEtBQUtSLEdBQUwsQ0FBUyxTQUFULENBQWI7QUFDQSxZQUFNUyxXQUFXLEtBQUtULEdBQUwsQ0FBUyxpQkFBVCxDQUFqQjtBQUNBLFlBQUlRLEtBQUtELEVBQUwsTUFBYUcsU0FBYixJQUEwQixDQUFDRCxTQUFTRSxRQUFULENBQWtCSixFQUFsQixDQUEvQixFQUFzRDtBQUNwREUsbUJBQVNHLElBQVQsQ0FBY0wsRUFBZDtBQUNBLGVBQUtOLEdBQUwsQ0FBUyxpQkFBVCxFQUE0QlEsUUFBNUI7QUFDRDtBQUNGO0FBbENIO0FBQUE7QUFBQSxtQ0FvQ2VGLEVBcENmLEVBb0NtQjtBQUNmLFlBQU1DLE9BQU8sS0FBS1IsR0FBTCxDQUFTLFNBQVQsQ0FBYjtBQUNBLFlBQU1TLFdBQVcsS0FBS1QsR0FBTCxDQUFTLGlCQUFULENBQWpCO0FBQ0EsWUFBSVEsS0FBS0QsRUFBTCxNQUFhRyxTQUFiLElBQTBCRCxTQUFTRSxRQUFULENBQWtCSixFQUFsQixDQUE5QixFQUFxRDtBQUNuREUsbUJBQVNJLE1BQVQsQ0FBZ0JKLFNBQVNLLE9BQVQsQ0FBaUJQLEVBQWpCLENBQWhCLEVBQXNDLENBQXRDO0FBQ0EsZUFBS04sR0FBTCxDQUFTLGlCQUFULEVBQTRCUSxRQUE1QjtBQUNEO0FBQ0Y7QUEzQ0g7QUFBQTtBQUFBLHdDQTZDb0I7QUFDaEIsWUFBTUQsT0FBT04sT0FBT0MsSUFBUCxDQUFZLEtBQUtILEdBQUwsQ0FBUyxTQUFULENBQVosQ0FBYjtBQUNBLFlBQU1TLFdBQVcsS0FBS1QsR0FBTCxDQUFTLGlCQUFULENBQWpCO0FBQ0EsWUFBTWUsT0FBTyxFQUFiO0FBQ0FQLGFBQUtRLE9BQUwsQ0FBYSxVQUFDWixHQUFELEVBQVM7QUFDcEIsY0FBSSxDQUFDSyxTQUFTRSxRQUFULENBQWtCUCxHQUFsQixDQUFMLEVBQTZCVyxLQUFLSCxJQUFMLENBQVVSLEdBQVY7QUFDOUIsU0FGRDtBQUdBLGVBQU9XLElBQVA7QUFDRDtBQXJESDs7QUFBQTtBQUFBLElBQXNDdkIsU0FBdEM7QUF1REQsQ0EvREQiLCJmaWxlIjoibW9kdWxlL2NvcmUvY29tcG9uZW50L3NlbGVjdGZpZWxkL21vZGVsLmpzIiwic291cmNlc0NvbnRlbnQiOlsiZGVmaW5lKChyZXF1aXJlKSA9PiB7XG4gIGNvbnN0IEJhc2VNb2RlbCA9IHJlcXVpcmUoJ2NvcmUvY29tcG9uZW50L2Zvcm0vZmllbGQvbW9kZWwnKSxcbiAgICBVdGlscyA9IHJlcXVpcmUoJ2NvcmUvdXRpbC91dGlscycpLFxuICAgIGRlZmF1bHRzID0ge1xuICAgICAgb3B0aW9uczoge30sXG4gICAgICBkaXNhYmxlZE9wdGlvbnM6IFtdXG4gICAgfTtcblxuICByZXR1cm4gY2xhc3MgU2VsZWN0RmllbGRNb2RlbCBleHRlbmRzIEJhc2VNb2RlbCB7XG4gICAgY29uc3RydWN0b3IoY29uZmlnKSB7XG4gICAgICBjb25maWcuZGVmYXVsdHMgPSBVdGlscy5lbnN1cmVEZWZhdWx0cyhjb25maWcuZGVmYXVsdHMsIGRlZmF1bHRzKTtcbiAgICAgIHN1cGVyKGNvbmZpZylcbiAgICAgIGlmICghVXRpbHMuZXhpc3RzKHRoaXMuZ2V0KCd2YWx1ZScpKSkge1xuICAgICAgICB0aGlzLnNldCgndmFsdWUnLCBPYmplY3Qua2V5cyh0aGlzLmdldCgnb3B0aW9ucycpKVswXSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgYWRkT3B0aW9uKG9wdCkge1xuICAgICAgLy8gbm90ZSB0aGF0IHRoaXMgb3ZlcndyaXRlcyBhbiBvcHRpb24gbGFiZWwgaWYgdGhlIHZhbHVlIGFscmVhZHkgZXhpc3RzLlxuICAgICAgY29uc3Qgb3B0aW9ucyA9IHRoaXMuZ2V0KCdvcHRpb25zJyk7XG4gICAgICBvcHRpb25zW29wdC52YWx1ZV0gPSBvcHQubGFiZWw7XG4gICAgICB0aGlzLnNldCgnb3B0aW9ucycsIG9wdGlvbnMsIHRydWUpO1xuICAgIH1cblxuICAgIHJlbW92ZU9wdGlvbihpZCkge1xuICAgICAgY29uc3Qgb3B0aW9ucyA9IHRoaXMuZ2V0KCdvcHRpb25zJyk7XG4gICAgICBkZWxldGUgb3B0aW9uc1tpZF07XG4gICAgICB0aGlzLnNldCgnb3B0aW9ucycsIG9wdGlvbnMsIHRydWUpO1xuICAgIH1cblxuICAgIGNsZWFyT3B0aW9ucygpIHtcbiAgICAgIHRoaXMuc2V0KCdvcHRpb25zJywge30sIHRydWUpO1xuICAgICAgdGhpcy5zZXQoJ3ZhbHVlJywgbnVsbCk7XG4gICAgfVxuXG4gICAgZGlzYWJsZU9wdGlvbihpZCkge1xuICAgICAgY29uc3Qgb3B0cyA9IHRoaXMuZ2V0KCdvcHRpb25zJylcbiAgICAgIGNvbnN0IGRpc2FibGVkID0gdGhpcy5nZXQoJ2Rpc2FibGVkT3B0aW9ucycpXG4gICAgICBpZiAob3B0c1tpZF0gIT09IHVuZGVmaW5lZCAmJiAhZGlzYWJsZWQuaW5jbHVkZXMoaWQpKSB7XG4gICAgICAgIGRpc2FibGVkLnB1c2goaWQpO1xuICAgICAgICB0aGlzLnNldCgnZGlzYWJsZWRPcHRpb25zJywgZGlzYWJsZWQpO1xuICAgICAgfVxuICAgIH1cblxuICAgIGVuYWJsZU9wdGlvbihpZCkge1xuICAgICAgY29uc3Qgb3B0cyA9IHRoaXMuZ2V0KCdvcHRpb25zJylcbiAgICAgIGNvbnN0IGRpc2FibGVkID0gdGhpcy5nZXQoJ2Rpc2FibGVkT3B0aW9ucycpXG4gICAgICBpZiAob3B0c1tpZF0gIT09IHVuZGVmaW5lZCAmJiBkaXNhYmxlZC5pbmNsdWRlcyhpZCkpIHtcbiAgICAgICAgZGlzYWJsZWQuc3BsaWNlKGRpc2FibGVkLmluZGV4T2YoaWQpLCAxKTtcbiAgICAgICAgdGhpcy5zZXQoJ2Rpc2FibGVkT3B0aW9ucycsIGRpc2FibGVkKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBsaXN0QWJsZU9wdGlvbnMoKSB7XG4gICAgICBjb25zdCBvcHRzID0gT2JqZWN0LmtleXModGhpcy5nZXQoJ29wdGlvbnMnKSk7XG4gICAgICBjb25zdCBkaXNhYmxlZCA9IHRoaXMuZ2V0KCdkaXNhYmxlZE9wdGlvbnMnKVxuICAgICAgY29uc3QgYWJsZSA9IFtdXG4gICAgICBvcHRzLmZvckVhY2goKG9wdCkgPT4ge1xuICAgICAgICBpZiAoIWRpc2FibGVkLmluY2x1ZGVzKG9wdCkpIGFibGUucHVzaChvcHQpXG4gICAgICB9KVxuICAgICAgcmV0dXJuIGFibGU7XG4gICAgfVxuICB9XG59KTtcbiJdfQ==
