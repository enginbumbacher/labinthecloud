'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

define(function (require) {
  var Component = require('core/component/component'),
      Model = require('./model'),
      View = require('./view'),
      Utils = require('core/util/utils');

  var BodyConfigurations = function (_Component) {
    _inherits(BodyConfigurations, _Component);

    function BodyConfigurations() {
      var settings = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      _classCallCheck(this, BodyConfigurations);

      settings.modelClass = settings.modelClass || Model;
      settings.viewClass = settings.viewClass || View;

      var _this = _possibleConstructorReturn(this, (BodyConfigurations.__proto__ || Object.getPrototypeOf(BodyConfigurations)).call(this, settings));

      Utils.bindMethods(_this, ['_importAllImages', 'setBodyOpacity', 'setActiveConfiguration', 'hide', 'show']);

      _this.activeConfig = null;
      _this.opacity = null;

      _this._model.setConfigs();

      // MOVE THE FOLLOWING PARTS TO VIEW()

      _this.imgPath = 'cslib/module/euglena/model_blockly/bodyConfigurations/imgs/';
      _this._importAllImages();

      _this.setActiveConfiguration(settings.modelData.bodyConfigurationName);
      _this.setBodyOpacity(settings.modelData.opacity);

      return _this;
    }

    _createClass(BodyConfigurations, [{
      key: 'setActiveConfiguration',
      value: function setActiveConfiguration(configName) {
        if (this.activeConfig) {
          this.hide(this._model.getConfigId(this.activeConfig));
        }
        this.activeConfig = configName;
        this.show(this._model.getConfigId(this.activeConfig));
      }
    }, {
      key: 'getActiveConfiguration',
      value: function getActiveConfiguration() {
        if (this.activeConfig) {
          return this._model.getConfigJSON(this.activeConfig);
        } else {
          return null;
        }
      }
    }, {
      key: 'setBodyOpacity',
      value: function setBodyOpacity(opacity) {
        this.opacit = opacity;
        this.view()._setBodyOpacity(opacity);
      }
    }, {
      key: 'hide',
      value: function hide(configId) {
        this.view()._hideBodyConfig(configId);
      }
    }, {
      key: 'show',
      value: function show(configId) {
        this.view()._showBodyConfig(configId);
      }
    }, {
      key: '_importAllImages',
      value: function _importAllImages() {
        var _this2 = this;

        Object.keys(this._model.defaultConfigs).map(function (configuration) {

          _this2.view()._addLayer(_this2._model.defaultConfigs[configuration], _this2.imgPath);
        });
      }
    }, {
      key: 'id',
      value: function id() {
        return this._model.get('id');
      }
    }, {
      key: 'select',
      value: function select() {
        this._model.set('selected', true);
      }
    }, {
      key: 'deselect',
      value: function deselect() {
        this._model.set('selected', false);
      }
    }, {
      key: 'export',
      value: function _export() {
        return this._model.get('id');
      }
    }]);

    return BodyConfigurations;
  }(Component);

  ;

  BodyConfigurations.create = function (data) {
    return new BodyConfigurations({ modelData: data });
  };

  return BodyConfigurations;
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9ldWdsZW5hL21vZGVsX2Jsb2NrbHkvYm9keUNvbmZpZ3VyYXRpb25zL2JvZHljb25maWdzL2JvZHljb25maWdzLmpzIl0sIm5hbWVzIjpbImRlZmluZSIsInJlcXVpcmUiLCJDb21wb25lbnQiLCJNb2RlbCIsIlZpZXciLCJVdGlscyIsIkJvZHlDb25maWd1cmF0aW9ucyIsInNldHRpbmdzIiwibW9kZWxDbGFzcyIsInZpZXdDbGFzcyIsImJpbmRNZXRob2RzIiwiYWN0aXZlQ29uZmlnIiwib3BhY2l0eSIsIl9tb2RlbCIsInNldENvbmZpZ3MiLCJpbWdQYXRoIiwiX2ltcG9ydEFsbEltYWdlcyIsInNldEFjdGl2ZUNvbmZpZ3VyYXRpb24iLCJtb2RlbERhdGEiLCJib2R5Q29uZmlndXJhdGlvbk5hbWUiLCJzZXRCb2R5T3BhY2l0eSIsImNvbmZpZ05hbWUiLCJoaWRlIiwiZ2V0Q29uZmlnSWQiLCJzaG93IiwiZ2V0Q29uZmlnSlNPTiIsIm9wYWNpdCIsInZpZXciLCJfc2V0Qm9keU9wYWNpdHkiLCJjb25maWdJZCIsIl9oaWRlQm9keUNvbmZpZyIsIl9zaG93Qm9keUNvbmZpZyIsIk9iamVjdCIsImtleXMiLCJkZWZhdWx0Q29uZmlncyIsIm1hcCIsIl9hZGRMYXllciIsImNvbmZpZ3VyYXRpb24iLCJnZXQiLCJzZXQiLCJjcmVhdGUiLCJkYXRhIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQUFBLE9BQU8sVUFBQ0MsT0FBRCxFQUFhO0FBQ2xCLE1BQU1DLFlBQVlELFFBQVEsMEJBQVIsQ0FBbEI7QUFBQSxNQUNFRSxRQUFRRixRQUFRLFNBQVIsQ0FEVjtBQUFBLE1BRUVHLE9BQU9ILFFBQVEsUUFBUixDQUZUO0FBQUEsTUFHRUksUUFBUUosUUFBUSxpQkFBUixDQUhWOztBQURrQixNQU9aSyxrQkFQWTtBQUFBOztBQVFoQixrQ0FBMkI7QUFBQSxVQUFmQyxRQUFlLHVFQUFKLEVBQUk7O0FBQUE7O0FBQ3pCQSxlQUFTQyxVQUFULEdBQXNC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RCxDQXZGRCIsImZpbGUiOiJtb2R1bGUvZXVnbGVuYS9tb2RlbF9ibG9ja2x5L2JvZHlDb25maWd1cmF0aW9ucy9ib2R5Y29uZmlncy9ib2R5Y29uZmlncy5qcyIsInNvdXJjZXNDb250ZW50IjpbImRlZmluZSgocmVxdWlyZSkgPT4ge1xuICBjb25zdCBDb21wb25lbnQgPSByZXF1aXJlKCdjb3JlL2NvbXBvbmVudC9jb21wb25lbnQnKSxcbiAgICBNb2RlbCA9IHJlcXVpcmUoJy4vbW9kZWwnKSxcbiAgICBWaWV3ID0gcmVxdWlyZSgnLi92aWV3JyksXG4gICAgVXRpbHMgPSByZXF1aXJlKCdjb3JlL3V0aWwvdXRpbHMnKVxuICA7XG5cbiAgY2xhc3MgQm9keUNvbmZpZ3VyYXRpb25zIGV4dGVuZHMgQ29tcG9uZW50IHtcbiAgICBjb25zdHJ1Y3RvcihzZXR0aW5ncyA9IHt9KSB7XG4gICAgICBzZXR0aW5ncy5tb2RlbENsYXNzID0gc2V0dGluZ3MubW9kZWxDbGFzcyB8fCBNb2RlbDtcbiAgICAgIHNldHRpbmdzLnZpZXdDbGFzcyA9IHNldHRpbmdzLnZpZXdDbGFzcyB8fCBWaWV3O1xuICAgICAgc3VwZXIoc2V0dGluZ3MpO1xuICAgICAgVXRpbHMuYmluZE1ldGhvZHModGhpcywgWydfaW1wb3J0QWxsSW1hZ2VzJywnc2V0Qm9keU9wYWNpdHknLCAnc2V0QWN0aXZlQ29uZmlndXJhdGlvbicsICdoaWRlJywgJ3Nob3cnXSlcblxuICAgICAgdGhpcy5hY3RpdmVDb25maWcgPSBudWxsO1xuICAgICAgdGhpcy5vcGFjaXR5ID0gbnVsbDtcblxuICAgICAgdGhpcy5fbW9kZWwuc2V0Q29uZmlncygpIDtcblxuICAgICAgLy8gTU9WRSBUSEUgRk9MTE9XSU5HIFBBUlRTIFRPIFZJRVcoKVxuXG4gICAgICB0aGlzLmltZ1BhdGggPSAnY3NsaWIvbW9kdWxlL2V1Z2xlbmEvbW9kZWxfYmxvY2tseS9ib2R5Q29uZmlndXJhdGlvbnMvaW1ncy8nO1xuICAgICAgdGhpcy5faW1wb3J0QWxsSW1hZ2VzKCk7XG5cbiAgICAgIHRoaXMuc2V0QWN0aXZlQ29uZmlndXJhdGlvbihzZXR0aW5ncy5tb2RlbERhdGEuYm9keUNvbmZpZ3VyYXRpb25OYW1lKVxuICAgICAgdGhpcy5zZXRCb2R5T3BhY2l0eShzZXR0aW5ncy5tb2RlbERhdGEub3BhY2l0eSlcblxuICAgIH1cblxuICAgIHNldEFjdGl2ZUNvbmZpZ3VyYXRpb24oY29uZmlnTmFtZSkge1xuICAgICAgaWYgKHRoaXMuYWN0aXZlQ29uZmlnKSB7XG4gICAgICAgIHRoaXMuaGlkZSh0aGlzLl9tb2RlbC5nZXRDb25maWdJZCh0aGlzLmFjdGl2ZUNvbmZpZykpO1xuICAgICAgfVxuICAgICAgdGhpcy5hY3RpdmVDb25maWcgPSBjb25maWdOYW1lO1xuICAgICAgdGhpcy5zaG93KHRoaXMuX21vZGVsLmdldENvbmZpZ0lkKHRoaXMuYWN0aXZlQ29uZmlnKSk7XG4gICAgfVxuXG4gICAgZ2V0QWN0aXZlQ29uZmlndXJhdGlvbigpIHtcbiAgICAgICAgaWYgKHRoaXMuYWN0aXZlQ29uZmlnKSB7XG4gICAgICAgICAgcmV0dXJuIHRoaXMuX21vZGVsLmdldENvbmZpZ0pTT04odGhpcy5hY3RpdmVDb25maWcpXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmV0dXJuIG51bGxcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHNldEJvZHlPcGFjaXR5KG9wYWNpdHkpIHtcbiAgICAgIHRoaXMub3BhY2l0ID0gb3BhY2l0eTtcbiAgICAgIHRoaXMudmlldygpLl9zZXRCb2R5T3BhY2l0eShvcGFjaXR5KVxuICAgIH1cblxuICAgIGhpZGUoY29uZmlnSWQpIHtcbiAgICAgIHRoaXMudmlldygpLl9oaWRlQm9keUNvbmZpZyhjb25maWdJZCk7XG4gICAgfVxuXG4gICAgc2hvdyhjb25maWdJZCkge1xuICAgICAgdGhpcy52aWV3KCkuX3Nob3dCb2R5Q29uZmlnKGNvbmZpZ0lkKTtcbiAgICB9XG5cbiAgICBfaW1wb3J0QWxsSW1hZ2VzKCkge1xuICAgICAgT2JqZWN0LmtleXModGhpcy5fbW9kZWwuZGVmYXVsdENvbmZpZ3MpLm1hcChjb25maWd1cmF0aW9uID0+IHtcblxuICAgICAgICB0aGlzLnZpZXcoKS5fYWRkTGF5ZXIodGhpcy5fbW9kZWwuZGVmYXVsdENvbmZpZ3NbY29uZmlndXJhdGlvbl0sIHRoaXMuaW1nUGF0aCk7XG4gICAgICB9KVxuICAgIH1cblxuICAgIGlkKCkge1xuICAgICAgcmV0dXJuIHRoaXMuX21vZGVsLmdldCgnaWQnKVxuICAgIH1cblxuICAgIHNlbGVjdCgpIHtcbiAgICAgIHRoaXMuX21vZGVsLnNldCgnc2VsZWN0ZWQnLCB0cnVlKTtcbiAgICB9XG5cbiAgICBkZXNlbGVjdCgpIHtcbiAgICAgIHRoaXMuX21vZGVsLnNldCgnc2VsZWN0ZWQnLCBmYWxzZSk7XG4gICAgfVxuXG4gICAgZXhwb3J0KCkge1xuICAgICAgcmV0dXJuIHRoaXMuX21vZGVsLmdldCgnaWQnKTtcbiAgICB9XG4gIH07XG5cbiAgQm9keUNvbmZpZ3VyYXRpb25zLmNyZWF0ZSA9IChkYXRhKSA9PiB7XG4gICAgcmV0dXJuIG5ldyBCb2R5Q29uZmlndXJhdGlvbnMoeyBtb2RlbERhdGE6IGRhdGEgfSk7XG4gIH1cblxuICByZXR1cm4gQm9keUNvbmZpZ3VyYXRpb25zO1xufSk7XG4iXX0=
