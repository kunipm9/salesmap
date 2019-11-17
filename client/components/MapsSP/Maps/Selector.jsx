/// Sys - View
import React from "react";
/// Sys - View --

/// Custom - AutoForm - collection
import { Maps_Ranks_Collection } from "@imports/api/Maps/Ranks_Collection";
console.assert(Maps_Ranks_Collection, "Maps_Ranks_Collection is undefined.");

import { Maps_PinCategorys_Collection } from "@imports/api/Maps/PinCategorys_Collection";
console.assert(
  Maps_PinCategorys_Collection,
  "Maps_PinCategorys_Collection is undefined."
);

/// Custom - AutoForm - collection --

/// Application
import { Grid } from "semantic-ui-react";
import { Button } from "semantic-ui-react";

import { MDBModalBody } from "mdbreact";

/// Application --

/**
 *
 *
 * @class BookmarksLocalCollection
 * @extends {MapsLocalCollection}
 */
export class Selector extends React.Component {
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
      showLastVisit: false,
      showRank: false,
      showVisitStatus: false,
      showTag: false,
      showPin: false,

      //      visits: [],
      //      ranks: [],
      //      statuss: [],
      //      pinCategorys: [],
      //      pinKinds: []

      selector: {
        keyword: "",
        createdAtKind: "",
        createdAtFrom: "",
        createdAtTo: "",
        transportationAtKind: "",
        transportationAtFrom: "",
        transportationAtTo: "",
        ranks: [],
        lastVisits: [],
        visitStatus: [],
        tags: {
          or: [],
          not: [],
          and: []
        },
        pinCategorys: []
      }
    };

    this.optionLastVisits = [];
    this.optionRanks = [];
    this.optionVisitStatus = [];
    this.optionPinCategorys = [];
  }

  /**
   *
   *
   * @memberof List
   */
  componentDidMount() {
    console.log(new Date().getTime(), "Selector componentDidMount");

    const rank = Maps_Ranks_Collection.findOne();
    if (rank && rank.ranks) {
      this.optionRanks = rank.ranks
        .map((r, i) => {
          if (r) {
            r.id = i;
          }
          return r;
        })
        .filter(r => r && r.rank)
        .map(r => {
          return { text: r.rank, color: r.color, value: String(r.id) };
        })
        .filter(r => r.text);
    }

    const pinCategory = Maps_PinCategorys_Collection.findOne();
    this.optionPinCategorys = [];
    if (pinCategory && pinCategory.cat1) {
      for (let i = 0; i < pinCategory.cat1.length; i++) {
        for (let j = 0; j < (pinCategory.cat1[i].cat2 || []).length; j++) {
          const cat2 = pinCategory.cat1[i].cat2[j];
          const tmp = {
            text: cat2.title,
            value: cat2.id
          };
          this.optionPinCategorys.push(tmp);
        }
      }
    }

    this.optionLastVisits = [
      { text: "直近", value: "1m" },
      { text: "半年", value: "6m" },
      { text: "1年", value: "1y" },
      { text: "未", value: "none" }
    ];

    this.optionVisitStatus = [
      { id: "map28-honnin", text: "本人", value: "meet" },
      { id: "map28-menkai", text: "面会", value: "visit" },
      { id: "map28-zaitaku", text: "在宅", value: "athome" },
      { id: "map28-rusu", text: "留守", value: "absences" }
    ];

    this.setState({ selector: this.props.selector });

    console.log("this.optionRanks", this.optionRanks);
    console.log("this.optionPinCategorys", this.optionPinCategorys);
  }

  /**
   *
   *
   * @memberof Selector
   */
  onClickShowLastVisit = () => {
    this.setState({
      showLastVisit: true,
      showRank: false,
      showVisitStatus: false,
      showTag: false,
      showPin: false
    });
  };

  /**
   *
   *
   * @memberof Selector
   */
  onClickLastVisit = lastVisit => {
    const selector = Object.assign({}, this.state.selector);

    if ((selector.lastVisits || []).indexOf(lastVisit) >= 0) {
      selector.lastVisits = selector.lastVisits.filter(r => r != lastVisit);
    } else {
      selector.lastVisits.push(lastVisit);
    }
    this.setState({ selector: selector });
    this.props.setSelector(selector);
  };

  /**
   *
   *
   * @returns
   * @memberof SelectorRanks
   */
  getLastVisitColor = lastVisit => {
    if ((this.state.selector.lastVisits || []).indexOf(lastVisit) >= 0) {
      return "active";
    } else {
      return "";
    }
  };

  /**
   *
   *
   * @memberof Selector
   */
  onClickShowRank = () => {
    this.setState({
      showLastVisit: false,
      showRank: true,
      showVisitStatus: false,
      showTag: false,
      showPin: false
    });
  };

  /**
   *
   *
   * @memberof Selector
   */
  onClickRank = rank => {
    rank = String(rank);
    const selector = Object.assign({}, this.state.selector);

    if ((selector.ranks || []).indexOf(rank) >= 0) {
      selector.ranks = selector.ranks.filter(r => r != rank);
    } else {
      selector.ranks.push(rank);
    }
    this.setState({ selector: selector });
    this.props.setSelector(selector);
  };

  /**
   *
   *
   * @param {*} rank
   * @returns
   * @memberof SelectorRanks
   */
  getRanksColor = rank => {
    if ((this.state.selector.ranks || []).indexOf(rank) >= 0) {
      return "active";
    } else {
      return "";
    }
  };

  /**
   *
   *
   * @param {*} rank
   * @returns
   * @memberof SelectorRanks
   */
  getRanksBackgroundColor = rank => {
    if ((this.state.selector.ranks || []).indexOf(rank) >= 0) {
      const ranks = this.optionRanks.filter(r => r.value == rank);
      if (ranks.length == 0) {
        return "white";
      }
      return ranks[0].color;
    }
    return "white";
  };

  /**
   *
   *
   * @memberof Selector
   */
  onClickShowVisitStatus = () => {
    this.setState({
      showLastVisit: false,
      showRank: false,
      showVisitStatus: true,
      showTag: false,
      showPin: false
    });
  };

  /**
   *
   *
   * @memberof Selector
   */
  onClickVisitStatus = visitStatus => {
    const selector = Object.assign({}, this.state.selector);

    if ((selector.visitStatus || []).indexOf(visitStatus) >= 0) {
      selector.visitStatus = selector.visitStatus.filter(r => r != visitStatus);
    } else {
      selector.visitStatus.push(visitStatus);
    }
    this.setState({ selector: selector });
    this.props.setSelector(selector);
  };

  /**
   *
   *
   * @param {*} rank
   * @param {*} background
   * @returns
   * @memberof SelectorRanks
   */
  getVisitStatusColor = visitStatus => {
    if ((this.state.selector.visitStatus || []).indexOf(visitStatus) >= 0) {
      return "active";
    } else {
      return "";
    }
  };

  /**
   *
   *
   * @memberof Selector
   */
  onClickShowTag = () => {
    this.setState({
      showLastVisit: false,
      showRank: false,
      showVisitStatus: false,
      showTag: true,
      showPin: false
    });
  };

  /**
   *
   *
   * @memberof Selector
   */
  onClickShowPin = () => {
    this.setState({
      showLastVisit: false,
      showRank: false,
      showVisitStatus: false,
      showTag: false,
      showPin: true
    });
  };

  /**
   *
   *
   * @memberof Selector
   */
  onClickPinCategory = cat => {
    const selector = Object.assign({}, this.state.selector);
    if ((selector.pinCategorys || []).indexOf(cat) >= 0) {
      selector.pinCategorys = selector.pinCategorys.filter(c => c != cat);
    } else {
      selector.pinCategorys.push(cat);
    }
    this.setState({ selector: selector });
    this.props.setSelector(selector);
  };

  /**
   *
   *
   * @param {*} rank
   * @param {*} background
   * @returns
   * @memberof SelectorRanks
   */
  getPinCategoryColor = pinCategory => {
    if ((this.state.selector.pinCategorys || []).indexOf(pinCategory) >= 0) {
      return "active";
    } else {
      return "";
    }
  };

  /* global index */
  /* global lastVisit */
  /* global rank */
  /* global visitStatus */
  /* global pinCategory */

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

    let sel = [];
    sel = [];
    for (let i = 0; i < this.optionLastVisits.length; i++) {
      if (
        (this.state.selector.lastVisits || []).indexOf(
          this.optionLastVisits[i].value
        ) >= 0
      ) {
        sel.push(this.optionLastVisits[i].text);
      }
    }
    const lastVisitSelectText = sel.join("/");

    sel = [];
    for (let i = 0; i < this.optionRanks.length; i++) {
      if (
        (this.state.selector.ranks || []).indexOf(this.optionRanks[i].value) >=
        0
      ) {
        sel.push(this.optionRanks[i].text);
      }
    }
    const rankSelectText = sel.join("/");

    sel = [];
    for (let i = 0; i < this.optionVisitStatus.length; i++) {
      if (
        (this.state.selector.visitStatus || []).indexOf(
          this.optionVisitStatus[i].value
        ) >= 0
      ) {
        sel.push(this.optionVisitStatus[i].text);
      }
    }
    const visitStatusSelectText = sel.join("/");

    sel = [];
    for (let i = 0; i < this.optionPinCategorys.length; i++) {
      if (
        (this.state.selector.pinCategorys || []).indexOf(
          this.optionPinCategorys[i].value
        ) >= 0
      ) {
        sel.push(this.optionPinCategorys[i].text);
      }
    }
    const pinCategorySelectText = sel.join("/");

    return (
      <React.Fragment>
        <Grid className="map34-modal-grid">
          <Grid.Row className="map34-top-row">
            <Button
              onClick={this.onClickShowLastVisit}
              className={
                "map34-topbtn " + (this.state.showLastVisit ? "active" : "")
              }
            >
              訪問
            </Button>
            <p className="map34-top-p">{lastVisitSelectText}</p>
          </Grid.Row>
          <Grid.Row className="map34-top-row">
            <Button
              onClick={this.onClickShowRank}
              className={
                "map34-topbtn " + (this.state.showRank ? "active" : "")
              }
            >
              ランク
            </Button>
            <p className="map34-top-p">{rankSelectText}</p>
          </Grid.Row>
          <Grid.Row className="map34-top-row">
            <Button
              onClick={this.onClickShowVisitStatus}
              className={
                "map34-topbtn " + (this.state.showVisitStatus ? "active" : "")
              }
            >
              ステータス
            </Button>
            <p className="map34-top-p">{visitStatusSelectText}</p>
          </Grid.Row>
          <Grid.Row className="map34-top-row">
            <Button
              onClick={this.onClickShowTag}
              className={"map34-topbtn " + (this.state.showTag ? "active" : "")}
            >
              タグ
            </Button>
            <p className="map34-top-p">
              関東獣医師学会/日本医師会/2019年/定期報告会/東京土建/…
            </p>
          </Grid.Row>
          <Grid.Row className="map34-top-row">
            <Button
              onClick={this.onClickShowPin}
              className={"map34-topbtn " + (this.state.showPin ? "active" : "")}
            >
              ピン
            </Button>
            <p className="map34-top-p">{pinCategorySelectText}</p>
          </Grid.Row>
        </Grid>

        {
          <If condition={this.state.showLastVisit}>
            <MDBModalBody id="map34-content2">
              <Grid style={{ margin: "0px" }}>
                {
                  <For
                    each="lastVisit"
                    index="index"
                    of={this.optionLastVisits}
                  >
                    <Button
                      onClick={() => {
                        this.onClickLastVisit(lastVisit.value);
                      }}
                      key={index}
                      className={
                        "map34-bottom-btn " +
                        this.getLastVisitColor(lastVisit.value)
                      }
                    >
                      {lastVisit.text}
                    </Button>
                  </For>
                }
              </Grid>
            </MDBModalBody>
          </If>
        }

        {
          <If condition={this.state.showRank}>
            <MDBModalBody id="map34-content2">
              <Grid style={{ margin: "0px" }}>
                {
                  <For each="rank" index="index" of={this.optionRanks}>
                    <Button
                      onClick={() => {
                        this.onClickRank(rank.value);
                      }}
                      key={index}
                      className={
                        "map30a-rank-btn " + this.getRanksColor(rank.value)
                      }
                      style={{
                        backgroundColor: this.getRanksBackgroundColor(
                          rank.value
                        )
                      }}
                    >
                      {rank.text}
                    </Button>
                  </For>
                }
              </Grid>
            </MDBModalBody>
          </If>
        }

        {
          <If condition={this.state.showVisitStatus}>
            <MDBModalBody id="map34-content2">
              <Grid style={{ margin: "0px" }}>
                {
                  <For
                    each="visitStatus"
                    index="index"
                    of={this.optionVisitStatus}
                  >
                    <Button
                      onClick={() => {
                        this.onClickVisitStatus(visitStatus.value);
                      }}
                      key={index}
                      id={visitStatus.id}
                      className={this.getVisitStatusColor(visitStatus.value)}
                    >
                      {visitStatus.text}
                    </Button>
                  </For>
                }

                <p className="map28-bottom-p">
                  ハンバーガーメニュー＞その他設定で面会or本人面会or両方の設定を行える
                </p>
              </Grid>
            </MDBModalBody>
          </If>
        }

        {
          <If condition={this.state.showPin}>
            <MDBModalBody id="map34-content2">
              <Grid style={{ margin: "0px" }}>
                {
                  <For
                    each="pinCategory"
                    index="index"
                    of={this.optionPinCategorys}
                  >
                    <Button
                      onClick={() => {
                        this.onClickPinCategory(pinCategory.value);
                      }}
                      key={index}
                      className={
                        "map34-bottom-btn " +
                        this.getPinCategoryColor(pinCategory.value)
                      }
                    >
                      {pinCategory.text}
                    </Button>
                  </For>
                }
              </Grid>
            </MDBModalBody>
          </If>
        }
      </React.Fragment>
    );
  }
  /// Custom - View - layout --
}
