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

/**
 *
 *
 * @class ConsumersLocalCollection
 * @extends {MapsLocalCollection}
 */
export class NavigatorPoint extends React.Component {
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
              border: "none",
              borderRadius: 0,
              boxShadow: "none",
              height: "63px"
            }}
          >
            <Grid columns="equal" centered>
              <Grid.Column width={2}>
                <Button className="button-return font-color">
                  <Icon name="chevron left" size="big" />
                </Button>
              </Grid.Column>
              <Grid.Column
                width={14}
                className="center aligned content"
                style={{
                  paddingTop: "15px",
                  paddingRight: "50px",
                  marginTop: "10px"
                }}
              >
                <Header
                  as="h2"
                  className="font-color font-family"
                  style={{ fontSize: "18px", marginBottom: "0px" }}
                >
                  目的地を選択
                </Header>
                <Header.Subheader className="font-family font-color">
                  移動 / ズームして調整します
                </Header.Subheader>
              </Grid.Column>
            </Grid>
          </Segment>
        </Segment>
      </React.Fragment>
    );
  }
  /// Custom - View - layout --
}
