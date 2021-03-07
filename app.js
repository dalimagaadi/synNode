import csvpkg from "csvtojson";
import normalizer from "./normalizer.js";
const { csv } = csvpkg;

const dossierPath = "Voorbeeld dossiers import.csv";

const converter = csv({
  delimiter: ";",
  trim: true,
  colParser: {
    factuurnummer: "omit"
  }
});

let dossierProperties = {
  huisnummer: ["seperateNummer"],
  dossiernummer: ["removeSpecialChars"]
};

let dossierList = [];
converter.fromFile(dossierPath).then((source) => {
  let dossier = {};
  for (let i = 0; i < source.length; i++) {
    dossier = (({
      ["Debiteur huisnummer"]: huisnummer,
      ["Dossiernummer"]: dossiernummer
    }) => ({
      huisnummer,
      dossiernummer
    }))(source[i]);
    normalizer.run(dossier, dossierProperties);
    dossierList.push(dossier);
  }
  console.log(dossierList);
});

// let normalizer = function (obj, properties) {
//   let testval = 2;
//   console.log(this.testval);
//   for (const [key, value] of Object.entries(properties)) {
//     let testval = 2;
//     this.testval;
//   }

//   let test = function () {
//     console.log("test");
//   };
//   let removeSpecialChars = function (obj, property) {
//     obj[property] = obj[property].replace(/[^0-9a-z]/gi, "");
//     return obj;
//   };
// };

//Functie dat gebaseerd op meerdere parameters een object vult met de attributen van de source return in de 'then' van de converter
//Parameter 1: Type object: zoals Dossier, Debiteur, Eiser
//Parameter 2: source[i] object
//Paramter 3: ?

// Bij Parameter 1 wordt er gekeken naar pre-gedefineerde profiel/model van dat object type voor de nodige attributen
