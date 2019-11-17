import React from "react";

import { Range } from "rc-slider";
import "rc-slider/assets/index.css";
import "rc-tooltip/assets/bootstrap.css";

import { Maps_Tags_Collection } from "@imports/api/Maps/Tags_Collection";

/// Custom - Layout
/// Custom - Layout --

// import start
import { Segment } from "semantic-ui-react";
import { Grid } from "semantic-ui-react";

import { Header } from "semantic-ui-react";

import { Button } from "semantic-ui-react";
import { Input } from "semantic-ui-react";

import { MDBModalBody } from "mdbreact";
import { MDBModalW } from "../lib/MDBModalW";

import { SelectorTags } from "./SelectorTags";
import { SelectorRanks } from "./SelectorRanks";

import { Image } from "semantic-ui-react";
import { Item } from "semantic-ui-react";

import { getTagName } from "../lib/Tags/utils";
import { getRankTitle } from "./utils";

/*
 *
 *
 * @export
 * @class List_Selector
 * @extends {React.Component}
 */
export class List_Selector extends React.Component {
  "use strict";

  /**
   *Creates an instance of List_Selector.
   * @param {*} props
   * @memberof List_Selector
   */
  constructor(props) {
    super(props);

    this.state = {
      keyword: "",
      createdAtKind: "",
      createdAtFrom: "",
      createdAtTo: "",
      transportationKind: "",
      transportationFrom: "",
      transportationTo: "",
      ranks: [],
      visits: [],
      tags: {
        or: [],
        not: [],
        and: []
      },

      showSelectorRanks: false,
      showSelectorTags: false
    };

    this.window_innerHeight = window.innerHeight;
  }

  /**
   *
   *
   * @memberof List_Selector
   */
  toggleRanks = () => {
    this.setState({ showSelectorRanks: !this.state.showSelectorRanks });
  };

  /**
   *
   *
   * @memberof List_Selector
   */
  toggleTags = () => {
    this.setState({ showSelectorTags: !this.state.showSelectorTags });
  };

  /**
   *
   *
   * @memberof List_Selector
   */
  componentDidMount() {
    this.setState({
      keyword: this.props.value.keyword,
      createdAtKind: this.props.value.createdAtKind,
      createdAtFrom: this.props.value.createdAtFrom,
      createdAtTo: this.props.value.createdAtTo,
      transportationKind: this.props.value.transportationKind,
      transportationFrom: this.props.value.transportationFrom,
      transportationTo: this.props.value.transportationTo,
      ranks: this.props.value.ranks || [],
      visits: this.props.value.visits || [],
      tags: this.props.value.tags || { or: [], not: [], and: [] }
    });

    this.tagCat1List = {};
    Maps_Tags_Collection.find({ _deleted: null }).map(cat1 => {
      this.tagCat1List[cat1._id] = cat1.cat2;
    });
  }

  /**
   *
   *
   * @memberof List_Selector
   */
  tags2title = tags => {
    const titles = [];
    for (let i in tags) {
      const tag = tags[i];
      const tagName = getTagName(tag[0], tag[1], tag[2], tag[3]);
      if (tagName) {
        titles.push(tagName.join(""));
      }
    }
    return titles;
  };

  /**
   *
   *
   * @memberof List_Selector
   */
  clear = () => {
    this.setState({
      keyword: "",
      createdAtKind: "",
      createdAtFrom: "",
      createdAtTo: "",
      transportationAtKind: "",
      transportationAtFrom: "",
      transportationAtTo: "",
      ranks: [],
      visits: [],
      tags: {
        or: [],
        not: [],
        and: []
      }
    });
  };

  /**
   *
   *
   * @param {*} event
   * @memberof List_Selector
   */
  onChangeKeyword = event => {
    this.setState({ keyword: event.target.value });
  };

  /**
   *
   *
   * @param {*} event
   * @memberof List_Selector
   */
  onChangeCreatedAtFrom = event => {
    this.setState({ createdFrom: event.target.value });
  };

