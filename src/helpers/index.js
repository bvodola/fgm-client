import axios from "axios";
import StateHandler from "./stateHandler";

const truncate = (string, chars = 140) => {
  if (string.length > chars) {
    return string.substr(0, chars - 3) + "...";
  } else {
    return string;
  }
};

const handleAwsUpload = async (file, endpoint) => {
  try {
    // Split the filename to get the name and type
    let fileParts = file.name.split(".");
    let fileName = fileParts[0];
    let fileType = fileParts[1];

    // Getting the Upload route from our server
    const postResponse = await axios.post(endpoint, {
      fileName,
      fileType
    });

    const { returnData } = postResponse.data.data;
    const { signedRequest, url } = returnData;

    // Put the fileType in the headers for the upload
    var options = {
      headers: { "Content-Type": fileType }
    };

    // File Uploading
    const putResponse = await axios.put(signedRequest, file, options);

    return url;
  } catch (err) {
    console.error("helpers.js -> handleAwsUpload()", err);
  }
};

const setFormField = (self, name) => {
  const _ = new StateHandler(self);

  return {
    name,
    onChange: ev => {
      // let {form} = self.state;
      // form[name] = ev.target.type === 'number' ?  Number(ev.target.value) : ev.target.value;
      // self.setState({form});
      _.set(
        `form.${name}`,
        ev.target.type && ev.target.type === "number"
          ? Number(ev.target.value)
          : ev.target.value
      );
    },
    value: _.get(`form.${name}`)
  };
};

const cookie = {
  get: key => {
    let cks = {};
    if (document && document.cookie) {
      document.cookie.split(";").forEach(function(c, i) {
        let keyval = c.split("=");
        cks[keyval[0].trim()] = keyval[1];
      });
    }

    return cks[key];
  },

  set: (key, val) => {
    document.cookie = `${key}=${val}`;
    return true;
  },

  delete: key => {
    document.cookie = `${key}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
  }
};

const randomString = (length = 7) =>
  [...Array(length)].map(() => Math.random().toString(36)[3]).join("");

const randomNumber = (length = 7) =>
  [...Array(7)].map(() => Math.random().toString()[3]).join("");

const capitalizeFirst = str => str.charAt(0).toUpperCase() + str.substring(1);

const stringify = obj_from_json => {
  // In case of an array, we'll stringify all objects inside of it.
  if (Array.isArray(obj_from_json)) {
    return `[${obj_from_json.map(obj => `${stringify(obj)}`).join(",")}]`;
  }

  // If it is not an object, or it's a date, or it's NULL, stringify using native function
  if (
    typeof obj_from_json !== "object" ||
    obj_from_json instanceof Date ||
    obj_from_json === null
  ) {
    return JSON.stringify(obj_from_json);
  }

  // Implements recursive object serialization according to JSON spec
  // but without quotes around the keys.
  return `{${Object.keys(obj_from_json)
    .map(key => `${key}:${stringify(obj_from_json[key])}`)
    .join(",")}}`;
};

function downloadFromBuffer(filename, type, bytes) {
  const blob = new Blob([bytes], { type });
  let link = document.createElement("a");
  link.href = window.URL.createObjectURL(blob);
  link.download = filename;
  link.click();
}

const handleCloudinaryUpload = async file => {
  try {
    const CLOUDINARY_UPLOAD_PRESET_ID = "swgj6qeu";
    const CLOUDINARY_USERNAME = "bvodola";
    const CLOUDINARY_API_KEY = "473224552137915";

    const formData = new FormData();
    formData.append("file", file);
    formData.append("tags", "text_detection");
    formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET_ID);
    formData.append("api_key", CLOUDINARY_API_KEY);
    formData.append("timestamp", (Date.now() / 1000) | 0);

    const res = await axios.post(
      `https://api.cloudinary.com/v1_1/${CLOUDINARY_USERNAME}/auto/upload`,
      formData,
      { headers: { "X-Requested-With": "XMLHttpRequest" } }
    );

    return res;
  } catch (err) {
    console.log(err);
  }
};

export {
  cookie,
  handleAwsUpload,
  setFormField,
  truncate,
  randomString,
  randomNumber,
  capitalizeFirst,
  stringify,
  downloadFromBuffer,
  handleCloudinaryUpload
};
