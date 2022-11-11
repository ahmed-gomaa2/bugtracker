const connection = require('../../config/database');
const auth = require('../../middlewares/auth.middleware');

const userOwnWorkspace = (req, res, next) => {
    try {
        const user_id = req.user;
        const workspace_id = req.params.id;

        const workspaceGetQuery = 'SELECT * FROM workspaces WHERE id = ? AND owner_id = ?';
        connection.query(workspaceGetQuery, [workspace_id, user_id], (findWorkspaceError, findWorkspaceRes) => {
            if(findWorkspaceError) {
                res.status(500).json({error: {type: 'server', msg: 'SOMETHING WENT WRONG WITH THE SERVER!', err: findWorkspaceError}})
            } else if(findWorkspaceRes.length === 0) {
                res.status(400).json({error: 'client', msg: 'YOU DON\'T HAVE ACCESS TO THIS WORKSPACE!'})
            }else {
                next();
            }
        });
    }catch (e) {
        res.status(400).json({error: {type: 'client', msg: 'YOU DON\'T HAVE ACCESS TO THIS WORKSPACE'}})
    }
}

module.exports = app => {
    app.get('/workspace/:id', auth, userOwnWorkspace, (req, res) => {
        const user_id = req.user;
        const workspace_id = req.params.id;
        const getWorkspaceQuery = 'SELECT * FROM workspaces WHERE id = ? AND owner_id =?';
        connection.query(getWorkspaceQuery, [workspace_id, user_id], (findWorkspaceError, findWorkspaceRes) => {
            if(findWorkspaceError) {
                res.status(500).json({error: {type: 'server', msg: 'SOMETHING WENT WRONG WITH THE SERVER!', err: findWorkspaceError}})
            } else {
                res.send(findWorkspaceRes[0]);
            }
        });
    });
}
