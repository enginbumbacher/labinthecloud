'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

define(function (require) {
  var MultiField = require('core/component/multifield/field'),
      View = require('./view'),
      LightRow = require('../row/field'),
      Utils = require('core/util/utils'),
      Globals = require('core/model/globals'),
      defaults = {
    childClass: LightRow,
    childSettings: {
      value: {
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
        duration: 5
      }
    },
    min: 1,
    sortable: false,
    addButtonLabel: "+"
  };

  var LightMatrixField = function (_MultiField) {
    _inherits(LightMatrixField, _MultiField);

    function LightMatrixField(config) {
      _classCallCheck(this, LightMatrixField);

      config.modelData = Utils.ensureDefaults(config.modelData, defaults);
      config.viewClass = config.viewClass || View;

      var _this = _possibleConstructorReturn(this, (LightMatrixField.__proto__ || Object.getPrototypeOf(LightMatrixField)).call(this, config));

      Utils.bindMethods(_this, ['_onModelChange']);
      return _this;
    }

    _createClass(LightMatrixField, [{
      key: '_onModelChange',
      value: function _onModelChange(evt) {
        _get(LightMatrixField.prototype.__proto__ || Object.getPrototypeOf(LightMatrixField.prototype), '_onModelChange', this).call(this, evt);
        var total = this.value().map(function (field) {
          return field.duration ? field.duration : 0;
        }).reduce(function (prev, curr, currInd, arr) {
          return prev + curr;
        }, 0);
        this.view().updateTotals(total, Globals.get('AppConfig.experiment.maxDuration') - total);
      }
    }]);

    return LightMatrixField;
  }(MultiField);

  LightMatrixField.create = function (data) {
    return new LightMatrixField({
      modelData: data
    });
  };
  return LightMatrixField;
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9ldWdsZW5hL2V4cGVyaW1lbnQvZm9ybV9uYXJyYXRpdmUvbGlnaHRtYXRyaXgvZmllbGQuanMiXSwibmFtZXMiOlsiZGVmaW5lIiwicmVxdWlyZSIsIk11bHRpRmllbGQiLCJWaWV3IiwiTGlnaHRSb3ciLCJVdGlscyIsIkdsb2JhbHMiLCJkZWZhdWx0cyIsImNoaWxkQ2xhc3MiLCJjaGlsZFNldHRpbmdzIiwidmFsdWUiLCJ0b3AiLCJsZWZ0IiwiYm90dG9tIiwicmlnaHQiLCJkdXJhdGlvbiIsIm1pbiIsInNvcnRhYmxlIiwiYWRkQnV0dG9uTGFiZWwiLCJMaWdodE1hdHJpeEZpZWxkIiwiY29uZmlnIiwibW9kZWxEYXRhIiwiZW5zdXJlRGVmYXVsdHMiLCJ2aWV3Q2xhc3MiLCJiaW5kTWV0aG9kcyIsImV2dCIsInRvdGFsIiwibWFwIiwiZmllbGQiLCJyZWR1Y2UiLCJwcmV2IiwiY3VyciIsImN1cnJJbmQiLCJhcnIiLCJ2aWV3IiwidXBkYXRlVG90YWxzIiwiZ2V0IiwiY3JlYXRlIiwiZGF0YSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O0FBQUFBLE9BQU8sVUFBQ0MsT0FBRCxFQUFhO0FBQ2xCLE1BQU1DLGFBQWFELFFBQVEsaUNBQVIsQ0FBbkI7QUFBQSxNQUNFRSxPQUFPRixRQUFRLFFBQVIsQ0FEVDtBQUFBLE1BRUVHLFdBQVdILFFBQVEsY0FBUixDQUZiO0FBQUEsTUFHRUksUUFBUUosUUFBUSxpQkFBUixDQUhWO0FBQUEsTUFJRUssVUFBVUwsUUFBUSxvQkFBUixDQUpaO0FBQUEsTUFNRU0sV0FBVztBQUNUQyxnQkFBWUosUUFESDtBQUVUSyxtQkFBZTtBQUNiQyxhQUFPO0FBQ0xDLGFBQUssQ0FEQTtBQUVMQyxjQUFNLENBRkQ7QUFHTEMsZ0JBQVEsQ0FISDtBQUlMQyxlQUFPLENBSkY7QUFLTEMsa0JBQVU7QUFMTDtBQURNLEtBRk47QUFXVEMsU0FBSyxDQVhJO0FBWVRDLGNBQVUsS0FaRDtBQWFUQyxvQkFBZ0I7QUFiUCxHQU5iOztBQURrQixNQXdCWkMsZ0JBeEJZO0FBQUE7O0FBeUJoQiw4QkFBWUMsTUFBWixFQUFvQjtBQUFBOztBQUNsQkEsYUFBT0MsU0FBUCxHQUFtQmhCLE1BQU1pQixjQUFOLENBQXFCRixPQUFPQyxTQUE1QixFQUF1Q2QsUUFBdkMsQ0FBbkI7QUFDQWEsYUFBT0csU0FBUCxHQUFtQkgsT0FBT0csU0FBUCxJQUFvQnBCLElBQXZDOztBQUZrQixzSUFHWmlCLE1BSFk7O0FBSWxCZixZQUFNbUIsV0FBTixRQUF3QixDQUFDLGdCQUFELENBQXhCO0FBSmtCO0FBS25COztBQTlCZTtBQUFBO0FBQUEscUNBZ0NEQyxHQWhDQyxFQWdDSTtBQUNsQiwySUFBcUJBLEdBQXJCO0FBQ0EsWUFBSUMsUUFBUSxLQUFLaEIsS0FBTCxHQUFhaUIsR0FBYixDQUFpQixVQUFDQyxLQUFEO0FBQUEsaUJBQVdBLE1BQU1iLFFBQU4sR0FBaUJhLE1BQU1iLFFBQXZCLEdBQWtDLENBQTdDO0FBQUEsU0FBakIsRUFBaUVjLE1BQWpFLENBQXdFLFVBQUNDLElBQUQsRUFBT0MsSUFBUCxFQUFhQyxPQUFiLEVBQXNCQyxHQUF0QjtBQUFBLGlCQUE4QkgsT0FBT0MsSUFBckM7QUFBQSxTQUF4RSxFQUFtSCxDQUFuSCxDQUFaO0FBQ0EsYUFBS0csSUFBTCxHQUFZQyxZQUFaLENBQXlCVCxLQUF6QixFQUFnQ3BCLFFBQVE4QixHQUFSLENBQVksa0NBQVosSUFBa0RWLEtBQWxGO0FBQ0Q7QUFwQ2U7O0FBQUE7QUFBQSxJQXdCYXhCLFVBeEJiOztBQXVDbEJpQixtQkFBaUJrQixNQUFqQixHQUEwQixVQUFDQyxJQUFELEVBQVU7QUFDbEMsV0FBTyxJQUFJbkIsZ0JBQUosQ0FBcUI7QUFDMUJFLGlCQUFXaUI7QUFEZSxLQUFyQixDQUFQO0FBR0QsR0FKRDtBQUtBLFNBQU9uQixnQkFBUDtBQUNELENBN0NEIiwiZmlsZSI6Im1vZHVsZS9ldWdsZW5hL2V4cGVyaW1lbnQvZm9ybV9uYXJyYXRpdmUvbGlnaHRtYXRyaXgvZmllbGQuanMiLCJzb3VyY2VzQ29udGVudCI6WyJkZWZpbmUoKHJlcXVpcmUpID0+IHtcbiAgY29uc3QgTXVsdGlGaWVsZCA9IHJlcXVpcmUoJ2NvcmUvY29tcG9uZW50L211bHRpZmllbGQvZmllbGQnKSxcbiAgICBWaWV3ID0gcmVxdWlyZSgnLi92aWV3JyksXG4gICAgTGlnaHRSb3cgPSByZXF1aXJlKCcuLi9yb3cvZmllbGQnKSxcbiAgICBVdGlscyA9IHJlcXVpcmUoJ2NvcmUvdXRpbC91dGlscycpLFxuICAgIEdsb2JhbHMgPSByZXF1aXJlKCdjb3JlL21vZGVsL2dsb2JhbHMnKSxcblxuICAgIGRlZmF1bHRzID0ge1xuICAgICAgY2hpbGRDbGFzczogTGlnaHRSb3csXG4gICAgICBjaGlsZFNldHRpbmdzOiB7XG4gICAgICAgIHZhbHVlOiB7XG4gICAgICAgICAgdG9wOiAwLFxuICAgICAgICAgIGxlZnQ6IDAsXG4gICAgICAgICAgYm90dG9tOiAwLFxuICAgICAgICAgIHJpZ2h0OiAwLFxuICAgICAgICAgIGR1cmF0aW9uOiA1XG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgICBtaW46IDEsXG4gICAgICBzb3J0YWJsZTogZmFsc2UsXG4gICAgICBhZGRCdXR0b25MYWJlbDogXCIrXCJcbiAgICB9XG4gIDtcblxuICBjbGFzcyBMaWdodE1hdHJpeEZpZWxkIGV4dGVuZHMgTXVsdGlGaWVsZCB7XG4gICAgY29uc3RydWN0b3IoY29uZmlnKSB7XG4gICAgICBjb25maWcubW9kZWxEYXRhID0gVXRpbHMuZW5zdXJlRGVmYXVsdHMoY29uZmlnLm1vZGVsRGF0YSwgZGVmYXVsdHMpO1xuICAgICAgY29uZmlnLnZpZXdDbGFzcyA9IGNvbmZpZy52aWV3Q2xhc3MgfHwgVmlldztcbiAgICAgIHN1cGVyKGNvbmZpZyk7XG4gICAgICBVdGlscy5iaW5kTWV0aG9kcyh0aGlzLCBbJ19vbk1vZGVsQ2hhbmdlJ10pO1xuICAgIH1cblxuICAgIF9vbk1vZGVsQ2hhbmdlKGV2dCkge1xuICAgICAgc3VwZXIuX29uTW9kZWxDaGFuZ2UoZXZ0KTtcbiAgICAgIHZhciB0b3RhbCA9IHRoaXMudmFsdWUoKS5tYXAoKGZpZWxkKSA9PiBmaWVsZC5kdXJhdGlvbiA/IGZpZWxkLmR1cmF0aW9uIDogMCkucmVkdWNlKChwcmV2LCBjdXJyLCBjdXJySW5kLCBhcnIpID0+IHByZXYgKyBjdXJyLCAwKTtcbiAgICAgIHRoaXMudmlldygpLnVwZGF0ZVRvdGFscyh0b3RhbCwgR2xvYmFscy5nZXQoJ0FwcENvbmZpZy5leHBlcmltZW50Lm1heER1cmF0aW9uJykgLSB0b3RhbCk7XG4gICAgfVxuICB9XG5cbiAgTGlnaHRNYXRyaXhGaWVsZC5jcmVhdGUgPSAoZGF0YSkgPT4ge1xuICAgIHJldHVybiBuZXcgTGlnaHRNYXRyaXhGaWVsZCh7XG4gICAgICBtb2RlbERhdGE6IGRhdGFcbiAgICB9KTtcbiAgfVxuICByZXR1cm4gTGlnaHRNYXRyaXhGaWVsZDtcbn0pIl19
