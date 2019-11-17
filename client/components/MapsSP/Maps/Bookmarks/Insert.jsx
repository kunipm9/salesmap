//TODO logic

/// Sys - View
import React from "react";
import { Session } from "meteor/session";
import { Persister } from "@imports/api/lib/persist-method";
/// Sys - View --

/// Custom - AutoForm - collection
import { Maps_Bookmarks_Collection } from "@imports/api/Maps/Bookmarks_Collection";
console.assert(
  Maps_Bookmarks_Collection,
  "Maps_Bookmarks_Collection is undefined."
);
/// Custom - AutoForm - collection --

/// Application
import { Grid, Button, Input, Image } from "semantic-ui-react";
import { MDBModalHeader, MDBModalBody } from "mdbreact";

/// Application --

/**
 *
 *
 * @class BookmarksLocalCollection
 * @extends {MapsLocalCollection}
 */
export class BookmarksInsert extends React.Component {
  "use strict";

  /**
   *Creates an instance of _Maps_Bookmarks_View.
   * @param {*} props
   * @memberof _Maps_Bookmarks_View
   */
  constructor(props) {
    console.log(new Date().getTime(), "BookmarksLocalCollection constructor");
    super(props);

    this.state = {
      showBookmarksModal: false,
      addressString: "",
      posWorld: [],
      zoomLevel: 9,
      title: ""
    };

    this.updateCallback = this.updateCallback.bind(this);
  }

  /**
   *
   *
   * @memberof BookmarksInsert
   */
  componentDidMount() {
    this.getPos();
  }

  /**
   *
   *
   * @param {*} error
   * @memberof BookmarksLocalCollection
   */
  updateCallback(error) {
    /// Sys - AutoForm - update
    if (error) {
      Bert.alert({
        type: "danger",
        hideDelay: 10000,
        message: `Add failed: ${error.message}`
      });
    } else {
      Bert.alert({
        type: "success",
        hideDelay: 10000,
        message: "情報を更新しました"
      });
    }
    this.props.close();
    /// Sys - AutoForm - update --
  }

  /**
   *
   *
   * @memberof _Maps_Bookmarks_View
   */
  onChangeTitle = event => {
    this.setState({ title: event.target.value });
  };

