const nodemailer = require('nodemailer');
const connection = require('../../config/database');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'engahmedgomaa97@gmail.com',
        pass: 'zyqsemiiebpqqvyg'
    },
    tls: {
        rejectUnauthorized: false
    }
});

const generateMailOptions = (code, email) => {
    return {
        from: 'bugtracker@gmail.com',
        to: email,
        subject: 'reset your bug-tracker password!',
        text: `use this code to reset your password ${code}`
    }
}

const mailOptions = {
    from: 'bugtracker@gmail.com',
    to: 'engahmedgomaa1997@gmail.com',
    subject: 'Sending Email using node.js',
    text: 'That was easy!'
}

const generateRandomCode = () => {
    let number = Math.floor(Math.random() * 9) + 1;
    for(let i = 0; i < 4; i++) {
        const random = Math.floor(Math.random() * 9) + 1;
        number = number + `${random}`;
    }
    return +number;
}

const doesEmailExists = (req, res, next) => {
    try {
        const {email} = req.body;
        const findEmailQuery = 'SELECT * FROM user WHERE email = ?';
        connection.query(findEmailQuery, email, (findEmailError, findEmailRes) => {
            if(findEmailError) {
                res.status(500).json({error: {type: 'server', msg: 'SOMETHING WENT WRONG WITH THE ERROR!', err: findEmailError}})
            } else if(findEmailRes.length === 0) {
                res.status(400).json({error: {type: 'email', msg: 'THIS EMAIL DOESN\'T EVEN EXIST!'}})
            }else {
                req.user_id = findEmailRes[0].id;
                next();
            }
        });
    }catch (e) {
        res.status(400).json({error: {type: 'email', msg: 'THIS EMAIL DOESN\'T EXIST!', err: e}})
    }
}

module.exports = app => {
    app.post('/send-email', doesEmailExists, async (req, res) => {
        const randomNumber = generateRandomCode();
        const {email} = req.body;
        console.log('Hello from the route!')
        transporter.sendMail(generateMailOptions(randomNumber, email), (err, info) => {
            if (err) {
                res.send(err.message);
            }else {
                const insertCodeQuery = 'INSERT INTO codes (user_id, code) values (?, ?)';
                connection.query(insertCodeQuery, [req.user_id, randomNumber], (insertCodeError, insertCodeRes) => {
                    if(insertCodeError) {
                        res.status(500).json({error: {type: 'server', msg: 'SOMETHING WENT WRONG WITH THE SERVER!', err: insertCodeError}})
                    } else {
                        res.status(200).json({redirect: true})
                    }
                });
            }
        })
    })
}
