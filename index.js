/** load library express */
const express = require(`express`)

/** create object that instances of express */
const app = express()

/** define port of server */
const PORT = 8000

/** load library cors */
const cors = require(`cors`)

/** open CORS policy */
app.use(cors())

/** parse JSON body dari request */
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

/** define all routes */
const userRoute = require(`./routes/user.route`)
const diskonRoute = require(`./routes/diskon.route`)
const eventRoute = require(`./routes/event.route`)
const seatRoute = require(`./routes/seat.route`)
const ticketRoute = require(`./routes/ticket.route`)
const auth = require(`./routes/auth.route`)
const subdistrictRoute = require('./routes/subdistrict.route')

/** define prefix for each route */
app.use(`/user`, userRoute)
app.use(`/diskon`, diskonRoute)
app.use(`/event`, eventRoute)
app.use(`/seat`, seatRoute)
app.use(`/ticket`, ticketRoute)
app.use(`/auth`, auth)
app.use('/api/subdistricts', subdistrictRoute)

/** route to access uploaded file */
app.use(express.static(__dirname))

/** run server based on defined port */
app.listen(PORT, () => {
    console.log(`Server of Ticket Sales runs on port ${PORT}`)
})