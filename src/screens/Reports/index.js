import React from "react";
import api from "src/api";
import {
  Section,
  Text,
  Row,
  Col,
  BarChart,
  Filters,
  Table,
  Tr,
  Td,
  Switch
} from "src/components";

import { format } from "date-fns";

class Reports extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      users: [],
      splitByCompanyType: false,
      filterByDate: false,
      showGraphics: false,
      dateRange: [null, null]
    };
  }

  async componentDidMount() {
    try {
      const users = await api.getUsers(
        { role: "CLIENT" },
        `
          _id
          created
          name
          receipts {
            _id
            approved
            amount
            dental_name
          }
        `
      );
      this.setState({ users });
    } catch (err) {
      console.log(err);
    }
  }

  handleShowGraphics = showGraphics => {
    this.setState({ showGraphics });
  };

  handleSplitByCompanyType = splitByCompanyType => {
    this.setState({ splitByCompanyType });
  };

  getChartData() {
    const { users, dateRange, filterByDate, splitByCompanyType } = this.state;
    let tableData = [];

    users.forEach(user => {
      user.receipts.forEach(receipt => {
        // Loop each receipt

        // The created date is either the one from the receipt or the user
        const createdDate = new Date(Number(receipt.created || user.created));

        // IF condition that filters chart data by the dates chosen in the filter
        if (
          !filterByDate ||
          (Array.isArray(dateRange) &&
            createdDate >= dateRange[0] &&
            createdDate <= dateRange[1])
        ) {
          // Variable setting
          let appendToData = true;
          const startOfDay = new Date(
            `${createdDate.getFullYear()}-${createdDate.getMonth() +
              1}-${createdDate.getDate()}`
          );

          console.log("receipt", receipt);
          // First, we check if the current receipt date is already present on tableData
          tableData = tableData.map(e => {
            if (e[0].getTime() === startOfDay.getTime()) {
              appendToData = false;
              if (splitByCompanyType) {
                if (
                  receipt.dental_name
                    .toLowerCase()
                    .trim()
                    .search("fgm") >= 0
                ) {
                  e[1]++;
                } else {
                  e[2]++;
                }
              } else {
                e[1]++;
              }
            }
            return e;
          });

          // If not, we append it and set the initial numberOfReceipts value
          if (appendToData) {
            if (splitByCompanyType) {
              if (
                receipt.dental_name
                  .toLowerCase()
                  .trim()
                  .search("fgm") >= 0
              ) {
                e[1]++;
                tableData.push([startOfDay, 1, 0]);
              } else {
                tableData.push([startOfDay, 0, 1]);
              }
            } else {
              tableData.push([startOfDay, 1]);
            }
          }
        }
      });
    });

    tableData = splitByCompanyType
      ? [["Data", "FGM", "Dentais"], ...tableData]
      : [["Data", "Notas Fiscais"], ...tableData];
    console.log(tableData);
    return tableData;
  }

  render() {
    const chartData = this.getChartData();
    return (
      <div>
        <Text variant="h1">Relatórios</Text>
        <Section>
          <Text variant="h2">Notas fiscais recebidas</Text>
          <Section variant="box" style={{ margin: 0 }}>
            <Filters
              filterByDate={this.state.filterByDate}
              handleFilterByDate={filterByDate =>
                this.setState({ filterByDate })
              }
              dateRange={this.state.dateRange}
              handleDateRange={dateRange => this.setState({ dateRange })}
            />
            <Row padded style={{ height: "40px" }}>
              <Col>
                <Row>
                  <Switch
                    checked={this.state.showGraphics}
                    onChange={this.handleShowGraphics}
                  />
                  <Text variant="label" style={{ margin: "0 30px 0 10px" }}>
                    Mostrar em formato gráfico
                  </Text>
                </Row>
              </Col>
              <Col>
                <Row>
                  <Switch
                    checked={this.state.splitByCompanyType}
                    onChange={this.handleSplitByCompanyType}
                  />
                  <Text variant="label" style={{ margin: "0 30px 0 10px" }}>
                    Dividir entre Dental / FGM
                  </Text>
                </Row>
              </Col>
            </Row>
          </Section>
          {this.state.showGraphics ? (
            <Row padded>
              {chartData.length > 1 ? (
                <BarChart data={chartData} />
              ) : (
                <Text>Nenhum dado disponível</Text>
              )}
            </Row>
          ) : (
            <Row padded>
              <Table>
                {chartData.map((entry, i) => (
                  <Tr>
                    <Td>
                      {i === 0 ? entry[0] : format(entry[0], "dd/MM/yyyy")}
                    </Td>
                    <Td>{entry[1]}</Td>
                    {entry[2] && <Td>{entry[2]}</Td>}
                  </Tr>
                ))}
              </Table>
            </Row>
          )}
        </Section>
      </div>
    );
  }
}

export default Reports;
