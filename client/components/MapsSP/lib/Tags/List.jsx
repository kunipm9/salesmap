import React from "react";
import { withTracker } from "meteor/react-meteor-data";

import { MapsSP_List_List_ComponentInfo } from "../../List/List";

import { Maps_Tags_Collection } from "@imports/api/Maps/Tags_Collection";

import { Segment, Grid, Button, Item, Image } from "semantic-ui-react";

class _Tags_List extends React.Component {
  "use strict";
  constructor(props) {
    super(props);

    this.state = {
      tagList: [],
      expandingCat1Id: this.props.tagList.length
        ? this.props.tagList[0]._id
        : null,
      expandingCat2Ids: [],
      showInsertModal: false,
      showUpdateModal: false,
      editCat1Id: null,
      editCat2Id: null,
      editItemId: null,
      selItemList: [],
      expandAll: false,
      selectedTags: this.props.selectedTags || []
    };

    /// Custom - Role - check permission
    this.ComponentInfo = MapsSP_List_List_ComponentInfo;
    /// Custom - Role - check permission --

    /// Custom - AutoForm - rebuild field
    this.Collection = Maps_Tags_Collection;
    this.Form_name = this.Collection._name;
    /// Custom - AutoForm - rebuild field --

    this.window_innerHeight = window.innerHeight;
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    this.setState({ selectedTags: nextProps.selectedTags || [] });
  }

  /**
   *
   *
   * @memberof View_Tags
   */
  expandCat1 = id => {
    this.setState({
      expandingCat1Id: id,
      expandingCat2Ids: [],
      expandAll: false
    });
  };

  /**
   *
   *
   * @memberof View_Tags
   */
  onClickExpandAll = () => {
    if (this.state.expandingCat1Id) {
      this.setState({
        expandAll: true,
        expandingCat2Ids: this.props.tagList
          .filter(c1 => c1._id == this.state.expandingCat1Id)[0]
          .cat2.map(c => c.id)
      });
    }
  };

  /**
   *
   *
   * @memberof View_Tags
   */
  onClickCloseAll = () => {
    if (this.state.expandingCat1Id) {
      this.setState({ expandAll: false, expandingCat2Ids: [] });
    }
  };

  /**
   *
   *
   * @memberof View_Tags
   */
  expandCat2 = id => {
    if (this.state.expandingCat2Ids.indexOf(id) == -1) {
      this.setState({
        expandingCat2Ids: this.state.expandingCat2Ids.concat(id)
      });
    } else {
      this.setState({
        expandingCat2Ids: this.state.expandingCat2Ids.filter(c => c != id)
      });
    }
  };

  /**
   *
   *
   * @memberof View_Tags
   */
  onClickSel = idList => {
    if (this.state.selectedTags.filter(li => li[0] == idList[0]).length == 0) {
      this.state.selectedTags.push(idList);
      this.setState({ selectedTags: this.state.selectedTags });
      this.props.updateSelectedTagsTemporary(this.state.selectedTags);
    } else {
      this.state.selectedTags = this.state.selectedTags.filter(
        li => li[0] != idList[0]
      );
      this.setState({ selectedTags: this.state.selectedTags });
      this.props.updateSelectedTagsTemporary(this.state.selectedTags);
    }
  };

  /**
   *
   *
   * @memberof View_Tags
   */
  onClickSelCat2All = () => {
    if (this.state.selectedTags.length) {
      this.state.selectedTags = [];
    } else {
      this.state.selectedTags = [];
      this.props.tagList.map(c1 => {
        c1.cat2.map(c2 => {
          c2.items.map(it => {
            this.state.selectedTags.push([it.id, c1._id, c2.id, it.id]);
          });
        });
      });
    }
    this.setState({ selectedTags: this.state.selectedTags });
  };

  /**
   *
   *
   * @memberof View_Tags
   */
  onClickSelItemsAll = (cat1Id, cat2Id) => {
    const sel2 = this.state.selectedTags.filter(li => li[2] == cat2Id);
    this.state.selectedTags = this.state.selectedTags.filter(
      li => li[2] != cat2Id
    );
    if (!sel2.length) {
      const items = this.props.tagList
        .filter(c1 => c1._id == cat1Id)[0]
        .cat2.filter(c2 => c2.id == cat2Id)[0].items;
      for (let i = 0; i < items.length; i++) {
        this.state.selectedTags.push([
          items[i].id,
          cat1Id,
          cat2Id,
          items[i].id
        ]);
      }
    }
    this.setState({ selectedTags: this.state.selectedTags });
  };