  /**
   *
   *
   * @param {*} event
   * @memberof List_Selector
   */
  onChangeCreatedAtTo = event => {
    this.setState({ createdTo: event.target.value });
  };

  /**
   *
   *
   * @memberof List_Selector
   */
  closeSelectorRanks = (ranks, visits) => {
    this.setState({
      showSelectorRanks: false,
      ranks: ranks,
      visits: visits
    });
  };

  /**
   *
   *
   * @memberof List_Selector
   */
  closeSelectorTags = tags => {
    this.setState({
      showSelectorTags: false,
      tags: tags
    });
  };

  /**
   *
   */
  getCreatedAtKindColor = (_id, background) => {
    if (background) {
      if (this.state.createdAtKind == _id) {
        return "#3a7cac";
      } else {
        return "white";
      }
    } else {
      if (this.state.createdAtKind == _id) {
        return "white";
      } else {
        return "#dbdbdb";
      }
    }
  };

  /**
   *
   */
  onClickCreatedAtKind = _id => {
    if (this.state.createdAtKind == _id) {
      this.setState({ createdAtKind: "" });
    } else {
      this.setState({ createdAtKind: _id });
    }
  };

  /**
   *
   */
  getTransportationKindColor = (_id, background) => {
    if (background) {
      if (this.state.transportationKind == _id) {
        return "#3a7cac";
      } else {
        return "white";
      }
    } else {
      if (this.state.transportationKind == _id) {
        return "white";
      } else {
        return "#dbdbdb";
      }
    }
  };

  /**
   *
   */
  onClickTransportationKind = _id => {
    if (this.state.transportationKind == _id) {
      this.setState({ transportationKind: "" });
    } else {
      this.setState({ transportationKind: _id });
    }
  };

  /**
   *
   *
   * @memberof List_Selector
   */
  searchAndClose = () => {
    // this.props.updateSelector("keyword", this.state.keyword);
    this.props.updateSelectors({
      keyword: this.state.keyword,
      createdFrom: this.state.createdFrom,
      createdTo: this.state.createdTo,
      ranks: this.state.ranks,
      tags: this.state.tags
    });

    const selectorString = [];
    if (this.state.keyword) {
      selectorString.push(this.state.keyword);
    }
    if (this.state.ranks.length) {
      selectorString.push(
        this.state.ranks.map(r => getRankTitle(r)).join(", ")
      );
    }
    if (this.state.tags.or.length) {
      selectorString.push(this.tags2title(this.state.tags.or).join(", "));
    }
    this.props.updateSelectorString(selectorString.join(" / "));

    this.props.closeListSelector();
  };

