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

  //SymSliderField = require('core/component/symsliderfield/field'),
  //SliderField = require('core/component/sliderfield/field'),
  SelectField = require('core/component/selectfield/field'),
      SymSelectField = require('core/component/symselectfield/field'),
      ModelView = require('./threeview');

  var defaultConfigs = require('./bodyConfigurations/bodyconfigs/listofconfigs');

  var ModelingDataModule = function (_Module) {
    _inherits(ModelingDataModule, _Module);

    function ModelingDataModule() {
      _classCallCheck(this, ModelingDataModule);

      var _this = _possibleConstructorReturn(this, (ModelingDataModule.__proto__ || Object.getPrototypeOf(ModelingDataModule)).call(this));

      if (Globals.get('AppConfig.modeling')) {
        Utils.bindMethods(_this, ['_onPhaseChange', '_onExperimentCountChange', '_hookModelFields', '_hookModifyExport', '_hookModifyImport', '_hook3dView']);

        if (Globals.get('AppConfig.model.tabs').length) {
          _this.tab = new ModelingDataTab();
          Globals.get('Relay').addEventListener('AppPhase.Change', _this._onPhaseChange);
          Globals.get('Relay').addEventListener('ExperimentCount.Change', _this._onExperimentCountChange);
        }

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
          var bodyConfigs = Array.apply(null, { length: Object.keys(defaultConfigs).length }).map(function (number, ind) {
            return 'sensorConfig_' + (ind + 1);
          });
          // Filter out the options that are not in allowedConfigs
          if (meta.config.allowedConfigs.length) {
            for (var idx = bodyConfigs.length - 1; idx >= 0; idx--) {
              if (meta.config.allowedConfigs.indexOf(defaultConfigs[bodyConfigs[idx]].id.toLowerCase()) == -1) {
                bodyConfigs.splice(idx, 1);
              }
            }
          }
          this.bodyConfigOptions = {};
          bodyConfigs.map(function (bodyconfig) {
            return _this2.bodyConfigOptions[bodyconfig] = defaultConfigs[bodyconfig]['id'];
          });
          fields = fields.concat([SelectField.create({
            id: "bodyConfigurationName",
            inverse_order: true,
            color: meta.config.bodyConfiguration.color ? meta.config.bodyConfiguration.color : null,
            label: meta.config.bodyConfiguration.label,
            value: meta.config.bodyConfiguration.initialValue,
            min_width: meta.config.bodyConfiguration.min_width,
            classes: [],
            options: this.bodyConfigOptions
          }), SymSelectField.create({
            id: 'v',
            inverse_order: true,
            includeVariation: meta.config.variation ? true : false,
            label: meta.config.v.label,
            color: meta.config.v.color ? meta.config.v.color : null,
            value: meta.config.v.initialValue,
            maxValue: meta.config.v.maxValue,
            classes: [],
            options: meta.config.v.options
          }), SymSelectField.create({
            id: 'k',
            inverse_order: true,
            includeVariation: meta.config.variation ? true : false,
            label: meta.config.K.label,
            color: meta.config.K.color ? meta.config.K.color : null,
            value: meta.config.K.initialValue,
            maxValue: meta.config.K.maxValue,
            classes: [],
            options: meta.config.K.options
          })]);

          // Add either roll or motion type option
          if (meta.config.omega) {
            fields.splice(3, 0, SymSelectField.create({
              id: 'omega',
              inverse_order: true,
              includeVariation: meta.config.variation ? true : false,
              label: meta.config.omega.label,
              color: meta.config.omega.color ? meta.config.omega.color : null,
              value: meta.config.omega.initialValue,
              maxValue: meta.config.omega.maxValue,
              classes: [],
              options: meta.config.omega.options
            }));
          } else if (meta.config.motion) {
            fields.splice(3, 0, SymSelectField.create({
              id: 'motion',
              inverse_order: true,
              includeVariation: false,
              label: meta.config.motion.label,
              color: meta.config.motion.color ? meta.config.motion.color : null,
              value: meta.config.motion.initialValue,
              maxValue: meta.config.motion.maxValue,
              classes: [],
              options: meta.config.motion.options
            }));
          }

          // Add opacity
          if (meta.config.opacity) {
            fields.splice(1, 0, SymSelectField.create({
              id: 'opacity',
              inverse_order: true,
              includeVariation: meta.config.variation ? true : false,
              label: meta.config.opacity.label,
              color: meta.config.opacity.color ? meta.config.opacity.color : null,
              value: meta.config.opacity.initialValue,
              maxValue: meta.config.opacity.maxValue,
              classes: [],
              options: meta.config.opacity.options
            }));
          }

          // Add variation
          if (meta.config.variation) {
            fields.push(SymSelectField.create({
              id: 'variation',
              includeVariation: false,
              label: meta.config.variation.label,
              color: meta.config.variation.color ? meta.config.variation.color : null,
              value: meta.config.variation.initialValue,
              maxValue: meta.config.variation.maxValue,
              classes: [],
              options: meta.config.variation.options
            }));
          }
        }
        return fields;
      }
    }, {
      key: '_hookModifyExport',
      value: function _hookModifyExport(exp, meta) {

        if (meta.type == "blockly") {
          ['k', 'v', 'omega', 'opacity', 'variation', 'motion'].forEach(function (key) {
            if (Object.keys(exp).indexOf(key) > -1) {
              exp[key + '_numeric'] = exp[key].numericValue;
              exp[key + '_variation'] = exp[key].variation;
              exp[key] = exp[key].qualitativeValue;
            }
          });
        }

        return exp;
      }
    }, {
      key: '_hookModifyImport',
      value: function _hookModifyImport(data, meta) {
        if (meta.type == "blockly") {
          ['k', 'v', 'omega', 'opacity', 'variation', 'motion'].forEach(function (key) {
            if (Object.keys(data).indexOf(key) > -1) {
              data[key] = {
                qualitativeValue: data[key],
                numericValue: data[key + '_numeric'],
                variation: data[key + '_variation']
              };
              delete data[key + '_numeric'];
              delete data[key + '_variation'];
            }
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9ldWdsZW5hL21vZGVsX2Jsb2NrbHkvbW9kdWxlLmpzIl0sIm5hbWVzIjpbImRlZmluZSIsInJlcXVpcmUiLCJVdGlscyIsIkdsb2JhbHMiLCJITSIsIk1vZHVsZSIsIk1vZGVsaW5nRGF0YVRhYiIsIlNlbGVjdEZpZWxkIiwiU3ltU2VsZWN0RmllbGQiLCJNb2RlbFZpZXciLCJkZWZhdWx0Q29uZmlncyIsIk1vZGVsaW5nRGF0YU1vZHVsZSIsImdldCIsImJpbmRNZXRob2RzIiwibGVuZ3RoIiwidGFiIiwiYWRkRXZlbnRMaXN0ZW5lciIsIl9vblBoYXNlQ2hhbmdlIiwiX29uRXhwZXJpbWVudENvdW50Q2hhbmdlIiwiaG9vayIsIl9ob29rTW9kZWxGaWVsZHMiLCJfaG9va01vZGlmeUV4cG9ydCIsIl9ob29rTW9kaWZ5SW1wb3J0IiwiX2hvb2szZFZpZXciLCJnZXRQYW5lbCIsImFkZENvbnRlbnQiLCJ2aWV3IiwiZXZ0IiwiZGF0YSIsInBoYXNlIiwiaGlkZSIsImNvdW50Iiwib2xkIiwic2hvdyIsImZpZWxkcyIsIm1ldGEiLCJ0eXBlIiwiYm9keUNvbmZpZ3MiLCJBcnJheSIsImFwcGx5IiwiT2JqZWN0Iiwia2V5cyIsIm1hcCIsIm51bWJlciIsImluZCIsImNvbmZpZyIsImFsbG93ZWRDb25maWdzIiwiaWR4IiwiaW5kZXhPZiIsImlkIiwidG9Mb3dlckNhc2UiLCJzcGxpY2UiLCJib2R5Q29uZmlnT3B0aW9ucyIsImJvZHljb25maWciLCJjb25jYXQiLCJjcmVhdGUiLCJpbnZlcnNlX29yZGVyIiwiY29sb3IiLCJib2R5Q29uZmlndXJhdGlvbiIsImxhYmVsIiwidmFsdWUiLCJpbml0aWFsVmFsdWUiLCJtaW5fd2lkdGgiLCJjbGFzc2VzIiwib3B0aW9ucyIsImluY2x1ZGVWYXJpYXRpb24iLCJ2YXJpYXRpb24iLCJ2IiwibWF4VmFsdWUiLCJLIiwib21lZ2EiLCJtb3Rpb24iLCJvcGFjaXR5IiwicHVzaCIsImV4cCIsImZvckVhY2gi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OlsiZGVmaW5lKChyZXF1aXJlKSA9PiB7XG4gIGNvbnN0IFV0aWxzID0gcmVxdWlyZSgnY29yZS91dGlsL3V0aWxzJyksXG4gICAgR2xvYmFscyA9IHJlcXVpcmUoJ2NvcmUvbW9kZWwvZ2xvYmFscycpLFxuICAgIEhNID0gcmVxdWlyZSgnY29yZS9ldmVudC9ob29rX21hbmFnZXInKTtcblxuICBjb25zdCBNb2R1bGUgPSByZXF1aXJlKCdjb3JlL2FwcC9tb2R1bGUnKSxcbiAgICBNb2RlbGluZ0RhdGFUYWIgPSByZXF1aXJlKCcuL2Jsb2NrbHl0YWIvdGFiJyksXG4gICAgLy9TeW1TbGlkZXJGaWVsZCA9IHJlcXVpcmUoJ2NvcmUvY29tcG9uZW50L3N5bXNsaWRlcmZpZWxkL2ZpZWxkJyksXG4gICAgLy9TbGlkZXJGaWVsZCA9IHJlcXVpcmUoJ2NvcmUvY29tcG9uZW50L3NsaWRlcmZpZWxkL2ZpZWxkJyksXG4gICAgU2VsZWN0RmllbGQgPSByZXF1aXJlKCdjb3JlL2NvbXBvbmVudC9zZWxlY3RmaWVsZC9maWVsZCcpLFxuICAgIFN5bVNlbGVjdEZpZWxkID0gcmVxdWlyZSgnY29yZS9jb21wb25lbnQvc3ltc2VsZWN0ZmllbGQvZmllbGQnKSxcbiAgICBNb2RlbFZpZXcgPSByZXF1aXJlKCcuL3RocmVldmlldycpO1xuXG4gIGNvbnN0IGRlZmF1bHRDb25maWdzID0gcmVxdWlyZSgnLi9ib2R5Q29uZmlndXJhdGlvbnMvYm9keWNvbmZpZ3MvbGlzdG9mY29uZmlncycpXG5cblxuICBjbGFzcyBNb2RlbGluZ0RhdGFNb2R1bGUgZXh0ZW5kcyBNb2R1bGUge1xuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgc3VwZXIoKTtcbiAgICAgIGlmIChHbG9iYWxzLmdldCgnQXBwQ29uZmlnLm1vZGVsaW5nJykpIHtcbiAgICAgICAgICBVdGlscy5iaW5kTWV0aG9kcyh0aGlzLCBbJ19vblBoYXNlQ2hhbmdlJywgJ19vbkV4cGVyaW1lbnRDb3VudENoYW5nZScsXG4gICAgICAgICdfaG9va01vZGVsRmllbGRzJywgJ19ob29rTW9kaWZ5RXhwb3J0JywgJ19ob29rTW9kaWZ5SW1wb3J0JywgJ19ob29rM2RWaWV3J10pXG5cbiAgICAgICAgaWYgKEdsb2JhbHMuZ2V0KCdBcHBDb25maWcubW9kZWwudGFicycpLmxlbmd0aCkge1xuICAgICAgICAgIHRoaXMudGFiID0gbmV3IE1vZGVsaW5nRGF0YVRhYigpO1xuICAgICAgICAgIEdsb2JhbHMuZ2V0KCdSZWxheScpLmFkZEV2ZW50TGlzdGVuZXIoJ0FwcFBoYXNlLkNoYW5nZScsIHRoaXMuX29uUGhhc2VDaGFuZ2UpXG4gICAgICAgICAgR2xvYmFscy5nZXQoJ1JlbGF5JykuYWRkRXZlbnRMaXN0ZW5lcignRXhwZXJpbWVudENvdW50LkNoYW5nZScsIHRoaXMuX29uRXhwZXJpbWVudENvdW50Q2hhbmdlKVxuXG4gICAgICAgIH1cblxuICAgICAgICBITS5ob29rKCdNb2RlbEZvcm0uRmllbGRzJywgdGhpcy5faG9va01vZGVsRmllbGRzKTtcbiAgICAgICAgSE0uaG9vaygnTW9kZWxGb3JtLk1vZGlmeUV4cG9ydCcsIHRoaXMuX2hvb2tNb2RpZnlFeHBvcnQpO1xuICAgICAgICBITS5ob29rKCdNb2RlbEZvcm0uTW9kaWZ5SW1wb3J0JywgdGhpcy5faG9va01vZGlmeUltcG9ydCk7XG4gICAgICAgIEhNLmhvb2soJ0V1Z2xlbmEuM2RWaWV3JywgdGhpcy5faG9vazNkVmlldylcblxuICAgICAgfVxuICAgIH1cblxuICAgIHJ1bigpIHtcbiAgICAgIGlmICh0aGlzLnRhYikgR2xvYmFscy5nZXQoJ0xheW91dCcpLmdldFBhbmVsKCdyZXN1bHQnKS5hZGRDb250ZW50KHRoaXMudGFiLnZpZXcoKSlcbiAgICB9XG5cbiAgICBfb25QaGFzZUNoYW5nZShldnQpIHtcbiAgICAgIGlmIChldnQuZGF0YS5waGFzZSA9PSBcImxvZ2luXCIgfHwgZXZ0LmRhdGEucGhhc2UgPT0gXCJsb2dpbl9hdHRlbXB0ZWRcIikge1xuICAgICAgICB0aGlzLnRhYi5oaWRlKCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgX29uRXhwZXJpbWVudENvdW50Q2hhbmdlKGV2dCkge1xuICAgICAgaWYgKGV2dC5kYXRhLmNvdW50ICYmICFldnQuZGF0YS5vbGQpIHtcbiAgICAgICAgdGhpcy50YWIuc2hvdygpO1xuICAgICAgfSBlbHNlIGlmICghZXZ0LmRhdGEuY291bnQpIHtcbiAgICAgICAgdGhpcy50YWIuaGlkZSgpO1xuICAgICAgfVxuICAgIH1cblxuICAgIF9ob29rTW9kZWxGaWVsZHMoZmllbGRzLCBtZXRhKSB7XG4gICAgICBpZiAobWV0YS50eXBlID09IFwiYmxvY2tseVwiKSB7XG4gICAgICAgIHZhciBib2R5Q29uZmlncyA9IEFycmF5LmFwcGx5KG51bGwsIHtsZW5ndGg6T2JqZWN0LmtleXMoZGVmYXVsdENvbmZpZ3MpLmxlbmd0aH0pLm1hcCgobnVtYmVyLGluZCkgPT4gJ3NlbnNvckNvbmZpZ18nICsgKGluZCsxKSk7XG4gICAgICAgIC8vIEZpbHRlciBvdXQgdGhlIG9wdGlvbnMgdGhhdCBhcmUgbm90IGluIGFsbG93ZWRDb25maWdzXG4gICAgICAgIGlmIChtZXRhLmNvbmZpZy5hbGxvd2VkQ29uZmlncy5sZW5ndGgpIHtcbiAgICAgICAgICBmb3IgKGxldCBpZHggPSBib2R5Q29uZmlncy5sZW5ndGggLSAxOyBpZHggPj0gMDsgaWR4LS0pIHtcbiAgICAgICAgICAgIGlmICgobWV0YS5jb25maWcuYWxsb3dlZENvbmZpZ3MuaW5kZXhPZihkZWZhdWx0Q29uZmlnc1tib2R5Q29uZmlnc1tpZHhdXS5pZC50b0xvd2VyQ2FzZSgpKSA9PSAtMSkpIHtcbiAgICAgICAgICAgICAgYm9keUNvbmZpZ3Muc3BsaWNlKGlkeCwxKVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICB0aGlzLmJvZHlDb25maWdPcHRpb25zID0ge31cbiAgICAgICAgYm9keUNvbmZpZ3MubWFwKGJvZHljb25maWcgPT4gdGhpcy5ib2R5Q29uZmlnT3B0aW9uc1tib2R5Y29uZmlnXSA9IGRlZmF1bHRDb25maWdzW2JvZHljb25maWddWydpZCddKVxuICAgICAgICBmaWVsZHMgPSBmaWVsZHMuY29uY2F0KFtTZWxlY3RGaWVsZC5jcmVhdGUoe1xuICAgICAgICAgICAgaWQ6IFwiYm9keUNvbmZpZ3VyYXRpb25OYW1lXCIsXG4gICAgICAgICAgICBpbnZlcnNlX29yZGVyOiB0cnVlLFxuICAgICAgICAgICAgY29sb3I6IG1ldGEuY29uZmlnLmJvZHlDb25maWd1cmF0aW9uLmNvbG9yID8gbWV0YS5jb25maWcuYm9keUNvbmZpZ3VyYXRpb24uY29sb3IgOiBudWxsLFxuICAgICAgICAgICAgbGFiZWw6IG1ldGEuY29uZmlnLmJvZHlDb25maWd1cmF0aW9uLmxhYmVsLFxuICAgICAgICAgICAgdmFsdWU6IG1ldGEuY29uZmlnLmJvZHlDb25maWd1cmF0aW9uLmluaXRpYWxWYWx1ZSxcbiAgICAgICAgICAgIG1pbl93aWR0aDogbWV0YS5jb25maWcuYm9keUNvbmZpZ3VyYXRpb24ubWluX3dpZHRoLFxuICAgICAgICAgICAgY2xhc3NlczogW10sXG4gICAgICAgICAgICBvcHRpb25zOiB0aGlzLmJvZHlDb25maWdPcHRpb25zXG4gICAgICAgICAgfSksIFN5bVNlbGVjdEZpZWxkLmNyZWF0ZSh7XG4gICAgICAgICAgICBpZDogJ3YnLFxuICAgICAgICAgICAgaW52ZXJzZV9vcmRlcjogdHJ1ZSxcbiAgICAgICAgICAgIGluY2x1ZGVWYXJpYXRpb246IG1ldGEuY29uZmlnLnZhcmlhdGlvbiA/IHRydWUgOiBmYWxzZSxcbiAgICAgICAgICAgIGxhYmVsOiBtZXRhLmNvbmZpZy52LmxhYmVsLFxuICAgICAgICAgICAgY29sb3I6IG1ldGEuY29uZmlnLnYuY29sb3IgPyBtZXRhLmNvbmZpZy52LmNvbG9yIDogbnVsbCxcbiAgICAgICAgICAgIHZhbHVlOiBtZXRhLmNvbmZpZy52LmluaXRpYWxWYWx1ZSxcbiAgICAgICAgICAgIG1heFZhbHVlOiBtZXRhLmNvbmZpZy52Lm1heFZhbHVlLFxuICAgICAgICAgICAgY2xhc3NlczogW10sXG4gICAgICAgICAgICBvcHRpb25zOiBtZXRhLmNvbmZpZy52Lm9wdGlvbnNcbiAgICAgICAgICB9KSwgU3ltU2VsZWN0RmllbGQuY3JlYXRlKHtcbiAgICAgICAgICAgIGlkOiAnaycsXG4gICAgICAgICAgICBpbnZlcnNlX29yZGVyOiB0cnVlLFxuICAgICAgICAgICAgaW5jbHVkZVZhcmlhdGlvbjogbWV0YS5jb25maWcudmFyaWF0aW9uID8gdHJ1ZSA6IGZhbHNlLFxuICAgICAgICAgICAgbGFiZWw6IG1ldGEuY29uZmlnLksubGFiZWwsXG4gICAgICAgICAgICBjb2xvcjogbWV0YS5jb25maWcuSy5jb2xvciA/IG1ldGEuY29uZmlnLksuY29sb3IgOiBudWxsLFxuICAgICAgICAgICAgdmFsdWU6IG1ldGEuY29uZmlnLksuaW5pdGlhbFZhbHVlLFxuICAgICAgICAgICAgbWF4VmFsdWU6IG1ldGEuY29uZmlnLksubWF4VmFsdWUsXG4gICAgICAgICAgICBjbGFzc2VzOiBbXSxcbiAgICAgICAgICAgIG9wdGlvbnM6IG1ldGEuY29uZmlnLksub3B0aW9uc1xuICAgICAgICAgIH0pXG4gICAgICAgIF0pXG5cbiAgICAgICAgLy8gQWRkIGVpdGhlciByb2xsIG9yIG1vdGlvbiB0eXBlIG9wdGlvblxuICAgICAgICBpZiAobWV0YS5jb25maWcub21lZ2EpIHtcbiAgICAgICAgICBmaWVsZHMuc3BsaWNlKDMsMCxTeW1TZWxlY3RGaWVsZC5jcmVhdGUoe1xuICAgICAgICAgICAgaWQ6ICdvbWVnYScsXG4gICAgICAgICAgICBpbnZlcnNlX29yZGVyOiB0cnVlLFxuICAgICAgICAgICAgaW5jbHVkZVZhcmlhdGlvbjogbWV0YS5jb25maWcudmFyaWF0aW9uID8gdHJ1ZSA6IGZhbHNlLFxuICAgICAgICAgICAgbGFiZWw6IG1ldGEuY29uZmlnLm9tZWdhLmxhYmVsLFxuICAgICAgICAgICAgY29sb3I6IG1ldGEuY29uZmlnLm9tZWdhLmNvbG9yID8gbWV0YS5jb25maWcub21lZ2EuY29sb3IgOiBudWxsLFxuICAgICAgICAgICAgdmFsdWU6IG1ldGEuY29uZmlnLm9tZWdhLmluaXRpYWxWYWx1ZSxcbiAgICAgICAgICAgIG1heFZhbHVlOiBtZXRhLmNvbmZpZy5vbWVnYS5tYXhWYWx1ZSxcbiAgICAgICAgICAgIGNsYXNzZXM6IFtdLFxuICAgICAgICAgICAgb3B0aW9uczogbWV0YS5jb25maWcub21lZ2Eub3B0aW9uc1xuICAgICAgICAgIH0pKVxuICAgICAgICB9IGVsc2UgaWYgKG1ldGEuY29uZmlnLm1vdGlvbikge1xuICAgICAgICAgIGZpZWxkcy5zcGxpY2UoMywwLFN5bVNlbGVjdEZpZWxkLmNyZWF0ZSh7XG4gICAgICAgICAgICBpZDogJ21vdGlvbicsXG4gICAgICAgICAgICBpbnZlcnNlX29yZGVyOiB0cnVlLFxuICAgICAgICAgICAgaW5jbHVkZVZhcmlhdGlvbjogZmFsc2UsXG4gICAgICAgICAgICBsYWJlbDogbWV0YS5jb25maWcubW90aW9uLmxhYmVsLFxuICAgICAgICAgICAgY29sb3I6IG1ldGEuY29uZmlnLm1vdGlvbi5jb2xvciA/IG1ldGEuY29uZmlnLm1vdGlvbi5jb2xvciA6IG51bGwsXG4gICAgICAgICAgICB2YWx1ZTogbWV0YS5jb25maWcubW90aW9uLmluaXRpYWxWYWx1ZSxcbiAgICAgICAgICAgIG1heFZhbHVlOiBtZXRhLmNvbmZpZy5tb3Rpb24ubWF4VmFsdWUsXG4gICAgICAgICAgICBjbGFzc2VzOiBbXSxcbiAgICAgICAgICAgIG9wdGlvbnM6IG1ldGEuY29uZmlnLm1vdGlvbi5vcHRpb25zXG4gICAgICAgICAgfSkpXG4gICAgICAgIH1cblxuICAgICAgICAvLyBBZGQgb3BhY2l0eVxuICAgICAgICBpZiAobWV0YS5jb25maWcub3BhY2l0eSkge1xuICAgICAgICAgIGZpZWxkcy5zcGxpY2UoMSwwLFN5bVNlbGVjdEZpZWxkLmNyZWF0ZSh7XG4gICAgICAgICAgICBpZDogJ29wYWNpdHknLFxuICAgICAgICAgICAgaW52ZXJzZV9vcmRlcjogdHJ1ZSxcbiAgICAgICAgICAgIGluY2x1ZGVWYXJpYXRpb246IG1ldGEuY29uZmlnLnZhcmlhdGlvbiA/IHRydWUgOiBmYWxzZSxcbiAgICAgICAgICAgIGxhYmVsOiBtZXRhLmNvbmZpZy5vcGFjaXR5LmxhYmVsLFxuICAgICAgICAgICAgY29sb3I6IG1ldGEuY29uZmlnLm9wYWNpdHkuY29sb3IgPyBtZXRhLmNvbmZpZy5vcGFjaXR5LmNvbG9yIDogbnVsbCxcbiAgICAgICAgICAgIHZhbHVlOiBtZXRhLmNvbmZpZy5vcGFjaXR5LmluaXRpYWxWYWx1ZSxcbiAgICAgICAgICAgIG1heFZhbHVlOiBtZXRhLmNvbmZpZy5vcGFjaXR5Lm1heFZhbHVlLFxuICAgICAgICAgICAgY2xhc3NlczogW10sXG4gICAgICAgICAgICBvcHRpb25zOiBtZXRhLmNvbmZpZy5vcGFjaXR5Lm9wdGlvbnNcbiAgICAgICAgICB9KSlcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIEFkZCB2YXJpYXRpb25cbiAgICAgICAgaWYgKG1ldGEuY29uZmlnLnZhcmlhdGlvbikge1xuICAgICAgICAgIGZpZWxkcy5wdXNoKFN5bVNlbGVjdEZpZWxkLmNyZWF0ZSh7XG4gICAgICAgICAgICBpZDogJ3ZhcmlhdGlvbicsXG4gICAgICAgICAgICBpbmNsdWRlVmFyaWF0aW9uOiBmYWxzZSxcbiAgICAgICAgICAgIGxhYmVsOiBtZXRhLmNvbmZpZy52YXJpYXRpb24ubGFiZWwsXG4gICAgICAgICAgICBjb2xvcjogbWV0YS5jb25maWcudmFyaWF0aW9uLmNvbG9yID8gbWV0YS5jb25maWcudmFyaWF0aW9uLmNvbG9yIDogbnVsbCxcbiAgICAgICAgICAgIHZhbHVlOiBtZXRhLmNvbmZpZy52YXJpYXRpb24uaW5pdGlhbFZhbHVlLFxuICAgICAgICAgICAgbWF4VmFsdWU6IG1ldGEuY29uZmlnLnZhcmlhdGlvbi5tYXhWYWx1ZSxcbiAgICAgICAgICAgIGNsYXNzZXM6IFtdLFxuICAgICAgICAgICAgb3B0aW9uczogbWV0YS5jb25maWcudmFyaWF0aW9uLm9wdGlvbnNcbiAgICAgICAgICB9KSlcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmV0dXJuIGZpZWxkcztcbiAgICB9XG5cbiAgICBfaG9va01vZGlmeUV4cG9ydChleHAsIG1ldGEpIHtcblxuICAgICAgaWYgKG1ldGEudHlwZSA9PSBcImJsb2NrbHlcIikge1xuICAgICAgICBbJ2snLCAndicsICdvbWVnYScsJ29wYWNpdHknLCd2YXJpYXRpb24nLCdtb3Rpb24nXS5mb3JFYWNoKChrZXkpID0+IHtcbiAgICAgICAgICBpZiAoT2JqZWN0LmtleXMoZXhwKS5pbmRleE9mKGtleSkgPi0xKSB7XG4gICAgICAgICAgICBleHBbYCR7a2V5fV9udW1lcmljYF0gPSBleHBba2V5XS5udW1lcmljVmFsdWU7XG4gICAgICAgICAgICBleHBbYCR7a2V5fV92YXJpYXRpb25gXSA9IGV4cFtrZXldLnZhcmlhdGlvbjtcbiAgICAgICAgICAgIGV4cFtrZXldID0gZXhwW2tleV0ucXVhbGl0YXRpdmVWYWx1ZTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pXG4gICAgICB9XG5cbiAgICAgIHJldHVybiBleHBcbiAgICB9XG5cbiAgICBfaG9va01vZGlmeUltcG9ydChkYXRhLCBtZXRhKSB7XG4gICAgICBpZiAobWV0YS50eXBlID09IFwiYmxvY2tseVwiKSB7XG4gICAgICAgIFsnaycsICd2JywgJ29tZWdhJywnb3BhY2l0eScsJ3ZhcmlhdGlvbicsJ21vdGlvbiddLmZvckVhY2goKGtleSkgPT4ge1xuICAgICAgICAgIGlmIChPYmplY3Qua2V5cyhkYXRhKS5pbmRleE9mKGtleSkgPiAtMSkge1xuICAgICAgICAgICAgZGF0YVtrZXldID0ge1xuICAgICAgICAgICAgICBxdWFsaXRhdGl2ZVZhbHVlOiBkYXRhW2tleV0sXG4gICAgICAgICAgICAgIG51bWVyaWNWYWx1ZTogZGF0YVtgJHtrZXl9X251bWVyaWNgXSxcbiAgICAgICAgICAgICAgdmFyaWF0aW9uOiBkYXRhW2Ake2tleX1fdmFyaWF0aW9uYF1cbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICBkZWxldGUgZGF0YVtgJHtrZXl9X251bWVyaWNgXTtcbiAgICAgICAgICAgIGRlbGV0ZSBkYXRhW2Ake2tleX1fdmFyaWF0aW9uYF07XG4gICAgICAgICAgfVxuICAgICAgICB9KVxuICAgICAgfVxuICAgICAgcmV0dXJuIGRhdGE7XG4gICAgfVxuXG4gICAgX2hvb2szZFZpZXcodmlldywgbWV0YSkge1xuICAgICAgaWYgKG1ldGEuY29uZmlnLm1vZGVsVHlwZSA9PSBcImJsb2NrbHlcIikge1xuICAgICAgICByZXR1cm4gKG5ldyBNb2RlbFZpZXcoeyBiYXNlQ29sb3I6IG1ldGEuY29sb3IgfSkpLnZpZXcoKVxuICAgICAgfVxuICAgICAgcmV0dXJuIHZpZXc7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIE1vZGVsaW5nRGF0YU1vZHVsZTtcbn0pXG4iXX0=
