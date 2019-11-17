import React from "react";
import { Session } from "meteor/session";
import { Random } from "meteor/random";
import { InputAutoSuggest } from "./InputAutoSuggest";
import { Segment, Grid, Header, Item, Image, Button } from "semantic-ui-react";

import { MapsSP_List_List_ComponentInfo } from "../../List/List";

import { Maps_Tags_Collection } from "@imports/api/Maps/Tags_Collection";

/// Sys - Network
import { Persister } from "@imports/api/lib/persist-method";
/// Sys - Network --

export class Tags_Insert extends React.Component {
  "use strict";

  constructor(props) {
    super(props);
    this.state = {
      suggestCat2: [],
      suggestItem: [],
      appendCat1Text: "",
      appendCat2Text: "",
      appendItemText: "",
      appendCat1Selected: -1,
      appendCat2Selected: -1,
      appendItemSelected: -1
    };

    this.tagList = [];

    /// Custom - Role - check permission
    this.ComponentInfo = MapsSP_List_List_ComponentInfo;
    /// Custom - Role - check permission --

    /// Custom - AutoForm - rebuild field
    this.Collection = Maps_Tags_Collection;
    this.Form_name = this.Collection._name;
    /// Custom - AutoForm - rebuild field --

    this.window_innerHeight = window.innerHeight;
  }

  /**
   *
   *
   * @memberof View_Tags
   */
  componentDidMount() {
    this.tagList = Maps_Tags_Collection.find({ _deleted: null }).map(c => c);
  }

  /**
   *
   *
   * @memberof View_Tags
   */
  onChangeCat1Text = text => {
    let appendCat1Selected = -1;
    let suggestCat2 = [];
    this.tagList.map((cat1, index) => {
      if (cat1.title == text) {
        appendCat1Selected = index;
        suggestCat2 = this.tagList[appendCat1Selected].cat2.map(
          cat2 => cat2.title
        );
      }
    });
    this.setState({
      appendCat1Text: text,
      appendCat1Selected: appendCat1Selected,
      suggestCat2: suggestCat2
    });
  };

  /**
   *
   *
   * @memberof View_Tags
   */
  onChangeCat2Text = text => {
    let appendCat2Selected = -1;
    let suggestItem = [];
    if (this.state.appendCat1Selected != -1) {
      this.tagList[this.state.appendCat1Selected].cat2.map((cat2, index) => {
        if (cat2.title == text) {
          appendCat2Selected = index;
          suggestItem = this.tagList[this.state.appendCat1Selected].cat2[
            appendCat2Selected
          ].items.map(item => item.title);
        }
      });
    }
    this.setState({
      appendCat2Text: text,
      appendCat2Selected: appendCat2Selected,
      suggestItem: suggestItem
    });
  };

  /**
   *
   *
   * @memberof View_Tags
   */
  onChangeItemText = text => {
    let appendItemSelected = -1;
    if (
      this.state.appendCat1Selected != -1 &&
      this.state.appendCat2Selected != -1
    ) {
      this.tagList[this.state.appendCat1Selected].cat2[
        this.state.appendCat2Selected
      ].items.map((item, index) => {
        if (item.title == text) {
          appendItemSelected = index;
        }
      });
    }
    this.setState({
      appendItemText: text,
      appendItemSelected: appendItemSelected
    });
  };

