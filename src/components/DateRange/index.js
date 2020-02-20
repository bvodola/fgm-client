import React from "react";
import DateRangePicker from "@wojtekmaj/react-daterange-picker/";
import { createGlobalStyle } from "styled-components";

const GlobalStyle = createGlobalStyle`
.react-daterange-picker__wrapper {
    border-radius: 8px;
    padding: 8px;
  }
`;

const DateRange = props => (
  <React.Fragment>
    <GlobalStyle />
    <DateRangePicker
      className={props.className}
      calendarIcon={props.calendarIcon}
      clearIcon={props.clearIcon}
      value={props.value}
      onChange={props.onChange}
      locale={props.locale}
    />
  </React.Fragment>
);

DateRange.defaultProps = {
  className: "date-range",
  calendarIcon: null,
  clearIcon: null,
  value: null,
  onChange: () => {},
  locale: "pt"
};

export default DateRange;
