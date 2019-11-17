import React from "react";
import { Segment, Header, Grid, Button, Image } from "semantic-ui-react";

import { Tags_Edit } from "../lib/Tags/Edit";

export class View_Tags extends React.Component {
  "use strict";
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <React.Fragment>
        {/* 詳細 start */}
        <Segment className="header-line" />
        <Segment className="tag-link-area" inverted>
          <Grid>
            <Grid.Row>
              <Grid.Column
                onClick={this.props.close}
                width={2}
                style={{ left: "14px", zIndex: "10" }}
              >
                <Button className="close-area">
                  <Image src={window.$GLOBAL$.__SVG__["戻る"]} />
                </Button>
              </Grid.Column>
              <Grid.Column width={14} className="center aligned content header">
                <Header as="h2" className="font-color font-family header-font">
                  タグ一覧
                </Header>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Segment>
        {/* 詳細 end */}

        <Tags_Edit modHeight={210} showCreateButton={true} />
      </React.Fragment>
    );
  }
}
