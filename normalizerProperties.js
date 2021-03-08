//Hierin wordt aangegeven welke normalizer functies aangeroepen moeten worden op elke object attribuut
export const dossierProperties = {
  dossiernummer: ["removeSpecialChars"]
};

export const factuurProperties = {
  factuurnummer: ["removeSpecialChars"],
  datum: ["formatDate"],
  bedrag: ["removeSpecialChars"],
  dossiernummer: ["removeSpecialChars"]
};

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
