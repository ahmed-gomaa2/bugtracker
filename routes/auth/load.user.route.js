const connection = require('../../config/database');
const auth = require('../../middlewares/auth.middleware');

module.exports = app => {
    app.get('/load-user', auth, (req, res) => {
        const user_id = req.user;
        try{
            //find the user in the db
            const findUserQuery = 'SELECT * FROM user WHERE id = ?';
            connection.query(findUserQuery, user_id, (findUserError, findUserRes) => {
                if(findUserError) {
                    res.status(500).json({error: {type: 'server', msg: 'SOMETHING WENT WRONG WITH THE SERVER WHILE TRYING TO FIND USER DATA!'}})
                } else if(findUserRes.length === 0) {
                    res.status(400).json({error: {type: 'client', msg: 'THIS USER DOESN\'T EXIST ANY MORE!'}})
                }else {
                    //send the user data to the client.
                    const user = {
                        id: user_id,
                        username: findUserRes[0].username,
                        email: findUserRes[0].email
                    }
                    res.send(user);
                }
            });
        }catch (e) {
            res.status(500).json({error: {type: 'server', msg: 'SOMETHING WENT WRONG WITH THE SERVER WHILE TRYING TO LOAD THE USER DATA!', err: e}})
        }
    });
}
