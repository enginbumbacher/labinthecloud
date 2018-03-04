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
            description: meta.config.bodyConfiguration.description,
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
            description: meta.config.v.description,
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
            description: meta.config.K.description,
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
              description: meta.config.omega.description,
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
              description: meta.config.motion.description,
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
              description: meta.config.opacity.description,
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9ldWdsZW5hL21vZGVsX2Jsb2NrbHkvbW9kdWxlLmpzIl0sIm5hbWVzIjpbImRlZmluZSIsInJlcXVpcmUiLCJVdGlscyIsIkdsb2JhbHMiLCJITSIsIk1vZHVsZSIsIk1vZGVsaW5nRGF0YVRhYiIsIlNlbGVjdEZpZWxkIiwiU3ltU2VsZWN0RmllbGQiLCJNb2RlbFZpZXciLCJkZWZhdWx0Q29uZmlncyIsIk1vZGVsaW5nRGF0YU1vZHVsZSIsImdldCIsImJpbmRNZXRob2RzIiwibGVuZ3RoIiwidGFiIiwiYWRkRXZlbnRMaXN0ZW5lciIsIl9vblBoYXNlQ2hhbmdlIiwiX29uRXhwZXJpbWVudENvdW50Q2hhbmdlIiwiaG9vayIsIl9ob29rTW9kZWxGaWVsZHMiLCJfaG9va01vZGlmeUV4cG9ydCIsIl9ob29rTW9kaWZ5SW1wb3J0IiwiX2hvb2szZFZpZXciLCJnZXRQYW5lbCIsImFkZENvbnRlbnQiLCJ2aWV3IiwiZXZ0IiwiZGF0YSIsInBoYXNlIiwiaGlkZSIsImNvdW50Iiwib2xkIiwic2hvdyIsImZpZWxkcyIsIm1ldGEiLCJ0eXBlIiwiYm9keUNvbmZpZ3MiLCJBcnJheSIsImFwcGx5IiwiT2JqZWN0Iiwia2V5cyIsIm1hcCIsIm51bWJlciIsImluZCIsImNvbmZpZyIsImFsbG93ZWRDb25maWdzIiwiaWR4IiwiaW5kZXhPZiIsImlkIiwidG9Mb3dlckNhc2UiLCJzcGxpY2UiLCJib2R5Q29uZmlnT3B0aW9ucyIsImJvZHljb25maWciLCJjb25jYXQiLCJjcmVhdGUiLCJpbnZlcnNlX29yZGVyIiwiY29sb3IiLCJib2R5Q29uZmlndXJhdGlvbiIsImxhYmVsIiwidmFsdWUiLCJpbml0aWFsVmFsdWUiLCJtaW5fd2lkdGgiLCJkZXNjcmlwdGlvbiIsImNsYXNzZXMiLCJvcHRpb25zIiwiaW5jbHVkZVZhcmlhdGlvbiIsInZhcmlhdGlvbiIsInYiLCJtYXhWYWx1ZSIsIksiLCJvbWVnYSIsIm1vdGlvbiIsIm9wYWNpdHkiLCJwdXNoIiwiZXhwIiwiZm9yRWFjaCIsImtleSIsIm51bWVyaWNWYWx1ZSIsInF1YWxpdGF0aXZlVmFsdWUiLCJtb2RlbFR5cGUiLCJiYXNlQ29sb3IiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBQUEsT0FBTyxVQUFDQyxPQUFELEVBQWE7QUFDbEIsTUFBTUMsUUFBUUQsUUFBUSxpQkFBUixDQUFkO0FBQUEsTUFDRUUsVUFBVUYsUUFBUSxvQkFBUixDQURaO0FBQUEsTUFFRUcsS0FBS0gsUUFBUSx5QkFBUixDQUZQOztBQUlBLE1BQU1JLFNBQVNKLFFBQVEsaUJBQVIsQ0FBZjtBQUFBLE1BQ0VLLGtCQUFrQkwsUUFBUSxrQkFBUixDQURwQjs7QUFFRTtBQUNBO0FBQ0FNLGdCQUFjTixRQUFRLGtDQUFSLENBSmhCO0FBQUEsTUFLRU8saUJBQWlCUCxRQUFRLHFDQUFSLENBTG5CO0FBQUEsTUFNRVEsWUFBWVIsUUFBUSxhQUFSLENBTmQ7O0FBUUEsTUFBTVMsaUJBQWlCVCxRQUFRLGdEQUFSLENBQXZCOztBQWJrQixNQWdCWlUsa0JBaEJZO0FBQUE7O0FBaUJoQixrQ0FBYztBQUFBOztBQUFBOztBQUVaLFVBQUlSLFFBQVFTLEdBQVIsQ0FBWSxvQkFBWixDQUFKLEVBQXVDO0FBQ25DVixjQUFNVyxXQUFOLFFBQXdCLENBQUMsZ0JBQUQsRUFBbUIsMEJBQW5CLEVBQzFCLGtCQUQwQixFQUNOLG1CQURNLEVBQ2UsbUJBRGYsRUFDb0MsYUFEcEMsQ0FBeEI7O0FBR0YsWUFBSVYsUUFBUVMsR0FBUixDQUFZLHNCQUFaLEVBQW9DRSxNQUF4QyxFQUFnRDtBQUM5QyxnQkFBS0MsR0FBTCxHQUFXLElBQUlULGVBQUosRUFBWDtBQUNBSCxrQkFBUVMsR0FBUixDQUFZLE9BQVosRUFBcUJJLGdCQUFyQixDQUFzQyxpQkFBdEMsRUFBeUQsTUFBS0MsY0FBOUQ7QUFDQWQsa0JBQVFTLEdBQVIsQ0FBWSxPQUFaLEVBQXFCSSxnQkFBckIsQ0FBc0Msd0JBQXRDLEVBQWdFLE1BQUtFLHdCQUFyRTtBQUVEOztBQUVEZCxXQUFHZSxJ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dE1JLEVBc01FUyxJQXRNRixFQXNNUTtBQUN0QixZQUFJQSxLQUFLVSxNQUFMLENBQVltQyxTQUFaLElBQXlCLFNBQTdCLEVBQXdDO0FBQ3RDLGlCQUFRLElBQUl2RSxTQUFKLENBQWMsRUFBRXdFLFdBQVc5QyxLQUFLc0IsS0FBbEIsRUFBZCxDQUFELENBQTJDL0IsSUFBM0MsRUFBUDtBQUNEO0FBQ0QsZUFBT0EsSUFBUDtBQUNEO0FBM01lOztBQUFBO0FBQUEsSUFnQmVyQixNQWhCZjs7QUE4TWxCLFNBQU9NLGtCQUFQO0FBQ0QsQ0EvTUQiLCJmaWxlIjoibW9kdWxlL2V1Z2xlbmEvbW9kZWxfYmxvY2tseS9tb2R1bGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyJkZWZpbmUoKHJlcXVpcmUpID0+IHtcbiAgY29uc3QgVXRpbHMgPSByZXF1aXJlKCdjb3JlL3V0aWwvdXRpbHMnKSxcbiAgICBHbG9iYWxzID0gcmVxdWlyZSgnY29yZS9tb2RlbC9nbG9iYWxzJyksXG4gICAgSE0gPSByZXF1aXJlKCdjb3JlL2V2ZW50L2hvb2tfbWFuYWdlcicpO1xuXG4gIGNvbnN0IE1vZHVsZSA9IHJlcXVpcmUoJ2NvcmUvYXBwL21vZHVsZScpLFxuICAgIE1vZGVsaW5nRGF0YVRhYiA9IHJlcXVpcmUoJy4vYmxvY2tseXRhYi90YWInKSxcbiAgICAvL1N5bVNsaWRlckZpZWxkID0gcmVxdWlyZSgnY29yZS9jb21wb25lbnQvc3ltc2xpZGVyZmllbGQvZmllbGQnKSxcbiAgICAvL1NsaWRlckZpZWxkID0gcmVxdWlyZSgnY29yZS9jb21wb25lbnQvc2xpZGVyZmllbGQvZmllbGQnKSxcbiAgICBTZWxlY3RGaWVsZCA9IHJlcXVpcmUoJ2NvcmUvY29tcG9uZW50L3NlbGVjdGZpZWxkL2ZpZWxkJyksXG4gICAgU3ltU2VsZWN0RmllbGQgPSByZXF1aXJlKCdjb3JlL2NvbXBvbmVudC9zeW1zZWxlY3RmaWVsZC9maWVsZCcpLFxuICAgIE1vZGVsVmlldyA9IHJlcXVpcmUoJy4vdGhyZWV2aWV3Jyk7XG5cbiAgY29uc3QgZGVmYXVsdENvbmZpZ3MgPSByZXF1aXJlKCcuL2JvZHlDb25maWd1cmF0aW9ucy9ib2R5Y29uZmlncy9saXN0b2Zjb25maWdzJylcblxuXG4gIGNsYXNzIE1vZGVsaW5nRGF0YU1vZHVsZSBleHRlbmRzIE1vZHVsZSB7XG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICBzdXBlcigpO1xuICAgICAgaWYgKEdsb2JhbHMuZ2V0KCdBcHBDb25maWcubW9kZWxpbmcnKSkge1xuICAgICAgICAgIFV0aWxzLmJpbmRNZXRob2RzKHRoaXMsIFsnX29uUGhhc2VDaGFuZ2UnLCAnX29uRXhwZXJpbWVudENvdW50Q2hhbmdlJyxcbiAgICAgICAgJ19ob29rTW9kZWxGaWVsZHMnLCAnX2hvb2tNb2RpZnlFeHBvcnQnLCAnX2hvb2tNb2RpZnlJbXBvcnQnLCAnX2hvb2szZFZpZXcnXSlcblxuICAgICAgICBpZiAoR2xvYmFscy5nZXQoJ0FwcENvbmZpZy5tb2RlbC50YWJzJykubGVuZ3RoKSB7XG4gICAgICAgICAgdGhpcy50YWIgPSBuZXcgTW9kZWxpbmdEYXRhVGFiKCk7XG4gICAgICAgICAgR2xvYmFscy5nZXQoJ1JlbGF5JykuYWRkRXZlbnRMaXN0ZW5lcignQXBwUGhhc2UuQ2hhbmdlJywgdGhpcy5fb25QaGFzZUNoYW5nZSlcbiAgICAgICAgICBHbG9iYWxzLmdldCgnUmVsYXknKS5hZGRFdmVudExpc3RlbmVyKCdFeHBlcmltZW50Q291bnQuQ2hhbmdlJywgdGhpcy5fb25FeHBlcmltZW50Q291bnRDaGFuZ2UpXG5cbiAgICAgICAgfVxuXG4gICAgICAgIEhNLmhvb2soJ01vZGVsRm9ybS5GaWVsZHMnLCB0aGlzLl9ob29rTW9kZWxGaWVsZHMpO1xuICAgICAgICBITS5ob29rKCdNb2RlbEZvcm0uTW9kaWZ5RXhwb3J0JywgdGhpcy5faG9va01vZGlmeUV4cG9ydCk7XG4gICAgICAgIEhNLmhvb2soJ01vZGVsRm9ybS5Nb2RpZnlJbXBvcnQnLCB0aGlzLl9ob29rTW9kaWZ5SW1wb3J0KTtcbiAgICAgICAgSE0uaG9vaygnRXVnbGVuYS4zZFZpZXcnLCB0aGlzLl9ob29rM2RWaWV3KVxuXG4gICAgICB9XG4gICAgfVxuXG4gICAgcnVuKCkge1xuICAgICAgaWYgKHRoaXMudGFiKSBHbG9iYWxzLmdldCgnTGF5b3V0JykuZ2V0UGFuZWwoJ3Jlc3VsdCcpLmFkZENvbnRlbnQodGhpcy50YWIudmlldygpKVxuICAgIH1cblxuICAgIF9vblBoYXNlQ2hhbmdlKGV2dCkge1xuICAgICAgaWYgKGV2dC5kYXRhLnBoYXNlID09IFwibG9naW5cIiB8fCBldnQuZGF0YS5waGFzZSA9PSBcImxvZ2luX2F0dGVtcHRlZFwiKSB7XG4gICAgICAgIHRoaXMudGFiLmhpZGUoKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBfb25FeHBlcmltZW50Q291bnRDaGFuZ2UoZXZ0KSB7XG4gICAgICBpZiAoZXZ0LmRhdGEuY291bnQgJiYgIWV2dC5kYXRhLm9sZCkge1xuICAgICAgICB0aGlzLnRhYi5zaG93KCk7XG4gICAgICB9IGVsc2UgaWYgKCFldnQuZGF0YS5jb3VudCkge1xuICAgICAgICB0aGlzLnRhYi5oaWRlKCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgX2hvb2tNb2RlbEZpZWxkcyhmaWVsZHMsIG1ldGEpIHtcbiAgICAgIGlmIChtZXRhLnR5cGUgPT0gXCJibG9ja2x5XCIpIHtcbiAgICAgICAgdmFyIGJvZHlDb25maWdzID0gQXJyYXkuYXBwbHkobnVsbCwge2xlbmd0aDpPYmplY3Qua2V5cyhkZWZhdWx0Q29uZmlncykubGVuZ3RofSkubWFwKChudW1iZXIsaW5kKSA9PiAnc2Vuc29yQ29uZmlnXycgKyAoaW5kKzEpKTtcbiAgICAgICAgLy8gRmlsdGVyIG91dCB0aGUgb3B0aW9ucyB0aGF0IGFyZSBub3QgaW4gYWxsb3dlZENvbmZpZ3NcbiAgICAgICAgaWYgKG1ldGEuY29uZmlnLmFsbG93ZWRDb25maWdzLmxlbmd0aCkge1xuICAgICAgICAgIGZvciAobGV0IGlkeCA9IGJvZHlDb25maWdzLmxlbmd0aCAtIDE7IGlkeCA+PSAwOyBpZHgtLSkge1xuICAgICAgICAgICAgaWYgKChtZXRhLmNvbmZpZy5hbGxvd2VkQ29uZmlncy5pbmRleE9mKGRlZmF1bHRDb25maWdzW2JvZHlDb25maWdzW2lkeF1dLmlkLnRvTG93ZXJDYXNlKCkpID09IC0xKSkge1xuICAgICAgICAgICAgICBib2R5Q29uZmlncy5zcGxpY2UoaWR4LDEpXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHRoaXMuYm9keUNvbmZpZ09wdGlvbnMgPSB7fVxuICAgICAgICBib2R5Q29uZmlncy5tYXAoYm9keWNvbmZpZyA9PiB0aGlzLmJvZHlDb25maWdPcHRpb25zW2JvZHljb25maWddID0gZGVmYXVsdENvbmZpZ3NbYm9keWNvbmZpZ11bJ2lkJ10pXG4gICAgICAgIGZpZWxkcyA9IGZpZWxkcy5jb25jYXQoW1NlbGVjdEZpZWxkLmNyZWF0ZSh7XG4gICAgICAgICAgICBpZDogXCJib2R5Q29uZmlndXJhdGlvbk5hbWVcIixcbiAgICAgICAgICAgIGludmVyc2Vfb3JkZXI6IHRydWUsXG4gICAgICAgICAgICBjb2xvcjogbWV0YS5jb25maWcuYm9keUNvbmZpZ3VyYXRpb24uY29sb3IgPyBtZXRhLmNvbmZpZy5ib2R5Q29uZmlndXJhdGlvbi5jb2xvciA6IG51bGwsXG4gICAgICAgICAgICBsYWJlbDogbWV0YS5jb25maWcuYm9keUNvbmZpZ3VyYXRpb24ubGFiZWwsXG4gICAgICAgICAgICB2YWx1ZTogbWV0YS5jb25maWcuYm9keUNvbmZpZ3VyYXRpb24uaW5pdGlhbFZhbHVlLFxuICAgICAgICAgICAgbWluX3dpZHRoOiBtZXRhLmNvbmZpZy5ib2R5Q29uZmlndXJhdGlvbi5taW5fd2lkdGgsXG4gICAgICAgICAgICBkZXNjcmlwdGlvbjogbWV0YS5jb25maWcuYm9keUNvbmZpZ3VyYXRpb24uZGVzY3JpcHRpb24sXG4gICAgICAgICAgICBjbGFzc2VzOiBbXSxcbiAgICAgICAgICAgIG9wdGlvbnM6IHRoaXMuYm9keUNvbmZpZ09wdGlvbnNcbiAgICAgICAgICB9KSwgU3ltU2VsZWN0RmllbGQuY3JlYXRlKHtcbiAgICAgICAgICAgIGlkOiAndicsXG4gICAgICAgICAgICBpbnZlcnNlX29yZGVyOiB0cnVlLFxuICAgICAgICAgICAgaW5jbHVkZVZhcmlhdGlvbjogbWV0YS5jb25maWcudmFyaWF0aW9uID8gdHJ1ZSA6IGZhbHNlLFxuICAgICAgICAgICAgbGFiZWw6IG1ldGEuY29uZmlnLnYubGFiZWwsXG4gICAgICAgICAgICBjb2xvcjogbWV0YS5jb25maWcudi5jb2xvciA/IG1ldGEuY29uZmlnLnYuY29sb3IgOiBudWxsLFxuICAgICAgICAgICAgdmFsdWU6IG1ldGEuY29uZmlnLnYuaW5pdGlhbFZhbHVlLFxuICAgICAgICAgICAgbWF4VmFsdWU6IG1ldGEuY29uZmlnLnYubWF4VmFsdWUsXG4gICAgICAgICAgICBkZXNjcmlwdGlvbjogbWV0YS5jb25maWcudi5kZXNjcmlwdGlvbixcbiAgICAgICAgICAgIGNsYXNzZXM6IFtdLFxuICAgICAgICAgICAgb3B0aW9uczogbWV0YS5jb25maWcudi5vcHRpb25zXG4gICAgICAgICAgfSksIFN5bVNlbGVjdEZpZWxkLmNyZWF0ZSh7XG4gICAgICAgICAgICBpZDogJ2snLFxuICAgICAgICAgICAgaW52ZXJzZV9vcmRlcjogdHJ1ZSxcbiAgICAgICAgICAgIGluY2x1ZGVWYXJpYXRpb246IG1ldGEuY29uZmlnLnZhcmlhdGlvbiA/IHRydWUgOiBmYWxzZSxcbiAgICAgICAgICAgIGxhYmVsOiBtZXRhLmNvbmZpZy5LLmxhYmVsLFxuICAgICAgICAgICAgY29sb3I6IG1ldGEuY29uZmlnLksuY29sb3IgPyBtZXRhLmNvbmZpZy5LLmNvbG9yIDogbnVsbCxcbiAgICAgICAgICAgIHZhbHVlOiBtZXRhLmNvbmZpZy5LLmluaXRpYWxWYWx1ZSxcbiAgICAgICAgICAgIG1heFZhbHVlOiBtZXRhLmNvbmZpZy5LLm1heFZhbHVlLFxuICAgICAgICAgICAgZGVzY3JpcHRpb246IG1ldGEuY29uZmlnLksuZGVzY3JpcHRpb24sXG4gICAgICAgICAgICBjbGFzc2VzOiBbXSxcbiAgICAgICAgICAgIG9wdGlvbnM6IG1ldGEuY29uZmlnLksub3B0aW9uc1xuICAgICAgICAgIH0pXG4gICAgICAgIF0pXG5cbiAgICAgICAgLy8gQWRkIGVpdGhlciByb2xsIG9yIG1vdGlvbiB0eXBlIG9wdGlvblxuICAgICAgICBpZiAobWV0YS5jb25maWcub21lZ2EpIHtcbiAgICAgICAgICBmaWVsZHMuc3BsaWNlKDMsMCxTeW1TZWxlY3RGaWVsZC5jcmVhdGUoe1xuICAgICAgICAgICAgaWQ6ICdvbWVnYScsXG4gICAgICAgICAgICBpbnZlcnNlX29yZGVyOiB0cnVlLFxuICAgICAgICAgICAgaW5jbHVkZVZhcmlhdGlvbjogbWV0YS5jb25maWcudmFyaWF0aW9uID8gdHJ1ZSA6IGZhbHNlLFxuICAgICAgICAgICAgbGFiZWw6IG1ldGEuY29uZmlnLm9tZWdhLmxhYmVsLFxuICAgICAgICAgICAgY29sb3I6IG1ldGEuY29uZmlnLm9tZWdhLmNvbG9yID8gbWV0YS5jb25maWcub21lZ2EuY29sb3IgOiBudWxsLFxuICAgICAgICAgICAgdmFsdWU6IG1ldGEuY29uZmlnLm9tZWdhLmluaXRpYWxWYWx1ZSxcbiAgICAgICAgICAgIG1heFZhbHVlOiBtZXRhLmNvbmZpZy5vbWVnYS5tYXhWYWx1ZSxcbiAgICAgICAgICAgIGRlc2NyaXB0aW9uOiBtZXRhLmNvbmZpZy5vbWVnYS5kZXNjcmlwdGlvbixcbiAgICAgICAgICAgIGNsYXNzZXM6IFtdLFxuICAgICAgICAgICAgb3B0aW9uczogbWV0YS5jb25maWcub21lZ2Eub3B0aW9uc1xuICAgICAgICAgIH0pKVxuICAgICAgICB9IGVsc2UgaWYgKG1ldGEuY29uZmlnLm1vdGlvbikge1xuICAgICAgICAgIGZpZWxkcy5zcGxpY2UoMywwLFN5bVNlbGVjdEZpZWxkLmNyZWF0ZSh7XG4gICAgICAgICAgICBpZDogJ21vdGlvbicsXG4gICAgICAgICAgICBpbnZlcnNlX29yZGVyOiB0cnVlLFxuICAgICAgICAgICAgaW5jbHVkZVZhcmlhdGlvbjogZmFsc2UsXG4gICAgICAgICAgICBsYWJlbDogbWV0YS5jb25maWcubW90aW9uLmxhYmVsLFxuICAgICAgICAgICAgY29sb3I6IG1ldGEuY29uZmlnLm1vdGlvbi5jb2xvciA/IG1ldGEuY29uZmlnLm1vdGlvbi5jb2xvciA6IG51bGwsXG4gICAgICAgICAgICB2YWx1ZTogbWV0YS5jb25maWcubW90aW9uLmluaXRpYWxWYWx1ZSxcbiAgICAgICAgICAgIG1heFZhbHVlOiBtZXRhLmNvbmZpZy5tb3Rpb24ubWF4VmFsdWUsXG4gICAgICAgICAgICBkZXNjcmlwdGlvbjogbWV0YS5jb25maWcubW90aW9uLmRlc2NyaXB0aW9uLFxuICAgICAgICAgICAgY2xhc3NlczogW10sXG4gICAgICAgICAgICBvcHRpb25zOiBtZXRhLmNvbmZpZy5tb3Rpb24ub3B0aW9uc1xuICAgICAgICAgIH0pKVxuICAgICAgICB9XG5cbiAgICAgICAgLy8gQWRkIG9wYWNpdHlcbiAgICAgICAgaWYgKG1ldGEuY29uZmlnLm9wYWNpdHkpIHtcbiAgICAgICAgICBmaWVsZHMuc3BsaWNlKDEsMCxTeW1TZWxlY3RGaWVsZC5jcmVhdGUoe1xuICAgICAgICAgICAgaWQ6ICdvcGFjaXR5JyxcbiAgICAgICAgICAgIGludmVyc2Vfb3JkZXI6IHRydWUsXG4gICAgICAgICAgICBpbmNsdWRlVmFyaWF0aW9uOiBtZXRhLmNvbmZpZy52YXJpYXRpb24gPyB0cnVlIDogZmFsc2UsXG4gICAgICAgICAgICBsYWJlbDogbWV0YS5jb25maWcub3BhY2l0eS5sYWJlbCxcbiAgICAgICAgICAgIGNvbG9yOiBtZXRhLmNvbmZpZy5vcGFjaXR5LmNvbG9yID8gbWV0YS5jb25maWcub3BhY2l0eS5jb2xvciA6IG51bGwsXG4gICAgICAgICAgICB2YWx1ZTogbWV0YS5jb25maWcub3BhY2l0eS5pbml0aWFsVmFsdWUsXG4gICAgICAgICAgICBtYXhWYWx1ZTogbWV0YS5jb25maWcub3BhY2l0eS5tYXhWYWx1ZSxcbiAgICAgICAgICAgIGRlc2NyaXB0aW9uOiBtZXRhLmNvbmZpZy5vcGFjaXR5LmRlc2NyaXB0aW9uLFxuICAgICAgICAgICAgY2xhc3NlczogW10sXG4gICAgICAgICAgICBvcHRpb25zOiBtZXRhLmNvbmZpZy5vcGFjaXR5Lm9wdGlvbnNcbiAgICAgICAgICB9KSlcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIEFkZCB2YXJpYXRpb25cbiAgICAgICAgaWYgKG1ldGEuY29uZmlnLnZhcmlhdGlvbikge1xuICAgICAgICAgIGZpZWxkcy5wdXNoKFN5bVNlbGVjdEZpZWxkLmNyZWF0ZSh7XG4gICAgICAgICAgICBpZDogJ3ZhcmlhdGlvbicsXG4gICAgICAgICAgICBpbmNsdWRlVmFyaWF0aW9uOiBmYWxzZSxcbiAgICAgICAgICAgIGxhYmVsOiBtZXRhLmNvbmZpZy52YXJpYXRpb24ubGFiZWwsXG4gICAgICAgICAgICBjb2xvcjogbWV0YS5jb25maWcudmFyaWF0aW9uLmNvbG9yID8gbWV0YS5jb25maWcudmFyaWF0aW9uLmNvbG9yIDogbnVsbCxcbiAgICAgICAgICAgIHZhbHVlOiBtZXRhLmNvbmZpZy52YXJpYXRpb24uaW5pdGlhbFZhbHVlLFxuICAgICAgICAgICAgbWF4VmFsdWU6IG1ldGEuY29uZmlnLnZhcmlhdGlvbi5tYXhWYWx1ZSxcbiAgICAgICAgICAgIGNsYXNzZXM6IFtdLFxuICAgICAgICAgICAgb3B0aW9uczogbWV0YS5jb25maWcudmFyaWF0aW9uLm9wdGlvbnNcbiAgICAgICAgICB9KSlcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmV0dXJuIGZpZWxkcztcbiAgICB9XG5cbiAgICBfaG9va01vZGlmeUV4cG9ydChleHAsIG1ldGEpIHtcblxuICAgICAgaWYgKG1ldGEudHlwZSA9PSBcImJsb2NrbHlcIikge1xuICAgICAgICBbJ2snLCAndicsICdvbWVnYScsJ29wYWNpdHknLCd2YXJpYXRpb24nLCdtb3Rpb24nXS5mb3JFYWNoKChrZXkpID0+IHtcbiAgICAgICAgICBpZiAoT2JqZWN0LmtleXMoZXhwKS5pbmRleE9mKGtleSkgPi0xKSB7XG4gICAgICAgICAgICBleHBbYCR7a2V5fV9udW1lcmljYF0gPSBleHBba2V5XS5udW1lcmljVmFsdWU7XG4gICAgICAgICAgICBleHBbYCR7a2V5fV92YXJpYXRpb25gXSA9IGV4cFtrZXldLnZhcmlhdGlvbjtcbiAgICAgICAgICAgIGV4cFtrZXldID0gZXhwW2tleV0ucXVhbGl0YXRpdmVWYWx1ZTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pXG4gICAgICB9XG5cbiAgICAgIHJldHVybiBleHBcbiAgICB9XG5cbiAgICBfaG9va01vZGlmeUltcG9ydChkYXRhLCBtZXRhKSB7XG4gICAgICBpZiAobWV0YS50eXBlID09IFwiYmxvY2tseVwiKSB7XG4gICAgICAgIFsnaycsICd2JywgJ29tZWdhJywnb3BhY2l0eScsJ3ZhcmlhdGlvbicsJ21vdGlvbiddLmZvckVhY2goKGtleSkgPT4ge1xuICAgICAgICAgIGlmIChPYmplY3Qua2V5cyhkYXRhKS5pbmRleE9mKGtleSkgPiAtMSkge1xuICAgICAgICAgICAgZGF0YVtrZXldID0ge1xuICAgICAgICAgICAgICBxdWFsaXRhdGl2ZVZhbHVlOiBkYXRhW2tleV0sXG4gICAgICAgICAgICAgIG51bWVyaWNWYWx1ZTogZGF0YVtgJHtrZXl9X251bWVyaWNgXSxcbiAgICAgICAgICAgICAgdmFyaWF0aW9uOiBkYXRhW2Ake2tleX1fdmFyaWF0aW9uYF1cbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICBkZWxldGUgZGF0YVtgJHtrZXl9X251bWVyaWNgXTtcbiAgICAgICAgICAgIGRlbGV0ZSBkYXRhW2Ake2tleX1fdmFyaWF0aW9uYF07XG4gICAgICAgICAgfVxuICAgICAgICB9KVxuICAgICAgfVxuICAgICAgcmV0dXJuIGRhdGE7XG4gICAgfVxuXG4gICAgX2hvb2szZFZpZXcodmlldywgbWV0YSkge1xuICAgICAgaWYgKG1ldGEuY29uZmlnLm1vZGVsVHlwZSA9PSBcImJsb2NrbHlcIikge1xuICAgICAgICByZXR1cm4gKG5ldyBNb2RlbFZpZXcoeyBiYXNlQ29sb3I6IG1ldGEuY29sb3IgfSkpLnZpZXcoKVxuICAgICAgfVxuICAgICAgcmV0dXJuIHZpZXc7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIE1vZGVsaW5nRGF0YU1vZHVsZTtcbn0pXG4iXX0=
