import React from "react";
import { Session } from "meteor/session";
import TextField from "@material-ui/core/TextField";
import { Segment, Grid, Header, Item, Image, Button } from "semantic-ui-react";

import { MapsSP_List_List_ComponentInfo } from "../../List/List";

import { Maps_Tags_Collection } from "@imports/api/Maps/Tags_Collection";

/// Sys - Network
import { Persister } from "@imports/api/lib/persist-method";
/// Sys - Network --

export class Tags_Update extends React.Component {
  "use strict";

  constructor(props) {
    super(props);

    this.state = {
      cat1Text: "",
      cat1Disabled: true,
      cat2Text: "",
      cat2Disabled: true,
      itemText: "",
      itemDisabled: true
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
    let cat1Text = "";
    let cat1Disabled = true;
    if (this.props.editCat1Id) {
      cat1Text = this.tagList.filter(c1 => c1._id == this.props.editCat1Id)[0]
        .title;
    }

    let cat2Text = "";
    let cat2Disabled = true;
    if (this.props.editCat2Id) {
      cat2Text = this.tagList
        .filter(c1 => c1._id == this.props.editCat1Id)[0]
        .cat2.filter(c2 => c2.id == this.props.editCat2Id)[0].title;
      if (!this.props.editItemId) {
        cat2Disabled = false;
      }
    }

    let itemText = "";
    let itemDisabled = true;
    if (this.props.editItemId) {
      itemText = this.tagList
        .filter(c1 => c1._id == this.props.editCat1Id)[0]
        .cat2.filter(c2 => c2.id == this.props.editCat2Id)[0]
        .items.filter(c3 => c3.id == this.props.editItemId)[0].title;
      itemDisabled = false;
    }

    this.setState({
      cat1Text: cat1Text,
      cat1Disabled: cat1Disabled,
      cat2Text: cat2Text,
      cat2Disabled: cat2Disabled,
      itemText: itemText,
      itemDisabled: itemDisabled
    });
  }

  /**
   *
   *
   * @memberof View_Tags
   */
  onChangeCat1Text = event => {
    this.setState({
      cat1Text: event.target.value
    });
  };

  /**
   *
   *
   * @memberof View_Tags
   */
  onChangeCat2Text = event => {
    this.setState({
      cat2Text: event.target.value
    });
  };

  /**
   *
   *
   * @memberof View_Tags
   */
  onChangeItemText = event => {
    this.setState({
      itemText: event.target.value
    });
  };

  /**
   *
   *
   * @memberof View_Tags
   */
  onClickSave = () => {
    if (
      !this.props.editCat1Id &&
      !this.props.editCat2Id &&
      !this.props.editItemId
    ) {
      return;
    }

    let doc;

    if (
      this.props.editCat1Id &&
      !this.props.editCat2Id &&
      !this.props.editItemId
    ) {
      doc = this.tagList.filter(c => c._id == this.props.editCat1Id)[0];
      doc.title = this.state.cat1Text;
    }

    if (
      this.props.editCat1Id &&
      this.props.editCat2Id &&
      !this.props.editItemId
    ) {
      doc = this.tagList.filter(c => c._id == this.props.editCat1Id)[0];
      doc.cat2.filter(
        c2 => c2.id == this.props.editCat2Id
      )[0].title = this.state.cat2Text;
    }

    if (
      this.props.editCat1Id &&
      this.props.editCat2Id &&
      this.props.editItemId
    ) {
      doc = this.tagList.filter(c => c._id == this.props.editCat1Id)[0];
      doc.cat2
        .filter(c2 => c2.id == this.props.editCat2Id)[0]
        .items.filter(
          i => i.id == this.props.editItemId
        )[0].title = this.state.itemText;
    }

    /// Sys - AutoForm - update
    const Users_Groups_id = Session.get("Users_Groups_id");

    console.assert(
      this.ComponentInfo("update"),
      "ComponentInfo('update') is undefined"
    );

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
                  編集
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
            style={{ padding: "14px", border: "none", borderRadius: "0" }}
          >
            <Item.Group divided>
              <Item className="fam-add-item1">
                <Item.Meta className="font-family fam-item-font">
                  区分
                </Item.Meta>
                <TextField
                  onChange={this.onChangeCat1Text}
                  value={this.state.cat1Text}
                  disabled={this.state.cat1Disabled}
                  style={{ padding: "0 14px" }}
                />
              </Item>

              <Item className="fam-add-item1" style={{ border: "none" }}>
                <Item.Meta className="font-family fam-item-font">
                  分類
                </Item.Meta>
                <TextField
                  onChange={this.onChangeCat2Text}
                  value={this.state.cat2Text}
                  disabled={this.state.cat2Disabled}
                  style={{ padding: "0 14px" }}
                />
              </Item>

              <Item className="fam-add-item1" style={{ border: "none" }}>
                <Item.Meta className="font-family fam-item-font">
                  項目
                </Item.Meta>
                <TextField
                  onChange={this.onChangeItemText}
                  value={this.state.itemText}
                  disabled={this.state.itemDisabled}
                  style={{ padding: "0 14px" }}
                />
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
                  修正
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
