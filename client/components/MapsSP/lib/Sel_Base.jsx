/// Sys - Tabular
import React from "react";
import { Session } from "meteor/session";
import InfiniteScroll from "react-infinite-scroll-component";
import mingo from "mingo";
require("jquery.nicescroll");
import _ from "lodash";
const moji = require("moji");
/// Sys - Tabular --

/// Custom - AutoForm - collection
import { Maps_Consumers_Collection } from "@imports/api/Maps/Consumers_Collection";
console.assert(
  Maps_Consumers_Collection,
  "Maps_Consumers_Collection is undefined."
);
/// Custom - AutoForm - collection --

// import start
import { Segment } from "semantic-ui-react";
import { Grid } from "semantic-ui-react";
import { Item } from "semantic-ui-react";

import { Input } from "semantic-ui-react";
import { Button } from "semantic-ui-react";
import { Label } from "semantic-ui-react";

import { Tab } from "semantic-ui-react";
import { Image } from "semantic-ui-react";

// import end

export class Sel_Base extends React.Component {
  "use strict";

  constructor(props) {
    super(props);

    this.window_innerHeight = window.innerHeight;
  }

  /**
   *
   *
   * @param {*} event
   * @memberof Sel_Base
   */
  onSearchKeyword(event) {
    this.debouncedOnSearchKeyword(event.target.value);
    this.setState({ keyword: event.target.value });
  }

  /**
   *
   *
   * @param {*} value
   * @memberof Sel_Base
   */
  debouncedOnSearchKeyword() {
    this.queryDocs();
  }

  /**
   *
   *
   * @memberof Sel_Base
   */
  onClickCheckbox = doc => {
    if (doc._id == this.state.selectDoc._id) {
      this.setState({ selectDoc: {} });
    } else {
      this.setState({ selectDoc: doc });
    }
  };

  /**
   *
   *
   * @memberof Sel_Base
   */
  queryDocsCommon = () => {
    /// Custom - Collection - selector
    const query = {};

    query["_deleted"] = null;

    if (this.state.keyword) {
      const keyword = moji(this.state.keyword)
        .convert("HG", "KK")
        .convert("HK", "ZK")
        .convert("ZE", "HE")
        .toString();
      const selectorKeyword = new RegExp(".*" + keyword + ".*", "i");
      query["keyword"] = selectorKeyword;
    }

    /// Custom - Collection - selector --

    /// Custom - Collection - query
    this.listCursor = mingo.find(this.CollectionList, query);
    this.setState({ listItems: [] });
    this.setState({ hasMore: true });
    this.setState({ dataLength: 0 });
    this.setState({ listCursorCount: this.listCursor.count() });
    this.listCursor = mingo.find(this.CollectionList, query);
    setTimeout(() => this.fetchMoreData());
    /// Custom - Collection - query --
  };

  /// Custom - InfiniteScroll
  /**
   *
   *
   * @memberof Sel_Base
   */
  fetchMoreDataCommon = nameField => {
    console.log(new Date().getTime(), "List fetchMoreData");
    const start = new Date().getTime();

    let count = 100;
    if (this.state.listItems.length < this.listLastPage) {
      count = this.listLastPage;
    }
    console.log("fetchMoreData count", count);

    let hasMore = this.state.hasMore;
    const listItems = Object.assign([], this.state.listItems);

    // eslint-disable-next-line no-constant-condition
    while (true) {
      count--;
      if (count < 0) {
        break;
      }

      if (!this.listCursor || !this.listCursor.hasNext()) {
        hasMore = false;
        break;
      }

      const doc = this.listCursor.next();

      listItems.push([
        (_.get(doc, nameField) || " ").slice(0, 1),
        doc,
        this.fetchMoreElem(doc)
      ]);
    }

    this.setState({
      hasMore: hasMore,
      listItems: listItems,
      listCursorCount: this.state.listCursorCount,
      dataLength: this.state.listItems.length
    });

    const end = new Date().getTime();
    console.log(new Date().getTime(), "List fetchMoreData end", end - start);
  };
  /// Custom - InfiniteScroll --

  /* global index */
  /* global item */
  /* global doc */

