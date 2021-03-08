module.exports = (sequalize, DataTypes) => {
  const Opdrachtgever = sequalize.define("Opdrachtgever", {
    opdrachtgever: {
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

  return Opdrachtgever;
};