  /**
   *
   *
   * @memberof View_Tags
   */
  getTabColor = index => {
    const colorList = [
      "green",
      "teal",
      "blue",
      "violet",
      "purple",
      "pink",
      "brown",
      "red",
      "orange",
      "yellow"
    ];
    return colorList[index % colorList.length];
  };

  /**
   *
   *
   * @memberof View_Tags
   */
  getTabBackgroundColor = selId => {
    if (!selId) {
      return "tag-item-white";
    }

    const sel1 = this.state.expandingCat1Id == selId;
    if (sel1) {
      return "smsk-tags-tab-selected";
    }

//    const sel2 = this.state.selectedTags.filter(li => li[1] == selId);
//    if (sel2.length) {
//      return "smsk-tags-tab-child-selected";
//    }
//    const sel3 = this.state.selectedTags.filter(li => li[2] == selId);
//    if (sel3.length) {
//      return "smsk-tags-tab-child-selected";
//    }
//    const sel4 = this.state.selectedTags.filter(li => li[3] == selId);
//    if (sel4.length) {
//      return "smsk-tags-tab-child-selected";
//    }
    return "tag-item-white";
  };

  /**
   *
   *
   * @memberof View_Tags
   */
  getButtonColorCat2 = selId => {
    const sel1 = this.state.selectedTags.filter(li => li[0] == selId);
    if (sel1.length) {
      return "smsk-tags-button-selected tag-item-btn2 font-family font-color";
    }
//    const sel2 = this.state.selectedTags.filter(li => li[1] == selId);
//    if (sel2.length) {
//      return "smsk-tags-button-child-selected tag-item-btn2 font-family font-color";
//    }
//    const sel3 = this.state.selectedTags.filter(li => li[2] == selId);
//    if (sel3.length) {
//      return "smsk-tags-button-child-selected tag-item-btn2 font-family font-color";
//    }
//    const sel4 = this.state.selectedTags.filter(li => li[3] == selId);
//    if (sel4.length) {
//      return "msk-tags-button-child-selected tag-item-btn2 font-family font-color";
//    }
    return "smsk-tags-button-unselected tag-item-btn2 font-family font-color";
  };

  /**
   *
   *
   * @memberof View_Tags
   */
  getButtonColorItem = selId => {
    const sel1 = this.state.selectedTags.filter(li => li[0] == selId);
    if (sel1.length) {
      return "smsk-tags-button-selected tag-item-btn3 font-family font-color";
    }
//    const sel2 = this.state.selectedTags.filter(li => li[1] == selId);
//    if (sel2.length) {
//      return "smsk-tags-button-child-selected tag-item-btn3 font-family font-color";
//    }
//    const sel3 = this.state.selectedTags.filter(li => li[2] == selId);
//    if (sel3.length) {
//      return "smsk-tags-button-child-selected tag-item-btn3 font-family font-color";
//    }
//    const sel4 = this.state.selectedTags.filter(li => li[3] == selId);
//    if (sel4.length) {
//      return "smsk-tags-button-child-selected tag-item-btn3 font-family font-color";
//    }
    return "smsk-tags-button-unselected tag-item-btn3 font-family font-color";
  };

  /**
   *
   *
   * @memberof View_Tags
   */
  onClickClear = () => {
    this.setState({ selectedTags: [] });
  };

  /**
   *
   *
   * @memberof View_Tags
   */
  onClickCommit = () => {
    this.props.updateSelectedTags(this.state.selectedTags);
  };

  /* global index */
  /* global index2 */
  /* global index3 */
  /* global cat1 */
  /* global cat2 */
  /* global item */

