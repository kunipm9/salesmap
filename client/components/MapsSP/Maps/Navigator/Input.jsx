//TODO logic

/// Sys - View
import React from "react";
/// Sys - View --

/// Sys - Map
import _ from "lodash";
/// Sys - Map --

// import start
import { Segment } from "semantic-ui-react";
import { Grid } from "semantic-ui-react";
import { Button } from "semantic-ui-react";
import { Icon } from "semantic-ui-react";
import { Input } from "semantic-ui-react";

/// Application
/// Application --

/**
 *
 *
 * @class ConsumersLocalCollection
 * @extends {MapsLocalCollection}
 */
export class NavigatorInput extends React.Component {
  "use strict";

  /**
   *Creates an instance of _Maps_Consumers_View.
   * @param {*} props
   * @memberof _Maps_Consumers_View
   */
  constructor(props) {
    console.log(new Date().getTime(), "ConsumersLocalCollection constructor");
    super(props);
  }

  /**
   *
   *
   * @memberof ConsumersLocalCollection
   */
  onClickMap = posWorld => {
    console.log(
      new Date().getTime(),
      "ConsumersLocalCollection onClickMap",
      posWorld
    );
    console.assert(posWorld, "posWorld is null");
  };

  /**
   *
   *
   * @memberof ConsumersLocalCollection
   */
  getPolygonCallback = (obj, posWorld, polygonTokyo) => {
    console.log(
      new Date().getTime(),
      "ConsumersLocalCollection getAddressCallback",
      obj,
      posWorld,
      polygonTokyo
    );

    if (!polygonTokyo) {
      return;
    }

    this.clickedPointPolygonTokyo = polygonTokyo;
    window.$GLOBAL$.__MapView__.requestReDrawMap();
  };

  /**
   *
   *
   * @memberof ConsumersLocalCollection
   */
  getAddressCallback = (obj, ret) => {
    console.log(
      new Date().getTime(),
      "ConsumersLocalCollection getAddressCallback",
      obj,
      ret
    );

    if (!ret) {
      return;
    }

    this.setState({ showUserListModal: true, clickedPoint: ret });
  };

  /**
   *
   *
   * @memberof ConsumersLocalCollection
   */
  getAddressCallbackError = () => {};

  /**
   *
   *
   * @memberof ConsumersLocalCollection
   */
  onRedrawMap = mapExtent => {
    console.log(new Date().getTime(), "View onRedrawMap");
    console.assert(mapExtent, "mapExtent is null");

    const pathPolygonTokyo = "residenceAddress.location.shape.polygonTokyo";
    this.mapExtent = mapExtent;

    const targetCollectionDocs = this.getDocsInMapView();

    if (!targetCollectionDocs) {
      console.log(
        new Date().getTime(),
        "ConsumersLocalCollection onRedrawMap ! targetCollectionDocs return"
      );
      return;
    }

    this.shapesTokyo = [];
    for (let idx in targetCollectionDocs) {
      this.shapesTokyo.push({
        polygon: _.get(targetCollectionDocs[idx], pathPolygonTokyo),
        flag: targetCollectionDocs[idx].flag
      });
    }

    if (this.clickedPointPolygonTokyo) {
      this.shapesTokyo.push({
        polygon: this.clickedPointPolygonTokyo,
        flag: "p"
      });
    }

    window.$GLOBAL$.__MapView__.drawBuildings(this.shapesTokyo);
  };

  /**
   *
   *
   * @param {*} error
   * @memberof ConsumersLocalCollection
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
    /// Sys - AutoForm - update --
  }

  /// Custom - View - layout
  /**
   *
   *
   * @returns
   * @memberof _Maps_Consumers_View
   */
  render() {
    console.log(new Date().getTime(), "ConsumersLocalCollection render");

    /// Custom - Collection - subscribe
    if (this.props.loading) {
      return <span />;
    }
    /// Custom - Collection - subscribe --

    return (
      <React.Fragment>
        <Segment
          style={{
            margin: 0,
            border: "none",
            padding: "0px",
            height: "4px",
            backgroundColor: "#2e3d51"
          }}
        ></Segment>
        <Segment
          className="list-search"
          style={{ border: "none", marginTop: "0px" }}
        >
          <Segment
            style={{
              marginBottom: "0px",
              border: "none",
              borderRadius: 0,
              boxShadow: "none"
            }}
          >
            <Grid columns="equal" centered>
              <Grid.Row>
                <Grid.Column width={16} style={{ marginBottom: "20px" }}>
                  <Input
                    icon="chevron left"
                    className="font-color font-family form-height"
                    iconPosition="left"
                    placeholder="目的地を入力..."
                    style={{ width: "100%" }}
                  />
                </Grid.Column>
                <Grid.Column width={16}>
                  <Button
                    icon="map marker alternate"
                    className="font-color font-family form-height"
                    style={{
                      width: "100%",
                      fontSize: "16px",
                      boxShadow: "-1px 4px 3px #EEEEEE",
                      backgroundColor: "white",
                      border: "solid 1px #e6e6e7",
                      padding: "20px 24px",
                      height: "60px"
                    }}
                  >
                    <Icon
                      name="map marker alternate"
                      size="large"
                      style={{ marginBottom: "5px" }}
                    />
                    地図上で選択
                  </Button>
                </Grid.Column>
              </Grid.Row>
            </Grid>
          </Segment>
        </Segment>
      </React.Fragment>
    );
  }
  /// Custom - View - layout --
}
