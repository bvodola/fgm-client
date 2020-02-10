import React from "react";
import { format } from "date-fns";
import { Section, Text, Table, Tr, Td } from "src/components";
import api from "src/api";

import styled from "styled-components";

const RecepitsTable = styled(Table)`
  font-size: 13px;
  tr {
    td:nth-child(1) {
      width: 10%;
    }

    td:nth-child(2) {
      width: 30%;
    }

    td:nth-child(3) {
      width: 20%;
    }

    td:nth-child(4) {
      width: 20%;
    }

    td:nth-child(5),
    td:nth-child(6) {
      font-weight: bold;
      width: 10%;
      text-align: center;
      img {
        width: 32px;
      }
    }
  }

  tr.header td {
    font-weight: bold;
    font-family: "Gotham";
  }
`;

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

class ReceitsList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      users: []
    };
  }

  async componentDidMount() {
    try {
      const users = await api.getUsers(
        {},
        `
          _id
          created
          name
          email
          phone
          cro
          cpf
          rg_cnpj
          receipts {
            _id
            approved
            dental_name
            code
            amount
            files
          }
        `
      );
      this.setState({ users });
    } catch (err) {
      console.log(err);
    }
  }

  async toggleApproveReceipt(userId, receiptId, newStatus) {
    try {
      const user = this.state.users.find(u => u._id === userId);
      const receipts = user.receipts.map(r => {
        if (r._id === receiptId) r.approved = newStatus;
        return r;
      });

      // Update Locally
      const updatedUsers = this.state.users.map(u => {
        if (u._id === userId) {
          return {
            ...u,
            receipts
          };
        }
        return u;
      });

      this.setState({ users: updatedUsers });

      // Update on server
      const res = await api.editUser({
        _id: userId,
        receipts
      });
    } catch (err) {
      console.log(err);
    }
  }

  render() {
    let tableData = [];
    this.state.users.forEach(user => {
      user.receipts.forEach(receipt => {
        tableData.push({
          user,
          receipt
        });
      });
    });
    console.log(tableData);

    return (
      <div>
        <Text variant="h1">Cadastros Realizados</Text>
        <Section>
          <RecepitsTable>
            <Tr className="header">
              <Td>Data</Td>
              <Td>Client</Td>
              <Td>Documentos</Td>
              <Td>Nota Fiscal</Td>
              <Td>&nbsp;</Td>
              <Td>&nbsp;</Td>
            </Tr>
            {tableData.map(row => (
              <Tr key={row.receipt._id}>
                <Td>
                  {format(Number(row.user.created), "dd/MM/yyyy")} <br />{" "}
                  {format(Number(row.user.created), "HH:mm")}
                </Td>
                <Td>
                  <i>{row.user.name}</i> <br />
                  {row.user.email} <br />
                  {row.user.phone}
                </Td>
                <Td>
                  CRO: {row.user.cro} <br />
                  CPF: {row.user.cpf} <br />
                  RG/CNPJ: {row.user.rg_cnpj}
                </Td>
                <Td>
                  {row.receipt.dental_name} <br />
                  Nota No: {row.receipt.code} <br />
                  R$ {row.receipt.amount}
                </Td>
                <Td>
                  Ver Nota <br />
                  <a href={row.receipt.files[0]} target="_blank">
                    <img src="/public/download.png" alt="" />
                  </a>
                </Td>
                <Td>
                  Aprovada? <br />
                  <CheckboxWrapper
                    onClick={() =>
                      this.toggleApproveReceipt(
                        row.user._id,
                        row.receipt._id,
                        !row.receipt.approved
                      )
                    }
                  >
                    {row.receipt.approved && (
                      <img src="/public/check.png" alt="" />
                    )}
                  </CheckboxWrapper>
                </Td>
              </Tr>
            ))}
          </RecepitsTable>
        </Section>
      </div>
    );
  }
}

export default ReceitsList;
