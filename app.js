import csvpkg from "csvtojson";
import normalizer from "./normalizer.js";
const { csv } = csvpkg;

//Properties
import { dossierProperties } from "./properties.js";

const dossierPath = "Voorbeeld dossiers import.csv";

const converter = csv({
  delimiter: ";",
  trim: true,
  colParser: {
    factuurnummer: "omit"
  }
});
let dossierList = [];
converter.fromFile(dossierPath).then((source) => {
  let dossier = {};
  for (let i = 0; i < source.length; i++) {
    dossier = (({
      ["Debiteur huisnummer"]: huisnummer,
      ["Dossiernummer"]: dossiernummer,
      ["Debiteur postcode"]: postcode
    }) => ({
      huisnummer,
      dossiernummer,
      postcode
    }))(source[i]);
    normalizer.run(dossier, dossierProperties);
    dossierList.push(dossier);
  }
  console.log(dossierList);
});
