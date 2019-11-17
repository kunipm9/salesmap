import React from "react";
import { Session } from "meteor/session";

/// Custom - Layout
/// Custom - Layout --

// import start
import { Segment, Button, Grid } from "semantic-ui-react";

/// Custom - Application
import { Maps_Ranks_Collection } from "@imports/api/Maps/Ranks_Collection";
console.assert(Maps_Ranks_Collection, "Maps_Ranks_Collection is undefined.");
/// Custom - Application --

/**
 *
 *
 * @export
 * @class SelectorRanks
 * @extends {React.Component}
 */
export class SelectorRanks extends React.Component {
  "use strict";

  constructor(props) {
    super(props);

    this.state = {
      ranks: [],
      visits: []
    };

    /// Custom - Tabular - condition
    this.state.ranks = [];

    this.getRanksColor = this.getRanksColor.bind(this);
    this.clickRanks = this.clickRanks.bind(this);
    this.getVisitsColor = this.getVisitsColor.bind(this);
    this.clickVisits = this.clickVisits.bind(this);
    /// Custom - Tabular - condition --
  }

  /**
   *
   *
   * @memberof SelectorRanks
   */
  componentDidMount() {
    const ranks = this.props.value.ranks || [];
    const visits = this.props.value.visits || [];
    this.setState({
      ranks: ranks,
      visits: visits
    });
  }

  /**
   *
   *
   * @param {*} rank
   * @param {*} background
   * @returns
   * @memberof SelectorRanks
   */
  getRanksColor(rank, background) {
    if (this.state.ranks.indexOf(rank) >= 0) {
      if (background) {
        return "#3a7cac";
      } else {
        return "white";
      }
    } else {
      if (background) {
        return "white";
      } else {
        return "#d9d9d9";
      }
    }
  }

  /**
   *
   *
   * @param {*} _id
   * @memberof SelectorRanks
   */
  clickRanks(_id) {
    if (this.state.ranks.indexOf(_id) >= 0) {
      this.setState({ ranks: this.state.ranks.filter(r => r != _id) });
    } else {
      this.state.ranks.push(_id);
      this.setState({ ranks: this.state.ranks });
    }
  }

  /**
   *
   *
   * @param {*} _id
   * @returns
   * @memberof SelectorRanks
   */
  getVisitsColor(_id) {
    if (this.state.visits.indexOf(_id) >= 0) {
      return "blue";
    } else {
      return "grey";
    }
  }

  /**
   *
   */
  clickVisits(_id) {
    if (this.state.visits.indexOf(_id) >= 0) {
      this.setState({ visits: this.state.visits.filter(r => r != _id) });
    } else {
      this.state.visits.push(_id);
      this.setState({ visits: this.state.visits });
    }
  }

  /**
   *
   */
  closeSelectorRanks = () => {
    this.props.close(this.state.ranks, this.state.visits);
  };

  /* global index */
  /* global rank */

  /**
   *
   *
   * @returns
   * @memberof SelectorRanks
   */
  render() {
    const Users_Groups_id = Session.get("Users_Groups_id");
    const rankRec = Maps_Ranks_Collection.findOne({
      Users_Groups_id: Users_Groups_id
    });

    return (
      <React.Fragment>
        <Segment
          basic
          style={{ padding: "0px", paddingLeft: "3px" }}
          className="center aligned content"
        >
          <Grid>
            <Grid.Row>
              {
                <For each="rank" index="index" of={rankRec.ranks}>
                  {
                    <If condition={rank && rank.rank}>
                      <Button
                        key={index}
                        onClick={() => this.clickRanks(String(index))}
                        style={{
                          width: "32%",
                          marginTop: "4px",
                          padding: "11px 5px",
                          borderRadius: "10px",
                          marginBottom: "15px",
                          backgroundColor: this.getRanksColor(
                            String(index),
                            true
                          ),
                          color: this.getRanksColor(String(index), false),
                          border:
                            "solid 1px " +
                            this.getRanksColor(String(index), false)
                        }}
                      >
                        {rank.rank}
                      </Button>
                    </If>
                  }
                </For>
              }
            </Grid.Row>
          </Grid>
        </Segment>

        <Segment
          basic
          style={{ padding: "0px", paddingLeft: "3px" }}
          className="center aligned content"
        >
          <Button
            onClick={this.closeSelectorRanks}
            className="font-family rankmodal-fotter-btn fotter-btn-style"
            style={{ marginLeft: "15px" }}
          >
            決定
          </Button>
        </Segment>
      </React.Fragment>
    );
    /// Custom - Tabular - layout --
  }
}
