"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = injectName;

var _react = _interopRequireWildcard(require("react"));

var _joinName = _interopRequireDefault(require("./joinName"));

function injectName(name, children, parent) {
  return _react.Children.map(children, function (child) {
    return child && typeof child !== 'string' && (!parent || !parent.props || !parent.props.name) ? !child.props ? _react.default.cloneElement(child, {
      name: name
    }) : _react.default.cloneElement(child, {
      name: (0, _joinName.default)(name, child.props.name),
      children: injectName(name, child.props.children, child)
    }) : child;
  });
}