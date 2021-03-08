import csvpkg from "csvtojson";
import normalizer from "./normalizer.js";
const { csv } = csvpkg;
const db = require("./models");

//Properties & models
import * as Properties from "./normalizerProperties.js";
import * as Mapping from "./propertyMapping.js";
const {
  Dossier,
  Debiteur,
  Eiser,
  Opdrachtgever,
  Factuur
} = require("./models");

//CSV paths
const dossierPath = "Voorbeeld dossiers import.csv";
const factuurPath = "Voorbeeld facturen import.csv";

let app = () => {
  const dossierConverter = csv({
    delimiter: ";",
    trim: true
  });

  const factuurConverter = csv({
    delimiter: ";",
    trim: true
  });

  let dossierList = [];
  let eiserList = [];
  let opdrachtgeverList = [];
  let debiteurList = [];
  let factuurList = [];

  dossierConverter
    .fromFile(dossierPath)
    .then((source) => {
      for (let i = 0; i < source.length; i++) {
        extractAndNormalize(
          Mapping.dossierMapping,
          source[i],
          Properties.dossierProperties,
          dossierList,
          "dossiernummer"
        );
        extractAndNormalize(
          Mapping.debiteurMapping,
          source[i],
          Properties.debiteurProperties,
          debiteurList,
          "debiteurnummer"
        );
        extractAndNormalize(
          Mapping.opdrachtgeverMapping,
          source[i],
          Properties.opdrachtgeverProperties,
          opdrachtgeverList,
          "opdrachtgever"
        );
        extractAndNormalize(
          Mapping.eiserMapping,
          source[i],
          Properties.eiserProperties,
          eiserList,
          "eisernummer"
        );
      }
    })
    .then(() => {
      db.sequelize.sync({ alter: true }).then(() => {
        for (let i = 0; i < dossierList.length; i++) {
          updateOrCreate(Dossier, dossierList[i]);
        }
        for (let i = 0; i < debiteurList.length; i++) {
          updateOrCreate(Debiteur, debiteurList[i]);
        }
        for (let i = 0; i < eiserList.length; i++) {
          updateOrCreate(Eiser, eiserList[i]);
        }
        for (let i = 0; i < opdrachtgeverList.length; i++) {
          updateOrCreate(Opdrachtgever, opdrachtgeverList[i]);
        }
      });
    });

  factuurConverter
    .fromFile(factuurPath)
    .then((source) => {
      for (let i = 0; i < source.length; i++) {
        extractAndNormalize(
          Mapping.factuurMapping,
          source[i],
          Properties.factuurProperties,
          factuurList,
          "factuurnummer"
        );
      }
    })
    .then(() => {
      db.sequelize.sync({ alter: true }).then(() => {
        for (let i = 0; i < factuurList.length; i++) {
          updateOrCreate(Factuur, factuurList[i]);
        }
      });
    });

  async function updateOrCreate(model, newItem) {
    let pk = await getModelPk(model);

    const foundItem = await model.findOne({
      where: { [pk[0]]: newItem[pk[0]] }
    });
    if (!foundItem) {
      const item = await model.create(newItem);
      return { item, created: true };
    }

    const item = await model.update(newItem, {
      where: { [pk[0]]: newItem[pk[0]] }
    });
    return { item, created: false };
  }

  async function getModelPk(model) {
    return model.describe().then((description) => {
      return Object.keys(description).filter((field) => {
        return description[field].primaryKey;
      });
    });
  }

  //Gebruik de gegeven object model om de attributen uit het CSVToJSON bestand te extracten
  function extractObject(model, source) {
    let obj = {};
    for (const [key, value] of Object.entries(model)) {
      if (typeof value === "object") {
        for (let i = 0; i < value.length; i++) {
          if (typeof source[value[i]] !== "undefined") {
            obj[key] = source[value[i]];
          }
        }
      } else if (typeof source[value] !== "undefined") {
        obj[key] = source[value];
      }
    }
    return obj;
  }

  //Controleer of er een object in de arraylist staat dat dezelfde PK heeft
  function checkDuplicate(object, list, pk) {
    if (list.some((item) => item[pk] === object[pk])) {
      return true;
    }
    return false;
  }
  function extractAndNormalize(
    objectMapping,
    source,
    normalizationProperties,
    objectList,
    pk
  ) {
    let object = extractObject(objectMapping, source);
    normalizer.run(object, normalizationProperties);
    if (!checkDuplicate(object, objectList, pk)) objectList.push(object);
  }
};

module.exports = app;

//Extractie automatiseren/herschrijven
