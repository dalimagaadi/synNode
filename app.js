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
        let dossier,
          debiteur,
          eiser,
          opdrachtgever = {};
        dossier = extractObject(Mapping.dossierMapping, source[i]);
        normalizer.run(dossier, Properties.dossierProperties);
        if (!checkDuplicate(dossier, dossierList, "dossiernummer"))
          dossierList.push(dossier);

        debiteur = extractObject(Mapping.debiteurMapping, source[i]);
        normalizer.run(debiteur, Properties.debiteurProperties);
        if (!checkDuplicate(debiteur, debiteurList, "debiteurnummer"))
          debiteurList.push(debiteur);

        opdrachtgever = extractObject(Mapping.opdrachtgeverMapping, source[i]);
        normalizer.run(opdrachtgever, Properties.opdrachtgeverProperties);
        if (!checkDuplicate(opdrachtgever, opdrachtgeverList, "opdrachtgever"))
          opdrachtgeverList.push(opdrachtgever);

        eiser = extractObject(Mapping.eiserMapping, source[i]);
        normalizer.run(eiser, Properties.eiserProperties);
        if (!checkDuplicate(eiser, eiserList, "eisernummer"))
          eiserList.push(eiser);
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
          console.log(opdrachtgeverList);
          updateOrCreate(Opdrachtgever, opdrachtgeverList[i]);
        }
      });
    });

  factuurConverter
    .fromFile(factuurPath)
    .then((source) => {
      for (let i = 0; i < source.length; i++) {
        let factuur = {};
        factuur = extractObject(Mapping.factuurMapping, source[i]);
        normalizer.run(factuur, Properties.factuurProperties);
        if (!checkDuplicate(factuur, factuurList, "factuurnummer"))
          factuurList.push(factuur);
      }
    })
    .then(() => {
      for (let i = 0; i < factuurList.length; i++) {
        updateOrCreate(Factuur, factuurList[i]);
      }
    });

  async function updateOrCreate(model, newItem) {
    let pk = await getModelPk(model);
    // First try to find the record
    const foundItem = await model.findOne({
      where: { [pk[0]]: newItem[pk[0]] }
    });
    if (!foundItem) {
      // Item not found, create a new one
      const item = await model.create(newItem);
      return { item, created: true };
    }
    // Found an item, update it
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
  function checkDuplicate(object, list, pk) {
    if (list.some((item) => item[pk] === object[pk])) {
      return true;
    }
    return false;
  }
};

module.exports = app;

//Extractie automatiseren/herschrijven
