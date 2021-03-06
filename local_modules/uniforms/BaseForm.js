"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.__childContextTypesBuild = exports.__childContextTypes = void 0;

var _objectSpread2 = _interopRequireDefault(require("@babel/runtime/helpers/objectSpread"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime/helpers/assertThisInitialized"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _react = _interopRequireWildcard(require("react"));

var _cloneDeep = _interopRequireDefault(require("lodash/cloneDeep"));

var _get = _interopRequireDefault(require("lodash/get"));

var _isFunction = _interopRequireDefault(require("lodash/isFunction"));

var _isPlainObject = _interopRequireDefault(require("lodash/isPlainObject"));

var _mapValues = _interopRequireDefault(require("lodash/mapValues"));

var _omit = _interopRequireDefault(require("lodash/omit"));

var _set = _interopRequireDefault(require("lodash/set"));

var _changedKeys = _interopRequireDefault(require("./changedKeys"));

var _createSchemaBridge = _interopRequireDefault(require("./createSchemaBridge"));

var _randomIds = _interopRequireDefault(require("./randomIds"));

var __childContextTypes = {
  name: _propTypes.default.arrayOf(_propTypes.default.string).isRequired,
  error: _propTypes.default.object,
  model: _propTypes.default.object.isRequired,
  schema: {
    getError: _propTypes.default.func.isRequired,
    getErrorMessage: _propTypes.default.func.isRequired,
    getErrorMessages: _propTypes.default.func.isRequired,
    getField: _propTypes.default.func.isRequired,
    getInitialValue: _propTypes.default.func.isRequired,
    getProps: _propTypes.default.func.isRequired,
    getSubfields: _propTypes.default.func.isRequired,
    getType: _propTypes.default.func.isRequired,
    getValidator: _propTypes.default.func.isRequired
  },
  state: {
    changed: _propTypes.default.bool.isRequired,
    changedMap: _propTypes.default.object.isRequired,
    submitting: _propTypes.default.bool.isRequired,
    label: _propTypes.default.bool.isRequired,
    disabled: _propTypes.default.bool.isRequired,
    placeholder: _propTypes.default.bool.isRequired,
    showInlineError: _propTypes.default.bool.isRequired
  },
  onChange: _propTypes.default.func.isRequired,
  randomId: _propTypes.default.func.isRequired
};
exports.__childContextTypes = __childContextTypes;

var __childContextTypesBuild = function __childContextTypesBuild(type) {
  return (0, _isPlainObject.default)(type) ? _propTypes.default.shape((0, _mapValues.default)(type, __childContextTypesBuild)).isRequired : type;
};

exports.__childContextTypesBuild = __childContextTypesBuild;

var BaseForm =
/*#__PURE__*/
function (_Component) {
  (0, _inherits2.default)(BaseForm, _Component);

  function BaseForm() {
    var _this;

    (0, _classCallCheck2.default)(this, BaseForm);
    _this = (0, _possibleConstructorReturn2.default)(this, (0, _getPrototypeOf2.default)(BaseForm).apply(this, arguments));
    _this.state = {
      bridge: (0, _createSchemaBridge.default)(_this.props.schema),
      changed: null,
      changedMap: {},
      resetCount: 0,
      submitting: false
    };
    _this.delayId = false;
    _this.mounted = false;
    _this.randomId = (0, _randomIds.default)(_this.props.id);
    _this.onReset = _this.reset = _this.onReset.bind((0, _assertThisInitialized2.default)((0, _assertThisInitialized2.default)(_this)));
    _this.onChange = _this.change = _this.onChange.bind((0, _assertThisInitialized2.default)((0, _assertThisInitialized2.default)(_this)));
    _this.onSubmit = _this.submit = _this.onSubmit.bind((0, _assertThisInitialized2.default)((0, _assertThisInitialized2.default)(_this))); // TODO: It shouldn't be here

    var getModel = _this.getModel.bind((0, _assertThisInitialized2.default)((0, _assertThisInitialized2.default)(_this)));

    _this.getModel = function () {
      var mode = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
      var model = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : getModel(mode);
      return mode !== null && _this.props.modelTransform ? _this.props.modelTransform(mode, model) : model;
    };

    return _this;
  }

  (0, _createClass2.default)(BaseForm, [{
    key: "getChildContext",
    value: function getChildContext() {
      return {
        uniforms: {
          name: this.getChildContextName(),
          error: this.getChildContextError(),
          model: this.getChildContextModel(),
          state: this.getChildContextState(),
          schema: this.getChildContextSchema(),
          onChange: this.getChildContextOnChange(),
          randomId: this.randomId
        }
      };
    }
  }, {
    key: "getChildContextName",
    value: function getChildContextName() {
      return [];
    }
  }, {
    key: "getChildContextError",
    value: function getChildContextError() {
      return this.props.error;
    }
  }, {
    key: "getChildContextModel",
    value: function getChildContextModel() {
      return this.getModel('form');
    }
  }, {
    key: "getChildContextState",
    value: function getChildContextState() {
      return {
        changed: !!this.state.changed,
        changedMap: this.state.changedMap,
        submitting: this.state.submitting,
        label: !!this.props.label,
        disabled: !!this.props.disabled,
        placeholder: !!this.props.placeholder,
        showInlineError: !!this.props.showInlineError
      };
    }
  }, {
    key: "getChildContextSchema",
    value: function getChildContextSchema() {
      return this.state.bridge;
    }
  }, {
    key: "getChildContextOnChange",
    value: function getChildContextOnChange() {
      return this.onChange;
    }
  }, {
    key: "getModel",
    value: function getModel()
    /* mode */
    {
      return this.props.model;
    }
  }, {
    key: "componentWillMount",
    value: function componentWillMount() {
      var _this2 = this;

      this.mounted = true;
      this.setState(function () {
        return {};
      }, function () {
        return _this2.setState(function () {
          return {
            changed: false,
            changedMap: {}
          };
        });
      });
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      this.mounted = false;
    }
  }, {
    key: "componentWillReceiveProps",
    value: function componentWillReceiveProps(_ref) {
      var schema = _ref.schema;

      if (this.props.schema !== schema) {
        this.setState(function () {
          return {
            bridge: (0, _createSchemaBridge.default)(schema)
          };
        });
      }
    }
  }, {
    key: "render",
    value: function render() {
      return _react.default.createElement("form", this.getNativeFormProps());
    }
  }, {
    key: "getChangedKeys",
    value: function getChangedKeys(root, valueA, valueB) {
      return (0, _changedKeys.default)(root, valueA, valueB);
    }
  }, {
    key: "getNativeFormProps",
    value: function getNativeFormProps() {
      var props = (0, _omit.default)(this.props, ['autosave', 'autosaveDelay', 'disabled', 'error', 'label', 'model', 'modelTransform', 'onChange', 'onSubmit', 'onSubmitFailure', 'onSubmitSuccess', 'placeholder', 'schema', 'showInlineError']);
      return (0, _objectSpread2.default)({}, props, {
        onSubmit: this.onSubmit,
        key: "reset-".concat(this.state.resetCount)
      });
    }
  }, {
    key: "onChange",
    value: function onChange(key, value) {
      var _this3 = this;

      // Do not set `changed` before componentDidMount
      if (this.state.changed !== null) {
        this.state.changed = true;
        this.getChangedKeys(key, value, (0, _get.default)(this.getModel(), key)).forEach(function (key) {
          return _this3.setState(function (state) {
            return {
              changedMap: (0, _set.default)((0, _cloneDeep.default)(state.changedMap), key, {})
            };
          });
        });
      }

      if (this.props.onChange) {
        this.props.onChange(key, value);
      } // Do not call `onSubmit` before componentDidMount


      if (this.state.changed !== null && this.props.autosave) {
        if (this.delayId) {
          this.delayId = clearTimeout(this.delayId);
        }

        if (this.props.autosaveDelay > 0) {
          this.delayId = setTimeout(this.onSubmit, this.props.autosaveDelay);
        } else {
          this.onSubmit();
        }
      }
    }
  }, {
    key: "__reset",
    value: function __reset(state) {
      return {
        changed: false,
        changedMap: {},
        submitting: false,
        resetCount: state.resetCount + 1
      };
    }
  }, {
    key: "onReset",
    value: function onReset() {
      this.setState(this.__reset);
    }
  }, {
    key: "onSubmit",
    value: function onSubmit(event) {
      var _this4 = this;

      if (event) {
        event.preventDefault();
        event.stopPropagation();
      }

      var result = this.props.onSubmit && this.props.onSubmit(this.getModel('submit')); // Set the `submitting` state only if onSubmit is async so we don't cause an unnecessary re-render

      var submitting;

      if (result && (0, _isFunction.default)(result.then)) {
        this.setState({
          submitting: true
        });
        submitting = result.finally(function () {
          return _this4.setState({
            submitting: false
          });
        });
      } else {
        submitting = Promise.resolve(result);
      }

      return submitting.then(this.props.onSubmitSuccess, this.props.onSubmitFailure);
    }
  }]);
  return BaseForm;
}(_react.Component);

exports.default = BaseForm;
BaseForm.displayName = 'Form';
BaseForm.defaultProps = {
  model: {},
  label: true,
  autosave: false,
  autosaveDelay: 0,
  noValidate: true
};
BaseForm.childContextTypes = {
  uniforms: __childContextTypesBuild(__childContextTypes)
};
BaseForm.propTypes = process.env.NODE_ENV !== "production" ? {
  error: _propTypes.default.object,
  model: _propTypes.default.object,
  schema: _propTypes.default.any.isRequired,
  modelTransform: _propTypes.default.func,
  onChange: _propTypes.default.func,
  onSubmit: _propTypes.default.func,
  onSubmitFailure: _propTypes.default.func,
  onSubmitSuccess: _propTypes.default.func,
  label: _propTypes.default.bool,
  disabled: _propTypes.default.bool,
  placeholder: _propTypes.default.bool,
  showInlineError: _propTypes.default.bool,
  autosave: _propTypes.default.bool,
  autosaveDelay: _propTypes.default.number
} : {};