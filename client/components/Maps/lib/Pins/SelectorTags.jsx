import React from "react";

/// Custom - Layout
import { MDBBtn } from "mdbreact";
import { MDBContainer } from "mdbreact";
import { MDBCard } from "mdbreact";
import { MDBListGroup, MDBListGroupItem } from "mdbreact";
import { MDBRow, MDBCol } from "mdbreact";
import { MDBChip } from "mdbreact";
/// Custom - Layout --

/// Custom - Application
import { Maps_Tags_Collection } from "@imports/api/Maps/Tags_Collection";
console.assert(Maps_Tags_Collection, "Maps_Tags_Collection is undefined.");
/// Custom - Application --

/**
 *
 *
 * @export
 * @class SelectorTags
 * @extends {React.Component}
 */
export class SelectorTags extends React.Component {
  "use strict";

  constructor(props) {
    super(props);

    this.state = {};

    /// Custom - Tabular - condition
    this.state.activeTagCat1 = null;
    this.state.activeTagCat2 = null;
    this.state.activeTagMode = "Or";
    this.state.tagSearchCat1 = "";
    this.state.tagSearchCat2 = "";
    this.state.tagSearchItem = "";
    this.state.tagOrList = [];
    this.state.tagNotList = [];
    this.state.tagAndList = [];

    this.tagCat1List = Maps_Tags_Collection.find({ _deleted: null }).map(
      cat1 => cat1
    );

    if (this.tagCat1List.length > 0) {
      this.state.activeTagCat1 = this.tagCat1List[0];

      const tagCat1Cat2List = this.tagCat1List.filter(cat1 => {
        return cat1._id == this.state.activeTagCat1._id;
      });
      if (tagCat1Cat2List.length > 0) {
        this.state.activeTagCat2 = tagCat1Cat2List[0].cat2[0];
      }
    }

    this.setupSelector = this.setupSelector.bind(this);
    /// Custom - Tabular - condition --
  }

  /**
   *
   *
   * @memberof SelectorTags
   */
  componentDidMount() {
    const tagOrList = [];
    if (this.props.value.tags.or && this.props.value.tags.or.length > 0) {
      for (let cat1 of this.tagCat1List) {
        for (let cat2 of cat1.cat2) {
          for (let item of cat2.items) {
            if (this.props.value.tags.or.indexOf(item.id) >= 0) {
              tagOrList.push(item);
            }
          }
        }
      }
    }
    const tagNotList = [];
    if (this.props.value.tags.not && this.props.value.tags.not.length > 0) {
      for (let cat1 of this.tagCat1List) {
        // eslint-disable-line no-redeclare
        for (let cat2 of cat1.cat2) {
          // eslint-disable-line no-redeclare
          for (let item of cat2.items) {
            // eslint-disable-line no-redeclare
            if (this.props.value.tags.not.indexOf(item.id) >= 0) {
              tagNotList.push(item);
            }
          }
        }
      }
    }
    const tagAndList = [];
    if (this.props.value.tags.and && this.props.value.tags.and.length > 0) {
      for (let cat1 of this.tagCat1List) {
        // eslint-disable-line no-redeclare
        for (let cat2 of cat1.cat2) {
          // eslint-disable-line no-redeclare
          for (let item of cat2.items) {
            // eslint-disable-line no-redeclare
            if (this.props.value.tags.and.indexOf(item.id) >= 0) {
              tagNotList.push(item);
            }
          }
        }
      }
    }
    this.state.tagOrList = tagOrList; // eslint-disable-line react/no-direct-mutation-state
    this.state.tagNotList = tagNotList; // eslint-disable-line react/no-direct-mutation-state
    this.state.tagAndList = tagAndList; // eslint-disable-line react/no-direct-mutation-state
    this.setState({
      tagOrList: tagOrList,
      tagNotList: tagNotList,
      tagAndList: tagAndList
    });

    // Garbage collector
    this.setupSelector();
  }

  /**
   *
   *
   * @memberof SelectorTags
   */
  handleTagCat1 = cat1 => () => {
    if (this.state.activeTagCat1 !== cat1) {
      const tagCat1Cat2List = this.tagCat1List.filter(_cat1 => {
        return _cat1._id == cat1._id;
      });
      if (tagCat1Cat2List.length > 0) {
        this.state.activeTagCat2 = tagCat1Cat2List[0].cat2[0]; // eslint-disable-line react/no-direct-mutation-state

        this.setState({
          activeTagCat1: cat1,
          activeTagCat2: this.state.activeTagCat2
        });
      }
    }
  };

