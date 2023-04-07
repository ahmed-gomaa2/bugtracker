const connection = require('../../config/database');
const auth = require('../../middlewares/auth.middleware');

const userOwnWorkspace = (req, res, next) => {
    try {
        const user_id = req.user;
        const workspace_id = req.params.id;

        const workspaceGetQuery = 'SELECT * FROM workspaces WHERE id = ? AND owner_id = ?';
        connection.query(workspaceGetQuery, [workspace_id, user_id], (findWorkspaceError, findWorkspaceRes) => {
            if(findWorkspaceError) {
                res.status(500).json({error: {type: 'server', msg: 'SOMETHING WENT WRONG WITH THE SERVER!', err: findWorkspaceError}})
            } else if(findWorkspaceRes.length === 0) {
                res.status(400).json({error: 'client', msg: 'YOU DON\'T HAVE ACCESS TO THIS WORKSPACE!'})
            }else {
                next();
            }
        });
    }catch (e) {
        res.status(400).json({error: {type: 'client', msg: 'YOU DON\'T HAVE ACCESS TO THIS WORKSPACE'}})
    }
}

module.exports = app => {
    app.get('/workspace/:id', auth, userOwnWorkspace, (req, res) => {
        const user_id = req.user;
        const workspace_id = req.params.id;
        const getWorkspaceQuery = 'SELECT * FROM workspaces WHERE id = ? AND owner_id =?';
        connection.query(getWorkspaceQuery, [workspace_id, user_id], (findWorkspaceError, findWorkspaceRes) => {
            if(findWorkspaceError) {
                res.status(500).json({error: {type: 'server', msg: 'SOMETHING WENT WRONG WITH THE SERVER!', err: findWorkspaceError}})
            } else {
                const fetchWorkspaceTasksQuery = 'SELECT tasks.id, tasks.title, tasks.description, tasks.type, tasks.status, tasks.solution, tasks.start_date, tasks.end_date, tasks.priority, tasks.workspace_id, workspaces.owner_id FROM tasks INNER JOIN workspaces ON tasks.workspace_id = workspaces.id WHERE tasks.workspace_id = ?';
                connection.query(fetchWorkspaceTasksQuery, findWorkspaceRes[0].id, (fetchWorkspaceTasksError, fetchWorkspaceTasksRes) => {
                    if(findWorkspaceError) {
                        res.status(500).json({error: {type: 'server', msg: 'SOMETHING WENT WRONG WITH THE SERVER!', err: fetchWorkspaceTasksError}})
                    } else if(fetchWorkspaceTasksRes.length === 0) {
                        const workspace = findWorkspaceRes[0];
                        const workspaceData = {
                            workspaceInfo: workspace,
                            workspaceTasks: []
                        }
                        res.status(200).send(workspaceData);
                    }else {
                        const tasks = [];
                        for (let i = 0; i < fetchWorkspaceTasksRes.length; i++) {
                            const fetchTasksEngineersQuery = 'SELECT user.username, user.id, user.email, task_user.task_id FROM user INNER JOIN task_user ON task_user.user_id = user.id WHERE task_id = ?';
                            connection.query(fetchTasksEngineersQuery, fetchWorkspaceTasksRes[i].id, (fetchTasksEngineersError, fetchTasksEngineersRes) => {
                                if(fetchTasksEngineersError) {
                                    res.status(500).json({error: {type: 'server', msg: 'SOMETHING WENT WRONG WITH THE SERVER!', err: fetchTasksEngineersError}})
                                } else if(fetchTasksEngineersRes.length === 0) {
                                    const task = {
                                        ...fetchWorkspaceTasksRes[i],
                                        engineers: [],
                                        owner: true
                                    }
                                    tasks.push(task);
                                    if(i === fetchWorkspaceTasksRes.length - 1) {
                                        const workspace = findWorkspaceRes[0];
                                        const workspaceData = {
                                            workspaceInfo: workspace,
                                            workspaceTasks: tasks
                                        }
                                        res.status(200).send(workspaceData);
                                    }
                                }else {
                                    const task = {
                                        ...fetchWorkspaceTasksRes[i],
                                        engineers: fetchTasksEngineersRes,
                                        owner: true
                                    }
                                    tasks.push(task);
                                    if(i === fetchWorkspaceTasksRes.length - 1) {
                                        const workspace = findWorkspaceRes[0];
                                        const workspaceData = {
                                            workspaceInfo: workspace,
                                            workspaceTasks: tasks.length > 0 ? tasks : []
                                        }
                                        res.status(200).send(workspaceData);
                                    }
                                }
                            });
                        }
                    }
                });
            }
        });
    });
}
