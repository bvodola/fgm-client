const axios = require("axios");
const types = require("./types");
import { BACKEND_URL } from "src/constants";
import { capitalizeFirst, downloadFromBuffer } from "src/helpers/index";

// const store = require("src/state/store").default;
// const getCurrentUserId = () => store.getState().user.currentUser._id || "";
const setAuthHeader = () => {
  // const currentUser = store.getState().user.currentUser;
  // if (currentUser.token) {
  //   return { Authorization: "Bearer " + currentUser.token };
  // } else {
  //   return {};
  // }
  return {};
};

// ================
// Custom functions
// ================

const login = async (email, password) => {
  try {
    const res = await axios.post(
      `${BACKEND_URL}/auth/login`,
      {
        email,
        password
      },
      {}
    );

    return res.data;
  } catch (err) {
    throw err;
  }
};

// =================
// Generic functions
// =================
const get = async (
  many = false,
  model,
  inputFields = {},
  returnFields = null,
  headers = {}
) => {
  try {
    const res = await axios.post(
      `${BACKEND_URL}/graphql`,
      {
        query: `${types[many ? "GET_MANY" : "GET_ONE"](
          model,
          inputFields,
          returnFields
        )}`
      },
      {
        headers
      }
    );
    returnFields = "_id";

    return res.data.data[`${model}${many ? "s" : ""}`];
  } catch (err) {
    throw err;
  }
};

const add = async (
  model,
  inputFields = {},
  returnFields = "_id",
  headers = {}
) => {
  try {
    const res = await axios.post(
      `${BACKEND_URL}/graphql`,
      {
        query: `${types.ADD(model, inputFields, returnFields)}`
      },
      {
        headers
      }
    );
    return res.data.data;
  } catch (err) {
    throw err;
  }
};

const edit = async (
  model,
  inputFields = {},
  returnFields = "_id",
  headers = {}
) => {
  try {
    console.log(types.EDIT(model, inputFields, returnFields));
    const res = await axios.post(
      `${BACKEND_URL}/graphql`,
      {
        query: `${types.EDIT(model, inputFields, returnFields)}`
      },
      {
        headers
      }
    );
    return res.data.data;
  } catch (err) {
    throw err;
  }
};

const remove = async (
  model,
  inputFields,
  returnFields = "_id",
  headers = {}
) => {
  try {
    const res = await axios.post(
      `${BACKEND_URL}/graphql`,
      {
        query: `${types.REMOVE(model, inputFields, returnFields)}`
      },
      {
        headers
      }
    );
    return res.data.data;
  } catch (err) {
    throw err;
  }
};

const crud = (model, addLoggedUserInputFields = false) => {
  let crudFunctions = {};
  const Model = capitalizeFirst(model);

  if (addLoggedUserInputFields === true) {
    addLoggedUserInputFields = {
      getOne: true,
      getMany: true,
      add: true
    };
  }

  crudFunctions[`get${Model}`] = async (fields = {}, returnFields = "_id") => {
    try {
      if (addLoggedUserInputFields.getOne) {
        fields = {
          ...fields,
          user_id: getCurrentUserId()
        };
      }
      return get(false, `${model}`, fields, returnFields);
    } catch (err) {
      throw err;
    }
  };

  crudFunctions[`get${Model}s`] = async (fields = {}, returnFields = "_id") => {
    try {
      if (addLoggedUserInputFields.getMany)
        fields = {
          ...fields,
          user_id: getCurrentUserId()
        };
      return get(true, `${model}`, fields, returnFields);
    } catch (err) {
      throw err;
    }
  };

  crudFunctions[`add${Model}`] = async (fields = {}, returnFields = "_id") => {
    try {
      if (addLoggedUserInputFields.add)
        fields = {
          ...fields,
          user_id: getCurrentUserId()
        };
      return add(model, fields, returnFields, setAuthHeader());
    } catch (err) {
      throw err;
    }
  };

  crudFunctions[`edit${Model}`] = async (fields = {}, returnFields = "_id") => {
    try {
      return edit(model, fields, returnFields, setAuthHeader());
    } catch (err) {
      throw err;
    }
  };

  crudFunctions[`remove${Model}`] = async (
    fields = {},
    returnFields = "_id"
  ) => {
    try {
      return remove(model, fields, returnFields, setAuthHeader());
    } catch (err) {
      throw err;
    }
  };

  return crudFunctions;
};

async function downloadExcelReport(data, filename = "report") {
  try {
    const dataString = JSON.stringify(data);
    const res = await axios.post(
      `${BACKEND_URL}/api/excel`,
      {
        data: dataString
      },
      {
        responseType: "arraybuffer"
      }
    );

    downloadFromBuffer(
      filename,
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      res.data
    );
  } catch (err) {
    console.error(err);
  }
}

const api = {
  login,
  ...crud("user"),
  ...crud("draw"),
  downloadExcelReport
};

export default api;
