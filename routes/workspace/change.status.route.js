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
                const isUserEngineerQuery = 'SELECT * FROM task_user WHERE task_id = ? AND user_id = ?';
                connection.query(isUserEngineerQuery, [data.id, user], (isUserEngineerError, isUserEngineerRes) => {
                    if(isUserEngineerError) {
                        res.status(500).json({error: {type: 'server', msg: 'SOMETHING WENT WRONG WITH THE SERVER!', err: isUserEngineerError}})
                    } else if(isUserEngineerRes.length === 0) {
                        res.status(400).json({error: {type: 'client', msg: 'YOU DON\'T HAVE ACCESS TO THIS TASK!'}})
                    }else {
                        next();
                    }
                });
            }else {
                next();
            }
        });
    }catch (e) {
        res.status(500).json({error: {type: 'client', msg: 'YOU DON\'T HAVE ACCESS TO THIS TASK!', err: e}})
    }
}

module.exports = app => {
    app.put('/workspace/edit-status', auth, userOwnTask, (req, res) => {
        try {
            const user = req.user;
            const data = req.body;
            const editStatusQuery = 'UPDATE tasks SET status = ? WHERE id = ?';
            connection.query(editStatusQuery, [data.status, data.id], (editStatusError, editStatusRes) => {
                if(editStatusError) {
                    res.status(500).json({error: {type: 'server', msg: 'SOMETHING WENT WRONG WITH THE SERVER!', err: editStatusError}})
                } else {
                    res.status(200).send(data);
                }
            });
        } catch (e) {
            res.status(500).json({error: {type: 'server', msg: 'SOMETHING WENT WRONG WITH THE SERVER', err: e}})
        }
    });
}