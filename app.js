const CsvToJson = require("csvtojson");
const converter = CsvToJson({
  delimiter: ";",
  trim: true,
  colParser: {
    factuurnummer: "omit"
  }
});

const dossierPath = "Voorbeeld dossiers import.csv";
let dossierList = [];

converter.fromFile(dossierPath).then((source) => {
  let dossier = {};
  for (let i = 0; i < source.length; i++) {
    dossier = (({ Dossiernummer, ["openstaand saldo"]: openstaand_saldo }) => ({
      Dossiernummer,
      openstaand_saldo
    }))(source[i]);
    dossierList.push(dossier);
  }
  console.log(dossierList);
});

//Functie dat gebaseerd op meerdere parameters een object vult met de attributen van de source return in de 'then' van de converter
//Parameter 1: Type object: zoals Dossier, Debiteur, Eiser
//Parameter 2: source[i] object
//Paramter 3: ?

// Bij Parameter 1 wordt er gekeken naar pre-gedefineerde profiel/model van dat object type voor de nodige attributen
