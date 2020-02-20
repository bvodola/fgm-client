import React from "react";
import styled from "styled-components";

const Row = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  margin-top: ${props => (props.padded ? "36px" : props.mTop || "0")};
  align-items: ${props => props.alignItems || "center"};

  @media (max-width: 900px) {
    flex-direction: column;
  }
`;

const Col = styled.div`
  display: flex;
  align-items: ${props => props.alignItems || "flex-start"};
  flex: ${props => (props.size ? props.size : 1)};
  flex-direction: column;
`;

export { Row, Col };
