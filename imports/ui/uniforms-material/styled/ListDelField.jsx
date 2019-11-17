import IconButton from "@material-ui/core/IconButton";
import React from "react";
import { Component } from "react";
import connectField from "uniforms/connectField";
import filterDOMProps from "uniforms/filterDOMProps";
import { Overlay, Popover } from "react-bootstrap";
import { MDBBtn } from "mdbreact";

/**
 *
 *
 * @class ListDel
 * @extends {Component}
 */
class ListDel extends Component {
  /**
   *Creates an instance of ListDel.
   * @memberof ListDel
   */
  constructor() {
    super();
    this.state = {
      confirmTarget: null,
      confirmDelete: false
    };

    this.onClickDeleteButton = ({ target }) => {
      this.setState(s => ({ confirmTarget: target, confirmDelete: true })); // eslint-disable-line no-unused-vars
    };

    this.remove = () => {
      const name = this.props.name;
      const disabled = this.props.disabled;
      const parent = this.props.parent;
      const fieldIndex = +name.slice(1 + name.lastIndexOf("."));
      const limitNotReached =
        !disabled && !(parent.minCount >= parent.value.length);

      limitNotReached &&
        parent.onChange(
          []
            .concat(parent.value.slice(0, fieldIndex))
            .concat(parent.value.slice(1 + fieldIndex))
        );

      this.setState({ confirmDelete: false });
    };
  }

  /**
   *
   *
   * @returns
   * @memberof ListDel
   */
  render() {
    const limitNotReached =
      !this.props.disabled &&
      !(this.props.parent.minCount >= this.props.parent.value.length);

    return (
      <React.Fragment>
        <IconButton
          className="mui-ListDelField-IconButton-custom"
          disabled={!limitNotReached}
          onClick={this.onClickDeleteButton}
          {...filterDOMProps(this.props)}
        >
          {this.props.icon || "-"}
        </IconButton>

        <Overlay
          show={this.state.confirmDelete}
          target={this.state.confirmTarget}
          placement="right"
          container={this}
          containerPadding={0}
        >
          <Popover id="top" title="削除しますか?">
            <MDBBtn
              color="info"
              onClick={() => {
                this.setState({ confirmDelete: false });
              }}
              className="btnfont"
            >
              取消
            </MDBBtn>
            <MDBBtn
              color="danger"
              onClick={() => {
                this.remove();
              }}
              className="btnfont"
            >
              削除
            </MDBBtn>
          </Popover>
        </Overlay>
      </React.Fragment>
    );
  }
}

//ListDel.defaultProps = {removeIcon: <i className="fa fa-minus fa-25x" />};

export default connectField(ListDel, {
  includeParent: true,
  initialValue: false
});
