/// Sys - AutoForm
import React from "react";
import Edit from "@imports/ui/crud/Edit";
import _ from "lodash";
/// Sys - AutoForm --

import { MapsSP_Pins_View_ComponentInfo } from "./View";

/// Custom - AutoForm - collection
import { Maps_PinCategorys_Collection } from "@imports/api/Maps/PinCategorys_Collection";
console.assert(
  Maps_PinCategorys_Collection,
  "Maps_PinCategorys_Collection is undefined."
);
/// Custom - AutoForm - collection --

import { svg_list } from "@imports/ui/utils/svgList";

// import start
import { SwipeableButton } from "../lib/SwipeableButton";
import { Segment } from "semantic-ui-react";
import { Item } from "semantic-ui-react";

import { Button } from "semantic-ui-react";
import { Input } from "semantic-ui-react";
import { Grid } from "semantic-ui-react";
import { Image } from "semantic-ui-react";

import { MDBModalBody } from "mdbreact";
import { MDBModalW } from "../lib/MDBModalW";

const canvg = require("canvg-browser");
import { png_list } from "@imports/ui/utils/svgList";

/**
 *
 *
 * @export
 * @class Edit_Category
 * @extends {Edit}
 */
export class Edit_Category extends Edit {
  "use strict";

  /**
   *Creates an instance of Edit_Category.
   * @param {*} props
   * @memberof Edit_Category
   */
  constructor(props) {
    console.log(new Date().getTime(), "Edit_Category constructor");
    super(props);

    /// Custom - Role - check permission
    this.ComponentInfo = MapsSP_Pins_View_ComponentInfo;
    /// Custom - Role - check permission --

    /// Custom - AutoForm - rebuild field
    this.Collection = Maps_PinCategorys_Collection;
    this.Form_name = this.Collection._name;
    /// Custom - AutoForm - rebuild field --

    this.state.expandingCategory1 = -1;
    this.state.index1 = 0;
    this.state.index2 = 0;
    this.state.cat1 = null;
    this.state.cat2 = null;
    this.state.category1Title = "";
    this.state.category2Title = "";
    this.state.category2ShortTitle = "";
    this.state.category2Color = "";
    this.state.category2Symbol = "";
    this.state.showEdit_Category1 = false;
    this.state.showEdit_Category2 = false;
    this.state.message = [];

    /// Application - AutoForm - initial value
    this.initialValue = {
      cat1: []
    };
    /// Application - AutoForm - initial value --

    /// Custom - AutoForm - single record
    this.singleRecordKey = {};
    /// Custom - AutoForm - single record --

    /// Sys - AutoForm - rebuild field
    this.postConstructor();
    /// Sys - AutoForm - rebuild field --

    this.window_innerHeight = window.innerHeight;
  }

  /**
   *
   *
   * @memberof Edit_Category
   */
  expandCategory1 = index1 => {
    if (index1 != this.state.expandingCategory1) {
      this.setState({ expandingCategory1: index1 });
    } else {
      this.setState({ expandingCategory1: -1 });
    }
  };

  /**
   *
   *
   * @memberof Edit_Category
   */
  openEdit_Category1 = index1 => {
    const doc = this.Collection.findOne(this.singleRecordKey);
    if (doc.cat1[index1]) {
      const cat1 = doc.cat1[index1];
      this.setState({ category1Title: cat1.title });
    } else {
      this.setState({ category1Title: "" });
    }
    this.setState({
      message: [],
      showEdit_Category1: true,
      index1: index1
    });
  };

  /**
   *
   *
   * @memberof Edit_Category
   */
  toggleEdit_Category1 = () => {
    this.setState({ showEdit_Category1: !this.state.showEdit_Category1 });
  };

  /**
   *
   *
   * @memberof Edit_Category
   */
  closeEdit_Category1 = () => {
    this.setState({ showEdit_Category1: false });
  };

  /**
   *
   *
   * @memberof Edit_Category
   */
  onChangeCategory1Title = event => {
    this.setState({ category1Title: event.target.value });
  };

  /**
   *
   *
   * @memberof Edit_Category
   */
  onClickCategory1Set = () => {
    const title = _.trim(this.state.category1Title);
    if (!title) {
      return;
    }

    const doc = this.Collection.findOne(this.singleRecordKey);
    if (!doc.cat1[this.state.index1]) {
      doc.cat1.push({ cat2: [] });
    }
    doc.cat1[this.state.index1].id = this.state.cat1;
    doc.cat1[this.state.index1].title = title;
    this.submit(doc, this.closeEdit_Category1);
  };

  /**
   *
   *
   * @memberof Edit_Category
   */
  onClickCategory1Del = index1 => {
    const doc = this.Collection.findOne(this.singleRecordKey);
    doc.cat1.splice(index1, 1);
    this.submit(doc, this.refreshList);
  };

