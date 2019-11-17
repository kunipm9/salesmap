import React from "react";
import { MDBModal } from "mdbreact";

export class MDBModalW extends React.Component {
  constructor(props) {
    super(props);

    this.id = new Date().getTime();
    this.propOpened(props.isOpen);
  }

  componentDidMount() {
    this.propOpened(this.props.isOpen);
  }

  componentWillUnmount() {
    delete window.$GLOBAL$.Modals[this.id];
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    this.propOpened(nextProps.isOpen);
  }

  propOpened(isOpen) {
    if (isOpen) {
      window.$GLOBAL$.Modals[this.id] = isOpen;
    } else {
      delete window.$GLOBAL$.Modals[this.id];
    }
    if (Object.keys(window.$GLOBAL$.Modals).length) {
      setTimeout(() => {
        document.body.classList.add("mdbmodal-open");
      }, 500);
    } else {
      document.body.classList.remove("mdbmodal-open");
    }
  }

  render() {
    return <MDBModal {...this.props} />;
  }
}
