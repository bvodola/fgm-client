import React from "react";
import { format, isThisSecond } from "date-fns";
import { FaTrashAlt, FaEdit } from "react-icons/fa";
import styled from "styled-components";
import FadeIn from "react-fade-in";

import api from "src/api";
import { setFormField } from "src/helpers";
import {
  Section,
  Checkbox,
  Text,
  Row,
  Col,
  Input,
  DatePicker,
  Button,
  Modal,
  Table,
  Tr,
  Td
} from "src/components";
import theme from "src/theme";

const DrawImageWrapper = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;

  img {
    height: 100%;
    width: 120vh;
    }
  }
`;

const DrawingWinners = ({ draw, multiline }) => (
  <React.Fragment>
    {draw.winners.map((winner, i) => (
      <span>
        {!multiline && "•"} {winner.name} {multiline ? <br /> : " - "} Tel.:{" "}
        {winner.phone} (
        <a target="_blank" href={draw.receipts[i].files[0]}>
          Ver nota
        </a>
        ) {multiline ? <br /> : " - "} Prêmio: {draw.prize[i]}
        <br />
        {multiline && <br />}
      </span>
    ))}
  </React.Fragment>
);

class Reports extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      draws: [],
      isModalOpened: false,
      isDrawModalOpened: false,
      selectedDraw: null,
      isDrawInProgress: false,
      form: {
        date_scheduled: null,
        prize: ""
      }
    };

    this.handleSaveDrawForm = this.handleSaveDrawForm.bind(this);
    this.toggleDrawModal = this.toggleDrawModal.bind(this);
    this.handleSubmitDraw = this.handleSubmitDraw.bind(this);
  }

  async componentDidMount() {
    try {
      const draws = await api.getDraws(
        {},
        `
          _id
          created
          prize
          date_scheduled
          date_performed
          winners {
            _id
            name
            phone
          }
          receipts {
            _id
            files
          }
        `
      );
      this.setState({ draws });
    } catch (err) {
      console.log(err);
    }
  }

  handleIsModalOpened = isModalOpened => {
    // If the modal is closing, unset selectedDraw
    if (!isModalOpened && this.state.selectedDraw) {
      setTimeout(() => {
        this.setState({
          selectedDraw: null,
          form: {
            prize: "",
            date_scheduled: null
          }
        });
      }, 200);
    }

    // Opens modal
    this.setState({ isModalOpened });
  };

  handleFormDate = date_scheduled => {
    this.setState(prevState => {
      return {
        ...prevState,
        form: {
          ...prevState.form,
          date_scheduled
        }
      };
    });
  };

  async handleSaveDrawForm(ev) {
    ev.preventDefault();
    let { selectedDraw, form } = this.state;
    let res;

    // ========
    // API Call
    // ========
    if (selectedDraw) {
      // Edit Case
      res = await api.editDraw(
        { _id: selectedDraw, ...form },
        "_id date_scheduled date_performed prize"
      );
    } else {
      // Add Case
      res = await api.addDraw(form, "_id date_scheduled date_performed prize");
    }

    // ============
    // Local Update
    // ============
    if (res.addDraw) {
      // Add Case
      const newDraw = res.addDraw;
      this.setState(prevState => {
        return {
          ...prevState,
          draws: [...prevState.draws, newDraw]
        };
      });
    } else if (res.editDraw) {
      // Edit Case
      const updatedDraw = res.editDraw;
      this.setState(prevState => {
        const updatedDraws = prevState.draws.map(d => {
          if (d._id === selectedDraw) d = updatedDraw;
          return d;
        });
        return {
          ...prevState,
          draws: updatedDraws
        };
      });
    }
    // ===========
    // Close Modal
    // ===========
    this.handleIsModalOpened(false);
  }

  async removeDraw(draw_id) {
    const applyRemove = confirm("Deseja mesmo remover esse sorteio?");
    if (applyRemove) {
      const res = await api.removeDraw({ _id: draw_id });
      this.setState(prevState => {
        const newDraws = prevState.draws.filter(d => d._id !== draw_id);
        return {
          ...prevState,
          draws: newDraws
        };
      });
    }
  }

  async editDraw(draw_id) {
    const selectedDraw = this.state.draws.find(d => d._id === draw_id);
    const form = {
      prize: selectedDraw.prize,
      date_scheduled: new Date(Number(selectedDraw.date_scheduled))
    };

    this.setState({
      selectedDraw: draw_id,
      isModalOpened: true,
      form
    });
  }

  async toggleDrawModal(draw_id = null) {
    console.log(draw_id);
    if (!draw_id) {
      this.setState({ isDrawModalOpened: false, selectedDraw: null });
    } else {
      let selectedDraw = this.state.draws.find(d => d._id === draw_id);
      const form = {
        date_scheduled: new Date(Number(selectedDraw.date_scheduled)),
        prize: selectedDraw.prize
      };

      this.setState({
        selectedDraw: draw_id,
        isDrawModalOpened: true,
        form
      });
    }
  }

  /**
   * Split the Prize String
   * "Prize 1 \n Prize 2 \n Prize 3" ==> ['Prize 1', 'Prize 2', 'Prize 3']
   * @param {String} prizeString
   * @returns {Array} the splitted prizes
   */
  splitPrizeString(prizeString) {
    return prizeString.split("\n").map(p => p.trim());
  }

  async handleSubmitDraw() {
    try {
      this.setState({ isDrawInProgress: true });
      const users = await api.getUsers(
        {},
        "_id name phone receipts{_id files dental_name amount}"
      );
      const draws = await api.getDraws({}, "_id prize receipts{_id }");
      const selectedDraw = draws.find(d => d._id === this.state.selectedDraw);

      // Get all receipts in one array
      let receipts = [];
      users.forEach(u => {
        if (u.receipts)
          u.receipts.forEach(r => {
            receipts.push({
              ...r,
              user: u
            });
          });
      });

      // Filter only receipts that have not been drawn yet
      // receipts = receipts.filter(r => {
      //   let filterEntry = true;
      //   draws.forEach(d => {
      //     if (Array.isArray(d.receipts)) {
      //       d.receipts.forEach(dr => {
      //         if (dr._id === r._id) filterEntry = false;
      //       });
      //     }
      //   });
      //   return filterEntry;
      // });

      // Split Prize String
      // "Prize 1 \n Prize 2 \n Prize 3" ==> ['Prize 1', 'Prize 2', 'Prize 3']
      const draw_prizes = this.splitPrizeString(selectedDraw.prize);

      if (receipts.length >= draw_prizes.length) {
        const drawed_receipt_ids = [];
        const drawed_user_ids = [];

        // Make Draws for each prize
        draw_prizes.forEach(p => {
          const drawedIndex = Math.floor(Math.random() * receipts.length);
          console.log(receipts, drawedIndex, receipts[drawedIndex]);
          drawed_receipt_ids.push(receipts[drawedIndex]._id);
          drawed_user_ids.push(receipts[drawedIndex].user._id);
          receipts.splice(drawedIndex, 1);
        });

        // Call API to save results of the drawing
        let updatedDraw = {
          _id: selectedDraw._id,
          receipt_ids: drawed_receipt_ids,
          winner_ids: drawed_user_ids,
          date_performed: new Date()
        };

        const res = await api.editDraw(
          updatedDraw,
          "_id date_performed winners {_id name phone } receipts { _id code files}"
        );
        updatedDraw = res.editDraw;

        // Update Locally
        this.setState(prevState => {
          const updatedDraws = prevState.draws.map(d => {
            if (d._id === updatedDraw._id)
              d = {
                ...d,
                ...updatedDraw
              };
            return d;
          });
          return {
            ...prevState,
            draws: updatedDraws
          };
        });
      } else {
        alert("Não há mais notas fiscais suficientes para sorteio");
        this.setState({ isDrawInProgress: false });
        return;
      }

      // Hide drawing animation and update local state
      setTimeout(() => {
        this.setState({ isDrawInProgress: false });
      }, 1000);
    } catch (err) {
      console.error(err);
      this.setState({ isDrawInProgress: false });
    }
  }

  render() {
    // Sorting draws by date
    const sortedDraws = this.state.draws.sort((a, b) =>
      a.date_scheduled >= b.date_scheduled ? 1 : -1
    );

    // Dividing betweeb scheduled and performed draws
    const scheduled_draws = sortedDraws.filter(d => d.date_performed === null);
    let performed_draws = sortedDraws.filter(d => d.date_performed !== null);

    // Spliting prize string of performed draws
    performed_draws = performed_draws.map(pd => ({
      ...pd,
      prize: this.splitPrizeString(pd.prize)
    }));

    console.log(performed_draws);

    // Selected and Performed Draw
    let selected_performed_draw = performed_draws.find(
      d => d._id === this.state.selectedDraw
    );

    return (
      <div>
        <Text variant="h1">Sorteios</Text>
        {/* *************** */}
        {/* Scheduled Draws */}
        {/* *************** */}
        <Section>
          <Row padded>
            <Col>
              <Text variant="h2">Sorteios Agendados</Text>
            </Col>
            <Col>
              <Button
                variant="success"
                onClick={() => this.handleIsModalOpened(true)}
                style={{
                  fontSize: "15px",
                  marginTop: 0,
                  alignSelf: "flex-end"
                }}
              >
                Agendar novo sorteio
              </Button>
            </Col>
          </Row>
          <Row padded>
            {scheduled_draws.length === 0 ? (
              <Text>Nenhum sorteio agendado</Text>
            ) : (
              <Table>
                <Tr>
                  <Td>
                    <b>Data Agendada</b>
                  </Td>
                  <Td>
                    <b>Prêmio(s)</b>
                  </Td>
                  <Td>&nbsp;</Td>
                </Tr>

                {scheduled_draws.map(d => (
                  <Tr key={d._id}>
                    <Td>{format(Number(d.date_scheduled), "dd/MM/yyyy")}</Td>
                    <Td
                      dangerouslySetInnerHTML={{
                        __html: d.prize.split("\n").join("<br />")
                      }}
                    />
                    <Td style={{ textAlign: "right" }}>
                      <Button
                        onClick={() => this.toggleDrawModal(d._id)}
                        style={{
                          fontSize: "12px",
                          marginTop: 0,
                          alignSelf: "flex-end"
                        }}
                        variant="info"
                      >
                        Realizar sorteio
                      </Button>
                      <FaTrashAlt
                        onClick={() => this.removeDraw(d._id)}
                        color={theme.colors.red}
                        size={"20px"}
                        style={{ marginLeft: "20px", cursor: "pointer" }}
                      />
                      <FaEdit
                        onClick={() => this.editDraw(d._id)}
                        color={theme.colors.green}
                        size={"20px"}
                        style={{ marginLeft: "10px", cursor: "pointer" }}
                      />
                    </Td>
                  </Tr>
                ))}
              </Table>
            )}
          </Row>
        </Section>

        {/* *************** */}
        {/* Performed Draws */}
        {/* *************** */}
        <Section style={{ marginTop: "20px" }}>
          <Text variant="h2">Sorteios Realizados</Text>
          <Row padded>
            {performed_draws.length === 0 ? (
              <Text>Nenhum sorteio realizado</Text>
            ) : (
              <Table>
                <Tr>
                  <Td size="20%">
                    <b>Data Agendada</b>
                  </Td>

                  <Td size="20%">
                    <b>Data Realizada</b>
                  </Td>
                  <Td size="60%">
                    <b>Ganhadores</b>
                  </Td>
                  {/* <Td>&nbsp;</Td> */}
                </Tr>

                {performed_draws.map(draw => (
                  <Tr key={draw._id}>
                    <Td size="20%">
                      {format(
                        new Date(Number(draw.date_scheduled)),
                        "dd/MM/yyyy"
                      )}
                    </Td>
                    <Td size="20%">
                      {format(
                        new Date(Number(draw.date_performed)),
                        "dd/MM/yyyy"
                      )}
                    </Td>
                    <Td size="60%">
                      <DrawingWinners draw={draw} />
                    </Td>
                    {/* <Td style={{ fontSize: "12px", textAlign: "center" }}>
                      Publicar?
                      <br />
                      <Checkbox />
                    </Td> */}
                  </Tr>
                ))}
              </Table>
            )}
          </Row>
        </Section>

        {/* *************** */}
        {/* Save Draw Modal */}
        {/* *************** */}
        <Modal
          isModalOpened={this.state.isModalOpened}
          closeModal={() => this.handleIsModalOpened(false)}
        >
          <Text variant="h2">
            {this.state.selectedDraw
              ? "Editar Sorteio"
              : "Agendar novo Sorteio"}
          </Text>
          <Section>
            <form onSubmit={this.handleSaveDrawForm}>
              <Row>
                <Col size={"20%"}>
                  <Text variant="label">Data</Text>
                </Col>
                <Col size={"80%"}>
                  <DatePicker
                    value={this.state.form.date_scheduled}
                    onChange={date_scheduled =>
                      this.handleFormDate(date_scheduled)
                    }
                  />
                </Col>
              </Row>
              <Row mTop={"20px"}>
                <Col size={"20%"}>
                  <Text variant="label">Prêmio(s)</Text>
                </Col>
                <Col size={"80%"}>
                  <Input
                    type="textarea"
                    rows={3}
                    style={{ marginTop: 0 }}
                    {...setFormField(this, "prize")}
                    placeholder={
                      "Prêmio 1\u000A\u000DPrêmio 2\u000A\u000DPrêmio 3"
                    }
                  />
                  <Text variant="hint">Adicione um prêmio por linha.</Text>
                </Col>
              </Row>
              <Row>
                <Button variant="success" style={{ fontSize: "15px" }}>
                  {this.state.selectedDraw
                    ? "Editar Sorteio"
                    : "Agendar novo Sorteio"}
                </Button>
              </Row>
            </form>
          </Section>
        </Modal>

        {/* ****************** */}
        {/* Perform Draw Modal */}
        {/* ****************** */}
        <Modal
          isModalOpened={this.state.isDrawModalOpened}
          closeModal={() =>
            !this.state.isDrawInProgress && this.toggleDrawModal()
          }
        >
          {this.state.isDrawInProgress && (
            <DrawImageWrapper>
              <FadeIn>
                <img src="/public/lottery.gif" alt="" />
              </FadeIn>
            </DrawImageWrapper>
          )}
          <Text variant="h2">
            {selected_performed_draw ? "Sorteio Realizado" : "Realizar Sorteio"}
          </Text>
          <Section>
            <Row>
              <Col size={"40%"}>
                <Text variant="label">Data Agendada</Text>
              </Col>
              <Col size={"60%"}>
                {this.state.form.date_scheduled &&
                  format(this.state.form.date_scheduled, "dd/MM/yyyy")}
              </Col>
            </Row>
            {selected_performed_draw && (
              <Row mTop={"20px"}>
                <Col size={"40%"}>
                  <Text variant="label">Data Realizada</Text>
                </Col>
                <Col size={"60%"}>
                  {selected_performed_draw.date_performed &&
                    format(
                      new Date(Number(selected_performed_draw.date_performed)),
                      "dd/MM/yyyy HH:mm"
                    )}
                </Col>
              </Row>
            )}
            <Row mTop={"20px"}>
              <Col size={"40%"}>
                <Text variant="label">Prêmios</Text>
              </Col>
              <Col
                size={"60%"}
                dangerouslySetInnerHTML={{
                  __html: this.state.form.prize.split("\n").join(", ")
                }}
              />
            </Row>

            {selected_performed_draw ? (
              <Row mTop={"20px"}>
                <Col size={"40%"}>
                  <Text style={{ color: theme.colors.green }} variant="label">
                    Ganhadores
                  </Text>
                </Col>
                <Col size={"60%"} style={{ color: theme.colors.green }}>
                  <DrawingWinners multiline draw={selected_performed_draw} />
                </Col>
              </Row>
            ) : (
              <Row>
                <Button
                  onClick={this.handleSubmitDraw}
                  variant="success"
                  style={{ fontSize: "15px" }}
                >
                  Realizar sorteio agora
                </Button>
              </Row>
            )}
          </Section>
        </Modal>
      </div>
    );
  }
}

export default Reports;
