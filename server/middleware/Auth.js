const { JWT_S } = require("../config.js");
const jwt = require("jsonwebtoken");
const User = require("../model/User.js");

verifyUser = async (req, res, next) => {
    console.log(req);
    var { username } = ((req.method === 'GET') ? req.query : req.body);
    console.log(username);
    if (!username) {
        return res.status(400).send("No such user");
    }

    try {
        User.findOne({ username }).then((username) => {
            if (!username) {
                return res.status(404).send("User does not exist");
            }
            next();
        })
            .catch(err => { return res.status(500).send(err); })

    } catch (err) {
        return res.status(501).send(err);
    }

}




Auth = async (req, res, next) => {
    const token = req.headers.authorization.split(" ")[1];
    if (!token) {
        return res.status(600).send({ error: "not valid token" });
    }
    try {
        const data = await jwt.verify(token, JWT_S);
        req.user = data;
        next();
    } catch (err) {
        return res.status(500).send({ err: "Cant authorize" });
    }
}


localVariables = async (req, res, next) => {
    req.app.local = {
        OTP: null,
        resetsession: false
    }
    next();
}


module.exports = { Auth, localVariables, verifyUser };