const connection = require('../../config/database');


module.exports = app => {
    app.get('/logout', (req, res) => {
         const token = req.header('x-auth-token').toString();
        console.log(token);
        if(!token) {
            res.status(400).json({error: {type: 'client', msg: 'PLEASE LOGIN AND TRY THIS ROUTE!'}});
        }else {
            //check if the token is already expired.
            const findTokenQuery = 'SELECT * FROM expired_tokens WHERE expired_token = ?';
            connection.query(findTokenQuery, token, (findTokenError, findTokenRes) => {
                if(findTokenError) {
                    res.status(500).json({error: {type: 'server', msg: 'SOMETHING WENT WRONG WITH THE SERVER WHILE FINDING THE TOKEN!', err: findTokenError}});
                } else if(findTokenRes.length > 0) {
                    res.status(400).json({error: {type: 'client', msg: 'THIS TOKEN IS ALREADY EXPIRED!'}})
                }else {
                    // Add token to the expired tokens tables.
                    const insertTokenQuery = 'INSERT INTO expired_tokens (expired_token) values (?)';
                    connection.query(insertTokenQuery, token, (insertTokenError, insertTokenRes) => {
                        if(insertTokenError) {
                            res.status(500).json({error: {type: 'server', msg: 'SOMETHING WENT WRONG WITH THE SERVER WHILE TRYING TO INSERT TOKEN TO THE DB!', err: insertTokenError}});
                        } else {
                            res.status(200).json({msg: 'USER LOGGED OUT SUCCESSFULLY!'});
                        }
                    });
                }
            });
        }
    });
}
