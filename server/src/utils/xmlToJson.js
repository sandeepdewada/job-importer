const xml2js = require("xml2js");

exports.xmlToJson = async (xml) => {
  try {
    const parser = new xml2js.Parser({ explicitArray: false });
    return await parser.parseStringPromise(xml);
  } catch (error) {
    throw new Error("XML parsing failed: " + error.message);
  }
};
