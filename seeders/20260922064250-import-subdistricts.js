'use strict';
const fs = require('fs');
const path = require('path');

module.exports = {
  async up(queryInterface, Sequelize) {
    const jsonPath = path.join(__dirname, '..', 'ongkir', 'ongkir.json');
    const raw = fs.readFileSync(jsonPath, 'utf-8');
    const parsed = JSON.parse(raw);
    const results = parsed.rajaongkir.results;

    const now = new Date();
    const rows = results.map((item) => ({
      subdistrict_id: item.subdistrict_id,
      province_id: item.province_id,
      province: item.province,
      city_id: item.city_id,
      city: item.city,
      type: item.type,
      subdistrict_name: item.subdistrict_name,
      createdAt: now,
      updatedAt: now
    }));

    await queryInterface.bulkInsert('subdistricts', rows, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('subdistricts', null, {});
  }
};