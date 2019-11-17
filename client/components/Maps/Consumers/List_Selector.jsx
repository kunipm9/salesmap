import React from "react";
import _ from "lodash";

/// Custom - Layout
import { MDBContainer } from "mdbreact";
import { MDBCard } from "mdbreact";
import { MDBListGroup, MDBListGroupItem } from "mdbreact";
import { MDBRow, MDBCol } from "mdbreact";
/// Custom - Layout --

import { SelectorTags } from "./SelectorTags";

/**
 *
 *
 * @export
 * @class List_Selector
 * @extends {React.Component}
 */
export class List_Selector extends React.Component {
  "use strict";

  /**
   *Creates an instance of List_Selector.
   * @param {*} props
   * @memberof List_Selector
   */
  constructor(props) {
    super(props);

    this.state = {
      name: "",
      address: ""
    };

    /// Custom - Tabular - condition
    this.onSearchName = this.onSearchName.bind(this);
    this.onSearchAddress = this.onSearchAddress.bind(this);
    this.debouncedOnSearchName = _.debounce(
      this.debouncedOnSearchName.bind(this),
      1000
    );
    this.debouncedOnSearchAddress = _.debounce(
      this.debouncedOnSearchAddress.bind(this),
      1000
    );
    /// Custom - Tabular - condition --
  }

  /**
   *
   *
   * @memberof List_Selector
   */
  componentDidMount() {
    this.setState({
      name: this.props.value.name,
      address: this.props.value.address
    });
  }

  /**
   *
   *
   * @param {*} event
   * @memberof List_Selector
   */
  onSearchName(event) {
    this.debouncedOnSearchName(event.target.value);
    this.setState({ name: event.target.value });
  }

  /**
   *
   *
   * @param {*} value
   * @memberof List_Selector
   */
  debouncedOnSearchName(value) {
    this.props.updateSelector("name", value);
  }

  /**
   *
   *
   * @param {*} event
   * @memberof List_Selector
   */
  onSearchAddress(event) {
    this.debouncedOnSearchAddress(event.target.value);
    this.setState({ address: event.target.value });
  }

  /**
   *
   *
   * @param {*} value
   * @memberof List_Selector
   */
  debouncedOnSearchAddress(value) {
    this.props.updateSelector("address", value);
  }

  /**
   *
   *
   * @returns
   * @memberof List_Selector
   */
  render() {
    /// Custom - Tabular - layout
    return (
      <React.Fragment>
        <MDBContainer>
          <MDBCard style={{ marginTop: "1rem" }}>
            <MDBListGroup>
              <MDBListGroupItem>
                <MDBRow>
                  <MDBCol className="col col-1">
                    <h5>氏名</h5>
                  </MDBCol>
                  <div
                    className="form-group"
                    style={{ marginBottom: 0, width: "80%" }}
                  >
                    <input
                      onChange={this.onSearchName}
                      type="text"
                      value={this.state.name}
                      className="form-control form-control-md"
                    />
                  </div>
                  <MDBCol />
                </MDBRow>
              </MDBListGroupItem>
            </MDBListGroup>
          </MDBCard>
        </MDBContainer>

        <MDBContainer>
          <MDBCard style={{ marginTop: "1rem" }}>
            <MDBListGroup>
              <MDBListGroupItem>
                <MDBRow>
                  <MDBCol className="col col-1">
                    <h5>住所</h5>
                  </MDBCol>
                  <div
                    className="form-group"
                    style={{ marginBottom: 0, width: "80%" }}
                  >
                    <input
                      onChange={this.onSearchAddress}
                      type="text"
                      value={this.state.address}
                      className="form-control form-control-md"
                    />
                  </div>
                  <MDBCol />
                </MDBRow>
              </MDBListGroupItem>
            </MDBListGroup>
          </MDBCard>
        </MDBContainer>

        <SelectorTags
          updateSelector={this.props.updateSelector}
          value={this.props.value}
        />
      </React.Fragment>
    );
    /// Custom - Tabular - layout --
  }
}
