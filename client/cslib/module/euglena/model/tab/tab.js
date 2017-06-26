'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

define(function (require) {
  var Globals = require('core/model/globals'),
      Utils = require('core/util/utils'),
      HM = require('core/event/hook_manager');

  var Component = require('core/component/component'),
      Model = require('./model'),
      View = require('./view'),
      ModelHistoryForm = require('../history/form'),
      ModelForm = require('../form/form'),
      NameForm = require('../nameform/form'),
      EugUtils = require('euglena/utils');

  var ModelTab = function (_Component) {
    _inherits(ModelTab, _Component);

    function ModelTab() {
      var settings = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      _classCallCheck(this, ModelTab);

      settings.modelClass = settings.modelClass || Model;
      settings.viewClass = settings.viewClass || View;

      var _this = _possibleConstructorReturn(this, (ModelTab.__proto__ || Object.getPrototypeOf(ModelTab)).call(this, settings));

      Utils.bindMethods(_this, ['_onSimulateRequest', '_onSaveRequest', '_onAggregateRequest', '_onNameCancel', '_onNameSubmit', '_onGlobalsChange', '_loadModelInForm', '_onHistorySelectionChange', '_onConfigChange', '_onNewRequest']);

      _this._history = ModelHistoryForm.create({
        id: 'model_history__' + _this._model.get("id"),
        modelType: _this._model.get('modelType')
      });
      _this._history.addEventListener('Form.FieldChanged', _this._onHistorySelectionChange);

      _this._form = ModelForm.create({
        modelType: _this._model.get('modelType'),
        fieldConfig: _this._model.get('parameters'),
        euglenaCountConfig: _this._model.get('euglenaCount')
      });
      _this._form.addEventListener('Form.FieldChanged', _this._onConfigChange);
      _this._form.view().addEventListener('ModelForm.Simulate', _this._onSimulateRequest);
      _this._form.view().addEventListener('ModelForm.Save', _this._onSaveRequest);
      _this._form.view().addEventListener('ModelForm.AddToAggregate', _this._onAggregateRequest);
      _this._form.view().addEventListener('ModelForm.NewRequest', _this._onNewRequest);

      _this._nameForm = NameForm.create();
      _this._nameForm.view().addEventListener('ModelSave.Submit', _this._onNameSubmit);
      _this._nameForm.view().addEventListener('ModelSave.Cancel', _this._onNameCancel);
      _this.view().addChild(_this._history.view());
      _this.view().addChild(_this._form.view());

      Globals.addEventListener('Model.Change', _this._onGlobalsChange);
      return _this;
    }

    _createClass(ModelTab, [{
      key: 'id',
      value: function id() {
        return this._model.get('id');
      }
    }, {
      key: 'lastResultId',
      value: function lastResultId() {
        return this._lastSimulationId;
      }
    }, {
      key: 'currModelId',
      value: function currModelId() {
        return this._currModelId;
      }
    }, {
      key: 'currModel',
      value: function currModel() {
        return this._currentModel;
      }
    }, {
      key: 'color',
      value: function color() {
        return this._model.get('color');
      }
    }, {
      key: '_onGlobalsChange',
      value: function _onGlobalsChange(evt) {
        var _this2 = this;

        switch (evt.data.path) {
          case 'student_id':
            this._history.update().then(function () {
              var hist = _this2._history.getHistory();
              if (hist.length) {
                return _this2._history.import({
                  model_history_id: hist[hist.length - 1]
                });
              } else {
                _this2._form.setState('new');
                return true;
              }
            }).then(function () {
              _this2._loadModelInForm(_this2._history.export().model_history_id);
            });
            break;
        }
      }
    }, {
      key: '_onHistorySelectionChange',
      value: function _onHistorySelectionChange(evt) {
        this._loadModelInForm(evt.currentTarget.export().model_history_id);
      }
    }, {
      key: '_onConfigChange',
      value: function _onConfigChange(evt) {
        if (this._history.export().model_history_id != '_new') {
          this._history.import({ model_history_id: '_new' });
          this._lastSimulationId = null;
          this._form.setState('new');
        }
      }
    }, {
      key: '_loadModelInForm',
      value: function _loadModelInForm(id) {
        var _this3 = this;

        if (!id) return;
        var oldId = this._currModelId;
        var target = id == '_new' ? null : id;
        if (oldId != target) {
          if (id != '_new') {
            this._currModelId = id;
            Utils.promiseAjax('/api/v1/EuglenaModels/' + id).then(function (data) {
              _this3._form.removeEventListener('Form.FieldChanged', _this3._onConfigChange);
              _this3._currentModel = data;
              _this3._form.import(data.configuration).then(function () {
                _this3._form.addEventListener('Form.FieldChanged', _this3._onConfigChange);
                Globals.get('Relay').dispatchEvent('EuglenaModel.Loaded', {
                  model: data,
                  tabId: _this3._model.get('id')
                });
              });
            });
            this._form.setState('historical');
          } else {
            this._currModelId = null;
            this._currentModel = null;
            Globals.get('Relay').dispatchEvent('EuglenaModel.Loaded', {
              model: {
                id: '_new'
              },
              tabId: this._model.get('id')
            });
            this._form.setState('new');
          }
          Globals.get('Logger').log({
            type: "load",
            category: "model",
            data: {
              modelId: id,
              tab: this.id()
            }
          });
        }
      }
    }, {
      key: '_onSimulateRequest',
      value: function _onSimulateRequest(evt) {
        var _this4 = this;

        var conf = this._form.export();
        EugUtils.generateResults({
          experimentId: Globals.get('currentExperiment').id,
          model: {
            modelType: this._model.get('modelType'),
            configuration: conf
          },
          count: conf.count,
          magnification: Globals.get('currentExperimentResults.magnification')
        }).then(function (data) {
          _this4._lastSimulationId = data.id;
          Globals.get('Relay').dispatchEvent('Simulation.Run', {
            results: data,
            simulation: {
              experimentId: Globals.get('currentExperiment').id,
              model: {
                modelType: _this4._model.get('modelType'),
                configuration: conf
              },
              count: conf.count,
              magnification: Globals.get('currentExperimentResults.magnification')
            },
            tabId: _this4._model.get('id')
          });
        });
        Globals.get('Logger').log({
          type: "simulate",
          category: "model",
          data: {
            modelType: this._model.get('modelType'),
            configuration: conf
          }
        });
      }
    }, {
      key: '_onSaveRequest',
      value: function _onSaveRequest(evt) {
        Globals.get('InteractiveModal').display(this._nameForm.view());
      }
    }, {
      key: '_onNameSubmit',
      value: function _onNameSubmit(evt) {
        var _this5 = this;

        var model = void 0;
        this._nameForm.validate().then(function (validation) {
          return Utils.promiseAjax('/api/v1/EuglenaModels', {
            method: 'POST',
            data: JSON.stringify({
              studentId: Globals.get('student_id'),
              configuration: _this5._form.export(),
              modelType: _this5._model.get('modelType'),
              name: _this5._nameForm.export().name,
              lab: Globals.get('AppConfig.lab')
            }),
            contentType: 'application/json'
          });
        }, function (err) {
          // do nothing
        }).then(function (data) {
          if (!data) return;
          model = data;
          _this5._currModelId = model.id;
          if (_this5._lastSimulationId) {
            return Utils.promiseAjax('/api/v1/Results/' + _this5._lastSimulationId, {
              method: 'PATCH',
              data: JSON.stringify({
                euglenaModelId: model.id
              }),
              contentType: 'application/json'
            });
          } else {
            return EugUtils.generateResults({
              euglenaModelId: model.id,
              experimentId: Globals.get('currentExperiment').id,
              count: model.count,
              magnification: Globals.get('currentExperimentResults.magnification')
            });
          }
        }).then(function (results) {
          _this5._lastSimulationId = results.id;
          Globals.get('InteractiveModal').hide().then(function () {
            _this5._nameForm.clear();
          });
          return _this5._history.update();
        }).then(function () {
          _this5._history.import({
            model_history_id: model.id
          });
        });
        Globals.get('Logger').log({
          type: "save",
          category: "model",
          data: {
            configuration: this._form.export(),
            modelType: this._model.get('modelType'),
            name: this._nameForm.export().name
          }
        });
      }
    }, {
      key: '_onNameCancel',
      value: function _onNameCancel(evt) {
        var _this6 = this;

        Globals.get('InteractiveModal').hide().then(function () {
          _this6._nameForm.clear();
        });
      }
    }, {
      key: '_onAggregateRequest',
      value: function _onAggregateRequest(evt) {
        EugUtils.getModelResults(Globals.get('currentExperiment.id'), this._currentModel).then(function (results) {
          Globals.get('Relay').dispatchEvent('AggregateData.AddRequest', {
            data: results
          });
        });
        Globals.get('Logger').log({
          type: "aggregate",
          category: "model",
          data: {
            modelId: this._history.export().model_history_id
          }
        });
      }
    }, {
      key: '_onNewRequest',
      value: function _onNewRequest(evt) {
        this._onConfigChange(evt);
      }
    }]);

    return ModelTab;
  }(Component);

  ModelTab.create = function (data) {
    return new ModelTab({ modelData: data });
  };

  return ModelTab;
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9ldWdsZW5hL21vZGVsL3RhYi90YWIuanMiXSwibmFtZXMiOlsiZGVmaW5lIiwicmVxdWlyZSIsIkdsb2JhbHMiLCJVdGlscyIsIkhNIiwiQ29tcG9uZW50IiwiTW9kZWwiLCJWaWV3IiwiTW9kZWxIaXN0b3J5Rm9ybSIsIk1vZGVsRm9ybSIsIk5hbWVGb3JtIiwiRXVnVXRpbHMiLCJNb2RlbFRhYiIsInNldHRpbmdzIiwibW9kZWxDbGFzcyIsInZpZXdDbGFzcyIsImJpbmRNZXRob2RzIiwiX2hpc3RvcnkiLCJjcmVhdGUiLCJpZCIsIl9tb2RlbCIsImdldCIsIm1vZGVsVHlwZSIsImFkZEV2ZW50TGlzdGVuZXIiLCJfb25IaXN0b3J5U2VsZWN0aW9uQ2hhbmdlIiwiX2Zvcm0iLCJmaWVsZENvbmZpZyIsImV1Z2xlbmFDb3VudENvbmZpZyIsIl9vbkNvbmZpZ0NoYW5nZSIsInZpZXciLCJfb25TaW11bGF0ZVJlcXVlc3QiLCJfb25TYXZlUmVxdWVzdCIsIl9vbkFnZ3JlZ2F0ZVJlcXVlc3QiLCJfb25OZXdSZXF1ZXN0IiwiX25hbWVGb3JtIiwiX29uTmFtZVN1Ym1pdCIsIl9vbk5hbWVDYW5jZWwiLCJhZGRDaGlsZCIsIl9vbkdsb2JhbHNDaGFuZ2UiLCJfbGFzdFNpbXVsYXRpb25JZCIsIl9jdXJyTW9kZWxJZCIsIl9jdXJyZW50TW9kZWwiLCJldnQiLCJkYXRhIiwicGF0aCIsInVwZGF0ZSIsInRoZW4iLCJoaXN0IiwiZ2V0SGlzdG9yeSIsImxlbmd0aCIsImltcG9ydCIsIm1vZGVsX2hpc3RvcnlfaWQiLCJzZXRTdGF0ZSIsIl9sb2FkTW9kZWxJbkZvcm0iLCJleHBvcnQiLCJjdXJyZW50VGFyZ2V0Iiwib2xkSWQiLCJ0YXJnZXQiLCJwcm9taXNlQWpheCIsInJlbW92ZUV2ZW50TGlzdGVuZXIiLCJjb25maWd1cmF0aW9uIiwiZGlzcGF0Y2hFdmVudCIsIm1vZGVsIiwidGFiSWQiLCJsb2ciLCJ0eXBlIiwiY2F0ZWdvcnkiLCJtb2RlbElkIiwidGFiIiwiY29uZiIsImdlbmVyYXRlUmVzdWx0cyIsImV4cGVyaW1lbnRJZCIsImNvdW50IiwibWFnbmlmaWNhdGlvbiIsInJlc3VsdHMiLCJzaW11bGF0aW9uIiwiZGlzcGxheSIsInZhbGlkYXRlIiwidmFsaWRhdGlvbiIsIm1ldGhvZCIsIkpTT04iLCJzdHJpbmdpZnkiLCJzdHVkZW50SWQiLCJuYW1lIiwibGFiIiwiY29udGVudFR5cGUiLCJlcnIiLCJldWdsZW5hTW9kZWxJZCIsImhpZGUiLCJjbGVhciIsImdldE1vZGVsUmVzdWx0cyIsIm1vZGVsRGF0YSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBQSxPQUFPLFVBQUNDLE9BQUQsRUFBYTtBQUNsQixNQUFNQyxVQUFVRCxRQUFRLG9CQUFSLENBQWhCO0FBQUEsTUFDRUUsUUFBUUYsUUFBUSxpQkFBUixDQURWO0FBQUEsTUFFRUcsS0FBS0gsUUFBUSx5QkFBUixDQUZQOztBQUlBLE1BQU1JLFlBQVlKLFFBQVEsMEJBQVIsQ0FBbEI7QUFBQSxNQUNFSyxRQUFRTCxRQUFRLFNBQVIsQ0FEVjtBQUFBLE1BRUVNLE9BQU9OLFFBQVEsUUFBUixDQUZUO0FBQUEsTUFJRU8sbUJBQW1CUCxRQUFRLGlCQUFSLENBSnJCO0FBQUEsTUFLRVEsWUFBWVIsUUFBUSxjQUFSLENBTGQ7QUFBQSxNQU1FUyxXQUFXVCxRQUFRLGtCQUFSLENBTmI7QUFBQSxNQU9FVSxXQUFXVixRQUFRLGVBQVIsQ0FQYjs7QUFMa0IsTUFjWlcsUUFkWTtBQUFBOztBQWVoQix3QkFBMkI7QUFBQSxVQUFmQyxRQUFlLHVFQUFKLEVBQUk7O0FBQUE7O0FBQ3pCQSxlQUFTQyxVQUFULEdBQXNCRCxTQUFTQyxVQUFULElBQXVCUixLQUE3QztBQUNBTyxlQUFTRSxTQUFULEdBQXFCRixTQUFTRSxTQUFULElBQXNCUixJQUEzQzs7QUFGeUIsc0hBR25CTSxRQUhtQjs7QUFJekJWLFlBQU1hLFdBQU4sUUFBd0IsQ0FDdEIsb0JBRHNCLEVBQ0EsZ0JBREEsRUFDa0IscUJBRGxCLEVB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
