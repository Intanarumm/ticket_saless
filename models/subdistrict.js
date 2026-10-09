'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Subdistrict extends Model {
    static associate(models) {
      // tidak ada relasi khusus untuk saat ini
    }
  }
  Subdistrict.init({
    subdistrict_id: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    province_id: DataTypes.STRING,
    province: DataTypes.STRING,
    city_id: DataTypes.STRING,
    city: DataTypes.STRING,
    type: DataTypes.STRING,
    subdistrict_name: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Subdistrict',
    tableName: 'subdistricts'
  });
  return Subdistrict;
};