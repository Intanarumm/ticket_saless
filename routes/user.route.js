const express = require(`express`)

const app = express()
app.use(express.json())

const userController = require(`../controllers/user.controller`)
const { midOne } = require("../middlewares/simple-middleware")
const { validateUser } = require("../middlewares/user-validation")
const { authorize } = require('../controllers/auth.controller')
const { IsUser, IsAdmin } = require('../middlewares/role-validation')

app.get("/", authorize, IsAdmin, [midOne], userController.getAllUser)
app.get("/:key", authorize, IsAdmin, userController.findUser)
app.post("/", authorize, IsAdmin, validateUser, userController.addUser)
app.put("/:id", authorize, IsUser, validateUser, userController.updateUser)
app.put("/:id/reset-password", authorize, IsUser, userController.resetPassword)
app.delete("/:id", authorize, IsAdmin, userController.deleteUser)

module.exports = app