  render() {
    console.log(new Date().getTime(), "Edit_Category render");

    /// Custom - Collection - subscribe
    if (this.props.loading) {
      console.log(new Date().getTime(), "Edit_Category render loading...");
      return <span />;
    }
    /// Custom - Collection - subscribe --

    return (
      <React.Fragment>
        {/* スクロールエリア start */}
        <Segment
          className="scroll-area"
          style={{
            height: this.window_innerHeight - this.props.modHeight + 32 + "px"
          }}
        >
          <Segment padded className="tag-area">
            <Item.Group
              divided
              style={{
                height: this.window_innerHeight - this.props.modHeight + "px",
                marginBottom: "14px"
              }}
            >
              <Item
                className="item-scroll"
                style={{
                  border: "none",
                  paddingTop: "0px",
                  paddingBottom: "0px"
                }}
              >
                <Segment
                  basic
                  style={{
                    height: "fit-content",
                    padding: "4px 4px 10px 4px"
                  }}
                  className="aligned content"
                >
                  {
                    <For each="cat1" index="index" of={this.props.tagList}>
                      <Button
                        onClick={() => this.expandCat1(cat1._id)}
                        key={index}
                        className={
                          "tag-item-btn font-family " +
                          this.getTabBackgroundColor(cat1._id)
                        }
                        style={{
                          borderTop: "solid 6px " + this.getTabColor(index)
                        }}
                      >
                        {" "}
                        {cat1.title}
                      </Button>
                    </For>
                  }
                </Segment>
              </Item>
              <div
                style={{
                  float: "right",
                  paddingRight: "16px",
                  paddingTop: "8px",
                  paddingBottom: "16px"
                }}
              >
                {
                  <If
                    condition={
                      this.state.expandingCat1Id && !this.state.expandAll
                    }
                  >
                    <Item>
                      <Image
                        src="/smsk-front/⇔COLOR.svg"
                        style={{
                          display: "inline-block",
                          verticalAlign: "middle"
                        }}
                      />
                      <p
                        onClick={this.onClickExpandAll}
                        className="font-family"
                        style={{
                          color: "#5bb0ed",
                          display: "inline",
                          verticalAlign: "middle",
                          fontWeight: "bold"
                        }}
                      >
                        {" "}
                        タグをすべて展開
                      </p>
                    </Item>
                  </If>
                }
                {
                  <If
                    condition={
                      this.state.expandingCat1Id && this.state.expandAll
                    }
                  >
                    <Item>
                      <Image
                        src="/smsk-front/→｜ICOLOR.svg"
                        style={{
                          display: "inline-block",
                          verticalAlign: "middle"
                        }}
                      />
                      <p
                        onClick={this.onClickCloseAll}
                        className="font-family"
                        style={{
                          color: "#5bb0ed",
                          display: "inline",
                          verticalAlign: "middle",
                          fontWeight: "bold"
                        }}
                      >
                        {" "}
                        タグをすべて閉じる
                      </p>
                    </Item>
                  </If>
                }
              </div>
              {
                <If condition={this.state.expandingCat1Id}>
                  <Item className="tag-item font-family">
                    <div style={{ width: "calc(100% - 13px)" }}>
                      {
                        <If condition={!this.state.selectedTags.length}>
                          <Button
                            onClick={this.onClickSelCat2All}
                            size="medium"
                            className="tag-open2"
                            style={{ position: "relative" }}
                          >
                            <span
                              style={{
                                fontFamily: "Verdana",
                                textAlign: "left"
                              }}
                            >
                              ↓
                            </span>{" "}
                            すべての分類を選択
                            <span
                              style={{ position: "absolute", right: "65px" }}
                            >
                              <Image src={window.$GLOBAL$.__SVG__["tag_B"]} />
                            </span>
                            <span
                              style={{
                                fontFamily: "Verdana",
                                fontSize: "12px",
                                position: "absolute",
                                right: "45px"
                              }}
                            >
                              10
                            </span>
                          </Button>
                        </If>
                      }

                      {/* 選択状態 */}
                      {
                        <If condition={this.state.selectedTags.length}>
                          <Button
                            onClick={this.onClickSelCat2All}
                            size="medium"
                            className="tag-open2-selected"
                            style={{ position: "relative" }}
                          >
                            <span
                              style={{
                                fontFamily: "Verdana",
                                textAlign: "left"
                              }}
                            >
                              ↓
                            </span>{" "}
                            すべての分類を解除
                            <span
                              style={{ position: "absolute", right: "65px" }}
                            >
                              <Image src={window.$GLOBAL$.__SVG__["tag_H"]} />
                            </span>
                            <span
                              style={{
                                fontFamily: "Verdana",
                                fontSize: "12px",
                                position: "absolute",
                                right: "45px"
                              }}
                            >
                              10
                            </span>
                          </Button>
                        </If>
                      }
                    </div>
                  </Item>
                  {
                    <For
                      each="cat2"
                      index="index2"
                      of={
                        this.props.tagList.filter(
                          c1 => c1._id == this.state.expandingCat1Id
                        )[0].cat2
                      }
                    >
                      <React.Fragment key={index2}>
                        <Item className="tag-item font-family">
                          <div style={{ width: "calc(100% - 13px)" }}>
                            <Button
                              onClick={() => this.expandCat2(cat2.id)}
                              size="medium"
                              className={this.getButtonColorCat2(cat2.id)}
                              style={{
                                width: "100%",
                                height: "38px",
                                borderRadius: "8px",
                                position: "relative"
                              }}
                            >
                              {cat2.title}
                              <span
                                style={{ position: "absolute", right: "112px" }}
                              >
                                <Image src={window.$GLOBAL$.__SVG__["tag_G"]} />
                              </span>
                              <span
                                style={{
                                  fontFamily: "Verdana",
                                  fontSize: "12px",
                                  position: "absolute",
                                  right: "92px",
                                  color: "#b8b8b8"
                                }}
                              >
                                10
                              </span>
                              <span
                                style={{
                                  position: "absolute",
                                  left: "260px",
                                  color: "#b8b8b8"
                                }}
                              >
                                {" "}
                                |{" "}
                              </span>
                              <span
                                style={{ position: "absolute", right: "68px" }}
                              >
                                <Image
                                  src={window.$GLOBAL$.__SVG__["person_G"]}
                                />
                              </span>
                              <span
                                style={{
                                  fontFamily: "Verdana",
                                  fontSize: "12px",
                                  position: "absolute",
                                  right: "21px",
                                  color: "#b8b8b8"
                                }}
                              >
                                20000
                              </span>

                              {/* 選択状態 */}
                              {/* <span style={{position: 'absolute', right: '112px'}}>
                                <Image src={window.$GLOBAL$.__SVG__["tag_H"]} />
                              </span>
                              <span style={{fontFamily: 'Verdana', fontSize: '12px', position: 'absolute', right: '92px', color: 'white'}}>
                                10 
                              </span>
                              <span style={{position: 'absolute', left: '260px', color: 'white'}}> | </span>
                              <span style={{position: 'absolute', right: '68px'}}>
                              <Image src={window.$GLOBAL$.__SVG__["person_H"]} />
                              </span>
                              <span style={{fontFamily: 'Verdana', fontSize: '12px', position: 'absolute', right: '21px', color: 'white'}}>
                                20000
                              </span> */}
                            </Button>
                          </div>
                        </Item>

                        {
                          <If
                            condition={
                              this.state.expandingCat2Ids.indexOf(cat2.id) != -1
                            }
                          >
                            <Item className="pincategoly-item2 font-family">
                              {
                                <If
                                  condition={
                                    !this.state.selectedTags.filter(
                                      li => li[2] == cat2.id
                                    ).length
                                  }
                                >
                                  <Button
                                    onClick={() =>
                                      this.onClickSelItemsAll(
                                        this.state.expandingCat1Id,
                                        cat2.id
                                      )
                                    }
                                    size="medium"
                                    className="tag-open3"
                                    style={{ position: "relative" }}
                                  >
                                    <span
                                      style={{
                                        fontFamily: "Verdana",
                                        textAlign: "left"
                                      }}
                                    >
                                      ↓
                                    </span>{" "}
                                    すべての項目を選択
                                  </Button>
                                </If>
                              }

                              {/* 選択状態 */}

                              {
                                <If
                                  condition={
                                    this.state.selectedTags.filter(
                                      li => li[2] == cat2.id
                                    ).length
                                  }
                                >
                                  <Button
                                    onClick={() =>
                                      this.onClickSelItemsAll(
                                        this.state.expandingCat1Id,
                                        cat2.id
                                      )
                                    }
                                    size="medium"
                                    className="tag-open3-selected"
                                    style={{ position: "relative" }}
                                  >
                                    <span
                                      style={{
                                        fontFamily: "Verdana",
                                        textAlign: "left"
                                      }}
                                    >
                                      ↓
                                    </span>{" "}
                                    すべての項目を解除
                                  </Button>
                                </If>
                              }
                            </Item>
                            {
                              <For
                                each="item"
                                index="index3"
                                of={
                                  this.props.tagList
                                    .filter(
                                      c1 => c1._id == this.state.expandingCat1Id
                                    )[0]
                                    .cat2.filter(c2 => c2.id == cat2.id)[0]
                                    .items
                                }
                              >
                                <Item
                                  className="pincategoly-item2"
                                  key={index3}
                                >
                                  <Button
                                    onClick={() =>
                                      this.onClickSel([
                                        item.id,
                                        this.state.expandingCat1Id,
                                        cat2.id,
                                        item.id
                                      ])
                                    }
                                    className={this.getButtonColorItem(item.id)}
                                    size="medium"
                                    style={{
                                      width: "100%",
                                      height: "36px",
                                      borderRadius: "8px"
                                    }}
                                  >
                                    {item.title}
                                    <span
                                      style={{
                                        position: "absolute",
                                        right: "80px"
                                      }}
                                    >
                                      <Image
                                        src={
                                          window.$GLOBAL$.__SVG__["person_G"]
                                        }
                                      />
                                    </span>
                                    <span
                                      style={{
                                        fontFamily: "Verdana",
                                        fontSize: "12px",
                                        position: "absolute",
                                        right: "33px",
                                        color: "#b8b8b8"
                                      }}
                                    >
                                      20000
                                    </span>

                                    {/* 選択状態 */}
                                    {/* <span style={{position: 'absolute', right: '80px'}}>
                                      <Image src={window.$GLOBAL$.__SVG__["person_H"]}/>
                                    </span>
                                    <span style={{fontFamily: 'Verdana', fontSize: '12px', position: 'absolute', right: '33px', color: 'white'}}>
                                      20000
                                    </span> */}
                                  </Button>
                                </Item>
                              </For>
                            }
                          </If>
                        }
                      </React.Fragment>
                    </For>
                  }
                </If>
              }
            </Item.Group>
          </Segment>
        </Segment>

        {/* 下部エリア start */}
        <Segment className="twobtn-footer-area">
          <Segment className="center aligned content detail-search-footer-segment">
            <Grid padded>
              <Grid.Row
                className="detail-search-row"
                style={{ justifyContent: "space-between" }}
              >
                <div className="left aligned content footer-two-btn-style ">
                  <Button
                    onClick={this.onClickClear}
                    style={{ width: "6em" }}
                    className="font-family font-color listselector-footer-clear"
                  >
                    クリア
                  </Button>
                </div>
                <div
                  className="right aligned content"
                  style={{ paddingRight: "0px", paddingLeft: "0px" }}
                >
                  <Button
                    onClick={this.onClickCommit}
                    style={{ width: "14em", marginRight: "0px" }}
                    className="font-family listselector-footer-search"
                  >
                    決定
                  </Button>
                </div>
              </Grid.Row>
            </Grid>
          </Segment>
        </Segment>
        {/* 下部エリア end */}
      </React.Fragment>
    );
  }
}

/// Custom - View - tracker
export const Tags_List = withTracker(() => {
  /// Custom - Collection - subscribe
  const handles = [
    //    Meteor.subscribe(Maps_Tags_Collection._name, Session.get("Users_Groups_id"))
  ];
  const loading = handles.some(handle => !handle.ready());
  console.log(new Date().getTime(), "Edit_Category loading", loading);

  const tagList = Maps_Tags_Collection.find({ _deleted: null }).map(c => c);

  return {
    ComponentInfo: MapsSP_List_List_ComponentInfo,
    tagList: tagList,
    loading: loading
  };
  /// Custom - Collection - subscribe --
})(_Tags_List);
/// Custom - View - tracker --
