import React, { Component } from "react";
import { Button } from "semantic-ui-react";
import Hammer from "react-hammerjs";
import { Overlay, Popover } from "react-bootstrap";
import { MDBBtn } from "mdbreact";

const SWIPED_DISTANCE = 100;

/**
 *
 *
 * @export
 * @class SwipeableButton
 * @extends {Component}
 */
export class SwipeableButton extends Component {
  constructor(props) {
    super(props);
    this.state = {
      editing: false,
      deltaX: 0,
      confirmTarget: null,
      confirmDelete: false
    };

    this.onClickDeleteButton = ({ target }) => {
      this.setState(s => ({ confirmTarget: target, confirmDelete: true })); // eslint-disable-line no-unused-vars
    };
  }

  /**
   *
   *
   * @returns
   * @memberof SwipeableButton
   */
  getFirstPositionX() {
    return this.state.editing ? -1 * SWIPED_DISTANCE : 0;
  }

  /**
   *
   *
   * @param {*} e
   * @memberof SwipeableButton
   */
  onPanStart(e) {
    this.setState({
      deltaX: this.getFirstPositionX()
    });
  }

  /**
   *
   *
   * @param {*} e
   * @memberof SwipeableButton
   */
  onPan(e) {
    this.setState({
      deltaX: this.getFirstPositionX() + e.deltaX
    });
  }

  /**
   *
   *
   * @param {*} e
   * @memberof SwipeableButton
   */
  onPanEnd(e) {
    if (this.state.editing) {
      if (e.deltaX >= SWIPED_DISTANCE / 2) {
        this.setState({
          editing: false,
          deltaX: 0
        });
      } else {
        this.setState({
          deltaX: this.getFirstPositionX()
        });
      }
    } else {
      if (e.deltaX <= (-1 * SWIPED_DISTANCE) / 2) {
        this.setState({
          editing: true,
          deltaX: -1 * SWIPED_DISTANCE
        });
      } else {
        this.setState({
          deltaX: 0
        });
      }
    }
  }

  onClick = () => {
    this.props.expand(this.props.index);
  };

  /**
   *
   *
   * @returns
   * @memberof SwipeableButton
   */
  render() {
    let deltaX = this.state.deltaX;
    if (deltaX > 0) {
      deltaX = 0;
    }
    if (deltaX < -1 * SWIPED_DISTANCE) {
      deltaX = -1 * SWIPED_DISTANCE;
    }
    const style = {
      display: "inline-block",
      width: `calc(100% + ${deltaX}px)`
    };

    const style2 = {
      display: "inline-block",
      width: (-1 * deltaX) / 2 + "px"
    };

    let style2a = Object.assign(
      {
        color: "white",
        backgroundColor: "gray",
        whiteSpace: "nowrap",
        width: (-1 * deltaX) / 2 - 0 + "px",
        display: deltaX < -14 ? "inline" : "none",
        borderRadius: "0"
      },
      this.props.style
    );

    let style2b = Object.assign(
      {
        color: "white",
        backgroundColor: "red",
        paddingLeft: 0,
        paddingRight: 0,
        whiteSpace: "nowrap",
        width: (-1 * deltaX) / 2 - 0 + "px",
        display: deltaX < -14 ? "inline" : "none",
        borderBottomLeftRadius: "0",
        borderTopLeftRadius: "0"
      },
      this.props.style
    );

    return (
      <Hammer
        direction={"DIRECTION_HORIZONTAL"}
        onPan={this.onPan.bind(this)}
        onPanStart={this.onPanStart.bind(this)}
        onPanEnd={this.onPanEnd.bind(this)}
      >
        <div style={{ width: "100%" }}>
          <div onClick={this.onClick} style={style}>
            {this.props.children}
          </div>
          <div style={style2}>
            <Button
              onClick={() => this.props.onClickEdit(this.props.index)}
              size={this.props.size}
              style={style2a}
            >
              編集
            </Button>
          </div>
          <div style={style2}>
            <Button
              onClick={this.onClickDeleteButton}
              size={this.props.size}
              style={style2b}
            >
              削除
            </Button>
          </div>

          <Overlay
            show={this.state.confirmDelete}
            target={this.state.confirmTarget}
            placement="left"
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
                  this.props.onClickDelete(this.props.index);
                  this.setState({ confirmDelete: false });
                }}
                className="btnfont"
              >
                削除
              </MDBBtn>
            </Popover>
          </Overlay>
        </div>
      </Hammer>
    );
  }
}
