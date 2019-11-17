//TODO logic

/// Sys - View
import React from "react";
import { withTracker } from "meteor/react-meteor-data";
/// Sys - View --

import { Edit_Office } from "./Edit_Office";

import { Segment, Grid, Button, Image, Header, Item } from "semantic-ui-react";

import { MDBModalW } from "../../lib/MDBModalW";

import {
  displayListField,
  displayValueField,
  displayField
} from "../../lib/utils";

/// Application

/// Custom - AutoForm - collection
import { Maps_Offices_Collection } from "@imports/api/Maps/Offices_Collection";
console.assert(
  Maps_Offices_Collection,
  "Maps_Offices_Collection is undefined."
);
/// Custom - AutoForm - collection --

class _View_Office extends React.Component {
  "use strict";

  constructor(props) {
    console.log(new Date().getTime(), "OfficesLocalCollection constructor");
    super(props);

    this.state = {
      showEdit_Office: false
    };

    this.window_innerHeight = window.innerHeight;
  }

  /**
   *
   *
   * @memberof MapsSP_List_List
   */
  onClickShowEdit_Office = () => {
    this.setState({ showEdit_Office: true });
  };

  /**
   *
   *
   * @returns
   * @memberof MapsSP_List_List
   */
  toggleEdit_Office = () => {
    this.setState({ showEdit_Office: !this.state.showEdit_Office });
  };

  /**
   *
   *
   * @memberof MapsSP_List_List
   */
  closeEdit_Office = () => {
    this.setState({ showEdit_Office: false });
  };

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
              <Grid.Column width={5}>
                <Button onClick={this.props.close} className="close-area">
                  <Image src={window.$GLOBAL$.__SVG__["戻る"]} />
                </Button>
              </Grid.Column>
              <Grid.Column width={8} className="center aligned content header">
                <Header
                  as="h2"
                  className="font-family header-font"
                  style={{ color: "white" }}
                >
                  事務所設定
                </Header>
              </Grid.Column>
              <Grid.Column width={3}>
                <Button
                  onClick={() => {
                    this.setState({ showEdit_Office: true });
                  }}
                  floated="right"
                  style={{
                    color: "#52a8ff",
                    backgroundColor: "white",
                    padding: "15px 0px 0px 0px"
                  }}
                >
                  編集
                </Button>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Segment>
        {/* Link end */}

        {/* スクロールエリア start */}
        <Segment
          className="scroll-area"
          style={{ height: this.window_innerHeight - 60 + "px" }}
        >
          {/* <Image
            onClick={() => {
              this.setState({ showDetail_Images: true });
            }}
            src={getImageLink(this.props.office)}
            size="small"
            centered
            style={{ width: "35%", marginBottom: "5px" }}
          /> */}

          {/* 詳細 start */}
          <Segment style={{ border: "none", margin: "0px", paddingTop: "0px" }}>
            <Grid centered className="center aligned content">
              <Grid.Column
                className="center aligned content"
                style={{ margin: "40px 0px" }}
              >
                <Item.Header as="a" className="font-family detail-header">
                  {this.props.office.name}
                </Item.Header>
                <Item.Meta className="font-family font-color detail-meta">
                  {this.props.office.kana}
                </Item.Meta>
              </Grid.Column>
            </Grid>
          </Segment>
          {/* 詳細 end */}

          {displayField(
            this.props.simpleSchema,
            this.props.office,
            "residenceAddress.address",
            ["residenceAddress.address.postalCode"],
            [
              "residenceAddress.address.prefecture",
              "residenceAddress.address.addressCity",
              "residenceAddress.address.addressTown",
              "residenceAddress.address.addressNumber",
              "residenceAddress.address.addressBuilding",
              "residenceAddress.address.addressRoomNo"
            ]
          )}

          {displayListField(
            this.props.simpleSchema,
            this.props.office,
            "contact.tels",
            (schema, _value) => (
              <div
                onClick={() => {
                  this.setState({
                    showTelephone: true,
                    telephoneList: [_value.tel]
                  });
                }}
                style={{ color: "cornflowerblue" }}
              >
                {_value.tel}
              </div>
            )
          )}

          {displayListField(
            this.props.simpleSchema,
            this.props.office,
            "contact.faxs",
            (schema, _value) => _value.fax
          )}

          {displayValueField(
            this.props.simpleSchema,
            this.props.office,
            "url",
            (schema, _value) => (
              <a href={_value} target="_blank">
                {_value}
              </a>
            )
          )}
        </Segment>

        <MDBModalW
          isOpen={this.state.showEdit_Office}
          toggle={this.toggleEdit_Office}
          fullHeight
          size="large"
          className="m-0 p-0"
          animation="left"
        >
          <Edit_Office close={this.closeEdit_Office} />
        </MDBModalW>
      </React.Fragment>
    );
  }
}

/// Custom - View - tracker
export const View_Office = withTracker(() => {
  /// Custom - Collection - subscribe
  const handles = [
    //    Meteor.subscribe(
    //      Maps_Offices_Collection._name,
    //      Session.get("Users_Groups_id")
    //    )
  ];
  const loading = handles.some(handle => !handle.ready());
  console.log(new Date().getTime(), "View_Offices loading", loading);

  const office = Maps_Offices_Collection.findOne({ _deleted: null }) || {};

  return {
    simpleSchema: Maps_Offices_Collection.simpleSchema(),
    office: office,
    loading: loading
  };
  /// Custom - Collection - subscribe --
})(_View_Office);
/// Custom - View - tracker --
