const connection = require('../../config/database');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const jwtSecretKey = 'hellofromthisawesomeapplication';


module.exports = app => {
    app.post('/register', (req, res) => {
        const {username, email, password, admin} = req.body;
        try{
            // Check if the user already exists.
            const userExistsQuery = 'SELECT * FROM user WHERE email = ?';
            connection.query(userExistsQuery, email, async (findUserError, findUserRes) => {
                if(findUserError) {
                    console.log(findUserError);
                    res.status(500).json({error: {type: 'server', msg: 'SOMETHING WENT WRONG WITH THE SERVER WHILE TRYING TO FIND THE USER EXISTS!', err: findUserError}});
                }else if(findUserRes.length > 0){
                    res.status(409).json({error: {type: 'email', msg: 'A USER WITH THE SAME EMAIL ALREADY EXISTS!'}});
                }else {

                    // Handle password hashing using bcrypt.
                    const salt = await bcrypt.genSalt(10);
                    console.log(salt);
                    const hashedPassword = await bcrypt.hash(password, salt);

                    // Insert user into the database.
                    const insertUserQuery = 'INSERT INTO user (username, email, password) VALUES (?, ?, ?)';
                    connection.query(insertUserQuery, [username, email, hashedPassword], (insertUserError, insertUserRes) => {
                        if(insertUserError) {
                            res.status(500).json({error: {type: 'server', msg: 'SOMETHING WENT WRONG WITH THE SERVER WHILE TRYING TO INSERT USER INTO DB!', err: insertUserError}});
                        }else {
                            const user = {
                                id: insertUserRes.insertId,
                                username
                            }

                            const payload = {
                                user: {
                                    id: insertUserRes.insertId
                                }
                            }

                            // creating the jwt.
                            jwt.sign(
                                payload,
                                jwtSecretKey,
                                {
                                    expiresIn: 350000
                                },
                                (err, token) => {
                                    if(err) {
                                        res.status(500).json({error: {type: 'jwt', msg: 'SOMETHING WENT WRONG WITH THE SERVER WHILE CREATING THE JWT!', err: err}});
                                    }else {
                                        res.json({token, user});
                                    }
                                }
                            )
                        }
                    });
                }
            });
        } catch (e) {
            res.status(500).json({error: {type: 'server', msg: 'SOMETHING WENT WRONG WITH THE SERVER WHILE TRYING TO REGISTER USER', err: e}})
        }
    });
}
