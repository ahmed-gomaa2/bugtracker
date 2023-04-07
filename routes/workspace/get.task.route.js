const connection = require('../../config/database');
const auth = require('../../middlewares/auth.middleware');

const userOwnThisTask = (req, res, next) => {
    try {
        const user = req.user;
        const {task_id, workspace_id} = req.params;
        const taskExistsInWorkspaceQuery = 'SELECT * FROM tasks WHERE id = ? AND workspace_id = ?';
        connection.query(taskExistsInWorkspaceQuery, [task_id, workspace_id], (findTaskError, findTaskRes) => {
            if(findTaskError) {
                res.status(500).json({error: {type: 'server', msg: 'SOMETHING WENT WRONG WITH THE SERVER!', err: findTaskError}});
            }else if(findTaskRes.length === 0) {
                res.status(400).json({error: {type: 'client', msg: 'THIS TASK DOES NOT EXIST IN THIS WORKSPACE!'}});
            }else {
                const userOwnTheTask = 'SELECT * FROM workspaces WHERE id = ? AND owner_id = ?';
                connection.query(userOwnTheTask, [workspace_id, user], (findWorkspaceError, findWorkspaceRes) => {
                    if(findWorkspaceError) {
                        res.status(500).json({error: {type: 'server', msg: 'SOMETHING WENT WRONG WITH THE SERVER!', err: findWorkspaceError}});
                    }else if(findWorkspaceRes.length === 0) {
                        const isUserEngineer = 'SELECT * FROM task_user WHERE task_id = ? AND user_id =?';
                        connection.query(isUserEngineer, [task_id, user], (findTaskUserError, findTaskUserRes) => {
                            if(findTaskUserError) {
                                res.status(500).json({error: {type: 'server', msg: 'SOMETHING WENT WRONG WITH THE SERVER!', err: findTaskUserError}});
                            }else if(findTaskUserRes.length === 0) {
                                res.status(400).json({error: {type: 'client', msg: 'YOU DON\'T HAVE ACCESS TO THIS TASK!'}});
                            }else {
                                req.isOwner = false;
                                next();
                            }
                        })
                    }else {
                        req.isOwner = true;
                        next();
                    }
                })
            }
        })
    }catch (e) {
        res.status(500).json({error: {type: 'server', msg: 'SOMETHING WENT WRONG WITH THE SERVER!', err: e}})
    }
}

module.exports = app => {
    app.get('/workspace/:workspace_id/task/:task_id', auth, userOwnThisTask, (req, res) => {
        try{
            const {task_id, workspace_id} = req.params;
            const user = req.user;
            const getTaskQuery = 'SELECT * FROM tasks WHERE id = ?';
            connection.query(getTaskQuery, task_id, (getTaskError, getTaskRes) => {
                if(getTaskError) {
                    res.status(500).json({error: {type: 'server', msg: 'SOMETHING WENT WRONG WITH THE SERVER!', err: getTaskError}})
                }else {
                    const task = {
                        ...getTaskRes[0],
                        isOwner: req.isOwner
                    }
                    res.status(200).send(task);
                }
            })
        } catch (e) {
            res.status(500).json({error: {type: 'server', msg: 'SOMETHING WENT WRONG WITH THE SERVER!', err: e}})
        }
    });
}