'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

define(function (require) {
  var DomView = require('core/view/dom_view'),
      Template = require('text!./form.html');

  return function (_DomView) {
    _inherits(FormView, _DomView);

    function FormView(model) {
      var tmpl = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

      _classCallCheck(this, FormView);

      var _this = _possibleConstructorReturn(this, (FormView.__proto__ || Object.getPrototypeOf(FormView)).call(this, tmpl || Template));

      _this._onFieldAdded = _this._onFieldAdded.bind(_this);
      _this._onFieldRemoved = _this._onFieldRemoved.bind(_this);
      _this._onChange = _this._onChange.bind(_this);

      // this.$el.attr('id', model.get('id'));
      // model.get('classes').forEach((cls) => this.$el.addClass(cls));
      _this._fieldViews = [];
      _this._buttonViews = [];

      _this.render(model);

      model.addEventListener('Form.FieldAdded', _this._onFieldAdded);
      model.addEventListener('Form.FieldRemoved', _this._onFieldRemoved);
      model.addEventListener('Model.Change', _this._onChange);
      return _this;
    }

    _createClass(FormView, [{
      key: '_onChange',
      value: function _onChange(evt) {
        switch (evt.data.path) {
          case "buttons":
            this._renderButtons(evt.currentTarget);
            break;
          case "title":
            this._renderHeader(evt.currentTarget);
            break;
          case "errors":
            this._renderErrors(evt.currentTarget);
            break;
        }
      }
    }, {
      key: 'render',
      value: function render(model) {
        if (model.get('classes')) {
          this.$el.addClass(model.get('classes').join(' '));
        }
        this._renderHeader(model);
        this._renderFields(model);
        this._renderButtons(model);
        this._renderErrors(model);
        this._renderHelp(model);
      }
    }, {
      key: '_onFieldAdded',
      value: function _onFieldAdded(evt) {
        this._renderFields(evt.currentTarget);
      }
    }, {
      key: '_onFieldRemoved',
      value: function _onFieldRemoved(evt) {
        this._renderFields(evt.currentTarget);
      }
    }, {
      key: '_renderHeader',
      value: function _renderHeader(model) {
        if (model.get('title')) {
          if (this._title) this.removeChild(this._title);
          this._title = new DomView(model.get('title'));
          this.addChild(this._title, ".form__header");
          this.$el.find('.form__header').show();
        } else {
          this.$el.find('.form__header').hide();
        }
      }
    }, {
      key: '_renderFields',
      value: function _renderFields(model) {
        while (this._fieldViews.length) {
          this.removeChild(this._fieldViews.pop());
        }for (var regionId in model.get('regions')) {
          var destination = this._mapRegion(regionId);
          var _iteratorNormalCompletion = true;
          var _didIteratorError = false;
          var _iteratorError = undefined;

          try {
            for (var _iterator = model.get('regions')[regionId][Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
              var field = _step.value;

              this._fieldViews.push(field.view());
              this.addChild(field.view(), destination);
            }
          } catch (err) {
            _didIteratorError = true;
            _iteratorError = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion && _iterator.return) {
                _iterator.return();
              }
            } finally {
              if (_didIteratorError) {
                throw _iteratorError;
              }
            }
          }
        }
      }
    }, {
      key: '_renderErrors',
      value: function _renderErrors(model) {
        var errStr = model.get('errors').map(function (err) {
          return '<p class="form__error">' + err + '</p>';
        }).join('');
        this.$el.find(".form__errors").html(errStr);
      }
    }, {
      key: '_mapRegion',
      value: function _mapRegion(regionId) {
        return ".form__fields";
      }
    }, {
      key: '_renderButtons',
      value: function _renderButtons(model) {
        while (this._buttonViews.length) {
          this.removeChild(this._buttonViews.pop());
        }var _iteratorNormalCompletion2 = true;
        var _didIteratorError2 = false;
        var _iteratorError2 = undefined;

        try {
          for (var _iterator2 = model.get('buttons')[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
            var btn = _step2.value;

            this._buttonViews.push(btn.view());
            this.addChild(btn.view(), '.form__buttons');
          }
        } catch (err) {
          _didIteratorError2 = true;
          _iteratorError2 = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion2 && _iterator2.return) {
              _iterator2.return();
            }
          } finally {
            if (_didIteratorError2) {
              throw _iteratorError2;
            }
          }
        }
      }
    }, {
      key: '_renderHelp',
      value: function _renderHelp(model) {
        this.$el.find('.form__help').html(model.get('help'));
      }
    }]);

    return FormView;
  }(DomView);
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1vZHVsZS9jb3JlL2NvbXBvbmVudC9mb3JtL3ZpZXcuanMiXSwibmFtZXMiOlsiZGVmaW5lIiwicmVxdWlyZSIsIkRvbVZpZXciLCJUZW1wbGF0ZSIsIm1vZGVsIiwidG1wbCIsIl9vbkZpZWxkQWRkZWQiLCJiaW5kIiwiX29uRmllbGRSZW1vdmVkIiwiX29uQ2hhbmdlIiwiX2ZpZWxkVmlld3MiLCJfYnV0dG9uVmlld3MiLCJyZW5kZXIiLCJhZGRFdmVudExpc3RlbmVyIiwiZXZ0IiwiZGF0YSIsInBhdGgiLCJfcmVuZGVyQnV0dG9ucyIsImN1cnJlbnRUYXJnZXQiLCJfcmVuZGVySGVhZGVyIiwiX3JlbmRlckVycm9ycyIsImdldCIsIiRlbCIsImFkZENsYXNzIiwiam9pbiIsIl9yZW5kZXJGaWVsZHMiLCJfcmVuZGVySGVscCIsIl90aXRsZSIsInJlbW92ZUNoaWxkIiwiYWRkQ2hpbGQiLCJmaW5kIiwic2hvdyIsImhpZGUiLCJsZW5ndGgiLCJwb3AiLCJyZWdpb25JZCIsImRlc3RpbmF0aW9uIiwiX21hcFJlZ2lvbiIsImZpZWxkIiwicHVzaCIsInZpZXciLCJlcnJTdHIiLCJtYXAiLCJlcnIiLCJodG1sIiwiYnRuIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQUFBLE9BQU8sVUFBQ0MsT0FBRCxFQUFhO0FBQ2xCLE1BQU1DLFVBQVVELFFBQVEsb0JBQVIsQ0FBaEI7QUFBQSxNQUNFRSxXQUFXRixRQUFRLGtCQUFSLENBRGI7O0FBR0E7QUFBQTs7QUFDRSxzQkFBWUcsS0FBWixFQUFnQztBQUFBLFVBQWJDLElBQWEsdUVBQU4sSUFBTTs7QUFBQTs7QUFBQSxzSEFDeEJBLFFBQVFGLFFBRGdCOztBQUc5QixZQUFLRyxhQUFMLEdBQXFCLE1BQUtBLGFBQUwsQ0FBbUJDLElBQW5CLE9BQXJCO0FBQ0EsWUFBS0MsZUFBTCxHQUF1QixNQUFLQSxlQUFMLENBQXFCRCxJQUFyQixPQUF2QjtBQUNBLFlBQUtFLFNBQUwsR0FBaUIsTUFBS0EsU0FBTCxDQUFlRixJQUFmLE9BQWpCOztBQUVBO0FBQ0E7QUFDQSxZQUFLRyxXQUFMLEdBQW1CLEVBQW5CO0FBQ0EsWUFBS0MsWUFBTCxHQUFvQixFQUFwQjs7QUFFQSxZQUFLQyxNQUFMLENBQVlSLEtBQVo7O0FBRUFBLFlBQU1TLGdCQUFOLENBQXVCLGlCQUF2QixFQUEwQyxNQUFLUCxhQUEvQztBQUNBRixZQUFNUyxnQkFBTixDQUF1QixtQkFBdkIsRUFBNEMsTUFBS0wsZUFBakQ7QUFDQUosWUFBTVMsZ0JBQU4sQ0FBdUIsY0FBdkIsRUFBdUMsTUFBS0osU0FBNUM7QUFoQjhCO0FBaUIvQjs7QUFsQkg7QUFBQTtBQUFBLGdDQW9CWUssR0FwQlosRUFvQmlCO0FBQ2IsZ0JBQVFBLElBQUlDLElBQUosQ0FBU0MsSUFBakI7QUFDRSxlQUFLLFNBQUw7QUFDRSxpQkFBS0MsY0FBTCxDQUFvQkgsSUFBSUksYUFBeEI7QUFDQTtBQUNGLGVBQUssT0FBTDtBQUNFLGlCQUFLQyxhQUFMLENBQW1CTCxJQUFJSSxhQUF2QjtBQUNBO0FBQ0YsZUFBSyxRQUFMO0FBQ0UsaUJBQUtFLGFBQUwsQ0FBbUJOLElBQUlJLGFBQXZCO0FBQ0E7QUFUSjtBQVdEO0FBaENIO0FBQUE7QUFBQSw2QkFrQ1NkLEtBbENULEVBa0NnQjtBQUNaLFlBQUlBLE1BQU1pQixHQUFOLENBQVUsU0FBVixDQUFKLEVBQTBCO0FBQ3hCLGVBQUtDLEdBQUwsQ0FBU0MsUUFBVCxDQUFrQm5CLE1BQU1pQixHQUFOLENBQVUsU0FBVixFQUFxQkcsSUFBckIsQ0FBMEIsR0FBMUIsQ0FBbEI7QUFDRDtBQUNELGFBQUtMLGFBQUwsQ0FBbUJmLEtBQW5CO0FBQ0EsYUFBS3FCLGFBQUwsQ0FBbUJyQixLQUFuQjtBQUNBLGFBQUthLGNBQUwsQ0FBb0JiLEtBQXBCO0FBQ0EsYUFBS2dCLGFBQUwsQ0FBbUJoQixLQUFuQjtBQUNBLGFBQUtzQixXQUFMLENBQWlCdEIsS0FBakI7QUFDRDtBQTNDSDtBQUFBO0FBQUEsb0NBNkNnQlUsR0E3Q2hCLEVBNkNxQjtBQUNqQixhQUFLVyxhQUFMLENBQW1CWCxJQUFJSSxhQUF2QjtBQUNEO0FBL0NIO0FBQUE7QUFBQSxzQ0FnRGtCSixHQWhEbEIsRUFnRHVCO0FBQ25CLGFBQUtXLGFBQUwsQ0FBbUJYLElBQUlJLGFBQXZCO0FBQ0Q7QUFsREg7QUFBQTtBQUFBLG9DQW9EZ0JkLEtBcERoQixFQW9EdUI7QUFDbkIsWUFBSUEsTUFBTWlCLEdBQU4sQ0FBVSxPQUFWLENBQUosRUFBd0I7QUFDdEIsY0FBSSxLQUFLTSxNQUFULEVBQWlCLEtBQUtDLFdBQUwsQ0FBaUIsS0FBS0QsTUFBdEI7QUFDakIsZUFBS0EsTUFBTCxHQUFjLElBQUl6QixPQUFKLENBQVlFLE1BQU1pQixHQUFOLENBQVUsT0FBVixDQUFaLENBQWQ7QUFDQSxlQUFLUSxRQUFMLENBQWMsS0FBS0YsTUFBbkIsRUFBMkIsZUFBM0I7QUFDQSxlQUFLTCxHQUFMLENBQVNRLElBQVQsQ0FBYyxlQUFkLEVBQStCQyxJQUEvQjtBQUNELFNBTEQsTUFLTztBQUNMLGVBQUtULEdBQUwsQ0FBU1EsSUFBVCxDQUFjLGVBQWQsRUFBK0JFLElBQS9CO0FBQ0Q7QUFDRjtBQTdESDtBQUFBO0FBQUEsb0NBK0RnQjVCLEtBL0RoQixFQStEdUI7QUFDbkIsZUFBTyxLQUFLTSxXQUFMLENBQWlCdUIsTUFBeEI7QUFBZ0MsZUFBS0wsV0FBTCxDQUFpQixLQUFLbEIsV0FBTCxDQUFpQndCLEdBQWpCLEVBQWpCO0FBQWhDLFNBRUEsS0FBSyxJQUFJQyxRQUFULElBQXFCL0IsTUFBTWlCLEdBQU4sQ0FBVSxTQUFWLENBQXJCLEVBQTJDO0FBQ3pDLGNBQUllLGNBQWMsS0FBS0MsVUFBTCxDQUFnQkYsUUFBaEIsQ0FBbEI7QUFEeUM7QUFBQTtBQUFBOztBQUFBO0FBRXpDLGlDQUFrQi9CLE1BQU1pQixHQUFOLENBQVUsU0FBVixFQUFxQmMsUUFBckIsQ0FBbEIsOEhBQWtEO0FBQUEsa0JBQXpDRyxLQUF5Qzs7QUFDaEQsbUJBQUs1QixXQUFMLENBQWlCNkIsSUFBakIsQ0FBc0JELE1BQU1FLElBQU4sRUFBdEI7QUFDQSxtQkFBS1gsUUFBTCxDQUFjUyxNQUFNRSxJQUFOLEVBQWQsRUFBNEJKLFdBQTVCO0FBQ0Q7QUFMd0M7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQU0xQztBQUNGO0FBekVIO0FBQUE7QUFBQSxvQ0EyRWdCaEMsS0EzRWhCLEVBMkV1QjtBQUNuQixZQUFJcUMsU0FBU3JDLE1BQU1pQixHQUFOLENBQVUsUUFBVixFQUFvQnFCLEdBQXBCLENBQXdCLFVBQUNDLEdBQUQ7QUFBQSw2Q0FBbUNBLEdBQW5DO0FBQUEsU0FBeEIsRUFBc0VuQixJQUF0RSxDQUEyRSxFQUEzRSxDQUFiO0FBQ0EsYUFBS0YsR0FBTCxDQUFTUSxJQUFULENBQWMsZUFBZCxFQUErQmMsSUFBL0IsQ0FBb0NILE1BQXBDO0FBQ0Q7QUE5RUg7QUFBQTtBQUFBLGlDQWdGYU4sUUFoRmIsRUFnRnVCO0FBQ25CLGVBQU8sZUFBUDtBQUNEO0FBbEZIO0FBQUE7QUFBQSxxQ0FvRmlCL0IsS0FwRmpCLEVBb0Z3QjtBQUNwQixlQUFPLEtBQUtPLFlBQUwsQ0FBa0JzQixNQUF6QjtBQUFpQyxlQUFLTCxXQUFMLENBQWlCLEtBQUtqQixZQUFMLENBQWtCdUIsR0FBbEIsRUFBakI7QUFBakMsU0FEb0I7QUFBQTtBQUFBOztBQUFBO0FBR3BCLGdDQUFnQjlCLE1BQU1pQixHQUFOLENBQVUsU0FBVixDQUFoQixtSUFBc0M7QUFBQSxnQkFBN0J3QixHQUE2Qjs7QUFDcEMsaUJBQUtsQyxZQUFMLENBQWtCNEIsSUFBbEIsQ0FBdUJNLElBQUlMLElBQUosRUFBdkI7QUFDQSxpQkFBS1gsUUFBTCxDQUFjZ0IsSUFBSUwsSUFBSixFQUFkLEVBQTBCLGdCQUExQjtBQUNEO0FBTm1CO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFPckI7QUEzRkg7QUFBQTtBQUFBLGtDQTZGY3BDLEtBN0ZkLEVBNkZxQjtBQUNqQixhQUFLa0IsR0FBTCxDQUFTUSxJQUFULENBQWMsYUFBZCxFQUE2QmMsSUFBN0IsQ0FBa0N4QyxNQUFNaUIsR0FBTixDQUFVLE1BQVYsQ0FBbEM7QUFDRDtBQS9GSDs7QUFBQTtBQUFBLElBQThCbkIsT0FBOUI7QUFpR0QsQ0FyR0QiLCJmaWxlIjoibW9kdWxlL2NvcmUvY29tcG9uZW50L2Zvcm0vdmlldy5qcyIsInNvdXJjZXNDb250ZW50IjpbImRlZmluZSgocmVxdWlyZSkgPT4ge1xuICBjb25zdCBEb21WaWV3ID0gcmVxdWlyZSgnY29yZS92aWV3L2RvbV92aWV3JyksXG4gICAgVGVtcGxhdGUgPSByZXF1aXJlKCd0ZXh0IS4vZm9ybS5odG1sJyk7XG5cbiAgcmV0dXJuIGNsYXNzIEZvcm1WaWV3IGV4dGVuZHMgRG9tVmlldyB7XG4gICAgY29uc3RydWN0b3IobW9kZWwsIHRtcGwgPSBudWxsKSB7XG4gICAgICBzdXBlcih0bXBsIHx8IFRlbXBsYXRlKTtcblxuICAgICAgdGhpcy5fb25GaWVsZEFkZGVkID0gdGhpcy5fb25GaWVsZEFkZGVkLmJpbmQodGhpcyk7XG4gICAgICB0aGlzLl9vbkZpZWxkUmVtb3ZlZCA9IHRoaXMuX29uRmllbGRSZW1vdmVkLmJpbmQodGhpcyk7XG4gICAgICB0aGlzLl9vbkNoYW5nZSA9IHRoaXMuX29uQ2hhbmdlLmJpbmQodGhpcyk7XG5cbiAgICAgIC8vIHRoaXMuJGVsLmF0dHIoJ2lkJywgbW9kZWwuZ2V0KCdpZCcpKTtcbiAgICAgIC8vIG1vZGVsLmdldCgnY2xhc3NlcycpLmZvckVhY2goKGNscykgPT4gdGhpcy4kZWwuYWRkQ2xhc3MoY2xzKSk7XG4gICAgICB0aGlzLl9maWVsZFZpZXdzID0gW107XG4gICAgICB0aGlzLl9idXR0b25WaWV3cyA9IFtdO1xuXG4gICAgICB0aGlzLnJlbmRlcihtb2RlbCk7XG5cbiAgICAgIG1vZGVsLmFkZEV2ZW50TGlzdGVuZXIoJ0Zvcm0uRmllbGRBZGRlZCcsIHRoaXMuX29uRmllbGRBZGRlZCk7XG4gICAgICBtb2RlbC5hZGRFdmVudExpc3RlbmVyKCdGb3JtLkZpZWxkUmVtb3ZlZCcsIHRoaXMuX29uRmllbGRSZW1vdmVkKTtcbiAgICAgIG1vZGVsLmFkZEV2ZW50TGlzdGVuZXIoJ01vZGVsLkNoYW5nZScsIHRoaXMuX29uQ2hhbmdlKTtcbiAgICB9XG5cbiAgICBfb25DaGFuZ2UoZXZ0KSB7XG4gICAgICBzd2l0Y2ggKGV2dC5kYXRhLnBhdGgpIHtcbiAgICAgICAgY2FzZSBcImJ1dHRvbnNcIjpcbiAgICAgICAgICB0aGlzLl9yZW5kZXJCdXR0b25zKGV2dC5jdXJyZW50VGFyZ2V0KTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSBcInRpdGxlXCI6XG4gICAgICAgICAgdGhpcy5fcmVuZGVySGVhZGVyKGV2dC5jdXJyZW50VGFyZ2V0KTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSBcImVycm9yc1wiOlxuICAgICAgICAgIHRoaXMuX3JlbmRlckVycm9ycyhldnQuY3VycmVudFRhcmdldCk7XG4gICAgICAgICAgYnJlYWtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZW5kZXIobW9kZWwpIHtcbiAgICAgIGlmIChtb2RlbC5nZXQoJ2NsYXNzZXMnKSkge1xuICAgICAgICB0aGlzLiRlbC5hZGRDbGFzcyhtb2RlbC5nZXQoJ2NsYXNzZXMnKS5qb2luKCcgJykpO1xuICAgICAgfVxuICAgICAgdGhpcy5fcmVuZGVySGVhZGVyKG1vZGVsKTtcbiAgICAgIHRoaXMuX3JlbmRlckZpZWxkcyhtb2RlbCk7XG4gICAgICB0aGlzLl9yZW5kZXJCdXR0b25zKG1vZGVsKTtcbiAgICAgIHRoaXMuX3JlbmRlckVycm9ycyhtb2RlbCk7XG4gICAgICB0aGlzLl9yZW5kZXJIZWxwKG1vZGVsKTtcbiAgICB9XG5cbiAgICBfb25GaWVsZEFkZGVkKGV2dCkge1xuICAgICAgdGhpcy5fcmVuZGVyRmllbGRzKGV2dC5jdXJyZW50VGFyZ2V0KTtcbiAgICB9XG4gICAgX29uRmllbGRSZW1vdmVkKGV2dCkge1xuICAgICAgdGhpcy5fcmVuZGVyRmllbGRzKGV2dC5jdXJyZW50VGFyZ2V0KTtcbiAgICB9XG5cbiAgICBfcmVuZGVySGVhZGVyKG1vZGVsKSB7XG4gICAgICBpZiAobW9kZWwuZ2V0KCd0aXRsZScpKSB7XG4gICAgICAgIGlmICh0aGlzLl90aXRsZSkgdGhpcy5yZW1vdmVDaGlsZCh0aGlzLl90aXRsZSk7XG4gICAgICAgIHRoaXMuX3RpdGxlID0gbmV3IERvbVZpZXcobW9kZWwuZ2V0KCd0aXRsZScpKVxuICAgICAgICB0aGlzLmFkZENoaWxkKHRoaXMuX3RpdGxlLCBcIi5mb3JtX19oZWFkZXJcIilcbiAgICAgICAgdGhpcy4kZWwuZmluZCgnLmZvcm1fX2hlYWRlcicpLnNob3coKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuJGVsLmZpbmQoJy5mb3JtX19oZWFkZXInKS5oaWRlKCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgX3JlbmRlckZpZWxkcyhtb2RlbCkge1xuICAgICAgd2hpbGUgKHRoaXMuX2ZpZWxkVmlld3MubGVuZ3RoKSB0aGlzLnJlbW92ZUNoaWxkKHRoaXMuX2ZpZWxkVmlld3MucG9wKCkpO1xuXG4gICAgICBmb3IgKGxldCByZWdpb25JZCBpbiBtb2RlbC5nZXQoJ3JlZ2lvbnMnKSkge1xuICAgICAgICBsZXQgZGVzdGluYXRpb24gPSB0aGlzLl9tYXBSZWdpb24ocmVnaW9uSWQpO1xuICAgICAgICBmb3IgKGxldCBmaWVsZCBvZiBtb2RlbC5nZXQoJ3JlZ2lvbnMnKVtyZWdpb25JZF0pIHtcbiAgICAgICAgICB0aGlzLl9maWVsZFZpZXdzLnB1c2goZmllbGQudmlldygpKTtcbiAgICAgICAgICB0aGlzLmFkZENoaWxkKGZpZWxkLnZpZXcoKSwgZGVzdGluYXRpb24pO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgX3JlbmRlckVycm9ycyhtb2RlbCkge1xuICAgICAgbGV0IGVyclN0ciA9IG1vZGVsLmdldCgnZXJyb3JzJykubWFwKChlcnIpID0+IGA8cCBjbGFzcz1cImZvcm1fX2Vycm9yXCI+JHtlcnJ9PC9wPmApLmpvaW4oJycpO1xuICAgICAgdGhpcy4kZWwuZmluZChcIi5mb3JtX19lcnJvcnNcIikuaHRtbChlcnJTdHIpO1xuICAgIH1cblxuICAgIF9tYXBSZWdpb24ocmVnaW9uSWQpIHtcbiAgICAgIHJldHVybiBcIi5mb3JtX19maWVsZHNcIjtcbiAgICB9XG5cbiAgICBfcmVuZGVyQnV0dG9ucyhtb2RlbCkge1xuICAgICAgd2hpbGUgKHRoaXMuX2J1dHRvblZpZXdzLmxlbmd0aCkgdGhpcy5yZW1vdmVDaGlsZCh0aGlzLl9idXR0b25WaWV3cy5wb3AoKSk7XG5cbiAgICAgIGZvciAobGV0IGJ0biBvZiBtb2RlbC5nZXQoJ2J1dHRvbnMnKSkge1xuICAgICAgICB0aGlzLl9idXR0b25WaWV3cy5wdXNoKGJ0bi52aWV3KCkpO1xuICAgICAgICB0aGlzLmFkZENoaWxkKGJ0bi52aWV3KCksICcuZm9ybV9fYnV0dG9ucycpO1xuICAgICAgfVxuICAgIH1cblxuICAgIF9yZW5kZXJIZWxwKG1vZGVsKSB7XG4gICAgICB0aGlzLiRlbC5maW5kKCcuZm9ybV9faGVscCcpLmh0bWwobW9kZWwuZ2V0KCdoZWxwJykpO1xuICAgIH1cbiAgfTtcbn0pOyJdfQ==
