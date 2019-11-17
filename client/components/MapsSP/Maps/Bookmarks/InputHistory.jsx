/// Sys - View
import React from "react";
import { Session } from "meteor/session";
/// Sys - View --

import {
  Segment,
  Grid,
  Button,
  Image,
  Item,
  Input,
  Icon
} from "semantic-ui-react";
/// Application

export class InputHistory extends React.Component {
  "use strict";

  /**
   *Creates an instance of InputHistory.
   * @param {*} props
   * @memberof InputHistory
   */
  constructor(props) {
    console.log(new Date().getTime(), "BookmarksLocalCollection constructor");
    super(props);

    this.state = {
      address: "",
      inputHistory: Session.get("MapsSP.Maps.inputHistory") || []
    };

    this.window_innerHeight = window.innerHeight;
  }

  /**
   *
   *
   * @memberof InputHistory
   */
  onChangeInput = event => {
    this.setState({ address: event.target.value });
  };

  /**
   *
   *
   * @memberof InputHistory
   */
  onClickAddress = address => {
    address = address.trim();
    if (!address) {
      return;
    }
    const inputHistory = this.state.inputHistory.filter(a => a.trim());
    inputHistory.push(address);
    if (inputHistory.length > 20) {
      inputHistory.shift();
    }
    Session.setPersistent("MapsSP.Maps.inputHistory", inputHistory);
    this.setState({ inputHistory: inputHistory });

    this.props.close();
    this.props.onSearchAddress(address);
  };

  /**
   *
   *
   * @memberof InputHistory
   */
  onClickSelAddress = address => {
    this.props.close();
    this.props.onSearchAddress(address);
  };

  onKeyDownKeyword = event => {
    const ENTER = 13;
    if (event.keyCode == ENTER) {
      this.onClickAddress(this.state.address);
    }
  };

  /* global index */
  /* global address */

  render() {
    console.log(new Date().getTime(), "InputHistory render");

    /// Custom - Collection - subscribe
    if (this.props.loading) {
      return <span />;
    }
    /// Custom - Collection - subscribe --

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
                  onChange={this.onChangeInput}
                  onKeyDown={this.onKeyDownKeyword}
                  value={this.state.address}
                  icon="search"
                  iconPosition="left"
                  inverted
                  placeholder="履歴を検索"
                  className="font-family form-height"
                  style={{
                    width: "100%",
                    border: "solid 1px #d6d6d6",
                    marginLeft: "5px"
                  }}
                />
                {/* XDのデザインミス・消さないで */}
                {/* <Button
                  onClick={() => {
                    this.onClickAddress(this.state.address);
                  }}
                >
                  検索
                </Button> */}
              </Grid.Column>
              {/* <Image
                className="form-clear"
                src={window.$GLOBAL$.__SVG__["×ボタン（タグで絞り込む1）"]}
              /> */}
              <Image
                src={window.$GLOBAL$.__SVG__["虫メガネ"]}
                style={{ left: "73px", bottom: "31px", width: "25.795px" }}
              />
            </Grid.Row>
          </Grid>
        </Segment>
        {/* 詳細 end */}

        {/* スクロールエリア start */}
        <Segment
          className="scroll-area"
          style={{ height: this.window_innerHeight - 0 + "px" }}
        >
          <Segment padded className="fam-add-area">
            <Item.Group divided>
              <Item>
                <Button
                  onClick={this.props.onClickBookmarksView}
                  style={{ backgroundColor: "transparent" }}
                >
                  <Grid>
                    <Grid.Row>
                      <Grid.Column width={3}>
                        <Image src="/smsk-front/ブックマーク（グレー）.svg" />
                      </Grid.Column>
                      <Grid.Column width={13} style={{ padding: "0px" }}>
                        <Item.Meta className="font-family font-color map2-meta">
                          ブックマークを表示
                        </Item.Meta>
                      </Grid.Column>
                    </Grid.Row>
                  </Grid>
                </Button>
              </Item>

              <Item>
                <Grid>
                  <Grid.Row style={{ padding: "5px 0px" }}>
                    <Grid.Column width={16}>
                      <Item.Header
                        className="left floated font-color font-family"
                        style={{ fontSize: "13px", paddingLeft: "20px" }}
                      >
                        履歴
                      </Item.Header>
                    </Grid.Column>
                  </Grid.Row>
                </Grid>
              </Item>

              {
                <For each="address" index="index" of={this.state.inputHistory}>
                  <Item
                    key={index}
                    style={{
                      borderTop: "none",
                      borderBottom: "1px solid rgba(34,36,38,.15)"
                    }}
                  >
                    <Button
                      onClick={() => {
                        this.onClickSelAddress(address);
                      }}
                      style={{ backgroundColor: "transparent" }}
                    >
                      <Grid>
                        <Grid.Row>
                          <Grid.Column width={3}>
                            <Image
                              src="/smsk-front/過去履歴.svg"
                              className="map2-icon"
                            />
                          </Grid.Column>
                          <Grid.Column width={13} style={{ padding: "0px" }}>
                            <Item.Meta className="font-family font-color map2-meta">
                              {address}
                            </Item.Meta>
                          </Grid.Column>
                        </Grid.Row>
                      </Grid>
                    </Button>
                  </Item>
                </For>
              }
              <Item style={{ borderTop: "none" }}>
                <Button style={{ backgroundColor: "transparent" }}>
                  <Grid>
                    <Grid.Row>
                      <Grid.Column width={3}>
                        <Icon
                          name="arrow right"
                          size="big"
                          style={{ fontSize: "30px" }}
                        />
                      </Grid.Column>
                      <Grid.Column width={13} style={{ padding: "0px" }}>
                        <Item.Meta className="font-family font-color map2-meta">
                          もっと見る
                        </Item.Meta>
                      </Grid.Column>
                    </Grid.Row>
                  </Grid>
                </Button>
              </Item>
            </Item.Group>
          </Segment>
        </Segment>
      </React.Fragment>
    );
  }
}
