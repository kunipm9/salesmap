import React from "react";
import { withTracker } from "meteor/react-meteor-data";
import { Session } from "meteor/session";
import { MapsSP_List_List_ComponentInfo } from "./List";
import { Maps_Tags_Collection } from "@imports/api/Maps/Tags_Collection";

// import start
import { Segment } from "semantic-ui-react";
import { Grid } from "semantic-ui-react";
import { Item } from "semantic-ui-react";

import { Button } from "semantic-ui-react";
import { Image } from "semantic-ui-react";
import { Input } from "semantic-ui-react";

import { getTagName } from "./utils";

// 足りなければ、import 文を追加

// import end

class _Tags_ListSearch extends React.Component {
  "use strict";
  constructor(props) {
    super(props);
    this.state = {
      searchKeyword: this.props.searchKeyword
    };

    this.window_innerHeight = window.innerHeight;
  }

  onChangeSearchKeyword = event => {
    this.setState({ searchKeyword: event.target.value });
  };

  onChangeCheckbox = (selId, cat1Id, cat2Id, itemId) => {
    let selectedTags = this.props.selectedTags;
    if (this.props.selectedTags.filter(s => s[0] == selId).length) {
      selectedTags = this.props.selectedTags.filter(s => s[0] != selId);
    } else {
      selectedTags.push([selId, cat1Id, cat2Id, itemId]);
    }
    this.props.updateSelectedTags(selectedTags);
  };

  /* global index */
  /* global tag */

  render() {
    console.log(new Date().getTime(), "Edit_Category render");

    /// Custom - Collection - subscribe
    if (this.props.loading) {
      return <span />;
    }
    /// Custom - Collection - subscribe --

    const tags = [];
    for (let index1 in this.props.tagList) {
      if (
        this.props.tagList[index1].title.indexOf(this.state.searchKeyword) >= 0
      ) {
        const selId = this.props.tagList[index1]._id;
        const cat1Id = this.props.tagList[index1]._id;
        const cat2Id = null;
        const itemId = null;
        const title = getTagName(this.props.tagList, cat1Id, cat2Id, itemId);
        tags.push({
          selId: selId,
          cat1Id: cat1Id,
          cat2Id: cat2Id,
          itemId: itemId,
          title1: title[0],
          title2: title[1]
        });
      }
      for (let index2 in this.props.tagList[index1].cat2) {
        if (
          this.props.tagList[index1].cat2[index2].title.indexOf(
            this.state.searchKeyword
          ) >= 0
        ) {
          const selId = this.props.tagList[index1].cat2[index2].id;
          const cat1Id = this.props.tagList[index1]._id;
          const cat2Id = this.props.tagList[index1].cat2[index2].id;
          const itemId = null;
          const title = getTagName(this.props.tagList, cat1Id, cat2Id, itemId);

          if (
            !this.props.tagList[index1].cat2[index2].items ||
            !this.props.tagList[index1].cat2[index2].items.length
          )
            tags.push({
              selId: selId,
              cat1Id: cat1Id,
              cat2Id: cat2Id,
              itemId: itemId,
              title1: title[0],
              title2: title[1]
            });
        }

        for (let index3 in this.props.tagList[index1].cat2[index2].items) {
          if (
            this.props.tagList[index1].cat2[index2].title.indexOf(
              this.state.searchKeyword
            ) >= 0
          ) {
            const selId = this.props.tagList[index1].cat2[index2].items[index3]
              .id;
            const cat1Id = this.props.tagList[index1]._id;
            const cat2Id = this.props.tagList[index1].cat2[index2].id;
            const itemId = this.props.tagList[index1].cat2[index2].items[index3]
              .id;
            const title = getTagName(
              this.props.tagList,
              cat1Id,
              cat2Id,
              itemId
            );
            tags.push({
              selId: selId,
              cat1Id: cat1Id,
              cat2Id: cat2Id,
              itemId: itemId,
              title1: title[0],
              title2: title[1]
            });
          }
        }
      }
    }

    return (
      <React.Fragment>
        {/* 詳細 start */}
        <Segment className="header-line" />
        <Segment className="link-area2" inverted>
          <Grid>
            <Grid.Row>
              <Grid.Column
                onClick={this.props.close}
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
                  onChange={this.onChangeSearchKeyword}
                  value={this.state.searchKeyword}
                  icon="search"
                  iconPosition="left"
                  inverted
                  placeholder="タグを検索"
                  className="font-family form-height"
                  style={{
                    width: "100%",
                    border: "solid 1px #d6d6d6",
                    marginLeft: "5px"
                  }}
                />
                <Image
                  onClick={() => {
                    this.setState({ searchKeyword: "" });
                  }}
                  src={window.$GLOBAL$.__SVG__["×ボタン（タグで絞り込む1）"]}
                  style={{ position: "absolute", right: "4px", bottom: "10px" }}
                />
              </Grid.Column>
              <Image
                src={window.$GLOBAL$.__SVG__["虫メガネ"]}
                style={{ left: "76px", bottom: "33px", width: "25.795px" }}
              />
            </Grid.Row>
          </Grid>
        </Segment>
        {/* 詳細 end */}

        {/* スクロールエリア start */}
        <Segment
          className="scroll-area"
          style={{ height: this.window_innerHeight - 102 + "px" }}
        >
          <Segment padded className="taglist-area">
            <Item.Group divided>
              {
                <For each="tag" index="index" of={tags}>
                  <Item key={index}>
                    <Grid className="tagitem">
                      <Grid.Row
                        onClick={() =>
                          this.onChangeCheckbox(
                            tag.selId,
                            tag.cat1Id,
                            tag.cat2Id,
                            tag.itemId
                          )
                        }
                      >
                        <Grid.Column
                          width={3}
                          className="middle aligned"
                          id="taglist-check"
                        >
                          {
                            <If
                              condition={
                                this.props.selectedTags.filter(
                                  s => s[0] == tag.selId
                                ).length
                              }
                            >
                              <Image src="/smsk-front/ブクマチェックon.svg" />
                            </If>
                          }
                          {
                            <If
                              condition={
                                !this.props.selectedTags.filter(
                                  s => s[0] == tag.selId
                                ).length
                              }
                            >
                              <Image src="/smsk-front/ブクマチェックoff.svg" />
                            </If>
                          }
                        </Grid.Column>
                        <Grid.Column width={13}>
                          <Item.Meta className="font-color font-family tagitem2-font">
                            {tag.title1}
                          </Item.Meta>
                          <Item.Content className="font-color font-family tagitem-font">
                            {tag.title2}
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

        {/* 下部エリア end */}
      </React.Fragment>
    );
  }
}

/// Custom - View - tracker
export const Tags_ListSearch = withTracker(props => {
  console.log("Tags_ListSearch props ================================", props);
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
    searchKeyword: props.searchKeyword,
    loading: loading
  };
  /// Custom - Collection - subscribe --
})(_Tags_ListSearch);
/// Custom - View - tracker --