  /**
   *
   *
   * @returns
   * @memberof List_Selector
   */
  render() {
    /// Custom - Tabular - layout
    return (
      <React.Fragment>
        {/* Link start */}
        <Segment className="header-line" />

        <Segment className="link-area">
          <Grid centered className="center aligned content">
            <Grid.Row>
              <Grid.Column width={4}>
                <Button
                  onClick={this.props.closeListSelector}
                  className="button-return font-color"
                >
                  <Image src={window.$GLOBAL$.__SVG__["戻る"]} />
                </Button>
              </Grid.Column>
              <Grid.Column width={10} className="center aligned content header">
                <Header as="h2" className="font-color font-family header-font">
                  詳細検索
                </Header>
              </Grid.Column>
              <Grid.Column width={2}></Grid.Column>
            </Grid.Row>
          </Grid>
        </Segment>
        {/* Link end */}

        {/* スクロールエリア start */}
        <Segment
          className="scroll-area"
          style={{
            marginTop: 0 + "px",
            height: this.window_innerHeight - 195 + "px"
          }}
        >
          <Segment
            padded
            style={{
              padding: "14px 0px 14px 14px",
              border: "none",
              borderRadius: "0",
              width: "calc(100vw - 14px)"
            }}
          >
            <Item.Group divided className="font-family">
              <Item
                style={{
                  height: "64px",
                  marginBottom: "14px",
                  padding: "0px",
                  width: "calc(100vw - 28px)"
                }}
              >
                <Item.Meta className="font-color list-selector-meta">
                  キーワード
                </Item.Meta>
                <div>
                  <Input
                    onChange={this.onChangeKeyword}
                    value={this.state.keyword}
                    color="white"
                    placeholder="名前、住所、キーワード"
                    className="font-color font-family form-height"
                    style={{
                      marginRight: "14px",
                      height: "37px",
                      width: "calc(100vw - 28px)"
                    }}
                  />
                  <Image
                    onClick={() => {
                      this.setState({ keyword: "" });
                    }}
                    src={window.$GLOBAL$.__SVG__["×ボタン（タグで絞り込む1）"]}
                    style={{ left: "calc(100vw - 55px)", bottom: "28px" }}
                  />
                </div>
              </Item>

              <Item>
                <Grid>
                  <Grid.Row
                    onClick={() => {
                      this.setState({ showSelectorRanks: true });
                    }}
                    style={{ padding: "10px 0px" }}
                  >
                    <Grid.Column width={4} style={{ marginRight: "0px" }}>
                      <Item.Meta className="font-color">ランク</Item.Meta>
                    </Grid.Column>
                    <Grid.Column width={12} style={{ display: "flex" }}>
                      <p
                        style={{
                          margin: "0px",
                          width: "100%",
                          textAlign: "right",
                          height: "20px",
                          color: this.state.ranks.length
                            ? "#333333"
                            : "#d0d0d0",
                          lineHeight: "28px",
                          marginRight: "10px",
                          textOverflow: "ellipsis",
                          overflow: "hidden",
                          whiteSpace: "nowrap"
                        }}
                      >
                        {this.state.ranks
                          .map(r => getRankTitle(r))
                          .join(", ") || "指定しない"}
                      </p>
                      <Image
                        src={window.$GLOBAL$.__SVG__["＞（プロフ用小）"]}
                        style={{ marginRight: "12px" }}
                      />
                    </Grid.Column>
                  </Grid.Row>
                </Grid>
              </Item>

              <Item>
                <Grid>
                  <Grid.Row
                    onClick={() => {
                      this.setState({ showSelectorTags: true });
                    }}
                    style={{ padding: "10px 0px" }}
                  >
                    <Grid.Column width={4} style={{ marginRight: "0px" }}>
                      <Item.Meta className="font-color">タグ</Item.Meta>
                    </Grid.Column>
                    <Grid.Column width={12} style={{ display: "flex" }}>
                      <p
                        style={{
                          margin: "0px",
                          width: "100%",
                          textAlign: "right",
                          height: "20px",
                          color: this.state.tags.or.length
                            ? "#333333"
                            : "#d0d0d0",
                          lineHeight: "28px",
                          marginRight: "10px",
                          textOverflow: "ellipsis",
                          overflow: "hidden",
                          whiteSpace: "nowrap"
                        }}
                      >
                        {this.tags2title(this.state.tags.or).join(", ") ||
                          "指定しない"}
                      </p>
                      <Image
                        src={window.$GLOBAL$.__SVG__["＞（プロフ用小）"]}
                        style={{ marginRight: "12px" }}
                      />
                    </Grid.Column>
                  </Grid.Row>
                </Grid>
              </Item>

              <Item className="haribote disabled">
                <Item.Meta className="font-color list-selector-meta">
                  期間を選択
                </Item.Meta>
                <Button.Group
                  style={{ paddingRight: "14px", marginBottom: "10px" }}
                >
                  <Button
                    onClick={() => this.onClickCreatedAtKind("今日")}
                    className={`font-family meibo-search-btn2 ${
                      this.state.createdAtKind == "今日" ? "active" : ""
                    }`}
                    style={{ marginRight: "5px" }}
                  >
                    今日
                  </Button>
                  <Button
                    onClick={() => this.onClickCreatedAtKind("今週")}
                    className={`font-family meibo-search-btn2 ${
                      this.state.createdAtKind == "今週" ? "active" : ""
                    }`}
                    style={{ marginRight: "5px" }}
                  >
                    今週
                  </Button>
                  <Button
                    onClick={() => this.onClickCreatedAtKind("先週")}
                    className={`font-family meibo-search-btn2 ${
                      this.state.createdAtKind == "先週" ? "active" : ""
                    }`}
                    style={{ marginRight: "5px" }}
                  >
                    先週
                  </Button>
                  <Button
                    onClick={() => this.onClickCreatedAtKind("今月")}
                    className={`font-family meibo-search-btn2 ${
                      this.state.createdAtKind == "今月" ? "active" : ""
                    }`}
                    style={{ marginRight: "0px" }}
                  >
                    今月
                  </Button>
                </Button.Group>

                <Input
                  onClick={this.onChangeCreatedAt}
                  value={this.state.createdFrom}
                  icon="calendar-icon detail-search-icon-size"
                  iconPosition="left"
                  placeholder="カレンダーから期間を選択"
                  readOnly
                  className="font-color font-family form-height detail-search-input"
                  style={{ marginRight: "14px" }}
                />
              </Item>

              <Item className="haribote disabled">
                <Item.Meta className="font-color list-selector-meta">
                  現在地から
                </Item.Meta>
                <Button.Group
                  style={{ paddingRight: "14px", marginBottom: "15px" }}
                >
                  <Button
                    onClick={() => this.onClickTransportationKind("徒歩")}
                    className={`font-family meibo-search-btn3 ${
                      this.state.transportationKind == "徒歩" ? "active" : ""
                    }`}
                    style={{ marginRight: "5px" }}
                  >
                    <span>
                      <Image
                        src={
                          this.state.transportationKind == "徒歩"
                            ? window.$GLOBAL$.__SVG__["徒歩on"]
                            : window.$GLOBAL$.__SVG__["徒歩off"]
                        }
                        size="mini"
                        centered
                        style={{ width: "9px", float: "left", left: "10px" }}
                      />
                      徒歩
                    </span>
                  </Button>
                  <Button
                    onClick={() => this.onClickTransportationKind("自転車")}
                    className={`font-family meibo-search-btn3 ${
                      this.state.transportationKind == "自転車" ? "active" : ""
                    }`}
                    style={{ marginRight: "5px" }}
                  >
                    <span>
                      <Image
                        src={
                          this.state.transportationKind == "自転車"
                            ? window.$GLOBAL$.__SVG__["自転車on"]
                            : window.$GLOBAL$.__SVG__["自転車off"]
                        }
                        size="mini"
                        centered
                        style={{ width: "18px", float: "left", left: "-2px" }}
                      />
                      自転車
                    </span>
                  </Button>
                  <Button
                    style={{ marginRight: "0px" }}
                    onClick={() => this.onClickTransportationKind("車")}
                    className={`font-family meibo-search-btn3 ${
                      this.state.transportationKind == "車" ? "active" : ""
                    }`}
                  >
                    <span>
                      <Image
                        src={
                          this.state.transportationKind == "車"
                            ? window.$GLOBAL$.__SVG__["車on"]
                            : window.$GLOBAL$.__SVG__["車off"]
                        }
                        size="mini"
                        centered
                        style={{ width: "18px", float: "left", left: "11px" }}
                      />
                      車
                    </span>
                  </Button>
                </Button.Group>
                <Range
                  min={0}
                  max={20}
                  defaultValue={[3, 10]}
                  tipFormatter={value => `${value}%`}
                />
              </Item>

              <Item
                style={{
                  height: "64px",
                  marginBottom: "14px",
                  padding: "0px",
                  width: "calc(100vw - 28px)"
                }}
              >
                <Item.Meta className="font-color list-selector-meta">
                  除外キーワード
                </Item.Meta>
                <div>
                  <Input
                    color="white"
                    placeholder="を含まない"
                    className="font-color font-family form-height"
                    style={{ marginRight: "14px", width: "calc(100vw - 28px)" }}
                  />
                  <Image
                    src={window.$GLOBAL$.__SVG__["×ボタン（タグで絞り込む1）"]}
                    style={{ left: "calc(100vw - 55px)", bottom: "28px" }}
                  />
                </div>
              </Item>

              <Item>
                <Grid>
                  <Grid.Row style={{ padding: "10px 0px" }}>
                    <Grid.Column width={6} style={{ marginRight: "95px" }}>
                      <Item.Meta className="font-color">除外タグ</Item.Meta>
                    </Grid.Column>
                    <Grid.Column width={6} style={{ display: "flex" }}>
                      <p
                        style={{
                          margin: "0px",
                          height: "20px",
                          color: "#d0d0d0",
                          lineHeight: "28px",
                          marginRight: "10px"
                        }}
                      >
                        指定しない
                      </p>
                      <Image src={window.$GLOBAL$.__SVG__["＞（プロフ用小）"]} />
                    </Grid.Column>
                  </Grid.Row>
                </Grid>
              </Item>

              <Item>
                <Grid>
                  <Grid.Row style={{ padding: "10px 0px" }}>
                    <Grid.Column width={6} style={{ marginRight: "95px" }}>
                      <Item.Meta className="font-color">必要タグ</Item.Meta>
                    </Grid.Column>
                    <Grid.Column width={6} style={{ display: "flex" }}>
                      <p
                        style={{
                          margin: "0px",
                          height: "20px",
                          color: "#d0d0d0",
                          lineHeight: "28px",
                          marginRight: "10px"
                        }}
                      >
                        指定しない
                      </p>
                      <Image src={window.$GLOBAL$.__SVG__["＞（プロフ用小）"]} />
                    </Grid.Column>
                  </Grid.Row>
                </Grid>
              </Item>
            </Item.Group>
          </Segment>
        </Segment>
        {/* スクロールエリア end test */}

        {/* 下部エリア start */}
        <Segment className="twobtn-footer-area">
          <Segment className="center aligned content detail-search-footer-segment">
            <Grid padded>
              <Grid.Row
                className="detail-search-row"
                style={{ justifyContent: "space-between" }}
              >
                <div className="left aligned content footer-two-btn-style ">
                  <Button
                    onClick={this.clear}
                    style={{ width: "6em" }}
                    className="font-family font-color listselector-footer-clear"
                  >
                    クリア
                  </Button>
                </div>
                <div
                  className="right aligned content"
                  style={{ paddingRight: "0px", paddingLeft: "0px" }}
                >
                  <Button
                    onClick={this.searchAndClose}
                    style={{ width: "14em", marginRight: "0px" }}
                    className="font-family listselector-footer-search"
                  >
                    検索
                  </Button>
                </div>
              </Grid.Row>
            </Grid>
          </Segment>
        </Segment>
        {/* 下部エリア end */}

        {/*** design end ***/}

        <MDBModalW
          size="large"
          isOpen={this.state.showSelectorRanks}
          toggle={this.toggleRanks}
          className="pinmodal-style2"
          id="modal-white"
          centered
        >
          <MDBModalBody className="modal-close">
            <Image src={window.$GLOBAL$.__SVG__["×"]} style={{ float: "right" }} />
          </MDBModalBody>
          <MDBModalBody style={{ padding: "40px 20px" }}>
            <SelectorRanks close={this.closeSelectorRanks} value={this.state} />
          </MDBModalBody>
        </MDBModalW>

        <MDBModalW
          size="fluid"
          isOpen={this.state.showSelectorTags}
          toggle={this.toggleTags}
          className="m-0 p-0"
          centered
          animation="left"
        >
          <MDBModalBody className="m-0 p-0">
            <SelectorTags
              updateSelector={this.props.updateSelector}
              close={this.closeSelectorTags}
              value={this.state}
            />
          </MDBModalBody>
        </MDBModalW>
      </React.Fragment>
    );
    /// Custom - Tabular - layout --
  }
}
