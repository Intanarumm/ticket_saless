/** load md5 library */
const md5 = require(`md5`)

/** load library jsonwebtoken */
const jwt = require(`jsonwebtoken`)

/** load model of user */
const userModel = require(`../models/index`).user

/** define secret key as signature */
const secret = `mokleters`

/** create function to handle authenticating process */
const authenticate = async (request, response) => {
    let dataLogin = {
        email: request.body.email,
        password: md5(request.body.password)
    }

    /** check data username and password on user's table */
    let dataUser = await userModel.findOne({ where: dataLogin })

    /** if data user exists */
    if (dataUser) {
        /** ✅ FIX: payload harus berupa object, JANGAN di-stringify.
         * ✅ FIX: primary key di model user itu "userID", bukan "id",
         * jadi ambil dari dataUser.userID.
         */
        let payload = {
            id: dataUser.userID,
            email: dataUser.email,
            role: dataUser.role
        }

        /** generate token */
        let token = jwt.sign(payload, secret)

        /** define response */
        return response.json({
            success: true,
            logged: true,
            message: `Authentication Success`,
            token: token,
            data: dataUser
        })
    }
    /** if data user is not exists */
    return response.status(401).json({
        success: false,
        logged: false,
        message: `Authentication Failed. Invalid username or password`
    })
}

/** create function authorize */
const authorize = (request, response, next) => {
    /** get "Authorization" value from request's header */
    const authHeader = request.headers.authorization;

    /** check nullable header */
    if (authHeader) {
        const token = authHeader.split(' ')[1];

        /** jwt.verify() melempar error (throw), bukan return null,
         * jadi dibungkus try-catch supaya tidak crash saat token
         * invalid / expired / malformed.
         */
        try {
            let verifiedUser = jwt.verify(token, secret);

            request.user = verifiedUser; // sekarang berupa object { id, email, role, iat }
            next();
        } catch (error) {
            return response.status(401).json({
                success: false,
                auth: false,
                message: `User Unauthorized`
            })
        }
    } else {
        return response.status(401).json({
            success: false,
            auth: false,
            message: `User Unauthorized`
        })
    }
}

/** export function to another file */
module.exports = { authenticate, authorize }