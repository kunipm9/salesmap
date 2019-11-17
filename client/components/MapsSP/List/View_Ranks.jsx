/// Sys - AutoForm
import React from "react";
import { withTracker } from "meteor/react-meteor-data";
import Edit from "@imports/ui/crud/Edit";
/// Sys - AutoForm --

/// Custom - AutoForm - collection
import { Maps_Ranks_Collection } from "@imports/api/Maps/Ranks_Collection";
console.assert(Maps_Ranks_Collection, "Maps_Ranks_Collection is undefined.");
/// Custom - AutoForm - collection --

import {
  Segment,
  Grid,
  Button,
  Item,
  Input,
  Header,
  Image
} from "semantic-ui-react";

import { MDBModalBody } from "mdbreact";
import { MDBModalW } from "../lib/MDBModalW";

import { MapsSP_List_List_ComponentInfo } from "./List";

/**
 *
 *
 * @export
 * @class _View_Ranks
 * @extends {Edit}
 */
export class _View_Ranks extends Edit {
  "use strict";
  constructor(props) {
    console.log(new Date().getTime(), "View_Ranks constructor");
    super(props);

    /// Custom - Role - check permission
    this.ComponentInfo = MapsSP_List_List_ComponentInfo;
    /// Custom - Role - check permission --

    /// Custom - AutoForm - rebuild field
    this.Collection = Maps_Ranks_Collection;
    this.Form_name = this.Collection._name;
    /// Custom - AutoForm - rebuild field --

    this.state.showEditModal = false;
    this.state.index = 0;
    this.state.inputIndex = -1;
    this.state.rankRank = "";
    this.state.rankColor = "";

    /// Application - AutoForm - initial value
    this.initialValue = {};
    /// Application - AutoForm - initial value --

    /// Custom - AutoForm - single record
    this.singleRecordKey = {};
    /// Custom - AutoForm - single record --

    /// Sys - AutoForm - rebuild field
    this.postConstructor();
    /// Sys - AutoForm - rebuild field --

    this.ranks = [
      { rank: "A", color: "#D63964" },
      { rank: "B", color: "#ED6F37" },
      { rank: "C", color: "#F19C38" },
      { rank: "D", color: "#F6C244" },
      { rank: "E", color: "#FCEA60" },
      { rank: null, color: null },
      { rank: null, color: null },
      { rank: null, color: null },
      { rank: null, color: null },
      { rank: null, color: null },
      { rank: "不明", color: "#9E9E9E" }
    ];

    this.window_innerHeight = window.innerHeight;
  }

  componentDidMount() {
    if (this.props.ranks.ranks.length != this.ranks.length) {
      const doc = this.Collection.findOne(this.singleRecordKey);
      for (let i = 0; i < this.ranks.length; i++) {
        if (!doc.ranks[i]) {
          doc.ranks[i] = this.ranks[i];
        }
        if (!doc.ranks[i].color) {
          doc.ranks[i].color = this.ranks[i].color;
        }
      }
      doc.ranks[10].rank = "不明";
      delete doc.ranks[11];

      this.submit(doc, () => {});
    }
  }

  /**
   *
   *
   * @memberof _View_Ranks
   */
  onChangeRankRank = event => {
    this.setState({ rankRank: event.target.value });
  };

  /**
   *
   *
   * @memberof _View_Ranks
   */
  onClickRankColor = color => {
    this.setState({ rankColor: color });
  };

  /**
   *
   *
   * @memberof Edit_Kind
   */
  onClickRankSet = () => {
    const doc = this.Collection.findOne(this.singleRecordKey);
    if (this.state.rankRank) {
      doc.ranks[this.state.index] = {
        rank: this.state.rankRank,
        color: this.state.rankColor
      };
    } else {
      doc.ranks[this.state.index] = {
        rank: null,
        color: null
      };
    }

    for (let i = 0; i < this.ranks.length; i++) {
      if (!doc.ranks[i]) {
        doc.ranks[i] = this.ranks[i];
      }
      if (!doc.ranks[i].color) {
        doc.ranks[i].color = this.ranks[i].color;
      }
    }
    this.submit(doc, () => {
      this.setState({ showEditModal: false });
    });

    this.setState({ inputIndex: -1 });
  };

  /**
   *
   *
   * @memberof Edit_Kind
   */
  onClickAdd = () => {
    const doc = this.Collection.findOne(this.singleRecordKey);
    for (let i = 0; i < this.ranks.length; i++) {
      if (!doc.ranks[i].rank) {
        this.setState({ inputIndex: i });
        break;
      }
    }
  };

  /* global index */
  /* global index1 */
  /* global rank */
  /* global color */

