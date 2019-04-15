const FireBase = require('../firebase');
const httpCode = require('../http_code');
const randomstring = require('randomstring');

var Auth = {
    login: function (phone, password) {
        return FireBase.login(phone, password);
    },
    signOut: function () {
        return FireBase.logout();
    },
    loged: function () {
        return FireBase.logged();
    },
    connectDatabaseRegister: function (phone) {
        return FireBase.connectFirebaseDatabaseRegister(phone);
    },
    connectDatabaseCreateUser: (uid) => {
        return FireBase.connectDatabaseCreateUser(uid);
    },
    connectDatabaseSignup : ()=> {
        return FireBase.connectDatabaseSignUp();
    },
    createNewUser: (phone, password) => {
        return FireBase.createNewUser(phone, password);
    },
    getInfoUser: () => {
        return FireBase.getDataInfireStore();
    }
}

module.exports.authLogin = function (req, res) {
    const phone = req.body.phone;
    const pass = req.body.password;
    const mail = `${phone}@gmail.com`
    
    res.header('Content-Type', 'application/json');

    Auth.login(phone, pass)
        .then(() => {
            console.log(phone)
            Auth.connectDatabaseSignup().push({
                phone,
                mail
            }).then(() => {
                res.json(JSON.stringify(httpCode.authStatus()))
            })
        })
        .catch(err => {
            res.json(JSON.stringify(httpCode.authStatus()))
            res.end();
        })
}


module.exports.sms = (req, res) => {
    var phone_number = req.body.to;
    const TWILIO = {
        accountSID: 'ACa10351c021a6c4b50692d401da28f324',
        phone_number: '+15127725694',
        authToken: '216900306ffdf929645ee36c93d4fcf0'
    }

    const twilioClient = require('twilio')(
        TWILIO.accountSID,
        TWILIO.authToken
    );
    const number = randomstring.generate({
        length: 4,
        charset: 'numeric'
    });
    res.header('Content-Type', 'application/json');

    // Send sms code
    twilioClient.messages.create({
        from: TWILIO.phone_number,
        to: req.body.to,
        body: number
    })
        .then(() => {
            res.send(JSON.stringify({ success: true }));
        })
        .catch(err => {
            console.log(err)
            res.send(JSON.stringify({ success: false }));

        })


    // save data into firebase
    Auth.connectDatabaseRegister(phone_number).set({
        smsCode: number,
        phone_number: req.body.to
    })
}

module.exports.verifySmsCode = (req, res) => {
    var Code = req.body.smsCode;
    var phone_number = req.body.to;
    console.log('so dt gui len', phone_number)
    console.log('macode gui len', Code)
    res.header('Content-Type', 'application/json');

    Auth.connectDatabaseRegister(phone_number).once('value')
        .then((data) => {
            if (data.val().smsCode === Code) {
                console.log(true)
                res.json({ success: true })
            } else {
                console.log(false)
                res.json({ success: false })
            }
        })
        .catch(e => {
            res.json({
                success: false,
                err: e
            })
        })
}

module.exports.createNewUser = (req, res) => {
    var password = req.body.password;
    var phone_number = req.body.to;
    let phone = phone_number.replace(/^\+/, '');

    res.header('Content-Type', 'application/json');

    Auth.createNewUser(phone, password)
        .then((data) => {
            console.log(data.user.uid)
            Auth.connectDatabaseCreateUser(data.user.uid).set({
                email: data.user.email,
                phone: phone,
                password: password,
            })
                .then(() => {
                    Auth.signOut()
                        .then(() => {
                            console.log('signup thanh cong')
                            Auth.login(phone, password)
                                .then(() => {
                                    console.log('login thanh cong')
                                    Auth.connectDatabaseSignup().push({
                                        phone, password
                                    }).then(() => {
                                        console.log('push thanh cong')
                                        res.json({ success: true })
                                    })
                                })
                        })
                })
        })

        .catch(e => {
            res.json({ success: false, e: e })
        })

}
module.exports.getInfoUser = (req, res) => {
    Auth.getInfoUser().then((data) => {
        console.log(data)
        res.send({ success: true })
    }).catch(e => { res.send({ success: false, e }) })
}


module.exports.signOut = (req, res) => {
    Auth.signOut().then(() => {
        res.send(JSON.stringify({ success: true }))
    }).catch(err => {
        res.send(JSON.stringify({ success: false, err }))
    })
}

module.exports.loged = (req, res) => {
    let user = Auth.loged();
    console.log(user)
    if (user) {
        res.json({ success: true })
    } else {
        res.json({ success: false })
    }
}