  /**
   *
   *
   * @returns
   * @memberof Sel_Base
   */
  displayTab1 = () => {
    return (
      <React.Fragment>
        {
          <If condition={this.labelAddButton}>
            {/* 新規追加 start */}
            <Segment basic className="add-new" style={{ margin: "0px" }}>
              <Button
                onClick={this.props.onClickAdd_Base}
                className="font-family add-new-btn"
                style={{
                  marginTop: "4px"
                }}
              >
                <Image
                  src={window.$GLOBAL$.__SVG__["新規追加"]}
                  className="add-new-img"
                />
                <p className="add-new-text">{this.labelAddButton}</p>
              </Button>
            </Segment>
            {/* 新規追加 end */}
          </If>
        }

        <Segment
          className="scroll-area"
          style={{
            height: this.window_innerHeight - 178 + "px"
          }}
        >
          {/* あいうえお start */}
          <InfiniteScroll
            dataLength={this.state.dataLength}
            next={this.fetchMoreData}
            hasMore={this.state.hasMore}
            loader={<h4>Loading...</h4>}
            height={this.window_innerHeight - 290 + "px"}
            endMessage={
              <p style={{ textAlign: "center", height: "80px" }}>
                <b>Yay! You have seen it all</b>
              </p>
            }
          >
            {
              <For each="item" index="index" of={this.state.listItems}>
                {
                  <If
                    condition={
                      index == 0 ||
                      this.state.listItems[index - 1][0] != item[0]
                    }
                  >
                    <Segment key={index} padded className="main-area">
                      <Label
                        attached="top"
                        className="font-color font-family order-label"
                      >
                        {item[0] != " " ? item[0] : "(なし)"}
                      </Label>
                      <Item.Group divided>
                        <Item onClick={() => this.onClickCheckbox(item[1])}>
                          <Grid>
                            <Grid.Row>
                              <Grid.Column
                                width={13}
                                className="item-margin-top add-item"
                              >
                                <Item.Header
                                  as="a"
                                  className="font-family font-color add-header1"
                                >
                                  {item[2]}
                                </Item.Header>
                              </Grid.Column>
                              <Grid.Column
                                width={3}
                                className="middle aligned content"
                              >
                                {
                                  <If
                                    condition={
                                      item[1]._id == this.state.selectDoc._id
                                    }
                                  >
                                    <Image
                                      src="/smsk-front/チェック.svg"
                                      style={{ float: "right" }}
                                    />
                                  </If>
                                }
                              </Grid.Column>
                            </Grid.Row>
                          </Grid>
                        </Item>
                      </Item.Group>
                    </Segment>
                  </If>
                }

                {
                  <If
                    condition={
                      index > 0 && this.state.listItems[index - 1][0] == item[0]
                    }
                  >
                    <Segment
                      key={index}
                      padded
                      style={{
                        margin: "0",
                        marginBottom: "1px",
                        border: "none",
                        paddingTop: "0.4em"
                      }}
                    >
                      <Item.Group divided>
                        <Item onClick={() => this.onClickCheckbox(item[1])}>
                          <Grid>
                            <Grid.Row>
                              <Grid.Column
                                width={13}
                                className="item-margin-top add-item"
                              >
                                {item[2]}
                              </Grid.Column>
                              <Grid.Column
                                width={3}
                                className="middle aligned content"
                              >
                                {
                                  <If
                                    condition={
                                      item[1]._id == this.state.selectDoc._id
                                    }
                                  >
                                    <Image
                                      src="/smsk-front/チェック.svg"
                                      style={{ float: "right" }}
                                    />
                                  </If>
                                }
                              </Grid.Column>
                            </Grid.Row>
                          </Grid>
                        </Item>
                      </Item.Group>
                    </Segment>
                  </If>
                }
              </For>
            }
          </InfiniteScroll>
        </Segment>
      </React.Fragment>
    );
  };

