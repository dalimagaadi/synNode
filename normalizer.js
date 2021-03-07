const normalizer = {
  run: function (obj, properties) {
    for (const [key, value] of Object.entries(properties)) {
      obj = this[value](obj, key);
    }
    return obj;
  },
  removeSpecialChars: function (obj, property) {
    obj[property] = obj[property].replace(/[^0-9a-z]/gi, "");
    return obj;
  },
  seperateNummer: function (obj, property) {
    let bijvoegingRegex = new RegExp(/[a-zA-Z]{1,}/);
    let extractionRegex = new RegExp(/(\d*)\s{0,}([a-zA-Z]{1,})/);

    if (bijvoegingRegex.test(obj.huisnummer)) {
      let [, huisnummer, bijvoeging] = extractionRegex.exec(obj.huisnummer);
      obj["huisnummer"] = huisnummer;
      obj["bijvoeging"] = bijvoeging;
      return obj;
    }
    return obj;
  }
};

//   let test = function () {
//     console.log("test");
//   };
//   let removeSpecialChars = function (obj, property) {
//     obj[property] = obj[property].replace(/[^0-9a-z]/gi, "");
//     return obj;
//   };
// };

export default normalizer;
