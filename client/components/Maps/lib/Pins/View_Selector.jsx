import React from "react";

import { SelectorTags } from "./SelectorTags";

/**
 *
 *
 * @export
 * @class View_Selector
 * @extends {React.Component}
 */
export class View_Selector extends React.Component {
  "use strict";

  /**
   *Creates an instance of View_Selector.
   * @param {*} props
   * @memberof View_Selector
   */
  constructor(props) {
    super(props);

    this.state = {};

    /// Custom - Tabular - condition
    /// Custom - Tabular - condition --
  }

  /**
   *
   *
   * @memberof View_Selector
   */
  componentDidMount() { }

  /**
   *
   *
   * @returns
   * @memberof View_Selector
   */
  render() {
    /// Custom - Tabular - layout
    return (
      <React.Fragment>
        <SelectorTags
          updateSelector={this.props.updateSelector}
          value={this.props.value}
        />
      </React.Fragment>
    );
    /// Custom - Tabular - layout --
  }
}
