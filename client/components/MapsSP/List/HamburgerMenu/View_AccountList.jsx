//TODO logic

/// Sys - View
import React from "react";
import { withTracker } from "meteor/react-meteor-data";
/// Sys - View --

import {
  Segment,
  Grid,
  Button,
  Icon,
  Image,
  Header,
  Item
} from "semantic-ui-react";
/// Application

/// Custom - AutoForm - collection
import { Maps_Bookmarks_Collection } from "@imports/api/Maps/Bookmarks_Collection";
console.assert(
  Maps_Bookmarks_Collection,
  "Maps_Bookmarks_Collection is undefined."
);
/// Custom - AutoForm - collection --

class _View_AccountList extends React.Component {
  "use strict";

  constructor(props) {
    console.log(new Date().getTime(), "BookmarksLocalCollection constructor");
    super(props);

    this.state = {};

    this.window_innerHeight = window.innerHeight;
  }

  render() {
    console.log(new Date().getTime(), "View_AccountList render");

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
                  登録アカウント一覧
                </Header>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Segment>
        {/* Link end */}

        {/* スクロールエリア start */}
        <Segment
          className="scroll-area"
          style={{ maxHeight: this.window_innerHeight - 162 + "px" }}
        >
          <Segment padded className="accountlist-area">
            <Item.Group divided>
              <Item style={{ marginLeft: "40px" }}>
                <Grid className="font-family font-color">
                  <Grid.Row style={{ paddingBottom: "0px" }}>
                    <Grid.Column
                      width={7}
                      style={{ paddingRight: "0px", marginRight: "20px" }}
                    >
                      ログインアカウント数
                    </Grid.Column>
                    <Grid.Column
                      width={7}
                      className="left floated"
                      style={{ paddingLeft: "0px" }}
                    >
                      1人 / 5人
                    </Grid.Column>
                  </Grid.Row>
                  <Grid.Row style={{ paddingTop: "5px" }}>
                    <Grid.Column
                      width={7}
                      id="map-account"
                      style={{ paddingRight: "0px", marginRight: "20px" }}
                    >
                      マップアカウント数
                    </Grid.Column>
                    <Grid.Column
                      width={7}
                      className="left floated"
                      style={{ paddingLeft: "0px" }}
                    >
                      1個 / 5個
                    </Grid.Column>
                  </Grid.Row>
                </Grid>
              </Item>

              <Item style={{ paddingTop: "21px" }}>
                <Grid>
                  <Grid.Row>
                    <Grid.Column width={3}>
                      <Image
                        src="/smsk-front/登録アカウント一覧用プロフアイコン.svg"
                        size="large"
                        avatar
                        style={{ marginTop: "7px" }}
                      />
                    </Grid.Column>
                    <Grid.Column width={13}>
                      <Item.Meta>ユーザー名＜管理者＞</Item.Meta>
                      <Item.Meta>メールアドレス</Item.Meta>
                    </Grid.Column>
                  </Grid.Row>
                </Grid>
              </Item>

              <Item style={{ paddingTop: "21px" }}>
                <Grid>
                  <Grid.Row>
                    <Grid.Column width={3}>
                      <Image
                        src="/smsk-front/登録アカウント一覧用プロフアイコン本人.svg"
                        size="large"
                        avatar
                        style={{ marginTop: "7px" }}
                      />
                    </Grid.Column>
                    <Grid.Column width={13}>
                      <Item.Meta>ユーザー名＜ログイン中＞</Item.Meta>
                      <Item.Meta>メールアドレス</Item.Meta>
                    </Grid.Column>
                  </Grid.Row>
                </Grid>
              </Item>

              <Item style={{ paddingTop: "21px" }}>
                <Grid>
                  <Grid.Row>
                    <Grid.Column width={3}>
                      <Image
                        src="/smsk-front/登録アカウント一覧用プロフアイコン.svg"
                        size="large"
                        avatar
                        style={{ marginTop: "7px" }}
                      />
                    </Grid.Column>
                    <Grid.Column width={13}>
                      <Item.Meta>ユーザー名</Item.Meta>
                      <Item.Meta>メールアドレス</Item.Meta>
                    </Grid.Column>
                  </Grid.Row>
                </Grid>
              </Item>

              <Item style={{ paddingTop: "21px" }}>
                <Grid>
                  <Grid.Row>
                    <Grid.Column width={3}>
                      <Image
                        src="/smsk-front/登録アカウント一覧用プロフアイコン.svg"
                        size="large"
                        avatar
                        style={{ marginTop: "7px" }}
                      />
                    </Grid.Column>
                    <Grid.Column width={13}>
                      <Item.Meta>ユーザー名</Item.Meta>
                      <Item.Meta>メールアドレス</Item.Meta>
                    </Grid.Column>
                  </Grid.Row>
                </Grid>
              </Item>

              <Item style={{ paddingTop: "21px" }}>
                <Grid>
                  <Grid.Row>
                    <Grid.Column width={3}>
                      <Image
                        src="/smsk-front/登録アカウント一覧用プロフアイコン.svg"
                        size="large"
                        avatar
                        style={{ marginTop: "7px" }}
                      />
                    </Grid.Column>
                    <Grid.Column width={13}>
                      <Item.Meta>ユーザー名</Item.Meta>
                      <Item.Meta>メールアドレス</Item.Meta>
                    </Grid.Column>
                  </Grid.Row>
                </Grid>
              </Item>

              <Item style={{ paddingTop: "21px" }}>
                <Grid>
                  <Grid.Row>
                    <Grid.Column width={3}>
                      <Image
                        src="/smsk-front/登録アカウント一覧用プロフアイコン.svg"
                        size="large"
                        avatar
                        style={{ marginTop: "7px" }}
                      />
                    </Grid.Column>
                    <Grid.Column width={13}>
                      <Item.Meta>ユーザー名</Item.Meta>
                      <Item.Meta>メールアドレス</Item.Meta>
                    </Grid.Column>
                  </Grid.Row>
                </Grid>
              </Item>

              <Item style={{ paddingTop: "21px" }}>
                <Grid>
                  <Grid.Row>
                    <Grid.Column width={3}>
                      <Image
                        src="/smsk-front/登録アカウント一覧用プロフアイコン.svg"
                        size="large"
                        avatar
                        style={{ marginTop: "7px" }}
                      />
                    </Grid.Column>
                    <Grid.Column width={13}>
                      <Item.Meta>ユーザー名</Item.Meta>
                      <Item.Meta>メールアドレス</Item.Meta>
                    </Grid.Column>
                  </Grid.Row>
                </Grid>
              </Item>

              <Item style={{ paddingTop: "21px" }}>
                <Grid>
                  <Grid.Row>
                    <Grid.Column width={3}>
                      <Image
                        src="/smsk-front/登録アカウント一覧用プロフアイコン.svg"
                        size="large"
                        avatar
                        style={{ marginTop: "7px" }}
                      />
                    </Grid.Column>
                    <Grid.Column width={13}>
                      <Item.Meta>ユーザー名</Item.Meta>
                      <Item.Meta>メールアドレス</Item.Meta>
                    </Grid.Column>
                  </Grid.Row>
                </Grid>
              </Item>

              <Item style={{ paddingTop: "21px" }}>
                <Grid>
                  <Grid.Row>
                    <Grid.Column width={3}>
                      <Image
                        src="/smsk-front/登録アカウント一覧用プロフアイコン.svg"
                        size="large"
                        avatar
                        style={{ marginTop: "7px" }}
                      />
                    </Grid.Column>
                    <Grid.Column width={13}>
                      <Item.Meta>ユーザー名</Item.Meta>
                      <Item.Meta>メールアドレス</Item.Meta>
                    </Grid.Column>
                  </Grid.Row>
                </Grid>
              </Item>

              <Item style={{ paddingTop: "21px" }}>
                <Grid>
                  <Grid.Row>
                    <Grid.Column width={3}>
                      <Image
                        src="/smsk-front/登録アカウント一覧用プロフアイコン.svg"
                        size="large"
                        avatar
                        style={{ marginTop: "7px" }}
                      />
                    </Grid.Column>
                    <Grid.Column width={13}>
                      <Item.Meta>ユーザー名</Item.Meta>
                      <Item.Meta>メールアドレス</Item.Meta>
                    </Grid.Column>
                  </Grid.Row>
                </Grid>
              </Item>

              <Item style={{ paddingTop: "21px" }}>
                <Grid>
                  <Grid.Row>
                    <Grid.Column width={3}>
                      <Image
                        src="/smsk-front/登録アカウント一覧用プロフアイコン.svg"
                        size="large"
                        avatar
                        style={{ marginTop: "7px" }}
                      />
                    </Grid.Column>
                    <Grid.Column width={13}>
                      <Item.Meta>ユーザー名</Item.Meta>
                      <Item.Meta>メールアドレス</Item.Meta>
                    </Grid.Column>
                  </Grid.Row>
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
                <Button className="font-family fam-fotter-btn fotter-btn-style centered haribote">
                  <Icon name="sync alternate" />
                  地図権限を切り替える
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
export const View_AccountList = withTracker(() => {
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
})(_View_AccountList);
/// Custom - View - tracker --
