export const dossierProperties = {
  dossiernummer: ["removeSpecialChars"]
};

export const factuurProperties = {};

export const debiteurProperties = {
  huisnummer: ["removeSpecialChars", "seperateHouseNumber"],
  postcode: ["removeSpecialChars", "capitalizePostal"]
};
