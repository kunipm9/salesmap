import React from "react";
import { MDBDatePicker, Container } from "mdbreact";
import DocsLink from "../DocsLink";

// import moment from 'moment';
// import 'moment/locale/pl';

// moment.locale('pl');

class DatePickerPage extends React.Component {
  getPickerValue = value => {
    console.log(value);
  };

  render() {
    return (
      <Container>
        <DocsLink
          title="Date Picker"
          href="https://mdbootstrap.com/docs/react/forms/date-picker/"
        />
        <MDBDatePicker getValue={this.getPickerValue} />
      </Container>
    );
  }
}

export default DatePickerPage;
