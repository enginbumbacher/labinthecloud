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

          // Add variation option
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9ldWdsZW5hL21vZGVsX2Jsb2NrbHkvbW9kdWxlLmpzIl0sIm5hbWVzIjpbImRlZmluZSIsInJlcXVpcmUiLCJVdGlscyIsIkdsb2JhbHMiLCJITSIsIk1vZHVsZSIsIk1vZGVsaW5nRGF0YVRhYiIsIlNlbGVjdEZpZWxkIiwiU3ltU2VsZWN0RmllbGQiLCJNb2RlbFZpZXciLCJkZWZhdWx0Q29uZmlncyIsIk1vZGVsaW5nRGF0YU1vZHVsZSIsImdldCIsImJpbmRNZXRob2RzIiwidGFiIiwiYWRkRXZlbnRMaXN0ZW5lciIsIl9vblBoYXNlQ2hhbmdlIiwiX29uRXhwZXJpbWVudENvdW50Q2hhbmdlIiwiaG9vayIsIl9ob29rTW9kZWxGaWVsZHMiLCJfaG9va01vZGlmeUV4cG9ydCIsIl9ob29rTW9kaWZ5SW1wb3J0IiwiX2hvb2szZFZpZXciLCJnZXRQYW5lbCIsImFkZENvbnRlbnQiLCJ2aWV3IiwiZXZ0IiwiZGF0YSIsInBoYXNlIiwiaGlkZSIsImNvdW50Iiwib2xkIiwic2hvdyIsImZpZWxkcyIsIm1ldGEiLCJ0eXBlIiwiYm9keUNvbmZpZ3MiLCJBcnJheSIsImFwcGx5IiwibGVuZ3RoIiwiT2JqZWN0Iiwia2V5cyIsIm1hcCIsIm51bWJlciIsImluZCIsImNvbmZpZyIsImFsbG93ZWRDb25maWdzIiwiaWR4IiwiaW5kZXhPZiIsImlkIiwidG9Mb3dlckNhc2UiLCJzcGxpY2UiLCJib2R5Q29uZmlnT3B0aW9ucyIsImJvZHljb25maWciLCJjb25jYXQiLCJjcmVhdGUiLCJpbnZlcnNlX29yZGVyIiwiY29sb3IiLCJib2R5Q29uZmlndXJhdGlvbiIsImxhYmVsIiwidmFsdWUiLCJpbml0aWFsVmFsdWUiLCJjbGFzc2VzIiwib3B0aW9ucyIsImluY2x1ZGVWYXJpYXRpb24iLCJ2YXJpYXRpb24iLCJvcGFjaXR5IiwibWF4VmFsdWUiLCJ2IiwiSyIsIm1vZGVsUmVwcmVzZW50YXRpb24iLCJvbWVnYSIsIm1vdGlvbiIsInB1c2giLCJleHAiLCJmb3JFYWNoIiwia2V5IiwibnVtZXJpY1ZhbHVlIiwicXVhbGl0YXRpdmVWYWx1ZSIsIm1vZGVsVHlwZSIsImJhc2VDb2xvciJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBQSxPQUFPLFVBQUNDLE9BQUQsRUFBYTtBQUNsQixNQUFNQyxRQUFRRCxRQUFRLGlCQUFSLENBQWQ7QUFBQSxNQUNFRSxVQUFVRixRQUFRLG9CQUFSLENBRFo7QUFBQSxNQUVFRyxLQUFLSCxRQUFRLHlCQUFSLENBRlA7O0FBSUEsTUFBTUksU0FBU0osUUFBUSxpQkFBUixDQUFmO0FBQUEsTUFDRUssa0JBQWtCTCxRQUFRLGtCQUFSLENBRHBCOztBQUVFO0FBQ0E7QUFDQU0sZ0JBQWNOLFFBQVEsa0NBQVIsQ0FKaEI7QUFBQSxNQUtFTyxpQkFBaUJQLFFBQVEscUNBQVIsQ0FMbkI7QUFBQSxNQU1FUSxZQUFZUixRQUFRLGFBQVIsQ0FOZDs7QUFRQSxNQUFNUyxpQkFBaUJULFFBQVEsZ0RBQVIsQ0FBdkI7O0FBYmtCLE1BZ0JaVSxrQkFoQlk7QUFBQTs7QUFpQmhCLGtDQUFjO0FBQUE7O0FBQUE7O0FBRVosVUFBSVIsUUFBUVMsR0FBUixDQUFZLG9CQUFaLENBQUosRUFBdUM7QUFDckNWLGNBQU1XLFdBQU4sUUFBd0IsQ0FBQyxnQkFBRCxFQUFtQiwwQkFBbkIsRUFDMUIsa0JBRDBCLEVBQ04sbUJBRE0sRUFDZSxtQkFEZixFQUNvQyxhQURwQyxDQUF4Qjs7QUFHQSxjQUFLQyxHQUFMLEdBQVcsSUFBSVIsZUFBSixFQUFYOztBQUVBSCxnQkFBUVMsR0FBUixDQUFZLE9BQVosRUFBcUJHLGdCQUFyQixDQUFzQyxpQkFBdEMsRUFBeUQsTUFBS0MsY0FBOUQ7QUFDQWIsZ0JBQVFTLEdBQVIsQ0FBWSxPQUFaLEVBQXFCRyxnQkFBckIsQ0FBc0Msd0JBQXRDLEVBQWdFLE1BQUtFLHdCQUFyRTs7QUFFQWIsV0FBR2MsSUFBSCxDQUFRLGtCQUFSLEVBQTRCLE1BQUtDLGdCQUFqQztBQUNBZixXQUFHYyxJQUFILENBQVEsd0JBQVIs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bUIsU0FBbkIsRUFBNkIsV0FBN0IsRUFBeUMsUUFBekMsRUFBbUR3QyxPQUFuRCxDQUEyRCxVQUFDQyxHQUFELEVBQVM7QUFDbEUsZ0JBQUlwQyxPQUFPQyxJQUFQLENBQVlkLElBQVosRUFBa0JxQixPQUFsQixDQUEwQjRCLEdBQTFCLElBQWlDLENBQUMsQ0FBdEMsRUFBeUM7QUFDdkNqRCxtQkFBS2lELEdBQUwsSUFBWTtBQUNWRSxrQ0FBa0JuRCxLQUFLaUQsR0FBTCxDQURSO0FBRVZDLDhCQUFjbEQsS0FBUWlELEdBQVIsY0FGSjtBQUdWWCwyQkFBV3RDLEtBQVFpRCxHQUFSO0FBSEQsZUFBWjtBQUtBLHFCQUFPakQsS0FBUWlELEdBQVIsY0FBUDtBQUNBLHFCQUFPakQsS0FBUWlELEdBQVIsZ0JBQVA7QUFDRDtBQUNGLFdBVkQ7QUFXRDtBQUNELGVBQU9qRCxJQUFQO0FBQ0Q7QUF0TGU7QUFBQTtBQUFBLGtDQXdMSkYsSUF4TEksRUF3TEVTLElBeExGLEVBd0xRO0FBQ3RCLFlBQUlBLEtBQUtXLE1BQUwsQ0FBWWtDLFNBQVosSUFBeUIsU0FBN0IsRUFBd0M7QUFDdEMsaUJBQVEsSUFBSXRFLFNBQUosQ0FBYyxFQUFFdUUsV0FBVzlDLEtBQUt1QixLQUFsQixFQUFkLENBQUQsQ0FBMkNoQyxJQUEzQyxFQUFQO0FBQ0Q7QUFDRCxlQUFPQSxJQUFQO0FBQ0Q7QUE3TGU7O0FBQUE7QUFBQSxJQWdCZXBCLE1BaEJmOztBQWdNbEIsU0FBT00sa0JBQVA7QUFDRCxDQWpNRCIsImZpbGUiOiJtb2R1bGUvZXVnbGVuYS9tb2RlbF9ibG9ja2x5L21vZHVsZS5qcyIsInNvdXJjZXNDb250ZW50IjpbImRlZmluZSgocmVxdWlyZSkgPT4ge1xuICBjb25zdCBVdGlscyA9IHJlcXVpcmUoJ2NvcmUvdXRpbC91dGlscycpLFxuICAgIEdsb2JhbHMgPSByZXF1aXJlKCdjb3JlL21vZGVsL2dsb2JhbHMnKSxcbiAgICBITSA9IHJlcXVpcmUoJ2NvcmUvZXZlbnQvaG9va19tYW5hZ2VyJyk7XG5cbiAgY29uc3QgTW9kdWxlID0gcmVxdWlyZSgnY29yZS9hcHAvbW9kdWxlJyksXG4gICAgTW9kZWxpbmdEYXRhVGFiID0gcmVxdWlyZSgnLi9ibG9ja2x5dGFiL3RhYicpLFxuICAgIC8vU3ltU2xpZGVyRmllbGQgPSByZXF1aXJlKCdjb3JlL2NvbXBvbmVudC9zeW1zbGlkZXJmaWVsZC9maWVsZCcpLFxuICAgIC8vU2xpZGVyRmllbGQgPSByZXF1aXJlKCdjb3JlL2NvbXBvbmVudC9zbGlkZXJmaWVsZC9maWVsZCcpLFxuICAgIFNlbGVjdEZpZWxkID0gcmVxdWlyZSgnY29yZS9jb21wb25lbnQvc2VsZWN0ZmllbGQvZmllbGQnKSxcbiAgICBTeW1TZWxlY3RGaWVsZCA9IHJlcXVpcmUoJ2NvcmUvY29tcG9uZW50L3N5bXNlbGVjdGZpZWxkL2ZpZWxkJyksXG4gICAgTW9kZWxWaWV3ID0gcmVxdWlyZSgnLi90aHJlZXZpZXcnKTtcblxuICBjb25zdCBkZWZhdWx0Q29uZmlncyA9IHJlcXVpcmUoJy4vYm9keUNvbmZpZ3VyYXRpb25zL2JvZHljb25maWdzL2xpc3RvZmNvbmZpZ3MnKVxuXG5cbiAgY2xhc3MgTW9kZWxpbmdEYXRhTW9kdWxlIGV4dGVuZHMgTW9kdWxlIHtcbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgIHN1cGVyKCk7XG4gICAgICBpZiAoR2xvYmFscy5nZXQoJ0FwcENvbmZpZy5tb2RlbGluZycpKSB7XG4gICAgICAgIFV0aWxzLmJpbmRNZXRob2RzKHRoaXMsIFsnX29uUGhhc2VDaGFuZ2UnLCAnX29uRXhwZXJpbWVudENvdW50Q2hhbmdlJyxcbiAgICAgICdfaG9va01vZGVsRmllbGRzJywgJ19ob29rTW9kaWZ5RXhwb3J0JywgJ19ob29rTW9kaWZ5SW1wb3J0JywgJ19ob29rM2RWaWV3J10pXG5cbiAgICAgICAgdGhpcy50YWIgPSBuZXcgTW9kZWxpbmdEYXRhVGFiKCk7XG5cbiAgICAgICAgR2xvYmFscy5nZXQoJ1JlbGF5JykuYWRkRXZlbnRMaXN0ZW5lcignQXBwUGhhc2UuQ2hhbmdlJywgdGhpcy5fb25QaGFzZUNoYW5nZSlcbiAgICAgICAgR2xvYmFscy5nZXQoJ1JlbGF5JykuYWRkRXZlbnRMaXN0ZW5lcignRXhwZXJpbWVudENvdW50LkNoYW5nZScsIHRoaXMuX29uRXhwZXJpbWVudENvdW50Q2hhbmdlKVxuXG4gICAgICAgIEhNLmhvb2soJ01vZGVsRm9ybS5GaWVsZHMnLCB0aGlzLl9ob29rTW9kZWxGaWVsZHMpO1xuICAgICAgICBITS5ob29rKCdNb2RlbEZvcm0uTW9kaWZ5RXhwb3J0JywgdGhpcy5faG9va01vZGlmeUV4cG9ydCk7XG4gICAgICAgIEhNLmhvb2soJ01vZGVsRm9ybS5Nb2RpZnlJbXBvcnQnLCB0aGlzLl9ob29rTW9kaWZ5SW1wb3J0KTtcbiAgICAgICAgSE0uaG9vaygnRXVnbGVuYS4zZFZpZXcnLCB0aGlzLl9ob29rM2RWaWV3KVxuXG4gICAgICB9XG4gICAgfVxuXG4gICAgcnVuKCkge1xuICAgICAgaWYgKHRoaXMudGFiKSBHbG9iYWxzLmdldCgnTGF5b3V0JykuZ2V0UGFuZWwoJ3Jlc3VsdCcpLmFkZENvbnRlbnQodGhpcy50YWIudmlldygpKVxuICAgIH1cblxuICAgIF9vblBoYXNlQ2hhbmdlKGV2dCkge1xuICAgICAgaWYgKGV2dC5kYXRhLnBoYXNlID09IFwibG9naW5cIiB8fCBldnQuZGF0YS5waGFzZSA9PSBcImxvZ2luX2F0dGVtcHRlZFwiKSB7XG4gICAgICAgIHRoaXMudGFiLmhpZGUoKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBfb25FeHBlcmltZW50Q291bnRDaGFuZ2UoZXZ0KSB7XG4gICAgICBpZiAoZXZ0LmRhdGEuY291bnQgJiYgIWV2dC5kYXRhLm9sZCkge1xuICAgICAgICB0aGlzLnRhYi5zaG93KCk7XG4gICAgICB9IGVsc2UgaWYgKCFldnQuZGF0YS5jb3VudCkge1xuICAgICAgICB0aGlzLnRhYi5oaWRlKCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgX2hvb2tNb2RlbEZpZWxkcyhmaWVsZHMsIG1ldGEpIHtcbiAgICAgIGlmIChtZXRhLnR5cGUgPT0gXCJibG9ja2x5XCIpIHtcbiAgICAgICAgdmFyIGJvZHlDb25maWdzID0gQXJyYXkuYXBwbHkobnVsbCwge2xlbmd0aDpPYmplY3Qua2V5cyhkZWZhdWx0Q29uZmlncykubGVuZ3RofSkubWFwKChudW1iZXIsaW5kKSA9PiAnc2Vuc29yQ29uZmlnXycgKyAoaW5kKzEpKTtcbiAgICAgICAgLy8gRmlsdGVyIG91dCB0aGUgb3B0aW9ucyB0aGF0IGFyZSBub3QgaW4gYWxsb3dlZENvbmZpZ3NcbiAgICAgICAgaWYgKG1ldGEuY29uZmlnLmFsbG93ZWRDb25maWdzLmxlbmd0aCkge1xuICAgICAgICAgIGZvciAobGV0IGlkeCA9IGJvZHlDb25maWdzLmxlbmd0aCAtIDE7IGlkeCA+PSAwOyBpZHgtLSkge1xuICAgICAgICAgICAgaWYgKChtZXRhLmNvbmZpZy5hbGxvd2VkQ29uZmlncy5pbmRleE9mKGRlZmF1bHRDb25maWdzW2JvZHlDb25maWdzW2lkeF1dLmlkLnRvTG93ZXJDYXNlKCkpID09IC0xKSkge1xuICAgICAgICAgICAgICBib2R5Q29uZmlncy5zcGxpY2UoaWR4LDEpXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHRoaXMuYm9keUNvbmZpZ09wdGlvbnMgPSB7fVxuICAgICAgICBib2R5Q29uZmlncy5tYXAoYm9keWNvbmZpZyA9PiB0aGlzLmJvZHlDb25maWdPcHRpb25zW2JvZHljb25maWddID0gZGVmYXVsdENvbmZpZ3NbYm9keWNvbmZpZ11bJ2lkJ10pXG4gICAgICAgIGZpZWxkcyA9IGZpZWxkcy5jb25jYXQoW1NlbGVjdEZpZWxkLmNyZWF0ZSh7XG4gICAgICAgICAgICBpZDogXCJib2R5Q29uZmlndXJhdGlvbk5hbWVcIixcbiAgICAgICAgICAgIGludmVyc2Vfb3JkZXI6IHRydWUsXG4gICAgICAgICAgICBjb2xvcjogbWV0YS5jb25maWcuYm9keUNvbmZpZ3VyYXRpb24uY29sb3IgPyBtZXRhLmNvbmZpZy5ib2R5Q29uZmlndXJhdGlvbi5jb2xvciA6IG51bGwsXG4gICAgICAgICAgICBsYWJlbDogbWV0YS5jb25maWcuYm9keUNvbmZpZ3VyYXRpb24ubGFiZWwsXG4gICAgICAgICAgICB2YWx1ZTogbWV0YS5jb25maWcuYm9keUNvbmZpZ3VyYXRpb24uaW5pdGlhbFZhbHVlLFxuICAgICAgICAgICAgY2xhc3NlczogW10sXG4gICAgICAgICAgICBvcHRpb25zOiB0aGlzLmJvZHlDb25maWdPcHRpb25zXG4gICAgICAgICAgfSksIFN5bVNlbGVjdEZpZWxkLmNyZWF0ZSh7XG4gICAgICAgICAgICBpZDogJ29wYWNpdHknLFxuICAgICAgICAgICAgaW52ZXJzZV9vcmRlcjogdHJ1ZSxcbiAgICAgICAgICAgIGluY2x1ZGVWYXJpYXRpb246IG1ldGEuY29uZmlnLnZhcmlhdGlvbiA/IHRydWUgOiBmYWxzZSxcbiAgICAgICAgICAgIGxhYmVsOiBtZXRhLmNvbmZpZy5vcGFjaXR5LmxhYmVsLFxuICAgICAgICAgICAgY29sb3I6IG1ldGEuY29uZmlnLm9wYWNpdHkuY29sb3IgPyBtZXRhLmNvbmZpZy5vcGFjaXR5LmNvbG9yIDogbnVsbCxcbiAgICAgICAgICAgIHZhbHVlOiBtZXRhLmNvbmZpZy5vcGFjaXR5LmluaXRpYWxWYWx1ZSxcbiAgICAgICAgICAgIG1heFZhbHVlOiBtZXRhLmNvbmZpZy5vcGFjaXR5Lm1heFZhbHVlLFxuICAgICAgICAgICAgY2xhc3NlczogW10sXG4gICAgICAgICAgICBvcHRpb25zOiBtZXRhLmNvbmZpZy5vcGFjaXR5Lm9wdGlvbnNcbiAgICAgICAgICB9KSwgU3ltU2VsZWN0RmllbGQuY3JlYXRlKHtcbiAgICAgICAgICAgIGlkOiAndicsXG4gICAgICAgICAgICBpbnZlcnNlX29yZGVyOiB0cnVlLFxuICAgICAgICAgICAgaW5jbHVkZVZhcmlhdGlvbjogbWV0YS5jb25maWcudmFyaWF0aW9uID8gdHJ1ZSA6IGZhbHNlLFxuICAgICAgICAgICAgbGFiZWw6IG1ldGEuY29uZmlnLnYubGFiZWwsXG4gICAgICAgICAgICBjb2xvcjogbWV0YS5jb25maWcudi5jb2xvciA/IG1ldGEuY29uZmlnLnYuY29sb3IgOiBudWxsLFxuICAgICAgICAgICAgdmFsdWU6IG1ldGEuY29uZmlnLnYuaW5pdGlhbFZhbHVlLFxuICAgICAgICAgICAgbWF4VmFsdWU6IG1ldGEuY29uZmlnLnYubWF4VmFsdWUsXG4gICAgICAgICAgICBjbGFzc2VzOiBbXSxcbiAgICAgICAgICAgIG9wdGlvbnM6IG1ldGEuY29uZmlnLnYub3B0aW9uc1xuICAgICAgICAgIH0pLCBTeW1TZWxlY3RGaWVsZC5jcmVhdGUoe1xuICAgICAgICAgICAgaWQ6ICdrJyxcbiAgICAgICAgICAgIGludmVyc2Vfb3JkZXI6IHRydWUsXG4gICAgICAgICAgICBpbmNsdWRlVmFyaWF0aW9uOiBtZXRhLmNvbmZpZy52YXJpYXRpb24gPyB0cnVlIDogZmFsc2UsXG4gICAgICAgICAgICBsYWJlbDogbWV0YS5jb25maWcuSy5sYWJlbCxcbiAgICAgICAgICAgIGNvbG9yOiBtZXRhLmNvbmZpZy5LLmNvbG9yID8gbWV0YS5jb25maWcuSy5jb2xvciA6IG51bGwsXG4gICAgICAgICAgICB2YWx1ZTogbWV0YS5jb25maWcuSy5pbml0aWFsVmFsdWUsXG4gICAgICAgICAgICBtYXhWYWx1ZTogbWV0YS5jb25maWcuSy5tYXhWYWx1ZSxcbiAgICAgICAgICAgIGNsYXNzZXM6IFtdLFxuICAgICAgICAgICAgb3B0aW9uczogbWV0YS5jb25maWcuSy5vcHRpb25zXG4gICAgICAgICAgfSlcbiAgICAgICAgXSlcblxuICAgICAgICAvLyBBZGQgZWl0aGVyIHJvbGwgb3IgbW90aW9uIHR5cGUgb3B0aW9uXG4gICAgICAgIGlmIChtZXRhLmNvbmZpZy5tb2RlbFJlcHJlc2VudGF0aW9uID09PSAnZnVuY3Rpb25hbCcpIHtcbiAgICAgICAgICBmaWVsZHMuc3BsaWNlKDMsMCxTeW1TZWxlY3RGaWVsZC5jcmVhdGUoe1xuICAgICAgICAgICAgaWQ6ICdvbWVnYScsXG4gICAgICAgICAgICBpbnZlcnNlX29yZGVyOiB0cnVlLFxuICAgICAgICAgICAgaW5jbHVkZVZhcmlhdGlvbjogbWV0YS5jb25maWcudmFyaWF0aW9uID8gdHJ1ZSA6IGZhbHNlLFxuICAgICAgICAgICAgbGFiZWw6IG1ldGEuY29uZmlnLm9tZWdhLmxhYmVsLFxuICAgICAgICAgICAgY29sb3I6IG1ldGEuY29uZmlnLm9tZWdhLmNvbG9yID8gbWV0YS5jb25maWcub21lZ2EuY29sb3IgOiBudWxsLFxuICAgICAgICAgICAgdmFsdWU6IG1ldGEuY29uZmlnLm9tZWdhLmluaXRpYWxWYWx1ZSxcbiAgICAgICAgICAgIG1heFZhbHVlOiBtZXRhLmNvbmZpZy5vbWVnYS5tYXhWYWx1ZSxcbiAgICAgICAgICAgIGNsYXNzZXM6IFtdLFxuICAgICAgICAgICAgb3B0aW9uczogbWV0YS5jb25maWcub21lZ2Eub3B0aW9uc1xuICAgICAgICAgIH0pKVxuICAgICAgICB9IGVsc2UgaWYgKG1ldGEuY29uZmlnLm1vZGVsUmVwcmVzZW50YXRpb24gPT09ICdtZWNoYW5pc3RpYycpIHtcbiAgICAgICAgICBmaWVsZHMuc3BsaWNlKDMsMCxTeW1TZWxlY3RGaWVsZC5jcmVhdGUoe1xuICAgICAgICAgICAgaWQ6ICdtb3Rpb24nLFxuICAgICAgICAgICAgaW52ZXJzZV9vcmRlcjogdHJ1ZSxcbiAgICAgICAgICAgIGluY2x1ZGVWYXJpYXRpb246IGZhbHNlLFxuICAgICAgICAgICAgbGFiZWw6IG1ldGEuY29uZmlnLm1vdGlvbi5sYWJlbCxcbiAgICAgICAgICAgIGNvbG9yOiBtZXRhLmNvbmZpZy5tb3Rpb24uY29sb3IgPyBtZXRhLmNvbmZpZy5tb3Rpb24uY29sb3IgOiBudWxsLFxuICAgICAgICAgICAgdmFsdWU6IG1ldGEuY29uZmlnLm1vdGlvbi5pbml0aWFsVmFsdWUsXG4gICAgICAgICAgICBtYXhWYWx1ZTogbWV0YS5jb25maWcubW90aW9uLm1heFZhbHVlLFxuICAgICAgICAgICAgY2xhc3NlczogW10sXG4gICAgICAgICAgICBvcHRpb25zOiBtZXRhLmNvbmZpZy5tb3Rpb24ub3B0aW9uc1xuICAgICAgICAgIH0pKVxuICAgICAgICB9XG5cbiAgICAgICAgLy8gQWRkIHZhcmlhdGlvbiBvcHRpb25cbiAgICAgICAgaWYgKG1ldGEuY29uZmlnLnZhcmlhdGlvbikge1xuICAgICAgICAgIGZpZWxkcy5wdXNoKFN5bVNlbGVjdEZpZWxkLmNyZWF0ZSh7XG4gICAgICAgICAgICBpZDogJ3ZhcmlhdGlvbicsXG4gICAgICAgICAgICBpbmNsdWRlVmFyaWF0aW9uOiBmYWxzZSxcbiAgICAgICAgICAgIGxhYmVsOiBtZXRhLmNvbmZpZy52YXJpYXRpb24ubGFiZWwsXG4gICAgICAgICAgICBjb2xvcjogbWV0YS5jb25maWcudmFyaWF0aW9uLmNvbG9yID8gbWV0YS5jb25maWcudmFyaWF0aW9uLmNvbG9yIDogbnVsbCxcbiAgICAgICAgICAgIHZhbHVlOiBtZXRhLmNvbmZpZy52YXJpYXRpb24uaW5pdGlhbFZhbHVlLFxuICAgICAgICAgICAgbWF4VmFsdWU6IG1ldGEuY29uZmlnLnZhcmlhdGlvbi5tYXhWYWx1ZSxcbiAgICAgICAgICAgIGNsYXNzZXM6IFtdLFxuICAgICAgICAgICAgb3B0aW9uczogbWV0YS5jb25maWcudmFyaWF0aW9uLm9wdGlvbnNcbiAgICAgICAgICB9KSlcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmV0dXJuIGZpZWxkcztcbiAgICB9XG5cbiAgICBfaG9va01vZGlmeUV4cG9ydChleHAsIG1ldGEpIHtcblxuICAgICAgaWYgKG1ldGEudHlwZSA9PSBcImJsb2NrbHlcIikge1xuICAgICAgICBbJ2snLCAndicsICdvbWVnYScsJ29wYWNpdHknLCd2YXJpYXRpb24nLCdtb3Rpb24nXS5mb3JFYWNoKChrZXkpID0+IHtcbiAgICAgICAgICBpZiAoT2JqZWN0LmtleXMoZXhwKS5pbmRleE9mKGtleSkgPi0xKSB7XG4gICAgICAgICAgICBleHBbYCR7a2V5fV9udW1lcmljYF0gPSBleHBba2V5XS5udW1lcmljVmFsdWU7XG4gICAgICAgICAgICBleHBbYCR7a2V5fV92YXJpYXRpb25gXSA9IGV4cFtrZXldLnZhcmlhdGlvbjtcbiAgICAgICAgICAgIGV4cFtrZXldID0gZXhwW2tleV0ucXVhbGl0YXRpdmVWYWx1ZTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pXG4gICAgICB9XG5cbiAgICAgIHJldHVybiBleHBcbiAgICB9XG5cbiAgICBfaG9va01vZGlmeUltcG9ydChkYXRhLCBtZXRhKSB7XG4gICAgICBpZiAobWV0YS50eXBlID09IFwiYmxvY2tseVwiKSB7XG4gICAgICAgIFsnaycsICd2JywgJ29tZWdhJywnb3BhY2l0eScsJ3ZhcmlhdGlvbicsJ21vdGlvbiddLmZvckVhY2goKGtleSkgPT4ge1xuICAgICAgICAgIGlmIChPYmplY3Qua2V5cyhkYXRhKS5pbmRleE9mKGtleSkgPiAtMSkge1xuICAgICAgICAgICAgZGF0YVtrZXldID0ge1xuICAgICAgICAgICAgICBxdWFsaXRhdGl2ZVZhbHVlOiBkYXRhW2tleV0sXG4gICAgICAgICAgICAgIG51bWVyaWNWYWx1ZTogZGF0YVtgJHtrZXl9X251bWVyaWNgXSxcbiAgICAgICAgICAgICAgdmFyaWF0aW9uOiBkYXRhW2Ake2tleX1fdmFyaWF0aW9uYF1cbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICBkZWxldGUgZGF0YVtgJHtrZXl9X251bWVyaWNgXTtcbiAgICAgICAgICAgIGRlbGV0ZSBkYXRhW2Ake2tleX1fdmFyaWF0aW9uYF07XG4gICAgICAgICAgfVxuICAgICAgICB9KVxuICAgICAgfVxuICAgICAgcmV0dXJuIGRhdGE7XG4gICAgfVxuXG4gICAgX2hvb2szZFZpZXcodmlldywgbWV0YSkge1xuICAgICAgaWYgKG1ldGEuY29uZmlnLm1vZGVsVHlwZSA9PSBcImJsb2NrbHlcIikge1xuICAgICAgICByZXR1cm4gKG5ldyBNb2RlbFZpZXcoeyBiYXNlQ29sb3I6IG1ldGEuY29sb3IgfSkpLnZpZXcoKVxuICAgICAgfVxuICAgICAgcmV0dXJuIHZpZXc7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIE1vZGVsaW5nRGF0YU1vZHVsZTtcbn0pXG4iXX0=
