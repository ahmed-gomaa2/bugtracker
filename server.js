const express = require('express');
const http = require('http');
const bodyParser = require("body-parser");
const cors = require('cors');
const registerRoute = require('./routes/auth/register.route');
const loginRoute = require('./routes/auth/login.route');
const loadRoute = require('./routes/auth/load.user.route');
const logoutRoute = require('./routes/auth/log.user.out.route');

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
const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
    console.log('Application is listening to port: ' + PORT);
});
