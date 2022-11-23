const connection = require('../../config/database');
const auth = require('../../middlewares/auth.middleware');

const userOwnTask = (req, res, next) => {
    try{
        const data = req.body;
        const user = req.user;
        console.log(data, user);

        const findWorkspaceOwner = 'SELECT * FROM task_user WHERE task_id = ? AND user_id = ?';
        connection.query(findWorkspaceOwner, [data.id, user], (findOwnerError, findOwnerRes) => {
            if(findOwnerError) {
                res.status(500).json({error: {type: 'server', msg: 'SOMETHING WENT WRONG WITH THE SERVER!', err: findOwnerError}})
            } else if(findOwnerRes.length === 0) {
                res.status(500).json({error: {type: 'client', msg: 'YOU DON\'T HAVE ACCESS TO THIS TASK!'}})
            }else {
                next();
            }
        });
    }catch (e) {
        res.status(500).json({error: {type: 'client', msg: 'YOU DON\'T HAVE ACCESS TO THIS TASK!', err: e}})
    }
}

module.exports = app => {
    app.put('/workspace/edit-solution', auth, userOwnTask, (req, res) => {
        try {
            const user = req.user;
            const data = req.body;
            const editSolutionQuery = 'UPDATE tasks SET solution = ? WHERE id = ?';
            connection.query(editSolutionQuery, [data.solution, data.id], (editSolutionError, editSolutionRes) => {
                if(editSolutionError) {
                    res.status(500).json({error: {type: 'server', msg: 'SOMETHING WENT WRONG WITH THE SERVER!', err: editDescriptionError}})
                } else {
                    res.status(200).send(data);
                }
            });
        } catch (e) {
            res.status(500).json({error: {type: 'server', msg: 'SOMETHING WENT WRONG WITH THE SERVER', err: e}})
        }
    });
}