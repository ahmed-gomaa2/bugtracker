const connection = require('../../config/database');
const auth = require('../../middlewares/auth.middleware');

module.exports = app => {
    app.get('/fetch-users', auth, (req, res) => {
        try {
            const fetchUsersQuery = 'SELECT id, username, email FROM user';
            connection.query(fetchUsersQuery, (fetchUsersError, fetchUsersRes) => {
                if(fetchUsersError) {
                    res.status(500).json({error: {type: 'server', msg: 'SOMETHING WENT WRONG WITH THE SERVER!', err: fetchUsersError}})
                } else if(fetchUsersRes.length === 0) {
                    res.status(200).send([]);
                }else {
                    res.status(200).send(fetchUsersRes);
                }
            });
        } catch (e) {
            res.status(500).json({error: {type: 'server', msg:'SOMETHING WENT WRONG WITH THE SERVER!', err: e}})
        }
    });
}