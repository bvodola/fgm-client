import { capitalizeFirst, stringify } from "src/helpers/index";

// ===========================
// Generic Types and mutations
// ===========================

const GET = (many = false, model, inputFields = {}, returnFields = "_id") => {
  const Model = capitalizeFirst(model);

  return `{
    ${model}${many ? "s" : ""}(${model}: ${stringify(inputFields)}) {
      ${returnFields}
    }
  }`;
};

const GET_ONE = (model, inputFields, returnFields) =>
  GET(false, model, inputFields, returnFields);

const GET_MANY = (model, inputFields, returnFields) =>
  GET(true, model, inputFields, returnFields);

const ADD = (model, inputFields = {}, returnFields = "_id") => {
  const Model = capitalizeFirst(model);

  return `
    mutation {
      add${Model}(${model}: ${stringify(inputFields)} ){
        ${returnFields}
      }
    }`;
};

const EDIT = (model, inputFields = {}, returnFields = "_id") => {
  const Model = capitalizeFirst(model);

  return `
    mutation {
      edit${Model}(${model}: ${stringify(inputFields)} ){
        ${returnFields}
      }
    }`;
};

const REMOVE = (model, inputFields = {}, returnFields = "_id") => {
  const Model = capitalizeFirst(model);

  return `
    mutation {
      remove${Model}(${model}: ${stringify(inputFields)} ){
        ${returnFields}
      }
    }`;
};

export { GET_ONE, GET_MANY, ADD, EDIT, REMOVE };
