import React from "react";
import { Input, Text, FileUploader, Field } from "src/components";
import { setFormField } from "src/helpers/index";

const Label = props => <Text {...props} variant="label" />;

const ReceiptsForm = ({
  receipt,
  handleFileUploaderChange,
  handleRemoveUploadedFile,
  scope
}) => (
  <div>
    <Field>
      <Label>Dental que realizou a compra</Label>
      <Input
        required
        {...setFormField(scope, `receipt.dental_name`)}
        type="string"
      />
    </Field>

    <Field>
      <Label>Número da nota fiscal</Label>
      <Input required {...setFormField(scope, `receipt.code`)} type="string" />
    </Field>

    <Field>
      <Label>Valor em produtos FGM</Label>
      <Input
        required
        {...setFormField(scope, `receipt.amount`)}
        type="string"
      />
    </Field>
    <Field>
      <Label>Arquivo da nota fiscal</Label>
      <FileUploader
        name="fileUploader"
        placeholder={<div>Escolher arquivo</div>}
        files={receipt.files}
        formats={".jpg,.jpeg,.pdf"}
        onChange={ev => handleFileUploaderChange(ev)}
        close={file_id => handleRemoveUploadedFile(file_id)}
      />
    </Field>
  </div>
);

export default ReceiptsForm;

ReceiptsForm.defaultProps = {
  receipts: [],
  addReceipt: () => {},
  removeReceipt: () => {}
};
