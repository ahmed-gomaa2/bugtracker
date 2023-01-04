const connection = require('../config/database');
const jwt = require('jsonwebtoken');
const jwtSecretKey = 'hellofromthisawesomeapplication';

module.exports = (req, res, next) => {
    const token = req.header('x-auth-token');
    if(!token) {
        return res.status(400).json({error: {type: 'jwt', msg: 'THERE IS NO TOKEN!'}});
    }else {
        // check if the token is in expired in the database.
        const findTokenQuery = 'SELECT * FROM expired_tokens WHERE expired_token = ?';
        connection.query(findTokenQuery, token, (findTokenError, findTokenRes) => {
            if(findTokenError) {
                res.status(500).json({error: {type: 'server', msg: 'SOMETHING WENT WRONG WITH THE SERVER WHILE TRYING TO FIND THE TOKEN!', err: findTokenError}});
            } else if(findTokenRes.length > 0) {
                res.status(400).json({error: {type: 'client', msg: 'THIS TOKEN IS ALREADY EXPIRED TRY LOGIN AGAIN!'}});
            }else {
                try{
                    //Verify the token and send it to the request.
                    jwt.verify(token, jwtSecretKey, (err, decoded) => {
                        if(err) {
                            console.log(err);
                        }
                        req.user = decoded.user.id;
                        next();
                    });
                }catch (e) {
                    res.status(400).json({error: {type: 'jwt', msg: 'THIS TOKEN IS EXPIRED!'}})
                }
            }
        });
    }
}