  /**
   *
   *
   * @memberof Edit_Category
   */
  openEdit_Category2 = (index1, index2) => {
    const doc = this.Collection.findOne(this.singleRecordKey);
    if (doc.cat1[index1].cat2[index2]) {
      const cat2 = doc.cat1[index1].cat2[index2];
      this.setState({
        category2Title: cat2.title,
        category2ShortTitle: cat2.shorttitle,
        category2Symbol: cat2.symbol,
        category2Color: cat2.color
      });
    } else {
      this.setState({
        category2Title: "",
        category2ShortTitle: "",
        category2Symbol: "",
        category2Color: ""
      });
    }

    if (!doc.cat1[index1].cat2[index2]) {
      doc.cat1[index1].cat2[index2] = {};
    }

    this.setState({
      message: [],
      showEdit_Category2: true,
      index1: index1,
      index2: index2,
      cat1: doc.cat1[index1].id,
      cat2: doc.cat1[index1].cat2[index2].id
    });
  };

  /**
   *
   *
   * @memberof Edit_Category
   */
  toggleEdit_Category2 = () => {
    this.setState({ showEdit_Category2: !this.state.showEdit_Category2 });
  };

  /**
   *
   *
   * @memberof Edit_Category
   */
  closeEdit_Category2 = () => {
    console.log("closeEdit_Category2 =========================");
    this.setState({ showEdit_Category2: false });
  };

  /**
   *
   *
   * @memberof Edit_Category
   */
  onChangeCategory2Title = event => {
    this.setState({ category2Title: event.target.value });
  };

  /**
   *
   *
   * @memberof Edit_Category
   */
  onChangeCategory2ShortTitle = event => {
    this.setState({ category2ShortTitle: event.target.value });
  };

  /**
   *
   *
   * @memberof Edit_Kind
   */
  onClickCateogry2Symbol = symbol => {
    this.setState({ category2Symbol: symbol });
  };

  /**
   *
   *
   * @memberof Edit_Category
   */
  onClickCategory2Color = color => {
    this.setState({ category2Color: color });
  };

  /**
   *
   *
   * @memberof Edit_Category
   */
  onClickCategory2Set = () => {
    const title = _.trim(this.state.category2Title);
    const shorttitle = _.trim(this.state.category2ShortTitle);
    const symbol = _.trim(this.state.category2Symbol);
    const color = _.trim(this.state.category2Color);
    if (!title || !shorttitle || shorttitle.length > 2 || !symbol || !color) {
      const message = [];
      if (!title) {
        message.push("種別名を入力してください");
      }
      if (!shorttitle || shorttitle.length > 2) {
        message.push("2文字ラベルを2文字以内で入力してください");
      }
      if (!symbol) {
        message.push("シンボルを選択してください");
      }
      if (!color) {
        message.push("カラーを選択してください");
      }
      this.setState({ message: message });
      return;
    }

    const doc = this.Collection.findOne(this.singleRecordKey);
    if (!doc.cat1[this.state.index1]) {
      doc.cat1.push({ cat2: [] });
    }
    if (!doc.cat1[this.state.index1].cat2[this.state.index2]) {
      doc.cat1[this.state.index1].cat2.push({});
    }

    let svgString = svg_list[symbol].svg;
    svgString = svgString.replace("_COLOR_", color);
    for (let i = 0; i < 7; i++) {
      svgString = svgString.replace("_SYMBOL_", shorttitle);
    }

    const canvas = document.getElementById("canvasPin");
    const options = {
      log: false,
      ignoreMouse: true
    };
    canvg(canvas, svgString, options);
    const buffer = canvas.toDataURL("image/png");

    const tmp = {
      id: this.state.cat2,
      title: title,
      shorttitle: shorttitle,
      symbol: symbol,
      color: color,
      bitmap: buffer,
      svg: svgString
    };
    doc.cat1[this.state.index1].cat2[this.state.index2] = tmp;

    doc.cat1[this.state.index1].cat2 = doc.cat1[this.state.index1].cat2.filter(
      c => c
    );

    this.submit(doc, this.closeEdit_Category2);
  };

  /**
   *
   *
   * @memberof Edit_Category
   */
  onClickCategory2Del = (index1, index2) => {
    const doc = this.Collection.findOne(this.singleRecordKey);
    doc.cat1[index1].cat2.splice(index2, 1);
    this.submit(doc, this.refreshList);
  };

  /**
   *
   *
   * @memberof Edit_Category
   */
  refreshList = () => {
    this.forceUpdate();
  };

  /* global index1 */
  /* global cat1 */
  /* global index2 */
  /* global cat2 */
  /* global color */
  /* global symbol */
  /* global mess */

