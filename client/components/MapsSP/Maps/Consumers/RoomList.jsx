import React from "react";

import { Grid } from "semantic-ui-react";
import { MDBModalBody } from "mdbreact";

export class Maps_Consumers_View_RoomList extends React.Component {
  "use strict";

  constructor(props) {
    console.log(new Date().getTime(), "ConsumersLocalCollection constructor");
    super(props);

    this.window_innerHeight = window.innerHeight;
  }

  onClickRoom = room => {
    this.props.addRoom(room);
    this.props.close();
  };

  /* global index */
  /* global room */

  /**
   *
   *
   * @memberof _Maps_Consumers_View
   */
  render() {
    return (
      <MDBModalBody
        style={{
          overflow: "auto",
          maxHeight: this.window_innerHeight - 412 + "px"
        }}
      >
        <Grid>
          {
            <For each="room" index="index" of={this.props.clickedPoint.rooms}>
              <Grid.Row
                key={index}
                onClick={() => {
                  this.onClickRoom(room);
                }}
                style={{
                  borderBottom: "solid 1px #949AA3",
                  padding: "20px 0",
                  minHeight: "75px"
                }}
                className="font-family font-color"
              >
                <Grid.Column
                  width={3}
                  className="middle aligned"
                  style={{ paddingRight: "0px" }}
                >
                  {room.roomNo}
                </Grid.Column>
                <Grid.Column
                  width={13}
                  className="middle aligned"
                  style={{ paddingLeft: "0px", fontSize: "15px" }}
                >
                  {room.lastName} {room.shopName}
                </Grid.Column>
              </Grid.Row>
            </For>
          }
        </Grid>
      </MDBModalBody>
    );
  }
}
