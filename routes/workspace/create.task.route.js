const connection = require('../../config/database');
const auth = require('../../middlewares/auth.middleware');

const userOwnWorkspace = (req, res, next) => {
    try {
        const data = req.body;
        const userId = req.user;
        console.log(data, userId);

        const findWorkspaceQuery = 'SELECT * FROM workspaces WHERE owner_id = ?  AND id = ?';

        connection.query(findWorkspaceQuery, [userId, data.workspace_id], (findWorkspaceError, findWorkspaceRes) => {
            if(findWorkspaceError) {
                res.status(500).json({error: {type: 'server', msg: 'SOMETHING WENT WRONG WITH THE SERVER', err: findWorkspaceError}})
            } else if(findWorkspaceRes.length === 0) {
                res.status(400).json( {error: {type: 'client', msg: 'YOU DON\'T HAVE ACCESS TO THIS WORKSPACE!'}})
            }else {
                next();
            }
        });
    }catch (e) {
        res.status(400).json({error: {type: 'client', msg: 'YOU DON\'T HAVE ACCESS TO THIS WORKSPACE!', err: e}})
    }
}

module.exports = app => {
    app.post('/workspace/create-task', auth, userOwnWorkspace, (req, res) => {
        try {
            const data = req.body;
            const user_id = req.user;
            const createTaskQuery = 'INSERT INTO tasks (title, description, type, status, solution, end_date, priority, workspace_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
            console.log(user_id)
            connection.query(createTaskQuery, [data.title, data.description, data.type, data.status, data.solution, new Date(data.end_date), data.priority, data.workspace_id], (insertTaskError, insertTaskRes) => {
                if(insertTaskError) return res.status(500).json({error: {type: 'server', msg: 'SOMETHING WENT WRONG WITH THE SERVER!', err: insertTaskError}});
                const engineers = [];
                for(let i = 0; i < data.engineers.length; i++) {
                    const insertEngineersQuery = 'INSERT INTO task_user (task_id, user_id) VALUES (?, ?)';
                    connection.query(insertEngineersQuery, [insertTaskRes.insertId, data.engineers[i].id], (insertEngineerError, insertEngineerRes) => {
                         if(insertTaskError) {
                             res.status(500).json({error: {type: 'server', msg: 'SOMETHING WENT WRONG WITH THE SERVER!', err: insertEngineerError}})
                         }else {
                             const getCurrentEngineerDataQuery = "SELECT username, id, email FROM user WHERE id = ?";
                             connection.query(getCurrentEngineerDataQuery, [data.engineers[i].id], (getDataError, getDataRes) => {
                                 if(getDataError) {
                                    res.status(500).json({error: {type: 'server', msg: 'SOMETHING WENT WRONG WITH THE SERVER!', err: getDataError}})
                                 }else {
                                     const currentEngineer = {
                                         ...getDataRes[0]
                                     };

                                     engineers.push(currentEngineer);
                                     if(i === data.engineers.length - 1) {
                                         const task = {
                                             id: insertTaskRes.insertId,
                                             ...data,
                                             engineers: engineers,
                                             owner: true
                                         };
                                         console.log('is this the problem')
                                         res.status(200).send(task);
                                     }
                                 }
                             })
                         }
                    });
                }

            });
        }catch (e) {
            res.status(500).json({error: {type: 'server', msg: 'SOMETHING WENT WRONG WITH THE SERVER!', err: e}})
        }
    });
}
