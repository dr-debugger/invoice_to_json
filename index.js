const {
  AzureKeyCredential,
  DocumentAnalysisClient,
} = require("@azure/ai-form-recognizer");
const process = require("process");
const fs = require("fs");
const path = require("path");
require("dotenv").config();

const invoiceUrl =
  "https://raw.githubusercontent.com/Azure-Samples/cognitive-services-REST-api-samples/master/curl/form-recognizer/sample-invoice.pdf";

const key = process.env.API_KEY;
const endpoint = process.env.API_ENDPOINT;

const extractDataFromKeyValue = (keyValuePairs) => {
  let overAllConfidence = 0;
  // total = 0;

  const extractedData = [];

  for (let i = 0; i < keyValuePairs.length; i++) {
    const key = keyValuePairs[i]?.key?.content,
      value = keyValuePairs[i]?.value?.content;

    if (Boolean(key) && Boolean(value)) {
      extractedData.push({
        key,
        value,
      });

      if (keyValuePairs[i]?.confidence) {
        overAllConfidence += keyValuePairs[i].confidence;
        // total++;
      }
    }
  }

  const result = {
    data: extractedData,
    accuracy: ((overAllConfidence / keyValuePairs.length) * 100).toFixed(2),
  };

  return result;
};

const convertObjToSting = (obj) => {
  if (!Boolean(obj)) return "";
  let str = "";
  for (const property in obj) {
    str += ` ${obj[property]}`;
  }

  return str;
};

const extractDataFromDocuments = (documents) => {
  let overAllConfidence = 0;
  // total = 0;

  const extractedData = [];

  const stringType = ["string", "date", "number"],
    objType = ["address", "currency", "object"],
    arrayType = ["array"];

  for (const [key, valueObj] of Object.entries(documents)) {
    if (Boolean(valueObj)) {
      if (stringType.includes(valueObj?.kind)) {
        extractedData.push({
          key,
          value: valueObj?.value ? valueObj.value : "",
        });
      }

      if (objType.includes(valueObj?.kind)) {
        extractedData.push({
          key,
          value: valueObj?.content
            ? valueObj.content
            : convertObjToSting(valueObj.value),
        });
      }

      if (valueObj?.confidence) {
        overAllConfidence += valueObj.confidence;
        // total++;
      }
    }
  }

  const result = {
    data: extractedData,
    accuracy: (
      (overAllConfidence / Object.entries(documents).length) *
      100
    ).toFixed(2),
  };

  return result;
};

const main = async (type) => {
  // throw new Error("manual error");
  const root = path.dirname(require.main.filename);
  const filepath = path.join(root, "sample-invoice.pdf");
  const file = fs.createReadStream(filepath);

  const client = new DocumentAnalysisClient(
    endpoint,
    new AzureKeyCredential(key)
  );

  const poller = await client.beginAnalyzeDocumentFromUrl(
    "prebuilt-invoice",
    file
  );

  const { keyValuePairs, documents } = await poller.pollUntilDone();

  let jsonItems = null;

  if (type === "FROM_KEY_VALUE" && keyValuePairs.length > 0) {
    jsonItems = extractDataFromKeyValue(keyValuePairs);
  }

  if (
    type === "DOCUMENTS" &&
    documents.length > 0 &&
    Boolean(documents[0]?.fields)
  ) {
    jsonItems = extractDataFromDocuments(documents[0]?.fields);
  }

  if (jsonItems)
    return Promise.resolve({
      status: true,
      data: jsonItems,
    });

  return Promise.resolve({
    satus: false,
    data: null,
  });
};

main("DOCUMENTS")
  .then((data) => {
    // console.log(data);
    console.log(".....****.....");
    console.log(JSON.stringify(data));
  })
  .catch((err) => {
    console.log(err);
    process.exit(1);
  });
