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
      ModelingDataTab = require('./blocklytab/tab'),
      SymSliderField = require('core/component/symsliderfield/field'),
      SliderField = require('core/component/sliderfield/field'),
      SelectField = require('core/component/selectfield/field'),
      ModelView = require('./threeview');

  var ModelingDataModule = function (_Module) {
    _inherits(ModelingDataModule, _Module);

    function ModelingDataModule() {
      _classCallCheck(this, ModelingDataModule);

      var _this = _possibleConstructorReturn(this, (ModelingDataModule.__proto__ || Object.getPrototypeOf(ModelingDataModule)).call(this));

      if (Globals.get('AppConfig.modeling')) {
        Utils.bindMethods(_this, ['_onPhaseChange', '_onExperimentCountChange', '_hookModelFields', '_hookModifyExport', '_hookModifyImport', '_hook3dView']);

        _this.tab = new ModelingDataTab();

        Globals.get('Relay').addEventListener('AppPhase.Change', _this._onPhaseChange);
        Globals.get('Relay').addEventListener('ExperimentCount.Change', _this._onExperimentCountChange);

        HM.hook('ModelForm.Fields', _this._hookModelFields);
        HM.hook('ModelForm.ModifyExport', _this._hookModifyExport);
        HM.hook('ModelForm.ModifyImport', _this._hookModifyImport);
        HM.hook('Euglena.3dView', _this._hook3dView);
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
    }, {
      key: '_hookModelFields',
      value: function _hookModelFields(fields, meta) {
        var _this2 = this;

        if (meta.type == "blockly") {
          var bodyConfigs = Array.apply(null, { length: 15 }).map(function (number, ind) {
            return 'configuration_' + (ind + 1);
          });
          this.bodyConfigOptions = {};
          bodyConfigs.map(function (bodyconfig) {
            return _this2.bodyConfigOptions[bodyconfig] = bodyconfig;
          });
          fields = fields.concat([SelectField.create({
            id: "bodyConfigurationName",
            color: meta.config.bodyConfiguration.color ? meta.config.bodyConfiguration.color : null,
            label: meta.config.bodyConfiguration.label,
            value: meta.config.bodyConfiguration.initialValue,
            classes: [],
            options: this.bodyConfigOptions
          }), SymSliderField.create({
            id: 'opacity',
            color: meta.config.opacity.color ? meta.config.opacity.color : null,
            label: meta.config.opacity.label,
            min: meta.config.opacity.range[0],
            max: meta.config.opacity.range[1],
            steps: Math.round((meta.config.opacity.range[1] - meta.config.opacity.range[0]) / meta.config.opacity.resolution),
            defaultValue: meta.config.opacity.initialValue
          }), SymSliderField.create({
            id: 'k',
            color: meta.config.K.color ? meta.config.K.color : null,
            label: meta.config.K.label,
            min: meta.config.K.range[0],
            max: meta.config.K.range[1],
            steps: Math.round((meta.config.K.range[1] - meta.config.K.range[0]) / meta.config.K.resolution),
            defaultValue: meta.config.K.initialValue
          }), SymSliderField.create({
            id: 'v',
            color: meta.config.v.color ? meta.config.v.color : null,
            label: meta.config.v.label,
            min: meta.config.v.range[0],
            max: meta.config.v.range[1],
            steps: Math.round((meta.config.v.range[1] - meta.config.v.range[0]) / meta.config.v.resolution),
            defaultValue: meta.config.v.initialValue
          }), SymSliderField.create({
            id: 'omega',
            color: meta.config.omega.color ? meta.config.omega.color : null,
            label: meta.config.omega.label,
            min: meta.config.omega.range[0],
            max: meta.config.omega.range[1],
            steps: Math.round((meta.config.omega.range[1] - meta.config.omega.range[0]) / meta.config.omega.resolution),
            defaultValue: meta.config.omega.initialValue
          })]);
        }
        return fields;
      }
    }, {
      key: '_hookModifyExport',
      value: function _hookModifyExport(exp, meta) {
        if (meta.type == "blockly") {
          ['k', 'v', 'omega', 'opacity'].forEach(function (key) {
            exp[key + '_delta'] = exp[key].delta;
            exp[key] = exp[key].base;
          });
        }
        return exp;
      }
    }, {
      key: '_hookModifyImport',
      value: function _hookModifyImport(data, meta) {
        if (meta.type == "blockly") {
          ['k', 'v', 'omega', 'opacity'].forEach(function (key) {
            data[key] = {
              base: data[key],
              delta: data[key + '_delta']
            };
            delete data[key + '_delta'];
          });
        }
        return data;
      }
    }, {
      key: '_hook3dView',
      value: function _hook3dView(view, meta) {
        if (meta.config.modelType == "blockly") {
          return new ModelView({ baseColor: meta.color }).view();
        }
        return view;
      }
    }]);

    return ModelingDataModule;
  }(Module);

  return ModelingDataModule;
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9ldWdsZW5hL21vZGVsX2Jsb2NrbHkvbW9kdWxlLmpzIl0sIm5hbWVzIjpbImRlZmluZSIsInJlcXVpcmUiLCJVdGlscyIsIkdsb2JhbHMiLCJITSIsIk1vZHVsZSIsIk1vZGVsaW5nRGF0YVRhYiIsIlN5bVNsaWRlckZpZWxkIiwiU2xpZGVyRmllbGQiLCJTZWxlY3RGaWVsZCIsIk1vZGVsVmlldyIsIk1vZGVsaW5nRGF0YU1vZHVsZSIsImdldCIsImJpbmRNZXRob2RzIiwidGFiIiwiYWRkRXZlbnRMaXN0ZW5lciIsIl9vblBoYXNlQ2hhbmdlIiwiX29uRXhwZXJpbWVudENvdW50Q2hhbmdlIiwiaG9vayIsIl9ob29rTW9kZWxGaWVsZHMiLCJfaG9va01vZGlmeUV4cG9ydCIsIl9ob29rTW9kaWZ5SW1wb3J0IiwiX2hvb2szZFZpZXciLCJnZXRQYW5lbCIsImFkZENvbnRlbnQiLCJ2aWV3IiwiZXZ0IiwiZGF0YSIsInBoYXNlIiwiaGlkZSIsImNvdW50Iiwib2xkIiwic2hvdyIsImZpZWxkcyIsIm1ldGEiLCJ0eXBlIiwiYm9keUNvbmZpZ3MiLCJBcnJheSIsImFwcGx5IiwibGVuZ3RoIiwibWFwIiwibnVtYmVyIiwiaW5kIiwiYm9keUNvbmZpZ09wdGlvbnMiLCJib2R5Y29uZmlnIiwiY29uY2F0IiwiY3JlYXRlIiwiaWQiLCJjb2xvciIsImNvbmZpZyIsImJvZHlDb25maWd1cmF0aW9uIiwibGFiZWwiLCJ2YWx1ZSIsImluaXRpYWxWYWx1ZSIsImNsYXNzZXMiLCJvcHRpb25zIiwib3BhY2l0eSIsIm1pbiIsInJhbmdlIiwibWF4Iiwic3RlcHMiLCJNYXRoIiwicm91bmQiLCJyZXNvbHV0aW9uIiwiZGVmYXVsdFZhbHVlIiwiSyIsInYiLCJvbWVnYSIsImV4cCIsImZvckVhY2giLCJrZXkiLCJkZWx0YSIsImJhc2UiLCJtb2RlbFR5cGUiLCJiYXNlQ29sb3IiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBQUEsT0FBTyxVQUFDQyxPQUFE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UDtBQUNEO0FBaEllOztBQUFBO0FBQUEsSUFZZXBCLE1BWmY7O0FBbUlsQixTQUFPTSxrQkFBUDtBQUNELENBcElEIiwiZmlsZSI6Im1vZHVsZS9ldWdsZW5hL21vZGVsX2Jsb2NrbHkvbW9kdWxlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiZGVmaW5lKChyZXF1aXJlKSA9PiB7XG4gIGNvbnN0IFV0aWxzID0gcmVxdWlyZSgnY29yZS91dGlsL3V0aWxzJyksXG4gICAgR2xvYmFscyA9IHJlcXVpcmUoJ2NvcmUvbW9kZWwvZ2xvYmFscycpLFxuICAgIEhNID0gcmVxdWlyZSgnY29yZS9ldmVudC9ob29rX21hbmFnZXInKTtcblxuICBjb25zdCBNb2R1bGUgPSByZXF1aXJlKCdjb3JlL2FwcC9tb2R1bGUnKSxcbiAgICBNb2RlbGluZ0RhdGFUYWIgPSByZXF1aXJlKCcuL2Jsb2NrbHl0YWIvdGFiJyksXG4gICAgU3ltU2xpZGVyRmllbGQgPSByZXF1aXJlKCdjb3JlL2NvbXBvbmVudC9zeW1zbGlkZXJmaWVsZC9maWVsZCcpLFxuICAgIFNsaWRlckZpZWxkID0gcmVxdWlyZSgnY29yZS9jb21wb25lbnQvc2xpZGVyZmllbGQvZmllbGQnKSxcbiAgICBTZWxlY3RGaWVsZCA9IHJlcXVpcmUoJ2NvcmUvY29tcG9uZW50L3NlbGVjdGZpZWxkL2ZpZWxkJyksXG4gICAgTW9kZWxWaWV3ID0gcmVxdWlyZSgnLi90aHJlZXZpZXcnKTtcblxuICBjbGFzcyBNb2RlbGluZ0RhdGFNb2R1bGUgZXh0ZW5kcyBNb2R1bGUge1xuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgc3VwZXIoKTtcbiAgICAgIGlmIChHbG9iYWxzLmdldCgnQXBwQ29uZmlnLm1vZGVsaW5nJykpIHtcbiAgICAgICAgVXRpbHMuYmluZE1ldGhvZHModGhpcywgWydfb25QaGFzZUNoYW5nZScsICdfb25FeHBlcmltZW50Q291bnRDaGFuZ2UnLFxuICAgICAgJ19ob29rTW9kZWxGaWVsZHMnLCAnX2hvb2tNb2RpZnlFeHBvcnQnLCAnX2hvb2tNb2RpZnlJbXBvcnQnLCAnX2hvb2szZFZpZXcnXSlcblxuICAgICAgICB0aGlzLnRhYiA9IG5ldyBNb2RlbGluZ0RhdGFUYWIoKTtcblxuICAgICAgICBHbG9iYWxzLmdldCgnUmVsYXknKS5hZGRFdmVudExpc3RlbmVyKCdBcHBQaGFzZS5DaGFuZ2UnLCB0aGlzLl9vblBoYXNlQ2hhbmdlKVxuICAgICAgICBHbG9iYWxzLmdldCgnUmVsYXknKS5hZGRFdmVudExpc3RlbmVyKCdFeHBlcmltZW50Q291bnQuQ2hhbmdlJywgdGhpcy5fb25FeHBlcmltZW50Q291bnRDaGFuZ2UpXG5cbiAgICAgICAgSE0uaG9vaygnTW9kZWxGb3JtLkZpZWxkcycsIHRoaXMuX2hvb2tNb2RlbEZpZWxkcyk7XG4gICAgICAgIEhNLmhvb2soJ01vZGVsRm9ybS5Nb2RpZnlFeHBvcnQnLCB0aGlzLl9ob29rTW9kaWZ5RXhwb3J0KTtcbiAgICAgICAgSE0uaG9vaygnTW9kZWxGb3JtLk1vZGlmeUltcG9ydCcsIHRoaXMuX2hvb2tNb2RpZnlJbXBvcnQpO1xuICAgICAgICBITS5ob29rKCdFdWdsZW5hLjNkVmlldycsIHRoaXMuX2hvb2szZFZpZXcpXG5cbiAgICAgIH1cbiAgICB9XG5cbiAgICBydW4oKSB7XG4gICAgICBpZiAodGhpcy50YWIpIEdsb2JhbHMuZ2V0KCdMYXlvdXQnKS5nZXRQYW5lbCgncmVzdWx0JykuYWRkQ29udGVudCh0aGlzLnRhYi52aWV3KCkpXG4gICAgfVxuXG4gICAgX29uUGhhc2VDaGFuZ2UoZXZ0KSB7XG4gICAgICBpZiAoZXZ0LmRhdGEucGhhc2UgPT0gXCJsb2dpblwiIHx8IGV2dC5kYXRhLnBoYXNlID09IFwibG9naW5fYXR0ZW1wdGVkXCIpIHtcbiAgICAgICAgdGhpcy50YWIuaGlkZSgpO1xuICAgICAgfVxuICAgIH1cblxuICAgIF9vbkV4cGVyaW1lbnRDb3VudENoYW5nZShldnQpIHtcbiAgICAgIGlmIChldnQuZGF0YS5jb3VudCAmJiAhZXZ0LmRhdGEub2xkKSB7XG4gICAgICAgIHRoaXMudGFiLnNob3coKTtcbiAgICAgIH0gZWxzZSBpZiAoIWV2dC5kYXRhLmNvdW50KSB7XG4gICAgICAgIHRoaXMudGFiLmhpZGUoKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBfaG9va01vZGVsRmllbGRzKGZpZWxkcywgbWV0YSkge1xuICAgICAgaWYgKG1ldGEudHlwZSA9PSBcImJsb2NrbHlcIikge1xuICAgICAgICB2YXIgYm9keUNvbmZpZ3MgPSBBcnJheS5hcHBseShudWxsLCB7bGVuZ3RoOjE1fSkubWFwKChudW1iZXIsaW5kKSA9PiAnY29uZmlndXJhdGlvbl8nICsgKGluZCsxKSlcbiAgICAgICAgdGhpcy5ib2R5Q29uZmlnT3B0aW9ucyA9IHt9XG4gICAgICAgIGJvZHlDb25maWdzLm1hcChib2R5Y29uZmlnID0+IHRoaXMuYm9keUNvbmZpZ09wdGlvbnNbYm9keWNvbmZpZ10gPSBib2R5Y29uZmlnKVxuICAgICAgICBmaWVsZHMgPSBmaWVsZHMuY29uY2F0KFtTZWxlY3RGaWVsZC5jcmVhdGUoe1xuICAgICAgICAgIGlkOiBcImJvZHlDb25maWd1cmF0aW9uTmFtZVwiLFxuICAgICAgICAgIGNvbG9yOiBtZXRhLmNvbmZpZy5ib2R5Q29uZmlndXJhdGlvbi5jb2xvciA/IG1ldGEuY29uZmlnLmJvZHlDb25maWd1cmF0aW9uLmNvbG9yIDogbnVsbCxcbiAgICAgICAgICBsYWJlbDogbWV0YS5jb25maWcuYm9keUNvbmZpZ3VyYXRpb24ubGFiZWwsXG4gICAgICAgICAgdmFsdWU6IG1ldGEuY29uZmlnLmJvZHlDb25maWd1cmF0aW9uLmluaXRpYWxWYWx1ZSxcbiAgICAgICAgICBjbGFzc2VzOiBbXSxcbiAgICAgICAgICBvcHRpb25zOiB0aGlzLmJvZHlDb25maWdPcHRpb25zXG4gICAgICAgIH0pLCBTeW1TbGlkZXJGaWVsZC5jcmVhdGUoe1xuICAgICAgICAgIGlkOiAnb3BhY2l0eScsXG4gICAgICAgICAgY29sb3I6IG1ldGEuY29uZmlnLm9wYWNpdHkuY29sb3IgPyBtZXRhLmNvbmZpZy5vcGFjaXR5LmNvbG9yIDogbnVsbCxcbiAgICAgICAgICBsYWJlbDogbWV0YS5jb25maWcub3BhY2l0eS5sYWJlbCxcbiAgICAgICAgICBtaW46IG1ldGEuY29uZmlnLm9wYWNpdHkucmFuZ2VbMF0sXG4gICAgICAgICAgbWF4OiBtZXRhLmNvbmZpZy5vcGFjaXR5LnJhbmdlWzFdLFxuICAgICAgICAgIHN0ZXBzOiBNYXRoLnJvdW5kKChtZXRhLmNvbmZpZy5vcGFjaXR5LnJhbmdlWzFdIC0gbWV0YS5jb25maWcub3BhY2l0eS5yYW5nZVswXSkgLyBtZXRhLmNvbmZpZy5vcGFjaXR5LnJlc29sdXRpb24pLFxuICAgICAgICAgIGRlZmF1bHRWYWx1ZTogbWV0YS5jb25maWcub3BhY2l0eS5pbml0aWFsVmFsdWVcbiAgICAgICAgfSksIFN5bVNsaWRlckZpZWxkLmNyZWF0ZSh7XG4gICAgICAgICAgaWQ6ICdrJyxcbiAgICAgICAgICBjb2xvcjogbWV0YS5jb25maWcuSy5jb2xvciA/IG1ldGEuY29uZmlnLksuY29sb3IgOiBudWxsLFxuICAgICAgICAgIGxhYmVsOiBtZXRhLmNvbmZpZy5LLmxhYmVsLFxuICAgICAgICAgIG1pbjogbWV0YS5jb25maWcuSy5yYW5nZVswXSxcbiAgICAgICAgICBtYXg6IG1ldGEuY29uZmlnLksucmFuZ2VbMV0sXG4gICAgICAgICAgc3RlcHM6IE1hdGgucm91bmQoKG1ldGEuY29uZmlnLksucmFuZ2VbMV0gLSBtZXRhLmNvbmZpZy5LLnJhbmdlWzBdKSAvIG1ldGEuY29uZmlnLksucmVzb2x1dGlvbiksXG4gICAgICAgICAgZGVmYXVsdFZhbHVlOiBtZXRhLmNvbmZpZy5LLmluaXRpYWxWYWx1ZVxuICAgICAgICB9KSwgU3ltU2xpZGVyRmllbGQuY3JlYXRlKHtcbiAgICAgICAgICBpZDogJ3YnLFxuICAgICAgICAgIGNvbG9yOiBtZXRhLmNvbmZpZy52LmNvbG9yID8gbWV0YS5jb25maWcudi5jb2xvciA6IG51bGwsXG4gICAgICAgICAgbGFiZWw6IG1ldGEuY29uZmlnLnYubGFiZWwsXG4gICAgICAgICAgbWluOiBtZXRhLmNvbmZpZy52LnJhbmdlWzBdLFxuICAgICAgICAgIG1heDogbWV0YS5jb25maWcudi5yYW5nZVsxXSxcbiAgICAgICAgICBzdGVwczogTWF0aC5yb3VuZCgobWV0YS5jb25maWcudi5yYW5nZVsxXSAtIG1ldGEuY29uZmlnLnYucmFuZ2VbMF0pIC8gbWV0YS5jb25maWcudi5yZXNvbHV0aW9uKSxcbiAgICAgICAgICBkZWZhdWx0VmFsdWU6IG1ldGEuY29uZmlnLnYuaW5pdGlhbFZhbHVlXG4gICAgICAgIH0pLCBTeW1TbGlkZXJGaWVsZC5jcmVhdGUoe1xuICAgICAgICAgIGlkOiAnb21lZ2EnLFxuICAgICAgICAgIGNvbG9yOiBtZXRhLmNvbmZpZy5vbWVnYS5jb2xvciA/IG1ldGEuY29uZmlnLm9tZWdhLmNvbG9yIDogbnVsbCxcbiAgICAgICAgICBsYWJlbDogbWV0YS5jb25maWcub21lZ2EubGFiZWwsXG4gICAgICAgICAgbWluOiBtZXRhLmNvbmZpZy5vbWVnYS5yYW5nZVswXSxcbiAgICAgICAgICBtYXg6IG1ldGEuY29uZmlnLm9tZWdhLnJhbmdlWzFdLFxuICAgICAgICAgIHN0ZXBzOiBNYXRoLnJvdW5kKChtZXRhLmNvbmZpZy5vbWVnYS5yYW5nZVsxXSAtIG1ldGEuY29uZmlnLm9tZWdhLnJhbmdlWzBdKSAvIG1ldGEuY29uZmlnLm9tZWdhLnJlc29sdXRpb24pLFxuICAgICAgICAgIGRlZmF1bHRWYWx1ZTogbWV0YS5jb25maWcub21lZ2EuaW5pdGlhbFZhbHVlXG4gICAgICAgIH0pXG4gICAgICBdKVxuICAgICAgfVxuICAgICAgcmV0dXJuIGZpZWxkcztcbiAgICB9XG5cbiAgICBfaG9va01vZGlmeUV4cG9ydChleHAsIG1ldGEpIHtcbiAgICAgIGlmIChtZXRhLnR5cGUgPT0gXCJibG9ja2x5XCIpIHtcbiAgICAgICAgWydrJywgJ3YnLCAnb21lZ2EnLCdvcGFjaXR5J10uZm9yRWFjaCgoa2V5KSA9PiB7XG4gICAgICAgICAgZXhwW2Ake2tleX1fZGVsdGFgXSA9IGV4cFtrZXldLmRlbHRhO1xuICAgICAgICAgIGV4cFtrZXldID0gZXhwW2tleV0uYmFzZTtcbiAgICAgICAgfSlcbiAgICAgIH1cbiAgICAgIHJldHVybiBleHBcbiAgICB9XG5cbiAgICBfaG9va01vZGlmeUltcG9ydChkYXRhLCBtZXRhKSB7XG4gICAgICBpZiAobWV0YS50eXBlID09IFwiYmxvY2tseVwiKSB7XG4gICAgICAgIFsnaycsICd2JywgJ29tZWdhJywnb3BhY2l0eSddLmZvckVhY2goKGtleSkgPT4ge1xuICAgICAgICAgIGRhdGFba2V5XSA9IHtcbiAgICAgICAgICAgIGJhc2U6IGRhdGFba2V5XSxcbiAgICAgICAgICAgIGRlbHRhOiBkYXRhW2Ake2tleX1fZGVsdGFgXVxuICAgICAgICAgIH07XG4gICAgICAgICAgZGVsZXRlIGRhdGFbYCR7a2V5fV9kZWx0YWBdO1xuICAgICAgICB9KVxuICAgICAgfVxuICAgICAgcmV0dXJuIGRhdGE7XG4gICAgfVxuXG4gICAgX2hvb2szZFZpZXcodmlldywgbWV0YSkge1xuICAgICAgaWYgKG1ldGEuY29uZmlnLm1vZGVsVHlwZSA9PSBcImJsb2NrbHlcIikge1xuICAgICAgICByZXR1cm4gKG5ldyBNb2RlbFZpZXcoeyBiYXNlQ29sb3I6IG1ldGEuY29sb3IgfSkpLnZpZXcoKVxuICAgICAgfVxuICAgICAgcmV0dXJuIHZpZXc7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIE1vZGVsaW5nRGF0YU1vZHVsZTtcbn0pXG4iXX0=
