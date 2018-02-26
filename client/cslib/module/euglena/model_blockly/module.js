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
          if (meta.config.modelRepresentation === 'functional') {
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
          } else if (meta.config.modelRepresentation === 'mechanistic') {
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9ldWdsZW5hL21vZGVsX2Jsb2NrbHkvbW9kdWxlLmpzIl0sIm5hbWVzIjpbImRlZmluZSIsInJlcXVpcmUiLCJVdGlscyIsIkdsb2JhbHMiLCJITSIsIk1vZHVsZSIsIk1vZGVsaW5nRGF0YVRhYiIsIlNlbGVjdEZpZWxkIiwiU3ltU2VsZWN0RmllbGQiLCJNb2RlbFZpZXciLCJkZWZhdWx0Q29uZmlncyIsIk1vZGVsaW5nRGF0YU1vZHVsZSIsImdldCIsImJpbmRNZXRob2RzIiwibGVuZ3RoIiwidGFiIiwiYWRkRXZlbnRMaXN0ZW5lciIsIl9vblBoYXNlQ2hhbmdlIiwiX29uRXhwZXJpbWVudENvdW50Q2hhbmdlIiwiaG9vayIsIl9ob29rTW9kZWxGaWVsZHMiLCJfaG9va01vZGlmeUV4cG9ydCIsIl9ob29rTW9kaWZ5SW1wb3J0IiwiX2hvb2szZFZpZXciLCJnZXRQYW5lbCIsImFkZENvbnRlbnQiLCJ2aWV3IiwiZXZ0IiwiZGF0YSIsInBoYXNlIiwiaGlkZSIsImNvdW50Iiwib2xkIiwic2hvdyIsImZpZWxkcyIsIm1ldGEiLCJ0eXBlIiwiYm9keUNvbmZpZ3MiLCJBcnJheSIsImFwcGx5IiwiT2JqZWN0Iiwia2V5cyIsIm1hcCIsIm51bWJlciIsImluZCIsImNvbmZpZyIsImFsbG93ZWRDb25maWdzIiwiaWR4IiwiaW5kZXhPZiIsImlkIiwidG9Mb3dlckNhc2UiLCJzcGxpY2UiLCJib2R5Q29uZmlnT3B0aW9ucyIsImJvZHljb25maWciLCJjb25jYXQiLCJjcmVhdGUiLCJpbnZlcnNlX29yZGVyIiwiY29sb3IiLCJib2R5Q29uZmlndXJhdGlvbiIsImxhYmVsIiwidmFsdWUiLCJpbml0aWFsVmFsdWUiLCJtaW5fd2lkdGgiLCJjbGFzc2VzIiwib3B0aW9ucyIsImluY2x1ZGVWYXJpYXRpb24iLCJ2YXJpYXRpb24iLCJ2IiwibWF4VmFsdWUiLCJLIiwibW9kZWxSZXByZXNlbnRhdGlvbiIsIm9tZWdhIiwibW90aW9uIiwib3BhY2l0eSIsInB1c2giLCJleHAiLCJmb3JFYWNoIiwia2V5IiwibnVtZXJpY1ZhbHVlIiwicXVhbGl0YXRpdmVWYWx1ZSIsIm1vZGVsVHlwZSIsImJhc2VDb2xvciJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBQSxPQUFPLFVBQUNDLE9BQUQsRUFBYTtBQUNsQixNQUFNQyxRQUFRRCxRQUFRLGlCQUFSLENBQWQ7QUFBQSxNQUNFRSxVQUFVRixRQUFRLG9CQUFSLENBRFo7QUFBQSxNQUVFRyxLQUFLSCxRQUFRLHlCQUFSLENBRlA7O0FBSUEsTUFBTUksU0FBU0osUUFBUSxpQkFBUixDQUFmO0FBQUEsTUFDRUssa0JBQWtCTCxRQUFRLGtCQUFSLENBRHBCOztBQUVFO0FBQ0E7QUFDQU0sZ0JBQWNOLFFBQVEsa0NBQVIsQ0FKaEI7QUFBQSxNQUtFTyxpQkFBaUJQLFFBQVEscUNBQVIsQ0FMbkI7QUFBQSxNQU1FUSxZQUFZUixRQUFRLGFBQVIsQ0FOZDs7QUFRQSxNQUFNUyxpQkFBaUJULFFBQVEsZ0RBQVIsQ0FBdkI7O0FBYmtCLE1BZ0JaVSxrQkFoQlk7QUFBQTs7QUFpQmhCLGtDQUFjO0FBQUE7O0FBQUE7O0FBRVosVUFBSVIsUUFBUVMsR0FBUixDQUFZLG9CQUFaLENBQUosRUFBdUM7QUFDbkNWLGNBQU1XLFdBQU4sUUFBd0IsQ0FBQyxnQkFBRCxFQUFtQiwwQkFBbkIsRUFDMUIsa0JBRDBCLEVBQ04sbUJBRE0sRUFDZSxtQkFEZixFQUNvQyxhQURwQyxDQUF4Qjs7QUFHRixZQUFJVixRQUFRUyxHQUFSLENBQVksc0JBQVosRUFBb0NFLE1BQXhDLEVBQWdEO0FBQzlDLGdCQUFLQyxHQUFMLEdBQVcsSUFBSVQsZUFBSixFQUFYO0FBQ0FILGtCQUFRUyxHQUFSLENBQVksT0FBWixFQUFxQkksZ0JBQXJCLENBQXNDLGlCQUF0QyxFQUF5RCxNQUFLQyxjQUE5RDtBQUNBZCxrQkFBUVMsR0FBUixDQUFZLE9BQVosRUFBcUJJLGdCQUFyQixDQUFzQyx3QkFBdEMsRUFBZ0UsTUFBS0Usd0JBQXJFO0FBRUQ7O0FBRURk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dWdsZW5hL21vZGVsX2Jsb2NrbHkvbW9kdWxlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiZGVmaW5lKChyZXF1aXJlKSA9PiB7XG4gIGNvbnN0IFV0aWxzID0gcmVxdWlyZSgnY29yZS91dGlsL3V0aWxzJyksXG4gICAgR2xvYmFscyA9IHJlcXVpcmUoJ2NvcmUvbW9kZWwvZ2xvYmFscycpLFxuICAgIEhNID0gcmVxdWlyZSgnY29yZS9ldmVudC9ob29rX21hbmFnZXInKTtcblxuICBjb25zdCBNb2R1bGUgPSByZXF1aXJlKCdjb3JlL2FwcC9tb2R1bGUnKSxcbiAgICBNb2RlbGluZ0RhdGFUYWIgPSByZXF1aXJlKCcuL2Jsb2NrbHl0YWIvdGFiJyksXG4gICAgLy9TeW1TbGlkZXJGaWVsZCA9IHJlcXVpcmUoJ2NvcmUvY29tcG9uZW50L3N5bXNsaWRlcmZpZWxkL2ZpZWxkJyksXG4gICAgLy9TbGlkZXJGaWVsZCA9IHJlcXVpcmUoJ2NvcmUvY29tcG9uZW50L3NsaWRlcmZpZWxkL2ZpZWxkJyksXG4gICAgU2VsZWN0RmllbGQgPSByZXF1aXJlKCdjb3JlL2NvbXBvbmVudC9zZWxlY3RmaWVsZC9maWVsZCcpLFxuICAgIFN5bVNlbGVjdEZpZWxkID0gcmVxdWlyZSgnY29yZS9jb21wb25lbnQvc3ltc2VsZWN0ZmllbGQvZmllbGQnKSxcbiAgICBNb2RlbFZpZXcgPSByZXF1aXJlKCcuL3RocmVldmlldycpO1xuXG4gIGNvbnN0IGRlZmF1bHRDb25maWdzID0gcmVxdWlyZSgnLi9ib2R5Q29uZmlndXJhdGlvbnMvYm9keWNvbmZpZ3MvbGlzdG9mY29uZmlncycpXG5cblxuICBjbGFzcyBNb2RlbGluZ0RhdGFNb2R1bGUgZXh0ZW5kcyBNb2R1bGUge1xuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgc3VwZXIoKTtcbiAgICAgIGlmIChHbG9iYWxzLmdldCgnQXBwQ29uZmlnLm1vZGVsaW5nJykpIHtcbiAgICAgICAgICBVdGlscy5iaW5kTWV0aG9kcyh0aGlzLCBbJ19vblBoYXNlQ2hhbmdlJywgJ19vbkV4cGVyaW1lbnRDb3VudENoYW5nZScsXG4gICAgICAgICdfaG9va01vZGVsRmllbGRzJywgJ19ob29rTW9kaWZ5RXhwb3J0JywgJ19ob29rTW9kaWZ5SW1wb3J0JywgJ19ob29rM2RWaWV3J10pXG5cbiAgICAgICAgaWYgKEdsb2JhbHMuZ2V0KCdBcHBDb25maWcubW9kZWwudGFicycpLmxlbmd0aCkge1xuICAgICAgICAgIHRoaXMudGFiID0gbmV3IE1vZGVsaW5nRGF0YVRhYigpO1xuICAgICAgICAgIEdsb2JhbHMuZ2V0KCdSZWxheScpLmFkZEV2ZW50TGlzdGVuZXIoJ0FwcFBoYXNlLkNoYW5nZScsIHRoaXMuX29uUGhhc2VDaGFuZ2UpXG4gICAgICAgICAgR2xvYmFscy5nZXQoJ1JlbGF5JykuYWRkRXZlbnRMaXN0ZW5lcignRXhwZXJpbWVudENvdW50LkNoYW5nZScsIHRoaXMuX29uRXhwZXJpbWVudENvdW50Q2hhbmdlKVxuXG4gICAgICAgIH1cblxuICAgICAgICBITS5ob29rKCdNb2RlbEZvcm0uRmllbGRzJywgdGhpcy5faG9va01vZGVsRmllbGRzKTtcbiAgICAgICAgSE0uaG9vaygnTW9kZWxGb3JtLk1vZGlmeUV4cG9ydCcsIHRoaXMuX2hvb2tNb2RpZnlFeHBvcnQpO1xuICAgICAgICBITS5ob29rKCdNb2RlbEZvcm0uTW9kaWZ5SW1wb3J0JywgdGhpcy5faG9va01vZGlmeUltcG9ydCk7XG4gICAgICAgIEhNLmhvb2soJ0V1Z2xlbmEuM2RWaWV3JywgdGhpcy5faG9vazNkVmlldylcblxuICAgICAgfVxuICAgIH1cblxuICAgIHJ1bigpIHtcbiAgICAgIGlmICh0aGlzLnRhYikgR2xvYmFscy5nZXQoJ0xheW91dCcpLmdldFBhbmVsKCdyZXN1bHQnKS5hZGRDb250ZW50KHRoaXMudGFiLnZpZXcoKSlcbiAgICB9XG5cbiAgICBfb25QaGFzZUNoYW5nZShldnQpIHtcbiAgICAgIGlmIChldnQuZGF0YS5waGFzZSA9PSBcImxvZ2luXCIgfHwgZXZ0LmRhdGEucGhhc2UgPT0gXCJsb2dpbl9hdHRlbXB0ZWRcIikge1xuICAgICAgICB0aGlzLnRhYi5oaWRlKCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgX29uRXhwZXJpbWVudENvdW50Q2hhbmdlKGV2dCkge1xuICAgICAgaWYgKGV2dC5kYXRhLmNvdW50ICYmICFldnQuZGF0YS5vbGQpIHtcbiAgICAgICAgdGhpcy50YWIuc2hvdygpO1xuICAgICAgfSBlbHNlIGlmICghZXZ0LmRhdGEuY291bnQpIHtcbiAgICAgICAgdGhpcy50YWIuaGlkZSgpO1xuICAgICAgfVxuICAgIH1cblxuICAgIF9ob29rTW9kZWxGaWVsZHMoZmllbGRzLCBtZXRhKSB7XG4gICAgICBpZiAobWV0YS50eXBlID09IFwiYmxvY2tseVwiKSB7XG4gICAgICAgIHZhciBib2R5Q29uZmlncyA9IEFycmF5LmFwcGx5KG51bGwsIHtsZW5ndGg6T2JqZWN0LmtleXMoZGVmYXVsdENvbmZpZ3MpLmxlbmd0aH0pLm1hcCgobnVtYmVyLGluZCkgPT4gJ3NlbnNvckNvbmZpZ18nICsgKGluZCsxKSk7XG4gICAgICAgIC8vIEZpbHRlciBvdXQgdGhlIG9wdGlvbnMgdGhhdCBhcmUgbm90IGluIGFsbG93ZWRDb25maWdzXG4gICAgICAgIGlmIChtZXRhLmNvbmZpZy5hbGxvd2VkQ29uZmlncy5sZW5ndGgpIHtcbiAgICAgICAgICBmb3IgKGxldCBpZHggPSBib2R5Q29uZmlncy5sZW5ndGggLSAxOyBpZHggPj0gMDsgaWR4LS0pIHtcbiAgICAgICAgICAgIGlmICgobWV0YS5jb25maWcuYWxsb3dlZENvbmZpZ3MuaW5kZXhPZihkZWZhdWx0Q29uZmlnc1tib2R5Q29uZmlnc1tpZHhdXS5pZC50b0xvd2VyQ2FzZSgpKSA9PSAtMSkpIHtcbiAgICAgICAgICAgICAgYm9keUNvbmZpZ3Muc3BsaWNlKGlkeCwxKVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICB0aGlzLmJvZHlDb25maWdPcHRpb25zID0ge31cbiAgICAgICAgYm9keUNvbmZpZ3MubWFwKGJvZHljb25maWcgPT4gdGhpcy5ib2R5Q29uZmlnT3B0aW9uc1tib2R5Y29uZmlnXSA9IGRlZmF1bHRDb25maWdzW2JvZHljb25maWddWydpZCddKVxuICAgICAgICBmaWVsZHMgPSBmaWVsZHMuY29uY2F0KFtTZWxlY3RGaWVsZC5jcmVhdGUoe1xuICAgICAgICAgICAgaWQ6IFwiYm9keUNvbmZpZ3VyYXRpb25OYW1lXCIsXG4gICAgICAgICAgICBpbnZlcnNlX29yZGVyOiB0cnVlLFxuICAgICAgICAgICAgY29sb3I6IG1ldGEuY29uZmlnLmJvZHlDb25maWd1cmF0aW9uLmNvbG9yID8gbWV0YS5jb25maWcuYm9keUNvbmZpZ3VyYXRpb24uY29sb3IgOiBudWxsLFxuICAgICAgICAgICAgbGFiZWw6IG1ldGEuY29uZmlnLmJvZHlDb25maWd1cmF0aW9uLmxhYmVsLFxuICAgICAgICAgICAgdmFsdWU6IG1ldGEuY29uZmlnLmJvZHlDb25maWd1cmF0aW9uLmluaXRpYWxWYWx1ZSxcbiAgICAgICAgICAgIG1pbl93aWR0aDogbWV0YS5jb25maWcuYm9keUNvbmZpZ3VyYXRpb24ubWluX3dpZHRoLFxuICAgICAgICAgICAgY2xhc3NlczogW10sXG4gICAgICAgICAgICBvcHRpb25zOiB0aGlzLmJvZHlDb25maWdPcHRpb25zXG4gICAgICAgICAgfSksIFN5bVNlbGVjdEZpZWxkLmNyZWF0ZSh7XG4gICAgICAgICAgICBpZDogJ3YnLFxuICAgICAgICAgICAgaW52ZXJzZV9vcmRlcjogdHJ1ZSxcbiAgICAgICAgICAgIGluY2x1ZGVWYXJpYXRpb246IG1ldGEuY29uZmlnLnZhcmlhdGlvbiA/IHRydWUgOiBmYWxzZSxcbiAgICAgICAgICAgIGxhYmVsOiBtZXRhLmNvbmZpZy52LmxhYmVsLFxuICAgICAgICAgICAgY29sb3I6IG1ldGEuY29uZmlnLnYuY29sb3IgPyBtZXRhLmNvbmZpZy52LmNvbG9yIDogbnVsbCxcbiAgICAgICAgICAgIHZhbHVlOiBtZXRhLmNvbmZpZy52LmluaXRpYWxWYWx1ZSxcbiAgICAgICAgICAgIG1heFZhbHVlOiBtZXRhLmNvbmZpZy52Lm1heFZhbHVlLFxuICAgICAgICAgICAgY2xhc3NlczogW10sXG4gICAgICAgICAgICBvcHRpb25zOiBtZXRhLmNvbmZpZy52Lm9wdGlvbnNcbiAgICAgICAgICB9KSwgU3ltU2VsZWN0RmllbGQuY3JlYXRlKHtcbiAgICAgICAgICAgIGlkOiAnaycsXG4gICAgICAgICAgICBpbnZlcnNlX29yZGVyOiB0cnVlLFxuICAgICAgICAgICAgaW5jbHVkZVZhcmlhdGlvbjogbWV0YS5jb25maWcudmFyaWF0aW9uID8gdHJ1ZSA6IGZhbHNlLFxuICAgICAgICAgICAgbGFiZWw6IG1ldGEuY29uZmlnLksubGFiZWwsXG4gICAgICAgICAgICBjb2xvcjogbWV0YS5jb25maWcuSy5jb2xvciA/IG1ldGEuY29uZmlnLksuY29sb3IgOiBudWxsLFxuICAgICAgICAgICAgdmFsdWU6IG1ldGEuY29uZmlnLksuaW5pdGlhbFZhbHVlLFxuICAgICAgICAgICAgbWF4VmFsdWU6IG1ldGEuY29uZmlnLksubWF4VmFsdWUsXG4gICAgICAgICAgICBjbGFzc2VzOiBbXSxcbiAgICAgICAgICAgIG9wdGlvbnM6IG1ldGEuY29uZmlnLksub3B0aW9uc1xuICAgICAgICAgIH0pXG4gICAgICAgIF0pXG5cbiAgICAgICAgLy8gQWRkIGVpdGhlciByb2xsIG9yIG1vdGlvbiB0eXBlIG9wdGlvblxuICAgICAgICBpZiAobWV0YS5jb25maWcubW9kZWxSZXByZXNlbnRhdGlvbiA9PT0gJ2Z1bmN0aW9uYWwnKSB7XG4gICAgICAgICAgZmllbGRzLnNwbGljZSgzLDAsU3ltU2VsZWN0RmllbGQuY3JlYXRlKHtcbiAgICAgICAgICAgIGlkOiAnb21lZ2EnLFxuICAgICAgICAgICAgaW52ZXJzZV9vcmRlcjogdHJ1ZSxcbiAgICAgICAgICAgIGluY2x1ZGVWYXJpYXRpb246IG1ldGEuY29uZmlnLnZhcmlhdGlvbiA/IHRydWUgOiBmYWxzZSxcbiAgICAgICAgICAgIGxhYmVsOiBtZXRhLmNvbmZpZy5vbWVnYS5sYWJlbCxcbiAgICAgICAgICAgIGNvbG9yOiBtZXRhLmNvbmZpZy5vbWVnYS5jb2xvciA/IG1ldGEuY29uZmlnLm9tZWdhLmNvbG9yIDogbnVsbCxcbiAgICAgICAgICAgIHZhbHVlOiBtZXRhLmNvbmZpZy5vbWVnYS5pbml0aWFsVmFsdWUsXG4gICAgICAgICAgICBtYXhWYWx1ZTogbWV0YS5jb25maWcub21lZ2EubWF4VmFsdWUsXG4gICAgICAgICAgICBjbGFzc2VzOiBbXSxcbiAgICAgICAgICAgIG9wdGlvbnM6IG1ldGEuY29uZmlnLm9tZWdhLm9wdGlvbnNcbiAgICAgICAgICB9KSlcbiAgICAgICAgfSBlbHNlIGlmIChtZXRhLmNvbmZpZy5tb2RlbFJlcHJlc2VudGF0aW9uID09PSAnbWVjaGFuaXN0aWMnKSB7XG4gICAgICAgICAgZmllbGRzLnNwbGljZSgzLDAsU3ltU2VsZWN0RmllbGQuY3JlYXRlKHtcbiAgICAgICAgICAgIGlkOiAnbW90aW9uJyxcbiAgICAgICAgICAgIGludmVyc2Vfb3JkZXI6IHRydWUsXG4gICAgICAgICAgICBpbmNsdWRlVmFyaWF0aW9uOiBmYWxzZSxcbiAgICAgICAgICAgIGxhYmVsOiBtZXRhLmNvbmZpZy5tb3Rpb24ubGFiZWwsXG4gICAgICAgICAgICBjb2xvcjogbWV0YS5jb25maWcubW90aW9uLmNvbG9yID8gbWV0YS5jb25maWcubW90aW9uLmNvbG9yIDogbnVsbCxcbiAgICAgICAgICAgIHZhbHVlOiBtZXRhLmNvbmZpZy5tb3Rpb24uaW5pdGlhbFZhbHVlLFxuICAgICAgICAgICAgbWF4VmFsdWU6IG1ldGEuY29uZmlnLm1vdGlvbi5tYXhWYWx1ZSxcbiAgICAgICAgICAgIGNsYXNzZXM6IFtdLFxuICAgICAgICAgICAgb3B0aW9uczogbWV0YS5jb25maWcubW90aW9uLm9wdGlvbnNcbiAgICAgICAgICB9KSlcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIEFkZCBvcGFjaXR5XG4gICAgICAgIGlmIChtZXRhLmNvbmZpZy5vcGFjaXR5KSB7XG4gICAgICAgICAgZmllbGRzLnNwbGljZSgxLDAsU3ltU2VsZWN0RmllbGQuY3JlYXRlKHtcbiAgICAgICAgICAgIGlkOiAnb3BhY2l0eScsXG4gICAgICAgICAgICBpbnZlcnNlX29yZGVyOiB0cnVlLFxuICAgICAgICAgICAgaW5jbHVkZVZhcmlhdGlvbjogbWV0YS5jb25maWcudmFyaWF0aW9uID8gdHJ1ZSA6IGZhbHNlLFxuICAgICAgICAgICAgbGFiZWw6IG1ldGEuY29uZmlnLm9wYWNpdHkubGFiZWwsXG4gICAgICAgICAgICBjb2xvcjogbWV0YS5jb25maWcub3BhY2l0eS5jb2xvciA/IG1ldGEuY29uZmlnLm9wYWNpdHkuY29sb3IgOiBudWxsLFxuICAgICAgICAgICAgdmFsdWU6IG1ldGEuY29uZmlnLm9wYWNpdHkuaW5pdGlhbFZhbHVlLFxuICAgICAgICAgICAgbWF4VmFsdWU6IG1ldGEuY29uZmlnLm9wYWNpdHkubWF4VmFsdWUsXG4gICAgICAgICAgICBjbGFzc2VzOiBbXSxcbiAgICAgICAgICAgIG9wdGlvbnM6IG1ldGEuY29uZmlnLm9wYWNpdHkub3B0aW9uc1xuICAgICAgICAgIH0pKVxuICAgICAgICB9XG5cbiAgICAgICAgLy8gQWRkIHZhcmlhdGlvblxuICAgICAgICBpZiAobWV0YS5jb25maWcudmFyaWF0aW9uKSB7XG4gICAgICAgICAgZmllbGRzLnB1c2goU3ltU2VsZWN0RmllbGQuY3JlYXRlKHtcbiAgICAgICAgICAgIGlkOiAndmFyaWF0aW9uJyxcbiAgICAgICAgICAgIGluY2x1ZGVWYXJpYXRpb246IGZhbHNlLFxuICAgICAgICAgICAgbGFiZWw6IG1ldGEuY29uZmlnLnZhcmlhdGlvbi5sYWJlbCxcbiAgICAgICAgICAgIGNvbG9yOiBtZXRhLmNvbmZpZy52YXJpYXRpb24uY29sb3IgPyBtZXRhLmNvbmZpZy52YXJpYXRpb24uY29sb3IgOiBudWxsLFxuICAgICAgICAgICAgdmFsdWU6IG1ldGEuY29uZmlnLnZhcmlhdGlvbi5pbml0aWFsVmFsdWUsXG4gICAgICAgICAgICBtYXhWYWx1ZTogbWV0YS5jb25maWcudmFyaWF0aW9uLm1heFZhbHVlLFxuICAgICAgICAgICAgY2xhc3NlczogW10sXG4gICAgICAgICAgICBvcHRpb25zOiBtZXRhLmNvbmZpZy52YXJpYXRpb24ub3B0aW9uc1xuICAgICAgICAgIH0pKVxuICAgICAgICB9XG4gICAgICB9XG4gICAgICByZXR1cm4gZmllbGRzO1xuICAgIH1cblxuICAgIF9ob29rTW9kaWZ5RXhwb3J0KGV4cCwgbWV0YSkge1xuXG4gICAgICBpZiAobWV0YS50eXBlID09IFwiYmxvY2tseVwiKSB7XG4gICAgICAgIFsnaycsICd2JywgJ29tZWdhJywnb3BhY2l0eScsJ3ZhcmlhdGlvbicsJ21vdGlvbiddLmZvckVhY2goKGtleSkgPT4ge1xuICAgICAgICAgIGlmIChPYmplY3Qua2V5cyhleHApLmluZGV4T2Yoa2V5KSA+LTEpIHtcbiAgICAgICAgICAgIGV4cFtgJHtrZXl9X251bWVyaWNgXSA9IGV4cFtrZXldLm51bWVyaWNWYWx1ZTtcbiAgICAgICAgICAgIGV4cFtgJHtrZXl9X3ZhcmlhdGlvbmBdID0gZXhwW2tleV0udmFyaWF0aW9uO1xuICAgICAgICAgICAgZXhwW2tleV0gPSBleHBba2V5XS5xdWFsaXRhdGl2ZVZhbHVlO1xuICAgICAgICAgIH1cbiAgICAgICAgfSlcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIGV4cFxuICAgIH1cblxuICAgIF9ob29rTW9kaWZ5SW1wb3J0KGRhdGEsIG1ldGEpIHtcbiAgICAgIGlmIChtZXRhLnR5cGUgPT0gXCJibG9ja2x5XCIpIHtcbiAgICAgICAgWydrJywgJ3YnLCAnb21lZ2EnLCdvcGFjaXR5JywndmFyaWF0aW9uJywnbW90aW9uJ10uZm9yRWFjaCgoa2V5KSA9PiB7XG4gICAgICAgICAgaWYgKE9iamVjdC5rZXlzKGRhdGEpLmluZGV4T2Yoa2V5KSA+IC0xKSB7XG4gICAgICAgICAgICBkYXRhW2tleV0gPSB7XG4gICAgICAgICAgICAgIHF1YWxpdGF0aXZlVmFsdWU6IGRhdGFba2V5XSxcbiAgICAgICAgICAgICAgbnVtZXJpY1ZhbHVlOiBkYXRhW2Ake2tleX1fbnVtZXJpY2BdLFxuICAgICAgICAgICAgICB2YXJpYXRpb246IGRhdGFbYCR7a2V5fV92YXJpYXRpb25gXVxuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIGRlbGV0ZSBkYXRhW2Ake2tleX1fbnVtZXJpY2BdO1xuICAgICAgICAgICAgZGVsZXRlIGRhdGFbYCR7a2V5fV92YXJpYXRpb25gXTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pXG4gICAgICB9XG4gICAgICByZXR1cm4gZGF0YTtcbiAgICB9XG5cbiAgICBfaG9vazNkVmlldyh2aWV3LCBtZXRhKSB7XG4gICAgICBpZiAobWV0YS5jb25maWcubW9kZWxUeXBlID09IFwiYmxvY2tseVwiKSB7XG4gICAgICAgIHJldHVybiAobmV3IE1vZGVsVmlldyh7IGJhc2VDb2xvcjogbWV0YS5jb2xvciB9KSkudmlldygpXG4gICAgICB9XG4gICAgICByZXR1cm4gdmlldztcbiAgICB9XG4gIH1cblxuICByZXR1cm4gTW9kZWxpbmdEYXRhTW9kdWxlO1xufSlcbiJdfQ==
