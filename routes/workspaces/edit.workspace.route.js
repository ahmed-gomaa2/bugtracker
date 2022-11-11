const connection = require('../../config/database');
const auth = require('../../middlewares/auth.middleware');

const userOwnWorkspace = (req, res, next) => {
    try{
        const user_id = req.user;
        const workspace = req.body;
        const findWorkspaceQuery = 'SELECT * FROM workspaces WHERE id = ? AND owner_id = ?';
        connection.query(findWorkspaceQuery, [workspace.id, user_id], (findWorkSpaceError, findWorkspaceRes) => {
            if(findWorkSpaceError) {
                res.status(500).json({error: {type: 'server', msg: 'SOMETHING WENT WRONG WITH THE SERVER!', err: findWorkSpaceError}})
            } else if(findWorkspaceRes.length === 0) {
                res.status(400).json({error: {type: 'client', msg: 'YOU DON\'T HAVE ACCESS TO THIS WORKSPACE!'}})
            }else {
                next();
            }
        });
    }catch (e) {
        res.status(400).json({error: {type: 'client', msg: 'YOU DON\'T HAVE ACCESS TO THIS WORKSPACE!'}})
    }
}

module.exports = app => {
    app.put('/edit-workspace', auth, userOwnWorkspace, (req, res) => {
        const user_id = req.user;
        const workspace = req.body;
        const updateWorkspaceQuery = 'UPDATE workspaces SET name = ?, description = ? WHERE id = ?';

        connection.query(updateWorkspaceQuery, [workspace.name, workspace.description, workspace.id], (updateWorkspaceError, updateWorkspaceRes) => {
            if(updateWorkspaceError) {
                res.status(500).json({error: {type: 'server', msg: 'SOMETHING WENT WRONG WITH THE SERVER!', err: updateWorkspaceError}})
            } else {
                const updatedWorkspace = {
                    ...workspace,
                }

                res.status(200).send(updatedWorkspace);
            }
        });
    });
}
