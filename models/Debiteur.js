module.exports = (sequalize, DataTypes) => {
  const Debiteur = sequalize.define("Debiteur", {
    debiteurnummer: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      validate: {
        notEmpty: true
      }
    },

    naam: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    huisnummer: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    postcode: {
      type: DataTypes.STRING,
      allowNull: false
    },
    geboortedatum: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    woonplaats: {
      type: DataTypes.STRING,
      allowNull: true
    },
    bijvoeging: {
      type: DataTypes.STRING,
      allowNull: true
    }
  });

  return Debiteur;
};
