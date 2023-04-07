const connection = require('../../config/database');
const auth = require('../../middlewares/auth.middleware');

module.exports = app => {
    app.get('/assigned/tasks', auth, (req, res) => {
        const user = req.user;
        const getTasksIdsQuery = 'SELECT * FROM task_user WHERE user_id = ?';
        connection.query(getTasksIdsQuery, user, (getIdsError, getIdsResult) => {
            if(getIdsError) {
                res.status(500).json({error: {type: 'server', msg: 'SOMETHING WENT WRONG WITH THE SERVER!', err: getIdsError}})
            } else if(getIdsResult.length === 0){
                res.status(200).send([]);
            }else {
                console.log(getIdsResult);
                // res.status(200).send(getIdsResult)
                const tasks = [];
                for(let i = 0; i < getIdsResult.length; i++) {
                    const getTaskQuery = 'SELECT tasks.id, tasks.title, tasks.description, tasks.type, tasks.status, tasks.solution, tasks.start_date, tasks.end_date, tasks.priority, tasks.workspace_id, workspaces.owner_id FROM tasks INNER JOIN workspaces ON tasks.workspace_id = workspaces.id WHERE tasks.id = ?';
                    connection.query(getTaskQuery, getIdsResult[i].task_id, (getTaskError, getTaskResult) => {
                        if(getTaskError) {
                            res.status(500).json({error: {type:'server', msg: 'SOMETHING WENT WRONG WITH THE SERVER!', err: getTaskError}})
                        } else if(getTaskResult.length === 0) {
                            if(i === getIdsResult.length - 1) {
                                res.status(200).send(tasks);
                            }else {
                                return i++;
                            }
                        }else {
                            console.log(i);
                            const getEngineersQuery = 'SELECT user.username, user.id, user.email, task_user.task_id FROM user INNER JOIN task_user ON task_user.user_id = user.id WHERE task_id = ?';
                            connection.query(getEngineersQuery, getTaskResult[0].id, (getEngineersError, getEngineersResult) => {
                                if(getEngineersError) {
                                    res.status(500).json({error: {type: 'server', msg: 'SOMETHING WENT WRONG WITH THE SERVER', err: getEngineersError}})
                                } else if(getEngineersResult.length === 0){
                                    const task = {
                                        ...getTaskResult[0],
                                        owner: false,
                                        engineers: []
                                    }
                                    tasks.push(task);
                                    if(i === getIdsResult.length - 1) {
                                        res.status(200).send(tasks);
                                    }
                                } else {
                                    const task = {
                                       ...getTaskResult[0],
                                        owner: false,
                                        engineers: getEngineersResult
                                    }
                                    tasks.push(task);
                                    if(i === getIdsResult.length - 1) {
                                        res.status(200).send(tasks);
                                    }
                                }
                            })
                        }
                    })
                }
            }
        })
    })
}