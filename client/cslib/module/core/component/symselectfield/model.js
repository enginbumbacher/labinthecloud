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
    _inherits(SymSelectFieldModel, _BaseModel);

    function SymSelectFieldModel(config) {
      _classCallCheck(this, SymSelectFieldModel);

      config.defaults = Utils.ensureDefaults(config.defaults, defaults);

      var _this = _possibleConstructorReturn(this, (SymSelectFieldModel.__proto__ || Object.getPrototypeOf(SymSelectFieldModel)).call(this, config));

      if (!Utils.exists(_this.get('value'))) {
        _this.set('value', Object.keys(_this.get('options'))[0]);
      }
      return _this;
    }

    _createClass(SymSelectFieldModel, [{
      key: 'updateValue',
      value: function updateValue(field, value) {
        var tmpval = this.get('value');
        tmpval[field] = value;
        this.set('value', tmpval);
      }
    }, {
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

    return SymSelectFieldModel;
  }(BaseModel);
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9jb3JlL2NvbXBvbmVudC9zeW1zZWxlY3RmaWVsZC9tb2RlbC5qcyJdLCJuYW1lcyI6WyJkZWZpbmUiLCJyZXF1aXJlIiwiQmFzZU1vZGVsIiwiVXRpbHMiLCJkZWZhdWx0cyIsIm9wdGlvbnMiLCJkaXNhYmxlZE9wdGlvbnMiLCJjb25maWciLCJlbnN1cmVEZWZhdWx0cyIsImV4aXN0cyIsImdldCIsInNldCIsIk9iamVjdCIsImtleXMiLCJmaWVsZCIsInZhbHVlIiwidG1wdmFsIiwib3B0IiwibGFiZWwiLCJpZCIsIm9wdHMiLCJkaXNhYmxlZCIsInVuZGVmaW5lZCIsImluY2x1ZGVzIiwicHVzaCIsInNwbGljZSIsImluZGV4T2YiLCJhYmxlIiwiZm9yRWFjaCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBQSxPQUFPLFVBQUNDLE9BQUQsRUFBYTtBQUNsQixNQUFNQyxZQUFZRCxRQUFRLGlDQUFSLENBQWxCO0FBQUEsTUFDRUUsUUFBUUYsUUFBUSxpQkFBUixDQURWO0FBQUEsTUFFRUcsV0FBVztBQUNUQyxhQUFTLEVBREE7QUFFVEMscUJBQWlCO0FBRlIsR0FGYjs7QUFPQTtBQUFBOztBQUNFLGlDQUFZQyxNQUFaLEVBQW9CO0FBQUE7O0FBQ2xCQSxhQUFPSCxRQUFQLEdBQWtCRCxNQUFNSyxjQUFOLENBQXFCRCxPQUFPSCxRQUE1QixFQUFzQ0EsUUFBdEMsQ0FBbEI7O0FBRGtCLDRJQUVaRyxNQUZZOztBQUdsQixVQUFJLENBQUNKLE1BQU1NLE1BQU4sQ0FBYSxNQUFLQyxHQUFMLENBQVMsT0FBVCxDQUFiLENBQUwsRUFBc0M7QUFDcEMsY0FBS0MsR0FBTCxDQUFTLE9BQVQsRUFBa0JDLE9BQU9DLElBQVAsQ0FBWSxNQUFLSCxHQUFMLENBQVMsU0FBVCxDQUFaLEVBQWlDLENBQWpDLENBQWxCO0FBQ0Q7QUFMaUI7QUFNbkI7O0FBUEg7QUFBQTtBQUFBLGtDQVNjSSxLQVRkLEVBU29CQyxLQVRwQixFQVMyQjtBQUN2QixZQUFJQyxTQUFTLEtBQUtOLEdBQUwsQ0FBUyxPQUFULENBQWI7QUFDQU0sZUFBT0YsS0FBUCxJQUFnQkMsS0FBaEI7QUFDQSxhQUFLSixHQUFMLENBQVMsT0FBVCxFQUFrQkssTUFBbEI7QUFDRDtBQWJIO0FBQUE7QUFBQSxnQ0FlWUMsR0FmWixFQWVpQjtBQUNiO0FBQ0EsWUFBTVosVUFBVSxLQUFLSyxHQUFMLENBQVMsU0FBVCxDQUFoQjtBQUNBTCxnQkFBUVksSUFBSUYsS0FBWixJQUFxQkUsSUFBSUMsS0FBekI7QUFDQSxhQUFLUCxHQUFMLENBQVMsU0FBVCxFQUFvQk4sT0FBcEIsRUFBNkIsSUFBN0I7QUFDRDtBQXBCSDtBQUFBO0FBQUEsbUNBc0JlYyxFQXRCZixFQXNCbUI7QUFDZixZQUFNZCxVQUFVLEtBQUtLLEdBQUwsQ0FBUyxTQUFULENBQWhCO0FBQ0EsZUFBT0wsUUFBUWMsRUFBUixDQUFQO0FBQ0EsYUFBS1IsR0FBTCxDQUFTLFNBQVQsRUFBb0JOLE9BQXBCLEVBQTZCLElBQTdCO0FBQ0Q7QUExQkg7QUFBQTtBQUFBLHFDQTRCaUI7QUFDYixhQUFLTSxHQUFMLENBQVMsU0FBVCxFQUFvQixFQUFwQixFQUF3QixJQUF4QjtBQUNBLGFBQUtBLEdBQUwsQ0FBUyxPQUFULEVBQWtCLElBQWxCO0FBQ0Q7QUEvQkg7QUFBQTtBQUFBLG9DQWlDZ0JRLEVBakNoQixFQWlDb0I7QUFDaEIsWUFBTUMsT0FBTyxLQUFLVixHQUFMLENBQVMsU0FBVCxDQUFiO0FBQ0EsWUFBTVcsV0FBVyxLQUFLWCxHQUFMLENBQVMsaUJBQVQsQ0FBakI7QUFDQSxZQUFJVSxLQUFLRCxFQUFMLE1BQWFHLFNBQWIsSUFBMEIsQ0FBQ0QsU0FBU0UsUUFBVCxDQUFrQkosRUFBbEIsQ0FBL0IsRUFBc0Q7QUFDcERFLG1CQUFTRyxJQUFULENBQWNMLEVBQWQ7QUFDQSxlQUFLUixHQUFMLENBQVMsaUJBQVQsRUFBNEJVLFFBQTVCO0FBQ0Q7QUFDRjtBQXhDSDtBQUFBO0FBQUEsbUNBMENlRixFQTFDZixFQTBDbUI7QUFDZixZQUFNQyxPQUFPLEtBQUtWLEdBQUwsQ0FBUyxTQUFULENBQWI7QUFDQSxZQUFNVyxXQUFXLEtBQUtYLEdBQUwsQ0FBUyxpQkFBVCxDQUFqQjtBQUNBLFlBQUlVLEtBQUtELEVBQUwsTUFBYUcsU0FBYixJQUEwQkQsU0FBU0UsUUFBVCxDQUFrQkosRUFBbEIsQ0FBOUIsRUFBcUQ7QUFDbkRFLG1CQUFTSSxNQUFULENBQWdCSixTQUFTSyxPQUFULENBQWlCUCxFQUFqQixDQUFoQixFQUFzQyxDQUF0QztBQUNBLGVBQUtSLEdBQUwsQ0FBUyxpQkFBVCxFQUE0QlUsUUFBNUI7QUFDRDtBQUNGO0FBakRIO0FBQUE7QUFBQSx3Q0FtRG9CO0FBQ2hCLFlBQU1ELE9BQU9SLE9BQU9DLElBQVAsQ0FBWSxLQUFLSCxHQUFMLENBQVMsU0FBVCxDQUFaLENBQWI7QUFDQSxZQUFNVyxXQUFXLEtBQUtYLEdBQUwsQ0FBUyxpQkFBVCxDQUFqQjtBQUNBLFlBQU1pQixPQUFPLEVBQWI7QUFDQVAsYUFBS1EsT0FBTCxDQUFhLFVBQUNYLEdBQUQsRUFBUztBQUNwQixjQUFJLENBQUNJLFNBQVNFLFFBQVQsQ0FBa0JOLEdBQWxCLENBQUwsRUFBNkJVLEtBQUtILElBQUwsQ0FBVVAsR0FBVjtBQUM5QixTQUZEO0FBR0EsZUFBT1UsSUFBUDtBQUNEO0FBM0RIOztBQUFBO0FBQUEsSUFBeUN6QixTQUF6QztBQTZERCxDQXJFRCIsImZpbGUiOiJtb2R1bGUvY29yZS9jb21wb25lbnQvc3ltc2VsZWN0ZmllbGQvbW9kZWwuanMiLCJzb3VyY2VzQ29udGVudCI6WyJkZWZpbmUoKHJlcXVpcmUpID0+IHtcbiAgY29uc3QgQmFzZU1vZGVsID0gcmVxdWlyZSgnY29yZS9jb21wb25lbnQvZm9ybS9maWVsZC9tb2RlbCcpLFxuICAgIFV0aWxzID0gcmVxdWlyZSgnY29yZS91dGlsL3V0aWxzJyksXG4gICAgZGVmYXVsdHMgPSB7XG4gICAgICBvcHRpb25zOiB7fSxcbiAgICAgIGRpc2FibGVkT3B0aW9uczogW11cbiAgICB9O1xuXG4gIHJldHVybiBjbGFzcyBTeW1TZWxlY3RGaWVsZE1vZGVsIGV4dGVuZHMgQmFzZU1vZGVsIHtcbiAgICBjb25zdHJ1Y3Rvcihjb25maWcpIHtcbiAgICAgIGNvbmZpZy5kZWZhdWx0cyA9IFV0aWxzLmVuc3VyZURlZmF1bHRzKGNvbmZpZy5kZWZhdWx0cywgZGVmYXVsdHMpO1xuICAgICAgc3VwZXIoY29uZmlnKVxuICAgICAgaWYgKCFVdGlscy5leGlzdHModGhpcy5nZXQoJ3ZhbHVlJykpKSB7XG4gICAgICAgIHRoaXMuc2V0KCd2YWx1ZScsIE9iamVjdC5rZXlzKHRoaXMuZ2V0KCdvcHRpb25zJykpWzBdKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICB1cGRhdGVWYWx1ZShmaWVsZCx2YWx1ZSkge1xuICAgICAgbGV0IHRtcHZhbCA9IHRoaXMuZ2V0KCd2YWx1ZScpO1xuICAgICAgdG1wdmFsW2ZpZWxkXSA9IHZhbHVlO1xuICAgICAgdGhpcy5zZXQoJ3ZhbHVlJywgdG1wdmFsKTtcbiAgICB9XG5cbiAgICBhZGRPcHRpb24ob3B0KSB7XG4gICAgICAvLyBub3RlIHRoYXQgdGhpcyBvdmVyd3JpdGVzIGFuIG9wdGlvbiBsYWJlbCBpZiB0aGUgdmFsdWUgYWxyZWFkeSBleGlzdHMuXG4gICAgICBjb25zdCBvcHRpb25zID0gdGhpcy5nZXQoJ29wdGlvbnMnKTtcbiAgICAgIG9wdGlvbnNbb3B0LnZhbHVlXSA9IG9wdC5sYWJlbDtcbiAgICAgIHRoaXMuc2V0KCdvcHRpb25zJywgb3B0aW9ucywgdHJ1ZSk7XG4gICAgfVxuXG4gICAgcmVtb3ZlT3B0aW9uKGlkKSB7XG4gICAgICBjb25zdCBvcHRpb25zID0gdGhpcy5nZXQoJ29wdGlvbnMnKTtcbiAgICAgIGRlbGV0ZSBvcHRpb25zW2lkXTtcbiAgICAgIHRoaXMuc2V0KCdvcHRpb25zJywgb3B0aW9ucywgdHJ1ZSk7XG4gICAgfVxuXG4gICAgY2xlYXJPcHRpb25zKCkge1xuICAgICAgdGhpcy5zZXQoJ29wdGlvbnMnLCB7fSwgdHJ1ZSk7XG4gICAgICB0aGlzLnNldCgndmFsdWUnLCBudWxsKTtcbiAgICB9XG5cbiAgICBkaXNhYmxlT3B0aW9uKGlkKSB7XG4gICAgICBjb25zdCBvcHRzID0gdGhpcy5nZXQoJ29wdGlvbnMnKVxuICAgICAgY29uc3QgZGlzYWJsZWQgPSB0aGlzLmdldCgnZGlzYWJsZWRPcHRpb25zJylcbiAgICAgIGlmIChvcHRzW2lkXSAhPT0gdW5kZWZpbmVkICYmICFkaXNhYmxlZC5pbmNsdWRlcyhpZCkpIHtcbiAgICAgICAgZGlzYWJsZWQucHVzaChpZCk7XG4gICAgICAgIHRoaXMuc2V0KCdkaXNhYmxlZE9wdGlvbnMnLCBkaXNhYmxlZCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgZW5hYmxlT3B0aW9uKGlkKSB7XG4gICAgICBjb25zdCBvcHRzID0gdGhpcy5nZXQoJ29wdGlvbnMnKVxuICAgICAgY29uc3QgZGlzYWJsZWQgPSB0aGlzLmdldCgnZGlzYWJsZWRPcHRpb25zJylcbiAgICAgIGlmIChvcHRzW2lkXSAhPT0gdW5kZWZpbmVkICYmIGRpc2FibGVkLmluY2x1ZGVzKGlkKSkge1xuICAgICAgICBkaXNhYmxlZC5zcGxpY2UoZGlzYWJsZWQuaW5kZXhPZihpZCksIDEpO1xuICAgICAgICB0aGlzLnNldCgnZGlzYWJsZWRPcHRpb25zJywgZGlzYWJsZWQpO1xuICAgICAgfVxuICAgIH1cblxuICAgIGxpc3RBYmxlT3B0aW9ucygpIHtcbiAgICAgIGNvbnN0IG9wdHMgPSBPYmplY3Qua2V5cyh0aGlzLmdldCgnb3B0aW9ucycpKTtcbiAgICAgIGNvbnN0IGRpc2FibGVkID0gdGhpcy5nZXQoJ2Rpc2FibGVkT3B0aW9ucycpXG4gICAgICBjb25zdCBhYmxlID0gW11cbiAgICAgIG9wdHMuZm9yRWFjaCgob3B0KSA9PiB7XG4gICAgICAgIGlmICghZGlzYWJsZWQuaW5jbHVkZXMob3B0KSkgYWJsZS5wdXNoKG9wdClcbiAgICAgIH0pXG4gICAgICByZXR1cm4gYWJsZTtcbiAgICB9XG4gIH1cbn0pO1xuIl19
