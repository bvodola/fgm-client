import styled from "styled-components";

const Section = styled.div`
  background: #fff;
  display: flex;
  flex-direction: column;
  ${props => props.theme.padded}
  padding-top: 20px;
  padding-bottom: 20px;
  ${props =>
    props.variant === "box" &&
    `
    background: #fff;
    padding: 40px;
    margin: 0px 25%;
    border: 2px solid #dfdfdf;
    border-radius: 4px;
}
  `}
`;

export default Section;
