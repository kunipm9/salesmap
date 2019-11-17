"use strict";

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

var _propTypes = _interopRequireDefault(require("prop-types"));

var _react = _interopRequireDefault(require("react"));

var _omit = _interopRequireDefault(require("lodash/omit"));

var _BaseForm = _interopRequireDefault(require("./BaseForm"));

var _nothing = _interopRequireDefault(require("./nothing"));

var Quick = function Quick(parent) {
  var _class, _temp;

  return _temp = _class =
  /*#__PURE__*/
  function (_parent) {
    (0, _inherits2.default)(_class, _parent);

    function _class() {
      (0, _classCallCheck2.default)(this, _class);
      return (0, _possibleConstructorReturn2.default)(this, (0, _getPrototypeOf2.default)(_class).apply(this, arguments));
    }

    (0, _createClass2.default)(_class, [{
      key: "getNativeFormProps",
      value: function getNativeFormProps() {
        return (0, _omit.default)((0, _get2.default)((0, _getPrototypeOf2.default)(_class.prototype), "getNativeFormProps", this).call(this), ['autoField', 'errorsField', 'submitField']);
      }
    }, {
      key: "render",
      value: function render() {
        var nativeFormProps = this.getNativeFormProps();

        if (nativeFormProps.children) {
          return (0, _get2.default)((0, _getPrototypeOf2.default)(_class.prototype), "render", this).call(this);
        }

        var AutoField = this.props.autoField || this.getAutoField();
        var ErrorsField = this.props.errorsField || this.getErrorsField();
        var SubmitField = this.props.submitField || this.getSubmitField();
        return _react.default.createElement("form", nativeFormProps, this.getChildContextSchema().getSubfields().map(function (key) {
          return _react.default.createElement(AutoField, {
            key: key,
            name: key
          });
        }), _react.default.createElement(ErrorsField, null), _react.default.createElement(SubmitField, null));
      }
    }, {
      key: "getAutoField",
      value: function getAutoField() {
        return function () {
          return _nothing.default;
        };
      }
    }, {
      key: "getErrorsField",
      value: function getErrorsField() {
        return function () {
          return _nothing.default;
        };
      }
    }, {
      key: "getSubmitField",
      value: function getSubmitField() {
        return function () {
          return _nothing.default;
        };
      }
    }]);
    return _class;
  }(parent), _class.Quick = Quick, _class.displayName = "Quick".concat(parent.displayName), _class.propTypes = (0, _objectSpread2.default)({}, parent.propTypes, {
    autoField: _propTypes.default.oneOfType([_propTypes.default.func, _propTypes.default.string]),
    errorsField: _propTypes.default.oneOfType([_propTypes.default.func, _propTypes.default.string]),
    submitField: _propTypes.default.oneOfType([_propTypes.default.func, _propTypes.default.string])
  }), _temp;
};

var _default = Quick(_BaseForm.default);

exports.default = _default;