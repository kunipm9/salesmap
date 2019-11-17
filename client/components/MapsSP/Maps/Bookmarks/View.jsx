/// Sys - View
import React from "react";
import { Session } from "meteor/session";
import { Persister } from "@imports/api/lib/persist-method";
import { withTracker } from "meteor/react-meteor-data";
/// Sys - View --

import {
  Segment,
  Grid,
  Button,
  Header,
  Item,
  Image,
  Input
} from "semantic-ui-react";
/// Application

import { MDBModalBody } from "mdbreact";
import { MDBModalW } from "../../lib/MDBModalW";

import { BookmarksInsert } from "./Insert";

/// Custom - AutoForm - collection
import { Maps_Bookmarks_Collection } from "@imports/api/Maps/Bookmarks_Collection";
console.assert(
  Maps_Bookmarks_Collection,
  "Maps_Bookmarks_Collection is undefined."
);
/// Custom - AutoForm - collection --

class _BookmarksView extends React.Component {
  "use strict";

  constructor(props) {
    console.log(new Date().getTime(), "BookmarksLocalCollection constructor");
    super(props);

    this.state = {
      // showBookmarkModal: false,
      showBookmarkEdit: false,
      showBookmarkNameEdit: false,
      showBookmarkDelete: false,
      bookmark: {},
      bookmarkTitle: "",
      editRows: []
    };

    this.window_innerHeight = window.innerHeight;
  }

  /**
   *
   *
   * @memberof _BookmarksView
   */
  // onClickBookmark = bookmark => {
  //   this.setState({ showBookmarkModal: true, bookmark: bookmark });
  // };

  /**
   *
   *
   * @memberof _BookmarksView
   */
  // toggleBookmarkModal = () => {
  //   this.setState({ showBookmarkModal: !this.state.showBookmarkModal });
  // };

  /**
   *
   *
   * @memberof _BookmarksView
   */
  onClickBookmarkModalConfirm = () => {
    this.scrollTo(this.state.bookmark.coordinates);
    this.setZoomLevel(this.state.bookmark.zoomLevel);
    this.props.close();
    this.setState({ showBookmarkDelete: false });
  };

  /**
   *
   *
   * @memberof _BookmarksView
   */
  onClickBookmarkModalCancel = () => {
    this.setState({ showBookmarkDelete: false });
  };

  /**
   *
   *
   * @memberof _BookmarksView
   */
  // BookmarkModal = () => {
  //   return (
  //     <React.Fragment>
  //       <MDBModalW
  //         size="large"
  //         isOpen={this.state.showBookmarkModal}
  //         toggle={this.toggleBookmarkModal}
  //         className="m-0 p-0 pinmodal-style"
  //       >
  //         <MDBModalHeader>
  //           <p
  //             className="font-family bookmodal-font"
  //             id="modal-padding"
  //             style={{
  //               textAlign: "center"
  //             }}
  //           >
  //             ブックマークに移動しますか？
  //           </p>
  //         </MDBModalHeader>
  //         <MDBModalBody>
  //           <p className="font-family bookmodal-font" id="modal-padding">
  //             事務所近郊(Sランク)
  //           </p>
  //         </MDBModalBody>
  //         <MDBModalBody id="modal-padding" className="bookmark-edit-body2">
  //           <Grid>
  //             <Grid.Row style={{ padding: "14px" }}>
  //               <Image
  //                 src="/smsk-front/マップアイコン.svg"
  //                 style={{ marginRight: "5px" }}
  //               />
  //               <p className="font-family bookmodal-font">
  //                 {this.state.bookmark.title}
  //               </p>
  //             </Grid.Row>
  //           </Grid>
  //         </MDBModalBody>
  //         <MDBModalBody id="modal-padding" className="bookmark-edit-body3">
  //           <Grid>
  //             <Grid.Row style={{ paddingBottom: "0px" }}>
  //               <Grid.Column width={5} id="bookmodal-rank">
  //                 <p
  //                   className="font-family bookmodal-font"
  //                   style={{ marginLeft: "5px" }}
  //                 >
  //                   【ランク】
  //                 </p>
  //               </Grid.Column>
  //               <Grid.Column width={11} style={{ padding: "0px" }}>
  //                 <p className="font-family bookmodal-font">
  //                   S,A,B,C,D,E,禁止,転居,未訪問,他党支持,不明
  //                 </p>
  //               </Grid.Column>
  //             </Grid.Row>
  //             <Grid.Row style={{ paddingBottom: "0px" }}>
  //               <Grid.Column width={4} id="bookmodal-tag">
  //                 <p
  //                   className="font-family bookmodal-font"
  //                   style={{ marginLeft: "5px" }}
  //                 >
  //                   【タグ】
  //                 </p>
  //               </Grid.Column>
  //               <Grid.Column width={12} style={{ padding: "0px" }}>
  //                 <p className="font-family bookmodal-font">2019,2018</p>
  //               </Grid.Column>
  //             </Grid.Row>
  //             <Grid.Row style={{ paddingBottom: "0px" }}>
  //               <Grid.Column width={6} id="bookmodal-status">
  //                 <p
  //                   className="font-family bookmodal-font"
  //                   style={{ marginLeft: "5px" }}
  //                 >
  //                   【ステータス】
  //                 </p>
  //               </Grid.Column>
  //               <Grid.Column width={9} style={{ padding: "0px" }}>
  //                 <p className="font-family bookmodal-font">
  //                   本人,面会,在宅,留守
  //                 </p>
  //               </Grid.Column>
  //             </Grid.Row>
  //           </Grid>
  //         </MDBModalBody>
  //         <MDBModalBody id="modal-padding3">
  //           <Grid>
  //             <Grid.Row className="modal-padding2">
  //               <Grid.Column width={8} className="bookmodal-btn-style">
  //                 <Button
  //                   onClick={this.onClickBookmarkModalCancel}
  //                   className="font-famiy bookmodal-btn modal-no"
  //                 >
  //                   いいえ
  //                 </Button>
  //               </Grid.Column>
  //               <Grid.Column width={8} className="bookmodal-btn-style">
  //                 <Button
  //                   onClick={this.onClickBookmarkModalConfirm}
  //                   className="font-famiy bookmodal-btn modal-yes"
  //                 >
  //                   はい
  //                 </Button>
  //               </Grid.Column>
  //             </Grid.Row>
  //           </Grid>
  //         </MDBModalBody>
  //       </MDBModalW>
  //     </React.Fragment>
  //   );
  // };

