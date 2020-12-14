import axios from 'axios';
import Ajv from 'ajv';
import * as configSchema from "../../schemas/ResponseConfig.json";

export async function sendServerRequest(requestBody, serverPort=getOriginalServerPort()) {
  try { return await axios.post(`${serverPort}/api/${requestBody.requestType}`, JSON.stringify(requestBody)) }
  catch(error) { return null; }
}

export function getOriginalServerPort() {
  const serverProtocol = location.protocol;
  const serverHost = location.hostname;
  const serverPort = location.port;
  const alternatePort = process.env.SERVER_PORT;
  return `${serverProtocol}\/\/${serverHost}:${(!alternatePort ? serverPort : alternatePort)}`;
}

export function isJsonResponseValid(object, schema) {
  let anotherJsonValidator = new Ajv();
  let validate = anotherJsonValidator.compile(schema);
  return validate(object);
}

export function sendConfigRequest(successAction){
  sendServerRequest({requestType: "config"}, getOriginalServerPort())
      .then(config => {
        if (config) {
          processConfigResponse(config.data, successAction)
        }
        else {
            successAction(config);
        }
      });
}

function processConfigResponse(config, successAction) {
  if(!isJsonResponseValid(config, configSchema)) {
    return false;
  } else {
    successAction(config);
  }
}