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