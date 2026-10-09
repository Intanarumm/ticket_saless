/** load model for `diskons` table */
const diskonModel = require(`../models/index`).diskon

/** load Operation from Sequelize */
const Op = require(`sequelize`).Op

/** create function for read all data */
exports.getAllDiskon = async (request, response) => {
    /** call findAll() to get all data */
    let diskons = await diskonModel.findAll()
    return response.json({
        success: true,
        data: diskons,
        message: `All diskons have been loaded`
    })
}

/** create function for filter */
exports.findDiskon = async (request, response) => {
    /** define keyword to find data */
    let keyword = request.params.key

    /** call findAll() within where clause and operation
     * to find data based on keyword */
    let diskons = await diskonModel.findAll({
        where: {
            [Op.or]: [
                { diskonID: { [Op.substring]: keyword } },
                { namaDiskon: { [Op.substring]: keyword } }
            ]
        }
    })
    return response.json({
        success: true,
        data: diskons,
        message: `All Diskons have been loaded`
    })
}

/** create function for add new diskon */
exports.addDiskon = (request, response) => {
    /** prepare data from request */
    let newDiskon = {
        namaDiskon: request.body.namaDiskon,
        nominal: request.body.nominal,
        tanggalBerlaku: request.body.tanggalBerlaku
    }

    /** execute inserting data to diskon's table */
    diskonModel.create(newDiskon)
    .then(result => {
        /** if insert's process success */
        return response.json({
            success: true,
            data: result,
            message: `New diskon has been inserted`
        })
    })
    .catch(error => {
        /** if insert's process fail */
        return response.json({
            success: false,
            message: error.message
        })
    })
}

/** create function for update diskon */
exports.updateDiskon = (request, response) => {
    /** prepare data that has been changed */
    let dataDiskon = {
        namaDiskon: request.body.namaDiskon,
        nominal: request.body.nominal,
        tanggalBerlaku: request.body.tanggalBerlaku
    }

    /** define id diskon that will be update */
    let diskonID = request.params.id

    /** execute update data based on defined id diskon */
    diskonModel.update(dataDiskon, { where: { diskonID: diskonID } })
    .then(result => {
        /** if update's process success */
        return response.json({
            success: true,
            message: `Data diskon has been updated`
        })
    })
    .catch(error => {
        /** if update's process fail */
        return response.json({
            success: false,
            message: error.message
        })
    })
}

/** create function for delete data */
exports.deleteDiskon = (request, response) => {
    /** define id diskon that will be deleted */
    let diskonID = request.params.id

    /** execute delete data based on defined id diskon */
    diskonModel.destroy({ where: { diskonID: diskonID } })
    .then(result => {
        /** if delete's process success */
        return response.json({
            success: true,
            message: `Data diskon has been deleted`
        })
    })
    .catch(error => {
        /** if delete's process fail */
        return response.json({
            success: false,
            message: error.message
        })
    })
}