"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

// React < 15 workaround
// https://github.com/vazco/uniforms/issues/42
// https://github.com/facebook/react/issues/5355
var _default = parseInt(_react.default.version, 10) < 15 ? _react.default.createElement("noscript", null) : null;

exports.default = _default;