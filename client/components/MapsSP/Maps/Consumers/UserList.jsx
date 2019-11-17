import React from "react";
import _ from "lodash";

/// Application
import { Maps_Consumers_View_Edit } from "./Edit";
import { Maps_Consumers_View_Add } from "./Add";
/// Application --

import { Segment, Button } from "semantic-ui-react";
import { MDBModalBody } from "mdbreact";

/// Custom - AutoForm - collection
import { Maps_Ranks_Collection } from "@imports/api/Maps/Ranks_Collection";
console.assert(Maps_Ranks_Collection, "Maps_Ranks_Collection is undefined.");
/// Custom - AutoForm - collection --

export class Maps_Consumers_View_UserList extends React.Component {
  "use strict";

  constructor(props) {
    console.log(new Date().getTime(), "ConsumersLocalCollection constructor");
    super(props);

    if (this.props.docIds.length) {
      this.state = {
        docIds: Object.assign([], this.props.docIds),
        selectedId: this.props.docIds[0],
        showEdit: true,
        showAdd: false,
        room: null
      };
    } else {
      if ((_.get(this.props, "clickedPoint.rooms") || []).length == 1) {
        this.state = {
          docIds: [],
          selectedId: "",
          showEdit: false,
          showAdd: true,
          room: _.get(this.props, "clickedPoint.rooms")[0]
        };
      } else {
        this.state = {
          docIds: [],
          selectedId: "",
          showEdit: false,
          showAdd: true,
          room: null
        };
      }
    }

    this.ranks = [];
    const rankRec = Maps_Ranks_Collection.findOne();
    if (rankRec && rankRec.ranks) {
      this.ranks = rankRec.ranks;
    }

    this.window_innerHeight = window.innerHeight;
  }

  /**
   *
   *
   * @param {*} rank
   * @returns
   * @memberof SelectorRanks
   */
  getTabColor = rank => {
    const r = this.ranks[rank] || {};
    if (!r) {
      return "white";
    }
    return r.color;
  };

  /**
   *
   *
   * @memberof Maps_Consumers_View_Edit
   */
  onClickShowEdit = _id => {
    this.setState({
      showAdd: false,
      showEdit: true,
      selectedId: _id,
      room: null
    });
  };

  /**
   *
   *
   * @memberof Maps_Consumers_View_Edit
   */
  onClickShowAdd = () => {
    this.setState({
      showAdd: true,
      showEdit: false,
      selectedId: "",
      room: null
    });
  };

  /**
   *
   *
   * @memberof Maps_Consumers_View_Edit
   */
  addDocIds = id => {
    this.state.docIds.push(id);
    this.setState({ docIds: this.state.docIds });
  };

  /**
   *
   *
   * @memberof Maps_Consumers_View_Edit
   */
  modifyDocIds = id => {
    /*** 何のための処理 ????????????????????????????????? */
    //TODO *** 何のための処理 ?????????????????????????????????

    this.setState({ docIds: this.state.docIds });
  };

  /**
   *
   *
   * @memberof Maps_Consumers_View_Edit
   */
  addRoom = room => {
    this.setState({
      showAdd: true,
      showEdit: false,
      selectedId: "",
      room: room
    });
  };

  /**
   *
   *
   * @memberof Maps_Consumers_View_Edit
   */
  showRoomListModal = () => {
    this.props.showRoomListModal(this.addRoom);
  };

  /**
   *
   *
   * @memberof Maps_Consumers_View_Edit
   */
  closeRoomListModal = () => {
    this.props.closeRoomListModal();
  };

  /**
   *
   *
   * @memberof Maps_Consumers_View_Edit
   */
  showTagListModal = (addTagFunc, doc) => {
    this.props.showTagListModal(addTagFunc, doc);
  };

  /* global _id */

  /**
   *
   *
   * @returns
   * @memberof Maps_Consumers_View_Edit
   */
  render() {
    return (
      <React.Fragment>
        <MDBModalBody
          className="m-0 p-0"
          style={{
            padding: 0,
            margin: 0,
            backgroundColor: "transparent",
            border: "none"
          }}
        >
          <div
            style={{
              padding: 0,
              margin: 0,
              backgroundColor: "transparent",
              border: "none"
            }}
          >
            <div style={{ display: "flow-root" }}>
              {
                <For each="_id" index="index" of={this.state.docIds}>
                  <Button
                    onClick={() => this.onClickShowEdit(_id)}
                    key={_id}
                    className={"tag-item-btn font-family"}
                    id="map6-tab"
                    style={{
                      padding: "8px 0",
                      backgroundColor:
                        this.state.selectedId == _id ? "#ffffff" : "#bbbbbb",
                      borderTop:
                        "solid 6px " +
                        this.getTabColor(this.props.docs[_id].rank),
                      float: "left",
                      height: "36px"
                    }}
                  >
                    {_.get(this.props.docs[_id], "identity.name")}
                  </Button>
                </For>
              }
              <Button
                onClick={() => this.onClickShowAdd()}
                id="map6-tab"
                style={{
                  width: "40px",
                  height: "36px",
                  color: "#ffffff",
                  padding: "8px 0",
                  backgroundColor: "#5bb0ed",
                  borderRadius: "0"
                }}
              >
                +
              </Button>
            </div>
          </div>

          {/* スクロールエリア start */}
          <Segment
            className="scroll-area map-userlist"
            style={{ maxHeight: this.window_innerHeight - 62 + "px" }}
          >
            {
              <If condition={this.state.showEdit}>
                <Maps_Consumers_View_Edit
                  clickedPoint={this.props.clickedPoint}
                  doc={this.props.docs[this.state.selectedId]}
                  addDocIds={this.addDocIds}
                  modifyDocIds={this.modifyDocIds}
                  addRoom={this.addRoom}
                  showRoomListModal={this.showRoomListModal}
                  closeRoomListModal={this.closeRoomListModal}
                  showTagListModal={this.showTagListModal}
                />
              </If>
            }
            {
              <If condition={this.state.showAdd}>
                <Maps_Consumers_View_Add
                  clickedPoint={this.props.clickedPoint}
                  addDocIds={this.addDocIds}
                  addRoom={this.addRoom}
                  room={this.state.room}
                  showRoomListModal={this.showRoomListModal}
                  closeRoomListModal={this.closeRoomListModal}
                  showTagListModal={this.showTagListModal}
                />
              </If>
            }
          </Segment>
        </MDBModalBody>
      </React.Fragment>
    );
  }
}
