const connection = require('../../config/database');
const jwt = require('jsonwebtoken');
const bcryptjs = require('bcryptjs');
const jwtSecretKey = 'hellofromthisawesomeapplication';

module.exports = app => {
    app.post('/login', (req, res) => {
        const {email, password} = req.body;
        console.log(password)
        try{
            // Checking if the user does exist.
            const findUserQuery = 'SELECT * FROM user WHERE email = ?';
            connection.query(findUserQuery, email, async (findUserError, findUserRes) => {
                if(findUserError) {
                    res.status(500).json({error: {type: 'server', msg: 'SOMETHING WENT WRONG WITH THE SERVER WHILE FINDING THE USER IN THE DB!', err: findUserError}});
                } else if(findUserRes.length === 0) {
                    res.status(400).json({error: {type: 'email', msg: 'THIS USER DOESN\'T EVEN EXIST PLEASE REGISTER!'}});
                }else {
                    // compare the password with the one in the DB.
                    const isPasswordMatch = await bcryptjs.compare(password, findUserRes[0].password);
                    console.log(findUserRes[0].password);

                    if(!isPasswordMatch) {
                        res.status(400).json({error: {type: 'password', msg: 'WRONG PASSWORD'}});
                    }else {
                        const payload = {
                            user: {
                                id: findUserRes[0].id
                            }
                        }

                        //Create the jwt token and send it to the client.
                        jwt.sign(
                            payload,
                            jwtSecretKey,
                            {
                                expiresIn: '30000000000'
                            },
                            (jwtErr, token) => {
                                if(jwtErr) {
                                    res.status(500).json({error: {type: 'server', msg: 'SOMETHING WENT WRONG WITH THE SERVER WHILE CREATING THE JWT TOKEN!'}});
                                }else {
                                    res.json({token});
                                }
                            }
                        )
                    }
                }
            });
        }catch (e) {
            console.log(e);
            res.status(500).json({error: {type: 'server', msg: 'SOMETHING WENT WRONG WITH THE SERVER WHILE LOGGING IN THE USER!', err: e}})
        }
    });
}
