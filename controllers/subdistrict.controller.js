const { Subdistrict } = require('../models');
const { Op } = require('sequelize');

function ok(res, message, data, statusCode = 200) {
  return res.status(statusCode).json({ success: true, message, data });
}
function fail(res, message, statusCode = 400) {
  return res.status(statusCode).json({ success: false, message, data: null });
}

exports.getAll = async (req, res) => {
  try {
    const { search, city, city_id, province_id, page, limit } = req.query;
    const where = {};

    if (search) {
      where[Op.or] = [
        { subdistrict_name: { [Op.like]: `%${search}%` } },
        { city: { [Op.like]: `%${search}%` } },
        { province: { [Op.like]: `%${search}%` } }
      ];
    }
    if (city) where.city = { [Op.like]: `%${city}%` };
    if (city_id) where.city_id = city_id;
    if (province_id) where.province_id = province_id;

    const options = { where, order: [['id', 'ASC']] };
    if (page && limit) {
      options.limit = Number(limit);
      options.offset = (Number(page) - 1) * Number(limit);
    }

    const data = await Subdistrict.findAll(options);
    return ok(res, 'Data kecamatan berhasil diambil', data);
  } catch (err) {
    console.error(err);
    return fail(res, 'Gagal mengambil data', 500);
  }
};

exports.getById = async (req, res) => {
  try {
    const data = await Subdistrict.findByPk(req.params.id);
    if (!data) return fail(res, 'Data tidak ditemukan', 404);
    return ok(res, 'Data kecamatan berhasil diambil', data);
  } catch (err) {
    console.error(err);
    return fail(res, 'Gagal mengambil data', 500);
  }
};

exports.getBySubdistrictId = async (req, res) => {
  try {
    const data = await Subdistrict.findOne({ where: { subdistrict_id: req.params.subdistrict_id } });
    if (!data) return fail(res, 'Data tidak ditemukan', 404);
    return ok(res, 'Data kecamatan berhasil diambil', data);
  } catch (err) {
    console.error(err);
    return fail(res, 'Gagal mengambil data', 500);
  }
};

exports.create = async (req, res) => {
  try {
    const { subdistrict_id, province_id, province, city_id, city, type, subdistrict_name } = req.body;
    if (!subdistrict_id || !province_id || !province || !city_id || !city || !type || !subdistrict_name) {
      return fail(res, 'Semua field wajib diisi', 422);
    }
    const data = await Subdistrict.create({ subdistrict_id, province_id, province, city_id, city, type, subdistrict_name });
    return ok(res, 'Data kecamatan berhasil ditambahkan', data, 201);
  } catch (err) {
    if (err.name === 'SequelizeUniqueConstraintError') {
      return fail(res, 'subdistrict_id sudah terdaftar', 409);
    }
    console.error(err);
    return fail(res, 'Gagal menambahkan data', 500);
  }
};

exports.update = async (req, res) => {
  try {
    const item = await Subdistrict.findByPk(req.params.id);
    if (!item) return fail(res, 'Data tidak ditemukan', 404);
    await item.update(req.body);
    return ok(res, 'Data kecamatan berhasil diperbarui', item);
  } catch (err) {
    if (err.name === 'SequelizeUniqueConstraintError') {
      return fail(res, 'subdistrict_id sudah terdaftar', 409);
    }
    console.error(err);
    return fail(res, 'Gagal memperbarui data', 500);
  }
};

exports.remove = async (req, res) => {
  try {
    const item = await Subdistrict.findByPk(req.params.id);
    if (!item) return fail(res, 'Data tidak ditemukan', 404);
    await item.destroy();
    return ok(res, 'Data kecamatan berhasil dihapus', item);
  } catch (err) {
    console.error(err);
    return fail(res, 'Gagal menghapus data', 500);
  }
};