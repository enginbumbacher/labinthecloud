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
            varOptions: meta.config.v.varOptions,
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
            varOptions: meta.config.K.varOptions,
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
              varOptions: meta.config.omega.varOptions,
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
              varOptions: meta.config.opacity.varOptions,
              label: meta.config.opacity.label,
              color: meta.config.opacity.color ? meta.config.opacity.color : null,
              value: meta.config.opacity.initialValue,
              maxValue: meta.config.opacity.maxValue,
              description: meta.config.opacity.description,
              classes: [],
              options: meta.config.opacity.options
            }));
          }
        }
        return fields;
      }
    }, {
      key: '_hookModifyExport',
      value: function _hookModifyExport(exp, meta) {

        if (meta.type == "blockly") {
          ['k', 'v', 'omega', 'opacity', 'motion'].forEach(function (key) {
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
          ['k', 'v', 'omega', 'opacity', 'motion'].forEach(function (key) {
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
          // Here, extract the number of eyes
          if (Object.keys(defaultConfigs).indexOf(meta.config.configuration.bodyConfigurationName) == -1) {
            console.log('this is not good');
          } else {
            var numSensors = 0;
            var sensorName = null;
            var sensorConfig = defaultConfigs[meta.config.configuration.bodyConfigurationName].config;
            Object.keys(sensorConfig).forEach(function (key) {
              if (key.toLowerCase().match('sensor')) {
                numSensors += 1;
                sensorName = key;
              }
            });

            if (numSensors == 2) {
              var baseConfig = {
                baseColor: meta.color,
                addEye: 'both'
              };
            } else {
              if (sensorConfig[sensorName].sensorOrientation == 0) {
                var baseConfig = {
                  baseColor: meta.color,
                  addEye: 'right'
                };
              } else {
                var baseConfig = {
                  baseColor: meta.color,
                  addEye: 'left'
                };
              }
            }
          }

          return new ModelView(baseConfig).view();
        }
        return view;
      }
    }]);

    return ModelingDataModule;
  }(Module);

  return ModelingDataModule;
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9ldWdsZW5hL21vZGVsX2Jsb2NrbHkvbW9kdWxlLmpzIl0sIm5hbWVzIjpbImRlZmluZSIsInJlcXVpcmUiLCJVdGlscyIsIkdsb2JhbHMiLCJITSIsIk1vZHVsZSIsIk1vZGVsaW5nRGF0YVRhYiIsIlNlbGVjdEZpZWxkIiwiU3ltU2VsZWN0RmllbGQiLCJNb2RlbFZpZXciLCJkZWZhdWx0Q29uZmlncyIsIk1vZGVsaW5nRGF0YU1vZHVsZSIsImdldCIsImJpbmRNZXRob2RzIiwibGVuZ3RoIiwidGFiIiwiYWRkRXZlbnRMaXN0ZW5lciIsIl9vblBoYXNlQ2hhbmdlIiwiX29uRXhwZXJpbWVudENvdW50Q2hhbmdlIiwiaG9vayIsIl9ob29rTW9kZWxGaWVsZHMiLCJfaG9va01vZGlmeUV4cG9ydCIsIl9ob29rTW9kaWZ5SW1wb3J0IiwiX2hvb2szZFZpZXciLCJnZXRQYW5lbCIsImFkZENvbnRlbnQiLCJ2aWV3IiwiZXZ0IiwiZGF0YSIsInBoYXNlIiwiaGlkZSIsImNvdW50Iiwib2xkIiwic2hvdyIsImZpZWxkcyIsIm1ldGEiLCJ0eXBlIiwiYm9keUNvbmZpZ3MiLCJBcnJheSIsImFwcGx5IiwiT2JqZWN0Iiwia2V5cyIsIm1hcCIsIm51bWJlciIsImluZCIsImNvbmZpZyIsImFsbG93ZWRDb25maWdzIiwiaWR4IiwiaW5kZXhPZiIsImlkIiwidG9Mb3dlckNhc2UiLCJzcGxpY2UiLCJib2R5Q29uZmlnT3B0aW9ucyIsImJvZHljb25maWciLCJjb25jYXQiLCJjcmVhdGUiLCJpbnZlcnNlX29yZGVyIiwiY29sb3IiLCJib2R5Q29uZmlndXJhdGlvbiIsImxhYmVsIiwidmFsdWUiLCJpbml0aWFsVmFsdWUiLCJtaW5fd2lkdGgiLCJkZXNjcmlwdGlvbiIsImNsYXNzZXMiLCJvcHRpb25zIiwidmFyT3B0aW9ucyIsInYiLCJtYXhWYWx1ZSIsIksiLCJvbWVnYSIsIm1vdGlvbiIsIm9wYWNpdHkiLCJleHAiLCJmb3JFYWNoIiwia2V5IiwibnVtZXJpY1ZhbHVlIiwidmFyaWF0aW9uIiwicXVhbGl0YXRpdmVWYWx1ZSIsIm1vZGVsVHlwZSIsImNvbmZpZ3VyYXRpb24iLCJib2R5Q29uZmlndXJhdGlvbk5hbWUiLCJjb25zb2xlIiwibG9nIiwibnVtU2Vuc29ycyIsInNlbnNvck5hbWUiLCJzZW5zb3JDb25maWciLCJtYXRjaCIsImJhc2VDb25maWciLCJiYXNlQ29sb3IiLCJhZGRFeWUiLCJzZW5zb3JPcmllbnRhdGlvbiJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBQSxPQUFPLFVBQUNDLE9BQUQsRUFBYTtBQUNsQixNQUFNQyxRQUFRRCxRQUFRLGlCQUFSLENBQWQ7QUFBQSxNQUNFRSxVQUFVRixRQUFRLG9CQUFSLENBRFo7QUFBQSxNQUVFRyxLQUFLSCxRQUFRLHlCQUFSLENBRlA7O0FBSUEsTUFBTUksU0FBU0osUUFBUSxpQkFBUixDQUFmO0FBQUEsTUFDRUssa0JBQWtCTCxRQUFRLGtCQUFSLENBRHBCOztBQUVFO0FBQ0E7QUFDQU0sZ0JBQWNOLFFBQVEsa0NBQVIsQ0FKaEI7QUFBQSxNQUtFTyxpQkFBaUJQLFFBQVEscUNBQVIsQ0FMbkI7QUFBQSxNQU1FUSxZQUFZUixRQUFRLGFBQVIsQ0FOZDs7QUFRQSxNQUFNUyxpQkFBaUJULFFBQVEsZ0RBQVIsQ0FBdkI7O0FBYmtCLE1BZ0JaVSxrQkFoQlk7QUFBQTs7QUFpQmhCLGtDQUFjO0FBQUE7O0FBQUE7O0FBRVosVUFBSVIsUUFBUVMsR0FBUixDQUFZLG9CQUFaLENBQUosRUFBdUM7QUFDbkNWLGNBQU1XLFdBQU4sUUFBd0IsQ0FBQyxnQkFBRCxFQUFtQiwwQkFBbkIsRUFDMUIsa0JBRDBCLEVBQ04sbUJBRE0sRUFDZSxtQkFEZixFQUNvQyxhQURwQyxDQUF4Qjs7QUFHRixZQUFJVixRQUFRUyxHQUFSLENBQVksc0JBQVosRUFBb0NFLE1BQXhDLEVBQWdEO0FBQzlDLGdCQUFLQyxHQUFMLEdBQVcsSUFBSVQsZUFBSixFQUFYO0FBQ0FILGtCQUFRUyxHQUFSLENBQVksT0FBWixFQUFxQkksZ0JBQXJCLENBQXNDLGlCQUF0QyxFQUF5RCxNQUFLQyxjQUE5RDtBQUNBZCxrQkFBUVMsR0FBUixDQUFZLE9BQVosRUFBcUJJLGdCQUFyQixDQUFzQyx3QkFBdEMsRUFBZ0UsTUFBS0Usd0JBQXJFO0FBRUQ7O0FBRURkLFdBQUdlLElBQUgsQ0FBUSxrQkFBUixFQUE0QixNQUFLQyxnQkFBakM7QUFDQWhCLFdBQUdlLElBQUgsQ0FBUSx3QkFBUixFQUFrQyxNQUFLRSxpQkFBdkM7QUFDQWpCLFdBQUdlLElBQUgsQ0FBUSx3QkFBUixFQUFrQyxNQUFLRyxpQkFBdkM7QUFDQWxCLFdBQUdlLElBQUgsQ0FBUSxnQkFBUixFQUEwQixNQUFLSSxXQUEvQjtBQUVEO0FBbEJXO0FBbUJiOztBQXBDZTtBQUFBO0FBQUEsNEJBc0NWO0FBQ0osWUFBSSxLQUFLUixHQUFULEVBQWNaLFFBQVFTLEdBQVIsQ0FBWSxRQUFaLEVBQXNCWSxRQUF0QixDQUErQixRQUEvQixFQUF5Q0MsVUFBekMsQ0FBb0QsS0FBS1YsR0FBTCxDQUFTVyxJQUFULEVBQXBEO0FBQ2Y7QUF4Q2U7QUFBQTtBQUFBLHFDQTBDREMsR0ExQ0MsRUEwQ0k7QUFDbEIsWUFBSUEsSUFBSUMsSUFBSixDQUFTQyxLQUFULElBQWtCLE9BQWxCLElBQTZCRixJQUFJQyxJQUFKLENBQVNDLEtBQVQsSUFBa0IsaUJBQW5ELEVBQXNFO0FBQ3BFLGVBQUtkLEdBQUwsQ0FBU2UsSUFBVDtBQUNEO0FBQ0Y7QUE5Q2U7QUFBQTtBQUFBLCtDQWdEU0gsR0FoRFQsRUFnRGM7QUFDNUIsWUFBSUEsSUFBSUMsSUFBSixDQUFTRyxLQUFULElBQWtCLENBQUNKLElBQUlDLElBQUosQ0FBU0ksR0FBaEMsRUFBcUM7QUFDbkMsZUFBS2pCLEdBQUwsQ0FBU2tCLElBQVQ7QUFDRCxTQUZELE1BRU8sSUFBSSxDQUFDTixJQUFJQyxJQUFKLENBQVNHLEtBQWQsRUFBcUI7QUFDMUIsZUFBS2hCLEdBQUwsQ0FBU2UsSUFBVDtBQUNEO0FBQ0Y7QUF0RGU7QUFBQTtBQUFBLHVDQXdEQ0ksTUF4REQsRUF3RFNDLElBeERULEVBd0RlO0FBQUE7O0FBQzdCLFlBQUlBLEtBQUtDLElBQUwsSUFBYSxTQUFqQixFQUE0QjtBQUMxQixjQUFJQyxjQUFjQyxNQUFNQyxLQUFOLENBQVksSUFBWixFQUFrQixFQUFDekIsUUFBTzBCLE9BQU9DLElBQVAsQ0FBWS9CLGNBQVosRUFBNEJJLE1BQXBDLEVBQWxCLEVBQStENEIsR0FBL0QsQ0FBbUUsVUFBQ0MsTUFBRCxFQUFRQyxHQUFSO0FBQUEsbUJBQWdCLG1CQUFtQkEsTUFBSSxDQUF2QixDQUFoQjtBQUFBLFdBQW5FLENBQWxCO0FBQ0E7QUFDQSxjQUFJVCxLQUFLVSxNQUFMLENBQVlDLGNBQVosQ0FBMkJoQyxNQUEvQixFQUF1QztBQUNyQyxpQkFBSyxJQUFJaUMsTUFBTVYsWUFBWXZCLE1BQVosR0FBcUIsQ0FBcEMsRUFBdUNpQyxPQUFPLENBQTlDLEVBQWlEQSxLQUFqRCxFQUF3RDtBQUN0RCxrQkFBS1osS0FBS1UsTUFBTCxDQUFZQyxjQUFaLENBQTJCRSxPQUEzQixDQUFtQ3RDLGVBQWUyQixZQUFZVSxHQUFaLENBQWYsRUFBaUNFLEVBQWpDLENBQW9DQyxXQUFwQyxFQUFuQyxLQUF5RixDQUFDLENBQS9GLEVBQW1HO0FBQ2pHYiw0QkFBWWMsTUFBWixDQUFtQkosR0FBbkIsRUFBdUIsQ0FBdkI7QUFDRDtBQUNGO0FBQ0Y7QUFDRCxlQUFLSyxpQkFBTCxHQUF5QixFQUF6QjtBQUNBZixzQkFBWUssR0FBWixDQUFnQjtBQUFBLG1CQUFjLE9BQUtVLGlCQUFMLENBQXVCQyxVQUF2QixJQUFxQzNDLGVBQWUyQyxVQUFmLEVBQTJCLElBQTNCLENBQW5EO0FBQUEsV0FBaEI7QUFDQW5CLG1CQUFTQSxPQUFPb0IsTUFBUCxDQUFjLENBQUMvQyxZQUFZZ0QsTUFBWixDQUFtQjtBQUN2Q04sZ0JBQUksdUJBRG1DO0FBRXZDTywyQkFBZSxJQUZ3QjtBQUd2Q0MsbUJBQU90QixLQUFLVSxNQUFMLENBQVlhLGlCQUFaLENBQThCRCxLQUE5QixHQUFzQ3RCLEtBQUtVLE1BQUwsQ0FBWWEsaUJBQVosQ0FBOEJELEtBQXBFLEdBQTRFLElBSDVDO0FBSXZDRSxtQkFBT3hCLEtBQUtVLE1BQUwsQ0FBWWEsaUJBQVosQ0FBOEJDLEtBSkU7QUFLdkNDLG1CQUFPekIsS0FBS1UsTUFBTCxDQUFZYSxpQkFBWixDQUE4QkcsWUFMRTtBQU12Q0MsdUJBQVczQixLQUFLVSxNQUFMLENBQVlhLGlCQUFaLENBQThCSSxTQU5GO0FBT3ZDQyx5QkFBYTVCLEtBQUtVLE1BQUwsQ0FBWWEsaUJBQVosQ0FBOEJLLFdBUEo7QUFRdkNDLHFCQUFTLEVBUjhCO0FBU3ZDQyxxQkFBUyxLQUFLYjtBQVR5QixXQUFuQixDQUFELEVBVWpCNUMsZUFBZStDLE1BQWYsQ0FBc0I7QUFDeEJOLGdCQUFJLEdBRG9CO0FBRXhCTywyQkFBZSxJQUZTO0FBR3hCVSx3QkFBWS9CLEtBQUtVLE1BQUwsQ0FBWXNCLENBQVosQ0FBY0QsVUFIRjtBQUl4QlAsbUJBQU94QixLQUFLVSxNQUFMLENBQVlzQixDQUFaLENBQWNSLEtBSkc7QUFLeEJGLG1CQUFPdEIsS0FBS1UsTUFBTCxDQUFZc0IsQ0FBWixDQUFjVixLQUFkLEdBQXNCdEIsS0FBS1UsTUFBTCxDQUFZc0IsQ0FBWixDQUFjVixLQUFwQyxHQUE0QyxJQUwzQjtBQU14QkcsbUJBQU96QixLQUFLVSxNQUFMLENBQVlzQixDQUFaLENBQWNOLFlBTkc7QUFPeEJPLHNCQUFVakMsS0FBS1UsTUFBTCxDQUFZc0IsQ0FBWixDQUFjQyxRQVBBO0FBUXhCTCx5QkFBYTVCLEtBQUtVLE1BQUwsQ0FBWXNCLENBQVosQ0FBY0osV0FSSDtBQVN4QkMscUJBQVMsRUFUZTtBQVV4QkMscUJBQVM5QixLQUFLVSxNQUFMLENBQVlzQixDQUFaLENBQWNGO0FBVkMsV0FBdEIsQ0FWaUIsRUFxQmpCekQsZUFBZStDLE1BQWYsQ0FBc0I7QUFDeEJOLGdCQUFJLEdBRG9CO0FBRXhCTywyQkFBZSxJQUZTO0FBR3hCVSx3QkFBWS9CLEtBQUtVLE1BQUwsQ0FBWXdCLENBQVosQ0FBY0gsVUFIRjtBQUl4QlAsbUJBQU94QixLQUFLVSxNQUFMLENBQVl3QixDQUFaLENBQWNWLEtBSkc7QUFLeEJGLG1CQUFPdEIsS0FBS1UsTUFBTCxDQUFZd0IsQ0FBWixDQUFjWixLQUFkLEdBQXNCdEIsS0FBS1UsTUFBTCxDQUFZd0IsQ0FBWixDQUFjWixLQUFwQyxHQUE0QyxJQUwzQjtBQU14QkcsbUJBQU96QixLQUFLVSxNQUFMLENBQVl3QixDQUFaLENBQWNSLFlBTkc7QUFPeEJPLHNCQUFVakMsS0FBS1UsTUFBTCxDQUFZd0IsQ0FBWixDQUFjRCxRQVBBO0FBUXhCTCx5QkFBYTVCLEtBQUtVLE1BQUwsQ0FBWXdCLENBQVosQ0FBY04sV0FSSDtBQVN4QkMscUJBQVMsRUFUZTtBQVV4QkMscUJBQVM5QixLQUFLVSxNQUFMLENBQVl3QixDQUFaLENBQWNKO0FBVkMsV0FBdEIsQ0FyQmlCLENBQWQsQ0FBVDs7QUFtQ0E7QUFDQSxjQUFJOUIsS0FBS1UsTUFBTCxDQUFZeUIsS0FBaEIsRUFBdUI7QUFDckJwQyxtQkFBT2lCLE1BQVAsQ0FBYyxDQUFkLEVBQWdCLENBQWhCLEVBQWtCM0MsZUFBZStDLE1BQWYsQ0FBc0I7QUFDdENOLGtCQUFJLE9BRGtDO0FBRXRDTyw2QkFBZSxJQUZ1QjtBQUd0Q1UsMEJBQVkvQixLQUFLVSxNQUFMLENBQVl5QixLQUFaLENBQWtCSixVQUhRO0FBSXRDUCxxQkFBT3hCLEtBQUtVLE1BQUwsQ0FBWXlCLEtBQVosQ0FBa0JYLEtBSmE7QUFLdENGLHFCQUFPdEIsS0FBS1UsTUFBTCxDQUFZeUIsS0FBWixDQUFrQmIsS0FBbEIsR0FBMEJ0QixLQUFLVSxNQUFMLENBQVl5QixLQUFaLENBQWtCYixLQUE1QyxHQUFvRCxJQUxyQjtBQU10Q0cscUJBQU96QixLQUFLVSxNQUFMLENBQVl5QixLQUFaLENBQWtCVCxZQU5hO0FBT3RDTyx3QkFBVWpDLEtBQUtVLE1BQUwsQ0FBWXlCLEtBQVosQ0FBa0JGLFFBUFU7QUFRdENMLDJCQUFhNUIsS0FBS1UsTUFBTCxDQUFZeUIsS0FBWixDQUFrQlAsV0FSTztBQVN0Q0MsdUJBQVMsRUFUNkI7QUFVdENDLHVCQUFTOUIsS0FBS1UsTUFBTCxDQUFZeUIsS0FBWixDQUFrQkw7QUFWVyxhQUF0QixDQUFsQjtBQVlELFdBYkQsTUFhTyxJQUFJOUIsS0FBS1UsTUFBTCxDQUFZMEIsTUFBaEIsRUFBd0I7QUFDN0JyQyxtQkFBT2lCLE1BQVAsQ0FBYyxDQUFkLEVBQWdCLENBQWhCLEVBQWtCM0MsZUFBZStDLE1BQWYsQ0FBc0I7QUFDdENOLGtCQUFJLFFBRGtDO0FBRXRDTyw2QkFBZSxJQUZ1QjtBQUd0Q0cscUJBQU94QixLQUFLVSxNQUFMLENBQVkwQixNQUFaLENBQW1CWixLQUhZO0FBSXRDRixxQkFBT3RCLEtBQUtVLE1BQUwsQ0FBWTBCLE1BQVosQ0FBbUJkLEtBQW5CLEdBQTJCdEIsS0FBS1UsTUFBTCxDQUFZMEIsTUFBWixDQUFtQmQsS0FBOUMsR0FBc0QsSUFKdkI7QUFLdENHLHFCQUFPekIsS0FBS1UsTUFBTCxDQUFZMEIsTUFBWixDQUFtQlYsWUFMWTtBQU10Q08sd0JBQVVqQyxLQUFLVSxNQUFMLENBQVkwQixNQUFaLENBQW1CSCxRQU5TO0FBT3RDTCwyQkFBYTVCLEtBQUtVLE1BQUwsQ0FBWTBCLE1BQVosQ0FBbUJSLFdBUE07QUFRdENDLHVCQUFTLEVBUjZCO0FBU3RDQyx1QkFBUzlCLEtBQUtVLE1BQUwsQ0FBWTBCLE1BQVosQ0FBbUJOO0FBVFUsYUFBdEIsQ0FBbEI7QUFXRDs7QUFFRDtBQUNBLGNBQUk5QixLQUFLVSxNQUFMLENBQVkyQixPQUFoQixFQUF5QjtBQUN2QnRDLG1CQUFPaUIsTUFBUCxDQUFjLENBQWQsRUFBZ0IsQ0FBaEIsRUFBa0IzQyxlQUFlK0MsTUFBZixDQUFzQjtBQUN0Q04sa0JBQUksU0FEa0M7QUFFdENPLDZCQUFlLElBRnVCO0FBR3RDVSwwQkFBWS9CLEtBQUtVLE1BQUwsQ0FBWTJCLE9BQVosQ0FBb0JOLFVBSE07QUFJdENQLHFCQUFPeEIsS0FBS1UsTUFBTCxDQUFZMkIsT0FBWixDQUFvQmIsS0FKVztBQUt0Q0YscUJBQU90QixLQUFLVSxNQUFMLENBQVkyQixPQUFaLENBQW9CZixLQUFwQixHQUE0QnRCLEtBQUtVLE1BQUwsQ0FBWTJCLE9BQVosQ0FBb0JmLEtBQWhELEdBQXdELElBTHpCO0FBTXRDRyxxQkFBT3pCLEtBQUtVLE1BQUwsQ0FBWTJCLE9BQVosQ0FBb0JYLFlBTlc7QUFPdENPLHdCQUFVakMsS0FBS1UsTUFBTCxDQUFZMkIsT0FBWixDQUFvQkosUUFQUTtBQVF0Q0wsMkJBQWE1QixLQUFLVSxNQUFMLENBQVkyQixPQUFaLENBQW9CVCxXQVJLO0FBU3RDQyx1QkFBUyxFQVQ2QjtBQVV0Q0MsdUJBQVM5QixLQUFLVSxNQUFMLENBQVkyQixPQUFaLENBQW9CUDtBQVZTLGFBQXRCLENBQWxCO0FBWUQ7QUFDRjtBQUNELGVBQU8vQixNQUFQO0FBQ0Q7QUFySmU7QUFBQTtBQUFBLHdDQXVKRXVDLEdBdkpGLEVBdUpPdEMsSUF2SlAsRUF1SmE7O0FBRTNCLFlBQUlBLEtBQUtDLElBQUwsSUFBYSxTQUFqQixFQUE0QjtBQUMxQixXQUFDLEdBQUQsRUFBTSxHQUFOLEVBQVcsT0FBWCxFQUFtQixTQUFuQixFQUE2QixRQUE3QixFQUF1Q3NDLE9BQXZDLENBQStDLFVBQUNDLEdBQUQsRUFBUztBQUN0RCxnQkFBSW5DLE9BQU9DLElBQVAsQ0FBWWdDLEdBQVosRUFBaUJ6QixPQUFqQixDQUF5QjJCLEdBQXpCLElBQStCLENBQUMsQ0FBcEMsRUFBdUM7QUFDckNGLGtCQUFPRSxHQUFQLGlCQUF3QkYsSUFBSUUsR0FBSixFQUFTQyxZQUFqQztBQUNBSCxrQkFBT0UsR0FBUCxtQkFBMEJGLElBQUlFLEdBQUosRUFBU0UsU0FBbkM7QUFDQUosa0JBQUlFLEdBQUosSUFBV0YsSUFBSUUsR0FBSixFQUFTRyxnQkFBcEI7QUFDRDtBQUNGLFdBTkQ7QUFPRDs7QUFFRCxlQUFPTCxHQUFQO0FBQ0Q7QUFwS2U7QUFBQTtBQUFBLHdDQXNLRTdDLElBdEtGLEVBc0tRTyxJQXRLUixFQXNLYztBQUM1QixZQUFJQSxLQUFLQyxJQUFMLElBQWEsU0FBakIsRUFBNEI7QUFDMUIsV0FBQyxHQUFELEVBQU0sR0FBTixFQUFXLE9BQVgsRUFBbUIsU0FBbkIsRUFBNkIsUUFBN0IsRUFBdUNzQyxPQUF2QyxDQUErQyxVQUFDQyxHQUFELEVBQVM7QUFDdEQsZ0JBQUluQyxPQUFPQyxJQUFQLENBQVliLElBQVosRUFBa0JvQixPQUFsQixDQUEwQjJCLEdBQTFCLElBQWlDLENBQUMsQ0FBdEMsRUFBeUM7QUFDdkMvQyxtQkFBSytDLEdBQUwsSUFBWTtBQUNWRyxrQ0FBa0JsRCxLQUFLK0MsR0FBTCxDQURSO0FBRVZDLDhCQUFjaEQsS0FBUStDLEdBQVIsY0FGSjtBQUdWRSwyQkFBV2pELEtBQVErQyxHQUFSO0FBSEQsZUFBWjtBQUtBLHFCQUFPL0MsS0FBUStDLEdBQVIsY0FBUDtBQUNBLHFCQUFPL0MsS0FBUStDLEdBQVIsZ0JBQVA7QUFDRDtBQUNGLFdBVkQ7QUFXRDtBQUNELGVBQU8vQyxJQUFQO0FBQ0Q7QUFyTGU7QUFBQTtBQUFBLGtDQXVMSkYsSUF2TEksRUF1TEVTLElBdkxGLEVBdUxRO0FBQ3RCLFlBQUlBLEtBQUtVLE1BQUwsQ0FBWWtDLFNBQVosSUFBeUIsU0FBN0IsRUFBd0M7QUFDdEM7QUFDQSxjQUFJdkMsT0FBT0MsSUFBUCxDQUFZL0IsY0FBWixFQUE0QnNDLE9BQTVCLENBQW9DYixLQUFLVSxNQUFMLENBQVltQyxhQUFaLENBQTBCQyxxQkFBOUQsS0FBc0YsQ0FBQyxDQUEzRixFQUE4RjtBQUM1RkMsb0JBQVFDLEdBQVIsQ0FBWSxrQkFBWjtBQUNELFdBRkQsTUFFTztBQUNMLGdCQUFJQyxhQUFhLENBQWpCO0FBQ0EsZ0JBQUlDLGFBQWEsSUFBakI7QUFDQSxnQkFBSUMsZUFBZTVFLGVBQWV5QixLQUFLVSxNQUFMLENBQVltQyxhQUFaLENBQTBCQyxxQkFBekMsRUFBZ0VwQyxNQUFuRjtBQUNBTCxtQkFBT0MsSUFBUCxDQUFZNkMsWUFBWixFQUEwQlosT0FBMUIsQ0FBa0MsZUFBTztBQUNyQyxrQkFBSUMsSUFBSXpCLFdBQUosR0FBa0JxQyxLQUFsQixDQUF3QixRQUF4QixDQUFKLEVBQXVDO0FBQ3JDSCw4QkFBYyxDQUFkO0FBQ0FDLDZCQUFhVixHQUFiO0FBQ0Q7QUFDRixhQUxIOztBQU9BLGdCQUFJUyxjQUFjLENBQWxCLEVBQXFCO0FBQ25CLGtCQUFJSSxhQUFhO0FBQ2ZDLDJCQUFXdEQsS0FBS3NCLEtBREQ7QUFFZmlDLHdCQUFRO0FBRk8sZUFBakI7QUFJRCxhQUxELE1BS087QUFDTCxrQkFBSUosYUFBYUQsVUFBYixFQUF5Qk0saUJBQXpCLElBQThDLENBQWxELEVBQXFEO0FBQ25ELG9CQUFJSCxhQUFhO0FBQ2ZDLDZCQUFXdEQsS0FBS3NCLEtBREQ7QUFFZmlDLDBCQUFRO0FBRk8saUJBQWpCO0FBSUQsZUFMRCxNQUtPO0FBQ0wsb0JBQUlGLGFBQWE7QUFDZkMsNkJBQVd0RCxLQUFLc0IsS0FERDtBQUVmaUMsMEJBQVE7QUFGTyxpQkFBakI7QUFJRDtBQUNGO0FBRUY7O0FBRUQsaUJBQVEsSUFBSWpGLFNBQUosQ0FBYytFLFVBQWQsQ0FBRCxDQUE0QjlELElBQTVCLEVBQVA7QUFDRDtBQUNELGVBQU9BLElBQVA7QUFDRDtBQS9OZTs7QUFBQTtBQUFBLElBZ0JlckIsTUFoQmY7O0FBa09sQixTQUFPTSxrQkFBUDtBQUNELENBbk9EIiwiZmlsZSI6Im1vZHVsZS9ldWdsZW5hL21vZGVsX2Jsb2NrbHkvbW9kdWxlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiZGVmaW5lKChyZXF1aXJlKSA9PiB7XG4gIGNvbnN0IFV0aWxzID0gcmVxdWlyZSgnY29yZS91dGlsL3V0aWxzJyksXG4gICAgR2xvYmFscyA9IHJlcXVpcmUoJ2NvcmUvbW9kZWwvZ2xvYmFscycpLFxuICAgIEhNID0gcmVxdWlyZSgnY29yZS9ldmVudC9ob29rX21hbmFnZXInKTtcblxuICBjb25zdCBNb2R1bGUgPSByZXF1aXJlKCdjb3JlL2FwcC9tb2R1bGUnKSxcbiAgICBNb2RlbGluZ0RhdGFUYWIgPSByZXF1aXJlKCcuL2Jsb2NrbHl0YWIvdGFiJyksXG4gICAgLy9TeW1TbGlkZXJGaWVsZCA9IHJlcXVpcmUoJ2NvcmUvY29tcG9uZW50L3N5bXNsaWRlcmZpZWxkL2ZpZWxkJyksXG4gICAgLy9TbGlkZXJGaWVsZCA9IHJlcXVpcmUoJ2NvcmUvY29tcG9uZW50L3NsaWRlcmZpZWxkL2ZpZWxkJyksXG4gICAgU2VsZWN0RmllbGQgPSByZXF1aXJlKCdjb3JlL2NvbXBvbmVudC9zZWxlY3RmaWVsZC9maWVsZCcpLFxuICAgIFN5bVNlbGVjdEZpZWxkID0gcmVxdWlyZSgnY29yZS9jb21wb25lbnQvc3ltc2VsZWN0ZmllbGQvZmllbGQnKSxcbiAgICBNb2RlbFZpZXcgPSByZXF1aXJlKCcuL3RocmVldmlldycpO1xuXG4gIGNvbnN0IGRlZmF1bHRDb25maWdzID0gcmVxdWlyZSgnLi9ib2R5Q29uZmlndXJhdGlvbnMvYm9keWNvbmZpZ3MvbGlzdG9mY29uZmlncycpXG5cblxuICBjbGFzcyBNb2RlbGluZ0RhdGFNb2R1bGUgZXh0ZW5kcyBNb2R1bGUge1xuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgc3VwZXIoKTtcbiAgICAgIGlmIChHbG9iYWxzLmdldCgnQXBwQ29uZmlnLm1vZGVsaW5nJykpIHtcbiAgICAgICAgICBVdGlscy5iaW5kTWV0aG9kcyh0aGlzLCBbJ19vblBoYXNlQ2hhbmdlJywgJ19vbkV4cGVyaW1lbnRDb3VudENoYW5nZScsXG4gICAgICAgICdfaG9va01vZGVsRmllbGRzJywgJ19ob29rTW9kaWZ5RXhwb3J0JywgJ19ob29rTW9kaWZ5SW1wb3J0JywgJ19ob29rM2RWaWV3J10pXG5cbiAgICAgICAgaWYgKEdsb2JhbHMuZ2V0KCdBcHBDb25maWcubW9kZWwudGFicycpLmxlbmd0aCkge1xuICAgICAgICAgIHRoaXMudGFiID0gbmV3IE1vZGVsaW5nRGF0YVRhYigpO1xuICAgICAgICAgIEdsb2JhbHMuZ2V0KCdSZWxheScpLmFkZEV2ZW50TGlzdGVuZXIoJ0FwcFBoYXNlLkNoYW5nZScsIHRoaXMuX29uUGhhc2VDaGFuZ2UpXG4gICAgICAgICAgR2xvYmFscy5nZXQoJ1JlbGF5JykuYWRkRXZlbnRMaXN0ZW5lcignRXhwZXJpbWVudENvdW50LkNoYW5nZScsIHRoaXMuX29uRXhwZXJpbWVudENvdW50Q2hhbmdlKVxuXG4gICAgICAgIH1cblxuICAgICAgICBITS5ob29rKCdNb2RlbEZvcm0uRmllbGRzJywgdGhpcy5faG9va01vZGVsRmllbGRzKTtcbiAgICAgICAgSE0uaG9vaygnTW9kZWxGb3JtLk1vZGlmeUV4cG9ydCcsIHRoaXMuX2hvb2tNb2RpZnlFeHBvcnQpO1xuICAgICAgICBITS5ob29rKCdNb2RlbEZvcm0uTW9kaWZ5SW1wb3J0JywgdGhpcy5faG9va01vZGlmeUltcG9ydCk7XG4gICAgICAgIEhNLmhvb2soJ0V1Z2xlbmEuM2RWaWV3JywgdGhpcy5faG9vazNkVmlldylcblxuICAgICAgfVxuICAgIH1cblxuICAgIHJ1bigpIHtcbiAgICAgIGlmICh0aGlzLnRhYikgR2xvYmFscy5nZXQoJ0xheW91dCcpLmdldFBhbmVsKCdyZXN1bHQnKS5hZGRDb250ZW50KHRoaXMudGFiLnZpZXcoKSlcbiAgICB9XG5cbiAgICBfb25QaGFzZUNoYW5nZShldnQpIHtcbiAgICAgIGlmIChldnQuZGF0YS5waGFzZSA9PSBcImxvZ2luXCIgfHwgZXZ0LmRhdGEucGhhc2UgPT0gXCJsb2dpbl9hdHRlbXB0ZWRcIikge1xuICAgICAgICB0aGlzLnRhYi5oaWRlKCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgX29uRXhwZXJpbWVudENvdW50Q2hhbmdlKGV2dCkge1xuICAgICAgaWYgKGV2dC5kYXRhLmNvdW50ICYmICFldnQuZGF0YS5vbGQpIHtcbiAgICAgICAgdGhpcy50YWIuc2hvdygpO1xuICAgICAgfSBlbHNlIGlmICghZXZ0LmRhdGEuY291bnQpIHtcbiAgICAgICAgdGhpcy50YWIuaGlkZSgpO1xuICAgICAgfVxuICAgIH1cblxuICAgIF9ob29rTW9kZWxGaWVsZHMoZmllbGRzLCBtZXRhKSB7XG4gICAgICBpZiAobWV0YS50eXBlID09IFwiYmxvY2tseVwiKSB7XG4gICAgICAgIHZhciBib2R5Q29uZmlncyA9IEFycmF5LmFwcGx5KG51bGwsIHtsZW5ndGg6T2JqZWN0LmtleXMoZGVmYXVsdENvbmZpZ3MpLmxlbmd0aH0pLm1hcCgobnVtYmVyLGluZCkgPT4gJ3NlbnNvckNvbmZpZ18nICsgKGluZCsxKSk7XG4gICAgICAgIC8vIEZpbHRlciBvdXQgdGhlIG9wdGlvbnMgdGhhdCBhcmUgbm90IGluIGFsbG93ZWRDb25maWdzXG4gICAgICAgIGlmIChtZXRhLmNvbmZpZy5hbGxvd2VkQ29uZmlncy5sZW5ndGgpIHtcbiAgICAgICAgICBmb3IgKGxldCBpZHggPSBib2R5Q29uZmlncy5sZW5ndGggLSAxOyBpZHggPj0gMDsgaWR4LS0pIHtcbiAgICAgICAgICAgIGlmICgobWV0YS5jb25maWcuYWxsb3dlZENvbmZpZ3MuaW5kZXhPZihkZWZhdWx0Q29uZmlnc1tib2R5Q29uZmlnc1tpZHhdXS5pZC50b0xvd2VyQ2FzZSgpKSA9PSAtMSkpIHtcbiAgICAgICAgICAgICAgYm9keUNvbmZpZ3Muc3BsaWNlKGlkeCwxKVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICB0aGlzLmJvZHlDb25maWdPcHRpb25zID0ge31cbiAgICAgICAgYm9keUNvbmZpZ3MubWFwKGJvZHljb25maWcgPT4gdGhpcy5ib2R5Q29uZmlnT3B0aW9uc1tib2R5Y29uZmlnXSA9IGRlZmF1bHRDb25maWdzW2JvZHljb25maWddWydpZCddKVxuICAgICAgICBmaWVsZHMgPSBmaWVsZHMuY29uY2F0KFtTZWxlY3RGaWVsZC5jcmVhdGUoe1xuICAgICAgICAgICAgaWQ6IFwiYm9keUNvbmZpZ3VyYXRpb25OYW1lXCIsXG4gICAgICAgICAgICBpbnZlcnNlX29yZGVyOiB0cnVlLFxuICAgICAgICAgICAgY29sb3I6IG1ldGEuY29uZmlnLmJvZHlDb25maWd1cmF0aW9uLmNvbG9yID8gbWV0YS5jb25maWcuYm9keUNvbmZpZ3VyYXRpb24uY29sb3IgOiBudWxsLFxuICAgICAgICAgICAgbGFiZWw6IG1ldGEuY29uZmlnLmJvZHlDb25maWd1cmF0aW9uLmxhYmVsLFxuICAgICAgICAgICAgdmFsdWU6IG1ldGEuY29uZmlnLmJvZHlDb25maWd1cmF0aW9uLmluaXRpYWxWYWx1ZSxcbiAgICAgICAgICAgIG1pbl93aWR0aDogbWV0YS5jb25maWcuYm9keUNvbmZpZ3VyYXRpb24ubWluX3dpZHRoLFxuICAgICAgICAgICAgZGVzY3JpcHRpb246IG1ldGEuY29uZmlnLmJvZHlDb25maWd1cmF0aW9uLmRlc2NyaXB0aW9uLFxuICAgICAgICAgICAgY2xhc3NlczogW10sXG4gICAgICAgICAgICBvcHRpb25zOiB0aGlzLmJvZHlDb25maWdPcHRpb25zXG4gICAgICAgICAgfSksIFN5bVNlbGVjdEZpZWxkLmNyZWF0ZSh7XG4gICAgICAgICAgICBpZDogJ3YnLFxuICAgICAgICAgICAgaW52ZXJzZV9vcmRlcjogdHJ1ZSxcbiAgICAgICAgICAgIHZhck9wdGlvbnM6IG1ldGEuY29uZmlnLnYudmFyT3B0aW9ucyxcbiAgICAgICAgICAgIGxhYmVsOiBtZXRhLmNvbmZpZy52LmxhYmVsLFxuICAgICAgICAgICAgY29sb3I6IG1ldGEuY29uZmlnLnYuY29sb3IgPyBtZXRhLmNvbmZpZy52LmNvbG9yIDogbnVsbCxcbiAgICAgICAgICAgIHZhbHVlOiBtZXRhLmNvbmZpZy52LmluaXRpYWxWYWx1ZSxcbiAgICAgICAgICAgIG1heFZhbHVlOiBtZXRhLmNvbmZpZy52Lm1heFZhbHVlLFxuICAgICAgICAgICAgZGVzY3JpcHRpb246IG1ldGEuY29uZmlnLnYuZGVzY3JpcHRpb24sXG4gICAgICAgICAgICBjbGFzc2VzOiBbXSxcbiAgICAgICAgICAgIG9wdGlvbnM6IG1ldGEuY29uZmlnLnYub3B0aW9uc1xuICAgICAgICAgIH0pLCBTeW1TZWxlY3RGaWVsZC5jcmVhdGUoe1xuICAgICAgICAgICAgaWQ6ICdrJyxcbiAgICAgICAgICAgIGludmVyc2Vfb3JkZXI6IHRydWUsXG4gICAgICAgICAgICB2YXJPcHRpb25zOiBtZXRhLmNvbmZpZy5LLnZhck9wdGlvbnMsXG4gICAgICAgICAgICBsYWJlbDogbWV0YS5jb25maWcuSy5sYWJlbCxcbiAgICAgICAgICAgIGNvbG9yOiBtZXRhLmNvbmZpZy5LLmNvbG9yID8gbWV0YS5jb25maWcuSy5jb2xvciA6IG51bGwsXG4gICAgICAgICAgICB2YWx1ZTogbWV0YS5jb25maWcuSy5pbml0aWFsVmFsdWUsXG4gICAgICAgICAgICBtYXhWYWx1ZTogbWV0YS5jb25maWcuSy5tYXhWYWx1ZSxcbiAgICAgICAgICAgIGRlc2NyaXB0aW9uOiBtZXRhLmNvbmZpZy5LLmRlc2NyaXB0aW9uLFxuICAgICAgICAgICAgY2xhc3NlczogW10sXG4gICAgICAgICAgICBvcHRpb25zOiBtZXRhLmNvbmZpZy5LLm9wdGlvbnNcbiAgICAgICAgICB9KVxuICAgICAgICBdKVxuXG4gICAgICAgIC8vIEFkZCBlaXRoZXIgcm9sbCBvciBtb3Rpb24gdHlwZSBvcHRpb25cbiAgICAgICAgaWYgKG1ldGEuY29uZmlnLm9tZWdhKSB7XG4gICAgICAgICAgZmllbGRzLnNwbGljZSgzLDAsU3ltU2VsZWN0RmllbGQuY3JlYXRlKHtcbiAgICAgICAgICAgIGlkOiAnb21lZ2EnLFxuICAgICAgICAgICAgaW52ZXJzZV9vcmRlcjogdHJ1ZSxcbiAgICAgICAgICAgIHZhck9wdGlvbnM6IG1ldGEuY29uZmlnLm9tZWdhLnZhck9wdGlvbnMsXG4gICAgICAgICAgICBsYWJlbDogbWV0YS5jb25maWcub21lZ2EubGFiZWwsXG4gICAgICAgICAgICBjb2xvcjogbWV0YS5jb25maWcub21lZ2EuY29sb3IgPyBtZXRhLmNvbmZpZy5vbWVnYS5jb2xvciA6IG51bGwsXG4gICAgICAgICAgICB2YWx1ZTogbWV0YS5jb25maWcub21lZ2EuaW5pdGlhbFZhbHVlLFxuICAgICAgICAgICAgbWF4VmFsdWU6IG1ldGEuY29uZmlnLm9tZWdhLm1heFZhbHVlLFxuICAgICAgICAgICAgZGVzY3JpcHRpb246IG1ldGEuY29uZmlnLm9tZWdhLmRlc2NyaXB0aW9uLFxuICAgICAgICAgICAgY2xhc3NlczogW10sXG4gICAgICAgICAgICBvcHRpb25zOiBtZXRhLmNvbmZpZy5vbWVnYS5vcHRpb25zXG4gICAgICAgICAgfSkpXG4gICAgICAgIH0gZWxzZSBpZiAobWV0YS5jb25maWcubW90aW9uKSB7XG4gICAgICAgICAgZmllbGRzLnNwbGljZSgzLDAsU3ltU2VsZWN0RmllbGQuY3JlYXRlKHtcbiAgICAgICAgICAgIGlkOiAnbW90aW9uJyxcbiAgICAgICAgICAgIGludmVyc2Vfb3JkZXI6IHRydWUsXG4gICAgICAgICAgICBsYWJlbDogbWV0YS5jb25maWcubW90aW9uLmxhYmVsLFxuICAgICAgICAgICAgY29sb3I6IG1ldGEuY29uZmlnLm1vdGlvbi5jb2xvciA/IG1ldGEuY29uZmlnLm1vdGlvbi5jb2xvciA6IG51bGwsXG4gICAgICAgICAgICB2YWx1ZTogbWV0YS5jb25maWcubW90aW9uLmluaXRpYWxWYWx1ZSxcbiAgICAgICAgICAgIG1heFZhbHVlOiBtZXRhLmNvbmZpZy5tb3Rpb24ubWF4VmFsdWUsXG4gICAgICAgICAgICBkZXNjcmlwdGlvbjogbWV0YS5jb25maWcubW90aW9uLmRlc2NyaXB0aW9uLFxuICAgICAgICAgICAgY2xhc3NlczogW10sXG4gICAgICAgICAgICBvcHRpb25zOiBtZXRhLmNvbmZpZy5tb3Rpb24ub3B0aW9uc1xuICAgICAgICAgIH0pKVxuICAgICAgICB9XG5cbiAgICAgICAgLy8gQWRkIG9wYWNpdHlcbiAgICAgICAgaWYgKG1ldGEuY29uZmlnLm9wYWNpdHkpIHtcbiAgICAgICAgICBmaWVsZHMuc3BsaWNlKDEsMCxTeW1TZWxlY3RGaWVsZC5jcmVhdGUoe1xuICAgICAgICAgICAgaWQ6ICdvcGFjaXR5JyxcbiAgICAgICAgICAgIGludmVyc2Vfb3JkZXI6IHRydWUsXG4gICAgICAgICAgICB2YXJPcHRpb25zOiBtZXRhLmNvbmZpZy5vcGFjaXR5LnZhck9wdGlvbnMsXG4gICAgICAgICAgICBsYWJlbDogbWV0YS5jb25maWcub3BhY2l0eS5sYWJlbCxcbiAgICAgICAgICAgIGNvbG9yOiBtZXRhLmNvbmZpZy5vcGFjaXR5LmNvbG9yID8gbWV0YS5jb25maWcub3BhY2l0eS5jb2xvciA6IG51bGwsXG4gICAgICAgICAgICB2YWx1ZTogbWV0YS5jb25maWcub3BhY2l0eS5pbml0aWFsVmFsdWUsXG4gICAgICAgICAgICBtYXhWYWx1ZTogbWV0YS5jb25maWcub3BhY2l0eS5tYXhWYWx1ZSxcbiAgICAgICAgICAgIGRlc2NyaXB0aW9uOiBtZXRhLmNvbmZpZy5vcGFjaXR5LmRlc2NyaXB0aW9uLFxuICAgICAgICAgICAgY2xhc3NlczogW10sXG4gICAgICAgICAgICBvcHRpb25zOiBtZXRhLmNvbmZpZy5vcGFjaXR5Lm9wdGlvbnNcbiAgICAgICAgICB9KSlcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmV0dXJuIGZpZWxkcztcbiAgICB9XG5cbiAgICBfaG9va01vZGlmeUV4cG9ydChleHAsIG1ldGEpIHtcblxuICAgICAgaWYgKG1ldGEudHlwZSA9PSBcImJsb2NrbHlcIikge1xuICAgICAgICBbJ2snLCAndicsICdvbWVnYScsJ29wYWNpdHknLCdtb3Rpb24nXS5mb3JFYWNoKChrZXkpID0+IHtcbiAgICAgICAgICBpZiAoT2JqZWN0LmtleXMoZXhwKS5pbmRleE9mKGtleSkgPi0xKSB7XG4gICAgICAgICAgICBleHBbYCR7a2V5fV9udW1lcmljYF0gPSBleHBba2V5XS5udW1lcmljVmFsdWU7XG4gICAgICAgICAgICBleHBbYCR7a2V5fV92YXJpYXRpb25gXSA9IGV4cFtrZXldLnZhcmlhdGlvbjtcbiAgICAgICAgICAgIGV4cFtrZXldID0gZXhwW2tleV0ucXVhbGl0YXRpdmVWYWx1ZTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pXG4gICAgICB9XG5cbiAgICAgIHJldHVybiBleHBcbiAgICB9XG5cbiAgICBfaG9va01vZGlmeUltcG9ydChkYXRhLCBtZXRhKSB7XG4gICAgICBpZiAobWV0YS50eXBlID09IFwiYmxvY2tseVwiKSB7XG4gICAgICAgIFsnaycsICd2JywgJ29tZWdhJywnb3BhY2l0eScsJ21vdGlvbiddLmZvckVhY2goKGtleSkgPT4ge1xuICAgICAgICAgIGlmIChPYmplY3Qua2V5cyhkYXRhKS5pbmRleE9mKGtleSkgPiAtMSkge1xuICAgICAgICAgICAgZGF0YVtrZXldID0ge1xuICAgICAgICAgICAgICBxdWFsaXRhdGl2ZVZhbHVlOiBkYXRhW2tleV0sXG4gICAgICAgICAgICAgIG51bWVyaWNWYWx1ZTogZGF0YVtgJHtrZXl9X251bWVyaWNgXSxcbiAgICAgICAgICAgICAgdmFyaWF0aW9uOiBkYXRhW2Ake2tleX1fdmFyaWF0aW9uYF1cbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICBkZWxldGUgZGF0YVtgJHtrZXl9X251bWVyaWNgXTtcbiAgICAgICAgICAgIGRlbGV0ZSBkYXRhW2Ake2tleX1fdmFyaWF0aW9uYF07XG4gICAgICAgICAgfVxuICAgICAgICB9KVxuICAgICAgfVxuICAgICAgcmV0dXJuIGRhdGE7XG4gICAgfVxuXG4gICAgX2hvb2szZFZpZXcodmlldywgbWV0YSkge1xuICAgICAgaWYgKG1ldGEuY29uZmlnLm1vZGVsVHlwZSA9PSBcImJsb2NrbHlcIikge1xuICAgICAgICAvLyBIZXJlLCBleHRyYWN0IHRoZSBudW1iZXIgb2YgZXllc1xuICAgICAgICBpZiAoT2JqZWN0LmtleXMoZGVmYXVsdENvbmZpZ3MpLmluZGV4T2YobWV0YS5jb25maWcuY29uZmlndXJhdGlvbi5ib2R5Q29uZmlndXJhdGlvbk5hbWUpPT0tMSkge1xuICAgICAgICAgIGNvbnNvbGUubG9nKCd0aGlzIGlzIG5vdCBnb29kJylcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB2YXIgbnVtU2Vuc29ycyA9IDA7XG4gICAgICAgICAgdmFyIHNlbnNvck5hbWUgPSBudWxsO1xuICAgICAgICAgIHZhciBzZW5zb3JDb25maWcgPSBkZWZhdWx0Q29uZmlnc1ttZXRhLmNvbmZpZy5jb25maWd1cmF0aW9uLmJvZHlDb25maWd1cmF0aW9uTmFtZV0uY29uZmlnO1xuICAgICAgICAgIE9iamVjdC5rZXlzKHNlbnNvckNvbmZpZykuZm9yRWFjaChrZXkgPT4ge1xuICAgICAgICAgICAgICBpZiAoa2V5LnRvTG93ZXJDYXNlKCkubWF0Y2goJ3NlbnNvcicpKSB7XG4gICAgICAgICAgICAgICAgbnVtU2Vuc29ycyArPSAxO1xuICAgICAgICAgICAgICAgIHNlbnNvck5hbWUgPSBrZXk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pXG5cbiAgICAgICAgICBpZiAobnVtU2Vuc29ycyA9PSAyKSB7XG4gICAgICAgICAgICB2YXIgYmFzZUNvbmZpZyA9IHtcbiAgICAgICAgICAgICAgYmFzZUNvbG9yOiBtZXRhLmNvbG9yLFxuICAgICAgICAgICAgICBhZGRFeWU6ICdib3RoJ1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBpZiAoc2Vuc29yQ29uZmlnW3NlbnNvck5hbWVdLnNlbnNvck9yaWVudGF0aW9uID09IDApIHtcbiAgICAgICAgICAgICAgdmFyIGJhc2VDb25maWcgPSB7XG4gICAgICAgICAgICAgICAgYmFzZUNvbG9yOiBtZXRhLmNvbG9yLFxuICAgICAgICAgICAgICAgIGFkZEV5ZTogJ3JpZ2h0J1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICB2YXIgYmFzZUNvbmZpZyA9IHtcbiAgICAgICAgICAgICAgICBiYXNlQ29sb3I6IG1ldGEuY29sb3IsXG4gICAgICAgICAgICAgICAgYWRkRXllOiAnbGVmdCdcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cblxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIChuZXcgTW9kZWxWaWV3KGJhc2VDb25maWcpKS52aWV3KClcbiAgICAgIH1cbiAgICAgIHJldHVybiB2aWV3O1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiBNb2RlbGluZ0RhdGFNb2R1bGU7XG59KVxuIl19
