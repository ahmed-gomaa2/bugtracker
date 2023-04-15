const connection = require('../../config/database');
const auth = require('../../middlewares/auth.middleware');

module.exports = app => {
    app.get('/assigned/tasks', auth, (req, res) => {
        const user = req.user;
        const getTasksIdsQuery = 'SELECT tasks.id, tasks.title, tasks.description, tasks.type, tasks.status, tasks.solution, tasks.start_date, tasks.end_date, tasks.priority, tasks.workspace_id, workspaces.owner_id FROM task_user inner join tasks on tasks.id = task_user.task_id INNER JOIN workspaces ON workspaces.id = tasks.workspace_id WHERE user_id = ? ORDER BY tasks.id ASC';
        connection.query(getTasksIdsQuery, user, (getIdsError, getIdsResult) => {
            if(getIdsError) {
                res.status(500).json({error: {type: 'server', msg: 'SOMETHING WENT WRONG WITH THE SERVER!', err: getIdsError}})
            } else if(getIdsResult.length === 0){
                res.status(200).send([]);
            }else {
                // res.status(200).send(getIdsResult)
                const tasks = [];
                for(let i = 0; i < getIdsResult.length; i++) {
                    const getEngineersQuery = 'SELECT user.username, user.id, user.email, task_user.task_id FROM user INNER JOIN task_user ON task_user.user_id = user.id WHERE task_id = ?';
                    connection.query(getEngineersQuery, getIdsResult[i].id, (getEngineersError, getEngineersResult) => {
                        if(getEngineersError) {
                            res.status(500).json({error: {type: 'server', msg: 'SOMETHING WENT WRONG WITH THE SERVER', err: getEngineersError}})
                        } else if(getEngineersResult.length === 0){
                            const task = {
                                ...getIdsResult[i],
                                owner: false,
                                engineers: []
                            }
                            tasks.push(task);
                            if(i === getIdsResult.length - 1) {
                                res.status(200).send(tasks);
                            }
                        } else {
                            const task = {
                                ...getIdsResult[i],
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
            }
        })
    })
}