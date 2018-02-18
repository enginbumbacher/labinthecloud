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
        this.opacity = opacity;
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9ldWdsZW5hL21vZGVsX2Jsb2NrbHkvYm9keUNvbmZpZ3VyYXRpb25zL2JvZHljb25maWdzL2JvZHljb25maWdzLmpzIl0sIm5hbWVzIjpbImRlZmluZSIsInJlcXVpcmUiLCJDb21wb25lbnQiLCJNb2RlbCIsIlZpZXciLCJVdGlscyIsIkJvZHlDb25maWd1cmF0aW9ucyIsInNldHRpbmdzIiwibW9kZWxDbGFzcyIsInZpZXdDbGFzcyIsImJpbmRNZXRob2RzIiwiYWN0aXZlQ29uZmlnIiwib3BhY2l0eSIsIl9tb2RlbCIsInNldENvbmZpZ3MiLCJpbWdQYXRoIiwiX2ltcG9ydEFsbEltYWdlcyIsInNldEFjdGl2ZUNvbmZpZ3VyYXRpb24iLCJtb2RlbERhdGEiLCJib2R5Q29uZmlndXJhdGlvbk5hbWUiLCJzZXRCb2R5T3BhY2l0eSIsImNvbmZpZ05hbWUiLCJoaWRlIiwiZ2V0Q29uZmlnSWQiLCJzaG93IiwiZ2V0Q29uZmlnSlNPTiIsInZpZXciLCJfc2V0Qm9keU9wYWNpdHkiLCJjb25maWdJZCIsIl9oaWRlQm9keUNvbmZpZyIsIl9zaG93Qm9keUNvbmZpZyIsIk9iamVjdCIsImtleXMiLCJkZWZhdWx0Q29uZmlncyIsIm1hcCIsIl9hZGRMYXllciIsImNvbmZpZ3VyYXRpb24iLCJnZXQiLCJzZXQiLCJjcmVhdGUiLCJkYXRhIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQUFBLE9BQU8sVUFBQ0MsT0FBRCxFQUFhO0FBQ2xCLE1BQU1DLFlBQVlELFFBQVEsMEJBQVIsQ0FBbEI7QUFBQSxNQUNFRSxRQUFRRixRQUFRLFNBQVIsQ0FEVjtBQUFBLE1BRUVHLE9BQU9ILFFBQVEsUUFBUixDQUZUO0FBQUEsTUFHRUksUUFBUUosUUFBUSxpQkFBUixDQUhWOztBQURrQixNQU9aSyxrQkFQWTtBQUFBOztBQVFoQixrQ0FBMkI7QUFBQSxVQUFmQyxRQUFlLHVFQUFKLEVBQUk7O0FBQUE7O0FBQ3pCQSxlQUFTQyxVQUFULEdBQXNCRCxTQUFTQyxV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ZmlsZSI6Im1vZHVsZS9ldWdsZW5hL21vZGVsX2Jsb2NrbHkvYm9keUNvbmZpZ3VyYXRpb25zL2JvZHljb25maWdzL2JvZHljb25maWdzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiZGVmaW5lKChyZXF1aXJlKSA9PiB7XG4gIGNvbnN0IENvbXBvbmVudCA9IHJlcXVpcmUoJ2NvcmUvY29tcG9uZW50L2NvbXBvbmVudCcpLFxuICAgIE1vZGVsID0gcmVxdWlyZSgnLi9tb2RlbCcpLFxuICAgIFZpZXcgPSByZXF1aXJlKCcuL3ZpZXcnKSxcbiAgICBVdGlscyA9IHJlcXVpcmUoJ2NvcmUvdXRpbC91dGlscycpXG4gIDtcblxuICBjbGFzcyBCb2R5Q29uZmlndXJhdGlvbnMgZXh0ZW5kcyBDb21wb25lbnQge1xuICAgIGNvbnN0cnVjdG9yKHNldHRpbmdzID0ge30pIHtcbiAgICAgIHNldHRpbmdzLm1vZGVsQ2xhc3MgPSBzZXR0aW5ncy5tb2RlbENsYXNzIHx8IE1vZGVsO1xuICAgICAgc2V0dGluZ3Mudmlld0NsYXNzID0gc2V0dGluZ3Mudmlld0NsYXNzIHx8IFZpZXc7XG4gICAgICBzdXBlcihzZXR0aW5ncyk7XG4gICAgICBVdGlscy5iaW5kTWV0aG9kcyh0aGlzLCBbJ19pbXBvcnRBbGxJbWFnZXMnLCdzZXRCb2R5T3BhY2l0eScsICdzZXRBY3RpdmVDb25maWd1cmF0aW9uJywgJ2hpZGUnLCAnc2hvdyddKVxuXG4gICAgICB0aGlzLmFjdGl2ZUNvbmZpZyA9IG51bGw7XG4gICAgICB0aGlzLm9wYWNpdHkgPSBudWxsO1xuXG4gICAgICB0aGlzLl9tb2RlbC5zZXRDb25maWdzKCkgO1xuXG4gICAgICAvLyBNT1ZFIFRIRSBGT0xMT1dJTkcgUEFSVFMgVE8gVklFVygpXG5cbiAgICAgIHRoaXMuaW1nUGF0aCA9ICdjc2xpYi9tb2R1bGUvZXVnbGVuYS9tb2RlbF9ibG9ja2x5L2JvZHlDb25maWd1cmF0aW9ucy9pbWdzLyc7XG4gICAgICB0aGlzLl9pbXBvcnRBbGxJbWFnZXMoKTtcblxuICAgICAgdGhpcy5zZXRBY3RpdmVDb25maWd1cmF0aW9uKHNldHRpbmdzLm1vZGVsRGF0YS5ib2R5Q29uZmlndXJhdGlvbk5hbWUpXG4gICAgICB0aGlzLnNldEJvZHlPcGFjaXR5KHNldHRpbmdzLm1vZGVsRGF0YS5vcGFjaXR5KVxuXG4gICAgfVxuXG4gICAgc2V0QWN0aXZlQ29uZmlndXJhdGlvbihjb25maWdOYW1lKSB7XG4gICAgICBpZiAodGhpcy5hY3RpdmVDb25maWcpIHtcbiAgICAgICAgdGhpcy5oaWRlKHRoaXMuX21vZGVsLmdldENvbmZpZ0lkKHRoaXMuYWN0aXZlQ29uZmlnKSk7XG4gICAgICB9XG4gICAgICB0aGlzLmFjdGl2ZUNvbmZpZyA9IGNvbmZpZ05hbWU7XG4gICAgICB0aGlzLnNob3codGhpcy5fbW9kZWwuZ2V0Q29uZmlnSWQodGhpcy5hY3RpdmVDb25maWcpKTtcbiAgICB9XG5cbiAgICBnZXRBY3RpdmVDb25maWd1cmF0aW9uKCkge1xuICAgICAgICBpZiAodGhpcy5hY3RpdmVDb25maWcpIHtcbiAgICAgICAgICByZXR1cm4gdGhpcy5fbW9kZWwuZ2V0Q29uZmlnSlNPTih0aGlzLmFjdGl2ZUNvbmZpZylcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXR1cm4gbnVsbFxuICAgICAgICB9XG4gICAgfVxuXG4gICAgc2V0Qm9keU9wYWNpdHkob3BhY2l0eSkge1xuICAgICAgdGhpcy5vcGFjaXR5ID0gb3BhY2l0eTtcbiAgICAgIHRoaXMudmlldygpLl9zZXRCb2R5T3BhY2l0eShvcGFjaXR5KVxuICAgIH1cblxuICAgIGhpZGUoY29uZmlnSWQpIHtcbiAgICAgIHRoaXMudmlldygpLl9oaWRlQm9keUNvbmZpZyhjb25maWdJZCk7XG4gICAgfVxuXG4gICAgc2hvdyhjb25maWdJZCkge1xuICAgICAgdGhpcy52aWV3KCkuX3Nob3dCb2R5Q29uZmlnKGNvbmZpZ0lkKTtcbiAgICB9XG5cbiAgICBfaW1wb3J0QWxsSW1hZ2VzKCkge1xuICAgICAgT2JqZWN0LmtleXModGhpcy5fbW9kZWwuZGVmYXVsdENvbmZpZ3MpLm1hcChjb25maWd1cmF0aW9uID0+IHtcblxuICAgICAgICB0aGlzLnZpZXcoKS5fYWRkTGF5ZXIodGhpcy5fbW9kZWwuZGVmYXVsdENvbmZpZ3NbY29uZmlndXJhdGlvbl0sIHRoaXMuaW1nUGF0aCk7XG4gICAgICB9KVxuICAgIH1cblxuICAgIGlkKCkge1xuICAgICAgcmV0dXJuIHRoaXMuX21vZGVsLmdldCgnaWQnKVxuICAgIH1cblxuICAgIHNlbGVjdCgpIHtcbiAgICAgIHRoaXMuX21vZGVsLnNldCgnc2VsZWN0ZWQnLCB0cnVlKTtcbiAgICB9XG5cbiAgICBkZXNlbGVjdCgpIHtcbiAgICAgIHRoaXMuX21vZGVsLnNldCgnc2VsZWN0ZWQnLCBmYWxzZSk7XG4gICAgfVxuXG4gICAgZXhwb3J0KCkge1xuICAgICAgcmV0dXJuIHRoaXMuX21vZGVsLmdldCgnaWQnKTtcbiAgICB9XG4gIH07XG5cbiAgQm9keUNvbmZpZ3VyYXRpb25zLmNyZWF0ZSA9IChkYXRhKSA9PiB7XG4gICAgcmV0dXJuIG5ldyBCb2R5Q29uZmlndXJhdGlvbnMoeyBtb2RlbERhdGE6IGRhdGEgfSk7XG4gIH1cblxuICByZXR1cm4gQm9keUNvbmZpZ3VyYXRpb25zO1xufSk7XG4iXX0=
