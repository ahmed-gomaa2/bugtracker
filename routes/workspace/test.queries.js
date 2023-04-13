const connection = require('../../config/database');
const auth = require('../../middlewares/auth.middleware');
const {query} = require("express");

const userHasAccess = (req, res, next) => {
    const data = req.body;
    const user = req.user;
    console.log(user)
    const userHasAccessQuery = 'SELECT * FROM task_user WHERE user_id = ? AND task_id = ?';
    connection.query(userHasAccessQuery, [user, 1], (userHasAccessError, userHasAccessRes) => {
        if(userHasAccessError) {
            res.status(500).json({error: {type: 'server', msg: 'SOMETHING WENT WRONG WITH THE SERVER!'}, err: userHasAccessError})
        }else if(userHasAccessRes.length === 0) {
            res.status(400).json({error: {type: 'client', msg: 'YOU DON\'T HAVE ACCESS TO THIS TASK!'}})
        }else {
            next();
        }
    });
}


module.exports = (app) => {
    app.get('/test/task', auth, userHasAccess, (req, res) => {
        const data = req.body;
        const getTaskQuery = "SELECT tasks.id, task_user.user_id from tasks inner join task_user on task_user.task_id = tasks.id where task_user.user_id = 2 and task_user.task_id is not null";

        connection.query(getTaskQuery, (queryError, queryRes) => {
            if(queryError) {
                res.status(500).send(queryError);
            }else {
                queryRes.sort((a, b) => a.id - b.id);
                queryRes.map((t, i) => {
                    queryRes[i].engineers = [];
                    const prevId = i - 1;
                    console.log(t.id === queryRes[prevId])
                    if(prevId !== -1 && t.id === queryRes[prevId].id) {
                        queryRes[prevId].engineers.push(t.user_id);
                        queryRes.splice(i, 1);
                    }else {
                        queryRes[i].engineers.push(t.user_id);
                    }
                });
                const tasks =[ ...new Set(queryRes)]
                res.json(tasks);
            }
        })
    })
}