  /// Custom - View - layout
  /**
   *
   *
   * @returns
   * @memberof _Maps_Bookmarks_View
   */
  render() {
    console.log(new Date().getTime(), "BookmarksLocalCollection render");

    /// Custom - Collection - subscribe
    if (this.props.loading) {
      return <span />;
    }
    /// Custom - Collection - subscribe --

    return (
      <React.Fragment>
        <MDBModalHeader>
          <p
            className="font-family bookmodal-font"
            id="modal-padding"
            style={{ textAlign: "center" }}
          >
            ブックマークに追加しますか？
          </p>
          <Input
            onChange={this.onChangeTitle}
            value={this.state.title}
            transparent
            placeholder="名前を入力"
            size="big"
            className="pinmodal-input"
            style={{ marginLeft: "25px", width: "240px" }}
          />
        </MDBModalHeader>
        <MDBModalBody
          id="modal-padding"
          style={{ borderBottom: "solid 1px #e4e4e4" }}
        >
          <Grid>
            <Grid.Row style={{ padding: "14px" }}>
              <Image
                src="/smsk-front/マップアイコン.svg"
                style={{ marginRight: "5px" }}
              />
              <p className="font-family bookmodal-font">
                {this.state.addressString}
              </p>
            </Grid.Row>
          </Grid>
        </MDBModalBody>
        <MDBModalBody id="modal-padding">
          <Grid>
            <Grid.Row>
              <Grid.Column width={5} id="bookmodal-rank">
                <p
                  className="font-family bookmodal-font"
                  style={{ marginLeft: "5px" }}
                >
                  【ランク】
                </p>
              </Grid.Column>
              <Grid.Column width={11} style={{ padding: "0px" }}>
                <p className="font-family bookmodal-font">
                  S,A,B,C,D,E,禁止,転居,未訪問,他党支持,不明
                </p>
              </Grid.Column>
            </Grid.Row>
            <Grid.Row>
              <Grid.Column width={4} id="bookmodal-tag">
                <p
                  className="font-family bookmodal-font"
                  style={{ marginLeft: "5px" }}
                >
                  【タグ】
                </p>
              </Grid.Column>
              <Grid.Column width={12} style={{ padding: "0px" }}>
                <p className="font-family bookmodal-font">2019,2018</p>
              </Grid.Column>
            </Grid.Row>
            <Grid.Row>
              <Grid.Column width={6} id="bookmodal-status">
                <p
                  className="font-family bookmodal-font"
                  style={{ marginLeft: "5px" }}
                >
                  【ステータス】
                </p>
              </Grid.Column>
              <Grid.Column width={10} style={{ padding: "0px" }}>
                <p className="font-family bookmodal-font">面会,在宅,留守</p>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </MDBModalBody>

        <MDBModalBody id="modal-padding3">
          <Grid>
            <Grid.Row className="modal-padding2">
              <Grid.Column width={8} className="bookmodal-btn-style">
                <Button
                  onClick={this.props.close}
                  className="font-famiy bookmodal-btn modal-no"
                >
                  いいえ
                </Button>
              </Grid.Column>
              <Grid.Column width={8} className="bookmodal-btn-style">
                <Button
                  onClick={this.savePos}
                  className="font-famiy bookmodal-btn modal-yes"
                >
                  はい
                </Button>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </MDBModalBody>
      </React.Fragment>
    );
  }
  /// Custom - View - layout --

  /**
   *
   *
   * @memberof _Maps_Bookmarks_View
   */
  getPos = () => {
    console.log(new Date().getTime(), "BookmarksLocalCollection savePos");

    const posWorld = window.$GLOBAL$.__MapView__.getCenterPos();
    const zoomLevel = window.$GLOBAL$.__MapView__.getZoomLevel();

    const data = {
      appid: "OY1oDxsr",
      output: "json",
      lat: posWorld[1],
      lon: posWorld[0],
      callback: "callback"
    };
    const REVERSE_GEOCODER_URL =
      "https://map.yahooapis.jp/geoapi/V1/reverseGeoCoder";
    $.ajax({
      type: "get",
      cache: false,
      url: REVERSE_GEOCODER_URL,
      dataType: "jsonp",
      data: data,
      jsonpCallback: "callback",
      success: resp => {
        if (
          resp.Feature.length == 0 ||
          !resp.Feature[0].Property ||
          !resp.Feature[0].Property.AddressElement
        ) {
          return;
        }

        // 住所情報
        const addrParts = resp.Feature[0].Property.AddressElement;
        let prefecture = "";
        let address1 = "";
        let address2 = "";
        let address3 = "";
        let address4 = "";
        if (addrParts[0]) {
          prefecture = addrParts[0].Name;
        }
        if (addrParts[1]) {
          address1 = addrParts[1].Name;
        }
        if (addrParts[2]) {
          address2 = addrParts[2].Name;
        }
        if (addrParts[3]) {
          address3 = addrParts[3].Name;
        }
        if (addrParts[4]) {
          address4 = addrParts[4].Name;
        }
        const addressString =
          prefecture + address1 + address2 + address3 + address4;

        this.setState({
          addressString: addressString,
          posWorld: posWorld,
          zoomLevel: zoomLevel
        });
      }
    });
  };

  savePos = () => {
    const doc = {
      title: this.state.title,
      coordinates: this.state.posWorld,
      zoomLevel: this.state.zoomLevel
    };
    const Users_Groups_id = Session.get("Users_Groups_id");
    Persister.call(
      "Maps_Bookmarks.insert",
      Users_Groups_id,
      doc,
      this.updateCallback
    );
  };
}