  /**
   *
   *
   * @returns
   * @memberof Edit_Category
   */
  render() {
    console.log(new Date().getTime(), "Edit_Category render");

    if (!this.state.doc || !this.state.doc.cat1) {
      return <React.Fragment />;
    }

    const doc = this.Collection.findOne(this.singleRecordKey);
    doc.cat1.push({ title: "" });
    if (this.state.expandingCategory1 >= 0) {
      if (!doc.cat1[this.state.expandingCategory1].cat2) {
        doc.cat1[this.state.expandingCategory1].cat2 = [];
      }
      doc.cat1[this.state.expandingCategory1].cat2.push({ title: "" });
    }

    const colors = [
      "#DD5555",
      "#DD8955",
      "#DDC855",
      "#AEDD55",
      "#55DD94",
      "#55B8DD",
      "#5589DD",
      "#555ADD",
      "#9455DD",
      "#DD55B8"
    ];

    const symbols = [
      "normal",
      "maru",
      "sankaku",
      "batsu",
      "attention",
      "parking",
      "pin",
      "reload",
      "restaurant",
      "speech"
    ];

    return (
      <React.Fragment>
        {/* スクロールエリア start */}
        <Segment
          className="scroll-area"
          style={{ height: this.window_innerHeight - 188 + "px" }}
        >
          <Segment padded className="pin-area">
            <Item.Group
              divided
              style={{
                minHeight: this.window_innerHeight - 248 + "px"
              }}
            >
              {
                <For each="cat1" index="index1" of={doc.cat1}>
                  {/* カテゴリ start */}
                  <Item key={index1} className="pincategoly-item1">
                    <SwipeableButton
                      index={index1}
                      expand={this.expandCategory1}
                      expandign={this.state.expandingCategory1 == index1}
                      onClickEdit={() => this.openEdit_Category1(index1)}
                      onClickDelete={() => this.onClickCategory1Del(index1)}
                      style={{
                        height: "40px",
                        padding: "8px 0px",
                        fontSize: "14px",
                        boxShadow:
                          "2px 2px 5px 0 rgba(0,0,0,.16), 2px 2px 10px 0 rgba(0,0,0,.12)"
                      }}
                      size="large"
                    >
                      <Button
                        className="pincategoly-item1-btn"
                        style={{
                          width: "100%",
                          color: cat1.title ? "#333333" : "#aaaaaa"
                        }}
                      >
                        &nbsp;
                        {cat1.title || "新規追加"}
                        &nbsp;
                      </Button>
                    </SwipeableButton>
                  </Item>
                  {/* カテゴリ end */}
                  {
                    <If
                      condition={
                        index1 == this.state.expandingCategory1 &&
                        doc.cat1[index1].title
                      }
                    >
                      {
                        <For
                          each="cat2"
                          index="index2"
                          of={doc.cat1[index1].cat2}
                        >
                          {
                            <If condition={cat2}>
                              {/* 種別 start */}
                              <Item key={index2} className="pincategoly-item3">
                                <Grid>
                                  <Grid.Row className="pin-folder-row">
                                    <Grid.Column
                                      width={2}
                                      style={{
                                        paddingRight: "0px",
                                        left: "20px"
                                      }}
                                    >
                                      {
                                        <If condition={cat2.symbol}>
                                          <Image
                                            src={png_list[cat2.symbol]}
                                            id="pincategoly-pin-img"
                                          />
                                        </If>
                                      }
                                    </Grid.Column>
                                    <Grid.Column
                                      width={13}
                                      style={{
                                        padding: "0px",
                                        left: "26px",
                                        marginTop: "3px"
                                      }}
                                    >
                                      <SwipeableButton
                                        index={index1}
                                        expand={this.expandCategory1}
                                        expandign={
                                          this.state.expandingCategory1 ==
                                          index1
                                        }
                                        onClickEdit={() =>
                                          this.openEdit_Category2(
                                            index1,
                                            index2
                                          )
                                        }
                                        onClickDelete={() =>
                                          this.onClickCategory2Del(
                                            index1,
                                            index2
                                          )
                                        }
                                        style={{
                                          height: "36px",
                                          padding: "8px 0px",
                                          fontSize: "14px",
                                          position: "relative",
                                          bottom: "13px",
                                          right: "16px"
                                        }}
                                        size="large"
                                      >
                                        <Button
                                          className="pincategoly-item3-btn1 font-family font-color"
                                          style={{
                                            borderLeft: `solid 13px ${cat2.color ||
                                              "#aaaaaa"}`
                                          }}
                                        >
                                          <Grid>
                                            <Grid.Row>
                                              {
                                                <If condition={cat2.title}>
                                                  <Grid.Column
                                                    style={{
                                                      textAlign: "left",
                                                      width: "48px",
                                                      paddingRight: 0
                                                    }}
                                                  >
                                                    {cat2.shorttitle}
                                                  </Grid.Column>
                                                  <Grid.Column
                                                    style={{
                                                      width: "6px",
                                                      padding: 0
                                                    }}
                                                  >
                                                    &nbsp;&#124;&nbsp;
                                                  </Grid.Column>
                                                  <Grid.Column
                                                    width={9}
                                                    style={{
                                                      textAlign: "left"
                                                    }}
                                                  >
                                                    {cat2.title}
                                                  </Grid.Column>
                                                </If>
                                              }
                                              {
                                                <If condition={!cat2.title}>
                                                  <Grid.Column
                                                    style={{ color: "#aaaaaa" }}
                                                  >
                                                    新規追加
                                                  </Grid.Column>
                                                </If>
                                              }
                                            </Grid.Row>
                                          </Grid>
                                        </Button>
                                      </SwipeableButton>
                                    </Grid.Column>
                                  </Grid.Row>
                                </Grid>
                              </Item>

                              {/* 種別 end */}
                            </If>
                          }
                        </For>
                      }
                    </If>
                  }
                </For>
              }
            </Item.Group>
          </Segment>
        </Segment>
        {/* スクロールエリア end */}

        <MDBModalW
          size="mini"
          isOpen={this.state.showEdit_Category1}
          toggle={this.toggleEdit_Category1}
          className="pinmodal-style2"
          id="modal-white"
        >
          <MDBModalBody className="modal-close">
            <Image
              onClick={this.closeEdit_Category1}
              src={window.$GLOBAL$.__SVG__["×"]}
              style={{ float: "right" }}
            />
          </MDBModalBody>
          <MDBModalBody id="pinmodal-padding">
            <p className="font-family pinmodal-label">種別名</p>
            <Input
              onChange={this.onChangeCategory1Title}
              value={this.state.category1Title}
              transparent
              placeholder="単体ポスター"
              size="big"
              className="pinmodal-input"
              style={{ width: "237px" }}
            />

            {
              <For each="mess" index="index1" of={this.state.message}>
                <p style={{ color: "red" }}>{mess}</p>
              </For>
            }

            <Button
              onClick={this.onClickCategory1Set}
              className="font-family pinmodal-btn"
            >
              決定
            </Button>
          </MDBModalBody>
        </MDBModalW>

        <MDBModalW
          size="mini"
          isOpen={this.state.showEdit_Category2}
          toggle={this.toggleEdit_Category2}
          className="pinmodal-style2"
          id="modal-white"
        >
          <MDBModalBody className="modal-close">
            <Image
              onClick={this.closeEdit_Category2}
              src={window.$GLOBAL$.__SVG__["×"]}
              style={{ float: "right" }}
            />
          </MDBModalBody>
          <MDBModalBody id="pinmodal-padding">
            <p className="font-family pinmodal-label">種別名</p>
            <Input
              onChange={this.onChangeCategory2Title}
              value={this.state.category2Title}
              transparent
              placeholder="単体ポスター"
              size="big"
              className="pinmodal-input"
              style={{ width: "237px" }}
            />

            <p className="font-family pinmodal-label">2文字ラベル</p>
            <Input
              onChange={this.onChangeCategory2ShortTitle}
              value={this.state.category2ShortTitle}
              transparent
              placeholder="単体"
              size="big"
              className="pinmodal-input"
              style={{ width: "237px" }}
            />

            <p className="font-family pinmodal-label">シンボル</p>
            {
              <For each="symbol" index="index2" of={symbols}>
                <Button
                  key={index2}
                  onClick={() => this.onClickCateogry2Symbol(symbol)}
                  style={{
                    marginBottom: "3px"
                  }}
                  className={
                    symbol == this.state.category2Symbol
                      ? "pinmodal-simble-selected"
                      : "pinmodal-simble"
                  }
                >
                  <Image
                    src={png_list[symbol]}
                    className="pinmodal-simble-img"
                  />
                </Button>
              </For>
            }

            <p className="font-family pinmodal-label pinmodal-colorlabel">
              カラー
            </p>
            {
              <For each="color" index="index1" of={colors}>
                <Button
                  key={index1}
                  onClick={() => this.onClickCategory2Color(color)}
                  className={
                    color == this.state.category2Color
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

            {
              <For each="mess" index="index1" of={this.state.message}>
                <p style={{ color: "red" }}>{mess}</p>
              </For>
            }

            <Button
              onClick={this.onClickCategory2Set}
              className="font-family pinmodal-btn"
            >
              決定
            </Button>
          </MDBModalBody>
        </MDBModalW>
        <canvas id="canvasPin" width="64px" height="64px"></canvas>
      </React.Fragment>
    );
  }
}
