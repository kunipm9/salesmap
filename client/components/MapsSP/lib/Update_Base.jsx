/// Sys - AutoForm
import React from "react";
import AutoForm from "uniforms/AutoForm";
import SubmitField from "@imports/ui/uniforms/SubmitField";
import Update from "@imports/ui/crud/Update";
/// Sys - AutoForm --

// import start
import { Segment } from "semantic-ui-react";
import { Header } from "semantic-ui-react";
import { Grid } from "semantic-ui-react";

import { Button } from "semantic-ui-react";
import { Image } from "semantic-ui-react";

/**
 *
 *
 * @export
 * @class Add_Base
 * @extends {Update}
 */
export class Update_Base extends Update {
  "use strict";

  /**
   *
   *
   * @returns
   * @memberof Update
   */
  componentDidMount() {}

  /**
   *
   *
   * @returns
   * @memberof Add_Base
   */
  render(simpleSchema, form) {
    /// Sys - AutoForm - layout
    return (
      <React.Fragment>
        <AutoForm
          schema={simpleSchema}
          ref={ref => this.ready(ref)}
          onChange={this.change}
          onSubmit={this.submit}
          model={this.state.doc}
          placeholder={true}
          disabled={false}
          showInlineError={true}
        >
          {/* Link start */}
          <Segment className="header-line" />
          <Segment className="link-area5">
            <Grid centered className="center aligned content">
              <Grid.Row className="header-row">
                <Grid.Column width={2}>
                  <Button onClick={this.props.close} className="close-area">
                    <Image src="/smsk-front/×.svg" />
                  </Button>
                </Grid.Column>
                <Grid.Column
                  width={14}
                  className="center aligned content header"
                >
                  <Header
                    as="h2"
                    className="font-color font-family header-font"
                  >
                    {this.props.title}
                  </Header>
                </Grid.Column>
              </Grid.Row>
            </Grid>
          </Segment>
          {/* Link end */}

          {/* 詳細 start */}
          <Segment
            style={{
              border: "none",
              margin: "0px",
              paddingTop: "0px",
              overflow: "auto",
              height: this.window_innerHeight - 86 + "px"
            }}
          >
            {form}
          </Segment>
          {/* 詳細 end */}

          {/* 下部エリア start */}
          <Segment basic className="center aligned content fam-fotter-area">
            <Grid>
              <Grid.Row>
                <Grid.Column
                  width={16}
                  className="aligned content fam-fotter-style"
                  style={{ marginTop: "16px" }}
                >
                  <SubmitField
                    inputClassName="btn font-family editinfo-fotter-btn fotter-btn-style centered"
                    value="追加"
                  />
                </Grid.Column>
              </Grid.Row>
            </Grid>
          </Segment>
          {/* 下部エリア end */}
        </AutoForm>
      </React.Fragment>
    );
    /// Sys - AutoForm - layout --
  }
}
