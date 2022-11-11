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

const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
    console.log('Application is listening to port: ' + PORT);
});
