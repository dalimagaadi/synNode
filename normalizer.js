const normalizer = {
  run: function (obj, properties) {
    for (const [key, value] of Object.entries(properties)) {
      if (value.length > 1) {
        for (let i = 0; i < value.length; i++) {
          obj = this[value[i]](obj, key);
        }
      } else {
        obj = this[value](obj, key);
      }
    }
    return obj;
  },
  formatDate: function (obj, property) {
    let initialDate = obj[property].split(/\-/);
    obj.geboortedatum = [initialDate[1], initialDate[0], initialDate[2]].join(
      "-"
    );
    return obj;
  },
  removeSpecialChars: function (obj, property) {
    if (typeof obj[property] !== "undefined") {
      obj[property] = obj[property].replace(/[^0-9a-z]/gi, "");
    }
    return obj;
  },

  seperateHouseNumber: function (obj) {
    let bijvoegingRegex = new RegExp(/[a-zA-Z]{1,}/);
    let extractionRegex = new RegExp(/(\d*)\s{0,}([a-zA-Z]{1,})/);

    if (bijvoegingRegex.test(obj.huisnummer)) {
      let [, huisnummer, bijvoeging] = extractionRegex.exec(obj.huisnummer);
      obj["huisnummer"] = huisnummer;
      obj["bijvoeging"] = bijvoeging;
      return obj;
    }
    return obj;
  },

  capitalizePostal: function (obj) {
    if (typeof obj["postcode"] !== "undefined") {
      obj["postcode"] = obj["postcode"].replace(
        new RegExp(/[a-zA-z]{2}$/),
        function (chars) {
          return chars.toUpperCase();
        }
      );
    }
    return obj;
  }
};

export default normalizer;
