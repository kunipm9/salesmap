import React from "react";
import ReactDOM from "react-dom";
import { Blaze } from "meteor/blaze";
import { Template } from "meteor/templating";

/**
 *
 *
 * @param {*} value
 * @returns
 */
let _parseBlazeArg = function(value) {
  try {
    return JSON.parse(
      value
        .replace(/'/g, '"')
        .replace(/(['"])?([a-zA-Z0-9_]+)(['"])?:/g, '"$2": ')
    );
  } catch (err) {
    return value;
  }
};

/**
 *
 *
 * @param {*} args
 * @returns
 */
let _parseBlazeArgs = function(args) {
  const result = {};
  for (let key of Object.keys(args)) {
    result[key] = _parseBlazeArg(args[key]);
  }
  return result;
};

/**
 *
 *
 * @export
 * @class TabularWrapper
 * @extends {React.Component}
 */
export class TabularWrapper extends React.Component {
  /**
   *Creates an instance of TabularWrapper.
   * @param {*} props
   * @memberof TabularWrapper
   */
  constructor(props) {
    super(props);

    this.changeSelector = this.changeSelector.bind(this);
  }

  /**
   *
   *
   * @memberof TabularWrapper
   */
  componentDidMount() {
    this.data = _parseBlazeArgs(this.props);
    this.data.table = TabularTables[this.props.table];
    this.view = Blaze.renderWithData(
      Template.tabular,
      this.data,
      // eslint-disable-next-line react/no-find-dom-node, react/no-string-refs
      ReactDOM.findDOMNode(this.refs.container)
    );
  }

  /**
   *
   *
   * @memberof TabularWrapper
   */
  componentWillUnmount() {
    Blaze.remove(this.view);
  }

  /**
   *
   *
   * @param {*} selector
   * @memberof TabularWrapper
   */
  changeSelector(selector) {
    this.data.selector = selector;

    Blaze.remove(this.view);

    setTimeout(() => {
      this.view = Blaze.renderWithData(
        Template.tabular,
        this.data,
        // eslint-disable-next-line react/no-find-dom-node, react/no-string-refs
        ReactDOM.findDOMNode(this.refs.container)
      );
    }, 50);
  }

  /**
   *
   *
   * @returns
   * @memberof TabularWrapper
   */
  render() {
    /* eslint-disable react/no-string-refs */
    return <span ref="container" />;
    /* eslint-enaable react/no-string-refs */
  }
}