  /**
   *
   *
   * @returns
   * @memberof _View_Ranks
   */
  render() {
    console.log(new Date().getTime(), "View_Ranks render");

    /// Custom - Collection - subscribe
    if (this.props.loading) {
      console.log(new Date().getTime(), "View_Ranks render loading...");
      return <span />;
    }
    /// Custom - Collection - subscribe --

    const colors = [
      "#E24141",
      "#ED6F37",
      "#F19C38",
      "#F6C244",
      "#FCEA60",
      "#D0DA59",
      "#97C05C",
      "#5EAC5B",
      "#419388",
      "#53BAD1",
      "#4AA8EE",
      "#477AEC",
      "#4242AF",
      "#6341B0",
      "#9437AA",
      "#D63964",
      "#74564A",
      "#9E9E9E",
      "#667C89",
      "#494F53"
    ];
    console.log("rrrrrrrrrrrrrrrrrrrrrrr", this.props.ranks.ranks);
    return (
      <React.Fragment>
        {/* Link start */}
        <Segment className="header-line" />
        <Segment className="link-area5">
          <Grid centered className="center aligned content">
            <Grid.Row className="header-row">
              <Grid.Column width={2}>
                <Button onClick={this.props.close} className="close-area">
                  <Image src="/smsk-front/×.svg" />
                </Button>
              </Grid.Column>
              <Grid.Column width={14} className="center aligned content header">
                <Header as="h2" className="font-color font-family header-font">
                  ランク
                </Header>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Segment>
        {/* Link end */}

        {/* 新規追加 start */}
        <Segment
          basic
          style={{
            height: "67px",
            margin: "0px",
            padding: "20px 14px",
            borderBottom: "solid 1px #e8e8e8"
          }}
        >
          <Button
            onClick={this.onClickAdd}
            className="font-family middle aligned"
            style={{
              backgroundColor: "transparent",
              padding: "0px",
              width: "100%",
              height: "26px"
            }}
          >
            <Image
              src={window.$GLOBAL$.__SVG__["新規追加"]}
              style={{
                width: "25px",
                float: "left",
                marginRight: "10px"
              }}
            />
            <p
              style={{
                color: "#3C3C3C",
                float: "left",
                fontSize: "17px",
                fontWeight: "normal",
                marginRight: "5px"
              }}
            >
              新規追加
            </p>
            <p
              style={{
                color: "#3C3C3C",
                float: "left",
                fontSize: "13px",
                fontWeight: "normal",
                marginTop: "4px"
              }}
            >
              ({(this.props.ranks.ranks || []).filter(r => r && r.rank).length}
              /11件)
            </p>
          </Button>
        </Segment>
        {/* 新規追加 end */}

        {/* スクロールエリア start */}
        <Segment
          className="scroll-area"
          style={{ height: this.window_innerHeight - 42 + "px" }}
        >
          <Segment padded className="pin-area">
            <Item.Group
              divided
              style={{
                height: this.window_innerHeight - 42 + "px",
                marginBottom: "14px"
              }}
            >
              {
                <For each="rank" index="index" of={this.props.ranks.ranks}>
                  {/* カテゴリ start */}
                  {
                    <If
                      condition={
                        (rank && rank.rank) || index == this.state.inputIndex
                      }
                    >
                      <Item key={index} className="rank-item1">
                        <Button
                          onClick={() => {
                            if (index < 10) {
                              this.setState({
                                showEditModal: true,
                                index: index,
                                rankRank: rank.rank,
                                rankColor: rank.color
                              });
                            }
                          }}
                          className="rank-item1-btn"
                          style={{
                            height: "38px",
                            borderLeft: `solid 13px ${rank.color}`
                          }}
                        >
                          {rank.rank || "未設定"}
                        </Button>
                      </Item>
                    </If>
                  }
                  {/* カテゴリ end */}
                </For>
              }
            </Item.Group>
          </Segment>
        </Segment>
        {/* スクロールエリア end */}

        <MDBModalW
          size="mini"
          isOpen={this.state.showEditModal}
          toggle={() => {
            this.setState({ showEditModal: false });
          }}
          className="pinmodal-style2"
          id="modal-white"
        >
          <MDBModalBody className="modal-close">
            <Image
              onClick={() => this.setState({ showEditModal: false })}
              src="/smsk-front/×.svg"
              style={{ float: "right" }}
            />
          </MDBModalBody>
          <MDBModalBody id="pinmodal-padding">
            <p className="font-family pinmodal-label">表示名</p>
            <Input
              onChange={this.onChangeRankRank}
              value={this.state.rankRank}
              transparent
              placeholder="A"
              size="big"
              className="pinmodal-input"
            />
            <p className="font-family pinmodal-label">カラー</p>
            {
              <For each="color" index="index1" of={colors}>
                <Button
                  key={index1}
                  onClick={() => this.onClickRankColor(color)}
                  className={
                    color == this.state.rankColor
                      ? "pinmodal-color-selected"
                      : "pinmodal-color"
                  }
                  style={{
                    backgroundColor: color,
                    marginBottom: "3px"
                  }}
                ></Button>
              </For>
            }

            <Button
              className="font-family pinmodal-btn"
              onClick={this.onClickRankSet}
            >
              決定
            </Button>
          </MDBModalBody>
        </MDBModalW>

        {/* モーダル end */}
      </React.Fragment>
    );
  }
}

/// Custom - View - tracker
export const View_Ranks = withTracker(() => {
  /// Custom - Collection - subscribe
  const handles = [
    //    Meteor.subscribe(
    //      Maps_Ranks_Collection._name,
    //      Session.get("Users_Groups_id")
    //    )
  ];
  const loading = handles.some(handle => !handle.ready());
  console.log(new Date().getTime(), "View_Ranks loading", loading);

  const ranks = Maps_Ranks_Collection.findOne({ _deleted: null }) || {
    ranks: []
  };

  return {
    ComponentInfo: MapsSP_List_List_ComponentInfo,
    ranks: ranks,
    loading: loading
  };
  /// Custom - Collection - subscribe --
})(_View_Ranks);
/// Custom - View - tracker --
