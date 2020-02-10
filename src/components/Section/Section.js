import styled from "styled-components";

const Section = styled.div`
  background: #fff;
  ${props => props.theme.padded}
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