  /**
   *
   *
   * @memberof SelectorTags
   */
  handleTagCat2 = cat2 => () => {
    if (this.state.activeTagCat2 !== cat2) {
      this.setState({
        activeTagCat2: cat2
      });
    }
  };

  /**
   *
   *
   * @memberof SelectorTags
   */
  handleTagItem = item => () => {
    if (this.state.activeTagMode === "Or") {
      this.state.tagOrList.push(item), this.setupSelector();
      this.setState({
        tagOrList: this.state.tagOrList
      });
    }
    if (this.state.activeTagMode === "Not") {
      this.state.tagNotList.push(item), this.setupSelector();
      this.setState({
        tagNotList: this.state.tagNotList
      });
    }
    if (this.state.activeTagMode === "And") {
      this.state.tagAndList.push(item), this.setupSelector();
      this.setState({
        tagAndList: this.state.tagAndList
      });
    }
  };

  /**
   *
   *
   * @memberof SelectorTags
   */
  handleTagMode = mode => () => {
    this.setState({
      activeTagMode: mode
    });
  };

  /**
   *
   *
   * @memberof SelectorTags
   */
  handleTagOr = _item => () => {
    // eslint-disable-next-line react/no-direct-mutation-state
    this.state.tagOrList = this.state.tagOrList.filter(
      item => _item.id != item.id
    );
    this.setupSelector();
    this.setState({
      tagOrList: this.state.tagOrList
    });
  };

  /**
   *
   *
   * @memberof SelectorTags
   */
  handleTagNot = _item => () => {
    // eslint-disable-next-line react/no-direct-mutation-state
    this.state.tagNotList = this.state.tagNotList.filter(
      item => _item.id != item.id
    );
    this.setupSelector();
    this.setState({
      tagNotList: this.state.tagNotList
    });
  };

  /**
   *
   *
   * @memberof SelectorTags
   */
  handleTagAnd = _item => () => {
    // eslint-disable-next-line react/no-direct-mutation-state
    this.state.tagAndList = this.state.tagAndList.filter(
      item => _item.id != item.id
    );
    this.setupSelector();
    this.setState({
      tagAndList: this.state.tagAndList
    });
  };

  /**
   *
   *
   * @memberof SelectorTags
   */
  setupSelector() {
    /// Application - Search
    const tags = {
      or: [],
      not: [],
      and: []
    };
    if (this.state.tagOrList && this.state.tagOrList.length > 0) {
      tags.or = this.state.tagOrList.map(tag => tag.id);
    }
    if (this.state.tagNotList && this.state.tagNotList.length > 0) {
      tags.not = this.state.tagNotList.map(tag => tag.id);
    }
    if (this.state.tagAndList && this.state.tagAndList.length > 0) {
      tags.and = this.state.tagAndList.map(tag => tag.id);
    }
    this.props.updateSelector("tags", tags);

    /// Application - Search --
  }

  /* global index */
  /* global cat1 */
  /* global cat2 */
  /* global item */