  /**
   *
   *
   * @memberof MapsSP_Consumers_Detail
   */
  onClickBookmarksInsert = () => {
    this.setState({ showModal: false, showBookmarksInsert: true });
  };

  /**
   *
   *
   * @memberof MapsSP_Consumers_Detail
   */
  toggleBookmarksInsert = () => {
    this.setState({ showBookmarksInsert: !this.state.showBookmarksInsert });
  };

  /**
   *
   *
   * @memberof MapsSP_Consumers_Detail
   */
  closeBookmarksInsert = () => {
    this.setState({ showBookmarksInsert: false });
  };

  /**
   *
   *
   * @memberof _BookmarksView
   */
  onClickBookmarkEdit = bookmark => {
    this.setState({ showBookmarkEdit: true, bookmark: bookmark });
  };

  /**
   *
   *
   * @memberof _BookmarksView
   */
  toggleBookmarkEdit = () => {
    this.setState({ showBookmarkEdit: !this.state.showBookmarkEdit });
    // this.setState({ showBookmarkEdit: false });
  };

  /**
   *
   *
   * @memberof _BookmarksView
   */
  closeBookmarkEdit = () => {
    this.setState({ showBookmarkEdit: false });
  };

  /**
   *
   *
   * @memberof _BookmarksView
   */
  onClickEditRow = _id => {
    let editRows = Object.assign([], this.state.editRows);

    if (editRows.indexOf(_id) == -1) {
      editRows.push(_id);
    } else {
      editRows = editRows.filter(r => r._id != _id);
    }
    this.setState({ editRow: editRows });
  };

  /**
   *
   *
   * @memberof _BookmarksView
   */
  onClickBookmarkNameEdit = () => {
    this.setState({
      showBookmarkNameEdit: true,
      bookmarkTitle: this.state.bookmark.title
    });
  };

  /**
   *
   *
   * @memberof _BookmarksView
   */
  toggleBookmarkNameEdit = () => {
    this.setState({ showBookmarkNameEdit: !this.state.showBookmarkNameEdit });
  };

  /**
   *
   *
   * @memberof _BookmarksView
   */
  closeBookmarkNameEdit = () => {
    this.setState({ showBookmarkNameEdit: false });
  };

  /**
   *
   *
   * @memberof Maps_Consumers_View_Edit
   */
  onChangeBookmarkNameEdit = event => {
    this.setState({ bookmarkTitle: event.target.value });
  };

  /**
   *
   *
   * @memberof Maps_Consumers_View_Edit
   */
  onClickSaveBookmarkName = () => {
    const Users_Groups_id = Session.get("Users_Groups_id");
    const doc = this.state.bookmark;
    doc.title = this.state.bookmarkTitle;
    Persister.call(
      "Maps_Bookmarks.update",
      Users_Groups_id,
      doc._id,
      doc,
      this.updateCallback
    );
    this.closeBookmarkEdit();
    this.closeBookmarkNameEdit();
    this.closeBookmarkDelete();
  };

