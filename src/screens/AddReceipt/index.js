import React from "react";
import { Link } from "react-router-dom";
import { ReceiptsForm, Text, Section, Button, Row, Col } from "src/components";
import { handleCloudinaryUpload } from "src/helpers";
import api from "src/api";

class AddReceipt extends React.Component {
  constructor() {
    super();
    this.state = {
      loading: false,
      form: {
        receipt: {}
      }
    };

    this.handleFileUploaderChange = this.handleFileUploaderChange.bind(this);
    this.handleRemoveUploadedFile = this.handleRemoveUploadedFile.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleFileUploaderChange(ev) {
    const targetFiles = ev.target.files;
    const fileURLs = Array.from(targetFiles).map(f => ({
      _id: Math.random()
        .toString(36)
        .substring(7),
      src: URL.createObjectURL(f),
      file: f
    }));

    console.log(fileURLs);

    if (
      typeof fileURLs[0] !== "undefined" &&
      fileURLs[0].file.size >= 10485760
    ) {
      alert("O arquivo da nota deve ter no máximo 10MB");
    } else {
      let { form } = this.state;
      form.receipt.files = fileURLs;
      this.setState({ form });
      ev.target.value = null;
    }
  }

  handleRemoveUploadedFile(_id) {
    let { form } = this.state;
    let files = form.receipt.files;
    form.receipt.files = files.filter(f => f._id !== _id);
    this.setState({ form });
  }

  async handleSubmit(ev) {
    try {
      // Prevent default submit and start loading state
      ev.preventDefault();
      this.setState({ loading: true });

      // Variables setting
      const { form } = this.state;
      const { loggedInUser } = this.props;

      // Upload all files to Cloudinary
      const files = await Promise.all(
        form.receipt.files.map(async file => {
          const res = await handleCloudinaryUpload(file.file);
          return typeof res !== "undefined" ? res.data.url : "";
        })
      );

      // Set the files variable in the form object
      form.receipt.files = files;

      // Get the updated user receipts
      const user = await api.getUser(
        {
          _id: loggedInUser._id
        },
        "_id receipts {dental_name amount code files}"
      );

      // Send the updates to the API
      const res = await api.editUser({
        _id: loggedInUser._id,
        receipts: [...user.receipts, form.receipt]
      });

      // Set the loading state to false
      this.setState({ loading: false, form: { receipt: {} } });
      alert("Nota cadastrada com sucesso");
    } catch (err) {
      console.log(err);
    }
  }

  render() {
    const { form, loading } = this.state;
    return (
      <div>
        <Text variant="h1">Cadastrar Nota</Text>

        <Link
          style={{
            textAlign: "center",
            marginBottom: "32px",
            display: "block"
          }}
          to="/"
        >
          <Text>← Ver minhas notas</Text>
        </Link>
        {/* <Row padded>
          <Col> */}
        <Section variant="box">
          <form onSubmit={this.handleSubmit}>
            <ReceiptsForm
              scope={this}
              receipt={form.receipt}
              handleFileUploaderChange={this.handleFileUploaderChange}
              handleRemoveUploadedFile={this.handleRemoveUploadedFile}
            />
            <Button type="submit" disabled={loading}>
              {loading ? "Enviando..." : "Cadastrar Nota"}
            </Button>
          </form>
        </Section>
        {/* </Col>
        </Row> */}
      </div>
    );
  }
}

export default AddReceipt;
