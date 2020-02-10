import React from "react";
import styled from "styled-components";

const StyledTable = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const StyledTr = styled.tr`
  display: flex;
  justify-content: space-between;
  border-bottom: 1px solid #eee;

  td {
    padding: 25px 0px;
  }

  ${StyledTr}:last-child {
    border-bottom: none;
  }
`;

const StyledTd = styled.td`
  .icon {
    margin-left: 4px;
    margin-right: 4px;
  }
`;

const Table = ({ children, ...props }) => (
  <StyledTable {...props}>
    <tbody>{children}</tbody>
  </StyledTable>
);

const Tr = ({ children, ...props }) => (
  <StyledTr {...props}>{children}</StyledTr>
);

const Td = ({ children, ...props }) => (
  <StyledTd {...props}>{children}</StyledTd>
);

export { Table, Tr, Td };
