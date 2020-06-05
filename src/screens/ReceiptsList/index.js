import React from "react";
import { format } from "date-fns";
import styled from "styled-components";
import { Link } from "react-router-dom";
import {
  Section,
  Text,
  Table,
  Tr,
  Td,
  Filters,
  Row,
  Button
} from "src/components";
import api from "src/api";

const RecepitsTable = styled(Table)`
  @media (min-width: 900px) {
    font-size: 13px;
  }
  font-size: 10px;

  tr {
    td:nth-child(1) {
      flex: 10%;
    }

    td:nth-child(2) {
      flex: 30%;
    }

    td:nth-child(3) {
      flex: 20%;
    }

    td:nth-child(4) {
      flex: 20%;
    }

    td:nth-child(5),
    td:nth-child(6) {
      font-weight: bold;
      flex: 10%;
      text-align: center;
    }
    td.action-button {
      flex: 10%;
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
      users: [],
      filterByDate: false,
      dateRange: [null, null]
    };

    this.handleDateRange = this.handleDateRange.bind(this);
    this.handleFilterByDate = this.handleFilterByDate.bind(this);
  }

  async componentDidMount() {
    try {
      let users = [];
      if (this.props.loggedInUser.role === "ADMIN") {
        users = await api.getUsers(
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
      } else {
        users = await api.getUsers(
          {
            _id: this.props.loggedInUser._id
          },
          "_id created receipts {dental_name amount code files}"
        );
      }

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

  handleDateRange(dateRange) {
    this.setState({ dateRange });
  }

  handleFilterByDate(value) {
    this.setState({ filterByDate: value });
  }

  getTableData() {
    const { users, dateRange, filterByDate } = this.state;
    let tableData = [];

    users.forEach(user => {
      user.receipts.forEach(receipt => {
        // Get the Receipt or User Created Date
        const createdDate = new Date(Number(receipt.created || user.created));
        if (
          !filterByDate ||
          (Array.isArray(dateRange) &&
            createdDate >= dateRange[0] &&
            createdDate <= dateRange[1])
        ) {
          tableData.push({
            user,
            receipt
          });
        }
      });
    });
    console.log(tableData);
    return tableData;
  }

  getXlsData(tableData) {
    try {
      let xlsData = tableData.map(e => [
        format(new Date(Number(e.user.created)), "dd/MM/yyyy HH:mm"),
        e.user.name,
        e.user.email,
        e.user.phone,
        e.user.cro,
        e.user.cpf,
        e.user.rg_cnpj,
        e.receipt.approved ? "Sim" : "Não",
        e.receipt.dental_name,
        e.receipt.code,
        e.receipt.amount,
        e.receipt.files[0]
      ]);

      xlsData = [
        [
          "Data",
          "Nome",
          "Email",
          "Telefone",
          "CRO",
          "CPF",
          "RG/CNPJ",
          "Aprovada?",
          "Dental",
          "Código da Nota",
          "Valor",
          "Arquivo"
        ],
        ...xlsData
      ];

      return xlsData;
    } catch (err) {
      console.log(err);
    }
  }

  render() {
    const tableData = this.getTableData();
    const xlsData = this.getXlsData(tableData);
    const { loggedInUser } = this.props;

    return (
      <div>
        <Text variant="h1">Notas Fiscais</Text>
        <Section>
          {loggedInUser.role === "ADMIN" && (
            <React.Fragment>
              <Filters
                filterByDate={this.state.filterByDate}
                handleFilterByDate={this.handleFilterByDate}
                dateRange={this.state.dateRange}
                handleDateRange={this.handleDateRange}
              />

              <Row>
                <Button
                  style={{
                    fontSize: "15px"
                  }}
                  onClick={() =>
                    api.downloadExcelReport(xlsData, "notas_fiscais")
                  }
                >
                  Baixar em Excel
                </Button>
              </Row>
            </React.Fragment>
          )}

          {loggedInUser.role === "CLIENT" && (
            <Row>
              <Link to="cadastrar-nota">
                <Button>Cadastrar Nota</Button>
              </Link>
            </Row>
          )}

          <Row padded>
            <Text>{tableData.length} notas fiscais cadastrada(s)</Text>
          </Row>
          <Row padded>
            <RecepitsTable>
              <Tr className="header">
                <Td>Data</Td>
                {loggedInUser.role === "ADMIN" && <Td>Cliente</Td>}
                {loggedInUser.role === "ADMIN" && <Td>Documentos</Td>}
                <Td>Nota Fiscal</Td>
                <Td className="action-button">&nbsp;</Td>
                {loggedInUser.role === "ADMIN" && (
                  <Td className="action-button">&nbsp;</Td>
                )}
              </Tr>
              {tableData.map(row => (
                <Tr key={row.receipt._id}>
                  <Td>
                    {format(Number(row.user.created), "dd/MM/yyyy")} <br />{" "}
                    {format(Number(row.user.created), "HH:mm")}
                  </Td>
                  {loggedInUser.role === "ADMIN" && (
                    <Td>
                      <i>{row.user.name}</i> <br />
                      {row.user.email} <br />
                      {row.user.phone}
                    </Td>
                  )}
                  {loggedInUser.role === "ADMIN" && (
                    <Td>
                      CRO: {row.user.cro} <br />
                      CPF: {row.user.cpf} <br />
                      RG/CNPJ: {row.user.rg_cnpj}
                    </Td>
                  )}
                  <Td>
                    {row.receipt.dental_name} <br />
                    No: {row.receipt.code} <br />
                    R$ {row.receipt.amount}
                  </Td>
                  <Td className="action-button">
                    Ver Nota <br />
                    <a href={row.receipt.files[0]} target="_blank">
                      <img src="/public/download.png" alt="" />
                    </a>
                  </Td>
                  {loggedInUser.role === "ADMIN" && (
                    <Td className="action-button">
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
                  )}
                </Tr>
              ))}
            </RecepitsTable>
          </Row>
        </Section>
      </div>
    );
  }
}

export default ReceitsList;
