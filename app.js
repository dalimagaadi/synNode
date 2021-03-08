import csvpkg from "csvtojson";
import normalizer from "./normalizer.js";
const { csv } = csvpkg;
const db = require("./models");
//Properties & models
import * as Properties from "./properties.js";
import * as Mapping from "./propertyMapping.js";
const dossierPath = "Voorbeeld dossiers import.csv";
const factuurPath = "Voorbeeld facturen import.csv";

const { Dossier } = require("./models");
db.sequelize.sync({ alter: true }).then(() => {});

let app = () => {
  const converter = csv({
    delimiter: ";",
    trim: true,
    colParser: {
      factuurnummer: "omit"
    }
  });
  let dossierList = [];
  let debiteurList = [];
  converter.fromFile(dossierPath).then((source) => {
    for (let i = 0; i < source.length; i++) {
      let dossier,
        debiteur = {};
      dossier = extractObject(Mapping.dossierMapping, source[i]);
      normalizer.run(dossier, Properties.dossierProperties);
      if (!checkDuplicate(dossier, dossierList, "dossiernummer"))
        dossierList.push(dossier);
      debiteur = extractObject(Mapping.debiteurMapping, source[i]);
      normalizer.run(debiteur, Properties.debiteurProperties);
      if (!checkDuplicate(debiteur, debiteurList, "debiteurnummer"))
        debiteurList.push(debiteur);
    }
    console.log(dossierList);

    for (let i = 0; i < dossierList.length; i++) {
      updateOrCreate(Dossier, "", dossierList[i]).then((created) => {
        console.log(created);
      });
    }
  });
  async function updateOrCreate(model, where, newItem) {
    // First try to find the record
    const foundItem = await model.findOne({
      where: { dossiernummer: newItem["dossiernummer"] }
    });
    if (!foundItem) {
      // Item not found, create a new one
      const item = await model.create(newItem);
      return { item, created: true };
    }
    // Found an item, update it
    const item = await model.update(newItem, {
      where: { dossiernummer: newItem["dossiernummer"] }
    });
    return { item, created: false };
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
//Oplaan in SQL database
