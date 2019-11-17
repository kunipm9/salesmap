//TODO logic

/// Sys - View
import React from "react";
import { withTracker } from "meteor/react-meteor-data";
/// Sys - View --

import { Segment, Grid, Button, Header, Image, Item } from "semantic-ui-react";
/// Application

/// Custom - AutoForm - collection
import { Maps_Bookmarks_Collection } from "@imports/api/Maps/Bookmarks_Collection";
console.assert(
  Maps_Bookmarks_Collection,
  "Maps_Bookmarks_Collection is undefined."
);
/// Custom - AutoForm - collection --

class _View_Whatsnew extends React.Component {
  "use strict";

  constructor(props) {
    console.log(new Date().getTime(), "BookmarksLocalCollection constructor");
    super(props);

    this.state = {};

    this.window_innerHeight = window.innerHeight;
  }

  render() {
    console.log(new Date().getTime(), "View_Whatsnew render");

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
                  おしらせ
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
          <Segment padded className="fam-add-area haribote">
            <Item.Group divided>
              <Item className="reminder-item">
                <Grid>
                  <Grid.Row style={{ top: "5px" }}>
                    <Grid.Column
                      width={3}
                      className="middle aligned notice-item1"
                    >
                      <Item.Meta className="font-family font-color reminder-meta">
                        5/10
                      </Item.Meta>
                    </Grid.Column>
                    <Grid.Column width={10} className="notice-item2">
                      <Item.Meta className="font-family font-color reminder-meta">
                        システムメンテナンス
                      </Item.Meta>
                    </Grid.Column>
                    <Grid.Column width={3} className="reminder-btn-style">
                      <Button
                        className="ui button reminder-btn"
                        floated="right"
                      >
                        <Image src="/smsk-front/＞（グレー）.svg" />
                      </Button>
                    </Grid.Column>
                  </Grid.Row>
                </Grid>
              </Item>

              <Item className="reminder-item">
                <Grid>
                  <Grid.Row>
                    <Grid.Column
                      width={3}
                      className="middle aligned notice-item1"
                    >
                      <Item.Meta className="font-family font-color reminder-meta">
                        5/10
                      </Item.Meta>
                    </Grid.Column>
                    <Grid.Column width={10} className="notice-item2">
                      <Item.Meta className="font-family font-color reminder-meta">
                        システムメンテナンス
                      </Item.Meta>
                    </Grid.Column>
                    <Grid.Column width={3} className="reminder-btn-style">
                      <Button
                        className="ui button reminder-btn"
                        floated="right"
                      >
                        <Image src="/smsk-front/V（グレー）.svg" />
                      </Button>
                    </Grid.Column>
                  </Grid.Row>

                  <Grid.Row className="reminder-open2">
                    <Grid.Column
                      width={16}
                      className="reminder-padding reminder-meta"
                    >
                      <Item.Meta className="font-family font-color">
                        <Button className="reminder-meta-btn">東森 友暉</Button>{" "}
                        様の誕生日です。
                      </Item.Meta>
                      <Item.Meta className="font-family font-color reminder-meta">
                        <Button className="reminder-meta-btn">東森 友暉</Button>{" "}
                        様の誕生日です。
                      </Item.Meta>
                    </Grid.Column>
                  </Grid.Row>
                </Grid>
              </Item>
            </Item.Group>
          </Segment>
        </Segment>
        {/* スクロールエリア end */}
      </React.Fragment>
    );
  }
}

/// Custom - View - tracker
export const View_Whatsnew = withTracker(() => {
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
})(_View_Whatsnew);
/// Custom - View - tracker --
