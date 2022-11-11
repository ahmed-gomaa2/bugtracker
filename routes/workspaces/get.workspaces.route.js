const connection = require('../../config/database');
const auth = require('../../middlewares/auth.middleware');

module.exports = app => {
    app.get('/fetch-workspaces', auth, (req, res) => {
        try{
            const user_id = req.user;
            const fetchWorkspacesQuery = 'SELECT * FROM workspaces WHERE owner_id = ?';
            connection.query(fetchWorkspacesQuery, user_id, (fetchWorkspacesError, fetchWorkspacesRes) => {
                if(fetchWorkspacesError) {
                    res.status(500).json({error: {type: 'server', msg: 'SOMETHING WENT WRONG WITH THE SERVER!', err: fetchWorkspacesError}})
                }else if(fetchWorkspacesRes.length === 0) {
                    res.status(200).send([]);
                }else {
                    res.status(200).send(fetchWorkspacesRes);
                }
            })
        }catch (e) {
            res.status(500).json({error: {type: 'server', msg: 'SOMETHING WENT WRONG WITH THE SERVER!', err: e}})
        }
    });
}
