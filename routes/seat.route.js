/** load library express */
const express = require(`express`)

/** initiate object that instance of express */
const app = express()
/** allow to read 'request' with json type */
app.use(express.json())
/** load seat's controller */
const seatController = require(`../controllers/seat.controller`)

/** create route to get data with method "GET" */
app.get("/", seatController.getAllSeats)
/** create route to find seat 
 * using method "GET" and define parameter "key" for keyword */
app.get("/:key", seatController.findSeat)
/** create route to add new seat using method "POST" */
app.post("/", seatController.addSeat)
/** create route to update seat
 * using method "PUT" and define parameter for "id" */
app.put("/:id", seatController.updateSeat)
/** create route to delete seat
 * using method "DELETE" and define parameter for "id" */
app.delete("/:id", seatController.deleteSeat)

/** export app in order to load in another file */
module.exports = app