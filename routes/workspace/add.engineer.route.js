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

const userAlreadyExists = (req, res, next) => {
    try{
        const data = req.body;
        const user = req.user;
        const doesUserExistsQuery = 'SELECT * FROM task_user WHERE task_id = ? AND user_id = ?';
        connection.query(doesUserExistsQuery, [data.task_id, data.user_id], (findUserError, findUserRes) => {
            if(findUserError) {
                res.status(500).json({error: {type: 'server', msg: 'SOMETHING WENT WRONG WITH THE SERVER!', err: findUserError}})
            }else if(findUserRes.length > 0) {
                res.status(400).json({error: {type: 'user', msg: 'THIS USER DOES ALREADY EXIST!'}})
            }else {
                next();
            }
        });
    }catch (e) {
        res.status(500).json({error: {type: 'server', msg: 'SOMETHING WENT WRONG WITH THE SERVER!', err: e}})
    }
}

const taskExists = (req, res, next) => {
    try{
        const data = req.body;
        const user = req.user;
        const findTaskQuery = 'SELECT * FROM tasks WHERE id = ?';
        connection.query(findTaskQuery, data.task_id, (findTaskError, findTaskRes) => {
            if(findTaskError) {
                res.status(500).json({error: {type: 'server', msg: 'SOMETHING WENT WRONG WITH THE SERVER!', err: findTaskError}})
            } else if(findTaskRes.length === 0) {
                res.status(400).json({error: {type: 'client', msg: 'THIS TASK DOESN\'T EXIST!'}})
            }else {
                next();
            }
        });
    }catch (e) {
        res.status(500).json({error: {type: 'server', msg: 'SOMETHING WENT WRONG WITH THE SERVER!', err: e}})
    }
}

module.exports = app => {
    app.put('/workspace/add-engineer', auth, userOwnTask, userAlreadyExists, taskExists, (req, res) => {
         const data = req.body;
         const user = req.user;
         const addEngineerQuery = 'INSERT INTO task_user (task_id, user_id) VALUES (?, ?)';
         connection.query(addEngineerQuery, [data.task_id, data.user_id], (insertEngineerError, insertEngineerRes) => {
             if(insertEngineerError) {
                 res.status(500).json({error: {type: 'server', msg: 'SOMETHING WENT WRONG WITH THE SERVER!', err: insertEngineerError}})
             }else {
                 const userData = {
                     ...data,
                     task_id: data.task_id
                 }
                 res.status(200).send(userData);
             }
         });
    });
}
