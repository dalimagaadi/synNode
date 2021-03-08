module.exports = (sequalize, DataTypes) => {
  const Eiser = sequalize.define("Eiser", {
    eisernummer: {
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
    }
  });

  return Eiser;
};