  /**
   *
   *
   * @memberof _BookmarksView
   */
  onClickBookmarkDelete = () => {
    this.setState({ showBookmarkDelete: true });
  };

  /**
   *
   *
   * @memberof _BookmarksView
   */
  toggleBookmarkDelete = () => {
    this.setState({ showBookmarkDelete: !this.state.showBookmarkDelete });
  };

  /**
   *
   *
   * @memberof _BookmarksView
   */
  closeBookmarkDelete = () => {
    this.setState({ showBookmarkDelete: false });
  };

  /**
   *
   *
   * @param {*} error
   * @memberof BookmarksLocalCollection
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

  /**
   *
   *
   * @memberof _BookmarksView
   */
  onClickDelete = () => {
    console.log("onClickDelete ------------------------------------------");
    const Users_Groups_id = Session.get("Users_Groups_id");
    const doc = this.state.bookmark;
    Persister.call(
      "Maps_Bookmarks.remove",
      Users_Groups_id,
      doc._id,
      doc,
      this.updateCallback
    );
    this.closeBookmarkEdit();
    this.closeBookmarkNameEdit();
    this.closeBookmarkDelete();
  };

  /* global index */
  /* global bookmark */

  /**
   *
   *
   * @memberof _BookmarksView
   */
  BookmarkEdit = bookmark => {
    return (
      <React.Fragment>
        <MDBModalBody>
          <p
            className="font-family bookmodal-font"
            id="modal-padding"
            style={{ fontWeight: "bold" }}
          >
            事務所近郊(Sランク)
          </p>
        </MDBModalBody>
        <MDBModalBody id="modal-padding" className="bookmark-edit-body2">
          <Grid>
            <Grid.Row style={{ padding: "14px" }}>
              <Image
                src="/smsk-front/マップアイコン.svg"
                style={{ marginRight: "5px" }}
              />
              <p className="font-family bookmodal-font">
                {this.state.bookmark.title}
              </p>
            </Grid.Row>
          </Grid>
        </MDBModalBody>
        <MDBModalBody id="modal-padding" className="bookmark-edit-body3">
          <Grid>
            <Grid.Row style={{ paddingBottom: "0px" }}>
              <Grid.Column width={5} id="bookmodal-rank">
                <p
                  className="font-family bookmodal-font"
                  style={{ marginLeft: "5px" }}
                >
                  【ランク】
                </p>
              </Grid.Column>
              <Grid.Column width={11} style={{ padding: "0px" }}>
                <p className="font-family bookmodal-font">
                  S,A,B,C,D,E,禁止,転居,未訪問,他党支持,不明
                </p>
              </Grid.Column>
            </Grid.Row>
            <Grid.Row style={{ paddingBottom: "0px" }}>
              <Grid.Column width={4} id="bookmodal-tag">
                <p
                  className="font-family bookmodal-font"
                  style={{ marginLeft: "5px" }}
                >
                  【タグ】
                </p>
              </Grid.Column>
              <Grid.Column width={12} style={{ padding: "0px" }}>
                <p className="font-family bookmodal-font">2019,2018</p>
              </Grid.Column>
            </Grid.Row>
            <Grid.Row style={{ paddingBottom: "0px" }}>
              <Grid.Column width={6} id="bookmodal-status">
                <p
                  className="font-family bookmodal-font"
                  style={{ marginLeft: "5px" }}
                >
                  【ステータス】
                </p>
              </Grid.Column>
              <Grid.Column width={9} style={{ padding: "0px" }}>
                <p className="font-family bookmodal-font">
                  本人,面会,在宅,留守
                </p>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </MDBModalBody>
      </React.Fragment>
    );
  };

