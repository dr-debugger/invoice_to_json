const {
  AzureKeyCredential,
  DocumentAnalysisClient,
} = require("@azure/ai-form-recognizer");
const process = require("process");

const invoiceUrl =
  "https://raw.githubusercontent.com/Azure-Samples/cognitive-services-REST-api-samples/master/curl/form-recognizer/sample-invoice.pdf";

const key = "";
const endpoint = "";

const extractDataFromKeyValue = (keyValuePairs) => {
  let overAllConfidence = 0,
    total = 0;

  const extractedData = [];

  for (let i = 0; i < keyValuePairs.length; i++) {
    const key = keyValuePairs[i]?.key?.content,
      value = keyValuePairs[i]?.value?.content;

    if (Boolean(key)) {
      extractedData.push({
        [key]: value,
      });
    }

    if (keyValuePairs[i]?.confidence) {
      overAllConfidence += keyValuePairs[i].confidence;
      total++;
    }
  }

  const result = {
    data: extractedData,
    accuracy: (overAllConfidence / total) * 100,
  };

  return result;
};

const convertObjToSting = (obj) => {
  if (!Boolean(obj)) return "";
  let str = "";
  for (const property in obj) {
    str += obj[property];
  }

  return str;
};

const extractDataFromDocuments = (documents) => {
  let overAllConfidence = 0,
    total = 0;

  const extractedData = [];

  const stringType = ["string", "date", "number"],
    objType = ["address", "currency", "object"],
    arrayType = ["array"];

  for (const [key, valueObj] of Object.entries(documents)) {
    if (Boolean(valueObj)) {
      if (stringType.includes(valueObj?.kind)) {
        extractedData.push({
          [key]: valueObj?.value,
        });
      }

      if (objType.includes(valueObj?.kind)) {
        extractedData.push({
          [key]: valueObj?.content
            ? valueObj.content
            : convertObjToSting(valueObj.value),
        });
      }

      if (valueObj?.confidence) {
        overAllConfidence += keyValuePairs[i].confidence;
        total++;
      }
    }
  }

  const result = {
    data: extractedData,
    accuracy: (overAllConfidence / total) * 100,
  };

  return result;
};

const main = async (type) => {
  // throw new Error("manual error");
  const client = new DocumentAnalysisClient(
    endpoint,
    new AzureKeyCredential(key)
  );

  const poller = await client.beginAnalyzeDocumentFromUrl(
    "prebuilt-invoice",
    invoiceUrl
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

main("FROM_KEY_VALUE")
  .then((data) => console.log(data))
  .catch((err) => {
    console.log(err);
    process.exit(1);
  });

/**
 * fef0cc12cf034ec3a6a1a41a4b0041b9

https://aisp-form-recognizer.cognitiveservices.azure.com/
 */
