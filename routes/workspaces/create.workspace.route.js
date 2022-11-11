const connection = require('../../config/database');
const auth = require('../../middlewares/auth.middleware');

module.exports = app => {
    app.post('/create-workspace', auth, (req, res) => {
        try{
            const user_id = req.user;
            const workspace = req.body;
            const createWorkSpaceQuery = 'INSERT INTO workspaces (name, description, owner_id) VALUES (?, ?, ?)';
            connection.query(createWorkSpaceQuery, [workspace.name, workspace.description, user_id], (insertWorkspaceError, insertWorkspaceRes) => {
                if(insertWorkspaceError) {
                    res.status(500).json({error: {type: 'server', msg: 'SOMETHING WENT WRONG WITH THE SERVER!', err: insertWorkspaceError}})
                }else {
                    const workspaceData = {
                        id: insertWorkspaceRes.insertId,
                        ...workspace,
                        owner_id: user_id,
                    }
                    res.status(200).json({workspaceData});
                }
            });
        } catch (e) {
            res.status(500).json({error: {type: 'server', msg: 'SOMETHING WENT WRONG WITH THE SERVER!', err: e}})
        }
    });
}
