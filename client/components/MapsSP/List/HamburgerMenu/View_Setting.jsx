//TODO logic

/// Sys - View
import React from "react";
import { withTracker } from "meteor/react-meteor-data";
/// Sys - View --

import {
  Segment,
  Grid,
  Button,
  Header,
  Image,
  Item,
  Dropdown,
  Label
} from "semantic-ui-react";
/// Application

/// Custom - AutoForm - collection
import { Maps_Bookmarks_Collection } from "@imports/api/Maps/Bookmarks_Collection";
console.assert(
  Maps_Bookmarks_Collection,
  "Maps_Bookmarks_Collection is undefined."
);
/// Custom - AutoForm - collection --

class _View_Setting extends React.Component {
  "use strict";

  constructor(props) {
    console.log(new Date().getTime(), "BookmarksLocalCollection constructor");
    super(props);

    this.state = {};

    this.window_innerHeight = window.innerHeight;
  }

  render() {
    console.log(new Date().getTime(), "View_Setting render");

    /// Custom - Collection - subscribe
    if (this.props.loading) {
      return <span />;
    }
    /// Custom - Collection - subscribe --

    return (
      <React.Fragment>
        {/* Link start */}
        <Segment className="header-line" />
        <Segment className="link-area5">
          <Grid centered className="center aligned content">
            <Grid.Row className="header-row">
              <Grid.Column width={2}>
                <Button onClick={this.props.close} className="close-area">
                  <Image src={window.$GLOBAL$.__SVG__["戻る"]} />
                </Button>
              </Grid.Column>
              <Grid.Column width={14} className="center aligned content header">
                <Header as="h2" className="font-color font-family header-font">
                  その他設定
                </Header>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Segment>
        {/* Link end */}

        {/* スクロールエリア start */}
        <Segment
          className="scroll-area"
          style={{ height: this.window_innerHeight - 0 + "px" }}
        >
          <Segment
            padded
            style={{
              padding: "14px 14px 130px",
              marginBottom: "50px",
              border: "none",
              borderRadius: "0"
            }}
          >
            <Item.Group divided>
              <Item style={{ border: "none" }}>
                <Item.Meta className="font-family map6-pin-meta">
                  カレンダー設定
                </Item.Meta>
                <Dropdown
                  placeholder="日曜始まり"
                  search
                  selection
                  style={{ width: "65%" }}
                />
              </Item>

              <Item style={{ borderTop: "solid 1px #bebebe57" }}>
                <Item.Meta className="font-family map6-pin-meta">
                  面会ステータス設定
                </Item.Meta>
                <Dropdown
                  placeholder="議員・面会・在宅・留守"
                  search
                  selection
                  style={{ width: "65%" }}
                />
              </Item>

              <Item style={{ borderTop: "solid 1px #bebebe57" }}>
                <Item.Meta
                  className="font-family map6-pin-meta"
                  style={{ marginBottom: "10px" }}
                >
                  枚数
                </Item.Meta>
                <Item.Meta className="font-family map6-pin-meta">
                  タグ(10/10個)
                </Item.Meta>
                <Grid style={{ margin: "5px 0px" }}>
                  <Label className="font-family map11-tag-label">
                    <p className="map11-tag-p">党員</p>
                    <Image
                      src="/smsk-front/タグ削除.svg"
                      id="map11-tag-delite"
                    />
                  </Label>
                  <Label className="font-family map11-tag-label">
                    <p className="map11-tag-p">関東獣医師学会</p>
                    <Image
                      src="/smsk-front/タグ削除.svg"
                      id="map11-tag-delite"
                    />
                  </Label>
                  <Label className="font-family map11-tag-label">
                    <p className="map11-tag-p">日本医師会</p>
                    <Image
                      src="/smsk-front/タグ削除.svg"
                      id="map11-tag-delite"
                    />
                  </Label>
                  <Label className="font-family map11-tag-label">
                    <p className="map11-tag-p">2019年</p>
                    <Image
                      src="/smsk-front/タグ削除.svg"
                      id="map11-tag-delite"
                    />
                  </Label>
                  <Label className="font-family map11-tag-label">
                    <p className="map11-tag-p">東京土建</p>
                    <Image
                      src="/smsk-front/タグ削除.svg"
                      id="map11-tag-delite"
                    />
                  </Label>
                  <Label className="font-family map11-tag-label">
                    <p className="map11-tag-p">定期報告会</p>
                    <Image
                      src="/smsk-front/タグ削除.svg"
                      id="map11-tag-delite"
                    />
                  </Label>
                  <Label className="font-family map11-tag-label">
                    <p className="map11-tag-p">後援会第一支部</p>
                    <Image
                      src="/smsk-front/タグ削除.svg"
                      id="map11-tag-delite"
                    />
                  </Label>
                  <Label className="font-family map11-tag-label">
                    <p className="map11-tag-p">新年交賀会</p>
                    <Image
                      src="/smsk-front/タグ削除.svg"
                      id="map11-tag-delite"
                    />
                  </Label>
                  <Label className="font-family map11-tag-label">
                    <p className="map11-tag-p">後援会役員</p>
                    <Image
                      src="/smsk-front/タグ削除.svg"
                      id="map11-tag-delite"
                    />
                  </Label>
                  <Label className="font-family map11-tag-label">
                    <p className="map11-tag-p">新春ゴルフコンペ</p>
                    <Image
                      src="/smsk-front/タグ削除.svg"
                      id="map11-tag-delite"
                    />
                  </Label>
                </Grid>
              </Item>

              <Item style={{ border: "none", paddingBottom: "30px" }}>
                <Item.Meta className="font-family map6-pin-meta">
                  ピン(10/10個)
                </Item.Meta>
                <Grid style={{ margin: "5px 0px" }}>
                  <Label className="font-family map11-tag-label">
                    <p className="map11-tag-p">自陣</p>
                    <Image
                      src="/smsk-front/タグ削除.svg"
                      id="map11-tag-delite"
                    />
                  </Label>
                  <Label className="font-family map11-tag-label">
                    <p className="map11-tag-p">自陣&gt;単体</p>
                    <Image
                      src="/smsk-front/タグ削除.svg"
                      id="map11-tag-delite"
                    />
                  </Label>
                  <Label className="font-family map11-tag-label">
                    <p className="map11-tag-p">自陣&gt;候補</p>
                    <Image
                      src="/smsk-front/タグ削除.svg"
                      id="map11-tag-delite"
                    />
                  </Label>
                  <Label className="font-family map11-tag-label">
                    <p className="map11-tag-p">自陣&gt;交換</p>
                    <Image
                      src="/smsk-front/タグ削除.svg"
                      id="map11-tag-delite"
                    />
                  </Label>
                  <Label className="font-family map11-tag-label">
                    <p className="map11-tag-p">自陣&gt;二連</p>
                    <Image
                      src="/smsk-front/タグ削除.svg"
                      id="map11-tag-delite"
                    />
                  </Label>
                  <Label className="font-family map11-tag-label">
                    <p className="map11-tag-p">昼食</p>
                    <Image
                      src="/smsk-front/タグ削除.svg"
                      id="map11-tag-delite"
                    />
                  </Label>
                  <Label className="font-family map11-tag-label">
                    <p className="map11-tag-p">対立候補</p>
                    <Image
                      src="/smsk-front/タグ削除.svg"
                      id="map11-tag-delite"
                    />
                  </Label>
                  <Label className="font-family map11-tag-label">
                    <p className="map11-tag-p">対立候補&gt;高橋</p>
                    <Image
                      src="/smsk-front/タグ削除.svg"
                      id="map11-tag-delite"
                    />
                  </Label>
                  <Label className="font-family map11-tag-label">
                    <p className="map11-tag-p">陳情地点</p>
                    <Image
                      src="/smsk-front/タグ削除.svg"
                      id="map11-tag-delite"
                    />
                  </Label>
                  <Label className="font-family map11-tag-label">
                    <p className="map11-tag-p">通行止め</p>
                    <Image
                      src="/smsk-front/タグ削除.svg"
                      id="map11-tag-delite"
                    />
                  </Label>
                </Grid>
              </Item>
            </Item.Group>
          </Segment>
        </Segment>
        {/* スクロールエリア end */}

        {/* 下部エリア start */}
        <Segment basic className="center aligned content fam-fotter-area">
          <Grid>
            <Grid.Row>
              <Grid.Column
                width={16}
                className="aligned content fam-fotter-style"
              >
                <Button className="font-family fam-fotter-btn fotter-btn-style">
                  保存
                </Button>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Segment>
        {/* 下部エリア end */}
      </React.Fragment>
    );
  }
}

/// Custom - View - tracker
export const View_Setting = withTracker(() => {
  /// Custom - Collection - subscribe
  const handles = [
    //    Meteor.subscribe(
    //      Maps_Bookmarks_Collection._name,
    //      Session.get("Users_Groups_id")
    //    )
  ];
  const loading = handles.some(handle => !handle.ready());
  console.log(new Date().getTime(), "Bookmark loading", loading);

  return {
    bookmarks: Maps_Bookmarks_Collection.find(),
    loading: loading
  };
  /// Custom - Collection - subscribe --
})(_View_Setting);
/// Custom - View - tracker --