  // ブックマーク名を編集をクリックすると出てくるモーダル
  /**
   *
   *
   * @memberof _BookmarksView
   */
  BookmarkNameEdit = () => {
    return (
      <React.Fragment>
        <MDBModalBody
          onClick={this.closeBookmarkNameEdit}
          className="modal-close"
        >
          <Image src="/smsk-front/×.svg" style={{ float: "right" }} />
        </MDBModalBody>
        <MDBModalBody>
          <p
            className="font-family bookmodal-font"
            style={{ fontWeight: "bold", padding: "30px" }}
          >
            ブックマーク名を編集
          </p>
          <Input
            value={this.state.bookmarkTitle}
            onChange={this.onChangeBookmarkNameEdit}
            transparent
            placeholder=""
            size="big"
            className="pinmodal-input"
            style={{ margin: "0 30px", width: "80%" }}
          />
        </MDBModalBody>
        <MDBModalBody id="modal-padding" className="bookmark-edit-body2">
          <Grid>
            <Grid.Row style={{ padding: "14px" }}>
              <Image
                src="/smsk-front/マップアイコン.svg"
                style={{ marginRight: "5px" }}
              />
              <p className="font-family bookmodal-font">
                {this.state.bookmark.title}
              </p>
            </Grid.Row>
          </Grid>
        </MDBModalBody>
        <MDBModalBody id="modal-padding" className="bookmark-edit-body3">
          <Grid>
            <Grid.Row style={{ paddingBottom: "0px" }}>
              <Grid.Column width={5} id="bookmodal-rank">
                <p
                  className="font-family bookmodal-font"
                  style={{ marginLeft: "5px" }}
                >
                  【ランク】
                </p>
              </Grid.Column>
              <Grid.Column width={11} style={{ padding: "0px" }}>
                <p className="font-family bookmodal-font">
                  S,A,B,C,D,E,禁止,転居,未訪問,他党支持,不明
                </p>
              </Grid.Column>
            </Grid.Row>
            <Grid.Row style={{ paddingBottom: "0px" }}>
              <Grid.Column width={4} id="bookmodal-tag">
                <p
                  className="font-family bookmodal-font"
                  style={{ marginLeft: "5px" }}
                >
                  【タグ】
                </p>
              </Grid.Column>
              <Grid.Column width={12} style={{ padding: "0px" }}>
                <p className="font-family bookmodal-font">2019,2018</p>
              </Grid.Column>
            </Grid.Row>
            <Grid.Row style={{ paddingBottom: "0px" }}>
              <Grid.Column width={6} id="bookmodal-status">
                <p
                  className="font-family bookmodal-font"
                  style={{ marginLeft: "5px" }}
                >
                  【ステータス】
                </p>
              </Grid.Column>
              <Grid.Column width={9} style={{ padding: "0px" }}>
                <p className="font-family bookmodal-font">
                  本人,面会,在宅,留守
                </p>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </MDBModalBody>
        <MDBModalBody>
          <Button
            onClick={this.onClickSaveBookmarkName}
            className="font-family bookmarkmodal-btn"
          >
            変更
          </Button>
        </MDBModalBody>
      </React.Fragment>
    );
  };

  // ブックマークを削除をクリックした時
  /**
   *
   *
   * @memberof _BookmarksView
   */
  BookmarkDelete = () => {
    return (
      <React.Fragment>
        <MDBModalBody
          style={{ borderBottom: "solid 1px #dadada", padding: "20px" }}
        >
          <p
            className="font-family"
            style={{ fontSize: "15px", textAlign: "center", color: "#313131" }}
          >
            このブックマークを削除します。よろしいですか？
          </p>
        </MDBModalBody>
        <MDBModalBody>
          <Grid>
            <Grid.Row className="modal-padding2">
              <Grid.Column width={8} className="bookmodal-btn-style">
                <Button
                  onClick={this.onClickBookmarkModalCancel}
                  className="font-famiy bookmarkmodal-delite modal-can"
                  style={{ fontWeight: "normal" }}
                >
                  キャンセル
                </Button>
              </Grid.Column>
              <Grid.Column width={8} className="bookmodal-btn-style">
                <Button
                  onClick={this.onClickDelete}
                  className="font-famiy bookmarkmodal-delite modal-del"
                >
                  削除
                </Button>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </MDBModalBody>
      </React.Fragment>
    );
  };

  /**
   *
   *
   * @memberof _Maps_Bookmarks_View
   */
  scrollTo = posWorld => {
    console.log(new Date().getTime(), "BookmarksLocalCollection scrollTo");

    window.$GLOBAL$.__MapView__.scrollTo(posWorld);
  };

  /**
   *
   *
   * @memberof _Maps_Bookmarks_View
   */
  setZoomLevel = zoomLevel => {
    console.log(new Date().getTime(), "BookmarksLocalCollection setZoomLevel");

    window.$GLOBAL$.__MapView__.setZoomLevel(zoomLevel);
  };

