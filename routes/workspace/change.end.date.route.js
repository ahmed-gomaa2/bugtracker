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
    app.put('/workspace/edit-end-date', auth, userOwnTask, (req, res) => {
        try {
            const user = req.user;
            const data = req.body;

            const updateEndDateQuery = 'UPDATE tasks SET end_date = ? WHERE id = ?';
            connection.query(updateEndDateQuery, [new Date(data.end_date), data.id], (updateEndDateError, updateEndDateRes) => {
                if(updateEndDateError) {
                    res.status(500).json({error: {type: 'server', msg: 'SOMETHING WENT WRONG WITH THE SERVER!', err: updateEndDateError}})
                }else {
                    res.status(200).send(data);
                }
            });
        } catch (e) {
            res.status(500).json({error: {type: 'server', msg:'SOMETHING WENT WRONG WITH THE SERVER!', err: e}})
        }
    });
}

