import React from "react";
import styled from "styled-components";

const H1 = styled.h1`
  color: ${props => props.theme.colors.darkBlue};
  text-align: center;
  font-family: "Gotham";
  font-weight: bold;
`;

const P = styled.p`
  color: ${props => props.theme.colors.darkGray};
`;

const Text = props => {
  switch (props.variant) {
    case "h1": {
      return <H1 {...props} />;
    }

    default: {
      return <P {...props} />;
    }
  }
};

export default Text;
