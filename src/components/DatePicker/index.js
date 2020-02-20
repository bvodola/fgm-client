import React from "react";
import ReactDatePicker from "react-date-picker";
import { createGlobalStyle } from "styled-components";

const GlobalStyle = createGlobalStyle`

.react-date-picker {
  width: 100%;
}
.react-date-picker__wrapper {
    background: #f9fbfd;
    border: 0;
    border-radius: 8px;
    padding: 11px;
    transition: box-shadow 0.3s ease, background 0.3s ease;

    &:hover {
      background-color: rgba(0, 68, 102, 0.04);
    }

    &:focus {
      outline: 0;
      background-color: #fff;
      box-shadow: 0 0 10px 0 rgba(0, 49, 59, 0.1),
        0 1px 3px 0 rgba(0, 59, 71, 0.2);
    }
  }
`;

const DatePicker = props => (
  <React.Fragment>
    <GlobalStyle />
    <ReactDatePicker
      className={props.className}
      calendarIcon={props.calendarIcon}
      clearIcon={props.clearIcon}
      value={props.value}
      onChange={props.onChange}
      locale={props.locale}
    />
  </React.Fragment>
);

DatePicker.defaultProps = {
  className: "date-picker",
  calendarIcon: null,
  clearIcon: null,
  value: null,
  onChange: () => {},
  locale: "pt"
};

export default DatePicker;
