'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class diskon extends Model {
    static associate(models) {
      // tidak ada relasi
    }
  }
  diskon.init({
    diskonID: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    namaDiskon: DataTypes.STRING,
    nominal: DataTypes.INTEGER,
    tanggalBerlaku: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'diskon',
  });
  return diskon;
};