const connection = require('../../config/database');
const auth = require('../../middlewares/auth.middleware');

const userOwnWorkspace = (req, res, next) => {
    try{
        const user_id = req.user;
        const workspace_id = req.params.id;
        const findWorkspaceQuery = 'SELECT * FROM workspaces WHERE owner_id = ? AND id = ?';
        connection.query(findWorkspaceQuery, [user_id, workspace_id], (findWorkspaceError, findWorkspaceRes) => {
            if(findWorkspaceError) {
                res.status(500).json({error: {type: 'server', msg: 'SOMETHING WENT WRONG WITH THE SERVER', err: findWorkspaceError}})
            } else if (findWorkspaceRes.length === 0) {
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
    app.delete('/workspace/delete/:id', auth, userOwnWorkspace, (req, res) => {
        const user_id = req.user;
        const workspace_id = req.params.id;

        const deleteAllWorkspaceTasks = 'DELETE FROM tasks WHERE workspace_id = ?';
        connection.query(deleteAllWorkspaceTasks, workspace_id, (deleteTasksError, deleteTasksRes) => {
            if(deleteTasksError) {
                res.status(500).json({error: {type: 'server', msg: 'SOMETHING WENT WRONG WITH THE SERVER!', err: deleteTasksError}})
            }else {
                const deleteWorkspaceQuery = 'DELETE FROM workspaces WHERE id = ? AND owner_id = ?';
                connection.query(deleteWorkspaceQuery, [workspace_id, user_id], (deleteWorkspaceError, deleteWorkspaceRes) => {
                    if(deleteWorkspaceError) {
                        res.status(500).json({error: {type: 'server', msg: 'SOMETHING WENT WRONG WITH THE SERVER!', err: deleteWorkspaceError}})
                    } else {
                        res.send(workspace_id)
                    }
                });
            }
        })

    });
}
