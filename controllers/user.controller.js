const UserModel = require('../models/user.model');
const ImageModel = require('../models/image.model')
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
            console.log(userInfo);
            if (userInfo === null) {
                let body = {
                    status: 400,
                    message: "Please check username/password"
                }

                return res.json(body);
            }
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

exports.getProfile = function (req, res) {

    const token = req.headers.authorization.split(' ')[1];
    try {
        decoded = jwt.verify(token, req.app.get('secretKey'));
    } catch (e) {
        return res.status(401).send('unauthorized');
    }
    var userId = decoded.id;
    // Fetch the user by id 
    UserModel.findById({
        _id: userId
    }).then(function (user) {
        // Do something with the user
        console.log('user ==== ', user);
        if (user != null) {
            let response = {
                status: 200,
                message: "User details fetched",
                data: user
            }
            res.json(response)
        } else {
            let response = {
                status: 203,
                message: "User details not found",
                data: []
            }

            res.json(response);
        }

    });



}



exports.likePost = function (req, res) {


    console.log('check this body', req.body);

    const token = req.headers.authorization.split(' ')[1];
    try {
        decoded = jwt.verify(token, req.app.get('secretKey'));
    } catch (e) {
        return res.status(401).send('unauthorized');
    }
    var userId = decoded.id;

    UserModel.findOne({
            _id: userId
        },
        function (err, user) {
            if (err) {
                console.log(err);
            }

            console.log('check user === ', user)
            ImageModel.findOne({
                    name: req.body.name
                },
                function (err, image) {
                    if (err)
                        console.log(err)
                    console.log('coming here or what?', image)
                    if (image == null) {
                        console.log('image is null');
                        var imageModel = new ImageModel({
                            "name": req.body.name,
                            "urlImage": req.body.url
                        });
                        let body = {
                            userId: user._id,
                            name: user.name
                        }
                        console.log('check ====', body);
                        imageModel.usersLikes.push(body);
                        imageModel.save(function (err) {
                            if (err)
                                console.log(err);

                            console.log('yes got saved');
                        })
                    } else {
                        let body = {
                            userId: user._id,
                            name: user.name
                        }
                        console.log('check ====', body);
                        // imageModel.usersLikes.push(body);
                        image.usersLikes.push(body);
                        image.save(function (err) {
                            if (err)
                                console.log(err);

                            console.log('yes got saved');
                        })

                        user.imagesLiked.push(req.body);
                        user.save(function (err) {
                            if (err)
                                console.log(err)
                            console.log(res);
                            let resp = {
                                status: 200,
                                message: 'User successfully liked the post',
                            }
                            return res.json(resp);
                        })
                    }
                })

        })
}


exports.dislike = function (req, res) {
    console.log('body ===== ', req.body);

    const token = req.headers.authorization.split(' ')[1];
    try {
        decoded = jwt.verify(token, req.app.get('secretKey'));
    } catch (e) {
        return res.status(401).send('unauthorized');
    }
    var userId = decoded.id;

    UserModel.findById({
        _id: userId
    }, function (err, user) {
        if (err)
            console.log(err);

        console.log(user.imagesLiked.length);
        let imagesLiked = user.imagesLiked.slice();
        // let i = 0;
        user.imagesLiked.map((image, index) => {
            // var i = 0;
            console.log(index);
            if (image.name.toString() === req.body.name.toString()) {
                console.log('cutting')
                imagesLiked.splice(index, 1)
            }

            // i++;
        })

        ImageModel.findOne({
            name: req.body.name
        }, function (err, image) {
            if (err)
                console.log(err);

            console.log('check this image ==== ', image);
            let userLikes = image.usersLikes.slice();
            image.usersLikes.map((image2, index) => {
                console.log(index);
                console.log('check this image out boys --', image2, userId);
                if (image2.toString() === userId.toString()) {
                    console.log('cutting')
                    userLikes.splice(index, 1);
                }
                console.log(userLikes)
            })
            console.log('outside scope userlikes === ', userLikes)
            image.usersLikes = userLikes;

            image.save(function (err) {
                if (err)
                    console.log(err);

                console.log('image is also saved', image)
            })
        })

        console.log('ithaano', imagesLiked);

        user.imagesLiked = imagesLiked;


        user.save(function (err) {
            if (err)
                console.log(err)
            console.log(res);
            let resp = {
                status: 200,
                message: 'User successfully disliked the post',
            }
            return res.json(resp);
        })

    })
}

exports.getPosts = function (req, res) {

    ImageModel.find(function (err, images) {
        if (err)
            console.log(err);
        console.log('images ==== ', images);
        // images.map((image) => {
        //     let users = [];
        //     console.log('check this out === ', image.usersLikes);
        //     // console.log(body, 'check out the body');
        // })

        return res.json(images);
    })

}