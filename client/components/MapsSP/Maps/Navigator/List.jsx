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
import { Input } from "semantic-ui-react";
import { Image } from "semantic-ui-react";

/**
 *
 *
 * @class ConsumersLocalCollection
 * @extends {MapsLocalCollection}
 */
export class NavigatorList extends React.Component {
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
        <Segment className="header-line" />
        <Segment className="link-area">
          <Grid centered className="center aligned content">
            <Grid.Row>
              <Grid.Column width={2} id="map12-width1">
                <Button className="close-area">
                  <Image src={window.$GLOBAL$.__SVG__["戻る"]} />
                </Button>
              </Grid.Column>

              <Grid.Column width={2} className="haribote" id="map12-width2">
                <Image src="/smsk-front/map12-1.png" style={{ top: "5px" }} />
                <Image
                  src="/smsk-front/map12-2.png"
                  style={{ top: "3px", left: "4px" }}
                />
              </Grid.Column>
              <Grid.Column
                width={11}
                className="haribote disabled"
                style={{ padding: "0px" }}
              >
                <Input
                  className="form-height"
                  placeholder="現在地"
                  style={{ marginBottom: "10px", width: "100%" }}
                />
                <Input
                  className="form-height"
                  readOnly
                  placeholder="目的地を入力..."
                  style={{ width: "100%" }}
                />
                <Image
                  src="/smsk-front/＞小.svg"
                  style={{ float: "right", bottom: "24px", right: "130px" }}
                />
              </Grid.Column>
              <Grid.Column className="haribote" style={{ padding: "0px" }}>
                <Image
                  src="/smsk-front/map12-3.svg"
                  style={{ top: "35px", left: "10px" }}
                />
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Segment>
      </React.Fragment>
    );
  }
  /// Custom - View - layout --
}
