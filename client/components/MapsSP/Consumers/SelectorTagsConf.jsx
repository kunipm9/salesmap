import React from "react";
import { withTracker } from "meteor/react-meteor-data";
import { Session } from "meteor/session";
import { MapsSP_List_List_ComponentInfo } from "./List";
import { Maps_Tags_Collection } from "@imports/api/Maps/Tags_Collection";

// import start
import { Segment } from "semantic-ui-react";
import { Grid } from "semantic-ui-react";
import { Item } from "semantic-ui-react";

import { Header } from "semantic-ui-react";

import { Button } from "semantic-ui-react";
import { Image } from "semantic-ui-react";

// 足りなければ、import 文を追加

import { getTagName } from "../lib/Tags/utils";

// import end

export class _SelectorTagsConf extends React.Component {
  "use strict";

  "use strict";
  constructor(props) {
    super(props);
    this.state = {
      selectedTags: this.props.tags
    };

    this.window_innerHeight = window.innerHeight;
  }

  /* global tag */

  render() {
    /// Custom - Collection - subscribe
    if (this.props.loading) {
      return <span />;
    }
    /// Custom - Collection - subscribe --

    const tags = [];
    for (let index in this.props.selectedTags) {
      const tag = this.props.selectedTags[index];
      tags.push(getTagName(tag[0], tag[1], tag[2], tag[3]));
    }

    return (
      <React.Fragment>
        {/*** design start ***/}

        {/* ここに XD と https://react.semantic-ui.com/ を見ながらHTMLタグを記述 */}

        {/* Link start */}
        <Segment className="header-line" />
        <Segment className="link-area5">
          <Grid centered className="center aligned content">
            <Grid.Row className="header-row">
              <Grid.Column width={2}>
                <Button
                  onClick={this.props.close}
                  className="font-color close-area"
                >
                  <Image src={window.$GLOBAL$.__SVG__["戻る"]} />
                </Button>
              </Grid.Column>
              <Grid.Column width={14} className="center aligned content header">
                <Header as="h2" className="font-color font-family header-font">
                  タグ一覧
                </Header>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Segment>
        {/* Link end */}

        {/* タグ追加 start */}
        {/* <Segment
          basic
          style={{
            height: "fit-content",
            marginBottom: "0px",
            paddingTop: "5px",
            paddingBottom: "5px"
          }}
        ></Segment> */}
        {/* タグ追加 end */}

        {/* スクロールエリア start */}
        <Segment
          className="scroll-area"
          style={{
            height: this.window_innerHeight - 68 + "px"
          }}
        >
          <Segment padded className="taglist-area">
            <Item.Group divided>
              {
                <For each="tag" index="index" of={tags}>
                  <Item>
                    <Grid className="tagitem">
                      <Grid.Row>
                        <Grid.Column
                          width={3}
                          className="middle aligned"
                          id="taglist-check"
                        >
                          <Image src={window.$GLOBAL$.__SVG__["ブクマチェックon"]} />
                          {/* <Image src="ブクマチェックoff.svg" /> */}
                        </Grid.Column>
                        <Grid.Column width={13}>
                          <Item.Meta className="font-color font-family tagitem2-font">
                            {tag[0]}
                          </Item.Meta>
                          <Item.Content className="font-color font-family tagitem-font">
                            {tag[1]}
                          </Item.Content>
                        </Grid.Column>
                      </Grid.Row>
                    </Grid>
                  </Item>
                </For>
              }
            </Item.Group>
          </Segment>
        </Segment>
        {/* スクロールエリア end */}

        {/* 下部エリア start */}
        <Segment
          basic
          style={{ height: "fit-content", padding: "4px" }}
          className="center aligned content"
        >
          <Grid>
            <Grid.Row
              style={{
                position: "fixed",
                bottom: "85px",
                right: "0px",
                left: "0px"
              }}
            >
              <Grid.Column width={16}>
                {/* すべての項目を選択ボタン start */}

                {/* <Button className="font-family fotter-btn-style2"  style={{backgroundColor: 'white', border: 'solid 2px #89b0cd', color: '#89b0cd'}}>すべての項目を選択</Button> */}

                {/* すべての項目を選択ボタン end */}

                {/* すべての選択を解除ボタン start */}

                <Button
                  className="font-family fotter-btn-style2"
                  style={{ backgroundColor: "#3a7cac", color: "white" }}
                >
                  すべての選択を解除
                </Button>

                {/* すべての選択を解除ボタン end */}
              </Grid.Column>
            </Grid.Row>
          </Grid>
          <Grid>
            <Grid.Row
              style={{
                position: "fixed",
                bottom: "30px",
                right: "0px",
                left: "0px"
              }}
            >
              <Grid.Column width={16}>
                <Button
                  className="font-family fotter-btn-style2"
                  style={{ backgroundColor: "#ac3a59", color: "white" }}
                >
                  削除
                </Button>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Segment>

        {/* 下部エリア end */}

        {/*** design end ***/}
      </React.Fragment>
    );
  }
}

/// Custom - View - tracker
export const SelectorTagsConf = withTracker(props => {
  /// Custom - Collection - subscribe
  const handles = [
    Meteor.subscribe(Maps_Tags_Collection._name, Session.get("Users_Groups_id"))
  ];
  const loading = handles.some(handle => !handle.ready());
  console.log(new Date().getTime(), "Edit_Category loading", loading);

  const tagList = Maps_Tags_Collection.find({ _deleted: null }).map(c => c);

  return {
    ComponentInfo: MapsSP_List_List_ComponentInfo,
    tagList: tagList,
    selectedTags: props.selectedTags,
    loading: loading
  };
  /// Custom - Collection - subscribe --
})(_SelectorTagsConf);
/// Custom - View - tracker --
