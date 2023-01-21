const connection = require('../../config/database');
const auth = require('../../middlewares/auth.middleware');

const doesUserOwnWorkspace = (req, res, next) => {
    try {
        const user = req.user;
        const {workspace_id, task_id} = req.params;
        const doesUserOwnWorkspaceQuery = 'SELECT id FROM workspaces WHERE id= ? AND owner_id = ?';
        connection.query(doesUserOwnWorkspaceQuery, [workspace_id, user], (doesUserOwnWorkspaceError, doesUserOwnWorkspaceRes) => {
            if(doesUserOwnWorkspaceError) {
                res.status(500).json({error: {type: 'server', msg: 'SOMETHING WENT WRONG WITH THE SERVER!', err: doesUserOwnWorkspaceError}})
            }else if(doesUserOwnWorkspaceRes.length === 0) {
                res.status(400).json({error: {type: 'client', msg: 'YOU DON\'T HAVE A RIGHT TO TAKE THIS ACTION!'}})
            }else {
                const doesTaskExistQuery = 'SELECT id FROM tasks WHERE id = ?';
                connection.query(doesTaskExistQuery, task_id, (doesTaskExistError, doesTaskExistRes) => {
                    if(doesTaskExistError) {
                        res.status(500).json({error: {type: 'server', msg: 'SOMETHING WENT WRONG WITH THE SERVER!', err: doesTaskExistError}})
                    }else if(doesTaskExistRes.length === 0) {
                        res.status(400).json({error: {type: 'client', msg: 'THIS TASK DOES NOT EXIST!'}})
                    }else {
                        next();
                    }
                })
            }
        })
    }catch (e) {
        res.status(500).json({type: {type: 'server', msg: 'SOMETHING WENT WRONG WITH THE SERVER!', err: e}})
    }
}



module.exports = app => {
    app.delete('/workspace/:workspace_id/task/:task_id', auth, doesUserOwnWorkspace, (req, res) => {
        try {
            const {workspace_id, task_id} = req.params;
            const user = req.user;
            const deleteTaskQuery = 'DELETE FROM tasks WHERE id = ? AND workspace_id = ?';
            connection.query(deleteTaskQuery, [task_id, workspace_id], (deleteTaskError, deleteTaskRes) => {
                if(deleteTaskError) {
                    res.status(500).json({error: {type: 'server', msg: 'SOMETHING WENT WRONG WITH THE SERVER!', err: deleteTaskError}})
                }else {
                    const data = {
                        task_id,
                        workspace_id
                    }
                    res.status(200).send(data);
                }
            })
        }catch (e) {
            res.status(500).json({error: {type: 'server', msg: 'SOMETHING WENT WRONG WITH THE SERVER!', err: e}})
        }
    })
}