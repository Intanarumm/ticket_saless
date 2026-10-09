/** load model */
const seatModel = require(`../models/index`).seat
const userModel = require(`../models/index`).user
const eventModel = require(`../models/index`).event
const ticketModel = require(`../models/index`).ticket

/** load Operation and sequelize instance from Sequelize */
const Op = require(`sequelize`).Op
const sequelize = require(`../models/index`).sequelize

/** create function for add new ticket */
exports.addTicket = async (request, response) => {
    /** prepare date for bookedDate */
    const today = new Date()
    const bookedDate = `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()} ${today.getHours()}:${today.getMinutes()}:${today.getSeconds()}`

    /** prepare data from request */
    const { eventID, userID, seats } = request.body;

    try {
        // Create seat records for the chosen seats
        const seatIDs = await Promise.all(seats.map(async seat => {
            const { rowNum, seatNum } = seat;
            const createdSeat = await seatModel.create({
                eventID,
                rowNum,
                seatNum,
                status: 'true'
            });
            return createdSeat.seatID;
        }));

        // Create ticket records associating the chosen seats
        const tickets = await ticketModel.bulkCreate(seatIDs.map(seatID => ({
            eventID,
            userID,
            seatID,
            bookedDate
        })));

        response.status(201).json(tickets);
    } catch (error) {
        return response.json({
            success: false,
            message: error.message
        })
    }
}

/** create function for read all data
 * role user -> hanya tiket miliknya sendiri
 * role admin -> semua tiket
 */
exports.getAllTicket = async (request, response) => {
    let { role, id: userID } = request.user

    let whereClause = {}
    if (role === 'user') {
        whereClause.userID = userID
    }

    let tickets = await ticketModel.findAll({
        where: whereClause,
        include: [
            { model: eventModel, attributes: ['eventName','eventDate','venue']},
            { model: userModel, attributes: ['firstName', 'lastName']},
            { model: seatModel, attributes: ['rowNum', 'seatNum']},
        ]
    })
    return response.json({
        success: true,
        data: tickets,
        message: `All tickets have been loaded`
    })
}

/** create function for filter ticket by ID
 * role user -> hanya nemu tiket miliknya sendiri
 * role admin -> bisa nemu tiket siapa saja
 */
exports.ticketByID = async (request, response) => {
    let ticketID = request.params.id
    let { role, id: userID } = request.user

    let whereClause = {
        ticketID: { [Op.substring]: ticketID }
    }
    if (role === 'user') {
        whereClause.userID = userID
    }

    let tickets = await ticketModel.findAll({
        where: whereClause,
        include: [
            { model: eventModel, attributes: ['eventName','eventDate','venue']},
            { model: userModel, attributes: ['firstName', 'lastName','email']},
            { model: seatModel, attributes: ['rowNum', 'seatNum']},
        ]
    })
    return response.json({
        success: true,
        data: tickets,
        message: `All tickets have been loaded`
    })
}

/** 1. create function to show list of tickets bought by a specific user */
exports.ticketByUser = async (request, response) => {
    /** define userID from request params (from logged in user) */
    let userID = request.params.userID

    /** call findAll() to get tickets only owned by this user */
    let tickets = await ticketModel.findAll({
        where: { userID: userID },
        include: [
            { model: eventModel, attributes: ['eventName', 'eventDate', 'venue'] },
            { model: seatModel, attributes: ['rowNum', 'seatNum'] },
        ]
    })
    return response.json({
        success: true,
        data: tickets,
        message: `Tickets for this user have been loaded`
    })
}

/** 2. create function to show total tickets sold per event */
exports.ticketCountPerEvent = async (request, response) => {
    /** call findAll() with grouping by eventID to count sold tickets */
    let result = await ticketModel.findAll({
        attributes: [
            'eventID',
            [sequelize.fn('COUNT', sequelize.col('ticket.ticketID')), 'totalSold']
        ],
        include: [
            { model: eventModel, attributes: ['eventName', 'eventDate', 'venue'] }
        ],
        group: ['eventID']
    })
    return response.json({
        success: true,
        data: result,
        message: `Total tickets sold per event have been loaded`
    })
}

/** 3. create function to show top 5 events with the most ticket sold
 * only for events that haven't passed yet
 */
exports.topFiveEvents = async (request, response) => {
    /** prepare today's date */
    const today = new Date()
    const todayDate = new Date().toISOString().split('T')[0]
    
    /** call findAll() with grouping by eventID, ordered by total sold descending, limit 5 */
    let result = await ticketModel.findAll({
        attributes: [
            'eventID',
            [sequelize.fn('COUNT', sequelize.col('ticket.ticketID')), 'totalSold']
        ],
        include: [
            {
                model: eventModel,
                attributes: ['eventName', 'eventDate', 'venue'],
                where: {
                    eventDate: { [Op.gte]: todayDate }
                }
            }
        ],
        group: ['eventID'],
        order: [[sequelize.literal('totalSold'), 'DESC']],
        limit: 5
    })
    return response.json({
        success: true,
        data: result,
        message: `Top 5 events with most ticket sold have been loaded`
    })
}

/** create function to cancel a ticket
 * menghapus record ticket + seat terkait, supaya kursinya jadi kosong lagi
 */
exports.cancelTicket = async (request, response) => {
    try {
        let ticketID = request.params.id

        /** cari dulu tiketnya untuk tahu seatID yang terkait */
        let ticket = await ticketModel.findByPk(ticketID)

        if (!ticket) {
            return response.json({
                success: false,
                message: `Ticket not found`
            })
        }

        let seatID = ticket.seatID

        /** hapus record ticket */
        await ticketModel.destroy({ where: { ticketID: ticketID } })

        /** hapus record seat supaya kursi kembali kosong / tersedia */
        await seatModel.destroy({ where: { seatID: seatID } })

        return response.json({
            success: true,
            message: `Ticket has been cancelled`
        })
    } catch (error) {
        return response.json({
            success: false,
            message: error.message
        })
    }
}