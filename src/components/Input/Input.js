import React from "react";
import styled from "styled-components";

const style = `
  border: 0;
  border-radius: 6px;
  padding: 12px 15px 10px;
  background-color: #f9fbfd;
  transition: box-shadow 0.3s ease, background 0.3s ease;
  font-size: 13px;
  line-height: 18px;
  color: #475b6f;
  width: 100%;
  margin-top: 24px;

  &:hover {
    background-color: rgba(0, 68, 102, 0.04);
  }

  &:focus {
    outline: 0;
    background-color: #fff;
    box-shadow: 0 0 10px 0 rgba(0, 49, 59, 0.1),
      0 1px 3px 0 rgba(0, 59, 71, 0.2);
  }
`;

const StyledInput = styled.input`
  ${style}
`;

const StyledTextArea = styled.textarea`
  ${style}
  resize: none;
`;

const Input = props =>
  props.type === "textarea" ? (
    <StyledTextArea {...props} />
  ) : (
    <StyledInput {...props} />
  );
export default Input;
