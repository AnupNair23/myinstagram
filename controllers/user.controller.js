const UserModel = require('../models/user.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// const Customer = model.UserModel

exports.signUp = function (req, res) {
    console.log(req.body);
    UserModel.countDocuments({
            emailId: req.body.emailId
        })
        .then(checkUser)

    function checkUser(count) {
        console.log('count ==== ', count)
        if (count > 0) {
            console.log('Username exists.');
            let body = {
                status: 203,
                message: 'User already exists',
                data: []
            }
            return res.json(body);
        } else {
            console.log('Username does not exist.');
            let cryptedPassword = bcrypt.hashSync(req.body.password, 10);
            user = new UserModel({
                name: req.body.name,
                emailId: req.body.emailId,
                password: cryptedPassword
            });
            user.save(function (err, data) {
                if (err) {
                    return next(err);
                }
                let response = {
                    status: 200,
                    message: "User successfully created",
                    data: req.body
                }
                return res.json(response);
            })
        }
    }

};

exports.signIn = function (req, res, next) {
    console.log(req.body);
    UserModel.findOne({
        emailId: req.body.emailId
    }, function (err, userInfo) {
        if (err) {
            next(err);
        } else {
            if (bcrypt.compareSync(req.body.password, userInfo.password)) {
                const token = jwt.sign({
                    id: userInfo._id
                }, req.app.get('secretKey'), {
                    expiresIn: '1h'
                });
                res.json({
                    status: 200,
                    message: "User signIn Successfull",
                    data: {
                        user: userInfo,
                        token: token
                    }
                });
            } else {
                res.json({
                    status: 400,
                    message: "Invalid email/password",
                    data: []
                });
            }
        }
    });
}

exports.getProfile = function (req, res, next) {
    console.log(req.params.emailId);

    UserModel.findOne({
            emailId: req.params.emailId
        },
        function (err, userInfo) {
            if (err) {
                next(err);
                console.log('no user');
            } else {
                if (userInfo != null) {
                    console.log(userInfo);
                    let response = {
                        status: 200,
                        message: "User details fetched",
                        data: userInfo
                    }
                    res.json(response)
                }
                else {
                    let response = {
                        status: 203,
                        message: "User details not found",
                        data: []
                    }

                    res.json(response);
                }
            }
        })
}