  /**
   *
   *
   * @returns
   * @memberof SelectorTags
   */
  render() {
    /// Application - Tags
    const tagCat1Cat2List = this.tagCat1List.filter(cat1 => {
      return cat1._id == this.state.activeTagCat1._id;
    });
    let tagCat2List = [];
    if (tagCat1Cat2List.length > 0) {
      tagCat2List = tagCat1Cat2List[0].cat2;
    }

    const tagCat2ItemList = tagCat2List.filter(cat2 => {
      return cat2.id == this.state.activeTagCat2.id;
    });
    let tagItemList = [];
    if (tagCat2ItemList.length > 0) {
      tagItemList = tagCat2ItemList[0].items;
    }
    /// Application - Tags --

    /// Custom - Tabular - layout
    return (
      <React.Fragment>
        <MDBContainer>
          <MDBCard style={{ marginTop: "1rem" }}>
            <MDBListGroup>
              <MDBListGroupItem>
                <MDBRow>
                  <MDBCol className="col col-1">
                    <h5>タグ</h5>
                  </MDBCol>
                  <MDBCol>
                    【大分類】
                    <input
                      onChange={e => {
                        this.setState({ tagSearchCat1: e.target.value });
                      }}
                      type="text"
                      className="form-control form-control-md"
                      style={{ display: "inline", width: "80px" }}
                      placeholder="タグ検索"
                    />
                    {
                      <For each="cat1" index="index" of={this.tagCat1List}>
                        <If
                          condition={
                            !this.state.tagSearchCat1 ||
                            cat1.title
                              .toLowerCase()
                              .indexOf(
                                this.state.tagSearchCat1.toLowerCase()
                              ) >= 0
                          }
                        >
                          <Choose>
                            <When
                              condition={
                                cat1._id == this.state.activeTagCat1._id
                              }
                            >
                              <MDBBtn
                                key={index}
                                onClick={this.handleTagCat1(cat1)}
                                color="mdb-color"
                                size="sm"
                                style={{
                                  border: "yellow",
                                  borderStyle: "solid",
                                  boxShadow:
                                    "0 2px 5px 0 rgba(0, 0, 0, 0.32), 0 2px 10px 0 rgba(0, 0, 0, 0.24)"
                                }}
                              >
                                {cat1.title}
                              </MDBBtn>
                            </When>
                            <Otherwise>
                              <MDBBtn
                                key={index}
                                onClick={this.handleTagCat1(cat1)}
                                color="mdb-color"
                                size="sm"
                              >
                                {cat1.title}
                              </MDBBtn>
                            </Otherwise>
                          </Choose>
                        </If>
                      </For>
                    }
                    <hr
                      style={{
                        marginTop: "0.2rem",
                        marginBottom: "0.2rem",
                        borderTop: "1px solid rgba(0,0,0,.3)"
                      }}
                    />
                    【中分類】
                    <input
                      onChange={e => {
                        this.setState({ tagSearchCat2: e.target.value });
                      }}
                      type="text"
                      className="form-control form-control-md"
                      style={{ display: "inline", width: "80px" }}
                      placeholder="タグ検索"
                    />
                    {
                      <For each="cat2" index="index" of={tagCat2List}>
                        <If
                          condition={
                            !this.state.tagSearchCat2 ||
                            cat2.title
                              .toLowerCase()
                              .indexOf(
                                this.state.tagSearchCat2.toLowerCase()
                              ) >= 0
                          }
                        >
                          <Choose>
                            <When
                              condition={cat2.id == this.state.activeTagCat2.id}
                            >
                              <MDBBtn
                                key={index}
                                onClick={this.handleTagCat2(cat2)}
                                color="blue-grey"
                                size="sm"
                                style={{
                                  border: "yellow",
                                  borderStyle: "solid",
                                  boxShadow:
                                    "0 2px 5px 0 rgba(0, 0, 0, 0.32), 0 2px 10px 0 rgba(0, 0, 0, 0.24)"
                                }}
                              >
                                {cat2.title}
                              </MDBBtn>
                            </When>
                            <Otherwise>
                              <MDBBtn
                                key={index}
                                onClick={this.handleTagCat2(cat2)}
                                color="blue-grey"
                                size="sm"
                              >
                                {cat2.title}
                              </MDBBtn>
                            </Otherwise>
                          </Choose>
                        </If>
                      </For>
                    }
                    <hr
                      style={{
                        marginTop: "0.2rem",
                        marginBottom: "0.2rem",
                        borderTop: "1px solid rgba(0,0,0,.3)"
                      }}
                    />
                    【小項目】
                    <input
                      onChange={e => {
                        this.setState({ tagSearchItem: e.target.value });
                      }}
                      type="text"
                      className="form-control form-control-md"
                      style={{ display: "inline", width: "80px" }}
                      placeholder="タグ検索"
                    />
                    {
                      <For each="item" index="index" of={tagItemList}>
                        <If
                          condition={
                            !this.state.tagSearchItem ||
                            item.title
                              .toLowerCase()
                              .indexOf(
                                this.state.tagSearchItem.toLowerCase()
                              ) >= 0
                          }
                        >
                          <Choose>
                            <When
                              condition={
                                this.state.tagOrList.filter(
                                  _item => item.id == _item.id
                                ).length > 0 ||
                                this.state.tagNotList.filter(
                                  _item => item.id == _item.id
                                ).length > 0 ||
                                this.state.tagAndList.filter(
                                  _item => item.id == _item.id
                                ).length > 0
                              }
                            >
                              <MDBBtn
                                key={index}
                                disabled={true}
                                rounded
                                color="mdb-color"
                                size="sm"
                              >
                                {item.title}
                              </MDBBtn>
                            </When>
                            <Otherwise>
                              <MDBBtn
                                key={index}
                                onClick={this.handleTagItem(item)}
                                rounded
                                color="mdb-color"
                                size="sm"
                              >
                                {item.title}
                              </MDBBtn>
                            </Otherwise>
                          </Choose>
                        </If>
                      </For>
                    }
                  </MDBCol>
                </MDBRow>
              </MDBListGroupItem>

              <MDBListGroupItem>
                <MDBRow>
                  <MDBCol className="col col-2">
                    {
                      <Choose>
                        <When condition={"Or" == this.state.activeTagMode}>
                          <MDBBtn
                            onClick={this.handleTagMode("Or")}
                            color="primary"
                            rounded
                            size="sm"
                            style={{
                              border: "yellow",
                              borderStyle: "solid",
                              boxShadow:
                                "0 2px 5px 0 rgba(0, 0, 0, 0.32), 0 2px 10px 0 rgba(0, 0, 0, 0.24)"
                            }}
                          >
                            または
                          </MDBBtn>
                        </When>
                        <Otherwise>
                          <MDBBtn
                            onClick={this.handleTagMode("Or")}
                            color="primary"
                            rounded
                            size="sm"
                          >
                            または
                          </MDBBtn>
                        </Otherwise>
                      </Choose>
                    }
                  </MDBCol>
                  <MDBCol>
                    {
                      <For each="item" index="index" of={this.state.tagOrList}>
                        <MDBChip
                          key={index}
                          waves
                          close
                          bgColor="indigo lighten-4"
                          handleClose={this.handleTagOr(item)}
                          style={{ marginBottom: 0 }}
                        >
                          {item.title}
                        </MDBChip>
                      </For>
                    }
                  </MDBCol>
                </MDBRow>
              </MDBListGroupItem>

              <MDBListGroupItem>
                <MDBRow>
                  <MDBCol className="col col-2">
                    {
                      <Choose>
                        <When condition={"Not" == this.state.activeTagMode}>
                          <MDBBtn
                            onClick={this.handleTagMode("Not")}
                            color="warning"
                            rounded
                            size="sm"
                            style={{
                              border: "yellow",
                              borderStyle: "solid",
                              boxShadow:
                                "0 2px 5px 0 rgba(0, 0, 0, 0.32), 0 2px 10px 0 rgba(0, 0, 0, 0.24)"
                            }}
                          >
                            除く
                          </MDBBtn>
                        </When>
                        <Otherwise>
                          <MDBBtn
                            onClick={this.handleTagMode("Not")}
                            color="warning"
                            rounded
                            size="sm"
                          >
                            除く
                          </MDBBtn>
                        </Otherwise>
                      </Choose>
                    }
                  </MDBCol>
                  <MDBCol>
                    {
                      <For each="item" index="index" of={this.state.tagNotList}>
                        <MDBChip
                          key={index}
                          waves
                          close
                          bgColor="indigo lighten-4"
                          handleClose={this.handleTagNot(item)}
                          style={{ marginBottom: 0 }}
                        >
                          {item.title}
                        </MDBChip>
                      </For>
                    }
                  </MDBCol>
                </MDBRow>
              </MDBListGroupItem>

              <MDBListGroupItem>
                <MDBRow>
                  <MDBCol className="col col-2">
                    {
                      <Choose>
                        <When condition={"And" == this.state.activeTagMode}>
                          <MDBBtn
                            onClick={this.handleTagMode("And")}
                            color="success"
                            rounded
                            size="sm"
                            style={{
                              border: "yellow",
                              borderStyle: "solid",
                              boxShadow:
                                "0 2px 5px 0 rgba(0, 0, 0, 0.32), 0 2px 10px 0 rgba(0, 0, 0, 0.24)"
                            }}
                          >
                            必須
                          </MDBBtn>
                        </When>
                        <Otherwise>
                          <MDBBtn
                            onClick={this.handleTagMode("And")}
                            color="success"
                            rounded
                            size="sm"
                          >
                            必須
                          </MDBBtn>
                        </Otherwise>
                      </Choose>
                    }
                  </MDBCol>
                  <MDBCol>
                    {
                      <For each="item" index="index" of={this.state.tagAndList}>
                        <MDBChip
                          key={index}
                          waves
                          close
                          bgColor="indigo lighten-4"
                          handleClose={this.handleTagAnd(item)}
                          style={{ marginBottom: 0 }}
                        >
                          {item.title}
                        </MDBChip>
                      </For>
                    }
                  </MDBCol>
                </MDBRow>
              </MDBListGroupItem>
            </MDBListGroup>
          </MDBCard>
        </MDBContainer>
      </React.Fragment>
    );
    /// Custom - Tabular - layout --
  }
}