  /**
   *
   *
   * @returns
   * @memberof _BookmarksView
   */
  render() {
    console.log(new Date().getTime(), "BookmarksView render");

    /// Custom - Collection - subscribe
    if (this.props.loading) {
      return <span />;
    }
    /// Custom - Collection - subscribe --

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
              <Grid.Column width={14} className="center aligned content header">
                <Header as="h2" className="font-color font-family header-font">
                  ブックマーク
                </Header>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Segment>
        {/* Link end */}

        {/* 新規追加 start */}
        <Segment basic className="add-new" style={{ margin: "0px" }}>
          <Button
            onClick={this.onClickBookmarksInsert}
            className="font-family add-new-btn"
            style={{ marginTop: "4px" }}
          >
            <Image
              src={window.$GLOBAL$.__SVG__["新規追加"]}
              className="add-new-img"
            />
            <p className="add-new-text">新規追加</p>
          </Button>
        </Segment>
        {/* 新規追加 end */}

        {/* スクロールエリア start */}
        <Segment
          className="scroll-area"
          style={{ height: this.window_innerHeight - 64 + "px" }}
        >
          <Segment padded className="main-area">
            <Item.Group divided>
              {
                <For each="bookmark" index="index" of={this.props.bookmarks}>
                  <Item key={index} className="bookmark-padding">
                    <Grid style={{ height: "68px" }}>
                      <Grid.Row>
                        <Grid.Column width={3} className="bookmark-img">
                          <Image src="/smsk-front/ブックマーク（グレー）.svg" />
                        </Grid.Column>
                        <Grid.Column width={13} className="bookmark-item">
                          <Item.Meta className="font-family  font-color bookmark-meta left floated">
                            {bookmark.title}
                          </Item.Meta>
                        </Grid.Column>
                      </Grid.Row>
                      <Image
                        onClick={() => this.onClickBookmarkEdit(bookmark)}
                        src="/smsk-front/ブックマーク編集.png"
                        className="middle aligned"
                        style={{
                          left: "305px",
                          bottom: "39px",
                          width: "60px",
                          height: "19px"
                        }}
                      />
                    </Grid>
                  </Item>
                </For>
              }
            </Item.Group>
          </Segment>
        </Segment>
        {/* スクロールエリア end */}

        {/* {this.BookmarkModal()} */}

        <MDBModalW
          size="large"
          isOpen={this.state.showBookmarkEdit}
          toggle={this.toggleBookmarkEdit}
          className="bookmark-edit"
          id="modal-black"
        >
          {this.BookmarkEdit()}
        </MDBModalW>

        <MDBModalW
          size="large"
          isOpen={this.state.showBookmarkEdit}
          toggle={this.toggleBookmarkEdit}
          className="bookmark-edit2"
        >
          <MDBModalBody
            style={{ borderBottom: "solid 1px #dadada" }}
            onClick={this.onClickBookmarkModalConfirm}
          >
            <p className="font-family font-color" style={{ fontSize: "15px" }}>
              移動する
            </p>
          </MDBModalBody>
          <MDBModalBody
            style={{ borderBottom: "solid 1px #dadada" }}
            onClick={this.onClickBookmarkNameEdit}
          >
            <p className="font-family font-color" style={{ fontSize: "15px" }}>
              ブックマーク名を編集
            </p>
          </MDBModalBody>
          <MDBModalBody>
            <p
              className="font-family"
              style={{ color: "#dd3b3b", fontSize: "15px" }}
              onClick={this.onClickBookmarkDelete}
            >
              ブックマークを削除
            </p>
          </MDBModalBody>
        </MDBModalW>

        <MDBModalW
          size="large"
          isOpen={this.state.showBookmarkNameEdit}
          toggle={this.toggleBookmarkNameEdit}
          className="bookmark-edit"
          id="modal-white"
        >
          {this.BookmarkNameEdit()}
        </MDBModalW>

        <MDBModalW
          size="large"
          isOpen={this.state.showBookmarkDelete}
          toggle={this.toggleBookmarkDelete}
          className="bookmark-delite pinmodal-style2"
          id="modal-white"
        >
          {this.BookmarkDelete()}
        </MDBModalW>

        <MDBModalW
          size="large"
          isOpen={this.state.showBookmarksInsert}
          toggle={this.toggleBookmarksInsert}
          className="m-0 p-0 pinmodal-style"
        >
          <BookmarksInsert close={this.closeBookmarksInsert} />
        </MDBModalW>
      </React.Fragment>
    );
  }
}

/// Custom - View - tracker
export const BookmarksView = withTracker(() => {
  /// Custom - Collection - subscribe
  const handles = [];
  const loading = handles.some(handle => !handle.ready());
  console.log(new Date().getTime(), "Bookmark loading", loading);

  return {
    bookmarks: Maps_Bookmarks_Collection.find(),
    loading: loading
  };
  /// Custom - Collection - subscribe --
})(_BookmarksView);
/// Custom - View - tracker --
