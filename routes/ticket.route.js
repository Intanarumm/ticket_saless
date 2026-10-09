/** load library express */
const express = require(`express`)

/** initiate object that instance of express */
const app = express()

/** allow to read 'request' with json type */
app.use(express.json())

/** load ticket's controller */
const ticketController = require(`../controllers/ticket.controller`)

/** load middleware auth & role */
const { authorize } = require(`../controllers/auth.controller`)
const { IsUser, IsAdmin } = require(`../middlewares/role-validation`)

/** create route to add new ticket using method "POST" — TANPA LOGIN */
app.post("/", ticketController.addTicket)

/** create route to get data with method "GET" */
app.get("/", authorize, ticketController.getAllTicket)

/** create route to show tickets bought by specific user (admin only) */
app.get("/user/:userID", authorize, IsAdmin, ticketController.ticketByUser)

/** create route to show total tickets sold per event */
app.get("/stats/per-event", authorize, IsAdmin, ticketController.ticketCountPerEvent)

/** create route to show top 5 events with most ticket sold */
app.get("/stats/top-events", authorize, IsAdmin, ticketController.topFiveEvents)

/** create route to cancel a ticket */
app.delete("/:id/cancel", ticketController.cancelTicket)

/** create route to get data by id with method "GET" */
app.get("/:id", authorize, ticketController.ticketByID)

/** export app in order to load in another file */
module.exports = app