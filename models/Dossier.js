module.exports = (sequalize, DataTypes) => {
  const Dossier = sequalize.define("Dossier", {
    dossiernummer: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      validate: {
        notEmpty: true
      }
    },

    debiteurnummer: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    }
  });

  return Dossier;
};
