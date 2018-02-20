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
            classes: [],
            options: this.bodyConfigOptions
          }), SymSelectField.create({
            id: 'opacity',
            inverse_order: true,
            includeVariation: meta.config.variation ? true : false,
            label: meta.config.opacity.label,
            color: meta.config.opacity.color ? meta.config.opacity.color : null,
            value: meta.config.opacity.initialValue,
            maxValue: meta.config.opacity.maxValue,
            classes: [],
            options: meta.config.opacity.options
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
            id: 'omega',
            inverse_order: true,
            includeVariation: meta.config.variation ? true : false,
            label: meta.config.omega.label,
            color: meta.config.omega.color ? meta.config.omega.color : null,
            value: meta.config.omega.initialValue,
            maxValue: meta.config.omega.maxValue,
            classes: [],
            options: meta.config.omega.options
          })]);

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
          ['k', 'v', 'omega', 'opacity', 'variation'].forEach(function (key) {
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
          ['k', 'v', 'omega', 'opacity', 'variation'].forEach(function (key) {
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9ldWdsZW5hL21vZGVsX2Jsb2NrbHkvbW9kdWxlLmpzIl0sIm5hbWVzIjpbImRlZmluZSIsInJlcXVpcmUiLCJVdGlscyIsIkdsb2JhbHMiLCJITSIsIk1vZHVsZSIsIk1vZGVsaW5nRGF0YVRhYiIsIlNlbGVjdEZpZWxkIiwiU3ltU2VsZWN0RmllbGQiLCJNb2RlbFZpZXciLCJkZWZhdWx0Q29uZmlncyIsIk1vZGVsaW5nRGF0YU1vZHVsZSIsImdldCIsImJpbmRNZXRob2RzIiwidGFiIiwiYWRkRXZlbnRMaXN0ZW5lciIsIl9vblBoYXNlQ2hhbmdlIiwiX29uRXhwZXJpbWVudENvdW50Q2hhbmdlIiwiaG9vayIsIl9ob29rTW9kZWxGaWVsZHMiLCJfaG9va01vZGlmeUV4cG9ydCIsIl9ob29rTW9kaWZ5SW1wb3J0IiwiX2hvb2szZFZpZXciLCJnZXRQYW5lbCIsImFkZENvbnRlbnQiLCJ2aWV3IiwiZXZ0IiwiZGF0YSIsInBoYXNlIiwiaGlkZSIsImNvdW50Iiwib2xkIiwic2hvdyIsImZpZWxkcyIsIm1ldGEiLCJ0eXBlIiwiYm9keUNvbmZpZ3MiLCJBcnJheSIsImFwcGx5IiwibGVuZ3RoIiwiT2JqZWN0Iiwia2V5cyIsIm1hcCIsIm51bWJlciIsImluZCIsImNvbmZpZyIsImFsbG93ZWRDb25maWdzIiwiaWR4IiwiaW5kZXhPZiIsImlkIiwidG9Mb3dlckNhc2UiLCJzcGxpY2UiLCJib2R5Q29uZmlnT3B0aW9ucyIsImJvZHljb25maWciLCJjb25jYXQiLCJjcmVhdGUiLCJpbnZlcnNlX29yZGVyIiwiY29sb3IiLCJib2R5Q29uZmlndXJhdGlvbiIsImxhYmVsIiwidmFsdWUiLCJpbml0aWFsVmFsdWUiLCJjbGFzc2VzIiwib3B0aW9ucyIsImluY2x1ZGVWYXJpYXRpb24iLCJ2YXJpYXRpb24iLCJvcGFjaXR5IiwibWF4VmFsdWUiLCJLIiwidiIsIm9tZWdhIiwicHVzaCIsImV4cCIsImZvckVhY2giLCJrZXkiLCJudW1lcmljVmFsdWUi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L21vZHVsZS5qcyIsInNvdXJjZXNDb250ZW50IjpbImRlZmluZSgocmVxdWlyZSkgPT4ge1xuICBjb25zdCBVdGlscyA9IHJlcXVpcmUoJ2NvcmUvdXRpbC91dGlscycpLFxuICAgIEdsb2JhbHMgPSByZXF1aXJlKCdjb3JlL21vZGVsL2dsb2JhbHMnKSxcbiAgICBITSA9IHJlcXVpcmUoJ2NvcmUvZXZlbnQvaG9va19tYW5hZ2VyJyk7XG5cbiAgY29uc3QgTW9kdWxlID0gcmVxdWlyZSgnY29yZS9hcHAvbW9kdWxlJyksXG4gICAgTW9kZWxpbmdEYXRhVGFiID0gcmVxdWlyZSgnLi9ibG9ja2x5dGFiL3RhYicpLFxuICAgIC8vU3ltU2xpZGVyRmllbGQgPSByZXF1aXJlKCdjb3JlL2NvbXBvbmVudC9zeW1zbGlkZXJmaWVsZC9maWVsZCcpLFxuICAgIC8vU2xpZGVyRmllbGQgPSByZXF1aXJlKCdjb3JlL2NvbXBvbmVudC9zbGlkZXJmaWVsZC9maWVsZCcpLFxuICAgIFNlbGVjdEZpZWxkID0gcmVxdWlyZSgnY29yZS9jb21wb25lbnQvc2VsZWN0ZmllbGQvZmllbGQnKSxcbiAgICBTeW1TZWxlY3RGaWVsZCA9IHJlcXVpcmUoJ2NvcmUvY29tcG9uZW50L3N5bXNlbGVjdGZpZWxkL2ZpZWxkJyksXG4gICAgTW9kZWxWaWV3ID0gcmVxdWlyZSgnLi90aHJlZXZpZXcnKTtcblxuICBjb25zdCBkZWZhdWx0Q29uZmlncyA9IHJlcXVpcmUoJy4vYm9keUNvbmZpZ3VyYXRpb25zL2JvZHljb25maWdzL2xpc3RvZmNvbmZpZ3MnKVxuXG5cbiAgY2xhc3MgTW9kZWxpbmdEYXRhTW9kdWxlIGV4dGVuZHMgTW9kdWxlIHtcbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgIHN1cGVyKCk7XG4gICAgICBpZiAoR2xvYmFscy5nZXQoJ0FwcENvbmZpZy5tb2RlbGluZycpKSB7XG4gICAgICAgIFV0aWxzLmJpbmRNZXRob2RzKHRoaXMsIFsnX29uUGhhc2VDaGFuZ2UnLCAnX29uRXhwZXJpbWVudENvdW50Q2hhbmdlJyxcbiAgICAgICdfaG9va01vZGVsRmllbGRzJywgJ19ob29rTW9kaWZ5RXhwb3J0JywgJ19ob29rTW9kaWZ5SW1wb3J0JywgJ19ob29rM2RWaWV3J10pXG5cbiAgICAgICAgdGhpcy50YWIgPSBuZXcgTW9kZWxpbmdEYXRhVGFiKCk7XG5cbiAgICAgICAgR2xvYmFscy5nZXQoJ1JlbGF5JykuYWRkRXZlbnRMaXN0ZW5lcignQXBwUGhhc2UuQ2hhbmdlJywgdGhpcy5fb25QaGFzZUNoYW5nZSlcbiAgICAgICAgR2xvYmFscy5nZXQoJ1JlbGF5JykuYWRkRXZlbnRMaXN0ZW5lcignRXhwZXJpbWVudENvdW50LkNoYW5nZScsIHRoaXMuX29uRXhwZXJpbWVudENvdW50Q2hhbmdlKVxuXG4gICAgICAgIEhNLmhvb2soJ01vZGVsRm9ybS5GaWVsZHMnLCB0aGlzLl9ob29rTW9kZWxGaWVsZHMpO1xuICAgICAgICBITS5ob29rKCdNb2RlbEZvcm0uTW9kaWZ5RXhwb3J0JywgdGhpcy5faG9va01vZGlmeUV4cG9ydCk7XG4gICAgICAgIEhNLmhvb2soJ01vZGVsRm9ybS5Nb2RpZnlJbXBvcnQnLCB0aGlzLl9ob29rTW9kaWZ5SW1wb3J0KTtcbiAgICAgICAgSE0uaG9vaygnRXVnbGVuYS4zZFZpZXcnLCB0aGlzLl9ob29rM2RWaWV3KVxuXG4gICAgICB9XG4gICAgfVxuXG4gICAgcnVuKCkge1xuICAgICAgaWYgKHRoaXMudGFiKSBHbG9iYWxzLmdldCgnTGF5b3V0JykuZ2V0UGFuZWwoJ3Jlc3VsdCcpLmFkZENvbnRlbnQodGhpcy50YWIudmlldygpKVxuICAgIH1cblxuICAgIF9vblBoYXNlQ2hhbmdlKGV2dCkge1xuICAgICAgaWYgKGV2dC5kYXRhLnBoYXNlID09IFwibG9naW5cIiB8fCBldnQuZGF0YS5waGFzZSA9PSBcImxvZ2luX2F0dGVtcHRlZFwiKSB7XG4gICAgICAgIHRoaXMudGFiLmhpZGUoKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBfb25FeHBlcmltZW50Q291bnRDaGFuZ2UoZXZ0KSB7XG4gICAgICBpZiAoZXZ0LmRhdGEuY291bnQgJiYgIWV2dC5kYXRhLm9sZCkge1xuICAgICAgICB0aGlzLnRhYi5zaG93KCk7XG4gICAgICB9IGVsc2UgaWYgKCFldnQuZGF0YS5jb3VudCkge1xuICAgICAgICB0aGlzLnRhYi5oaWRlKCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgX2hvb2tNb2RlbEZpZWxkcyhmaWVsZHMsIG1ldGEpIHtcbiAgICAgIGlmIChtZXRhLnR5cGUgPT0gXCJibG9ja2x5XCIpIHtcbiAgICAgICAgdmFyIGJvZHlDb25maWdzID0gQXJyYXkuYXBwbHkobnVsbCwge2xlbmd0aDpPYmplY3Qua2V5cyhkZWZhdWx0Q29uZmlncykubGVuZ3RofSkubWFwKChudW1iZXIsaW5kKSA9PiAnc2Vuc29yQ29uZmlnXycgKyAoaW5kKzEpKTtcbiAgICAgICAgLy8gRmlsdGVyIG91dCB0aGUgb3B0aW9ucyB0aGF0IGFyZSBub3QgaW4gYWxsb3dlZENvbmZpZ3NcbiAgICAgICAgaWYgKG1ldGEuY29uZmlnLmFsbG93ZWRDb25maWdzLmxlbmd0aCkge1xuICAgICAgICAgIGZvciAobGV0IGlkeCA9IGJvZHlDb25maWdzLmxlbmd0aCAtIDE7IGlkeCA+PSAwOyBpZHgtLSkge1xuICAgICAgICAgICAgaWYgKChtZXRhLmNvbmZpZy5hbGxvd2VkQ29uZmlncy5pbmRleE9mKGRlZmF1bHRDb25maWdzW2JvZHlDb25maWdzW2lkeF1dLmlkLnRvTG93ZXJDYXNlKCkpID09IC0xKSkge1xuICAgICAgICAgICAgICBib2R5Q29uZmlncy5zcGxpY2UoaWR4LDEpXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHRoaXMuYm9keUNvbmZpZ09wdGlvbnMgPSB7fVxuICAgICAgICBib2R5Q29uZmlncy5tYXAoYm9keWNvbmZpZyA9PiB0aGlzLmJvZHlDb25maWdPcHRpb25zW2JvZHljb25maWddID0gZGVmYXVsdENvbmZpZ3NbYm9keWNvbmZpZ11bJ2lkJ10pXG4gICAgICAgIGZpZWxkcyA9IGZpZWxkcy5jb25jYXQoW1NlbGVjdEZpZWxkLmNyZWF0ZSh7XG4gICAgICAgICAgICBpZDogXCJib2R5Q29uZmlndXJhdGlvbk5hbWVcIixcbiAgICAgICAgICAgIGludmVyc2Vfb3JkZXI6IHRydWUsXG4gICAgICAgICAgICBjb2xvcjogbWV0YS5jb25maWcuYm9keUNvbmZpZ3VyYXRpb24uY29sb3IgPyBtZXRhLmNvbmZpZy5ib2R5Q29uZmlndXJhdGlvbi5jb2xvciA6IG51bGwsXG4gICAgICAgICAgICBsYWJlbDogbWV0YS5jb25maWcuYm9keUNvbmZpZ3VyYXRpb24ubGFiZWwsXG4gICAgICAgICAgICB2YWx1ZTogbWV0YS5jb25maWcuYm9keUNvbmZpZ3VyYXRpb24uaW5pdGlhbFZhbHVlLFxuICAgICAgICAgICAgY2xhc3NlczogW10sXG4gICAgICAgICAgICBvcHRpb25zOiB0aGlzLmJvZHlDb25maWdPcHRpb25zXG4gICAgICAgICAgfSksIFN5bVNlbGVjdEZpZWxkLmNyZWF0ZSh7XG4gICAgICAgICAgICBpZDogJ29wYWNpdHknLFxuICAgICAgICAgICAgaW52ZXJzZV9vcmRlcjogdHJ1ZSxcbiAgICAgICAgICAgIGluY2x1ZGVWYXJpYXRpb246IG1ldGEuY29uZmlnLnZhcmlhdGlvbiA/IHRydWUgOiBmYWxzZSxcbiAgICAgICAgICAgIGxhYmVsOiBtZXRhLmNvbmZpZy5vcGFjaXR5LmxhYmVsLFxuICAgICAgICAgICAgY29sb3I6IG1ldGEuY29uZmlnLm9wYWNpdHkuY29sb3IgPyBtZXRhLmNvbmZpZy5vcGFjaXR5LmNvbG9yIDogbnVsbCxcbiAgICAgICAgICAgIHZhbHVlOiBtZXRhLmNvbmZpZy5vcGFjaXR5LmluaXRpYWxWYWx1ZSxcbiAgICAgICAgICAgIG1heFZhbHVlOiBtZXRhLmNvbmZpZy5vcGFjaXR5Lm1heFZhbHVlLFxuICAgICAgICAgICAgY2xhc3NlczogW10sXG4gICAgICAgICAgICBvcHRpb25zOiBtZXRhLmNvbmZpZy5vcGFjaXR5Lm9wdGlvbnNcbiAgICAgICAgICB9KSwgU3ltU2VsZWN0RmllbGQuY3JlYXRlKHtcbiAgICAgICAgICAgIGlkOiAnaycsXG4gICAgICAgICAgICBpbnZlcnNlX29yZGVyOiB0cnVlLFxuICAgICAgICAgICAgaW5jbHVkZVZhcmlhdGlvbjogbWV0YS5jb25maWcudmFyaWF0aW9uID8gdHJ1ZSA6IGZhbHNlLFxuICAgICAgICAgICAgbGFiZWw6IG1ldGEuY29uZmlnLksubGFiZWwsXG4gICAgICAgICAgICBjb2xvcjogbWV0YS5jb25maWcuSy5jb2xvciA/IG1ldGEuY29uZmlnLksuY29sb3IgOiBudWxsLFxuICAgICAgICAgICAgdmFsdWU6IG1ldGEuY29uZmlnLksuaW5pdGlhbFZhbHVlLFxuICAgICAgICAgICAgbWF4VmFsdWU6IG1ldGEuY29uZmlnLksubWF4VmFsdWUsXG4gICAgICAgICAgICBjbGFzc2VzOiBbXSxcbiAgICAgICAgICAgIG9wdGlvbnM6IG1ldGEuY29uZmlnLksub3B0aW9uc1xuICAgICAgICAgIH0pLCBTeW1TZWxlY3RGaWVsZC5jcmVhdGUoe1xuICAgICAgICAgICAgaWQ6ICd2JyxcbiAgICAgICAgICAgIGludmVyc2Vfb3JkZXI6IHRydWUsXG4gICAgICAgICAgICBpbmNsdWRlVmFyaWF0aW9uOiBtZXRhLmNvbmZpZy52YXJpYXRpb24gPyB0cnVlIDogZmFsc2UsXG4gICAgICAgICAgICBsYWJlbDogbWV0YS5jb25maWcudi5sYWJlbCxcbiAgICAgICAgICAgIGNvbG9yOiBtZXRhLmNvbmZpZy52LmNvbG9yID8gbWV0YS5jb25maWcudi5jb2xvciA6IG51bGwsXG4gICAgICAgICAgICB2YWx1ZTogbWV0YS5jb25maWcudi5pbml0aWFsVmFsdWUsXG4gICAgICAgICAgICBtYXhWYWx1ZTogbWV0YS5jb25maWcudi5tYXhWYWx1ZSxcbiAgICAgICAgICAgIGNsYXNzZXM6IFtdLFxuICAgICAgICAgICAgb3B0aW9uczogbWV0YS5jb25maWcudi5vcHRpb25zXG4gICAgICAgICAgfSksIFN5bVNlbGVjdEZpZWxkLmNyZWF0ZSh7XG4gICAgICAgICAgICBpZDogJ29tZWdhJyxcbiAgICAgICAgICAgIGludmVyc2Vfb3JkZXI6IHRydWUsXG4gICAgICAgICAgICBpbmNsdWRlVmFyaWF0aW9uOiBtZXRhLmNvbmZpZy52YXJpYXRpb24gPyB0cnVlIDogZmFsc2UsXG4gICAgICAgICAgICBsYWJlbDogbWV0YS5jb25maWcub21lZ2EubGFiZWwsXG4gICAgICAgICAgICBjb2xvcjogbWV0YS5jb25maWcub21lZ2EuY29sb3IgPyBtZXRhLmNvbmZpZy5vbWVnYS5jb2xvciA6IG51bGwsXG4gICAgICAgICAgICB2YWx1ZTogbWV0YS5jb25maWcub21lZ2EuaW5pdGlhbFZhbHVlLFxuICAgICAgICAgICAgbWF4VmFsdWU6IG1ldGEuY29uZmlnLm9tZWdhLm1heFZhbHVlLFxuICAgICAgICAgICAgY2xhc3NlczogW10sXG4gICAgICAgICAgICBvcHRpb25zOiBtZXRhLmNvbmZpZy5vbWVnYS5vcHRpb25zXG4gICAgICAgICAgfSlcbiAgICAgICAgXSlcblxuICAgICAgICBpZiAobWV0YS5jb25maWcudmFyaWF0aW9uKSB7XG4gICAgICAgICAgZmllbGRzLnB1c2goU3ltU2VsZWN0RmllbGQuY3JlYXRlKHtcbiAgICAgICAgICAgIGlkOiAndmFyaWF0aW9uJyxcbiAgICAgICAgICAgIGluY2x1ZGVWYXJpYXRpb246IGZhbHNlLFxuICAgICAgICAgICAgbGFiZWw6IG1ldGEuY29uZmlnLnZhcmlhdGlvbi5sYWJlbCxcbiAgICAgICAgICAgIGNvbG9yOiBtZXRhLmNvbmZpZy52YXJpYXRpb24uY29sb3IgPyBtZXRhLmNvbmZpZy52YXJpYXRpb24uY29sb3IgOiBudWxsLFxuICAgICAgICAgICAgdmFsdWU6IG1ldGEuY29uZmlnLnZhcmlhdGlvbi5pbml0aWFsVmFsdWUsXG4gICAgICAgICAgICBtYXhWYWx1ZTogbWV0YS5jb25maWcudmFyaWF0aW9uLm1heFZhbHVlLFxuICAgICAgICAgICAgY2xhc3NlczogW10sXG4gICAgICAgICAgICBvcHRpb25zOiBtZXRhLmNvbmZpZy52YXJpYXRpb24ub3B0aW9uc1xuICAgICAgICAgIH0pKVxuICAgICAgICB9XG4gICAgICB9XG4gICAgICByZXR1cm4gZmllbGRzO1xuICAgIH1cblxuICAgIF9ob29rTW9kaWZ5RXhwb3J0KGV4cCwgbWV0YSkge1xuXG4gICAgICBpZiAobWV0YS50eXBlID09IFwiYmxvY2tseVwiKSB7XG4gICAgICAgIFsnaycsICd2JywgJ29tZWdhJywnb3BhY2l0eScsJ3ZhcmlhdGlvbiddLmZvckVhY2goKGtleSkgPT4ge1xuICAgICAgICAgIGlmIChPYmplY3Qua2V5cyhleHApLmluZGV4T2Yoa2V5KSA+LTEpIHtcbiAgICAgICAgICAgIGV4cFtgJHtrZXl9X251bWVyaWNgXSA9IGV4cFtrZXldLm51bWVyaWNWYWx1ZTtcbiAgICAgICAgICAgIGV4cFtgJHtrZXl9X3ZhcmlhdGlvbmBdID0gZXhwW2tleV0udmFyaWF0aW9uO1xuICAgICAgICAgICAgZXhwW2tleV0gPSBleHBba2V5XS5xdWFsaXRhdGl2ZVZhbHVlO1xuICAgICAgICAgIH1cbiAgICAgICAgfSlcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIGV4cFxuICAgIH1cblxuICAgIF9ob29rTW9kaWZ5SW1wb3J0KGRhdGEsIG1ldGEpIHtcbiAgICAgIGlmIChtZXRhLnR5cGUgPT0gXCJibG9ja2x5XCIpIHtcbiAgICAgICAgWydrJywgJ3YnLCAnb21lZ2EnLCdvcGFjaXR5JywndmFyaWF0aW9uJ10uZm9yRWFjaCgoa2V5KSA9PiB7XG4gICAgICAgICAgaWYgKE9iamVjdC5rZXlzKGRhdGEpLmluZGV4T2Yoa2V5KSA+IC0xKSB7XG4gICAgICAgICAgICBkYXRhW2tleV0gPSB7XG4gICAgICAgICAgICAgIHF1YWxpdGF0aXZlVmFsdWU6IGRhdGFba2V5XSxcbiAgICAgICAgICAgICAgbnVtZXJpY1ZhbHVlOiBkYXRhW2Ake2tleX1fbnVtZXJpY2BdLFxuICAgICAgICAgICAgICB2YXJpYXRpb246IGRhdGFbYCR7a2V5fV92YXJpYXRpb25gXVxuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIGRlbGV0ZSBkYXRhW2Ake2tleX1fbnVtZXJpY2BdO1xuICAgICAgICAgICAgZGVsZXRlIGRhdGFbYCR7a2V5fV92YXJpYXRpb25gXTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pXG4gICAgICB9XG4gICAgICByZXR1cm4gZGF0YTtcbiAgICB9XG5cbiAgICBfaG9vazNkVmlldyh2aWV3LCBtZXRhKSB7XG4gICAgICBpZiAobWV0YS5jb25maWcubW9kZWxUeXBlID09IFwiYmxvY2tseVwiKSB7XG4gICAgICAgIHJldHVybiAobmV3IE1vZGVsVmlldyh7IGJhc2VDb2xvcjogbWV0YS5jb2xvciB9KSkudmlldygpXG4gICAgICB9XG4gICAgICByZXR1cm4gdmlldztcbiAgICB9XG4gIH1cblxuICByZXR1cm4gTW9kZWxpbmdEYXRhTW9kdWxlO1xufSlcbiJdfQ==
