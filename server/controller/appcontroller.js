const User = require('../model/User.js')
const bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
const { JWT_S } = require('../config.js');
const otpGenerator = require('otp-generator')



/*  *POST method:http://localhost:8080/api/register
*@param:
"username":"iamkhush",
"password":"abc@123",
"email":"Khushboo123@gmail.com",
"firstname":"Khushboo",
"lastname":"Verma",
 "address":"Hunda Wala Bagh,Fzd",
*/


register = async (req, res) => {
    try {
        const { username, email, profile, address, password, mobile } = req.body;
        console.log(req.body);
        //check existing user
        const existinguser = await User.findOne({ username });
        if (existinguser) {
            return res.status(500).send({ err: "Username already exist" });
        }

        const existingemail = await User.findOne({ email });
        if (existingemail) {
            return res.status(401).send({ err: "Email already exist" })
        }
        const hashedpassword = await bcrypt.hash(password, 10);
        let user = await new User({
            username: username,
            password: hashedpassword,
            email: email,
            profile: profile,
            address: address,
            mobile: mobile
        })
        const data = {
            user: {
                id: user.id
            }
        }
        var token = await jwt.sign(data, JWT_S);
        user.save().
            then(result => { return res.status(200).send({ msg: result, token }) }).
            catch(err => { return res.status(500).send({ err: "this is error!" }) })

    } catch (err) {
        return res.status(500).send({ err: "this is error" });
    }

}

/*  *POST method:http://localhost:8080/api/login
*@param:
"username":"iamkhush",
"password":"abc@123",
"email":"Khushboo123@gmail.com",
"firstname":"Khushboo",
"lastname":"Verma",
 "address":"Hunda Wala Bagh,Fzd",
*/

login = async (req, res) => {
    try {
        let user = await User.findOne({ username: req.body.username });
        var success = false;
        // console.log(user);
        if (!user) {
            return res.status(400).json({ success, error: "Try to login with another username" });
        }
        console.log(user.password, " ", req.body.password);
        bcrypt.compare(req.body.password, user.password).
            then((password) => {
                console.log(password);
                if (!password) {
                    return res.status(500).send({ msg: "this is wrong password!!" });
                }
                var token = jwt.sign(
                    {
                        userId: user._id,
                        username: user.username
                    }, JWT_S, { expiresIn: "24h" });
                return res.status(200).json({ success: true, token });
            })
            .catch(err => {
                return res.status(400).json({ success, error: "Try to login with another password" });
            })

    } catch (err) {
        return res.status(500).send({ success, error: "Internal server error" });
    }
}



/*  *GET method:http://localhost:8080/api/user/example@123
*@param:
"email":"Khushboo123@gmail.com",
*/

getUser = async (req, res) => {
    const { username } = req.params;
    console.log(username);
    try {
        if (!username) return res.status(501).send({ err: "Invalid username" })
        const user = await User.findOne({ username }).
            then((user) => {
                if (!user)
                    return res.status(500).send({ err: "Cant Find information" })

                const { password, ...rest } = Object.assign({}, user.toJSON());
                return res.status(200).send(rest);
            })
            .catch(err => {
                return res.status(500).send(err);
            })


    } catch (err) {

        return res.status(400).send("error");
    }

}
/*  *PUT method:http://localhost:8080/api/updateUser
*@param:
"email":"Khushboo123@gmail.com",
*/
updateUser = async (req, res) => {
    // console.log(req);
    const id = req.user.userId;

    // const id = req.query.id;
    try {
        if (id) {
            const body = req.body;

            User.updateOne({ _id: id }, body).then((result) => { return res.status(200).send(result) }).catch(err => { return res.status(500).send(err); })
        }
        else {
            return res.status(400).send({ error: "Invalid Id" });
        }


    } catch (error) {
        return res.status(400).send({ error });
    }
}


/*  *GET method:http://localhost:8080/api/generateOTP
*@param:
"email":"Khushboo123@gmail.com",
*/
generateOTP = async (req, res) => {
    try {
        console.log("Hello!!");
        req.app.local.OTP = otpGenerator.generate(6, { upperCaseAlphabets: false, lowerCaseAlphabets: false, specialChars: false });
        return res.status(201).send({ code: req.app.local.OTP });

    } catch (err) {
        return res.status(500).send("Error Occured!!");
    }
}


/*  *GET method:http://localhost:8080/api/verifyOTP
*@param:
"email":"Khushboo123@gmail.com",
*/
verifyOTP = async (req, res) => {
    try {
        const { code } = req.query;
        if (req.app.local.OTP == code) {
            req.app.local.OTP = null;
            req.app.local.resetsession = true;
            return res.status(201).send("Successfull");
        }
        return res.status(500).send("INVALID OTP");

    } catch (err) {
        return res.status(500).send(err);
    }
}
/*  *GET method:http://localhost:8080/api/createresetsession
*@param:
"email":"Khushboo123@gmail.com",
*/
createResetSession = async (req, res) => {
    try {
        if (req.app.local.resetsession) {
            req.app.local.resetsession = false;
            return res.status(201).send("Access Grant");

        }
        return res.statue(404).send("cant grant access!!");


    } catch (err) {
        return res.status(404).send("Session expired");
    }
}

/*  *PUT method:http://localhost:8080/api/resetpassword
*@param:
"email":"Khushboo123@gmail.com",
*/
resetPassword = async (req, res) => {
    if (!req.app.local.resetsession) return res.status(404).send("Session expired");
    const { username, password } = req.body;
    try {
        User.findOne({ username }).then((user) => {
            bcrypt.hash(password, 10).then(password => {
                User.updateOne(user.password, password);
                req.app.local.resetsession = false;
                return res.status(200).send({ msg: "Successfully reset password!!" });

            }).catch(err => { return res.status(500).send(err); })

        })
            .catch(err => { return res.status(500).send("Cant Reset Password!!"); })

    } catch (err) {
        return res.status(404).send(err);
    }

}


module.exports = { register, login, getUser, updateUser, generateOTP, verifyOTP, createResetSession, resetPassword };