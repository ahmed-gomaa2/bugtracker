const connection = require('../../config/database');
const auth = require('../../middlewares/auth.middleware');

module.exports = app => {
    app.get('/get-users', auth, (req, res) => {
        const getAllUsersQuery = 'SELECT id, username, email FROM user';
        connection.query(getAllUsersQuery, (getAllUsersError, getAllUsersRes) => {
            if(getAllUsersError) {
                res.status(500).json({error: 'server', msg: 'SOMETHING WENT WRONG WITH THE SERVER!', err: getAllUsersError})
            } else {
                res.status(200).send(getAllUsersRes)
            }
        });
    });
}