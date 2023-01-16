const connection = require('../../config/database');
const auth = require('../../middlewares/auth.middleware');

const userOwnTask = (req, res, next) => {
    try{
        const data = req.body;
        const user = req.user;
        if(data.type >= 1 && data.type <=3) {
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
        }else {
            res.status(400).json({error: {type: 'client', msg: 'THIS VALUE IS NOT SUPPORTED!'}})
        }
    }catch (e) {
        res.status(500).json({error: {type: 'client', msg: 'YOU DON\'T HAVE ACCESS TO THIS TASK!', err: e}})
    }
}

const taskExists = (req, res, next) => {
    try{
        const data = req.body;
        const user = req.user;
        const findTaskInWorkspace = 'SELECT * FROM tasks WHERE id = ?';
        connection.query(findTaskInWorkspace, data.id, (findTaskRes, findTaskError) => {
            if(findTaskError) {
                res.status(500).json({error: {type: 'server', msg: 'SOMETHING WENT WRONG WITH THE SERVER!', err: findTaskError}})
            }else if(findTaskRes.length === 0) {
                res.status(400).json({error: {type: 'client', msg: 'THIS TASK DOESN\'T EXIST!'}})
            }else {
                next();
            }
        })
    }catch (e) {
        res.status(500).json({error: {type: 'client', msg: 'SOMETHING WENT WRONG WITH THE SERVER!', err: e}})
    }
}

module.exports = app => {
    app.put('/workspace/edit-type', auth, userOwnTask, (req, res) => {
        const user = req.user;
        const data = req.body;

        const editTypeQuery = 'UPDATE tasks SET type = ? WHERE id = ?';
        connection.query(editTypeQuery, [data.type, data.id], (editTypeError, editTypeRes) => {
            if(editTypeError) {
                res.status(500).json({error: {type: 'server', msg: 'SOMETHING WENT WRONG WITH THE SERVER!', err: editTypeError}})
            }else {
                res.status(200).send(data);
            }
        })
    });
}