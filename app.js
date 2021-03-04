const CsvToJson = require("csvtojson");
const converter = CsvToJson({
  delimiter: ";",
  trim: true,
  colParser: {
    factuurnummer: "omit"
  }
});
const dossierPath = "Voorbeeld dossiers import.csv";

converter.fromFile("./Voorbeeld dossiers import.csv").then((source) => {
  console.log(source);
});
