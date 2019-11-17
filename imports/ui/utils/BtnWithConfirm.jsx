import React from "react";
import { Overlay, Popover } from "react-bootstrap";
import { MDBBtn } from "mdbreact";

/**
 *
 *
 * @export
 * @class BtnWithConfirm
 * @extends {React.Component}
 */
export class BtnWithConfirm extends React.Component {
  /**
   *Creates an instance of BtnWithConfirm.
   * @param {*} props
   * @memberof BtnWithConfirm
   */
  constructor(props) {
    super(props);
    this.state = {
      confirmTarget: null,
      confirmDo: false
    };
    this.onClick = ({ target }) => {
      this.setState({ confirmTarget: target, confirmDo: true });
    };
  }

  /**
   *
   *
   * @returns
   * @memberof BtnWithConfirm
   */
  render() {
    return (
      <span>
        <Overlay
          show={this.state.confirmDo}
          target={this.state.confirmTarget}
          placement={this.props.placement}
          container={this}
          containerPadding={0}
        >
          <Popover id="top" title={this.props.title}>
            <MDBBtn
              color="info"
              onClick={() => {
                this.setState({ confirmDo: false });
              }}
              className={this.props.className}
            >
              取消
            </MDBBtn>
            <MDBBtn
              color="danger"
              onClick={() => {
                this.setState({ confirmDo: false });
                this.props.onClick(...this.props.onClickArgs);
              }}
              className={this.props.className}
            >
              {this.props.label}
            </MDBBtn>
          </Popover>
        </Overlay>

        <MDBBtn
          color={this.props.color}
          size={this.props.size}
          className={this.props.className}
          disabled={this.props.disabled}
          onClick={this.onClick}
        >
          {this.props.label}
        </MDBBtn>
      </span>
    );
  }
}
