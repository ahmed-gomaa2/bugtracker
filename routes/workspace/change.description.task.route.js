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
                res.status(400).json({error: {type: 'client', msg: 'YOU ARE NOT ALLOWED TO '}})
            }else {
                const userOwnTaskQuery = 'SELECT * FROM tasks WHERE id = ? AND workspace_id = ? '
                connection.query(userOwnTaskQuery, [data.id, data.workspace_id], (userOwnTaskError, userOwnTaskRes) => {
                    if(userOwnTaskError) {
                        res.status(500).json({error: {type: 'server', msg: 'OMETHING WENT WRONG WITH THE SERVER!', err: userOwnTaskError}})
                    }else if(userOwnTaskRes.length === 0) {
                        res.status(400).json({error: {type: 'client', msg: 'YOU DON\'T HAVE ACCESS TO THIS TASK'}})
                    }else {
                        next();
                    }
                })
            }
        });
    }catch (e) {
        res.status(500).json({error: {type: 'client', msg: 'YOU DON\'T HAVE ACCESS TO THIS TASK!', err: e}})
    }
}

module.exports = app => {
    app.put('/workspace/edit-description', auth, userOwnTask, (req, res) => {
        const data = req.body;
        const user_id = req.user;
        const changeTitleQuery = 'UPDATE tasks SET description = ? WHERE id = ?';
        connection.query(changeTitleQuery, [data.description, data.id], (changeTitleError, changeTitleRes) => {
            if(changeTitleError) {
                res.status(500).json({error: {type: 'server', msg: 'SOMETHING WENT WRONG WITH THE SERVER!', err: changeTitleError}})
            }else {
                res.status(200).send(data);
            }
        })
    });
}