  /**
   *
   *
   * @memberof View_Tags
   */
  onClickSave = () => {
    if (
      this.state.appendCat1Selected != -1 &&
      this.state.appendCat2Selected != -1 &&
      this.state.appendItemSelected != -1
    ) {
      return;
    }

    let doc;

    if (this.state.appendCat1Selected == -1) {
      doc = {
        title: this.state.appendCat1Text,
        cat2: []
      };
    }

    if (
      this.state.appendCat1Selected != -1 &&
      this.state.appendCat2Selected == -1
    ) {
      doc = this.tagList[this.state.appendCat1Selected];
      if (!doc.cat2) {
        doc.cat2 = [];
      }
      doc.cat2.push({
        id: Random.id(15),
        title: this.state.appendCat2Text,
        items: []
      });
    }

    if (
      this.state.appendCat1Selected != -1 &&
      this.state.appendCat2Selected != -1 &&
      this.state.appendItemSelected == -1
    ) {
      doc = this.tagList[this.state.appendCat1Selected];
      if (!doc.cat2[this.state.appendCat2Selected].items) {
        doc.cat2[this.state.appendCat2Selected].items = [];
      }
      doc.cat2[this.state.appendCat2Selected].items.push({
        id: Random.id(15),
        title: this.state.appendItemText,
        color: "white"
      });
    }

    /// Sys - AutoForm - update
    const Users_Groups_id = Session.get("Users_Groups_id");

    console.assert(
      this.ComponentInfo("update"),
      "ComponentInfo('update') is undefined"
    );

    if (doc._id) {
      Persister.call(
        this.Form_name + ".update",
        Users_Groups_id,
        doc._id,
        doc,
        /// Sys - ApplicationError - init
        {
          methodCall: "update",
          proc: this.ComponentInfo("update").title,
          record: this.Collection.dispTitle(doc),
          callAt: Date.now()
        },
        /// Sys - ApplicationError - init --
        this.props.close
      );
    } else {
      Persister.call(
        this.Form_name + ".insert",
        Users_Groups_id,
        doc,
        /// Sys - ApplicationError - init
        {
          methodCall: "create",
          proc: this.ComponentInfo("create").title,
          record: this.Collection.dispTitle(doc),
          callAt: Date.now()
        },
        /// Sys - ApplicationError - init --
        this.props.close
      );
    }
    /// Sys - AutoForm - update --
  };

  /**
   *
   *
   * @memberof View_Tags
   */
  render() {
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
                  新規追加
                </Header>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Segment>
        {/* Link end */}

        <Segment
          className="scroll-area"
          style={{ height: this.window_innerHeight - 67 + "px" }}
        >
          <Segment
            padded
            style={{ padding: "28px", border: "none", borderRadius: "0" }}
          >
            <Item.Group divided>
              <Item className="item-padding">
                <Item.Meta className="font-family fam-item-font">
                  区分
                </Item.Meta>
                <InputAutoSuggest
                  onChange={value => this.onChangeCat1Text(value)}
                  value={this.state.appendCat1Text}
                  suggestions={this.tagList.map(c => c.title)}
                  style={{ padding: "0 14px" }}
                />

                {/* <Input
                  className="font-family"
                  inverted
                  placeholder="名簿分類"
                  style={{ width: "100%" }}
                /> */}
              </Item>

              <Item className="item-padding" style={{ border: "none" }}>
                <Item.Meta className="font-family fam-item-font">
                  分類
                </Item.Meta>
                <InputAutoSuggest
                  onChange={value => this.onChangeCat2Text(value)}
                  value={this.state.appendCat2Text}
                  suggestions={this.state.suggestCat2}
                  style={{ padding: "0 14px" }}
                />

                {/* <Input
                  className="font-family"
                   inverted
                   placeholder="港区"
                   style={{ width: "100%" }}
                 /> */}
              </Item>

              <Item className="item-padding" style={{ border: "none" }}>
                <Item.Meta className="font-family fam-item-font">
                  項目
                </Item.Meta>
                <InputAutoSuggest
                  onChange={value => this.onChangeItemText(value)}
                  value={this.state.appendItemText}
                  suggestions={this.state.suggestItem}
                  style={{ padding: "0 14px" }}
                />

                {/* <Input
                  className="font-family"
                  inverted
                  placeholder="企業名簿"
                  style={{ width: "100%" }}
                /> */}
              </Item>
            </Item.Group>
          </Segment>
        </Segment>

        {/* 下部エリア start */}
        <Segment basic className="center aligned content fam-fotter-area">
          <Grid>
            <Grid.Row>
              <Grid.Column
                width={16}
                className="right aligned content fam-fotter-style"
              >
                <Button
                  onClick={this.onClickSave}
                  className="font-family fam-fotter-btn fotter-btn-style"
                >
                  追加
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
