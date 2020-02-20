import React from "react";
import styled from "styled-components";

const H1 = styled.h1`
  color: ${props => props.theme.colors.darkBlue};
  text-align: center;
  font-family: "Gotham";
  font-weight: bold;
`;

const H2 = styled.h2`
  color: ${props => props.theme.colors.darkBlue};
  font-family: "Gotham";
  font-weight: bold;
`;

const P = styled.p`
  color: ${props => props.theme.colors.darkGray};
  margin: 0;
`;

const Label = styled.label`
  color: ${props => props.theme.colors.darkGray};
  margin: 0;
  font-weight: bold;
`;

const Text = props => {
  switch (props.variant) {
    case "h1": {
      return <H1 {...props} />;
    }

    case "h2": {
      return <H2 {...props} />;
    }

    case "label": {
      return <Label {...props} />;
    }

    default: {
      return <P {...props} />;
    }
  }
};

export default Text;