  /**
   *
   *
   * @returns
   * @memberof Sel_Base
   */
  displayTab2Common = sessionId => {
    const resultItems = [];
    const _ids = Session.get(sessionId) || [];
    for (let i in _ids) {
      let doc;
      if (this.Collection._name == "Maps_Consumers") {
        doc = window.$GLOBAL$.Collection[this.Collection._name][_ids[i]];
      } else {
        const docs = this.props.CollectionList.filter(d => d._id == _ids[i]);
        if (docs.length) {
          doc = docs[0];
        }
      }
      if (doc) {
        resultItems.push(doc);
      }
    }

    return (
      <Segment
        className="scroll-area"
        style={{ height: this.window_innerHeight - 140 + "px" }}
      >
        <Segment
          padded
          className="fam-add-area"
          style={{ height: this.window_innerHeight - 140 + "px" }}
        >
          <Item.Group divided>
            {
              <For each="doc" index="index" of={resultItems}>
                <Item key={doc._id} onClick={() => this.onClickCheckbox(doc)}>
                  <Item.Content className="font-color font-family">
                    {this.displayTab2Elem(doc)}
                    {
                      <If condition={doc._id == this.state.selectDoc._id}>
                        <Image
                          src="/smsk-front/チェック.svg"
                          style={{ float: "right" }}
                        />
                      </If>
                    }
                    <Image
                      onClick={() => this.onClickDelHist(doc._id)}
                      src={
                        window.$GLOBAL$.__SVG__["×ボタン（タグで絞り込む1）"]
                      }
                      floated="right"
                      className="add-delite"
                    />
                  </Item.Content>
                </Item>
              </For>
            }
          </Item.Group>
        </Segment>
      </Segment>
    );
  };

  /**
   *
   *
   * @returns
   * @memberof Sel_Base
   */
  render() {
    console.log(new Date().getTime(), "Sel_Base render");
    const start = new Date().getTime();

    const panes = [
      {
        menuItem: "一覧",
        render: () => (
          <Tab.Pane attached={false} style={{ padding: 0, margin: 0 }}>
            <this.displayTab1 />
          </Tab.Pane>
        )
      },
      {
        menuItem: "検索履歴",
        render: () => (
          <Tab.Pane attached={false} style={{ padding: 0, margin: 0 }}>
            <this.displayTab2 />
          </Tab.Pane>
        )
      }
    ];

    /// Custom - Tabular - layout
    const ret = (
      <React.Fragment>
        {/* 詳細 start */}
        <Segment className="header-line" />
        <Segment inverted className="link-area3">
          <Grid>
            <Grid.Row style={{ height: "73px" }}>
              <Grid.Column
                onClick={this.props.closeSel_Base}
                width={2}
                className="return-area"
              >
                <Button className="button-return return-padding">
                  <Image src={window.$GLOBAL$.__SVG__["戻る"]} />
                </Button>
              </Grid.Column>
              <Grid.Column
                width={12}
                className="center aligned content"
                style={{ padding: "0px" }}
              >
                <Input
                  onChange={this.onSearchKeyword}
                  value={this.state.keyword}
                  icon="search"
                  iconPosition="left"
                  inverted
                  placeholder={this.props.searchPlaceholder}
                  className="font-family form-height"
                  style={{
                    width: "100%",
                    border: "solid 1px #d6d6d6",
                    marginLeft: "5px"
                  }}
                />
                <Image
                  onClick={() => {
                    this.setState({ keyword: "" });
                    this.state.keyword = "";
                    this.queryDocs();
                  }}
                  src={window.$GLOBAL$.__SVG__["×ボタン（タグで絞り込む1）"]}
                  style={{ float: "right", right: "6px", bottom: "28px" }}
                />
                <Image
                  src={window.$GLOBAL$.__SVG__["虫メガネ"]}
                  style={{ left: "11px", bottom: "30px", width: "25.795px" }}
                />
              </Grid.Column>
            </Grid.Row>
          </Grid>
          <Tab
            menu={{
              secondary: true,
              pointing: true,
              style: { marginBottom: "0px", height: "52px" }
            }}
            panes={panes}
            style={{ padding: 0 }}
            className="tab3div"
          />
        </Segment>
        {/* 詳細 end */}

        {/* 下部エリア start */}
        <Segment basic className="center aligned content fam-fotter-area">
          <Grid>
            <Grid.Row>
              <Grid.Column
                width={16}
                className="aligned content fam-fotter-style"
              >
                <Button
                  onClick={this.onClickSelectConfirm}
                  className="font-family fam-fotter-btn fotter-btn-style"
                >
                  決定
                </Button>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Segment>

        {/* 下部エリア end */}

        <this.displayConfirmModal />
      </React.Fragment>
    );
    /// Custom - Tabular - layout --

    const end = new Date().getTime();
    console.log(new Date().getTime(), "List render end", end - start);

    return ret;
  }
}
