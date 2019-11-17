/// Sys - AutoForm
import React from "react";
/// Sys - AutoForm --

/// Custom - AutoForm - collection
import { Maps_Pins_Collection } from "@imports/api/Maps/Pins_Collection";
console.assert(Maps_Pins_Collection, "Maps_Pins_Collection is undefined.");

import { Maps_PinCategorys_Collection } from "@imports/api/Maps/PinCategorys_Collection";
console.assert(
  Maps_PinCategorys_Collection,
  "Maps_PinCategorys_Collection is undefined."
);
/// Custom - AutoForm - collection --

// import start
import { Segment } from "semantic-ui-react";
import { Grid } from "semantic-ui-react";
import { Button } from "semantic-ui-react";

import { Header } from "semantic-ui-react";
import { Image } from "semantic-ui-react";

/**
 *
 *
 * @export
 * @class List
 * @extends {Update}
 */
export class View_TagSetting extends React.Component {
  "use strict";

  /// Custom - InfiniteScroll --
  /**
   *
   *
   * @returns
   * @memberof List
   */
  render() {
    console.log(new Date().getTime(), "List render");

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
              <Grid.Column
                width={10}
                style={{
                  display: "flex",
                  left: "25px",
                  top: "9px"
                }}
              >
                <Image src="/smsk-front/ピン-6.svg" />
                <Header as="h2" className="font-color font-family header-font">
                  タグ一括設定
                </Header>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Segment>
        {/* Link end */}
      </React.Fragment>
    );
  }
}
