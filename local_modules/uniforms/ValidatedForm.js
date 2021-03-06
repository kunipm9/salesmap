"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _objectSpread2 = _interopRequireDefault(require("@babel/runtime/helpers/objectSpread"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _get2 = _interopRequireDefault(require("@babel/runtime/helpers/get"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime/helpers/assertThisInitialized"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _cloneDeep = _interopRequireDefault(require("lodash/cloneDeep"));

var _isEqual = _interopRequireDefault(require("lodash/isEqual"));

var _merge = _interopRequireDefault(require("lodash/merge"));

var _omit = _interopRequireDefault(require("lodash/omit"));

var _set = _interopRequireDefault(require("lodash/set"));

var _BaseForm = _interopRequireWildcard(require("./BaseForm"));

var childContextTypes = (0, _BaseForm.__childContextTypesBuild)((0, _merge.default)({
  state: {
    validating: _propTypes.default.bool.isRequired
  }
}, _BaseForm.__childContextTypes));

var Validated = function Validated(parent) {
  var _class, _temp;

  return _temp = _class =
  /*#__PURE__*/
  function (_parent) {
    (0, _inherits2.default)(_class, _parent);

    function _class() {
      var _this;

      (0, _classCallCheck2.default)(this, _class);
      _this = (0, _possibleConstructorReturn2.default)(this, (0, _getPrototypeOf2.default)(_class).apply(this, arguments));
      _this.state = (0, _objectSpread2.default)({}, _this.state, {
        error: null,
        validate: false,
        validating: false,
        validator: _this.getChildContextSchema().getValidator(_this.props.validator)
      });
      _this.onValidate = _this.validate = _this.onValidate.bind((0, _assertThisInitialized2.default)((0, _assertThisInitialized2.default)(_this)));
      _this.onValidateModel = _this.validateModel = _this.onValidateModel.bind((0, _assertThisInitialized2.default)((0, _assertThisInitialized2.default)(_this)));
      return _this;
    }

    (0, _createClass2.default)(_class, [{
      key: "getChildContextError",
      value: function getChildContextError() {
        return (0, _get2.default)((0, _getPrototypeOf2.default)(_class.prototype), "getChildContextError", this).call(this) || this.state.error;
      }
    }, {
      key: "getChildContextState",
      value: function getChildContextState() {
        return (0, _objectSpread2.default)({}, (0, _get2.default)((0, _getPrototypeOf2.default)(_class.prototype), "getChildContextState", this).call(this), {
          validating: this.state.validating
        });
      }
    }, {
      key: "getNativeFormProps",
      value: function getNativeFormProps() {
        return (0, _omit.default)((0, _get2.default)((0, _getPrototypeOf2.default)(_class.prototype), "getNativeFormProps", this).call(this), ['onValidate', 'validate', 'validator']);
      }
    }, {
      key: "componentWillReceiveProps",
      value: function componentWillReceiveProps(_ref) {
        var _this2 = this;

        var model = _ref.model,
            schema = _ref.schema,
            validate = _ref.validate,
            validator = _ref.validator;
        (0, _get2.default)((0, _getPrototypeOf2.default)(_class.prototype), "componentWillReceiveProps", this).apply(this, arguments);

        if (this.props.schema !== schema || this.props.validator !== validator) {
          this.setState(function (_ref2) {
            var bridge = _ref2.bridge;
            return {
              validator: bridge.getValidator(validator)
            };
          }, function () {
            if (validate === 'onChange' || validate === 'onChangeAfterSubmit' && _this2.state.validate) {
              _this2.onValidate().catch(function () {});
            }
          });
        } else if (!(0, _isEqual.default)(this.props.model, model)) {
          if (validate === 'onChange' || validate === 'onChangeAfterSubmit' && this.state.validate) {
            this.onValidateModel(model).catch(function () {});
          }
        }
      }
    }, {
      key: "onChange",
      value: function onChange(key, value) {
        // eslint-disable-next-line max-len
        if (this.props.validate === 'onChange' || this.props.validate === 'onChangeAfterSubmit' && this.state.validate) {
          this.onValidate(key, value).catch(function () {});
        } // FIXME: https://github.com/vazco/uniforms/issues/293
        // if (this.props.validate === 'onSubmit' && this.state.validate) {
        //     this.setState(() => ({error: null}));
        // }


        (0, _get2.default)((0, _getPrototypeOf2.default)(_class.prototype), "onChange", this).apply(this, arguments);
      }
    }, {
      key: "__reset",
      value: function __reset(state) {
        return (0, _objectSpread2.default)({}, (0, _get2.default)((0, _getPrototypeOf2.default)(_class.prototype), "__reset", this).call(this, state), {
          error: null,
          validate: false,
          validating: false
        });
      }
    }, {
      key: "onSubmit",
      value: function onSubmit(event) {
        var _this3 = this;

        if (event) {
          event.preventDefault();
          event.stopPropagation();
          if (! window.$GLOBAL$.submitForm) {
            return;
          }
        }
        window.$GLOBAL$.submitForm = false;

        var promise = new Promise(function (resolve, reject) {
          _this3.setState(function () {
            return {
              submitting: true,
              validate: true
            };
          }, function () {
            _this3.onValidate().then(function () {
              (0, _get2.default)((0, _getPrototypeOf2.default)(_class.prototype), "onSubmit", _this3).call(_this3).then(resolve, function (error) {

                console.error(error);

                _this3.setState({
                  error: error
                });

                reject(error);
              });
            }, reject);
          });
        });
        promise.catch(function () {// `onSubmit` should never reject, so we ignore this rejection.
        }).then(function () {
          // It can be already unmounted.
          if (_this3.mounted) // If validation fails, or `super.onSubmit` doesn't touch `submitting`, we need to reset it.
            _this3.setState(function (state) {
              return state.submitting ? {
                submitting: false
              } : null;
            });
        });
        return promise;
      }
    }, {
      key: "onValidate",
      value: function onValidate(key, value) {
        var model = this.getChildContextModel();

        if (model && key) {
          model = (0, _set.default)((0, _cloneDeep.default)(model), key, (0, _cloneDeep.default)(value));
        }

        return this.onValidateModel(model);
      }
    }, {
      key: "onValidateModel",
      value: function onValidateModel(model) {
        var _this4 = this;

        model = this.getModel('validate', model);
        var catched = this.props.error || null;

        try {
          this.state.validator(model);
        } catch (error) {
          catched = error;
        }

        this.setState({
          validating: true
        });
        return new Promise(function (resolve, reject) {
          _this4.props.onValidate(model, catched, function () {
            var error = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : catched;

            // Do not copy error from props to state.
            _this4.setState(function () {
              return {
                error: error === _this4.props.error ? null : error,
                validating: false
              };
            }, function () {
              if (error) {
                reject(error);
              } else {
                resolve();
              }
            });
          });
        });
      }
    }]);
    return _class;
  }(parent), _class.Validated = Validated, _class.displayName = "Validated".concat(parent.displayName), _class.defaultProps = (0, _objectSpread2.default)({}, parent.defaultProps, {
    onValidate: function onValidate(model, error, callback) {
      callback();
    },
    validate: 'onChangeAfterSubmit'
  }), _class.propTypes = (0, _objectSpread2.default)({}, parent.propTypes, {
    onValidate: _propTypes.default.func.isRequired,
    validator: _propTypes.default.any,
    validate: _propTypes.default.oneOf(['onChange', 'onChangeAfterSubmit', 'onSubmit']).isRequired
  }), _class.childContextTypes = (0, _objectSpread2.default)({}, parent.childContextTypes || {}, {
    uniforms: childContextTypes
  }), _temp;
};

var _default = Validated(_BaseForm.default);

exports.default = _default;
