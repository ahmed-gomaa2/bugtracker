const connection = require('../../config/database');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const jwtSecretKey = 'hellofromthisawesomeapplication';

const verifyCode = (req, res, next) => {
    try{
        const email = req.body.email;
        const code = req.body.code;

        const verifyCodeQuery = 'select * from codes inner join users on codes.user_id = users.id where codes.code = ? And users.email = ?'
        connection.query(verifyCodeQuery, [code, email], (findCodeEmailError, findCodeEmailRes) => {
            if(findCodeEmailError) {
                res.status(500).json({error: {type: 'server', msg: 'SOMETHING WENT WRONG WITH THE SERVER!', err: findCodeEmailError}})
            } else if(findCodeEmailRes.length === 0) {
                res.status(400).json({error: {type: 'code', msg: 'THIS CODE IS NOT VALID'}})
            }else {
                next();
            }
        });
    }catch (e) {
        res.status(400).json({error: {type: 'code', msg: 'THIS CODE IS NOT LEGAL!', err: e}})
    }
}

module.exports = app => {
    app.put('/reset-password', verifyCode, async (req, res) => {
        try {
            const newPassword = req.body.password;
            const email = req.body.email;
            console.log(email, newPassword)
            const salt = await bcrypt.genSalt(10);
            console.log(salt);
            const hashedPassword = await bcrypt.hash(newPassword, salt);
            const resetPasswordQuery = 'UPDATE user SET password = ? WHERE email = ?';

            connection.query(resetPasswordQuery, [hashedPassword, email], (updatePasswordError, updatePasswordRes) => {
                if(updatePasswordError) {
                    res.status(500).json({error: {type: 'server', msg: 'SOMETHING WENT WRONG WITH THE SERVER!', err: updatePasswordError}})
                } else {
                    res.status(200).send('Please, login with your new password!')
                }
            });

        } catch (err) {
            res.status(500).json({error: {type: 'server', msg: ''}})
        }
    });
}
