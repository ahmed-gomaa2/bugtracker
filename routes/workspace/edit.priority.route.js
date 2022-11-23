const connection = require('../../config/database');
const auth = require('../../middlewares/auth.middleware');

const userOwnTask = (req, res, next) => {
    try{
        const data = req.body;
        const user = req.user;
        const findWorkspaceOwner = 'SELECT * FROM workspaces WHERE owner_id = ? AND id = ?';
        connection.query(findWorkspaceOwner, [user, data.workspace_id], (findOwnerError, findOwnerRes) => {
            if(findOwnerError) {
                res.status(500).json({error: {type: 'server', msg: 'SOMETHING WENT WRONG WITH THE SERVER!', err: findOwnerError}})
            } else if(findOwnerRes.length === 0) {
                res.status(400).json({error: {type: 'client', msg: 'YOU ARE NOT ALLOWED TO EDIT THIS TASK!'}})
            }else {
                next();
            }
        });
    }catch (e) {
        res.status(500).json({error: {type: 'client', msg: 'YOU DON\'T HAVE ACCESS TO THIS TASK!', err: e}})
    }
}

const taskExists = (req, res, next) => {
    try {
        const data = req.body;
        const user = req.user;
        const findTaskQuery = 'SELECT * FROM tasks WHERE id = ?';
        connection.query(findTaskQuery, data.id, (findTaskError, findTaskRes) => {
            if (findTaskError) {
                res.status(500).json({
                    error: {
                        type: 'server',
                        msg: 'SOMETHING WENT WRONG WITH THE SERVER!',
                        err: findTaskError
                    }
                })
            } else if (findTaskRes.length === 0) {
                res.status(400).json({error: {type: 'client', msg: 'THIS TASK DOESN\'T EXIST!'}})
            } else {
                next();
            }
        });
    } catch (e) {
        res.status(500).json({error: {type: 'server', msg: 'SOMETHING WENT WRONG WITH THE SERVER!', err: e}})
    }
}


module.exports = app => {
    app.put('/workspace/edit-priority', auth, userOwnTask, taskExists, (req, res) => {
        try{
            const data = req.body;
            const user = req.user;
            const editPriorityQuery = 'UPDATE tasks SET priority = ? WHERE id = ?';
            connection.query(editPriorityQuery, [data.priority, data.id], (editPriorityError, editPriorityRes) => {
                if(editPriorityError) {
                    res.status(500).json({error: {type: 'server', msg: 'SOMETHING WENT WRONG WITH THE SERVER!', err: editPriorityError}})
                } else {
                    res.status(200).send(data);
                }
            });
        }catch (e) {
            res.status(500).json({error: {type: 'server', msg: 'SOMETHING WENT WRONG WITH THE SERVER!', err: e}})
        }
    });
}