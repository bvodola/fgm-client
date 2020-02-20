import React from "react";
import styled from "styled-components";

const CheckboxWrapper = styled.span`
  cursor: pointer;
  background: #fff;
  border: 3px solid #eee;
  width: 32px;
  height: 32px;
  display: inline-block;
  border-radius: 4px;
  img {
    margin-top: -3px;
    margin-left: -3px;
  }
`;

const Checkbox = props => (
  <CheckboxWrapper onClick={props.onClick}>
    {props.checked && <img src="/public/check.png" alt="" />}
  </CheckboxWrapper>
);

export default Checkbox;

Checkbox.defaultProps = {
  onClick: () => {},
  checked: false
};
