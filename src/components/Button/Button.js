import styled from "styled-components";

export default styled.button`
  margin-top: 36px;
  padding: 12px 36px;
  border: none;
  font-size: 28px;
  font-family: "Gotham";
  font-weight: 700;
  text-transform: uppercase;
  border-radius: 30px;
  background-color: ${props =>
    props.variant === "success"
      ? props.theme.colors.green
      : props.variant === "info"
      ? props.theme.colors.darkBlue
      : props.theme.colors.red};
  color: white;
  outline: none;
  cursor: pointer;
`;
