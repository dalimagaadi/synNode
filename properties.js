export const dossierProperties = {
  dossiernummer: ["removeSpecialChars"]
};

export const factuurProperties = {};

export const debiteurProperties = {
  huisnummer: ["removeSpecialChars", "seperateHouseNumber"],
  postcode: ["removeSpecialChars", "capitalizePostal"],
  geboortedatum: ["formatDate"]
};
export const opdrachtgeverProperties = {
  opdrachtgever: ["removeSpecialChars"]
};

export const eiserProperties = {
  eisernummer: ["removeSpecialChars"]
};
