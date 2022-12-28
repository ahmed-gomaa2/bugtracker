const express = require('express');
const http = require('http');
const bodyParser = require("body-parser");
const cors = require('cors');
const registerRoute = require('./routes/auth/register.route');
const loginRoute = require('./routes/auth/login.route');
const loadRoute = require('./routes/auth/load.user.route');
const logoutRoute = require('./routes/auth/log.user.out.route');
const createWorkspaceRoute = require('./routes/workspaces/create.workspace.route');
const editWorkspaceRoute = require('./routes/workspaces/edit.workspace.route');
const getWorkspaceRoute = require('./routes/workspaces/get.workspace.route');
const deleteWorkspaceRoute = require('./routes/workspaces/delete.workspace.route');
const fetchWorkspacesRoute = require('./routes/workspaces/get.workspaces.route');
const sendCodeRoute = require('./routes/auth/send.code.route');
const resetPasswordRoute = require('./routes/auth/reset.password.route');
const createTaskRoute = require('./routes/workspace/create.task.route');
const editTitleRoute = require('./routes/workspace/change.title.task.route');
const editDescriptionRoute = require('./routes/workspace/change.description.task.route');
const fetchUsersRoute = require('./routes/auth/get.users.route');
const editTaskType = require('./routes/workspace/change.type.route');
const editTaskStatus = require('./routes/workspace/change.status.route');
const editTaskSolutionRoute = require('./routes/workspace/change.solution.route');
const editTaskEndDateRoute = require('./routes/workspace/change.end.date.route');
const addEngineerRoute = require('./routes/workspace/add.engineer.route');
const deleteEngineerRoute = require('./routes/workspace/remove.engineer.route');
const editPriorityRoute = require('./routes/workspace/edit.priority.route');
const getAllUsersRoute = require('./routes/auth/get.all.users.route');

const app = express();
const server = http.createServer(app);

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'UPDATE', 'PUT']
}));

app.get('/', (req, res) => {
    res.send('Hello from the application!');
});

registerRoute(app);
loginRoute(app);
loadRoute(app);
logoutRoute(app);
createWorkspaceRoute(app);
editWorkspaceRoute(app);
getWorkspaceRoute(app);
deleteWorkspaceRoute(app);
fetchWorkspacesRoute(app);
sendCodeRoute(app);
resetPasswordRoute(app);
createTaskRoute(app);
editTitleRoute(app);
editDescriptionRoute(app);
fetchUsersRoute(app);
editTaskType(app);
editTaskStatus(app);
editTaskSolutionRoute(app);
editTaskEndDateRoute(app);
addEngineerRoute(app);
deleteEngineerRoute(app);
editPriorityRoute(app);
getAllUsersRoute(app);

const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
    console.log('Application is listening to port: ' + PORT);
});
