let BACKEND_URL;
const BACKEND_PORT = 3000;

switch (process.env.NODE_ENV) {
  case "development":
    BACKEND_URL = `http://localhost:${BACKEND_PORT}`;
    break;
  case "production":
    BACKEND_URL = "https://intense-thicket-75118.herokuapp.com";
    break;
  default:
    BACKEND_URL = "https://intense-thicket-75118.herokuapp.com";
}

export { BACKEND_URL };
