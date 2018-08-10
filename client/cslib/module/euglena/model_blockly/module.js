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
        } else if (!evt.data.count && Globals.get('blocklyLoaded')) {
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
          }); // MAKE SURE THE INITIAL ONE IS WORKING TOO
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9ldWdsZW5hL21vZGVsX2Jsb2NrbHkvbW9kdWxlLmpzIl0sIm5hbWVzIjpbImRlZmluZSIsInJlcXVpcmUiLCJVdGlscyIsIkdsb2JhbHMiLCJITSIsIk1vZHVsZSIsIk1vZGVsaW5nRGF0YVRhYiIsIlNlbGVjdEZpZWxkIiwiU3ltU2VsZWN0RmllbGQiLCJNb2RlbFZpZXciLCJkZWZhdWx0Q29uZmlncyIsIk1vZGVsaW5nRGF0YU1vZHVsZSIsImdldCIsImJpbmRNZXRob2RzIiwibGVuZ3RoIiwidGFiIiwiYWRkRXZlbnRMaXN0ZW5lciIsIl9vblBoYXNlQ2hhbmdlIiwiX29uRXhwZXJpbWVudENvdW50Q2hhbmdlIiwiaG9vayIsIl9ob29rTW9kZWxGaWVsZHMiLCJfaG9va01vZGlmeUV4cG9ydCIsIl9ob29rTW9kaWZ5SW1wb3J0IiwiX2hvb2szZFZpZXciLCJnZXRQYW5lbCIsImFkZENvbnRlbnQiLCJ2aWV3IiwiZXZ0IiwiZGF0YSIsInBoYXNlIiwiaGlkZSIsImNvdW50Iiwib2xkIiwic2hvdyIsImZpZWxkcyIsIm1ldGEiLCJ0eXBlIiwiYm9keUNvbmZpZ3MiLCJBcnJheSIsImFwcGx5IiwiT2JqZWN0Iiwia2V5cyIsIm1hcCIsIm51bWJlciIsImluZCIsImNvbmZpZyIsImFsbG93ZWRDb25maWdzIiwiaWR4IiwiaW5kZXhPZiIsImlkIiwidG9Mb3dlckNhc2UiLCJzcGxpY2UiLCJib2R5Q29uZmlnT3B0aW9ucyIsImJvZHljb25maWciLCJjb25jYXQiLCJjcmVhdGUiLCJpbnZlcnNlX29yZGVyIiwiY29sb3IiLCJib2R5Q29uZmlndXJhdGlvbiIsImxhYmVsIiwidmFsdWUiLCJpbml0aWFsVmFsdWUiLCJtaW5fd2lkdGgiLCJkZXNjcmlwdGlvbiIsImNsYXNzZXMiLCJvcHRpb25zIiwidmFyT3B0aW9ucyIsInYiLCJtYXhWYWx1ZSIsIksiLCJvbWVnYSIsIm1vdGlvbiIsIm9wYWNpdHkiLCJleHAiLCJmb3JFYWNoIiwia2V5IiwibnVtZXJpY1ZhbHVlIiwidmFyaWF0aW9uIiwicXVhbGl0YXRpdmVWYWx1ZSIsIm1vZGVsVHlwZSIsImNvbmZpZ3VyYXRpb24iLCJib2R5Q29uZmlndXJhdGlvbk5hbWUiLCJjb25zb2xlIiwibG9nIiwibnVtU2Vuc29ycyIsInNlbnNvck5hbWUiLCJzZW5zb3JDb25maWciLCJtYXRjaCIsImJhc2VDb25maWciLCJiYXNlQ29sb3IiLCJhZGRFeWUiLCJzZW5zb3JPcmllbnRhdGlvbiJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBQSxPQUFPLFVBQUNDLE9BQUQsRUFBYTtBQUNsQixNQUFNQyxRQUFRRCxRQUFRLGlCQUFSLENBQWQ7QUFBQSxNQUNFRSxVQUFVRixRQUFRLG9CQUFSLENBRFo7QUFBQSxNQUVFRyxLQUFLSCxRQUFRLHlCQUFSLENBRlA7O0FBSUEsTUFBTUksU0FBU0osUUFBUSxpQkFBUixDQUFmO0FBQUEsTUFDRUssa0JBQWtCTCxRQUFRLGtCQUFSLENBRHBCOztBQUVFO0FBQ0E7QUFDQU0sZ0JBQWNOLFFBQVEsa0NBQVIsQ0FKaEI7QUFBQSxNQUtFTyxpQkFBaUJQLFFBQVEscUNBQVIsQ0FMbkI7QUFBQSxNQU1FUSxZQUFZUixRQUFRLGFBQVIsQ0FOZDs7QUFRQSxNQUFNUyxpQkFBaUJULFFBQVEsZ0RBQVIsQ0FBdkI7O0FBYmtCLE1BZ0JaVSxrQkFoQlk7QUFBQTs7QUFpQmhCLGtDQUFjO0FBQUE7O0FBQUE7O0FBRVosVUFBSVIsUUFBUVMsR0FBUixDQUFZLG9CQUFaLENBQUosRUFBdUM7QUFDbkNWLGNBQU1XLFdBQU4sUUFBd0IsQ0FBQyxnQkFBRCxFQUFtQiwwQkFBbkIsRUFDMUIsa0JBRDBCLEVBQ04sbUJBRE0sRUFDZSxtQkFEZixFQUNvQyxhQURwQyxDQUF4Qjs7QUFHRixZQUFJVixRQUFRUyxHQUFSLENBQVksc0JBQVosRUFBb0NFLE1BQXhDLEVBQWdEO0FBQzlDLGdCQUFLQyxHQUFMLEdBQVcsSUFBSVQsZUFBSixFQUFYO0FBQ0FILGtCQUFRUyxHQUFSLENBQVksT0FBWixFQUFxQkksZ0JBQXJCLENBQXNDLGlCQUF0QyxFQUF5RCxNQUFLQyxjQUE5RDtBQUNBZCxrQkFBUVMsR0FBUixDQUFZLE9BQVosRUFBcUJJLGdCQUFyQixDQUFzQyx3QkFBdEMsRUFBZ0UsTUFBS0Usd0JBQXJFO0FBRUQ7O0FBRURkLFdBQUdlLElBQUgsQ0FBUSxrQkFBUixFQUE0QixNQUFLQyxnQkFBakM7QUFDQWhCLFdBQUdlLElBQUgsQ0FBUSx3QkFBUixFQUFrQyxNQUFLRSxpQkFBdkM7QUFDQWpCLFdBQUdlLElBQUgsQ0FBUSx3QkFBUixFQUFrQyxNQUFLRyxpQkFBdkM7QUFDQWxCLFdBQUdlLElBQUgsQ0FBUSxnQkFBUixFQUEwQixNQUFLSSxXQUEvQjtBQUVEO0FBbEJXO0FBbUJiOztBQXBDZTtBQUFBO0FBQUEsNEJBc0NWO0FBQ0osWUFBSSxLQUFLUixHQUFULEVBQWNaLFFBQVFTLEdBQVIsQ0FBWSxRQUFaLEVBQXNCWSxRQUF0QixDQUErQixRQUEvQixFQUF5Q0MsVUFBekMsQ0FBb0QsS0FBS1YsR0FBTCxDQUFTVyxJQUFULEVBQXBEO0FBQ2Y7QUF4Q2U7QUFBQTtBQUFBLHFDQTBDREMsR0ExQ0MsRUEwQ0k7QUFDbEIsWUFBSUEsSUFBSUMsSUFBSixDQUFTQyxLQUFULElBQWtCLE9BQWxCLElBQTZCRixJQUFJQyxJQUFKLENBQVNDLEtBQVQsSUFBa0IsaUJBQW5ELEVBQXNFO0FBQ3BFLGVBQUtkLEdBQUwsQ0FBU2UsSUFBVDtBQUNEO0FBQ0Y7QUE5Q2U7QUFBQTtBQUFBLCtDQWdEU0gsR0FoRFQsRUFnRGM7QUFDNUIsWUFBSUEsSUFBSUMsSUFBSixDQUFTRyxLQUFULElBQWtCLENBQUNKLElBQUlDLElBQUosQ0FBU0ksR0FBaEMsRUFBcUM7QUFDbkMsZUFBS2pCLEdBQUwsQ0FBU2tCLElBQVQ7QUFDRCxTQUZELE1BRU8sSUFBSSxDQUFDTixJQUFJQyxJQUFKLENBQVNHLEtBQVYsSUFBbUI1QixRQUFRUyxHQUFSLENBQVksZUFBWixDQUF2QixFQUFxRDtBQUMxRCxlQUFLRyxHQUFMLENBQVNlLElBQVQ7QUFDRDtBQUNGO0FBdERlO0FBQUE7QUFBQSx1Q0F3RENJLE1BeERELEVBd0RTQyxJQXhEVCxFQXdEZTtBQUFBOztBQUM3QixZQUFJQSxLQUFLQyxJQUFMLElBQWEsU0FBakIsRUFBNEI7QUFDMUIsY0FBSUMsY0FBY0MsTUFBTUMsS0FBTixDQUFZLElBQVosRUFBa0IsRUFBQ3pCLFFBQU8wQixPQUFPQyxJQUFQLENBQVkvQixjQUFaLEVBQTRCSSxNQUFwQyxFQUFsQixFQUErRDRCLEdBQS9ELENBQW1FLFVBQUNDLE1BQUQsRUFBUUMsR0FBUjtBQUFBLG1CQUFnQixtQkFBbUJBLE1BQUksQ0FBdkIsQ0FBaEI7QUFBQSxXQUFuRSxDQUFsQjtBQUNBO0FBQ0EsY0FBSVQsS0FBS1UsTUFBTCxDQUFZQyxjQUFaLENBQTJCaEMsTUFBL0IsRUFBdUM7QUFDckMsaUJBQUssSUFBSWlDLE1BQU1WLFlBQVl2QixNQUFaLEdBQXFCLENBQXBDLEVBQXVDaUMsT0FBTyxDQUE5QyxFQUFpREEsS0FBakQsRUFBd0Q7QUFDdEQsa0JBQUtaLEtBQUtVLE1BQUwsQ0FBWUMsY0FBWixDQUEyQkUsT0FBM0IsQ0FBbUN0QyxlQUFlMkIsWUFBWVUsR0FBWixDQUFmLEVBQWlDRSxFQUFqQyxDQUFvQ0MsV0FBcEMsRUFBbkMsS0FBeUYsQ0FBQyxDQUEvRixFQUFtRztBQUNqR2IsNEJBQVljLE1BQVosQ0FBbUJKLEdBQW5CLEVBQXVCLENBQXZCO0FBQ0Q7QUFDRjtBQUNGO0FBQ0QsZUFBS0ssaUJBQUwsR0FBeUIsRUFBekI7QUFDQWYsc0JBQVlLLEdBQVosQ0FBZ0I7QUFBQSxtQkFBYyxPQUFLVSxpQkFBTCxDQUF1QkMsVUFBdkIsSUFBcUMzQyxlQUFlMkMsVUFBZixFQUEyQixJQUEzQixDQUFuRDtBQUFBLFdBQWhCO0FBQ0FuQixtQkFBU0EsT0FBT29CLE1BQVAsQ0FBYyxDQUFDL0MsWUFBWWdELE1BQVosQ0FBbUI7QUFDdkNOLGdCQUFJLHVCQURtQztBQUV2Q08sMkJBQWUsSUFGd0I7QUFHdkNDLG1CQUFPdEIsS0FBS1UsTUFBTCxDQUFZYSxpQkFBWixDQUE4QkQsS0FBOUIsR0FBc0N0QixLQUFLVSxNQUFMLENBQVlhLGlCQUFaLENBQThCRCxLQUFwRSxHQUE0RSxJQUg1QztBQUl2Q0UsbUJBQU94QixLQUFLVSxNQUFMLENBQVlhLGlCQUFaLENBQThCQyxLQUpFO0FBS3ZDQyxtQkFBT3pCLEtBQUtVLE1BQUwsQ0FBWWEsaUJBQVosQ0FBOEJHLFlBTEU7QUFNdkNDLHVCQUFXM0IsS0FBS1UsTUFBTCxDQUFZYSxpQkFBWixDQUE4QkksU0FORjtBQU92Q0MseUJBQWE1QixLQUFLVSxNQUFMLENBQVlhLGlCQUFaLENBQThCSyxXQVBKO0FBUXZDQyxxQkFBUyxFQVI4QjtBQVN2Q0MscUJBQVMsS0FBS2I7QUFUeUIsV0FBbkIsQ0FBRCxFQVVqQjVDLGVBQWUrQyxNQUFmLENBQXNCO0FBQ3hCTixnQkFBSSxHQURvQjtBQUV4Qk8sMkJBQWUsSUFGUztBQUd4QlUsd0JBQVkvQixLQUFLVSxNQUFMLENBQVlzQixDQUFaLENBQWNELFVBSEY7QUFJeEJQLG1CQUFPeEIsS0FBS1UsTUFBTCxDQUFZc0IsQ0FBWixDQUFjUixLQUpHO0FBS3hCRixtQkFBT3RCLEtBQUtVLE1BQUwsQ0FBWXNCLENBQVosQ0FBY1YsS0FBZCxHQUFzQnRCLEtBQUtVLE1BQUwsQ0FBWXNCLENBQVosQ0FBY1YsS0FBcEMsR0FBNEMsSUFMM0I7QUFNeEJHLG1CQUFPekIsS0FBS1UsTUFBTCxDQUFZc0IsQ0FBWixDQUFjTixZQU5HO0FBT3hCTyxzQkFBVWpDLEtBQUtVLE1BQUwsQ0FBWXNCLENBQVosQ0FBY0MsUUFQQTtBQVF4QkwseUJBQWE1QixLQUFLVSxNQUFMLENBQVlzQixDQUFaLENBQWNKLFdBUkg7QUFTeEJDLHFCQUFTLEVBVGU7QUFVeEJDLHFCQUFTOUIsS0FBS1UsTUFBTCxDQUFZc0IsQ0FBWixDQUFjRjtBQVZDLFdBQXRCLENBVmlCLEVBcUJqQnpELGVBQWUrQyxNQUFmLENBQXNCO0FBQ3hCTixnQkFBSSxHQURvQjtBQUV4Qk8sMkJBQWUsSUFGUztBQUd4QlUsd0JBQVkvQixLQUFLVSxNQUFMLENBQVl3QixDQUFaLENBQWNILFVBSEY7QUFJeEJQLG1CQUFPeEIsS0FBS1UsTUFBTCxDQUFZd0IsQ0FBWixDQUFjVixLQUpHO0FBS3hCRixtQkFBT3RCLEtBQUtVLE1BQUwsQ0FBWXdCLENBQVosQ0FBY1osS0FBZCxHQUFzQnRCLEtBQUtVLE1BQUwsQ0FBWXdCLENBQVosQ0FBY1osS0FBcEMsR0FBNEMsSUFMM0I7QUFNeEJHLG1CQUFPekIsS0FBS1UsTUFBTCxDQUFZd0IsQ0FBWixDQUFjUixZQU5HO0FBT3hCTyxzQkFBVWpDLEtBQUtVLE1BQUwsQ0FBWXdCLENBQVosQ0FBY0QsUUFQQTtBQVF4QkwseUJBQWE1QixLQUFLVSxNQUFMLENBQVl3QixDQUFaLENBQWNOLFdBUkg7QUFTeEJDLHFCQUFTLEVBVGU7QUFVeEJDLHFCQUFTOUIsS0FBS1UsTUFBTCxDQUFZd0IsQ0FBWixDQUFjSjtBQVZDLFdBQXRCLENBckJpQixDQUFkLENBQVQ7O0FBbUNBO0FBQ0EsY0FBSTlCLEtBQUtVLE1BQUwsQ0FBWXlCLEtBQWhCLEVBQXVCO0FBQ3JCcEMsbUJBQU9pQixNQUFQLENBQWMsQ0FBZCxFQUFnQixDQUFoQixFQUFrQjNDLGVBQWUrQyxNQUFmLENBQXNCO0FBQ3RDTixrQkFBSSxPQURrQztBQUV0Q08sNkJBQWUsSUFGdUI7QUFHdENVLDBCQUFZL0IsS0FBS1UsTUFBTCxDQUFZeUIsS0FBWixDQUFrQkosVUFIUTtBQUl0Q1AscUJBQU94QixLQUFLVSxNQUFMLENBQVl5QixLQUFaLENBQWtCWCxLQUphO0FBS3RDRixxQkFBT3RCLEtBQUtVLE1BQUwsQ0FBWXlCLEtBQVosQ0FBa0JiLEtBQWxCLEdBQTBCdEIsS0FBS1UsTUFBTCxDQUFZeUIsS0FBWixDQUFrQmIsS0FBNUMsR0FBb0QsSUFMckI7QUFNdENHLHFCQUFPekIsS0FBS1UsTUFBTCxDQUFZeUIsS0FBWixDQUFrQlQsWUFOYTtBQU90Q08sd0JBQVVqQyxLQUFLVSxNQUFMLENBQVl5QixLQUFaLENBQWtCRixRQVBVO0FBUXRDTCwyQkFBYTVCLEtBQUtVLE1BQUwsQ0FBWXlCLEtBQVosQ0FBa0JQLFdBUk87QUFTdENDLHVCQUFTLEVBVDZCO0FBVXRDQyx1QkFBUzlCLEtBQUtVLE1BQUwsQ0FBWXlCLEtBQVosQ0FBa0JMO0FBVlcsYUFBdEIsQ0FBbEI7QUFZRCxXQWJELE1BYU8sSUFBSTlCLEtBQUtVLE1BQUwsQ0FBWTBCLE1BQWhCLEVBQXdCO0FBQzdCckMsbUJBQU9pQixNQUFQLENBQWMsQ0FBZCxFQUFnQixDQUFoQixFQUFrQjNDLGVBQWUrQyxNQUFmLENBQXNCO0FBQ3RDTixrQkFBSSxRQURrQztBQUV0Q08sNkJBQWUsSUFGdUI7QUFHdENHLHFCQUFPeEIsS0FBS1UsTUFBTCxDQUFZMEIsTUFBWixDQUFtQlosS0FIWTtBQUl0Q0YscUJBQU90QixLQUFLVSxNQUFMLENBQVkwQixNQUFaLENBQW1CZCxLQUFuQixHQUEyQnRCLEtBQUtVLE1BQUwsQ0FBWTBCLE1BQVosQ0FBbUJkLEtBQTlDLEdBQXNELElBSnZCO0FBS3RDRyxxQkFBT3pCLEtBQUtVLE1BQUwsQ0FBWTBCLE1BQVosQ0FBbUJWLFlBTFk7QUFNdENPLHdCQUFVakMsS0FBS1UsTUFBTCxDQUFZMEIsTUFBWixDQUFtQkgsUUFOUztBQU90Q0wsMkJBQWE1QixLQUFLVSxNQUFMLENBQVkwQixNQUFaLENBQW1CUixXQVBNO0FBUXRDQyx1QkFBUyxFQVI2QjtBQVN0Q0MsdUJBQVM5QixLQUFLVSxNQUFMLENBQVkwQixNQUFaLENBQW1CTjtBQVRVLGFBQXRCLENBQWxCO0FBV0Q7O0FBRUQ7QUFDQSxjQUFJOUIsS0FBS1UsTUFBTCxDQUFZMkIsT0FBaEIsRUFBeUI7QUFDdkJ0QyxtQkFBT2lCLE1BQVAsQ0FBYyxDQUFkLEVBQWdCLENBQWhCLEVBQWtCM0MsZUFBZStDLE1BQWYsQ0FBc0I7QUFDdENOLGtCQUFJLFNBRGtDO0FBRXRDTyw2QkFBZSxJQUZ1QjtBQUd0Q1UsMEJBQVkvQixLQUFLVSxNQUFMLENBQVkyQixPQUFaLENBQW9CTixVQUhNO0FBSXRDUCxxQkFBT3hCLEtBQUtVLE1BQUwsQ0FBWTJCLE9BQVosQ0FBb0JiLEtBSlc7QUFLdENGLHFCQUFPdEIsS0FBS1UsTUFBTCxDQUFZMkIsT0FBWixDQUFvQmYsS0FBcEIsR0FBNEJ0QixLQUFLVSxNQUFMLENBQVkyQixPQUFaLENBQW9CZixLQUFoRCxHQUF3RCxJQUx6QjtBQU10Q0cscUJBQU96QixLQUFLVSxNQUFMLENBQVkyQixPQUFaLENBQW9CWCxZQU5XO0FBT3RDTyx3QkFBVWpDLEtBQUtVLE1BQUwsQ0FBWTJCLE9BQVosQ0FBb0JKLFFBUFE7QUFRdENMLDJCQUFhNUIsS0FBS1UsTUFBTCxDQUFZMkIsT0FBWixDQUFvQlQsV0FSSztBQVN0Q0MsdUJBQVMsRUFUNkI7QUFVdENDLHVCQUFTOUIsS0FBS1UsTUFBTCxDQUFZMkIsT0FBWixDQUFvQlA7QUFWUyxhQUF0QixDQUFsQjtBQVlEO0FBQ0Y7QUFDRCxlQUFPL0IsTUFBUDtBQUNEO0FBckplO0FBQUE7QUFBQSx3Q0F1SkV1QyxHQXZKRixFQXVKT3RDLElBdkpQLEVBdUphOztBQUUzQixZQUFJQSxLQUFLQyxJQUFMLElBQWEsU0FBakIsRUFBNEI7QUFDMUIsV0FBQyxHQUFELEVBQU0sR0FBTixFQUFXLE9BQVgsRUFBbUIsU0FBbkIsRUFBNkIsUUFBN0IsRUFBdUNzQyxPQUF2QyxDQUErQyxVQUFDQyxHQUFELEVBQVM7QUFDdEQsZ0JBQUluQyxPQUFPQyxJQUFQLENBQVlnQyxHQUFaLEVBQWlCekIsT0FBakIsQ0FBeUIyQixHQUF6QixJQUErQixDQUFDLENBQXBDLEVBQXVDO0FBQ3JDRixrQkFBT0UsR0FBUCxpQkFBd0JGLElBQUlFLEdBQUosRUFBU0MsWUFBakM7QUFDQUgsa0JBQU9FLEdBQVAsbUJBQTBCRixJQUFJRSxHQUFKLEVBQVNFLFNBQW5DO0FBQ0FKLGtCQUFJRSxHQUFKLElBQVdGLElBQUlFLEdBQUosRUFBU0csZ0JBQXBCO0FBQ0Q7QUFDRixXQU5EO0FBT0Q7O0FBRUQsZUFBT0wsR0FBUDtBQUNEO0FBcEtlO0FBQUE7QUFBQSx3Q0FzS0U3QyxJQXRLRixFQXNLUU8sSUF0S1IsRUFzS2M7QUFDNUIsWUFBSUEsS0FBS0MsSUFBTCxJQUFhLFNBQWpCLEVBQTRCO0FBQzFCLFdBQUMsR0FBRCxFQUFNLEdBQU4sRUFBVyxPQUFYLEVBQW1CLFNBQW5CLEVBQTZCLFFBQTdCLEVBQXVDc0MsT0FBdkMsQ0FBK0MsVUFBQ0MsR0FBRCxFQUFTO0FBQ3RELGdCQUFJbkMsT0FBT0MsSUFBUCxDQUFZYixJQUFaLEVBQWtCb0IsT0FBbEIsQ0FBMEIyQixHQUExQixJQUFpQyxDQUFDLENBQXRDLEVBQXlDO0FBQ3ZDL0MsbUJBQUsrQyxHQUFMLElBQVk7QUFDVkcsa0NBQWtCbEQsS0FBSytDLEdBQUwsQ0FEUjtBQUVWQyw4QkFBY2hELEtBQVErQyxHQUFSLGNBRko7QUFHVkUsMkJBQVdqRCxLQUFRK0MsR0FBUjtBQUhELGVBQVo7QUFLQSxxQkFBTy9DLEtBQVErQyxHQUFSLGNBQVA7QUFDQSxxQkFBTy9DLEtBQVErQyxHQUFSLGdCQUFQO0FBQ0Q7QUFDRixXQVZELEVBRDBCLENBV3ZCO0FBQ0o7QUFDRCxlQUFPL0MsSUFBUDtBQUNEO0FBckxlO0FBQUE7QUFBQSxrQ0F1TEpGLElBdkxJLEVBdUxFUyxJQXZMRixFQXVMUTtBQUN0QixZQUFJQSxLQUFLVSxNQUFMLENBQVlrQyxTQUFaLElBQXlCLFNBQTdCLEVBQXdDO0FBQ3RDO0FBQ0EsY0FBSXZDLE9BQU9DLElBQVAsQ0FBWS9CLGNBQVosRUFBNEJzQyxPQUE1QixDQUFvQ2IsS0FBS1UsTUFBTCxDQUFZbUMsYUFBWixDQUEwQkMscUJBQTlELEtBQXNGLENBQUMsQ0FBM0YsRUFBOEY7QUFDNUZDLG9CQUFRQyxHQUFSLENBQVksa0JBQVo7QUFDRCxXQUZELE1BRU87QUFDTCxnQkFBSUMsYUFBYSxDQUFqQjtBQUNBLGdCQUFJQyxhQUFhLElBQWpCO0FBQ0EsZ0JBQUlDLGVBQWU1RSxlQUFleUIsS0FBS1UsTUFBTCxDQUFZbUMsYUFBWixDQUEwQkMscUJBQXpDLEVBQWdFcEMsTUFBbkY7QUFDQUwsbUJBQU9DLElBQVAsQ0FBWTZDLFlBQVosRUFBMEJaLE9BQTFCLENBQWtDLGVBQU87QUFDckMsa0JBQUlDLElBQUl6QixXQUFKLEdBQWtCcUMsS0FBbEIsQ0FBd0IsUUFBeEIsQ0FBSixFQUF1QztBQUNyQ0gsOEJBQWMsQ0FBZDtBQUNBQyw2QkFBYVYsR0FBYjtBQUNEO0FBQ0YsYUFMSDs7QUFPQSxnQkFBSVMsY0FBYyxDQUFsQixFQUFxQjtBQUNuQixrQkFBSUksYUFBYTtBQUNmQywyQkFBV3RELEtBQUtzQixLQUREO0FBRWZpQyx3QkFBUTtBQUZPLGVBQWpCO0FBSUQsYUFMRCxNQUtPO0FBQ0wsa0JBQUlKLGFBQWFELFVBQWIsRUFBeUJNLGlCQUF6QixJQUE4QyxDQUFsRCxFQUFxRDtBQUNuRCxvQkFBSUgsYUFBYTtBQUNmQyw2QkFBV3RELEtBQUtzQixLQUREO0FBRWZpQywwQkFBUTtBQUZPLGlCQUFqQjtBQUlELGVBTEQsTUFLTztBQUNMLG9CQUFJRixhQUFhO0FBQ2ZDLDZCQUFXdEQsS0FBS3NCLEtBREQ7QUFFZmlDLDBCQUFRO0FBRk8saUJBQWpCO0FBSUQ7QUFDRjtBQUVGOztBQUVELGlCQUFRLElBQUlqRixTQUFKLENBQWMrRSxVQUFkLENBQUQsQ0FBNEI5RCxJQUE1QixFQUFQO0FBQ0Q7QUFDRCxlQUFPQSxJQUFQO0FBQ0Q7QUEvTmU7O0FBQUE7QUFBQSxJQWdCZXJCLE1BaEJmOztBQWtPbEIsU0FBT00sa0JBQVA7QUFDRCxDQW5PRCIsImZpbGUiOiJtb2R1bGUvZXVnbGVuYS9tb2RlbF9ibG9ja2x5L21vZHVsZS5qcyIsInNvdXJjZXNDb250ZW50IjpbImRlZmluZSgocmVxdWlyZSkgPT4ge1xuICBjb25zdCBVdGlscyA9IHJlcXVpcmUoJ2NvcmUvdXRpbC91dGlscycpLFxuICAgIEdsb2JhbHMgPSByZXF1aXJlKCdjb3JlL21vZGVsL2dsb2JhbHMnKSxcbiAgICBITSA9IHJlcXVpcmUoJ2NvcmUvZXZlbnQvaG9va19tYW5hZ2VyJyk7XG5cbiAgY29uc3QgTW9kdWxlID0gcmVxdWlyZSgnY29yZS9hcHAvbW9kdWxlJyksXG4gICAgTW9kZWxpbmdEYXRhVGFiID0gcmVxdWlyZSgnLi9ibG9ja2x5dGFiL3RhYicpLFxuICAgIC8vU3ltU2xpZGVyRmllbGQgPSByZXF1aXJlKCdjb3JlL2NvbXBvbmVudC9zeW1zbGlkZXJmaWVsZC9maWVsZCcpLFxuICAgIC8vU2xpZGVyRmllbGQgPSByZXF1aXJlKCdjb3JlL2NvbXBvbmVudC9zbGlkZXJmaWVsZC9maWVsZCcpLFxuICAgIFNlbGVjdEZpZWxkID0gcmVxdWlyZSgnY29yZS9jb21wb25lbnQvc2VsZWN0ZmllbGQvZmllbGQnKSxcbiAgICBTeW1TZWxlY3RGaWVsZCA9IHJlcXVpcmUoJ2NvcmUvY29tcG9uZW50L3N5bXNlbGVjdGZpZWxkL2ZpZWxkJyksXG4gICAgTW9kZWxWaWV3ID0gcmVxdWlyZSgnLi90aHJlZXZpZXcnKTtcblxuICBjb25zdCBkZWZhdWx0Q29uZmlncyA9IHJlcXVpcmUoJy4vYm9keUNvbmZpZ3VyYXRpb25zL2JvZHljb25maWdzL2xpc3RvZmNvbmZpZ3MnKVxuXG5cbiAgY2xhc3MgTW9kZWxpbmdEYXRhTW9kdWxlIGV4dGVuZHMgTW9kdWxlIHtcbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgIHN1cGVyKCk7XG4gICAgICBpZiAoR2xvYmFscy5nZXQoJ0FwcENvbmZpZy5tb2RlbGluZycpKSB7XG4gICAgICAgICAgVXRpbHMuYmluZE1ldGhvZHModGhpcywgWydfb25QaGFzZUNoYW5nZScsICdfb25FeHBlcmltZW50Q291bnRDaGFuZ2UnLFxuICAgICAgICAnX2hvb2tNb2RlbEZpZWxkcycsICdfaG9va01vZGlmeUV4cG9ydCcsICdfaG9va01vZGlmeUltcG9ydCcsICdfaG9vazNkVmlldyddKVxuXG4gICAgICAgIGlmIChHbG9iYWxzLmdldCgnQXBwQ29uZmlnLm1vZGVsLnRhYnMnKS5sZW5ndGgpIHtcbiAgICAgICAgICB0aGlzLnRhYiA9IG5ldyBNb2RlbGluZ0RhdGFUYWIoKTtcbiAgICAgICAgICBHbG9iYWxzLmdldCgnUmVsYXknKS5hZGRFdmVudExpc3RlbmVyKCdBcHBQaGFzZS5DaGFuZ2UnLCB0aGlzLl9vblBoYXNlQ2hhbmdlKVxuICAgICAgICAgIEdsb2JhbHMuZ2V0KCdSZWxheScpLmFkZEV2ZW50TGlzdGVuZXIoJ0V4cGVyaW1lbnRDb3VudC5DaGFuZ2UnLCB0aGlzLl9vbkV4cGVyaW1lbnRDb3VudENoYW5nZSlcblxuICAgICAgICB9XG5cbiAgICAgICAgSE0uaG9vaygnTW9kZWxGb3JtLkZpZWxkcycsIHRoaXMuX2hvb2tNb2RlbEZpZWxkcyk7XG4gICAgICAgIEhNLmhvb2soJ01vZGVsRm9ybS5Nb2RpZnlFeHBvcnQnLCB0aGlzLl9ob29rTW9kaWZ5RXhwb3J0KTtcbiAgICAgICAgSE0uaG9vaygnTW9kZWxGb3JtLk1vZGlmeUltcG9ydCcsIHRoaXMuX2hvb2tNb2RpZnlJbXBvcnQpO1xuICAgICAgICBITS5ob29rKCdFdWdsZW5hLjNkVmlldycsIHRoaXMuX2hvb2szZFZpZXcpXG5cbiAgICAgIH1cbiAgICB9XG5cbiAgICBydW4oKSB7XG4gICAgICBpZiAodGhpcy50YWIpIEdsb2JhbHMuZ2V0KCdMYXlvdXQnKS5nZXRQYW5lbCgncmVzdWx0JykuYWRkQ29udGVudCh0aGlzLnRhYi52aWV3KCkpXG4gICAgfVxuXG4gICAgX29uUGhhc2VDaGFuZ2UoZXZ0KSB7XG4gICAgICBpZiAoZXZ0LmRhdGEucGhhc2UgPT0gXCJsb2dpblwiIHx8IGV2dC5kYXRhLnBoYXNlID09IFwibG9naW5fYXR0ZW1wdGVkXCIpIHtcbiAgICAgICAgdGhpcy50YWIuaGlkZSgpO1xuICAgICAgfVxuICAgIH1cblxuICAgIF9vbkV4cGVyaW1lbnRDb3VudENoYW5nZShldnQpIHtcbiAgICAgIGlmIChldnQuZGF0YS5jb3VudCAmJiAhZXZ0LmRhdGEub2xkKSB7XG4gICAgICAgIHRoaXMudGFiLnNob3coKTtcbiAgICAgIH0gZWxzZSBpZiAoIWV2dC5kYXRhLmNvdW50ICYmIEdsb2JhbHMuZ2V0KCdibG9ja2x5TG9hZGVkJykpIHtcbiAgICAgICAgdGhpcy50YWIuaGlkZSgpO1xuICAgICAgfVxuICAgIH1cblxuICAgIF9ob29rTW9kZWxGaWVsZHMoZmllbGRzLCBtZXRhKSB7XG4gICAgICBpZiAobWV0YS50eXBlID09IFwiYmxvY2tseVwiKSB7XG4gICAgICAgIHZhciBib2R5Q29uZmlncyA9IEFycmF5LmFwcGx5KG51bGwsIHtsZW5ndGg6T2JqZWN0LmtleXMoZGVmYXVsdENvbmZpZ3MpLmxlbmd0aH0pLm1hcCgobnVtYmVyLGluZCkgPT4gJ3NlbnNvckNvbmZpZ18nICsgKGluZCsxKSk7XG4gICAgICAgIC8vIEZpbHRlciBvdXQgdGhlIG9wdGlvbnMgdGhhdCBhcmUgbm90IGluIGFsbG93ZWRDb25maWdzXG4gICAgICAgIGlmIChtZXRhLmNvbmZpZy5hbGxvd2VkQ29uZmlncy5sZW5ndGgpIHtcbiAgICAgICAgICBmb3IgKGxldCBpZHggPSBib2R5Q29uZmlncy5sZW5ndGggLSAxOyBpZHggPj0gMDsgaWR4LS0pIHtcbiAgICAgICAgICAgIGlmICgobWV0YS5jb25maWcuYWxsb3dlZENvbmZpZ3MuaW5kZXhPZihkZWZhdWx0Q29uZmlnc1tib2R5Q29uZmlnc1tpZHhdXS5pZC50b0xvd2VyQ2FzZSgpKSA9PSAtMSkpIHtcbiAgICAgICAgICAgICAgYm9keUNvbmZpZ3Muc3BsaWNlKGlkeCwxKVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICB0aGlzLmJvZHlDb25maWdPcHRpb25zID0ge31cbiAgICAgICAgYm9keUNvbmZpZ3MubWFwKGJvZHljb25maWcgPT4gdGhpcy5ib2R5Q29uZmlnT3B0aW9uc1tib2R5Y29uZmlnXSA9IGRlZmF1bHRDb25maWdzW2JvZHljb25maWddWydpZCddKVxuICAgICAgICBmaWVsZHMgPSBmaWVsZHMuY29uY2F0KFtTZWxlY3RGaWVsZC5jcmVhdGUoe1xuICAgICAgICAgICAgaWQ6IFwiYm9keUNvbmZpZ3VyYXRpb25OYW1lXCIsXG4gICAgICAgICAgICBpbnZlcnNlX29yZGVyOiB0cnVlLFxuICAgICAgICAgICAgY29sb3I6IG1ldGEuY29uZmlnLmJvZHlDb25maWd1cmF0aW9uLmNvbG9yID8gbWV0YS5jb25maWcuYm9keUNvbmZpZ3VyYXRpb24uY29sb3IgOiBudWxsLFxuICAgICAgICAgICAgbGFiZWw6IG1ldGEuY29uZmlnLmJvZHlDb25maWd1cmF0aW9uLmxhYmVsLFxuICAgICAgICAgICAgdmFsdWU6IG1ldGEuY29uZmlnLmJvZHlDb25maWd1cmF0aW9uLmluaXRpYWxWYWx1ZSxcbiAgICAgICAgICAgIG1pbl93aWR0aDogbWV0YS5jb25maWcuYm9keUNvbmZpZ3VyYXRpb24ubWluX3dpZHRoLFxuICAgICAgICAgICAgZGVzY3JpcHRpb246IG1ldGEuY29uZmlnLmJvZHlDb25maWd1cmF0aW9uLmRlc2NyaXB0aW9uLFxuICAgICAgICAgICAgY2xhc3NlczogW10sXG4gICAgICAgICAgICBvcHRpb25zOiB0aGlzLmJvZHlDb25maWdPcHRpb25zXG4gICAgICAgICAgfSksIFN5bVNlbGVjdEZpZWxkLmNyZWF0ZSh7XG4gICAgICAgICAgICBpZDogJ3YnLFxuICAgICAgICAgICAgaW52ZXJzZV9vcmRlcjogdHJ1ZSxcbiAgICAgICAgICAgIHZhck9wdGlvbnM6IG1ldGEuY29uZmlnLnYudmFyT3B0aW9ucyxcbiAgICAgICAgICAgIGxhYmVsOiBtZXRhLmNvbmZpZy52LmxhYmVsLFxuICAgICAgICAgICAgY29sb3I6IG1ldGEuY29uZmlnLnYuY29sb3IgPyBtZXRhLmNvbmZpZy52LmNvbG9yIDogbnVsbCxcbiAgICAgICAgICAgIHZhbHVlOiBtZXRhLmNvbmZpZy52LmluaXRpYWxWYWx1ZSxcbiAgICAgICAgICAgIG1heFZhbHVlOiBtZXRhLmNvbmZpZy52Lm1heFZhbHVlLFxuICAgICAgICAgICAgZGVzY3JpcHRpb246IG1ldGEuY29uZmlnLnYuZGVzY3JpcHRpb24sXG4gICAgICAgICAgICBjbGFzc2VzOiBbXSxcbiAgICAgICAgICAgIG9wdGlvbnM6IG1ldGEuY29uZmlnLnYub3B0aW9uc1xuICAgICAgICAgIH0pLCBTeW1TZWxlY3RGaWVsZC5jcmVhdGUoe1xuICAgICAgICAgICAgaWQ6ICdrJyxcbiAgICAgICAgICAgIGludmVyc2Vfb3JkZXI6IHRydWUsXG4gICAgICAgICAgICB2YXJPcHRpb25zOiBtZXRhLmNvbmZpZy5LLnZhck9wdGlvbnMsXG4gICAgICAgICAgICBsYWJlbDogbWV0YS5jb25maWcuSy5sYWJlbCxcbiAgICAgICAgICAgIGNvbG9yOiBtZXRhLmNvbmZpZy5LLmNvbG9yID8gbWV0YS5jb25maWcuSy5jb2xvciA6IG51bGwsXG4gICAgICAgICAgICB2YWx1ZTogbWV0YS5jb25maWcuSy5pbml0aWFsVmFsdWUsXG4gICAgICAgICAgICBtYXhWYWx1ZTogbWV0YS5jb25maWcuSy5tYXhWYWx1ZSxcbiAgICAgICAgICAgIGRlc2NyaXB0aW9uOiBtZXRhLmNvbmZpZy5LLmRlc2NyaXB0aW9uLFxuICAgICAgICAgICAgY2xhc3NlczogW10sXG4gICAgICAgICAgICBvcHRpb25zOiBtZXRhLmNvbmZpZy5LLm9wdGlvbnNcbiAgICAgICAgICB9KVxuICAgICAgICBdKVxuXG4gICAgICAgIC8vIEFkZCBlaXRoZXIgcm9sbCBvciBtb3Rpb24gdHlwZSBvcHRpb25cbiAgICAgICAgaWYgKG1ldGEuY29uZmlnLm9tZWdhKSB7XG4gICAgICAgICAgZmllbGRzLnNwbGljZSgzLDAsU3ltU2VsZWN0RmllbGQuY3JlYXRlKHtcbiAgICAgICAgICAgIGlkOiAnb21lZ2EnLFxuICAgICAgICAgICAgaW52ZXJzZV9vcmRlcjogdHJ1ZSxcbiAgICAgICAgICAgIHZhck9wdGlvbnM6IG1ldGEuY29uZmlnLm9tZWdhLnZhck9wdGlvbnMsXG4gICAgICAgICAgICBsYWJlbDogbWV0YS5jb25maWcub21lZ2EubGFiZWwsXG4gICAgICAgICAgICBjb2xvcjogbWV0YS5jb25maWcub21lZ2EuY29sb3IgPyBtZXRhLmNvbmZpZy5vbWVnYS5jb2xvciA6IG51bGwsXG4gICAgICAgICAgICB2YWx1ZTogbWV0YS5jb25maWcub21lZ2EuaW5pdGlhbFZhbHVlLFxuICAgICAgICAgICAgbWF4VmFsdWU6IG1ldGEuY29uZmlnLm9tZWdhLm1heFZhbHVlLFxuICAgICAgICAgICAgZGVzY3JpcHRpb246IG1ldGEuY29uZmlnLm9tZWdhLmRlc2NyaXB0aW9uLFxuICAgICAgICAgICAgY2xhc3NlczogW10sXG4gICAgICAgICAgICBvcHRpb25zOiBtZXRhLmNvbmZpZy5vbWVnYS5vcHRpb25zXG4gICAgICAgICAgfSkpXG4gICAgICAgIH0gZWxzZSBpZiAobWV0YS5jb25maWcubW90aW9uKSB7XG4gICAgICAgICAgZmllbGRzLnNwbGljZSgzLDAsU3ltU2VsZWN0RmllbGQuY3JlYXRlKHtcbiAgICAgICAgICAgIGlkOiAnbW90aW9uJyxcbiAgICAgICAgICAgIGludmVyc2Vfb3JkZXI6IHRydWUsXG4gICAgICAgICAgICBsYWJlbDogbWV0YS5jb25maWcubW90aW9uLmxhYmVsLFxuICAgICAgICAgICAgY29sb3I6IG1ldGEuY29uZmlnLm1vdGlvbi5jb2xvciA/IG1ldGEuY29uZmlnLm1vdGlvbi5jb2xvciA6IG51bGwsXG4gICAgICAgICAgICB2YWx1ZTogbWV0YS5jb25maWcubW90aW9uLmluaXRpYWxWYWx1ZSxcbiAgICAgICAgICAgIG1heFZhbHVlOiBtZXRhLmNvbmZpZy5tb3Rpb24ubWF4VmFsdWUsXG4gICAgICAgICAgICBkZXNjcmlwdGlvbjogbWV0YS5jb25maWcubW90aW9uLmRlc2NyaXB0aW9uLFxuICAgICAgICAgICAgY2xhc3NlczogW10sXG4gICAgICAgICAgICBvcHRpb25zOiBtZXRhLmNvbmZpZy5tb3Rpb24ub3B0aW9uc1xuICAgICAgICAgIH0pKVxuICAgICAgICB9XG5cbiAgICAgICAgLy8gQWRkIG9wYWNpdHlcbiAgICAgICAgaWYgKG1ldGEuY29uZmlnLm9wYWNpdHkpIHtcbiAgICAgICAgICBmaWVsZHMuc3BsaWNlKDEsMCxTeW1TZWxlY3RGaWVsZC5jcmVhdGUoe1xuICAgICAgICAgICAgaWQ6ICdvcGFjaXR5JyxcbiAgICAgICAgICAgIGludmVyc2Vfb3JkZXI6IHRydWUsXG4gICAgICAgICAgICB2YXJPcHRpb25zOiBtZXRhLmNvbmZpZy5vcGFjaXR5LnZhck9wdGlvbnMsXG4gICAgICAgICAgICBsYWJlbDogbWV0YS5jb25maWcub3BhY2l0eS5sYWJlbCxcbiAgICAgICAgICAgIGNvbG9yOiBtZXRhLmNvbmZpZy5vcGFjaXR5LmNvbG9yID8gbWV0YS5jb25maWcub3BhY2l0eS5jb2xvciA6IG51bGwsXG4gICAgICAgICAgICB2YWx1ZTogbWV0YS5jb25maWcub3BhY2l0eS5pbml0aWFsVmFsdWUsXG4gICAgICAgICAgICBtYXhWYWx1ZTogbWV0YS5jb25maWcub3BhY2l0eS5tYXhWYWx1ZSxcbiAgICAgICAgICAgIGRlc2NyaXB0aW9uOiBtZXRhLmNvbmZpZy5vcGFjaXR5LmRlc2NyaXB0aW9uLFxuICAgICAgICAgICAgY2xhc3NlczogW10sXG4gICAgICAgICAgICBvcHRpb25zOiBtZXRhLmNvbmZpZy5vcGFjaXR5Lm9wdGlvbnNcbiAgICAgICAgICB9KSlcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmV0dXJuIGZpZWxkcztcbiAgICB9XG5cbiAgICBfaG9va01vZGlmeUV4cG9ydChleHAsIG1ldGEpIHtcblxuICAgICAgaWYgKG1ldGEudHlwZSA9PSBcImJsb2NrbHlcIikge1xuICAgICAgICBbJ2snLCAndicsICdvbWVnYScsJ29wYWNpdHknLCdtb3Rpb24nXS5mb3JFYWNoKChrZXkpID0+IHtcbiAgICAgICAgICBpZiAoT2JqZWN0LmtleXMoZXhwKS5pbmRleE9mKGtleSkgPi0xKSB7XG4gICAgICAgICAgICBleHBbYCR7a2V5fV9udW1lcmljYF0gPSBleHBba2V5XS5udW1lcmljVmFsdWU7XG4gICAgICAgICAgICBleHBbYCR7a2V5fV92YXJpYXRpb25gXSA9IGV4cFtrZXldLnZhcmlhdGlvbjtcbiAgICAgICAgICAgIGV4cFtrZXldID0gZXhwW2tleV0ucXVhbGl0YXRpdmVWYWx1ZTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pXG4gICAgICB9XG5cbiAgICAgIHJldHVybiBleHBcbiAgICB9XG5cbiAgICBfaG9va01vZGlmeUltcG9ydChkYXRhLCBtZXRhKSB7XG4gICAgICBpZiAobWV0YS50eXBlID09IFwiYmxvY2tseVwiKSB7XG4gICAgICAgIFsnaycsICd2JywgJ29tZWdhJywnb3BhY2l0eScsJ21vdGlvbiddLmZvckVhY2goKGtleSkgPT4ge1xuICAgICAgICAgIGlmIChPYmplY3Qua2V5cyhkYXRhKS5pbmRleE9mKGtleSkgPiAtMSkge1xuICAgICAgICAgICAgZGF0YVtrZXldID0ge1xuICAgICAgICAgICAgICBxdWFsaXRhdGl2ZVZhbHVlOiBkYXRhW2tleV0sXG4gICAgICAgICAgICAgIG51bWVyaWNWYWx1ZTogZGF0YVtgJHtrZXl9X251bWVyaWNgXSxcbiAgICAgICAgICAgICAgdmFyaWF0aW9uOiBkYXRhW2Ake2tleX1fdmFyaWF0aW9uYF1cbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICBkZWxldGUgZGF0YVtgJHtrZXl9X251bWVyaWNgXTtcbiAgICAgICAgICAgIGRlbGV0ZSBkYXRhW2Ake2tleX1fdmFyaWF0aW9uYF07XG4gICAgICAgICAgfVxuICAgICAgICB9KSAvLyBNQUtFIFNVUkUgVEhFIElOSVRJQUwgT05FIElTIFdPUktJTkcgVE9PXG4gICAgICB9XG4gICAgICByZXR1cm4gZGF0YTtcbiAgICB9XG5cbiAgICBfaG9vazNkVmlldyh2aWV3LCBtZXRhKSB7XG4gICAgICBpZiAobWV0YS5jb25maWcubW9kZWxUeXBlID09IFwiYmxvY2tseVwiKSB7XG4gICAgICAgIC8vIEhlcmUsIGV4dHJhY3QgdGhlIG51bWJlciBvZiBleWVzXG4gICAgICAgIGlmIChPYmplY3Qua2V5cyhkZWZhdWx0Q29uZmlncykuaW5kZXhPZihtZXRhLmNvbmZpZy5jb25maWd1cmF0aW9uLmJvZHlDb25maWd1cmF0aW9uTmFtZSk9PS0xKSB7XG4gICAgICAgICAgY29uc29sZS5sb2coJ3RoaXMgaXMgbm90IGdvb2QnKVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHZhciBudW1TZW5zb3JzID0gMDtcbiAgICAgICAgICB2YXIgc2Vuc29yTmFtZSA9IG51bGw7XG4gICAgICAgICAgdmFyIHNlbnNvckNvbmZpZyA9IGRlZmF1bHRDb25maWdzW21ldGEuY29uZmlnLmNvbmZpZ3VyYXRpb24uYm9keUNvbmZpZ3VyYXRpb25OYW1lXS5jb25maWc7XG4gICAgICAgICAgT2JqZWN0LmtleXMoc2Vuc29yQ29uZmlnKS5mb3JFYWNoKGtleSA9PiB7XG4gICAgICAgICAgICAgIGlmIChrZXkudG9Mb3dlckNhc2UoKS5tYXRjaCgnc2Vuc29yJykpIHtcbiAgICAgICAgICAgICAgICBudW1TZW5zb3JzICs9IDE7XG4gICAgICAgICAgICAgICAgc2Vuc29yTmFtZSA9IGtleTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSlcblxuICAgICAgICAgIGlmIChudW1TZW5zb3JzID09IDIpIHtcbiAgICAgICAgICAgIHZhciBiYXNlQ29uZmlnID0ge1xuICAgICAgICAgICAgICBiYXNlQ29sb3I6IG1ldGEuY29sb3IsXG4gICAgICAgICAgICAgIGFkZEV5ZTogJ2JvdGgnXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGlmIChzZW5zb3JDb25maWdbc2Vuc29yTmFtZV0uc2Vuc29yT3JpZW50YXRpb24gPT0gMCkge1xuICAgICAgICAgICAgICB2YXIgYmFzZUNvbmZpZyA9IHtcbiAgICAgICAgICAgICAgICBiYXNlQ29sb3I6IG1ldGEuY29sb3IsXG4gICAgICAgICAgICAgICAgYWRkRXllOiAncmlnaHQnXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIHZhciBiYXNlQ29uZmlnID0ge1xuICAgICAgICAgICAgICAgIGJhc2VDb2xvcjogbWV0YS5jb2xvcixcbiAgICAgICAgICAgICAgICBhZGRFeWU6ICdsZWZ0J1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuXG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gKG5ldyBNb2RlbFZpZXcoYmFzZUNvbmZpZykpLnZpZXcoKVxuICAgICAgfVxuICAgICAgcmV0dXJuIHZpZXc7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIE1vZGVsaW5nRGF0YU1vZHVsZTtcbn0pXG4iXX0=
